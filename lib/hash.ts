import { createHash, randomUUID } from "crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function newGuestToken(): string {
  return randomUUID();
}
