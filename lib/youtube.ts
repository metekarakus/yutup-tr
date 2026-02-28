import type { LinkType } from "@prisma/client";

const CHANNEL_PATTERNS = [/^\/@[\w.-]+$/, /^\/channel\/[\w-]+$/, /^\/c\/[\w.-]+$/, /^\/user\/[\w.-]+$/];
const privateIpRegexes = [/^10\./, /^127\./, /^169\.254\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[0-1])\./, /^0\./];

function canForceHttps(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local")) return false;
  return !privateIpRegexes.some((regex) => regex.test(host));
}

export function isYoutubeHost(host: string): boolean {
  return ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(host.toLowerCase());
}

export function ensureSubscribeCompatible(url: URL): void {
  if (url.hostname === "youtu.be") {
    throw new Error("Abone ol bağlantısı için yalnızca kanal adresi kabul edilir. Video/Shorts bağlantısı desteklenmiyor.");
  }

  const path = url.pathname;
  const isChannel = CHANNEL_PATTERNS.some((pattern) => pattern.test(path));
  if (!isChannel) {
    throw new Error("Abone ol bağlantısı için yalnızca kanal adresi kabul edilir. Video/Shorts bağlantısı desteklenmiyor.");
  }
}

export function resolveFinalYoutubeUrl(url: URL, type: LinkType): string {
  const resolved = new URL(url.toString());
  if (resolved.protocol === "http:" && canForceHttps(resolved.hostname)) {
    resolved.protocol = "https:";
  }

  if (!isYoutubeHost(resolved.hostname)) {
    throw new Error("Yalnızca YouTube bağlantıları kabul edilir.");
  }

  if (type === "SUBSCRIBE") {
    ensureSubscribeCompatible(resolved);
    resolved.searchParams.set("sub_confirmation", "1");
  }

  return resolved.toString();
}

export function toDeepLinkCandidate(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  if (!isYoutubeHost(host)) return null;

  if (host === "youtu.be") {
    const id = url.pathname.replace(/^\//, "");
    return id ? `vnd.youtube://${id}` : null;
  }

  if (url.pathname === "/watch" && url.searchParams.get("v")) {
    return `vnd.youtube://${url.searchParams.get("v")}`;
  }

  if (url.pathname.startsWith("/shorts/")) {
    const shortsId = url.pathname.split("/")[2];
    return shortsId ? `vnd.youtube://shorts/${shortsId}` : null;
  }

  return `youtube://www.youtube.com${url.pathname}${url.search}`;
}
