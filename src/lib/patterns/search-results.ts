import catalogData from "@/lib/patterns/catalog-data.json";
import type { SearchResult } from "@/components/stitch/SearchOverlay";

export const CATALOG_SEARCH_RESULTS: SearchResult[] = catalogData.map(
  (pattern) => ({
    id: pattern.id,
    title: pattern.title,
    subtitle: `${pattern.craft} · ${pattern.difficulty}`,
    href: `/learn/${pattern.slug}`,
    category: "Stitch Originals",
    icon: "learn",
  }),
);
