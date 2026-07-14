import {
  visionScanResultSchema,
  visionScanSubmissionSchema,
  type VisionScanResult,
  type VisionScanSubmission,
} from "@/lib/schemas/vision";
import { getAIProvider, isMockMode } from "@/services/ai/provider";

const CONFIDENCE_THRESHOLD = 0.85;

function qualifySummary(summary: string, confidence: number): string {
  if (confidence >= CONFIDENCE_THRESHOLD) {
    return summary;
  }
  return `Possible finding (confidence ${Math.round(confidence * 100)}%): ${summary.replace(/^(Detected|Likely|Found)/i, "Possibly")}`;
}

function buildMockVisionResult(
  submission: VisionScanSubmission,
): VisionScanResult {
  const confidence =
    submission.scanType === "row_counter"
      ? 0.92
      : submission.scanType === "stitch_check"
        ? 0.78
        : 0.81;

  const row = submission.currentRow ?? 24;
  const baseSummary =
    submission.scanType === "row_counter"
      ? `Estimated row ${row} with consistent edge tension.`
      : submission.scanType === "pattern_read"
        ? "Single crochet in the round detected; moderate tension variation near join."
        : "Single crochet fabric detected with 2 possible missed stitches near the join.";

  const findings =
    confidence >= CONFIDENCE_THRESHOLD
      ? [
          {
            type: "stitch_pattern",
            description: "Single crochet worked in continuous rounds.",
            severity: "info" as const,
            confidence: 0.91,
          },
        ]
      : [
          {
            type: "stitch_count",
            description:
              "Stitch count may be off by 1–2 near the round join — manual count recommended.",
            severity: "warning" as const,
            confidence: 0.72,
          },
        ];

  return visionScanResultSchema.parse({
    detectedStitchType: "single crochet",
    estimatedRowNumber: row,
    estimatedStitchCount: confidence >= CONFIDENCE_THRESHOLD ? 42 : undefined,
    likelyMissedStitches: confidence < CONFIDENCE_THRESHOLD ? 2 : 0,
    likelyExtraStitches: 0,
    edgeInconsistency: confidence < CONFIDENCE_THRESHOLD,
    tensionInconsistency: confidence < 0.9,
    possibleIncrease: false,
    possibleDecrease: false,
    confidence,
    problemAreas:
      confidence < CONFIDENCE_THRESHOLD
        ? [{ x: 0.62, y: 0.48, width: 0.12, height: 0.1, label: "join area" }]
        : [],
    findings,
    suggestedCorrections:
      confidence < CONFIDENCE_THRESHOLD
        ? [
            "Recount live stitches before continuing.",
            "Check that the round join is not hiding a skipped stitch.",
          ]
        : ["Continue to the next round — stitch pattern looks consistent."],
    summary: qualifySummary(baseSummary, confidence),
  });
}

export async function analyzeVisionImage(
  submission: unknown,
): Promise<VisionScanResult> {
  const parsed = visionScanSubmissionSchema.parse(submission);

  if (isMockMode() || !parsed.imageDataUrl) {
    return buildMockVisionResult(parsed);
  }

  const provider = getAIProvider();
  const prompt = [
    "Analyze this crochet work image and return JSON matching the vision scan result schema.",
    `Scan type: ${parsed.scanType}`,
    parsed.currentRow ? `User believes they are on row ${parsed.currentRow}` : null,
    `IMPORTANT: If confidence is below ${CONFIDENCE_THRESHOLD}, use cautious language in summary and findings. Never claim certainty below that threshold.`,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await provider.generateJSON(prompt, visionScanResultSchema);

  return visionScanResultSchema.parse({
    ...result,
    summary: result.summary
      ? qualifySummary(result.summary, result.confidence)
      : qualifySummary("Analysis complete.", result.confidence),
    findings: result.findings.map((f) => ({
      ...f,
      description:
        (f.confidence ?? result.confidence) >= CONFIDENCE_THRESHOLD
          ? f.description
          : `Possible: ${f.description}`,
    })),
  });
}

export { CONFIDENCE_THRESHOLD as VISION_CONFIDENCE_THRESHOLD };
