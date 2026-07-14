import {
  generatedPatternSchema,
  patternValidationIssueSchema,
  patternValidationResultSchema,
  type GeneratedPatternSchema,
  type PatternValidationResultSchema,
} from "@/lib/schemas/pattern";

export type PatternTrustFlags = {
  ai_generated: boolean;
  ai_validated: boolean;
  user_tested: boolean;
  physically_tested: boolean;
};

export type PatternValidationOutput = PatternValidationResultSchema & {
  flags: PatternTrustFlags;
};

function parseIncreaseDecrease(instruction: string): {
  expectedDelta: number | null;
  hasIncrease: boolean;
  hasDecrease: boolean;
} {
  const lower = instruction.toLowerCase();
  const hasIncrease = /\binc\b|increase|\(\d+\s*sc,\s*inc\)/.test(lower);
  const hasDecrease = /\bdec\b|decrease|sc2tog|\(\d+\s*sc,\s*dec\)/.test(lower);

  const incMatch = lower.match(/inc[^)]*\)\s*x\s*(\d+)/);
  const decMatch = lower.match(/dec[^)]*\)\s*x\s*(\d+)/);

  if (incMatch) {
    return {
      expectedDelta: Number(incMatch[1]),
      hasIncrease: true,
      hasDecrease: false,
    };
  }
  if (decMatch) {
    return {
      expectedDelta: -Number(decMatch[1]),
      hasIncrease: false,
      hasDecrease: true,
    };
  }
  if (hasIncrease && !hasDecrease) {
    return { expectedDelta: null, hasIncrease: true, hasDecrease: false };
  }
  if (hasDecrease && !hasIncrease) {
    return { expectedDelta: null, hasIncrease: false, hasDecrease: true };
  }

  return { expectedDelta: null, hasIncrease, hasDecrease };
}

export function validatePattern(
  patternInput: unknown,
): PatternValidationOutput {
  const pattern = generatedPatternSchema.parse(patternInput);
  const issues: Array<{
    code: string;
    severity: "error" | "warning" | "info";
    message: string;
    rowNumber?: number;
    section?: string;
  }> = [];

  if (!pattern.materials.yarns.length) {
    issues.push({
      code: "missing_yarn",
      severity: "error",
      message: "Pattern must list at least one yarn requirement.",
    });
  }

  for (const section of pattern.sections) {
    const rows = [...section.rows].sort((a, b) => a.rowNumber - b.rowNumber);

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      const prev = rows[i - 1];

      if (i > 0 && row.rowNumber !== prev.rowNumber + 1) {
        issues.push({
          code: "missing_row",
          severity: "warning",
          message: `Gap in row numbering: expected row ${prev.rowNumber + 1}, found row ${row.rowNumber}.`,
          rowNumber: row.rowNumber,
          section: section.name,
        });
      }

      if (
        prev?.stitchCount != null &&
        row.stitchCount != null &&
        row.stitchCount !== prev.stitchCount
      ) {
        const { expectedDelta, hasIncrease, hasDecrease } =
          parseIncreaseDecrease(row.instruction);
        const actualDelta = row.stitchCount - prev.stitchCount;

        if (expectedDelta != null && expectedDelta !== actualDelta) {
          issues.push({
            code: "stitch_count_mismatch",
            severity: "error",
            message: `Row ${row.rowNumber} stitch count (${row.stitchCount}) does not match expected delta from row ${prev.rowNumber} (${prev.stitchCount} → expected ${prev.stitchCount + expectedDelta}).`,
            rowNumber: row.rowNumber,
            section: section.name,
          });
        } else if (
          expectedDelta == null &&
          hasIncrease &&
          actualDelta <= 0
        ) {
          issues.push({
            code: "increase_inconsistency",
            severity: "warning",
            message: `Row ${row.rowNumber} mentions increases but stitch count did not rise.`,
            rowNumber: row.rowNumber,
            section: section.name,
          });
        } else if (
          expectedDelta == null &&
          hasDecrease &&
          actualDelta >= 0
        ) {
          issues.push({
            code: "decrease_inconsistency",
            severity: "warning",
            message: `Row ${row.rowNumber} mentions decreases but stitch count did not fall.`,
            rowNumber: row.rowNumber,
            section: section.name,
          });
        }
      }

      if (row.stitchCount == null) {
        issues.push({
          code: "missing_stitch_count",
          severity: "info",
          message: `Row ${row.rowNumber} has no stitch count recorded.`,
          rowNumber: row.rowNumber,
          section: section.name,
        });
      }
    }
  }

  const hasAssemblySections = pattern.sections.some((s) =>
    /leg|arm|ear|tail|wing|part/i.test(s.name),
  );
  if (
    hasAssemblySections &&
    (!pattern.assemblyInstructions || pattern.assemblyInstructions.length === 0)
  ) {
    issues.push({
      code: "missing_assembly",
      severity: "warning",
      message:
        "Pattern has multiple parts but no assembly instructions were provided.",
    });
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const score = Math.max(0, 100 - errorCount * 20 - warningCount * 5);

  const flags: PatternTrustFlags = {
    ai_generated:
      pattern.validation?.status === "ai_generated" ||
      pattern.metadata?.source === "ai_generated" ||
      pattern.metadata?.source === "photo",
    ai_validated: true,
    user_tested: false,
    physically_tested: false,
  };

  const result = patternValidationResultSchema.parse({
    status: errorCount === 0 ? "ai_validated" : "ai_generated",
    isValid: errorCount === 0,
    score,
    issues: issues.map((i) => patternValidationIssueSchema.parse(i)),
    checkedAt: new Date().toISOString(),
  });

  return { ...result, flags };
}

export function applyValidationToPattern(
  pattern: GeneratedPatternSchema,
): GeneratedPatternSchema {
  const validation = validatePattern(pattern);
  const { flags, ...validationResult } = validation;
  void flags;
  return {
    ...pattern,
    validation: validationResult,
  };
}
