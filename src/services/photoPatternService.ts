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
  analysisSource: z.enum(["ai", "mock"]).optional(),
});

export type PhotoPatternInput = z.infer<typeof photoPatternInputSchema>;
export type PhotoPatternResult = z.infer<typeof photoPatternResultSchema>;

function defaultPhotoAnalysis(description?: string) {
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

function mapConstruction(
  value?: string,
): "sewn" | "low_sew" | "seamless" | undefined {
  if (!value) return "low_sew";
  const lower = value.toLowerCase();
  if (lower.includes("seamless")) return "seamless";
  if (lower.includes("low")) return "low_sew";
  if (lower.includes("seam") || lower.includes("sew")) return "sewn";
  return "low_sew";
}

async function analyzePhotoInspiration(
  imageDataUrl: string,
  description?: string,
): Promise<{
  analysis: z.infer<typeof photoAnalysisSchema>;
  analysisSource: "ai" | "mock";
}> {
  const image = parseImageDataUrl(imageDataUrl);
  if (!image || !isSupportedVisionMimeType(image.mimeType)) {
    return {
      analysis: defaultPhotoAnalysis(description),
      analysisSource: "mock",
    };
  }

  if (isMockMode()) {
    return {
      analysis: photoAnalysisSchema.parse({
        projectType: "amigurumi",
        description:
          description ??
          "Amigurumi plushie inspired by uploaded photo with segmented body parts.",
        construction: "low_sew",
        colors: ["Brown", "Cream"],
        inspirationNotes: [
          "Demo mode: AI keys are not configured — using an approximate mock analysis.",
          "Silhouette suggests a small amigurumi with segmented body parts.",
        ],
        confidence: 0.55,
      }),
      analysisSource: "mock",
    };
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

  try {
    return {
      analysis: await provider.generateJSONWithImage(
        prompt,
        photoAnalysisSchema,
        image,
      ),
      analysisSource: "ai",
    };
  } catch (error) {
    console.error("[analyzePhotoInspiration] Vision analysis failed:", error);
    return {
      analysis: defaultPhotoAnalysis(description),
      analysisSource: "mock",
    };
  }
}

export async function generatePatternFromPhoto(
  input: unknown,
): Promise<PhotoPatternResult> {
  const parsed = photoPatternInputSchema.parse(input);

  const photoAnalysis = parsed.imageDataUrl
    ? await analyzePhotoInspiration(parsed.imageDataUrl, parsed.description)
    : {
        analysis: photoAnalysisSchema.parse({
          projectType: "amigurumi",
          description:
            parsed.description ??
            "Amigurumi plushie inspired by uploaded photo — long body, short legs, floppy ears.",
          construction: "low_sew",
          colors: parsed.preferredColors ?? ["Brown", "Cream"],
          inspirationNotes: [
            "No photo provided — generated from text description only.",
          ],
          confidence: 0.45,
        }),
        analysisSource: "mock" as const,
      };

  const analysis = photoAnalysis.analysis;

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
    construction: mapConstruction(analysis.construction),
    eyeType: "embroidered" as const,
  };

  const result = await generatePattern(generationInput);
  const generatedAt = new Date().toISOString();

  const pattern = generatedPatternSchema.parse({
    ...result.pattern,
    title: `${result.pattern.title} (Photo-Inspired)`,
    description: `${result.pattern.description ?? ""} ${PHOTO_PATTERN_DISCLAIMER}`.trim(),
    metadata: {
      ...result.pattern.metadata,
      source: "photo" as const,
      construction:
        result.pattern.metadata?.construction ?? mapConstruction(analysis.construction),
    },
    validation: {
      ...result.pattern.validation,
      status: "ai_generated" as const,
      checkedAt: result.pattern.validation.checkedAt ?? generatedAt,
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
    generatedAt: result.generatedAt ?? generatedAt,
  });

  return photoPatternResultSchema.parse({
    pattern,
    disclaimer: PHOTO_PATTERN_DISCLAIMER,
    confidence: analysis.confidence,
    inspirationNotes: analysis.inspirationNotes,
    generatedAt,
    model: result.model,
    analysisSource: photoAnalysis.analysisSource,
  });
}
