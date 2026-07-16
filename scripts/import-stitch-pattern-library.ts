import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(
  ROOT,
  "content/stitch-patterns-source/Stitch_Complete_Original_Pattern_Library",
);
const DEST = path.join(ROOT, "content/stitch-patterns");
const SHARED_DEST = path.join(DEST, "_shared");
const CATALOG_OUT = path.join(ROOT, "src/lib/patterns/catalog-data.json");

const FOLDER_TO_SLUG: Record<string, string> = {
  "01_SUNSET_MARKET_BAG": "sunset-market-bag",
  "02_RETRO_GARDEN_CARDIGAN": "retro-garden-cardigan",
  "03_CLOUD_COMFORT_BLANKET": "cloud-comfort-blanket",
  "04_BOHO_GRANNY_TOP": "boho-granny-top",
  "05_WILDFLOWER_DREAMS": "wildflower-dreams",
  "06_CITY_STRIPES_BEANIE": "city-stripes-beanie",
  "07_HERITAGE_PATCHWORK_PILLOW": "heritage-patchwork-pillow",
  "08_COASTAL_RIB_SWEATER": "coastal-rib-sweater",
  "09_SAGE_POCKET_DINO": "sage-pocket-dino",
  "10_HEIRLOOM_ROSE_GARDEN": "heirloom-rose-garden",
  "11_SUNDAY_GRID_CARDIGAN": "sunday-grid-cardigan",
  "12_BLUSH_CLOUD_THROW": "blush-cloud-throw",
};

const IMAGE_MAP: Record<string, string> = {
  "sunset-market-bag": "/assets/stitch/patterns/sunset-market-bag.jpg",
  "retro-garden-cardigan": "/assets/stitch/patterns/retro-garden-cardigan.jpg",
  "cloud-comfort-blanket": "/assets/stitch/patterns/cloud-comfort-blanket.jpg",
  "boho-granny-top": "/assets/stitch/patterns/boho-granny-top.jpg",
  "wildflower-dreams": "/assets/stitch/patterns/wildflower-dreams.jpg",
  "city-stripes-beanie": "/assets/stitch/patterns/city-stripes-beanie.jpg",
  "heritage-patchwork-pillow":
    "/assets/stitch/patterns/heritage-patchwork-pillow.jpg",
  "coastal-rib-sweater": "/assets/stitch/patterns/coastal-rib-sweater.jpg",
  "sage-pocket-dino": "/assets/stitch/patterns/sage-pocket-dino.jpg",
  "heirloom-rose-garden": "/assets/stitch/patterns/heirloom-rose-garden.jpg",
  "sunday-grid-cardigan": "/assets/stitch/patterns/sunday-grid-cardigan.jpg",
  "blush-cloud-throw": "/assets/stitch/patterns/blush-cloud-throw.jpg",
};

const TRENDING_SLUGS = new Set([
  "sunset-market-bag",
  "retro-garden-cardigan",
  "cloud-comfort-blanket",
  "boho-granny-top",
  "wildflower-dreams",
  "city-stripes-beanie",
]);

function normalizeDifficulty(
  value: string,
): "beginner" | "intermediate" | "advanced" {
  const lower = value.toLowerCase();
  if (lower.includes("advanced") && !lower.includes("beginner")) return "advanced";
  if (lower.includes("intermediate") || lower.includes("confident")) {
    return "intermediate";
  }
  return "beginner";
}

function estimateDuration(craft: string, difficulty: string): number {
  const base =
    craft.toLowerCase().includes("embroidery")
      ? 180
      : craft.toLowerCase().includes("knit")
        ? 360
        : 300;
  if (difficulty.includes("Advanced")) return base + 180;
  if (difficulty.includes("Intermediate")) return base + 60;
  return base;
}

async function copySharedResources() {
  const sharedSource = path.join(SOURCE, "00_SHARED_RESOURCES");
  await mkdir(SHARED_DEST, { recursive: true });
  const files = [
    "ABBREVIATIONS_AND_TECHNIQUES.md",
    "YARN_SUBSTITUTION_AND_CARE.md",
    "COMMERCIAL_RELEASE_CHECKLIST.md",
    "README.md",
  ];
  for (const file of files) {
    await cp(path.join(sharedSource, file), path.join(SHARED_DEST, file));
  }
}

async function main() {
  const indexRaw = await readFile(path.join(SOURCE, "pattern-library.json"), "utf8");
  const index = JSON.parse(indexRaw) as {
    patterns: Array<{
      id: string;
      title: string;
      craft: string;
      difficulty: string;
      sizes: string[];
      tags: string[];
      materials: string[];
      gauge: string;
      source: string;
      status: string;
    }>;
  };

  const catalog: Array<Record<string, unknown>> = [];

  for (const entry of index.patterns) {
    const folder = entry.id;
    const slug = FOLDER_TO_SLUG[folder];
    if (!slug) {
      console.warn(`Skipping unknown folder: ${folder}`);
      continue;
    }

    const srcDir = path.join(SOURCE, folder);
    const destDir = path.join(DEST, slug);
    await mkdir(destDir, { recursive: true });

    await cp(path.join(srcDir, "PATTERN.md"), path.join(destDir, "pattern.md"));
    await cp(path.join(srcDir, "checklist.md"), path.join(destDir, "checklist.md"));
    await cp(path.join(srcDir, "pattern.json"), path.join(destDir, "meta.json"));

    const patternMd = await readFile(path.join(destDir, "pattern.md"), "utf8");
    const summary =
      patternMd
        .split("\n")
        .find((line) => line.trim() && !line.startsWith("#"))
        ?.trim() ?? entry.title;

    catalog.push({
      id: entry.id,
      slug,
      title: entry.title,
      craft: entry.craft,
      difficulty: entry.difficulty,
      skillLevel: normalizeDifficulty(entry.difficulty),
      sizes: entry.sizes,
      tags: entry.tags,
      materials: entry.materials,
      gauge: entry.gauge,
      summary,
      source: entry.source,
      publicationStatus: entry.status,
      authorName: "Stitch Originals",
      imageUrl: IMAGE_MAP[slug],
      imageAlt: `${entry.title} — ${entry.craft} pattern`,
      isTrending: TRENDING_SLUGS.has(slug),
      isFeatured: !TRENDING_SLUGS.has(slug),
      durationMinutes: estimateDuration(entry.craft, entry.difficulty),
    });
  }

  await copySharedResources();
  await writeFile(CATALOG_OUT, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`Imported ${catalog.length} patterns to ${DEST}`);
  console.log(`Catalog written to ${CATALOG_OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
