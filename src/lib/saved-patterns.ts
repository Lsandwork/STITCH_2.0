import type { PatternGenerationResultSchema } from "@/lib/schemas/pattern";

export const SAVED_PATTERNS_KEY = "stitch-saved-patterns";

export type SavedPattern = PatternGenerationResultSchema & {
  id?: string;
  savedAt?: string;
};

export function createSavedPatternId(pattern: PatternGenerationResultSchema): string {
  const stamp = pattern.generatedAt || new Date().toISOString();
  const slug = pattern.pattern.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `pat-${slug || "pattern"}-${stamp.replace(/[^0-9a-z]/gi, "").slice(0, 18)}`;
}

export function ensureSavedPatternId(item: SavedPattern): string {
  if (item.id) return item.id;
  return createSavedPatternId(item);
}

export function readSavedPatterns(): SavedPattern[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_PATTERNS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedPattern[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      id: ensureSavedPatternId(item),
    }));
  } catch {
    return [];
  }
}

export function writeSavedPatterns(patterns: SavedPattern[]): void {
  localStorage.setItem(SAVED_PATTERNS_KEY, JSON.stringify(patterns.slice(0, 20)));
}

export function findSavedPattern(patternId: string): SavedPattern | null {
  const patterns = readSavedPatterns();
  return patterns.find((item) => ensureSavedPatternId(item) === patternId) ?? null;
}
