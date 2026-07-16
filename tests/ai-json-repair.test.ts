import { describe, expect, it } from "vitest";
import { generatedPatternSchema } from "@/lib/schemas/pattern";
import { parseAiJson, repairAiJson, repairPatternJson } from "@/lib/ai-json-repair";
import { makeValidPattern } from "./fixtures/pattern";

describe("repairAiJson", () => {
  it("coerces nested row instruction objects into strings", () => {
    const repaired = repairPatternJson({
      ...makeValidPattern(),
      previewImageUrl: "not-a-valid-url",
      sections: [
        {
          name: "Head",
          sortOrder: 0,
          rows: [
            {
              rowNumber: 1,
              instruction: { text: "6 sc in MR" },
              notes: { note: "Use a marker" },
              stitchCount: "6",
            },
          ],
        },
      ],
    });

    const parsed = generatedPatternSchema.parse(repaired);
    expect(parsed.sections[0].rows[0].instruction).toBe("6 sc in MR");
    expect(parsed.sections[0].rows[0].notes).toBe("Use a marker");
    expect(parsed.previewImageUrl).toBeUndefined();
  });

  it("normalizes invalid construction values", () => {
    const repaired = repairPatternJson({
      ...makeValidPattern(),
      metadata: { construction: "seamed" },
    });

    const parsed = generatedPatternSchema.parse(repaired);
    expect(parsed.metadata?.construction).toBe("sewn");
  });

  it("repairs photo analysis payloads", () => {
    const repaired = repairAiJson({
      projectType: { value: "amigurumi" },
      description: { text: "Small dinosaur plushie" },
      construction: "low sew",
      colors: [{ name: "Sage" }, "Cream"],
      inspirationNotes: [{ note: "Short arms" }],
      confidence: "0.8",
    }) as Record<string, unknown>;

    expect(repaired.projectType).toBe("amigurumi");
    expect(repaired.description).toBe("Small dinosaur plushie");
    expect(repaired.colors).toEqual(["Sage", "Cream"]);
    expect(repaired.confidence).toBe(0.8);
  });

  it("parses repaired malformed pattern json", () => {
    const malformed = {
      title: "Gemini Pattern",
      projectType: "amigurumi",
      skillLevel: "intermediate",
      terminology: "us",
      difficulty: "intermediate",
      previewImageUrl: "/assets/local.jpg",
      materials: {
        yarns: [{ colorName: "Brown", weight: "worsted", yardage: "120" }],
        hookSize: "4.0mm",
      },
      gauge: { stitches: "16", rows: "18", measurement: "4 in" },
      finishedMeasurements: { height: "8 in" },
      abbreviations: [{ abbr: "sc", meaning: "single crochet" }],
      sections: [
        {
          name: "Body",
          sortOrder: "0",
          rows: [
            {
              rowNumber: "1",
              instruction: { text: "6 sc in MR" },
              stitchCount: "6",
            },
          ],
        },
      ],
      validation: {
        status: "ai_generated",
        isValid: "true",
        score: "82",
        issues: [],
        checkedAt: "2026-07-15",
      },
      metadata: { construction: "seamed" },
    };

    const parsed = parseAiJson(
      generatedPatternSchema,
      malformed,
      "Test",
    );

    expect(parsed.title).toBe("Gemini Pattern");
    expect(parsed.sections[0].rows[0].instruction).toBe("6 sc in MR");
    expect(parsed.metadata?.construction).toBe("sewn");
    expect(parsed.previewImageUrl).toBeUndefined();
  });
});
