import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { AuthButtons } from "@/components/auth-buttons";

export default async function GirisPage() {
  const session = await getAuthSession();

  if (session?.user?.id) {
    redirect("/panel/olustur");
  }

  return (
    <main className="page-wrap">
      <section className="card single-card">
        <h1>Google ile Giriş Yap</h1>
        <p className="muted">Panel özelliklerine erişmek için Google hesabınızla giriş yapın.</p>
        <AuthButtons isAuthenticated={false} />
      </section>
    </main>
  );
}
