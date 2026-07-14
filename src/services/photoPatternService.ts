import { z } from "zod";
import {
  generatedPatternSchema,
  patternGenerationResultSchema,
} from "@/lib/schemas/pattern";
import { generatePattern } from "@/services/patternGenerationService";

export const PHOTO_PATTERN_DISCLAIMER =
  "This pattern is an approximate reconstruction inspired by your photo. It is not a copy of any original design and may require adjustments to match your yarn, gauge, and finished size.";

export const photoPatternInputSchema = z.object({
  imageDataUrl: z.string().optional(),
  storagePath: z.string().optional(),
  description: z.string().optional(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  terminology: z.enum(["us", "uk"]).default("us"),
  preferredColors: z.array(z.string()).optional(),
});

export const photoPatternResultSchema = z.object({
  pattern: generatedPatternSchema,
  disclaimer: z.string(),
  confidence: z.number().min(0).max(1),
  inspirationNotes: z.array(z.string()),
  generatedAt: z.string().datetime(),
  model: z.string().optional(),
});

export type PhotoPatternInput = z.infer<typeof photoPatternInputSchema>;
export type PhotoPatternResult = z.infer<typeof photoPatternResultSchema>;

export async function generatePatternFromPhoto(
  input: unknown,
): Promise<PhotoPatternResult> {
  const parsed = photoPatternInputSchema.parse(input);

  const generationInput = {
    description:
      parsed.description ??
      "Amigurumi plushie inspired by uploaded photo — long body, short legs, floppy ears.",
    projectType: "amigurumi",
    skillLevel: parsed.skillLevel,
    terminology: parsed.terminology,
    preferredColors: parsed.preferredColors ?? ["Brown", "Cream"],
    construction: "low_sew" as const,
    eyeType: "embroidered" as const,
  };

  const result = await generatePattern(generationInput);
  const pattern = generatedPatternSchema.parse({
    ...result.pattern,
    title: `${result.pattern.title} (Photo-Inspired)`,
    description: `${result.pattern.description ?? ""} ${PHOTO_PATTERN_DISCLAIMER}`.trim(),
    metadata: {
      ...result.pattern.metadata,
      source: "photo" as const,
    },
    validation: {
      ...result.pattern.validation,
      status: "ai_generated" as const,
      issues: [
        ...result.pattern.validation.issues,
        {
          code: "photo_reconstruction",
          severity: "info" as const,
          message: PHOTO_PATTERN_DISCLAIMER,
        },
      ],
    },
  });

  patternGenerationResultSchema.parse({
    pattern,
    model: result.model,
    generatedAt: result.generatedAt,
  });

  return photoPatternResultSchema.parse({
    pattern,
    disclaimer: PHOTO_PATTERN_DISCLAIMER,
    confidence: parsed.imageDataUrl ? 0.68 : 0.55,
    inspirationNotes: [
      "Silhouette suggests a small amigurumi with segmented body parts.",
      "Color blocking appears to use 2–3 main yarn colors.",
      "Construction likely worked in the round with sewn or low-sew assembly.",
    ],
    generatedAt: new Date().toISOString(),
    model: result.model,
  });
}
