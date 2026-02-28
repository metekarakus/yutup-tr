"use client";

type Props = {
  className?: string;
  callbackUrl?: string;
  label?: string;
};

export function GoogleSignInButton({ className = "btn google-btn", callbackUrl = "/panel/olustur", label = "Google ile Giriş Yap" }: Props) {
  function openPopup() {
    const doneUrl = `/auth/popup-done?next=${encodeURIComponent(callbackUrl)}`;
    const authUrl = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(doneUrl)}`;

    const width = 520;
    const height = 680;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      "googleAuthPopup",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      window.location.href = authUrl;
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "YUTUP_AUTH_DONE") return;
      window.removeEventListener("message", onMessage);
      window.location.href = typeof event.data.next === "string" ? event.data.next : callbackUrl;
    };

    window.addEventListener("message", onMessage);

    const timer = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(timer);
        window.removeEventListener("message", onMessage);
        window.location.reload();
      }
    }, 500);
  }

  return (
    <button className={className} onClick={openPopup} type="button">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="google-icon">
        <path
          d="M23.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6.5c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.8c2.2-2 3.5-5 3.5-8.2z"
          fill="#4285F4"
        />
        <path
          d="M12 24c3.2 0 5.8-1 7.8-2.8l-3.8-2.8c-1 .7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.7-4.9H1.3v3c2 4 6.2 6.3 10.7 6.3z"
          fill="#34A853"
        />
        <path
          d="M5.3 14.7c-.3-.7-.5-1.5-.5-2.3s.2-1.6.5-2.3v-3H1.3A12 12 0 0 0 0 12.4c0 2 .5 3.8 1.3 5.3l4-3z"
          fill="#FBBC05"
        />
        <path
          d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.8 1.2 15.2 0 12 0 7.5 0 3.3 2.6 1.3 6.9l4 3c1-2.8 3.6-5.1 6.7-5.1z"
          fill="#EA4335"
        />
      </svg>
      {label}
    </button>
  );
}
