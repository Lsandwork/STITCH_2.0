import { z } from "zod";

export const yarnWeightSchema = z.enum([
  "lace",
  "fingering",
  "sport",
  "dk",
  "worsted",
  "aran",
  "bulky",
  "super_bulky",
  "jumbo",
  "other",
]);

export const yarnInventoryInputSchema = z.object({
  brand: z.string().optional(),
  name: z.string().min(1, "Yarn name is required."),
  colorName: z.string().optional(),
  colorHex: z.preprocess((val) => {
    if (typeof val !== "string" || !val.trim()) return undefined;
    return val.trim();
  }, z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Use a valid hex color like #AABBCC.").optional()),
  weight: z.string().optional(),
  fiberContent: z.string().optional(),
  yardage: z.number().positive().optional(),
  weightGrams: z.number().positive().optional(),
  quantitySkeins: z.number().positive().default(1),
  recommendedHook: z.string().optional(),
  careInstructions: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  storageLocation: z.string().optional(),
  barcode: z.string().optional(),
  notes: z.string().optional(),
  lowStockThreshold: z.number().nonnegative().optional(),
});

export const yarnSubstitutionInputSchema = z.object({
  sourceYarnId: z.string().uuid().optional(),
  sourceYarnName: z.string().optional(),
  targetYarnId: z.string().uuid().optional(),
  targetYarnName: z.string().optional(),
  patternId: z.string().uuid().optional(),
  requiredWeight: z.string().optional(),
  requiredGauge: z.string().optional(),
  requiredYardage: z.number().positive().optional(),
});

export const yarnSubstitutionRecommendationSchema = z.object({
  yarnId: z.string().optional(),
  yarnName: z.string().min(1),
  brand: z.string().optional(),
  compatibilityScore: z.number().min(0).max(100),
  hookAdjustment: z.string().optional(),
  gaugeAdjustment: z.string().optional(),
  yardageAdjustment: z.string().optional(),
  warnings: z.array(z.string()).default([]),
  reasoning: z.string().min(1),
  inInventory: z.boolean().default(false),
});

export const yarnSubstitutionResultSchema = z.object({
  sourceYarnName: z.string().min(1),
  recommendations: z.array(yarnSubstitutionRecommendationSchema).min(1),
  bestMatchId: z.string().optional(),
  generatedAt: z.string().datetime(),
});

export const yarnVaultSummarySchema = z.object({
  totalYarns: z.number().int().nonnegative(),
  lowStockCount: z.number().int().nonnegative(),
  featuredYarnIds: z.array(z.string()).default([]),
});

export type YarnInventoryInput = z.infer<typeof yarnInventoryInputSchema>;
export type YarnSubstitutionInput = z.infer<typeof yarnSubstitutionInputSchema>;
export type YarnSubstitutionResult = z.infer<typeof yarnSubstitutionResultSchema>;
export type YarnVaultSummary = z.infer<typeof yarnVaultSummarySchema>;

export function validateYarnInventoryInput(data: unknown) {
  return yarnInventoryInputSchema.safeParse(data);
}

export function validateYarnSubstitutionResult(data: unknown) {
  return yarnSubstitutionResultSchema.safeParse(data);
}
