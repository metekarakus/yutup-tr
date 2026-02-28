"use client";

import { useState } from "react";
import { ShareActions } from "@/components/share-actions";

type Props = {
  customSlugQuotaUsed: number;
  customSlugQuotaLimit: number;
};

export function PanelLinkForm({ customSlugQuotaUsed, customSlugQuotaLimit }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [type, setType] = useState<"YOUTUBE" | "SUBSCRIBE">("YOUTUBE");
  const [customSlug, setCustomSlug] = useState("");
  const [interstitialEnabled, setInterstitialEnabled] = useState(false);
  const [interstitialMessage, setInterstitialMessage] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const customQuotaAvailable = customSlugQuotaUsed < customSlugQuotaLimit;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const response = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalUrl,
        type,
        customSlug: customQuotaAvailable ? customSlug : undefined,
        interstitialEnabled,
        interstitialMessage: interstitialEnabled ? interstitialMessage : undefined
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "İşlem başarısız");
      return;
    }

    setResult(data.shortUrl);
  }

  return (
    <section className="card">
      <h1>Link Oluştur</h1>
      <p className="muted">Özelleştirme hakkı: {customSlugQuotaUsed}/{customSlugQuotaLimit}</p>
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Hedef URL
          <input value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} placeholder="https://youtube.com/..." required />
        </label>

        <label>
          Link Türü
          <select value={type} onChange={(e) => setType(e.target.value as "YOUTUBE" | "SUBSCRIBE")}>
            <option value="YOUTUBE">YouTube Yönlendirme</option>
            <option value="SUBSCRIBE">Abone Ol</option>
          </select>
        </label>

        <label>
          Kısa adres (isteğe bağlı)
          <input
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            placeholder={customQuotaAvailable ? "örnek-kampanya" : "Özelleştirme hakkınız doldu"}
            disabled={!customQuotaAvailable}
          />
        </label>

        <label className="checkbox-line">
          <input type="checkbox" checked={interstitialEnabled} onChange={(e) => setInterstitialEnabled(e.target.checked)} />
          Ara yönlendirme sayfası kullan
        </label>

        {interstitialEnabled ? (
          <label>
            Ara sayfa mesajı
            <textarea
              value={interstitialMessage}
              onChange={(e) => setInterstitialMessage(e.target.value)}
              placeholder="Kısa bilgilendirme metni"
              rows={3}
            />
          </label>
        ) : null}

        <button className="btn" type="submit">Link Oluştur</button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      {result ? (
        <div className="result-box">
          <p><strong>Kısa link:</strong> {result}</p>
          <ShareActions shortUrl={result} />
        </div>
      ) : null}
    </section>
  );
}
