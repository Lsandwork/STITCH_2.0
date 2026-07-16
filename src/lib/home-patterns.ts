import { STITCH_CATALOG_PATTERNS } from "@/lib/patterns/catalog";
import type { StitchCatalogPattern } from "@/lib/patterns/types";

export type HomePattern = {
  id: string;
  slug: string;
  title: string;
  author: string;
  craft: string;
  difficulty: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  featured?: boolean;
};

function toHomePattern(pattern: StitchCatalogPattern): HomePattern {
  return {
    id: pattern.id,
    slug: pattern.slug,
    title: pattern.title,
    author: pattern.authorName,
    craft: pattern.craft,
    difficulty: pattern.difficulty,
    imageUrl: pattern.imageUrl,
    imageAlt: pattern.imageAlt,
    href: `/learn/${pattern.slug}`,
    featured: pattern.isFeatured,
  };
}

export const TRENDING_PATTERNS: HomePattern[] = STITCH_CATALOG_PATTERNS.filter(
  (p) => p.isTrending,
).map(toHomePattern);

export const FOR_YOU_PATTERNS: HomePattern[] = STITCH_CATALOG_PATTERNS.filter(
  (p) => p.isFeatured,
).map(toHomePattern);

export const HOME_CATEGORIES = [
  { id: "crochet", label: "Crochet", color: "bg-stitch-blush", icon: "yarn" },
  { id: "knitting", label: "Knitting", color: "bg-stitch-lavender-soft", icon: "pattern" },
  { id: "embroidery", label: "Embroidery", color: "bg-stitch-mint-soft", icon: "palette" },
  { id: "weaving", label: "Weaving", color: "bg-stitch-peach-soft", icon: "bookmark" },
  { id: "punch-needle", label: "Punch Needle", color: "bg-stitch-sage-soft", icon: "sparkles" },
  { id: "more", label: "More", color: "bg-stitch-olive/15", icon: "plus" },
] as const;
