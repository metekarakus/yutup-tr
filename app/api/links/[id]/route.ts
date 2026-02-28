import { NextRequest, NextResponse } from "next/server";
import { LinkType } from "@prisma/client";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateTargetUrl } from "@/lib/url";
import { resolveFinalYoutubeUrl } from "@/lib/youtube";
import { toPlainText } from "@/lib/sanitize";

const updateSchema = z.object({
  originalUrl: z.string().optional(),
  type: z.nativeEnum(LinkType).optional(),
  interstitialEnabled: z.boolean().optional(),
  interstitialMessage: z.string().max(240).nullable().optional(),
  isActive: z.boolean().optional()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const { id } = await params;
  const current = await prisma.link.findUnique({ where: { id } });
  if (!current || current.ownerUserId !== session.user.id) {
    return NextResponse.json({ error: "Link bulunamadı." }, { status: 404 });
  }

  try {
    const payload = updateSchema.parse(await request.json());
    const nextType = payload.type ?? current.type;
    const nextUrl = payload.originalUrl ? validateTargetUrl(payload.originalUrl) : new URL(current.originalUrl);
    const resolvedUrl = resolveFinalYoutubeUrl(nextUrl, nextType);

    const updated = await prisma.link.update({
      where: { id },
      data: {
        originalUrl: nextUrl.toString(),
        resolvedUrl,
        type: nextType,
        interstitialEnabled: payload.interstitialEnabled ?? current.interstitialEnabled,
        interstitialMessage:
          payload.interstitialEnabled === false
            ? null
            : payload.interstitialMessage !== undefined
              ? payload.interstitialMessage === null ? null : toPlainText(payload.interstitialMessage)
              : current.interstitialMessage,
        isActive: payload.isActive ?? current.isActive
      }
    });

    return NextResponse.json({
      id: updated.id,
      slug: updated.slug,
      resolvedUrl: updated.resolvedUrl,
      isActive: updated.isActive
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Güncelleme başarısız." }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const { id } = await params;
  const current = await prisma.link.findUnique({ where: { id } });
  if (!current || current.ownerUserId !== session.user.id) {
    return NextResponse.json({ error: "Link bulunamadı." }, { status: 404 });
  }

  await prisma.link.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
