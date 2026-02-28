"use client";

import { useState } from "react";

type Props = {
  id: string;
  originalUrl: string;
  type: "SHORTEN" | "YOUTUBE" | "SUBSCRIBE";
  interstitialEnabled: boolean;
  interstitialMessage: string;
  isActive: boolean;
};

export function EditLinkForm({ id, originalUrl, type, interstitialEnabled, interstitialMessage, isActive }: Props) {
  const [url, setUrl] = useState(originalUrl);
  const [linkType, setLinkType] = useState<"YOUTUBE" | "SUBSCRIBE">(type === "SUBSCRIBE" ? "SUBSCRIBE" : "YOUTUBE");
  const [interstitial, setInterstitial] = useState(interstitialEnabled);
  const [message, setMessage] = useState(interstitialMessage);
  const [active, setActive] = useState(isActive);
  const [status, setStatus] = useState<string | null>(null);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);

    const response = await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originalUrl: url,
        type: linkType,
        interstitialEnabled: interstitial,
        interstitialMessage: interstitial ? message : null,
        isActive: active
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "Güncelleme başarısız");
      return;
    }

    setStatus("Kaydedildi.");
  }

  return (
    <section className="card">
      <h1>Link Düzenle</h1>
      <form className="form-grid" onSubmit={save}>
        <label>
          Hedef URL
          <input value={url} onChange={(e) => setUrl(e.target.value)} required />
        </label>

        <label>
          Link Türü
          <select value={linkType} onChange={(e) => setLinkType(e.target.value as "YOUTUBE" | "SUBSCRIBE")}>
            <option value="YOUTUBE">YouTube Yönlendirme</option>
            <option value="SUBSCRIBE">Abone Ol</option>
          </select>
        </label>

        <label className="checkbox-line">
          <input type="checkbox" checked={interstitial} onChange={(e) => setInterstitial(e.target.checked)} />
          Ara yönlendirme sayfası kullan
        </label>

        {interstitial ? (
          <label>
            Ara mesaj
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
          </label>
        ) : null}

        <label className="checkbox-line">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Link aktif olsun
        </label>

        <button className="btn" type="submit">Kaydet</button>
      </form>
      {status ? <p className={status === "Kaydedildi." ? "muted" : "error"}>{status}</p> : null}
    </section>
  );
}
