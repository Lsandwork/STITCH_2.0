/** Browser-side image compression for AI vision uploads. */

export async function compressImageFile(
  file: File,
  maxDimension = 1280,
  quality = 0.82,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read that image."));
      img.src = objectUrl;
    });

    return compressHtmlImage(image, maxDimension, quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function compressDataUrl(
  dataUrl: string,
  maxDimension = 1280,
  quality = 0.82,
): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read that image."));
    img.src = dataUrl;
  });

  return compressHtmlImage(image, maxDimension, quality);
}

function compressHtmlImage(
  image: HTMLImageElement,
  maxDimension: number,
  quality: number,
): string {
  const scale = Math.min(
    1,
    maxDimension / Math.max(image.width, image.height, 1),
  );
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare image for upload.");
  }
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}
