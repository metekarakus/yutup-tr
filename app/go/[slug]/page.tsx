import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function InterstitialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link || !link.isActive) {
    notFound();
  }

  return (
    <main className="page-wrap interstitial-page">
      <section className="card interstitial-card">
        <h1>Yönlendirme Öncesi Bilgilendirme</h1>
        <p>{link.interstitialMessage || "Devam et butonuna tıklayarak hedef bağlantıya geçebilirsiniz."}</p>
        <Link className="btn" href={`/r/${slug}?from=go`}>
          Devam Et
        </Link>
      </section>
    </main>
  );
}
