import type { PatternRow, PatternSection } from "@/types/pattern";
import { DEMO_PROJECTS } from "@/lib/demo-data";
import { projectImage } from "@/lib/project-images";

export type WorkspacePattern = {
  projectId: string;
  title: string;
  imageUrl: string;
  currentRow: number;
  gauge?: string;
  finishedSize?: string;
  materials?: string[];
  sections: PatternSection[];
  abbreviations: Record<string, string>;
};

const COMMON_ABBREV: Record<string, string> = {
  ch: "chain",
  sc: "single crochet",
  hdc: "half double crochet",
  dc: "double crochet",
  inc: "increase (2 sc in same st)",
  dec: "decrease (sc2tog)",
  MR: "magic ring",
  "sl st": "slip stitch",
  st: "stitch",
  rnd: "round",
  BLO: "back loop only",
  FLO: "front loop only",
};

function buildDachshundRows(): PatternRow[] {
  const rows: PatternRow[] = [
    { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6, notes: "Pull ring tight." },
    { rowNumber: 2, instruction: "Inc in each st around", stitchCount: 12 },
    { rowNumber: 3, instruction: "(Sc, inc) x6 around", stitchCount: 18 },
    { rowNumber: 4, instruction: "(2 sc, inc) x6 around", stitchCount: 24 },
    { rowNumber: 5, instruction: "Sc in each st around", stitchCount: 24, notes: "Begin elongated body." },
  ];
  for (let r = 6; r <= 23; r++) {
    rows.push({ rowNumber: r, instruction: "Sc in each st around", stitchCount: 24 });
  }
  rows.push({
    rowNumber: 24,
    instruction: "Sc in each st around, inc in every 6th st",
    stitchCount: 28,
    notes: "Increase round for chest shaping.",
  });
  for (let r = 25; r <= 30; r++) {
    rows.push({ rowNumber: r, instruction: "Sc in each st around", stitchCount: 28 });
  }
  rows.push(
    { rowNumber: 31, instruction: "(2 sc, dec) x7 around", stitchCount: 21 },
    { rowNumber: 32, instruction: "(Sc, dec) x7 around", stitchCount: 14 },
    { rowNumber: 33, instruction: "Dec x7 around — stuff firmly before closing", stitchCount: 7 },
    { rowNumber: 34, instruction: "Fasten off, leave long tail for joining", stitchCount: 7 },
    { rowNumber: 35, instruction: "Sew head to neck opening using mattress stitch", stitchCount: null },
    { rowNumber: 36, instruction: "Attach 4 legs evenly spaced along underside", stitchCount: null },
    { rowNumber: 37, instruction: "Embroider nose and mouth with black floss", stitchCount: null },
    { rowNumber: 38, instruction: "Weave in all ends and shape lightly with hands", stitchCount: null },
  );
  return rows;
}

function buildSunflowerRows(): PatternRow[] {
  const rows: PatternRow[] = [
    { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
    { rowNumber: 2, instruction: "Inc in each st around", stitchCount: 12 },
    { rowNumber: 3, instruction: "(Sc, inc) x6 around", stitchCount: 18 },
    { rowNumber: 4, instruction: "(2 sc, inc) x6 around", stitchCount: 24 },
    { rowNumber: 5, instruction: "(3 sc, inc) x6 around", stitchCount: 30 },
    { rowNumber: 6, instruction: "Sc in each st around", stitchCount: 30, notes: "Center complete — switch to gold yarn." },
    { rowNumber: 7, instruction: "Ch 8, sl st in 2nd ch from hook and next 6 ch (petal made)", stitchCount: null },
    { rowNumber: 8, instruction: "Sl st in next st, ch 8, sl st back — repeat for 12 petals total", stitchCount: null },
    { rowNumber: 9, instruction: "Sl st to first petal base to close round", stitchCount: null },
    { rowNumber: 10, instruction: "Switch to green — ch 40 for strap, sc in 2nd ch and each ch across", stitchCount: 39 },
    { rowNumber: 11, instruction: "Ch 1, turn, sc in each st across", stitchCount: 39 },
    { rowNumber: 12, instruction: "Ch 1, turn, sc in each st across", stitchCount: 39 },
    { rowNumber: 13, instruction: "Repeat row 12 until strap reaches 12 in / 30 cm", stitchCount: 39 },
    { rowNumber: 14, instruction: "Sew strap to back of flower center", stitchCount: null },
    { rowNumber: 15, instruction: "Ch 20, join to form bag loop handle on opposite side", stitchCount: null },
    { rowNumber: 16, instruction: "Work 8 sc around loop, sc in each st for 3 rounds", stitchCount: 8 },
    { rowNumber: 17, instruction: "Sc in each st around handle", stitchCount: 8 },
    { rowNumber: 18, instruction: "Work 12 dc petals around center — 12 petals total", stitchCount: null, notes: "You are here!" },
  ];
  for (let r = 19; r <= 28; r++) {
    rows.push({ rowNumber: r, instruction: "Sc in each st of bag back panel", stitchCount: 36 + (r - 19) * 6 });
  }
  rows.push(
    { rowNumber: 29, instruction: "Work 3 rounds of sc border around entire bag edge", stitchCount: null },
    { rowNumber: 30, instruction: "Sew on button or magnetic snap closure", stitchCount: null },
    { rowNumber: 31, instruction: "Optional: line bag with fabric for durability", stitchCount: null },
    { rowNumber: 32, instruction: "Weave in all ends", stitchCount: null },
    { rowNumber: 33, instruction: "Block flower flat with pins if needed", stitchCount: null },
    { rowNumber: 34, instruction: "Admire your sunflower bag!", stitchCount: null },
  );
  return rows;
}

function buildGrannyRows(): PatternRow[] {
  const rows: PatternRow[] = [];
  for (let sq = 1; sq <= 40; sq++) {
    const base = (sq - 1) * 4;
    rows.push(
      { rowNumber: base + 1, instruction: `Square ${sq} — Rnd 1: 3 dc, ch 2, (3 dc, ch 2) x3 in MR`, stitchCount: null, notes: `Square ${sq} of 40` },
      { rowNumber: base + 2, instruction: `Square ${sq} — Rnd 2: 3 dc in each ch-2 corner space, ch 1 between sides`, stitchCount: null },
      { rowNumber: base + 3, instruction: `Square ${sq} — Rnd 3: Change color — 3 dc clusters per side, ch 2 corners`, stitchCount: null },
      { rowNumber: base + 4, instruction: `Square ${sq} — Fasten off, leave tail for joining`, stitchCount: null },
    );
  }
  return rows;
}

function buildSweaterRows(): PatternRow[] {
  const rows: PatternRow[] = [];
  for (let r = 1; r <= 20; r++) {
    rows.push({
      rowNumber: r,
      instruction: `Back panel — Row ${r}: Hdc in each of 42 ch`,
      stitchCount: 42,
      notes: r === 1 ? "Foundation chain 42, hdc in 3rd ch from hook." : undefined,
    });
  }
  rows.push({ rowNumber: 21, instruction: "Shape armholes — skip 4 sts each side for 3 rows", stitchCount: 34 });
  for (let r = 22; r <= 30; r++) {
    rows.push({ rowNumber: r, instruction: "Hdc in each st across back panel", stitchCount: 34 });
  }
  rows.push({ rowNumber: 31, instruction: "Fasten off back panel — begin front panel (same as back)", stitchCount: null });
  for (let r = 32; r <= 42; r++) {
    rows.push({ rowNumber: r, instruction: `Front panel — Row ${r - 31}: Hdc in each of 42 ch`, stitchCount: 42 });
  }
  rows.push(
    { rowNumber: 43, instruction: "Shape neckline — center 12 sts bound off over 4 rows", stitchCount: null },
    { rowNumber: 44, instruction: "Join shoulder seams with mattress stitch", stitchCount: null },
    { rowNumber: 45, instruction: "Pick up 32 sts around armhole — work sleeve in rounds", stitchCount: 32 },
    { rowNumber: 46, instruction: "Dec 1 st each side every 4th round for sleeve shaping", stitchCount: 28 },
    { rowNumber: 47, instruction: "Work 6 rounds of ribbing (sc BLO) at cuff", stitchCount: 24 },
    { rowNumber: 48, instruction: "Repeat sleeve for second armhole", stitchCount: null },
    { rowNumber: 49, instruction: "Join side seams from cuff to hem", stitchCount: null },
    { rowNumber: 50, instruction: "Pick up sts around neckline — work 4 rounds rolled collar", stitchCount: null },
    { rowNumber: 51, instruction: "Weave in all ends", stitchCount: null },
    { rowNumber: 52, instruction: "Block to measurements — 38 in chest, 24 in length", stitchCount: null },
  );
  return rows;
}

function buildDinoRows(): PatternRow[] {
  const rows: PatternRow[] = [
    { rowNumber: 1, instruction: "6 sc in MR", stitchCount: 6 },
    { rowNumber: 2, instruction: "Inc in each st around", stitchCount: 12 },
    { rowNumber: 3, instruction: "(Sc, inc) x6 around", stitchCount: 18 },
    { rowNumber: 4, instruction: "(2 sc, inc) x6 around", stitchCount: 24 },
    { rowNumber: 5, instruction: "(3 sc, inc) x6 around", stitchCount: 30 },
  ];
  for (let r = 6; r <= 20; r++) {
    rows.push({ rowNumber: r, instruction: "Sc in each st around", stitchCount: 30 });
  }
  for (let r = 21; r <= 30; r++) {
    rows.push({
      rowNumber: r,
      instruction: r % 2 === 0 ? "Sc in each st, bobble st every 5th st (spine)" : "Sc in each st around",
      stitchCount: 30,
    });
  }
  rows.push({ rowNumber: 31, instruction: "(3 sc, dec) x6 around", stitchCount: 24 });
  for (let r = 32; r <= 33; r++) {
    rows.push({ rowNumber: r, instruction: "Sc in each st around", stitchCount: 24 });
  }
  rows.push(
    { rowNumber: 34, instruction: "Dec around to close body — stuff firmly before final rounds", stitchCount: 12, notes: "You are here!" },
    { rowNumber: 35, instruction: "(Sc, dec) x6 around", stitchCount: 18 },
    { rowNumber: 36, instruction: "Dec x6 around", stitchCount: 12 },
    { rowNumber: 37, instruction: "Stuff head firmly, insert safety eyes between rnds 14–15", stitchCount: null },
    { rowNumber: 38, instruction: "Sew arms to sides at rnd 22", stitchCount: null },
    { rowNumber: 39, instruction: "Attach tail to back at rnd 28", stitchCount: null },
    { rowNumber: 40, instruction: "Embroider smile with yellow yarn", stitchCount: null },
    { rowNumber: 41, instruction: "Add felt teeth if desired", stitchCount: null },
    { rowNumber: 42, instruction: "Weave in all ends", stitchCount: null },
    { rowNumber: 43, instruction: "Shape and set aside to rest stuffing", stitchCount: null },
    { rowNumber: 44, instruction: "Your dino is done — Rawr!", stitchCount: null },
  );
  return rows;
}

const PATTERN_MAP: Record<string, () => WorkspacePattern> = {
  "demo-dachshund": () => ({
    projectId: "demo-dachshund",
    title: "Dachshund Plushie",
    imageUrl: projectImage.dachshund,
    currentRow: 24,
    gauge: "6 sc x 7 rnds = 1 in",
    finishedSize: "9 in / 23 cm nose to tail",
    materials: DEMO_PROJECTS[0].materials,
    abbreviations: COMMON_ABBREV,
    sections: [
      {
        name: "Body & Head",
        sortOrder: 0,
        instructions: "Worked in continuous rounds with a stitch marker. Stuff as you go.",
        rows: buildDachshundRows(),
      },
    ],
  }),
  "demo-sunflower": () => ({
    projectId: "demo-sunflower",
    title: "Sunflower Bag",
    imageUrl: projectImage.sunflower,
    currentRow: 18,
    gauge: "4 dc x 4 rows = 1 in",
    finishedSize: "8 in flower, 12 in strap",
    materials: DEMO_PROJECTS[1].materials,
    abbreviations: COMMON_ABBREV,
    sections: [
      {
        name: "Flower & Bag",
        sortOrder: 0,
        instructions: "Brown center first, then gold petals, then green strap and bag back.",
        rows: buildSunflowerRows(),
      },
    ],
  }),
  "demo-granny": () => ({
    projectId: "demo-granny",
    title: "Granny Blanket",
    imageUrl: projectImage.granny,
    currentRow: 12,
    gauge: "One 3-rnd square = 4 in",
    finishedSize: "48 in × 60 in throw (40 squares)",
    materials: DEMO_PROJECTS[2].materials,
    abbreviations: COMMON_ABBREV,
    sections: [
      {
        name: "Granny Squares",
        sortOrder: 0,
        instructions: "Make 40 squares, then join in 8 rows of 5. Add border last.",
        rows: buildGrannyRows(),
      },
    ],
  }),
  "demo-sweater": () => ({
    projectId: "demo-sweater",
    title: "Cozy Sweater",
    imageUrl: projectImage.sweater,
    currentRow: 16,
    gauge: "14 hdc x 10 rows = 4 in",
    finishedSize: "Adult medium — 38 in chest",
    materials: DEMO_PROJECTS[3].materials,
    abbreviations: COMMON_ABBREV,
    sections: [
      {
        name: "Panels & Sleeves",
        sortOrder: 0,
        instructions: "Work flat in rows, seam at shoulders and sides. Sleeves worked in the round.",
        rows: buildSweaterRows(),
      },
    ],
  }),
  "demo-dino": () => ({
    projectId: "demo-dino",
    title: "Dino Plushie",
    imageUrl: projectImage.dino,
    currentRow: 34,
    gauge: "8 sc x 8 rnds = 1 in",
    finishedSize: "7 in / 18 cm tall",
    materials: DEMO_PROJECTS[4].materials,
    abbreviations: COMMON_ABBREV,
    sections: [
      {
        name: "Body",
        sortOrder: 0,
        instructions: "Worked in continuous rounds. Bobble stitches form the spine.",
        rows: buildDinoRows(),
      },
    ],
  }),
};

export function getDemoWorkspacePattern(projectId: string): WorkspacePattern | null {
  const factory = PATTERN_MAP[projectId];
  return factory ? factory() : null;
}

export function flattenPatternRows(pattern: WorkspacePattern): PatternRow[] {
  return pattern.sections
    .flatMap((section) => section.rows)
    .sort((a, b) => a.rowNumber - b.rowNumber);
}

export function getTotalRows(pattern: WorkspacePattern): number {
  return flattenPatternRows(pattern).length;
}
