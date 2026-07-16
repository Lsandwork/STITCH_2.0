import { getDemoLesson, type DemoLesson } from "@/lib/demo-data";
import { getPatternKit, type PatternKit } from "@/lib/pattern-kits";
import { getPatternDetailBySlug } from "@/lib/patterns/catalog";
import {
  getStitchOriginalKit,
  isStitchOriginalSlug,
} from "@/lib/patterns/learn";
import {
  catalogPatternToKit,
  extractOverviewFromMarkdown,
  extractStepsFromMarkdown,
} from "@/lib/patterns/to-pattern-kit";

export type LearnItem =
  | ({ kind: "lesson" } & DemoLesson)
  | ({ kind: "pattern_kit" } & PatternKit)
  | ({ kind: "stitch_original" } & PatternKit);

export type StitchOriginalLearnItem = PatternKit & {
  kind: "stitch_original";
  fullInstructionsMarkdown: string;
  checklistMarkdown: string;
};

export type LearnItemDetail = LearnItem | StitchOriginalLearnItem;

export function getLearnItem(slug: string): LearnItem | undefined {
  const original = getStitchOriginalKit(slug);
  if (original) {
    return { kind: "stitch_original", ...original };
  }

  const kit = getPatternKit(slug);
  if (kit) {
    return { kind: "pattern_kit", ...kit };
  }

  const lesson = getDemoLesson(slug);
  if (lesson) {
    return { kind: "lesson", ...lesson };
  }

  return undefined;
}

export async function getLearnItemAsync(
  slug: string,
): Promise<LearnItemDetail | undefined> {
  if (isStitchOriginalSlug(slug)) {
    const detail = await getPatternDetailBySlug(slug);
    if (!detail) return undefined;
    const kit = catalogPatternToKit(detail, detail.fullInstructionsMarkdown);
    return {
      kind: "stitch_original",
      ...kit,
      overview: extractOverviewFromMarkdown(detail.fullInstructionsMarkdown),
      steps: extractStepsFromMarkdown(detail.fullInstructionsMarkdown),
      fullInstructionsMarkdown: detail.fullInstructionsMarkdown,
      checklistMarkdown: detail.checklistMarkdown,
    };
  }

  return getLearnItem(slug);
}
