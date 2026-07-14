import { describe, expect, it } from "vitest";
import {
  visionScanResultSchema,
  visionScanSubmissionSchema,
  validateVisionScanResult,
} from "@/lib/schemas/vision";

describe("vision schemas", () => {
  it("parses a complete scan result", () => {
    const result = validateVisionScanResult({
      detectedStitchType: "single crochet",
      estimatedRowNumber: 12,
      estimatedStitchCount: 24,
      likelyMissedStitches: 1,
      confidence: 0.76,
      problemAreas: [
        { x: 0.2, y: 0.4, width: 0.1, height: 0.1, label: "Missed stitch" },
      ],
      findings: [
        {
          type: "stitch_gap",
          description: "Possible skipped stitch near edge.",
          severity: "warning",
          confidence: 0.7,
        },
      ],
      suggestedCorrections: ["Rip back one stitch and re-work the edge."],
      summary: "One likely missed stitch detected.",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.findings).toHaveLength(1);
      expect(result.data.problemAreas).toHaveLength(1);
    }
  });

  it("applies defaults for optional arrays", () => {
    const result = visionScanResultSchema.parse({
      confidence: 0.5,
    });

    expect(result.problemAreas).toEqual([]);
    expect(result.findings).toEqual([]);
    expect(result.suggestedCorrections).toEqual([]);
  });

  it("rejects confidence outside 0–1", () => {
    const result = visionScanResultSchema.safeParse({
      confidence: 1.5,
    });

    expect(result.success).toBe(false);
  });

  it("parses scan submission with defaults", () => {
    const result = visionScanSubmissionSchema.safeParse({
      currentRow: 5,
      imageDataUrl: "data:image/png;base64,abc",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scanType).toBe("stitch_check");
    }
  });

  it("rejects problem areas outside normalized bounds", () => {
    const result = visionScanResultSchema.safeParse({
      confidence: 0.8,
      problemAreas: [{ x: 1.2, y: 0.5, width: 0.1, height: 0.1 }],
    });

    expect(result.success).toBe(false);
  });
});
