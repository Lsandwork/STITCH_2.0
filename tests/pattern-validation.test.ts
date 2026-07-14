import { describe, expect, it } from "vitest";
import { validatePattern } from "@/services/patternValidationService";
import { makeValidPattern } from "./fixtures/pattern";

describe("patternValidationService", () => {
  it("validates a consistent pattern with no errors", () => {
    const result = validatePattern(makeValidPattern());

    expect(result.isValid).toBe(true);
    expect(result.status).toBe("ai_validated");
    expect(result.issues.filter((i) => i.severity === "error")).toHaveLength(0);
    expect(result.flags.ai_validated).toBe(true);
  });

  it("detects row numbering gaps", () => {
    const result = validatePattern(
      makeValidPattern({
        sections: [
          {
            name: "Body",
            sortOrder: 0,
            rows: [
              { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
              { rowNumber: 3, instruction: "sc in each st around", stitchCount: 12 },
            ],
          },
        ],
      }),
    );

    const gap = result.issues.find((i) => i.code === "missing_row");
    expect(gap).toBeDefined();
    expect(gap?.severity).toBe("warning");
  });

  it("detects stitch count mismatches on increase rows", () => {
    const result = validatePattern(
      makeValidPattern({
        sections: [
          {
            name: "Body",
            sortOrder: 0,
            rows: [
              { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
              {
                rowNumber: 2,
                instruction: "(sc, inc) x6 around",
                stitchCount: 20,
              },
            ],
          },
        ],
      }),
    );

    const mismatch = result.issues.find((i) => i.code === "stitch_count_mismatch");
    expect(mismatch).toBeDefined();
    expect(mismatch?.severity).toBe("error");
    expect(result.isValid).toBe(false);
  });

  it("warns when multi-part patterns lack assembly instructions", () => {
    const result = validatePattern(
      makeValidPattern({
        sections: [
          {
            name: "Leg (make 2)",
            sortOrder: 0,
            rows: [
              { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
            ],
          },
        ],
        assemblyInstructions: [],
      }),
    );

    const assembly = result.issues.find((i) => i.code === "missing_assembly");
    expect(assembly).toBeDefined();
    expect(assembly?.severity).toBe("warning");
  });

  it("lowers score when errors and warnings are present", () => {
    const clean = validatePattern(makeValidPattern());
    const dirty = validatePattern(
      makeValidPattern({
        sections: [
          {
            name: "Arm",
            sortOrder: 0,
            rows: [
              { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
              { rowNumber: 3, instruction: "inc in each st", stitchCount: 6 },
            ],
          },
        ],
        assemblyInstructions: [],
      }),
    );

    expect(dirty.score).toBeLessThan(clean.score);
  });
});
