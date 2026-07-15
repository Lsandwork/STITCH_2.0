import { z } from "zod";

const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
const terminologySchema = z.enum(["us", "uk"]);
const validationStatusSchema = z.enum([
  "ai_generated",
  "ai_validated",
  "user_tested",
  "not_physically_tested",
]);

/** AI models often return numeric fields as strings — coerce safely. */
const coercedPositiveInt = z.coerce.number().int().positive();
const coercedNonNegativeInt = z.coerce.number().int().nonnegative();
const coercedPositive = z.coerce.number().positive();

const nullableCoercedNonNegativeInt = z.preprocess((val) => {
  if (val === null || val === undefined || val === "null" || val === "") {
    return null;
  }
  return val;
}, z.union([z.coerce.number().int().nonnegative(), z.null()]));

const isoDateTime = z.preprocess((val) => {
  if (typeof val === "string" && !Number.isNaN(Date.parse(val))) {
    return new Date(val).toISOString();
  }
  if (typeof val === "string") return val;
  return new Date().toISOString();
}, z.string().datetime());

export const patternGenerationInputSchema = z.object({
  description: z.string().min(10, "Describe your project in more detail."),
  projectType: z.string().min(1, "Select a project type."),
  skillLevel: difficultySchema,
  finishedDimensions: z.string().optional(),
  yarnWeight: z.string().optional(),
  yarnFiber: z.string().optional(),
  hookSize: z.string().optional(),
  preferredColors: z.array(z.string()).optional(),
  terminology: terminologySchema.default("us"),
  instructionFormat: z.enum(["written", "chart", "both"]).default("written"),
  handedness: z.enum(["left", "right"]).default("right"),
  construction: z.enum(["sewn", "low_sew", "seamless"]).optional(),
  eyeType: z.enum(["safety", "embroidered"]).optional(),
});

export const patternRowSchema = z.object({
  rowNumber: coercedPositiveInt,
  instruction: z.string().min(1),
  stitchCount: nullableCoercedNonNegativeInt,
  notes: z.string().optional(),
});

export const patternSectionSchema = z.object({
  name: z.string().min(1),
  sortOrder: coercedNonNegativeInt,
  instructions: z.string().optional(),
  rows: z.array(patternRowSchema).min(1),
});

export const yarnRequirementSchema = z.object({
  colorName: z.string().min(1),
  weight: z.string().min(1),
  fiber: z.string().optional(),
  yardage: coercedPositive.optional(),
  skeins: coercedPositive.optional(),
  notes: z.string().optional(),
});

export const patternValidationIssueSchema = z.object({
  code: z.string().min(1),
  severity: z.enum(["error", "warning", "info"]),
  message: z.string().min(1),
  rowNumber: coercedPositiveInt.optional(),
  section: z.string().optional(),
});

export const patternValidationResultSchema = z.object({
  status: validationStatusSchema,
  isValid: z.coerce.boolean(),
  score: z.coerce.number().min(0).max(100),
  issues: z.array(patternValidationIssueSchema),
  checkedAt: isoDateTime,
});

export const generatedPatternSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectType: z.string().min(1),
  skillLevel: difficultySchema,
  terminology: terminologySchema,
  difficulty: difficultySchema,
  estimatedTimeMinutes: coercedPositiveInt.optional(),
  previewImageUrl: z.string().url().optional(),
  materials: z.object({
    yarns: z.array(yarnRequirementSchema).min(1),
    hookSize: z.string().min(1),
    notions: z.array(z.string()).optional(),
    safetyNotes: z.array(z.string()).optional(),
  }),
  gauge: z.object({
    stitches: coercedPositive,
    rows: coercedPositive,
    measurement: z.string().min(1),
    notes: z.string().optional(),
  }),
  finishedMeasurements: z.object({
    width: z.string().optional(),
    height: z.string().optional(),
    depth: z.string().optional(),
    circumference: z.string().optional(),
    notes: z.string().optional(),
  }),
  abbreviations: z.record(z.string(), z.string()),
  sections: z.array(patternSectionSchema).min(1),
  assemblyInstructions: z.array(z.string()).optional(),
  finishingInstructions: z.array(z.string()).optional(),
  safetyNotes: z.array(z.string()).optional(),
  validation: patternValidationResultSchema,
  metadata: z
    .object({
      handedness: z.enum(["left", "right"]).optional(),
      construction: z.enum(["sewn", "low_sew", "seamless"]).optional(),
      eyeType: z.enum(["safety", "embroidered"]).optional(),
      chartPreference: z.enum(["written", "chart", "both"]).optional(),
      source: z
        .enum(["ai_generated", "uploaded", "photo", "manual"])
        .optional(),
    })
    .optional(),
});

export const patternGenerationResultSchema = z.object({
  pattern: generatedPatternSchema,
  rawModelOutput: z.string().optional(),
  model: z.string().optional(),
  generatedAt: z.string().datetime(),
});

export type PatternGenerationInputSchema = z.infer<
  typeof patternGenerationInputSchema
>;
export type GeneratedPatternSchema = z.infer<typeof generatedPatternSchema>;
export type PatternValidationResultSchema = z.infer<
  typeof patternValidationResultSchema
>;
export type PatternGenerationResultSchema = z.infer<
  typeof patternGenerationResultSchema
>;

export function validateGeneratedPattern(data: unknown) {
  return generatedPatternSchema.safeParse(data);
}

export function validatePatternGenerationInput(data: unknown) {
  return patternGenerationInputSchema.safeParse(data);
}
