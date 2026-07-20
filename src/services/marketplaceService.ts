import {
  marketplaceProcessInputSchema,
  marketplaceProcessResultSchema,
  type MarketplaceProcessInput,
  type MarketplaceProcessResult,
} from "@/lib/schemas/marketplace";
import { normalizeListingLanguages } from "@/lib/marketplace-i18n";
import { generateJSONWithFallback, isMockMode } from "@/services/ai/provider";

const THUMBNAIL_PALETTES: Record<string, { gradientFrom: string; gradientTo: string; emoji: string }> = {
  amigurumi: { gradientFrom: "#f46f61", gradientTo: "#e7a63b", emoji: "🧸" },
  bag: { gradientFrom: "#e7a63b", gradientTo: "#2c9a95", emoji: "👜" },
  blanket: { gradientFrom: "#8e67c6", gradientTo: "#f46f61", emoji: "🧶" },
  garment: { gradientFrom: "#2c9a95", gradientTo: "#8e67c6", emoji: "🧥" },
  default: { gradientFrom: "#f46f61", gradientTo: "#2c9a95", emoji: "🪡" },
};

function buildMockProcessResult(
  input: MarketplaceProcessInput,
): MarketplaceProcessResult {
  const typeKey = Object.keys(THUMBNAIL_PALETTES).find((k) =>
    input.projectType.toLowerCase().includes(k),
  ) ?? "default";
  const palette = THUMBNAIL_PALETTES[typeKey];

  const duplicateScore = input.existingTitles.some((t) =>
    t.toLowerCase().includes(input.title.toLowerCase().slice(0, 8)),
  )
    ? 72
    : input.existingSummaries.some((s) =>
          s.toLowerCase().includes(input.projectType.toLowerCase()),
        )
      ? 35
      : 8;

  return {
    aiDescription: `Discover ${input.title} — a beautifully crafted ${input.projectType} pattern designed for ${input.skillLevel} makers. ${input.patternContent.slice(0, 120)}… This listing includes clear step-by-step instructions, material lists, and finishing tips to help you succeed.`,
    previewText: `${input.projectType} · ${input.skillLevel} · ${input.hookSize ?? "hook size flexible"} · ${input.yarnWeight ?? "worsted"} weight · AI-enhanced listing`,
    tags: [
      input.projectType,
      input.skillLevel,
      input.yarnWeight ?? "worsted",
      "crochet",
      "handmade",
    ].filter(Boolean),
    thumbnailStyle: palette,
    languages: normalizeListingLanguages(
      [
        {
          language: "es",
          languageLabel: "Español",
          title: input.title,
          description: `Un patrón de crochet ${input.projectType} nivel ${input.skillLevel}.`,
        },
        {
          language: "fr",
          languageLabel: "Français",
          title: input.title,
          description: `Un modèle de crochet ${input.projectType} niveau ${input.skillLevel}.`,
        },
        {
          language: "de",
          languageLabel: "Deutsch",
          title: input.title,
          description: `Ein ${input.skillLevel}-Häkelmuster für ${input.projectType}.`,
        },
        {
          language: "ja",
          languageLabel: "日本語",
          title: input.title,
          description: `${input.skillLevel}向け${input.projectType}のかぎ針編みパターン。`,
        },
      ],
      {
        title: input.title,
        description: `A ${input.skillLevel} ${input.projectType} crochet pattern.`,
      },
    ),
    duplicateScore,
    duplicateNote:
      duplicateScore >= 60
        ? "This pattern may be similar to an existing listing. Review before publishing."
        : duplicateScore >= 30
          ? "Some thematic overlap detected with other listings — likely unique enough to publish."
          : "No significant duplicates detected. Ready to publish!",
  };
}

export async function processMarketplaceListing(
  input: MarketplaceProcessInput,
): Promise<MarketplaceProcessResult> {
  const validated = marketplaceProcessInputSchema.parse(input);

  if (isMockMode()) {
    return buildMockProcessResult(validated);
  }

  const existingContext =
    validated.existingTitles.length > 0
      ? `\nExisting marketplace titles for duplicate check:\n${validated.existingTitles.map((t) => `- ${t}`).join("\n")}`
      : "";

  const prompt = `You are the AI listing assistant for Stitch Marketplace — a crochet pattern marketplace.

Analyze this designer pattern submission and produce enriched marketplace metadata.

Title: ${validated.title}
Project type: ${validated.projectType}
Skill level: ${validated.skillLevel}
Yarn weight: ${validated.yarnWeight ?? "not specified"}
Hook size: ${validated.hookSize ?? "not specified"}
Pattern content (excerpt):
${validated.patternContent.slice(0, 2000)}
${existingContext}

Generate:
1. aiDescription — compelling 2-3 sentence marketing description for buyers
2. previewText — one-line preview with key stats (rounds, hook, yarn, time estimate)
3. tags — 4-6 relevant search tags
4. thumbnailStyle — gradientFrom and gradientTo hex colors matching the project vibe, plus one emoji
5. languages — translations in English, Spanish, French, German, and Japanese (title + short description each). English MUST use language code "en" and be the source title in English.
6. duplicateScore — 0-100 likelihood this duplicates an existing listing (0 = unique, 100 = exact duplicate)
7. duplicateNote — brief explanation of duplicate analysis

Respond as JSON matching the schema exactly.`;

  try {
    const { data: result } = await generateJSONWithFallback(
      prompt,
      marketplaceProcessResultSchema,
    );
    return {
      ...result,
      languages: normalizeListingLanguages(result.languages, {
        title: validated.title,
        description: `A ${validated.skillLevel} ${validated.projectType} crochet pattern.`,
      }),
    };
  } catch (error) {
    console.error("[processMarketplaceListing] AI failed:", error);
    throw new Error(
      error instanceof Error
        ? `Marketplace AI failed: ${error.message}`
        : "Marketplace AI failed. Please try again.",
    );
  }
}
