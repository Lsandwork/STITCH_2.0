import { z } from "zod";

export const yarnLabelInputSchema = z.object({
  imageDataUrl: z.string().optional(),
  storagePath: z.string().optional(),
});

export const yarnLabelExtractionSchema = z.object({
  brand: z.string().optional(),
  name: z.string().optional(),
  colorName: z.string().optional(),
  colorNumber: z.string().optional(),
  weight: z.string().optional(),
  fiberContent: z.string().optional(),
  yardage: z.number().positive().optional(),
  weightGrams: z.number().positive().optional(),
  recommendedHook: z.string().optional(),
  recommendedNeedle: z.string().optional(),
  careInstructions: z.string().optional(),
  dyeLot: z.string().optional(),
  barcode: z.string().optional(),
  confidence: z.number().min(0).max(1),
  rawText: z.string().optional(),
});

export const yarnLabelResultSchema = z.object({
  extraction: yarnLabelExtractionSchema,
  extractedAt: z.string().datetime(),
  model: z.string(),
});

export type YarnLabelInput = z.infer<typeof yarnLabelInputSchema>;
export type YarnLabelResult = z.infer<typeof yarnLabelResultSchema>;

function buildMockYarnLabel(): YarnLabelResult {
  return yarnLabelResultSchema.parse({
    extraction: {
      brand: "Bernat",
      name: "Velvet",
      colorName: "Coral Blush",
      colorNumber: "30009",
      weight: "worsted",
      fiberContent: "100% polyester",
      yardage: 220,
      weightGrams: 100,
      recommendedHook: "5.0 mm (H-8)",
      recommendedNeedle: "5.0 mm",
      careInstructions: "Machine wash cold, gentle cycle. Tumble dry low.",
      dyeLot: "A0426",
      confidence: 0.76,
      rawText:
        "Bernat Velvet | Coral Blush 30009 | 100% Polyester | 220 yds / 100 g | Hook 5.0 mm",
    },
    extractedAt: new Date().toISOString(),
    model: "stitch-mock-v1",
  });
}

export async function extractYarnLabel(
  input: unknown,
): Promise<YarnLabelResult> {
  yarnLabelInputSchema.parse(input);
  return buildMockYarnLabel();
}
