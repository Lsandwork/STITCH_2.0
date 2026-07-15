import { getDemoLesson, type DemoLesson } from "@/lib/demo-data";
import { getPatternKit, type PatternKit } from "@/lib/pattern-kits";

export type LearnItem =
  | ({ kind: "lesson" } & DemoLesson)
  | ({ kind: "pattern_kit" } & PatternKit);

export function getLearnItem(slug: string): LearnItem | undefined {
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
