import {
  generatedPatternSchema,
  patternGenerationInputSchema,
  patternGenerationResultSchema,
  type PatternGenerationInputSchema,
  type PatternGenerationResultSchema,
} from "@/lib/schemas/pattern";
import { getAIProvider, getConfiguredAIProviders, isMockMode } from "@/services/ai/provider";

function buildMockDachshundPattern(
  input: PatternGenerationInputSchema,
): PatternGenerationResultSchema {
  const now = new Date().toISOString();
  const hookSize = input.hookSize ?? "4.0mm (G-6)";
  const yarnWeight = input.yarnWeight ?? "worsted";
  const primaryColor = input.preferredColors?.[0] ?? "Chestnut Brown";
  const accentColor = input.preferredColors?.[1] ?? "Cream";

  const pattern = {
    title: "Longbody Dachshund Amigurumi",
    description:
      input.description ||
      "A low-sew dachshund plushie worked in the round with separate legs and embroidered features.",
    projectType: input.projectType || "amigurumi",
    skillLevel: input.skillLevel,
    terminology: input.terminology ?? "us",
    difficulty: input.skillLevel,
    estimatedTimeMinutes: 360,
    materials: {
      yarns: [
        {
          colorName: primaryColor,
          weight: yarnWeight,
          fiber: input.yarnFiber ?? "acrylic",
          yardage: 180,
          skeins: 1,
          notes: "Main body and head",
        },
        {
          colorName: accentColor,
          weight: yarnWeight,
          fiber: input.yarnFiber ?? "acrylic",
          yardage: 40,
          skeins: 1,
          notes: "Paws, snout, and inner ears",
        },
      ],
      hookSize,
      notions: [
        "Polyester fiberfill stuffing",
        "Stitch markers",
        "Tapestry needle",
        "Embroidery floss (black) for eyes and nose",
      ],
      safetyNotes: [
        "If using safety eyes, attach before closing the head.",
        "Keep small parts away from children under 3.",
      ],
    },
    gauge: {
      stitches: 16,
      rows: 18,
      measurement: "4 in / 10 cm",
      notes: "Worked in single crochet in the round with moderate tension.",
    },
    finishedMeasurements: {
      width: '4.5 in / 11 cm at shoulder',
      height: '4.5 in / 11 cm at shoulder',
      depth: '9 in / 23 cm nose to tail',
      notes:
        input.finishedDimensions ??
        '9 in / 23 cm nose to tail · low-sew amigurumi dachshund',
    },
    abbreviations: {
      ch: "chain",
      sc: "single crochet",
      inc: "increase (2 sc in same st)",
      dec: "decrease (sc2tog)",
      "sl st": "slip stitch",
      st: "stitch",
      MR: "magic ring",
    },
    sections: [
      {
        name: "Head",
        sortOrder: 0,
        instructions: "Worked in continuous rounds. Stuff firmly before closing.",
        rows: [
          { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
          { rowNumber: 2, instruction: "inc in each st around", stitchCount: 12 },
          {
            rowNumber: 3,
            instruction: "(sc, inc) x6 around",
            stitchCount: 18,
          },
          {
            rowNumber: 4,
            instruction: "(2 sc, inc) x6 around",
            stitchCount: 24,
          },
          {
            rowNumber: 5,
            instruction: "(3 sc, inc) x6 around",
            stitchCount: 30,
          },
          {
            rowNumber: 6,
            instruction: "sc in each st around",
            stitchCount: 30,
            notes: "Rows 6–9: place safety eyes between rows 7–8, 6 sts apart.",
          },
          {
            rowNumber: 7,
            instruction: "sc in each st around",
            stitchCount: 30,
          },
          {
            rowNumber: 8,
            instruction: "sc in each st around",
            stitchCount: 30,
          },
          {
            rowNumber: 9,
            instruction: "sc in each st around",
            stitchCount: 30,
          },
          {
            rowNumber: 10,
            instruction: "(3 sc, dec) x6 around",
            stitchCount: 24,
          },
          {
            rowNumber: 11,
            instruction: "(2 sc, dec) x6 around",
            stitchCount: 18,
          },
          {
            rowNumber: 12,
            instruction: "(sc, dec) x6 around",
            stitchCount: 12,
          },
          {
            rowNumber: 13,
            instruction: "dec x6 around, fasten off leaving long tail",
            stitchCount: 6,
          },
        ],
      },
      {
        name: "Body",
        sortOrder: 1,
        instructions:
          "Elongated sausage shape. Leave opening at neck end for joining head.",
        rows: [
          { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
          { rowNumber: 2, instruction: "inc in each st around", stitchCount: 12 },
          {
            rowNumber: 3,
            instruction: "(sc, inc) x6 around",
            stitchCount: 18,
          },
          {
            rowNumber: 4,
            instruction: "(2 sc, inc) x6 around",
            stitchCount: 24,
          },
          {
            rowNumber: 5,
            instruction: "sc in each st around",
            stitchCount: 24,
            notes: "Rows 5–14: maintain 24 sts for dachshund length.",
          },
          ...Array.from({ length: 9 }, (_, i) => ({
            rowNumber: 6 + i,
            instruction: "sc in each st around",
            stitchCount: 24,
          })),
          {
            rowNumber: 15,
            instruction: "(2 sc, dec) x6 around",
            stitchCount: 18,
          },
          {
            rowNumber: 16,
            instruction: "(sc, dec) x6 around",
            stitchCount: 12,
          },
          {
            rowNumber: 17,
            instruction: "dec x6 around, stuff firmly",
            stitchCount: 6,
          },
        ],
      },
      {
        name: "Legs (make 4)",
        sortOrder: 2,
        instructions: "Use accent color for paws. Stuff lightly.",
        rows: [
          { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
          { rowNumber: 2, instruction: "inc in each st around", stitchCount: 12 },
          {
            rowNumber: 3,
            instruction: "sc in each st around",
            stitchCount: 12,
          },
          {
            rowNumber: 4,
            instruction: "sc in each st around",
            stitchCount: 12,
          },
          {
            rowNumber: 5,
            instruction: "(2 sc, dec) x3 around, fasten off",
            stitchCount: 9,
          },
        ],
      },
      {
        name: "Tail",
        sortOrder: 3,
        rows: [
          { rowNumber: 1, instruction: "4 sc in MR", stitchCount: 4 },
          { rowNumber: 2, instruction: "inc in each st around", stitchCount: 8 },
          {
            rowNumber: 3,
            instruction: "sc in each st around",
            stitchCount: 8,
          },
          {
            rowNumber: 4,
            instruction: "sc in each st around",
            stitchCount: 8,
          },
          {
            rowNumber: 5,
            instruction: "dec x4 around, fasten off",
            stitchCount: 4,
          },
        ],
      },
      {
        name: "Ears (make 2)",
        sortOrder: 4,
        rows: [
          { rowNumber: 1, instruction: "4 sc in MR", stitchCount: 4 },
          { rowNumber: 2, instruction: "inc in each st around", stitchCount: 8 },
          {
            rowNumber: 3,
            instruction: "sc in each st around, fasten off",
            stitchCount: 8,
          },
        ],
      },
    ],
    assemblyInstructions: [
      "Attach head to neck opening using mattress stitch.",
      "Sew legs evenly along underside of body (2 front, 2 back).",
      "Attach tail to rear end, curving slightly upward.",
      "Fold ears and sew to top of head.",
      "Embroider nose and mouth with black floss if not using safety eyes.",
    ],
    finishingInstructions: [
      "Weave in all ends securely.",
      "Brush lightly for a velvet finish if using chenille yarn.",
    ],
    safetyNotes: [
      "Not suitable for unsupervised use by infants.",
      "Verify all joins are tight before gifting.",
    ],
    validation: {
      status: "ai_generated" as const,
      isValid: true,
      score: 88,
      issues: [],
      checkedAt: now,
    },
    metadata: {
      handedness: input.handedness ?? "right",
      construction: input.construction ?? "low_sew",
      eyeType: input.eyeType ?? "embroidered",
      chartPreference: input.instructionFormat ?? "written",
      source: "ai_generated" as const,
    },
  };

  const parsed = generatedPatternSchema.parse(pattern);

  return {
    pattern: parsed,
    rawModelOutput: undefined,
    model: isMockMode() ? "stitch-mock-v1" : getAIProvider().model,
    generatedAt: now,
  };
}

function buildGenerationPrompt(input: PatternGenerationInputSchema): string {
  return [
    "Generate a complete crochet pattern as JSON matching the required schema.",
    `Project description: ${input.description}`,
    `Project type: ${input.projectType}`,
    `Skill level: ${input.skillLevel}`,
    input.finishedDimensions
      ? `Finished dimensions: ${input.finishedDimensions}`
      : null,
    input.yarnWeight ? `Yarn weight: ${input.yarnWeight}` : null,
    input.yarnFiber ? `Fiber: ${input.yarnFiber}` : null,
    input.hookSize ? `Hook size: ${input.hookSize}` : null,
    input.preferredColors?.length
      ? `Colors: ${input.preferredColors.join(", ")}`
      : null,
    `Terminology: ${input.terminology ?? "us"}`,
    `Handedness: ${input.handedness ?? "right"}`,
    input.construction ? `Construction: ${input.construction}` : null,
    "Include materials, gauge, abbreviations, sections with numbered rows and stitch counts, assembly, and finishing.",
    "Use plain integers for rowNumber, stitchCount, sortOrder, and gauge numbers (not strings like R1).",
  ]
    .filter(Boolean)
    .join("\n");
}

async function generateWithProvider(
  provider: import("@/services/ai/provider").AIProvider,
  prompt: string,
): Promise<PatternGenerationResultSchema> {
  const pattern = await provider.generateJSON(prompt, generatedPatternSchema);

  return patternGenerationResultSchema.parse({
    pattern: {
      ...pattern,
      validation: pattern.validation ?? {
        status: "ai_generated",
        isValid: true,
        score: 75,
        issues: [],
        checkedAt: new Date().toISOString(),
      },
      metadata: {
        ...pattern.metadata,
        source: "ai_generated",
      },
    },
    model: provider.model,
    generatedAt: new Date().toISOString(),
  });
}

export async function generatePattern(
  input: unknown,
): Promise<PatternGenerationResultSchema> {
  const parsedInput = patternGenerationInputSchema.parse(input);

  if (isMockMode()) {
    return buildMockDachshundPattern(parsedInput);
  }

  const prompt = buildGenerationPrompt(parsedInput);
  const providers = getConfiguredAIProviders();
  let lastError: unknown;

  for (const provider of providers) {
    try {
      return await generateWithProvider(provider, prompt);
    } catch (error) {
      lastError = error;
      console.error(
        `[generatePattern] ${provider.name} failed, trying next provider:`,
        error,
      );
    }
  }

  console.error("[generatePattern] All AI providers failed:", lastError);
  throw new Error(
    lastError instanceof Error
      ? `Pattern generation failed: ${lastError.message}`
      : "Pattern generation failed. Please try again.",
  );
}
