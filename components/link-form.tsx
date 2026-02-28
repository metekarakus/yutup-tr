"use client";

import { useState } from "react";

type CreateResponse = {
  version: string;
  slug: string;
  shortUrl: string;
  resolvedType: string;
  deepLink: string;
  fallbackUrl: string;
  expiresAt: string | null;
};

export function LinkForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [campaign, setCampaign] = useState("");
  const [forceSubscribe, setForceSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateResponse | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/v1/links/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl,
          customSlug: customSlug || undefined,
          campaign: campaign || undefined,
          forceSubscribe
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Olusturma sirasinda hata olustu.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen hata");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="generator-card">
      <form onSubmit={onSubmit} className="generator-form">
        <label>
          YouTube URL
          <input
            required
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
          />
        </label>

        <label>
          Ozel slug (opsiyonel)
          <input
            type="text"
            placeholder="ornek: kampanya2026"
            value={customSlug}
            onChange={(event) => setCustomSlug(event.target.value)}
          />
        </label>

        <label>
          Kampanya etiketi (opsiyonel)
          <input
            type="text"
            placeholder="ornek: insta-bio"
            value={campaign}
            onChange={(event) => setCampaign(event.target.value)}
          />
        </label>

        <label className="checkbox">
          <input type="checkbox" checked={forceSubscribe} onChange={(event) => setForceSubscribe(event.target.checked)} />
          Kanal linklerinde abone ol yonlendirmesi ekle (sub_confirmation=1)
        </label>

        <button disabled={loading} type="submit">
          {loading ? "Olusturuluyor..." : "Link Olustur"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {result ? (
        <div className="result-box">
          <h2>Link Hazir</h2>
          <p>
            <strong>Kisa link:</strong> {result.shortUrl}
          </p>
          <p>
            <strong>Tip:</strong> {result.resolvedType}
          </p>
          <p>
            <strong>Deep-link:</strong> {result.deepLink}
          </p>
          <p>
            <strong>Fallback:</strong> {result.fallbackUrl}
          </p>
          <div className="actions">
            <button onClick={() => copy(result.shortUrl)} type="button">
              Kisa Linki Kopyala
            </button>
            <button onClick={() => copy(result.deepLink)} type="button">
              Deep-link Kopyala
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
