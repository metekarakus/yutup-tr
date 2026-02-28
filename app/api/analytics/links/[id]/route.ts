import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function parseRange(value: string | null): number {
  if (value === "30") return 30;
  return 7;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Bu işlem için giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const { id } = await params;
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link || link.ownerUserId !== session.user.id) {
    return NextResponse.json({ error: "Link bulunamadı." }, { status: 404 });
  }

  const days = parseRange(request.nextUrl.searchParams.get("days"));
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const events = await prisma.clickEvent.findMany({
    where: { linkId: id, clickedAt: { gte: startDate } },
    orderBy: { clickedAt: "asc" }
  });

  const byCountry = new Map<string, number>();
  const byCity = new Map<string, number>();

  for (const event of events) {
    const country = event.country || "Bilinmiyor";
    const city = event.city || "Bilinmiyor";
    byCountry.set(country, (byCountry.get(country) ?? 0) + 1);
    byCity.set(city, (byCity.get(city) ?? 0) + 1);
  }

  return NextResponse.json({
    linkId: id,
    totalClicks: events.length,
    days,
    countries: [...byCountry.entries()].map(([name, clicks]) => ({ name, clicks })).sort((a, b) => b.clicks - a.clicks),
    cities: [...byCity.entries()].map(([name, clicks]) => ({ name, clicks })).sort((a, b) => b.clicks - a.clicks)
  });
}
