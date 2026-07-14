import { z } from "zod";
import {
  generatedPatternSchema,
  type GeneratedPatternSchema,
} from "@/lib/schemas/pattern";

export const US_TO_UK_TERMINOLOGY: Record<string, string> = {
  "single crochet": "double crochet",
  sc: "dc",
  "half double crochet": "half treble",
  hdc: "htr",
  "double crochet": "treble",
  dc: "tr",
  "treble crochet": "double treble",
  tr: "dtr",
  "double treble": "triple treble",
  dtr: "ttr",
  "slip stitch": "slip stitch",
  "sl st": "sl st",
  "magic ring": "magic ring",
  MR: "MR",
  increase: "increase",
  inc: "inc",
  decrease: "decrease",
  dec: "dec",
};

export const UK_TO_US_TERMINOLOGY: Record<string, string> = Object.fromEntries(
  Object.entries(US_TO_UK_TERMINOLOGY).map(([us, uk]) => [uk, us]),
);

export const patternTranslationInputSchema = z.object({
  pattern: generatedPatternSchema,
  targetTerminology: z.enum(["us", "uk"]),
  expandAbbreviations: z.boolean().default(false),
  simplifyInstructions: z.boolean().default(false),
  includeLeftHandedNotes: z.boolean().default(false),
  versionLabel: z.string().optional(),
});

export const patternTranslationMetadataSchema = z.object({
  sourceTerminology: z.enum(["us", "uk"]),
  targetTerminology: z.enum(["us", "uk"]),
  versionLabel: z.string(),
  translatedAt: z.string().datetime(),
  expandAbbreviations: z.boolean(),
  simplifyInstructions: z.boolean(),
  includeLeftHandedNotes: z.boolean(),
  leftHandedNotes: z.array(z.string()).optional(),
});

export const patternTranslationResultSchema = z.object({
  pattern: generatedPatternSchema,
  metadata: patternTranslationMetadataSchema,
});

export type PatternTranslationInput = z.infer<
  typeof patternTranslationInputSchema
>;
export type PatternTranslationResult = z.infer<
  typeof patternTranslationResultSchema
>;

const LEFT_HANDED_NOTES = [
  "For left-handed crocheters, work rounds in the opposite direction (counter-clockwise).",
  "Place stitch markers on the right side of your work to track round starts.",
  "Mirror any directional shaping notes (e.g., ear placement) to the opposite side.",
];

function translateTerm(text: string, toUk: boolean): string {
  const map = toUk ? US_TO_UK_TERMINOLOGY : UK_TO_US_TERMINOLOGY;
  let result = text;

  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const replacement = map[key];
    if (!replacement) continue;
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    result = result.replace(regex, (match) => {
      if (match === match.toUpperCase()) return replacement.toUpperCase();
      if (match[0] === match[0]?.toUpperCase()) {
        return replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }
      return replacement;
    });
  }

  return result;
}

function expandAbbreviationsInText(
  text: string,
  abbreviations: Record<string, string>,
): string {
  let result = text;
  const sortedKeys = Object.keys(abbreviations).sort(
    (a, b) => b.length - a.length,
  );
  for (const abbr of sortedKeys) {
    const full = abbreviations[abbr];
    const regex = new RegExp(
      `\\b${abbr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "g",
    );
    result = result.replace(regex, full);
  }
  return result;
}

function simplifyInstruction(text: string): string {
  return text
    .replace(/\(\s*(\d+\s*sc,\s*inc)\s*\)\s*x\s*(\d+)/gi, "increase $2 times evenly")
    .replace(/\(\s*(\d+\s*sc,\s*dec)\s*\)\s*x\s*(\d+)/gi, "decrease $2 times evenly")
    .replace(/\baround\b/gi, "in each stitch around")
    .replace(/\bMR\b/g, "magic ring");
}

function translatePatternBody(
  pattern: GeneratedPatternSchema,
  input: PatternTranslationInput,
): GeneratedPatternSchema {
  const toUk =
    input.targetTerminology === "uk" && pattern.terminology === "us";
  const toUs =
    input.targetTerminology === "us" && pattern.terminology === "uk";
  const shouldTranslate = toUk || toUs;

  const translateText = (text: string) => {
    let result = shouldTranslate ? translateTerm(text, toUk) : text;
    if (input.expandAbbreviations) {
      result = expandAbbreviationsInText(result, pattern.abbreviations);
    }
    if (input.simplifyInstructions) {
      result = simplifyInstruction(result);
    }
    return result;
  };

  const translatedAbbreviations = { ...pattern.abbreviations };
  if (shouldTranslate) {
    for (const [key, value] of Object.entries(pattern.abbreviations)) {
      translatedAbbreviations[key] = translateTerm(value, toUk);
    }
  }

  return {
    ...pattern,
    terminology: input.targetTerminology,
    abbreviations: translatedAbbreviations,
    sections: pattern.sections.map((section) => ({
      ...section,
      instructions: section.instructions
        ? translateText(section.instructions)
        : undefined,
      rows: section.rows.map((row) => ({
        ...row,
        instruction: translateText(row.instruction),
        notes: row.notes ? translateText(row.notes) : undefined,
      })),
    })),
    assemblyInstructions: pattern.assemblyInstructions?.map(translateText),
    finishingInstructions: pattern.finishingInstructions?.map(translateText),
    safetyNotes: pattern.safetyNotes?.map(translateText),
    materials: {
      ...pattern.materials,
      safetyNotes: pattern.materials.safetyNotes?.map(translateText),
    },
    gauge: {
      ...pattern.gauge,
      notes: pattern.gauge.notes
        ? translateText(pattern.gauge.notes)
        : undefined,
    },
    metadata: {
      ...pattern.metadata,
      handedness: pattern.metadata?.handedness ?? "right",
    },
  };
}

export function translatePattern(input: unknown): PatternTranslationResult {
  const parsed = patternTranslationInputSchema.parse(input);
  const versionLabel =
    parsed.versionLabel ??
    `${parsed.targetTerminology.toUpperCase()}-v${Date.now().toString(36)}`;

  const translatedPattern = translatePatternBody(parsed.pattern, parsed);

  return patternTranslationResultSchema.parse({
    pattern: translatedPattern,
    metadata: {
      sourceTerminology: parsed.pattern.terminology,
      targetTerminology: parsed.targetTerminology,
      versionLabel,
      translatedAt: new Date().toISOString(),
      expandAbbreviations: parsed.expandAbbreviations,
      simplifyInstructions: parsed.simplifyInstructions,
      includeLeftHandedNotes: parsed.includeLeftHandedNotes,
      leftHandedNotes: parsed.includeLeftHandedNotes
        ? LEFT_HANDED_NOTES
        : undefined,
    },
  });
}
