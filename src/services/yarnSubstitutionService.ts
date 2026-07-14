import {
  yarnSubstitutionInputSchema,
  yarnSubstitutionRecommendationSchema,
  yarnSubstitutionResultSchema,
  type YarnSubstitutionInput,
  type YarnSubstitutionResult,
} from "@/lib/schemas/yarn";
import { DEMO_YARN_PREVIEW } from "@/lib/demo-data";

type YarnProfile = {
  id?: string;
  name: string;
  brand?: string;
  weight: string;
  fiber?: string;
  yardage?: number;
  hook?: string;
  inInventory: boolean;
};

const WEIGHT_ORDER = [
  "lace",
  "fingering",
  "sport",
  "dk",
  "worsted",
  "aran",
  "bulky",
  "super_bulky",
  "jumbo",
];

const DEMO_INVENTORY: YarnProfile[] = [
  {
    id: "demo-yarn-coral",
    name: "Bernat Velvet",
    brand: "Bernat",
    weight: "worsted",
    fiber: "polyester",
    yardage: 220,
    hook: "5.0mm",
    inInventory: true,
  },
  {
    id: "demo-yarn-teal",
    name: "Paintbox Cotton DK",
    brand: "Paintbox",
    weight: "dk",
    fiber: "cotton",
    yardage: 137,
    hook: "4.0mm",
    inInventory: true,
  },
  {
    id: "demo-yarn-gold",
    name: "Red Heart Super Saver",
    brand: "Red Heart",
    weight: "worsted",
    fiber: "acrylic",
    yardage: 364,
    hook: "5.5mm",
    inInventory: true,
  },
  {
    id: "demo-yarn-lavender",
    name: "Caron Simply Soft",
    brand: "Caron",
    weight: "worsted",
    fiber: "acrylic",
    yardage: 315,
    hook: "5.0mm",
    inInventory: true,
  },
  {
    id: "demo-yarn-cream",
    name: "Lion Brand Wool-Ease",
    brand: "Lion Brand",
    weight: "worsted",
    fiber: "acrylic/wool blend",
    yardage: 197,
    hook: "6.0mm",
    inInventory: true,
  },
];

function normalizeWeight(weight?: string): string {
  if (!weight) return "worsted";
  const lower = weight.toLowerCase().replace(/\s+/g, "_");
  if (WEIGHT_ORDER.includes(lower)) return lower;
  if (/worsted|4\s*medium/i.test(weight)) return "worsted";
  if (/dk|3\s*light/i.test(weight)) return "dk";
  if (/bulky|5\s*bulky/i.test(weight)) return "bulky";
  if (/fingering|1\s*super fine/i.test(weight)) return "fingering";
  return lower;
}

function weightDistance(a: string, b: string): number {
  const ai = WEIGHT_ORDER.indexOf(a);
  const bi = WEIGHT_ORDER.indexOf(b);
  if (ai === -1 || bi === -1) return 2;
  return Math.abs(ai - bi);
}

function fiberCompatibility(a?: string, b?: string): number {
  if (!a || !b) return 0.5;
  const al = a.toLowerCase();
  const bl = b.toLowerCase();
  if (al === bl) return 1;
  if (al.includes("acrylic") && bl.includes("acrylic")) return 0.9;
  if (al.includes("cotton") && bl.includes("cotton")) return 0.9;
  if (al.includes("wool") && bl.includes("wool")) return 0.85;
  if (
    (al.includes("acrylic") && bl.includes("wool")) ||
    (al.includes("wool") && bl.includes("acrylic"))
  ) {
    return 0.7;
  }
  if (al.includes("cotton") && bl.includes("acrylic")) return 0.55;
  return 0.4;
}

function scoreYarn(
  source: YarnProfile,
  candidate: YarnProfile,
  requiredYardage?: number,
): {
  score: number;
  warnings: string[];
  reasoning: string;
  hookAdjustment?: string;
  gaugeAdjustment?: string;
  yardageAdjustment?: string;
} {
  const warnings: string[] = [];
  let score = 50;

  const weightDist = weightDistance(
    normalizeWeight(source.weight),
    normalizeWeight(candidate.weight),
  );
  if (weightDist === 0) {
    score += 25;
  } else if (weightDist === 1) {
    score += 10;
    warnings.push(
      `Weight differs by one category (${source.weight} → ${candidate.weight}). Adjust hook size.`,
    );
  } else {
    score -= 10;
    warnings.push(
      `Significant weight difference (${source.weight} → ${candidate.weight}). Gauge swatch strongly recommended.`,
    );
  }

  const fiberScore = fiberCompatibility(source.fiber, candidate.fiber);
  score += Math.round(fiberScore * 15);

  if (candidate.inInventory) {
    score += 15;
  }

  if (requiredYardage && candidate.yardage) {
    if (candidate.yardage >= requiredYardage) {
      score += 10;
    } else {
      warnings.push(
        `May need additional yardage: ${candidate.yardage} yds available vs ${requiredYardage} yds required.`,
      );
      score -= 5;
    }
  }

  score = Math.max(0, Math.min(100, score));

  const hookAdjustment =
    weightDist > 0
      ? `Try ${candidate.hook ?? "one hook size up or down"} and swatch before starting.`
      : undefined;

  const gaugeAdjustment =
    weightDist > 0
      ? "Work a 4 in gauge swatch and adjust hook to match pattern gauge."
      : undefined;

  const yardageAdjustment =
    requiredYardage && candidate.yardage && candidate.yardage < requiredYardage
      ? `Purchase ${Math.ceil(requiredYardage - candidate.yardage)} additional yards or a second skein.`
      : undefined;

  const reasoning = candidate.inInventory
    ? `${candidate.name} is in your Yarn Vault with compatible ${candidate.weight} weight.`
    : `${candidate.name} matches key properties but is not currently in your inventory.`;

  return {
    score,
    warnings,
    reasoning,
    hookAdjustment,
    gaugeAdjustment,
    yardageAdjustment,
  };
}

export function findYarnSubstitutions(
  input: unknown,
): YarnSubstitutionResult {
  const parsed = yarnSubstitutionInputSchema.parse(input);

  const sourceName =
    parsed.sourceYarnName ??
    DEMO_YARN_PREVIEW.find((y) => y.id === parsed.sourceYarnId)?.name ??
    "Pattern yarn";

  const source: YarnProfile = {
    id: parsed.sourceYarnId,
    name: sourceName,
    weight: normalizeWeight(parsed.requiredWeight),
    yardage: parsed.requiredYardage,
    inInventory: false,
  };

  const candidates = DEMO_INVENTORY.filter(
    (y) => y.name !== source.name && y.id !== parsed.sourceYarnId,
  );

  const scored = candidates
    .map((candidate) => {
      const result = scoreYarn(source, candidate, parsed.requiredYardage);
      return yarnSubstitutionRecommendationSchema.parse({
        yarnId: candidate.id,
        yarnName: candidate.name,
        brand: candidate.brand,
        compatibilityScore: result.score,
        hookAdjustment: result.hookAdjustment,
        gaugeAdjustment: result.gaugeAdjustment,
        yardageAdjustment: result.yardageAdjustment,
        warnings: result.warnings,
        reasoning: result.reasoning,
        inInventory: candidate.inInventory,
      });
    })
    .sort((a, b) => {
      if (a.inInventory !== b.inInventory) {
        return a.inInventory ? -1 : 1;
      }
      return b.compatibilityScore - a.compatibilityScore;
    });

  const recommendations = scored.length > 0 ? scored : [
    yarnSubstitutionRecommendationSchema.parse({
      yarnName: "Caron Simply Soft",
      brand: "Caron",
      compatibilityScore: 72,
      reasoning: "General worsted-weight acrylic substitute.",
      inInventory: true,
      warnings: ["Verify gauge with a swatch."],
    }),
  ];

  return yarnSubstitutionResultSchema.parse({
    sourceYarnName: sourceName,
    recommendations,
    bestMatchId: recommendations[0]?.yarnId,
    generatedAt: new Date().toISOString(),
  });
}

export type { YarnSubstitutionInput, YarnSubstitutionResult };
