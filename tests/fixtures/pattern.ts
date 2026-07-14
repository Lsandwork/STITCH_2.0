import type { GeneratedPatternSchema } from "@/lib/schemas/pattern";

const checkedAt = "2026-07-13T12:00:00.000Z";

export function makeValidPattern(
  overrides?: Partial<GeneratedPatternSchema>,
): GeneratedPatternSchema {
  return {
    title: "Test Amigurumi",
    description: "A small test pattern.",
    projectType: "amigurumi",
    skillLevel: "beginner",
    terminology: "us",
    difficulty: "beginner",
    materials: {
      yarns: [
        {
          colorName: "Coral",
          weight: "worsted",
          fiber: "acrylic",
          yardage: 100,
          skeins: 1,
        },
      ],
      hookSize: "4.0mm",
      notions: ["Stuffing"],
    },
    gauge: {
      stitches: 16,
      rows: 18,
      measurement: "4 in / 10 cm",
    },
    finishedMeasurements: {
      height: "4 in",
    },
    abbreviations: {
      sc: "single crochet",
      inc: "increase",
      dec: "decrease",
      MR: "magic ring",
    },
    sections: [
      {
        name: "Body",
        sortOrder: 0,
        rows: [
          { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
          { rowNumber: 2, instruction: "inc in each st around", stitchCount: 12 },
          { rowNumber: 3, instruction: "(sc, inc) x6 around", stitchCount: 18 },
          { rowNumber: 4, instruction: "sc in each st around", stitchCount: 18 },
        ],
      },
    ],
    validation: {
      status: "ai_generated",
      isValid: true,
      score: 90,
      issues: [],
      checkedAt,
    },
    ...overrides,
  };
}
