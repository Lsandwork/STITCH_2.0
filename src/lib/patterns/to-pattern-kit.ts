import type { PatternKit, PatternKitMaterial } from "@/lib/pattern-kits";
import type { StitchCatalogPattern } from "@/lib/patterns/types";

function materialsToKitItems(materials: string[]): PatternKitMaterial[] {
  return materials.map((line) => {
    const dash = line.indexOf(" — ");
    if (dash > -1) {
      return { item: line.slice(0, dash), amount: line.slice(dash + 3) };
    }
    return { item: line, amount: "As listed" };
  });
}

function extractHookSize(materials: string[]): string {
  const hook = materials.find((m) =>
    /hook|needle|mm/i.test(m),
  );
  return hook ?? "See pattern for tool sizes";
}

function extractYarnSummary(materials: string[]): string {
  const yarn = materials.find((m) => /yarn|floss|fabric|bulky|worsted|dk/i.test(m));
  return yarn ?? materials.slice(0, 2).join("; ");
}

/** Build overview bullets from pattern markdown intro (before first ##). */
export function extractOverviewFromMarkdown(markdown: string): string[] {
  const intro = markdown.split(/^## /m)[0] ?? "";
  const lines = intro
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  if (lines.length === 0) return ["Read the full instructions before starting."];
  return lines.slice(0, 4);
}

/** Extract instruction steps from ### headings in pattern markdown. */
export function extractStepsFromMarkdown(markdown: string): string[] {
  const steps: string[] = [];
  const sections = markdown.split(/^### /m).slice(1);
  for (const section of sections) {
    const [heading, ...body] = section.split("\n");
    const firstLine = body.find((l) => l.trim() && !l.startsWith("#"));
    if (heading && firstLine) {
      steps.push(`${heading.trim()}: ${firstLine.trim()}`);
    }
  }
  if (steps.length > 0) return steps.slice(0, 24);
  return [
    "Review materials and gauge swatch requirements.",
    "Follow each section of the full pattern instructions in order.",
    "Check measurements at checkpoints noted in the pattern.",
    "Finish, block, and photograph your completed project.",
  ];
}

export function catalogPatternToKit(
  pattern: StitchCatalogPattern,
  markdown?: string,
): PatternKit {
  const overview = markdown
    ? extractOverviewFromMarkdown(markdown)
    : [pattern.summary];
  const steps = markdown
    ? extractStepsFromMarkdown(markdown)
    : [
        "Open the full pattern instructions for complete step-by-step guidance.",
        "Work through each section at your own pace.",
        "Use the maker checklist to track progress.",
      ];

  return {
    id: pattern.id,
    slug: pattern.slug,
    title: pattern.title,
    subtitle: pattern.summary,
    category: `${pattern.craft} · Stitch Original`,
    skillLevel: pattern.skillLevel,
    durationMinutes: pattern.durationMinutes,
    finishedSize: pattern.sizes.join(" · "),
    illustrationUrl: pattern.imageUrl,
    href: `/learn/${pattern.slug}`,
    progressPercent: 0,
    hookSize: extractHookSize(pattern.materials),
    yarnSummary: extractYarnSummary(pattern.materials),
    materials: materialsToKitItems(pattern.materials),
    overview,
    steps,
    tip: `Gauge: ${pattern.gauge}. See yarn substitution and care in the shared pattern resources.`,
  };
}
