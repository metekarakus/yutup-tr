"use client";

import { useEffect, useState } from "react";
import { GoogleSignInButton } from "@/components/google-signin-button";
import { ShareActions } from "@/components/share-actions";

type GuestLimit = {
  used: number;
  limit: number;
  remaining: number;
  blocked: boolean;
};

type FormResponse = {
  shortUrl: string;
  resolvedUrl: string;
  message?: string;
  guestLimit?: GuestLimit;
};

export function LandingForm({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FormResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [guestLimit, setGuestLimit] = useState<GuestLimit | null>(null);

  useEffect(() => {
    if (isAuthenticated) return;
    fetch("/api/links/guest-limit")
      .then((res) => res.json())
      .then((data) => setGuestLimit(data))
      .catch(() => undefined);
  }, [isAuthenticated]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: url,
          type: "SHORTEN"
        })
      });
      const data = await response.json();

      if (!response.ok) {
        setGuestLimit(data.guestLimit ?? null);
        throw new Error(data.error ?? "İşlem başarısız.");
      }

      setResult(data);
      if (data.guestLimit) setGuestLimit(data.guestLimit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beklenmeyen hata.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <section className="card landing-builder-card">
      <p className="muted">
        Yalnızca YouTube bağlantıları kabul edilir. Misafir olarak kısaltma yapabilir, giriş sonrası panel özelliklerini
        açabilirsiniz.
      </p>

      {!isAuthenticated ? (
        <p className="limit">
          Misafir Limitiniz: {guestLimit ? `${guestLimit.used}/${guestLimit.limit}` : "2"}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="form-grid">
        <label>
          URL Yapıştır
          <input
            type="url"
            placeholder="Video veya kanal bağlantısını yapıştırın..."
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
        <button className="btn" disabled={loading} type="submit">
          {loading ? "Kısaltılıyor..." : "Kısalt ve bağlantıyı al"}
        </button>
      </form>

      {error ? <p className="error">{error}</p> : null}

      {result ? (
        <div className="result-box">
          <p>
            <strong>Kısa link:</strong> {result.shortUrl}
          </p>
          <ShareActions shortUrl={result.shortUrl} />
          {result.message ? <p className="muted small">{result.message}</p> : null}
        </div>
      ) : null}

      {!isAuthenticated && guestLimit?.blocked ? (
        <div className="warn-box">
          <p>Limit doldu. Sınırsız link için Google ile giriş yapın.</p>
          <GoogleSignInButton />
        </div>
      ) : null}
    </section>
  );
}
