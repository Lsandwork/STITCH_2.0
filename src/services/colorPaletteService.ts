import { z } from "zod";

export const colorPaletteInputSchema = z.object({
  imageDataUrl: z.string().optional(),
  mood: z.string().optional(),
  baseColors: z.array(z.string()).optional(),
  count: z.number().int().min(2).max(8).default(5),
});

export const colorSwatchSchema = z.object({
  name: z.string(),
  hex: z.string().regex(/^#([0-9A-Fa-f]{6})$/),
  role: z.enum(["primary", "secondary", "accent", "neutral"]).optional(),
});

export const colorPaletteResultSchema = z.object({
  name: z.string(),
  swatches: z.array(colorSwatchSchema).min(2),
  contrastScore: z.number().min(0).max(100),
  notes: z.array(z.string()),
  generatedAt: z.string().datetime(),
});

export type ColorPaletteInput = z.infer<typeof colorPaletteInputSchema>;
export type ColorPaletteResult = z.infer<typeof colorPaletteResultSchema>;

const MOOD_PALETTES: Record<string, Array<{ name: string; hex: string; role: "primary" | "secondary" | "accent" | "neutral" }>> = {
  cozy: [
    { name: "Warm Cream", hex: "#F5E6D3", role: "neutral" },
    { name: "Rust", hex: "#B55233", role: "primary" },
    { name: "Forest", hex: "#2D5016", role: "secondary" },
    { name: "Honey", hex: "#D4A017", role: "accent" },
    { name: "Charcoal", hex: "#3D3D3D", role: "neutral" },
  ],
  playful: [
    { name: "Coral", hex: "#FF6B6B", role: "primary" },
    { name: "Teal", hex: "#4ECDC4", role: "secondary" },
    { name: "Sunshine", hex: "#FFE66D", role: "accent" },
    { name: "Lavender", hex: "#C9B1FF", role: "accent" },
    { name: "White", hex: "#FFFFFF", role: "neutral" },
  ],
  earthy: [
    { name: "Chestnut", hex: "#6B3A2A", role: "primary" },
    { name: "Sage", hex: "#87A96B", role: "secondary" },
    { name: "Sand", hex: "#D4C4A8", role: "neutral" },
    { name: "Clay", hex: "#C17C5C", role: "accent" },
    { name: "Moss", hex: "#4A6741", role: "secondary" },
  ],
};

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function computeContrastScore(swatches: Array<{ hex: string }>): number {
  if (swatches.length < 2) return 50;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < swatches.length; i += 1) {
    for (let j = i + 1; j < swatches.length; j += 1) {
      const ratio = contrastRatio(swatches[i].hex, swatches[j].hex);
      total += Math.min(ratio / 7, 1) * 100;
      pairs += 1;
    }
  }
  return Math.round(total / pairs);
}

export function generateColorPalette(input: unknown): ColorPaletteResult {
  const parsed = colorPaletteInputSchema.parse(input);
  const moodKey = parsed.mood?.toLowerCase() ?? "cozy";
  const preset =
    MOOD_PALETTES[moodKey] ??
    MOOD_PALETTES.cozy ??
    [];

  const swatches = preset.slice(0, parsed.count).map((s) =>
    colorSwatchSchema.parse(s),
  );

  if (parsed.baseColors?.length) {
    for (let i = 0; i < Math.min(parsed.baseColors.length, swatches.length); i += 1) {
      const color = parsed.baseColors[i];
      if (/^#([0-9A-Fa-f]{6})$/.test(color)) {
        swatches[i] = colorSwatchSchema.parse({
          ...swatches[i],
          hex: color,
          name: swatches[i]?.name ?? `Color ${i + 1}`,
        });
      }
    }
  }

  const contrastScore = computeContrastScore(swatches);

  return colorPaletteResultSchema.parse({
    name: parsed.mood
      ? `${parsed.mood.charAt(0).toUpperCase()}${parsed.mood.slice(1)} Palette`
      : parsed.imageDataUrl
        ? "Photo-Inspired Palette"
        : "Stitch Default Palette",
    swatches,
    contrastScore,
    notes: [
      parsed.imageDataUrl
        ? "Colors approximated from uploaded image — verify against actual yarn swatches."
        : "Palette generated from mood keywords.",
      contrastScore >= 60
        ? "Good contrast between palette colors for colorwork."
        : "Consider adding a lighter neutral for better contrast in detailed sections.",
    ],
    generatedAt: new Date().toISOString(),
  });
}
