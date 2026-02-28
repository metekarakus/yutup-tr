# Deployment (Vercel + Managed Postgres)

## 1) Vercel Proje Ayari

- Git reposunu Vercel'e bagla.
- Environment Variables:
  - `NEXT_PUBLIC_BASE_URL=https://yutup.tr`
  - `DATABASE_URL=...`

## 2) Domain

- `yutup.tr` apex domain ekle.
- `www.yutup.tr` ekle.
- Middleware canonical yonlendirme yapar (`www` -> apex).

## 3) Postgres

- Neon veya Supabase'te PostgreSQL olustur.
- `DATABASE_URL` gir.
- Uygulama ilk calismada tablolari otomatik olusturur.

## 4) Monitoring

- Uptime monitor: `GET /r/test-link` ve ana sayfa.
- Hata izleme: Sentry benzeri arac ekleyin.
- Alarm: 5xx artisi ve redirect basarisizlik oraninda anomali.

## 5) Backup

- Managed DB tarafinda gunluk backup acik olsun.
