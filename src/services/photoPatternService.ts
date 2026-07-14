import { z } from "zod";
import {
  generatedPatternSchema,
  patternGenerationResultSchema,
} from "@/lib/schemas/pattern";
import {
  isSupportedVisionMimeType,
  parseImageDataUrl,
} from "@/lib/ai-image-utils";
import { generatePattern } from "@/services/patternGenerationService";
import { getAIProvider, isMockMode } from "@/services/ai/provider";

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

const photoAnalysisSchema = z.object({
  projectType: z.string(),
  description: z.string(),
  construction: z.string().optional(),
  colors: z.array(z.string()).default([]),
  inspirationNotes: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1),
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

async function analyzePhotoInspiration(
  imageDataUrl: string,
  description?: string,
): Promise<z.infer<typeof photoAnalysisSchema>> {
  const image = parseImageDataUrl(imageDataUrl);
  if (!image || !isSupportedVisionMimeType(image.mimeType)) {
    return photoAnalysisSchema.parse({
      projectType: "amigurumi",
      description:
        description ??
        "Amigurumi plushie inspired by uploaded photo — long body, short legs, floppy ears.",
      construction: "low_sew",
      colors: ["Brown", "Cream"],
      inspirationNotes: [
        "Photo could not be analyzed in detail — using maker description.",
      ],
      confidence: 0.45,
    });
  }

  if (isMockMode()) {
    return photoAnalysisSchema.parse({
      projectType: "amigurumi",
      description:
        description ??
        "Amigurumi plushie inspired by uploaded photo with segmented body parts.",
      construction: "low_sew",
      colors: ["Brown", "Cream"],
      inspirationNotes: [
        "Silhouette suggests a small amigurumi with segmented body parts.",
        "Color blocking appears to use 2–3 main yarn colors.",
      ],
      confidence: 0.55,
    });
  }

  const provider = getAIProvider();
  const prompt = [
    "Analyze this crochet or craft photo for pattern reconstruction.",
    description ? `Maker notes: ${description}` : null,
    "Describe what you actually see: project type, shape, colors, construction clues, and notable details.",
    "Do not claim to copy a commercial pattern — this is inspiration only.",
    "Return JSON with projectType, description, construction, colors, inspirationNotes, confidence.",
  ]
    .filter(Boolean)
    .join("\n");

  return provider.generateJSONWithImage(prompt, photoAnalysisSchema, image);
}

export async function generatePatternFromPhoto(
  input: unknown,
): Promise<PhotoPatternResult> {
  const parsed = photoPatternInputSchema.parse(input);

  const analysis = parsed.imageDataUrl
    ? await analyzePhotoInspiration(parsed.imageDataUrl, parsed.description)
    : photoAnalysisSchema.parse({
        projectType: "amigurumi",
        description:
          parsed.description ??
          "Amigurumi plushie inspired by uploaded photo — long body, short legs, floppy ears.",
        construction: "low_sew",
        colors: parsed.preferredColors ?? ["Brown", "Cream"],
        inspirationNotes: ["No photo provided — generated from text description only."],
        confidence: 0.45,
      });

  const generationInput = {
    description: parsed.description ?? analysis.description,
    projectType: analysis.projectType,
    skillLevel: parsed.skillLevel,
    terminology: parsed.terminology,
    preferredColors:
      parsed.preferredColors?.length
        ? parsed.preferredColors
        : analysis.colors.length
          ? analysis.colors
          : ["Brown", "Cream"],
    construction: (analysis.construction?.includes("seam")
      ? "seamed"
      : "low_sew") as "low_sew" | "seamed",
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
    confidence: analysis.confidence,
    inspirationNotes: analysis.inspirationNotes,
    generatedAt: new Date().toISOString(),
    model: result.model,
  });
}
