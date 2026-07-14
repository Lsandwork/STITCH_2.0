import { describe, expect, it } from "vitest";
import {
  isSupportedVisionMimeType,
  parseImageDataUrl,
} from "@/lib/ai-image-utils";

describe("ai image utils", () => {
  it("parses valid data urls", () => {
    const parsed = parseImageDataUrl("data:image/jpeg;base64,abc123");
    expect(parsed).toEqual({
      mimeType: "image/jpeg",
      base64: "abc123",
      dataUrl: "data:image/jpeg;base64,abc123",
    });
  });

  it("rejects invalid data urls", () => {
    expect(parseImageDataUrl("https://example.com/image.jpg")).toBeNull();
  });

  it("supports common vision mime types", () => {
    expect(isSupportedVisionMimeType("image/jpeg")).toBe(true);
    expect(isSupportedVisionMimeType("image/png")).toBe(true);
    expect(isSupportedVisionMimeType("image/svg+xml")).toBe(false);
  });
});
