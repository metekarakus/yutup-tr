import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { newGuestToken, sha256 } from "@/lib/hash";
import type { GuestLimitInfo } from "@/lib/types";

export const GUEST_LINK_LIMIT = 2;

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function getOrCreateGuestToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get("yutup_guest")?.value;
  if (existing) return existing;

  const token = newGuestToken();
  cookieStore.set("yutup_guest", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/"
  });
  return token;
}

export async function getGuestLimitInfo(): Promise<{ info: GuestLimitInfo; guestTokenHash: string; creatorIpHash: string }> {
  const token = await getOrCreateGuestToken();
  const ip = await getClientIp();
  const guestTokenHash = sha256(token);
  const creatorIpHash = sha256(ip);

  const used = await prisma.link.count({
    where: {
      ownerUserId: null,
      OR: [{ guestTokenHash }, { creatorIpHash }]
    }
  });

  const remaining = Math.max(GUEST_LINK_LIMIT - used, 0);

  return {
    info: {
      used,
      limit: GUEST_LINK_LIMIT,
      remaining,
      blocked: used >= GUEST_LINK_LIMIT
    },
    guestTokenHash,
    creatorIpHash
  };
}
