import type { PatternRow, PatternSection } from "@/types/pattern";
import { DEMO_PROJECTS } from "@/lib/demo-data";

export type WorkspacePattern = {
  projectId: string;
  title: string;
  imageUrl: string;
  currentRow: number;
  sections: PatternSection[];
  abbreviations: Record<string, string>;
};

function buildDachshundRows(): PatternRow[] {
  const rows: PatternRow[] = [
    { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
    { rowNumber: 2, instruction: "inc in each st around", stitchCount: 12 },
    { rowNumber: 3, instruction: "(sc, inc) x6 around", stitchCount: 18 },
    { rowNumber: 4, instruction: "(2 sc, inc) x6 around", stitchCount: 24 },
    {
      rowNumber: 5,
      instruction: "sc in each st around",
      stitchCount: 24,
      notes: "Begin elongated body shaping.",
    },
  ];

  for (let row = 6; row <= 23; row += 1) {
    rows.push({
      rowNumber: row,
      instruction: "sc in each st around",
      stitchCount: 24,
    });
  }

  rows.push({
    rowNumber: 24,
    instruction: "Sc in each st around, inc in every 6th st",
    stitchCount: 28,
    notes: "Increase round for chest shaping.",
  });

  for (let row = 25; row <= 30; row += 1) {
    rows.push({
      rowNumber: row,
      instruction: "sc in each st around",
      stitchCount: 28,
    });
  }

  rows.push(
    { rowNumber: 31, instruction: "(2 sc, dec) x7 around", stitchCount: 21 },
    { rowNumber: 32, instruction: "(sc, dec) x7 around", stitchCount: 14 },
    { rowNumber: 33, instruction: "dec x7 around, stuff firmly", stitchCount: 7 },
    { rowNumber: 34, instruction: "Fasten off, leave tail for joining", stitchCount: 7 },
    { rowNumber: 35, instruction: "Join head to neck opening", stitchCount: null },
    { rowNumber: 36, instruction: "Sew legs evenly spaced along underside", stitchCount: null },
    { rowNumber: 37, instruction: "Embroider nose and mouth with black floss", stitchCount: null },
    { rowNumber: 38, instruction: "Weave in all ends and shape lightly", stitchCount: null },
  );

  return rows;
}

export const DEMO_DACHSHUND_PATTERN: WorkspacePattern = {
  projectId: "demo-dachshund",
  title: "Dachshund Plushie",
  imageUrl: DEMO_PROJECTS[0].imageUrl,
  currentRow: 24,
  abbreviations: {
    ch: "chain",
    sc: "single crochet",
    inc: "increase (2 sc in same st)",
    dec: "decrease (sc2tog)",
    MR: "magic ring",
    st: "stitch",
  },
  sections: [
    {
      name: "Body",
      sortOrder: 0,
      instructions: "Worked in continuous rounds. Stuff as you go.",
      rows: buildDachshundRows(),
    },
  ],
};

export function getDemoWorkspacePattern(projectId: string): WorkspacePattern | null {
  if (projectId === "demo-dachshund") return DEMO_DACHSHUND_PATTERN;

  const project = DEMO_PROJECTS.find((p) => p.id === projectId);
  if (!project) return null;

  const rows: PatternRow[] = Array.from({ length: project.totalRows }, (_, i) => ({
    rowNumber: i + 1,
    instruction: i % 3 === 2 ? "(sc, inc) x6 around" : "sc in each st around",
    stitchCount: 12 + i * 2,
  }));

  return {
    projectId: project.id,
    title: project.title,
    imageUrl: project.imageUrl,
    currentRow: project.currentRow || 1,
    abbreviations: DEMO_DACHSHUND_PATTERN.abbreviations,
    sections: [{ name: "Main", sortOrder: 0, rows }],
  };
}

export function flattenPatternRows(pattern: WorkspacePattern): PatternRow[] {
  return pattern.sections
    .flatMap((section) => section.rows)
    .sort((a, b) => a.rowNumber - b.rowNumber);
}

export function getTotalRows(pattern: WorkspacePattern): number {
  return flattenPatternRows(pattern).length;
}
