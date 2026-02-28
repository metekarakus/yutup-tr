"use client";

type Props = {
  shortUrl: string;
};

function getShareItems(shortUrl: string) {
  const encodedUrl = encodeURIComponent(shortUrl);
  const encodedText = encodeURIComponent(`Kısa bağlantı: ${shortUrl}`);

  return [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}`,
      icon: (
        <svg viewBox="0 0 24 24" className="share-icon" aria-hidden="true">
          <path d="M20 12a8 8 0 0 1-11.7 7l-4.3 1.1 1.2-4.1A8 8 0 1 1 20 12z" fill="#25D366" />
          <path d="M9.5 7.8c-.3-.8-.7-.8-1-.8h-.8c-.2 0-.6.1-.8.4-.3.3-1 1-1 2.5s1 3 1.2 3.2c.3.3 2.3 3.6 5.7 4.9 2.8 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.7-.4-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.5-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.7.2-.2.2-.4.3-.6.1-.2 0-.4-.1-.6-.1-.2-.8-2-1.1-2.8z" fill="#fff" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="share-icon" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
          <rect x="6" y="10" width="2.4" height="8" fill="#fff" />
          <circle cx="7.2" cy="7.1" r="1.3" fill="#fff" />
          <path d="M11 10h2.3v1.1c.4-.7 1.2-1.3 2.6-1.3 2.2 0 3.1 1.4 3.1 3.7V18h-2.5v-3.8c0-1-.2-2-1.4-2s-1.6 1-1.6 1.9V18H11z" fill="#fff" />
        </svg>
      )
    },
    {
      name: "TikTok",
      href: `https://www.tiktok.com/upload?url=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="share-icon" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#111" />
          <path d="M13 6.5v6.6a2.7 2.7 0 1 1-1.8-2.5v-1.9a4.5 4.5 0 1 0 3.6 4.4V10c1 .8 2.1 1.2 3.2 1.2V9.4c-1.2 0-2.2-.6-3-1.6-.3-.4-.5-.8-.6-1.3z" fill="#25F4EE" />
          <path d="M12.6 6.1v6.6a2.7 2.7 0 1 1-1.8-2.5V8.3a4.5 4.5 0 1 0 3.6 4.4V9.6c1 .8 2.1 1.2 3.2 1.2V9c-1.2 0-2.2-.6-3-1.6-.3-.4-.5-.8-.6-1.3z" fill="#FE2C55" />
          <path d="M13 6.3v6.6a2.7 2.7 0 1 1-1.8-2.5v-1a4.5 4.5 0 1 0 3.6 4.4V9.7c1 .8 2.1 1.2 3.2 1.2v-1c-1.2 0-2.2-.6-3-1.6-.3-.4-.5-.8-.6-1.3z" fill="#fff" />
        </svg>
      )
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent("Kısa bağlantı")}`,
      icon: (
        <svg viewBox="0 0 24 24" className="share-icon" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#111" />
          <path d="M7 6h3.3l2.8 3.9L16 6h1.9l-4 5.4L18.2 18h-3.3l-3.1-4.4L8.7 18H6.8l4.2-5.7z" fill="#fff" />
        </svg>
      )
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg viewBox="0 0 24 24" className="share-icon" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#1877F2" />
          <path d="M13.2 20v-6h2l.3-2.4h-2.3v-1.5c0-.7.2-1.2 1.2-1.2h1.3V6.8c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.1-3.2 3.3v1.6H9v2.4h1.7v6h2.5z" fill="#fff" />
        </svg>
      )
    },
    {
      name: "E-Mail",
      href: `mailto:?subject=${encodeURIComponent("Kısa bağlantı")}&body=${encodedText}`,
      icon: (
        <svg viewBox="0 0 24 24" className="share-icon" aria-hidden="true">
          <rect x="2.2" y="4.2" width="19.6" height="15.6" rx="3.2" fill="#EA4335" />
          <path d="M4.5 7.2l7.5 5.5 7.5-5.5" fill="none" stroke="#fff" strokeWidth="1.7" />
        </svg>
      )
    }
  ];
}

export function ShareActions({ shortUrl }: Props) {
  return (
    <div className="result-actions">
      <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(shortUrl)}>
        Kopyala
      </button>
      <div className="share-row" aria-label="Paylaş seçenekleri">
        <span className="share-label">
          <svg viewBox="0 0 24 24" className="share-label-icon" aria-hidden="true">
            <path
              d="M12 4v8m0-8 3 3m-3-3-3 3M6 11.5v4.3c0 1.2 1 2.2 2.2 2.2h7.6c1.2 0 2.2-1 2.2-2.2v-4.3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Paylaş
        </span>
        {getShareItems(shortUrl).map((item) => (
          <a
            key={item.name}
            className="share-item"
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${item.name} ile paylaş`}
            title={`${item.name} ile paylaş`}
          >
            {item.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
