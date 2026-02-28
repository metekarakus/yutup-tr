import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { Providers } from "@/app/providers";
import { AuthButtons } from "@/components/auth-buttons";
import { normalizeBaseUrl } from "@/lib/url";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000")),
  title: "yutup.tr | Akıllı YouTube ve URL Kısaltıcı",
  description: "Sadece YouTube bağlantıları için kısa link, yönlendirme ve panel yönetimi.",
  openGraph: {
    title: "yutup.tr",
    description: "Sadece YouTube için akıllı kısa bağlantı ve yönlendirme platformu",
    type: "website"
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();

  return (
    <html lang="tr">
      <body className={`${montserrat.className} app-shell`}>
        <Providers>
          <header className="topbar">
            <div className="container topbar-inner">
              <Link href="/" className="logo-mark" aria-label="Ana sayfa">
                <span className="logo-play" />
                <strong>yutup.tr</strong>
              </Link>
              <AuthButtons isAuthenticated={Boolean(session?.user?.id)} />
            </div>
          </header>
          <main className="app-main">{children}</main>
          <footer className="site-footer">
            <div className="container footer-inner">
              <Link href="/">Ana Sayfa</Link>
              <Link href="/kvkk">KVKK</Link>
              <Link href="/gizlilik">Gizlilik</Link>
              <Link href="/cerez-politikasi">Çerezler</Link>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
