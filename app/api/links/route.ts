import { NextRequest, NextResponse } from "next/server";
import { LinkType } from "@prisma/client";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug, normalizeSlug } from "@/lib/slug";
import { SLUG_PATTERN, RESERVED_SLUGS } from "@/lib/constants";
import { getGuestLimitInfo } from "@/lib/limits";
import { resolveFinalYoutubeUrl } from "@/lib/youtube";
import { normalizeBaseUrl, validateTargetUrl } from "@/lib/url";
import { toPlainText } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";

const createSchema = z.object({
  originalUrl: z.string().min(1),
  type: z.nativeEnum(LinkType).optional(),
  customSlug: z.string().optional(),
  interstitialEnabled: z.boolean().optional(),
  interstitialMessage: z.string().max(240).optional()
});

async function pickSlug(customSlug?: string): Promise<{ slug: string; normalized: boolean; customSlugUsed: boolean }> {
  if (customSlug && customSlug.trim().length > 0) {
    const normalized = normalizeSlug(customSlug);

    if (normalized.length < 3 || normalized.length > 40 || !SLUG_PATTERN.test(normalized)) {
      throw new Error("Slug formatı geçersiz. Yalnızca harf, rakam ve tire kullanabilirsiniz.");
    }

    if (RESERVED_SLUGS.has(normalized)) {
      throw new Error("Bu kısa adres rezerve edildi.");
    }

    const exists = await prisma.link.findUnique({ where: { slug: normalized }, select: { id: true } });
    if (exists) {
      throw new Error("Bu kısa adres kullanımda.");
    }

    return { slug: normalized, normalized: normalized !== customSlug, customSlugUsed: true };
  }

  for (let i = 0; i < 8; i += 1) {
    const generated = generateSlug(7);
    if (RESERVED_SLUGS.has(generated)) continue;
    const exists = await prisma.link.findUnique({ where: { slug: generated }, select: { id: true } });
    if (!exists) {
      return { slug: generated, normalized: false, customSlugUsed: false };
    }
  }

  throw new Error("Kısa bağlantı oluşturulamadı. Lütfen tekrar deneyin.");
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rate = checkRateLimit(`create:${ip}`, 30, 60_000);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyin." },
        { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
      );
    }

    const session = await getAuthSession();
    const parsed = createSchema.parse(await request.json());

    const requestedType = parsed.type ?? LinkType.SHORTEN;
    const inputUrl = validateTargetUrl(parsed.originalUrl);

    if (!session?.user?.id && requestedType !== LinkType.SHORTEN) {
      return NextResponse.json({ error: "Misafir kullanıcılar yalnızca YouTube URL kısaltabilir." }, { status: 403 });
    }

    if (!session?.user?.id && (parsed.customSlug || parsed.interstitialEnabled || parsed.interstitialMessage)) {
      return NextResponse.json({ error: "Bu özellik için giriş yapmanız gerekiyor." }, { status: 403 });
    }

    let ownerUserId: string | null = session?.user?.id ?? null;
    let guestTokenHash: string | null = null;
    let creatorIpHash: string | null = null;

    if (!ownerUserId) {
      const guestLimit = await getGuestLimitInfo();
      guestTokenHash = guestLimit.guestTokenHash;
      creatorIpHash = guestLimit.creatorIpHash;

      if (guestLimit.info.blocked) {
        return NextResponse.json(
          {
            error: "Limit doldu. Sınırsız link için Google ile giriş yapın.",
            guestLimit: guestLimit.info
          },
          { status: 403 }
        );
      }
    }

    const linkType = requestedType;
    const resolvedUrl = resolveFinalYoutubeUrl(inputUrl, linkType);

    const slugSelection = await pickSlug(parsed.customSlug);

    if (ownerUserId) {
      const dbUser = await prisma.user.findUnique({ where: { id: ownerUserId }, select: { customSlugQuotaUsed: true } });
      if (!dbUser) {
        return NextResponse.json({ error: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapın." }, { status: 401 });
      }

      if (slugSelection.customSlugUsed && dbUser.customSlugQuotaUsed >= 5) {
        return NextResponse.json(
          { error: "Özelleştirme hakkınız doldu. Otomatik kısa adres kullanabilirsiniz." },
          { status: 403 }
        );
      }

      await prisma.$transaction(async (tx) => {
        await tx.link.create({
          data: {
            ownerUserId,
            guestTokenHash,
            creatorIpHash,
            slug: slugSelection.slug,
            originalUrl: inputUrl.toString(),
            resolvedUrl,
            type: linkType,
            interstitialEnabled: parsed.interstitialEnabled ?? false,
            interstitialMessage: parsed.interstitialEnabled ? toPlainText(parsed.interstitialMessage || "") || null : null,
            customSlugUsed: slugSelection.customSlugUsed,
            isActive: true
          }
        });

        if (slugSelection.customSlugUsed) {
          await tx.user.update({
            where: { id: ownerUserId },
            data: { customSlugQuotaUsed: { increment: 1 } }
          });
        }
      });
    } else {
      await prisma.link.create({
        data: {
          ownerUserId,
          guestTokenHash,
          creatorIpHash,
          slug: slugSelection.slug,
          originalUrl: inputUrl.toString(),
          resolvedUrl,
          type: LinkType.SHORTEN,
          interstitialEnabled: false,
          interstitialMessage: null,
          customSlugUsed: false,
          isActive: true
        }
      });
    }

    const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? request.nextUrl.origin);
    const refreshedGuestInfo = !ownerUserId ? (await getGuestLimitInfo()).info : undefined;

    return NextResponse.json({
      slug: slugSelection.slug,
      shortUrl: `${baseUrl}/r/${slugSelection.slug}`,
      resolvedUrl,
      type: linkType,
      slugNormalized: slugSelection.normalized,
      guestLimit: refreshedGuestInfo,
      message:
        slugSelection.normalized
          ? "Kısa adresiniz uygun formata dönüştürüldü."
          : undefined
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz giriş verisi." }, { status: 400 });
    }

    return NextResponse.json({ error: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu." }, { status: 400 });
  }
}

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { customSlugQuotaUsed: true }
  });

  const links = await prisma.link.findMany({
    where: { ownerUserId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { clickEvents: true }
      }
    }
  });

  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");

  return NextResponse.json({
    customSlugQuotaUsed: user?.customSlugQuotaUsed ?? 0,
    customSlugQuotaLimit: 5,
    links: links.map((link) => ({
      id: link.id,
      slug: link.slug,
      shortUrl: `${baseUrl}/r/${link.slug}`,
      originalUrl: link.originalUrl,
      resolvedUrl: link.resolvedUrl,
      type: link.type,
      interstitialEnabled: link.interstitialEnabled,
      interstitialMessage: link.interstitialMessage,
      isActive: link.isActive,
      createdAt: link.createdAt,
      clicks: link._count.clickEvents
    }))
  });
}
