export type ParsedImageData = {
  mimeType: string;
  base64: string;
  dataUrl: string;
};

export function parseImageDataUrl(dataUrl: string): ParsedImageData | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    base64: match[2],
    dataUrl,
  };
}

export function isSupportedVisionMimeType(mimeType: string): boolean {
  return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
    mimeType.toLowerCase(),
  );
}
