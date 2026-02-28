import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDevice } from "@/lib/device";
import { sha256 } from "@/lib/hash";
import { toDeepLinkCandidate } from "@/lib/youtube";
import { toHttpsUrlString } from "@/lib/url";

function mobileJumpPage(deepLink: string, fallback: string): string {
  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Yönlendiriliyorsunuz</title>
</head>
<body>
  <p>Uygulama açılıyor. Açılmazsa web sürümüne yönlendirileceksiniz.</p>
  <script>
    const deepLink = ${JSON.stringify(deepLink)};
    const fallback = ${JSON.stringify(fallback)};
    const started = Date.now();
    window.location.href = deepLink;
    setTimeout(() => {
      if (Date.now() - started < 1700) {
        window.location.href = fallback;
      }
    }, 1100);
  </script>
</body>
</html>`;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link || !link.isActive) {
    return new NextResponse("Link bulunamadı.", { status: 404 });
  }

  const userAgent = request.headers.get("user-agent") || "";
  const device = parseDevice(userAgent);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  await prisma.clickEvent.create({
    data: {
      linkId: link.id,
      country: request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null,
      city: request.headers.get("x-vercel-ip-city") || null,
      referrer: request.headers.get("referer") || null,
      userAgent,
      ipHash: sha256(ip)
    }
  });

  if (link.interstitialEnabled && !request.nextUrl.searchParams.get("from")?.includes("go")) {
    const goUrl = new URL(`/go/${slug}`, request.nextUrl.origin);
    return NextResponse.redirect(goUrl, 307);
  }

  const safeResolvedUrl = toHttpsUrlString(link.resolvedUrl);

  if (device.deviceType !== "desktop") {
    const deepLink = toDeepLinkCandidate(new URL(safeResolvedUrl));
    if (deepLink) {
      return new NextResponse(mobileJumpPage(deepLink, safeResolvedUrl), {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store"
        }
      });
    }
  }

  return NextResponse.redirect(safeResolvedUrl, {
    status: 307,
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=60"
    }
  });
}
