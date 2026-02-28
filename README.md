# yutup.tr

Sadece YouTube bağlantıları için kısa link üretimi, YouTube yönlendirme ve panel yönetimi.

## Özellikler

- Misafir için YouTube URL kısaltma (2 link limiti)
- Google ile giriş sonrası panel erişimi
- Link türleri: `SHORTEN`, `YOUTUBE`, `SUBSCRIBE`
- Tüm sistemde yalnızca YouTube URL kabulü
- `SUBSCRIBE` için yalnızca YouTube kanal URL doğrulaması
- Özel slug (kullanıcı başına 5 hak)
- Ara yönlendirme sayfası (interstitial)
- Link yönetimi (listeleme, pasife alma)
- Analitik: tıklama, ülke/şehir, 7/30 gün
- KVKK / Gizlilik / Çerez sayfaları

## Kurulum

1. Node.js 20+ kurun.
2. Bağımlılıkları yükleyin:
   - `npm install`
3. Ortam dosyası oluşturun:
   - `cp .env.example .env.local`
4. Prisma migration çalıştırın:
   - `npx prisma migrate dev --name init`
5. Geliştirme sunucusunu başlatın:
   - `npm run dev -- -H 0.0.0.0 -p 3000`

## Komutlar

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run test`

## Mimari

- Next.js App Router + TypeScript
- Prisma + PostgreSQL
- NextAuth (Google OAuth)
- Redirect resolver: `/r/:slug`
- Interstitial: `/go/:slug`

## API Uçları

- `POST /api/links` link oluştur
- `GET /api/links` kullanıcı linkleri
- `PATCH /api/links/:id` link güncelle
- `DELETE /api/links/:id` link pasifleştir
- `GET /api/analytics/links/:id?days=7|30` analitik
- `GET /api/links/guest-limit` misafir limit bilgisi
- `GET /r/:slug` yönlendirme

## Google OAuth Kurulumu

1. Google Cloud Console'da yeni proje oluşturun.
2. OAuth Consent Screen ayarlarını tamamlayın.
   - Uygulama adı: `yutup.tr`
   - Yetkili alan adı: `yutup.tr`
   - Gizlilik/KVKK bağlantıları: `https://yutup.tr/gizlilik`, `https://yutup.tr/kvkk`
3. Credentials > OAuth Client ID > Web application oluşturun.
4. Authorized JavaScript origins:
   - `https://yutup.tr`
   - `http://localhost:3000`
5. Authorized redirect URIs:
   - `https://yutup.tr/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
6. Alınan değerleri `.env.local` içine yazın:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL`

## Yayın Notları

- Production için `NEXT_PUBLIC_BASE_URL=https://yutup.tr`
- `www` -> apex yönlendirmesi middleware ile aktif
- HTTPS zorunlu (Vercel üzerinde varsayılan)
