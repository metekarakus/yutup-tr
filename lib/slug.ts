import { randomBytes } from "crypto";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateSlug(length = 7): string {
  const bytes = randomBytes(length);
  let output = "";
  for (let i = 0; i < bytes.length; i += 1) {
    output += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return output;
}

export function normalizeSlug(input: string): string {
  const transliterated = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");

  return transliterated
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
