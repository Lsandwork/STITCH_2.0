import { describe, expect, it } from "vitest";
import {
  patternGenerationInputSchema,
  validateGeneratedPattern,
  validatePatternGenerationInput,
} from "@/lib/schemas/pattern";
import { makeValidPattern } from "./fixtures/pattern";

describe("patternGenerationInputSchema", () => {
  it("parses valid generation input", () => {
    const result = validatePatternGenerationInput({
      description: "A cozy granny square blanket for beginners.",
      projectType: "blanket",
      skillLevel: "beginner",
      terminology: "us",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.skillLevel).toBe("beginner");
      expect(result.data.terminology).toBe("us");
      expect(result.data.instructionFormat).toBe("written");
    }
  });

  it("rejects short descriptions", () => {
    const result = patternGenerationInputSchema.safeParse({
      description: "Too short",
      projectType: "blanket",
      skillLevel: "beginner",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing project type", () => {
    const result = patternGenerationInputSchema.safeParse({
      description: "A detailed project description here.",
      projectType: "",
      skillLevel: "intermediate",
    });

    expect(result.success).toBe(false);
  });
});

describe("generatedPatternSchema", () => {
  it("parses a complete generated pattern", () => {
    const result = validateGeneratedPattern(makeValidPattern());

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Test Amigurumi");
      expect(result.data.sections).toHaveLength(1);
      expect(result.data.materials.yarns).toHaveLength(1);
    }
  });

  it("rejects patterns without yarn requirements", () => {
    const result = validateGeneratedPattern(
      makeValidPattern({
        materials: {
          yarns: [],
          hookSize: "4.0mm",
        },
      }),
    );

    expect(result.success).toBe(false);
  });

  it("rejects patterns without sections", () => {
    const result = validateGeneratedPattern(
      makeValidPattern({
        sections: [],
      }),
    );

    expect(result.success).toBe(false);
  });
});
