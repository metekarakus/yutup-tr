import { describe, expect, it } from "vitest";
import { resolveFinalYoutubeUrl } from "../lib/youtube";

describe("YouTube subscribe doğrulaması", () => {
  it("kanal URL için sub_confirmation ekler", () => {
    const url = new URL("https://www.youtube.com/@ornekkanal");
    const resolved = resolveFinalYoutubeUrl(url, "SUBSCRIBE");
    expect(resolved).toContain("sub_confirmation=1");
  });

  it("video URL için subscribe seçimini reddeder", () => {
    const url = new URL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(() => resolveFinalYoutubeUrl(url, "SUBSCRIBE")).toThrow();
  });

  it("youtube dışı URL'leri reddeder", () => {
    const url = new URL("https://example.com/a/b");
    expect(() => resolveFinalYoutubeUrl(url, "SHORTEN")).toThrow();
  });
});
