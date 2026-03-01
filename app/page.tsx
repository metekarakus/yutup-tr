import { getAuthSession } from "@/lib/auth";
import { LandingForm } from "@/components/landing-form";
import { GoogleSignInButton } from "@/components/google-signin-button";
import { redirect } from "next/navigation";

type HomePageProps = {
  searchParams: Promise<{ preview?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const forcePreview = params.preview === "1";
  const session = await getAuthSession();
  if (session?.user?.id && !forcePreview) {
    redirect("/panel/olustur");
  }

  return (
    <main className="page-wrap landing-page">
      <div className="container">
        <section className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">YouTube uygulama bağlantı oluşturucu</p>
            <h1 className="hero-fixed-title"><span style={{ display: "block" }}>YouTube bağlantılarınızı</span><span style={{ display: "block" }}>mobilde daha hızlı açın,</span><span style={{ display: "block" }}>etkileşimi artırın.</span></h1>
            <p className="muted hero-text">
              <span className="brand-hover">yutup.tr</span> ile YouTube video ve kanal bağlantılarını dakikalar içinde kısa linke dönüştürün. Giriş yaptıktan
              sonra panelden abone ol bağlantıları, analiz ve ara yönlendirme gibi gelişmiş özellikleri kullanın.
            </p>
            <div className="hero-actions">
              <GoogleSignInButton className="btn google-btn" label="Ücretsiz başlayın" />
              <a className="btn ghost" href="#neden">Daha fazla bilgi</a>
            </div>
            <div className="proof-row">
              <div className="proof-avatars" aria-hidden="true">
                <span>YT</span>
                <span>IG</span>
                <span>TK</span>
              </div>
              <p><strong>5000+</strong> kullanıcı <span className="brand-hover">yutup.tr</span> ile linklerini yönetiyor.</p>
            </div>
          </div>
          <div className="hero-phone-wrap" aria-hidden="true">
            <img className="hero-phone-image" src="/telefon%20gorseli.png" alt="Telefon görseli" />
          </div>
        </section>

        <section id="olustur" className="landing-link-builder">
          <h2><span className="brand-hover">yutup.tr</span> bağlantınızı hemen oluşturun</h2>
          <LandingForm isAuthenticated={Boolean(session?.user?.id)} />
        </section>

        <section className="benefits-section">
          <h2>Giriş Yapmanın Avantajları</h2>
          <p className="muted">
            Misafir kullanımında sadece kısaltma yapabilirsiniz. Giriş yapınca panel açılır ve gelişmiş özellikler aktif olur.
          </p>
          <div className="benefit-grid">
            <article className="benefit-card">
              <span className="badge">Misafir</span>
              <ul>
                <li>En fazla 2 bağlantı oluşturma</li>
                <li>Sadece URL kısaltma</li>
                <li>Abone ol bağlantısı yok</li>
                <li>İstatistikler yok</li>
              </ul>
            </article>
            <article className="benefit-card featured">
              <span className="badge">Panel (Giriş yapan)</span>
              <ul>
                <li>Sınırsız bağlantı oluşturma</li>
                <li>Özel kısa bağlantı (5 adet hak)</li>
                <li className="highlight">
                  Abone ol bağlantısı oluşturma <span className="new-tag">Yeni</span>
                </li>
                <li>Ara yönlendirme sayfası ile mesaj gösterme</li>
                <li>Şehir/ülke bazlı istatistikler</li>
                <li>Bağlantı düzenleme ve silme</li>
              </ul>
            </article>
          </div>
          <div className="benefits-cta">
            <GoogleSignInButton className="btn google-btn" label="Giriş yap ve avantajları aç" />
          </div>
        </section>

        <section id="neden" className="landing-simple-section">
          <h2>Neden <span className="brand-hover">yutup.tr</span>?</h2>
          <div className="reason-grid">
            <article className="mini-card">
              <span className="card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M4 18h16M7 15V9m5 6V6m5 9v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </span>
              <strong>Etkileşimi Artırır</strong>
              <p className="muted">Mobilde uygulama öncelikli yönlendirme ile izleyici kaybını azaltır.</p>
            </article>
            <article className="mini-card">
              <span className="card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M13 3 6 14h5l-1 7 8-12h-5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
              </span>
              <strong>Basit ve Hızlı</strong>
              <p className="muted">Tek input ile saniyeler içinde paylaşılabilir kısa bağlantı üretirsiniz.</p>
            </article>
            <article className="mini-card">
              <span className="card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M5 19h14M7 17V9m5 8V5m5 12v-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </span>
              <strong>Detaylı Analiz</strong>
              <p className="muted">Panelde bağlantı performansını şehir/ülke bazında takip edebilirsiniz.</p>
            </article>
          </div>
        </section>

        <section className="landing-simple-section">
          <h2>Özellikler</h2>
          <div className="feature-grid">
            <article className="feature-card"><span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 18h16M7 15V9m5 6V6m5 9v-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span><strong>Tıklama Performansı</strong><p className="muted">Bağlantılarınızın tıklanma sayılarını takip edin.</p></article>
            <article className="feature-card"><span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span><strong>En İyi Cihazlar</strong><p className="muted">Trafiğin mobil/masaüstü dağılımını görün.</p></article>
            <article className="feature-card"><span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 6h16M9 6l-.8 12m7.6-12.1.8 12.1M3 18h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span><strong>En İyi Kaynaklar</strong><p className="muted">Referrer verileriyle hangi kanalların çalıştığını anlayın.</p></article>
            <article className="feature-card"><span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M3.8 12h16.4M12 3.5c2.8 2.5 2.8 14.5 0 17m0-17c-2.8 2.5-2.8 14.5 0 17" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></span><strong>En İyi Ülkeler</strong><p className="muted">Ülke ve şehir kırılımıyla hedef kitlenizi görün.</p></article>
            <article className="feature-card"><span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span><strong>En İyi Saatler</strong><p className="muted">Tıklamaların yoğunlaştığı saat aralıklarını izleyin.</p></article>
            <article className="feature-card"><span className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 3.5v3M16 3.5v3M4 10h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span><strong>En İyi Günler</strong><p className="muted">Haftalık performans trendini karşılaştırın.</p></article>
          </div>
        </section>
      </div>

      <section className="cta-band">
        <div className="container cta-band-inner">
          <h2><span className="brand-hover">yutup.tr</span>&apos;yi ücretsiz kullanmaya başlayın!</h2>
          <a href="#olustur" className="btn">Başla</a>
        </div>
      </section>

      <div className="container">
        <section className="landing-simple-section faq-section">
          <h2>SSS</h2>
          <div className="faq-list">
            <details open>
              <summary><span><span className="brand-hover">yutup.tr</span> tam olarak ne işe yarar?</span><span className="faq-chevron" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 7 5 6 5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></summary>
              <p>YouTube bağlantılarını kısa linke dönüştürerek paylaşımı kolaylaştırır ve panelde analiz sağlar.</p>
            </details>
            <details>
              <summary><span>Misafir kullanımında hangi özellikler açık?</span><span className="faq-chevron" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 7 5 6 5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></summary>
              <p>Misafir kullanıcılar yalnızca YouTube URL kısaltma yapabilir ve en fazla 2 bağlantı oluşturabilir.</p>
            </details>
            <details>
              <summary><span>Abone ol bağlantısı nedir, nasıl çalışır?</span><span className="faq-chevron" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 7 5 6 5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></summary>
              <p>Bu özellik sadece giriş yapan panel kullanıcıları içindir. Yalnızca kanal URL&apos;leri kabul edilir; video ve shorts bağlantıları kabul edilmez.</p>
            </details>
            <details>
              <summary><span>Analiz ekranında hangi veriler var?</span><span className="faq-chevron" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 7 5 6 5-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span></summary>
              <p>Tıklama sayısı, ülke/şehir dağılımı ve seçilen dönem bazında temel performans metrikleri gösterilir.</p>
            </details>
          </div>
        </section>
      </div>
    </main>
  );
}
