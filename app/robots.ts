import type { MetadataRoute } from "next";
import { normalizeBaseUrl } from "@/lib/url";

export default function robots(): MetadataRoute.Robots {
  const base = normalizeBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
  return {
    rules: [
      { userAgent: "*", allow: ["/", "/giris", "/kvkk", "/gizlilik", "/cerez-politikasi"] },
      { userAgent: "*", disallow: ["/api/", "/r/", "/go/", "/panel"] }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
