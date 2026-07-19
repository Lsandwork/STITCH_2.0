import { z } from "zod";

export const visionScanTypeSchema = z.enum([
  "row_counter",
  "stitch_check",
  "pattern_read",
  "general",
]);

export const visionScanStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const visionProblemAreaSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().min(0).max(1),
  height: z.number().min(0).max(1),
  label: z.string().optional(),
});

export const visionScanFindingSchema = z.object({
  type: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(["info", "warning", "error"]).default("info"),
  confidence: z.number().min(0).max(1).optional(),
});

export const visionScanResultSchema = z.object({
  detectedStitchType: z.string().optional(),
  estimatedRowNumber: z.number().int().positive().optional(),
  estimatedStitchCount: z.number().int().nonnegative().optional(),
  likelyMissedStitches: z.number().int().nonnegative().optional(),
  likelyExtraStitches: z.number().int().nonnegative().optional(),
  edgeInconsistency: z.boolean().optional(),
  tensionInconsistency: z.boolean().optional(),
  possibleIncrease: z.boolean().optional(),
  possibleDecrease: z.boolean().optional(),
  confidence: z.number().min(0).max(1),
  problemAreas: z.array(visionProblemAreaSchema).default([]),
  findings: z.array(visionScanFindingSchema).default([]),
  suggestedCorrections: z.array(z.string()).default([]),
  summary: z.string().optional(),
  /** Whether the result came from a live model or a mock/fallback path. */
  analysisSource: z.enum(["ai", "mock"]).optional(),
});

export const visionScanSubmissionSchema = z.object({
  projectId: z.string().optional(),
  currentRow: z.number().int().positive().optional(),
  scanType: visionScanTypeSchema.default("stitch_check"),
  imageDataUrl: z.string().optional(),
  storagePath: z.string().optional(),
});

export type VisionScanResult = z.infer<typeof visionScanResultSchema>;
export type VisionScanSubmission = z.infer<typeof visionScanSubmissionSchema>;
export type VisionScanFinding = z.infer<typeof visionScanFindingSchema>;

export function validateVisionScanResult(data: unknown) {
  return visionScanResultSchema.safeParse(data);
}
