import { getAuthSession } from "@/lib/auth";
import { LandingForm } from "@/components/landing-form";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getAuthSession();
  if (session?.user?.id) {
    redirect("/panel/olustur");
  }

  return (
    <main className="page-wrap">
      <div className="container grid-2">
        <LandingForm isAuthenticated={Boolean(session?.user?.id)} />
        <section className="card info-card">
          <h2>Örnek Kullanım</h2>
          <ol>
            <li>Bağlantıyı yapıştırın ve Kısalt butonuna tıklayın.</li>
            <li>Oluşan kısa linki sosyal medya profilinize ekleyin.</li>
            <li>Panelde giriş yaparak YouTube, abone ol ve analitik özelliklerini yönetin.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
