"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthPopupDonePage() {
  const params = useSearchParams();

  useEffect(() => {
    const next = params.get("next") || "/panel";

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({ type: "YUTUP_AUTH_DONE", next }, window.location.origin);
      window.close();
      return;
    }

    window.location.href = next;
  }, [params]);

  return (
    <main className="page-wrap">
      <section className="card single-card">
        <h1>Giriş tamamlandı</h1>
        <p className="muted">Yönlendiriliyorsunuz...</p>
      </section>
    </main>
  );
}
