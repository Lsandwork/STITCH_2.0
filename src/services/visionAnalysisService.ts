import {
  visionScanResultSchema,
  visionScanSubmissionSchema,
  type VisionScanResult,
  type VisionScanSubmission,
} from "@/lib/schemas/vision";
import {
  isSupportedVisionMimeType,
  parseImageDataUrl,
} from "@/lib/ai-image-utils";
import { buildProjectContextBlock } from "@/lib/ai-user-context";
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
    analysisSource: "mock",
  });
}

function buildVisionPrompt(submission: VisionScanSubmission): string {
  const projectContext = buildProjectContextBlock(submission.projectId);

  return [
    "You are Stitch Vision — an expert crochet work analyzer.",
    "Study the attached photo carefully. Base every finding on visible stitches, yarn, shaping, and construction.",
    "Do not invent details that are not visible. Lower confidence when the image is blurry, dark, or partially cropped.",
    "",
    `Scan type: ${submission.scanType}`,
    submission.currentRow
      ? `Maker believes they are on row/round ${submission.currentRow}. Verify or refine this from the image when possible.`
      : "Estimate the current row/round from visible shaping if possible.",
    projectContext,
    "",
    "For stitch_check: look for missed stitches, extra stitches, accidental increases/decreases, tension issues, and join problems.",
    "For row_counter: estimate the current row/round from visible rounds, markers, or shaping.",
    "For pattern_read: identify stitch pattern, construction method, and working direction.",
    "For general: provide the most useful crochet analysis for the maker.",
    "",
    "problemAreas coordinates must be normalized 0-1 relative to the image (x,y = top-left).",
    `If confidence is below ${CONFIDENCE_THRESHOLD}, use cautious language and avoid certainty.`,
    "Return JSON matching the required schema.",
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeVisionResult(
  result: VisionScanResult,
  analysisSource: "ai" | "mock" = "ai",
): VisionScanResult {
  return visionScanResultSchema.parse({
    ...result,
    confidence: Math.min(1, Math.max(0, result.confidence)),
    summary: result.summary
      ? qualifySummary(result.summary, result.confidence)
      : qualifySummary("Analysis complete.", result.confidence),
    findings: result.findings.map((finding) => ({
      ...finding,
      description:
        (finding.confidence ?? result.confidence) >= CONFIDENCE_THRESHOLD
          ? finding.description
          : `Possible: ${finding.description}`,
    })),
    analysisSource,
  });
}

export async function analyzeVisionImage(
  submission: unknown,
): Promise<VisionScanResult> {
  const parsed = visionScanSubmissionSchema.parse(submission);
  const image = parsed.imageDataUrl
    ? parseImageDataUrl(parsed.imageDataUrl)
    : null;

  if (
    isMockMode() ||
    !image ||
    !isSupportedVisionMimeType(image.mimeType)
  ) {
    return buildMockVisionResult(parsed);
  }

  const provider = getAIProvider();
  const prompt = buildVisionPrompt(parsed);

  try {
    const result = await provider.generateJSONWithImage(
      prompt,
      visionScanResultSchema,
      image,
    );
    return normalizeVisionResult(result, "ai");
  } catch (error) {
    console.error("[visionAnalysisService] Vision AI failed, using mock fallback:", error);
    const fallback = buildMockVisionResult(parsed);
    return {
      ...fallback,
      summary: `Demo fallback (live analysis unavailable): ${fallback.summary ?? "Review your stitches manually."}`,
      analysisSource: "mock",
    };
  }
}

export { CONFIDENCE_THRESHOLD as VISION_CONFIDENCE_THRESHOLD };
