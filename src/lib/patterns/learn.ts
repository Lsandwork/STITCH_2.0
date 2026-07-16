import { STITCH_CATALOG_PATTERNS } from "@/lib/patterns/catalog";
import { catalogPatternToKit } from "@/lib/patterns/to-pattern-kit";
import type { PatternKit } from "@/lib/pattern-kits";

/** All 12 Stitch Original patterns as learn-ready kits (metadata only). */
export function getStitchOriginalKits(): PatternKit[] {
  return STITCH_CATALOG_PATTERNS.map((pattern) => catalogPatternToKit(pattern));
}

export function getStitchOriginalKit(slug: string): PatternKit | undefined {
  const pattern = STITCH_CATALOG_PATTERNS.find((p) => p.slug === slug);
  if (!pattern) return undefined;
  return catalogPatternToKit(pattern);
}

export function isStitchOriginalSlug(slug: string): boolean {
  return STITCH_CATALOG_PATTERNS.some((p) => p.slug === slug);
}
