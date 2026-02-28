import type { MetadataRoute } from "next";
import { normalizeBaseUrl } from "@/lib/url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
  const now = new Date();

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${base}/giris`, changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: `${base}/kvkk`, changeFrequency: "monthly", priority: 0.4, lastModified: now },
    { url: `${base}/gizlilik`, changeFrequency: "monthly", priority: 0.4, lastModified: now },
    { url: `${base}/cerez-politikasi`, changeFrequency: "monthly", priority: 0.4, lastModified: now }
  ];
}
