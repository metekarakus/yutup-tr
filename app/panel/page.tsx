import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function PanelPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) redirect("/giris");

  const [totalLinks, totalClicks, user] = await Promise.all([
    prisma.link.count({ where: { ownerUserId: session.user.id } }),
    prisma.clickEvent.count({ where: { link: { ownerUserId: session.user.id } } }),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { customSlugQuotaUsed: true } })
  ]);

  return (
    <main className="page-wrap">
      <div className="container panel-grid">
        <section className="card">
          <h1>Panel</h1>
          <p className="muted">Toplam link: {totalLinks}</p>
          <p className="muted">Toplam tıklama: {totalClicks}</p>
          <p className="muted">Özelleştirme hakkı: {user?.customSlugQuotaUsed ?? 0}/5</p>
          <div className="actions-row">
            <Link href="/panel/olustur" className="btn">Link Oluştur</Link>
            <Link href="/panel/links" className="btn ghost">Linklerim</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
