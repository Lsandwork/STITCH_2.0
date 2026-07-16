import { readFile } from "node:fs/promises";
import path from "node:path";

import catalogData from "@/lib/patterns/catalog-data.json";
import type {
  StitchCatalogPattern,
  StitchPatternDetail,
  StitchSharedResource,
} from "@/lib/patterns/types";

const CONTENT_ROOT = path.join(process.cwd(), "content/stitch-patterns");
const SHARED_ROOT = path.join(CONTENT_ROOT, "_shared");

const SHARED_RESOURCES: StitchSharedResource[] = [
  {
    slug: "abbreviations",
    title: "Abbreviations & Techniques",
    filename: "ABBREVIATIONS_AND_TECHNIQUES.md",
  },
  {
    slug: "yarn-substitution",
    title: "Yarn Substitution & Care",
    filename: "YARN_SUBSTITUTION_AND_CARE.md",
  },
  {
    slug: "commercial-release",
    title: "Commercial Release Checklist",
    filename: "COMMERCIAL_RELEASE_CHECKLIST.md",
  },
  {
    slug: "library-readme",
    title: "Pattern Library Guide",
    filename: "README.md",
  },
];

export const STITCH_CATALOG_PATTERNS = catalogData as StitchCatalogPattern[];

export function getCatalogPatterns(options?: {
  trending?: boolean;
  featured?: boolean;
  limit?: number;
}): StitchCatalogPattern[] {
  let results = [...STITCH_CATALOG_PATTERNS];
  if (options?.trending) {
    results = results.filter((p) => p.isTrending);
  }
  if (options?.featured) {
    results = results.filter((p) => p.isFeatured);
  }
  if (options?.limit) {
    results = results.slice(0, options.limit);
  }
  return results;
}

export function getCatalogPatternBySlug(
  slug: string,
): StitchCatalogPattern | undefined {
  return STITCH_CATALOG_PATTERNS.find((p) => p.slug === slug);
}

export async function getPatternDetailBySlug(
  slug: string,
): Promise<StitchPatternDetail | undefined> {
  const meta = getCatalogPatternBySlug(slug);
  if (!meta) return undefined;

  const patternDir = path.join(CONTENT_ROOT, slug);
  const [fullInstructionsMarkdown, checklistMarkdown] = await Promise.all([
    readFile(path.join(patternDir, "pattern.md"), "utf8"),
    readFile(path.join(patternDir, "checklist.md"), "utf8"),
  ]);

  return {
    ...meta,
    fullInstructionsMarkdown,
    checklistMarkdown,
  };
}

export async function getSharedResource(
  slug: string,
): Promise<{ title: string; content: string } | undefined> {
  const resource = SHARED_RESOURCES.find((r) => r.slug === slug);
  if (!resource) return undefined;
  const content = await readFile(
    path.join(SHARED_ROOT, resource.filename),
    "utf8",
  );
  return { title: resource.title, content };
}

export function searchCatalogPatterns(query: string): StitchCatalogPattern[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return STITCH_CATALOG_PATTERNS.filter((pattern) => {
    const haystack = [
      pattern.title,
      pattern.craft,
      pattern.difficulty,
      pattern.authorName,
      ...pattern.tags,
      ...pattern.materials,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getPlatformStats() {
  return {
    patterns: STITCH_CATALOG_PATTERNS.length,
    makers: null as number | null,
    projects: null as number | null,
    countries: null as number | null,
  };
}

export function getAllPatternSlugs(): string[] {
  return STITCH_CATALOG_PATTERNS.map((p) => p.slug);
}

export { SHARED_RESOURCES };
