import { z } from "zod";
import { isYoutubeHost } from "@/lib/youtube";

const privateIpRegexes = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^0\./
];

function isPrivateIp(hostname: string): boolean {
  return privateIpRegexes.some((regex) => regex.test(hostname));
}

function isLocalHost(hostname: string): boolean {
  return hostname === "localhost" || hostname.endsWith(".local");
}

function canForceHttps(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return !isLocalHost(host) && !isPrivateIp(host);
}

export function toHttpsUrl(url: URL): URL {
  const normalized = new URL(url.toString());
  if (normalized.protocol === "http:" && canForceHttps(normalized.hostname)) {
    normalized.protocol = "https:";
  }
  return normalized;
}

export function toHttpsUrlString(rawUrl: string): string {
  return toHttpsUrl(new URL(rawUrl)).toString();
}

export function normalizeBaseUrl(baseUrl: string): string {
  const normalized = toHttpsUrl(new URL(baseUrl));
  return normalized.origin;
}

export function validateTargetUrl(rawUrl: string): URL {
  const schema = z.string().url();
  const parsedUrl = new URL(schema.parse(rawUrl));

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error("Geçersiz URL. Yalnızca http/https destekleniyor.");
  }

  const host = parsedUrl.hostname.toLowerCase();
  if (isLocalHost(host) || isPrivateIp(host)) {
    throw new Error("Bu hedef URL güvenlik nedeniyle engellendi.");
  }

  if (!isYoutubeHost(host)) {
    throw new Error("Yalnızca YouTube bağlantıları kabul edilir.");
  }

  return parsedUrl;
}
