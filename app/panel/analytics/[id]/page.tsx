import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AnalyticsVisuals } from "@/components/analytics-visuals";

export default async function PanelAnalyticsPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ days?: string }> }) {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/giris");

  const { id } = await params;
  const { days } = await searchParams;
  const selectedDays = days === "30" ? 30 : 7;

  const link = await prisma.link.findUnique({ where: { id } });
  if (!link || link.ownerUserId !== session.user.id) redirect("/panel/links");

  const start = new Date();
  start.setDate(start.getDate() - selectedDays);

  const events = await prisma.clickEvent.findMany({ where: { linkId: id, clickedAt: { gte: start } } });

  const countries = new Map<string, number>();
  const cities = new Map<string, number>();
  for (const event of events) {
    countries.set(event.country || "Bilinmiyor", (countries.get(event.country || "Bilinmiyor") ?? 0) + 1);
    cities.set(event.city || "Bilinmiyor", (cities.get(event.city || "Bilinmiyor") ?? 0) + 1);
  }

  const displayNames = new Intl.DisplayNames(["tr"], { type: "region" });
  const countryRows = [...countries.entries()]
    .map(([codeOrName, clicks]) => {
      const normalizedCode = /^[A-Za-z]{2}$/.test(codeOrName) ? codeOrName.toUpperCase() : "XX";
      const name =
        normalizedCode !== "XX"
          ? displayNames.of(normalizedCode) || codeOrName.toUpperCase()
          : codeOrName === "Bilinmiyor"
            ? "Bilinmiyor"
            : codeOrName;
      return { code: normalizedCode, name, clicks };
    })
    .sort((a, b) => b.clicks - a.clicks);

  const cityRows = [...cities.entries()]
    .map(([name, clicks]) => ({ name, clicks }))
    .sort((a, b) => b.clicks - a.clicks);

  return (
    <main className="page-wrap">
      <div className="container">
        <section className="card">
          <h1>Analiz</h1>
          <p className="muted">Toplam tıklama ({selectedDays} gün): {events.length}</p>
          <div className="actions-row">
            <a className={selectedDays === 7 ? "btn" : "btn ghost"} href={`?days=7`}>Son 7 gün</a>
            <a className={selectedDays === 30 ? "btn" : "btn ghost"} href={`?days=30`}>Son 30 gün</a>
          </div>
          <AnalyticsVisuals countries={countryRows} cities={cityRows} />
        </section>
      </div>
    </main>
  );
}
