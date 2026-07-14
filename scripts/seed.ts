import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "seed-output.json");

const DEMO_USER_ID = "00000000-0000-4000-8000-000000000001";

type SeedLesson = {
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration_minutes: number;
  sort_order: number;
  illustration_url: string;
  is_published: boolean;
};

type SeedProject = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: string;
  progress_percent: number;
  current_row: number;
  total_rows: number | null;
  cover_image_url: string;
};

type SeedYarn = {
  id: string;
  user_id: string;
  brand: string;
  name: string;
  color_name: string;
  color_hex: string;
  weight: string;
  fiber_content: string;
  yardage: number;
  weight_grams: number;
  quantity_skeins: number;
  image_url: string;
  notes: string;
};

type SeedPayload = {
  mode: "demo" | "supabase";
  seeded_at: string;
  demo_user_id: string;
  lessons: SeedLesson[];
  projects: SeedProject[];
  yarn_inventory: SeedYarn[];
};

const LESSONS: SeedLesson[] = [
  {
    slug: "holding-your-hook",
    title: "Holding Your Hook & Yarn",
    category: "Getting Started",
    description: "Learn a comfortable pencil or knife grip and how to tension yarn.",
    content:
      "Practice holding the hook like a pencil or knife. Wrap yarn over your non-dominant index finger to control tension.",
    difficulty: "beginner",
    duration_minutes: 8,
    sort_order: 1,
    illustration_url: "/assets/stitch/illustrations/png/single-crochet.png",
    is_published: true,
  },
  {
    slug: "making-a-slip-knot",
    title: "Making a Slip Knot",
    category: "Getting Started",
    description: "Start every project with a secure slip knot on your hook.",
    content: "Create a loop, pull yarn through, tighten onto the hook, and leave a short tail.",
    difficulty: "beginner",
    duration_minutes: 5,
    sort_order: 2,
    illustration_url: "/assets/stitch/illustrations/png/magic-ring.png",
    is_published: true,
  },
  {
    slug: "chain-stitch",
    title: "Chain Stitch (ch)",
    category: "Basic Stitches",
    description: "Foundation chains are the starting row for most flat crochet.",
    content: "Yarn over, pull through the loop on your hook. Repeat for the number of chains required.",
    difficulty: "beginner",
    duration_minutes: 10,
    sort_order: 3,
    illustration_url: "/assets/stitch/illustrations/png/single-crochet.png",
    is_published: true,
  },
  {
    slug: "single-crochet",
    title: "Single Crochet (sc)",
    category: "Basic Stitches",
    description: "The most common stitch for amigurumi and tight fabric.",
    content:
      "Insert hook, yarn over, pull up a loop, yarn over, pull through both loops on the hook.",
    difficulty: "beginner",
    duration_minutes: 12,
    sort_order: 4,
    illustration_url: "/assets/stitch/illustrations/png/single-crochet.png",
    is_published: true,
  },
  {
    slug: "double-crochet",
    title: "Double Crochet (dc)",
    category: "Basic Stitches",
    description: "Taller stitch used in blankets, garments, and lace.",
    content:
      "Yarn over, insert hook, yarn over and pull up a loop, yarn over and pull through two loops twice.",
    difficulty: "beginner",
    duration_minutes: 12,
    sort_order: 5,
    illustration_url: "/assets/stitch/illustrations/png/granny-blanket.png",
    is_published: true,
  },
  {
    slug: "increasing",
    title: "Increasing (inc)",
    category: "Shaping",
    description: "Add stitches in one place to widen your fabric or plushie.",
    content: "Work two stitches into the same stitch or space to increase stitch count by one.",
    difficulty: "beginner",
    duration_minutes: 10,
    sort_order: 6,
    illustration_url: "/assets/stitch/illustrations/png/increasing.png",
    is_published: true,
  },
  {
    slug: "decreasing",
    title: "Decreasing (dec)",
    category: "Shaping",
    description: "Reduce stitch count to taper shapes and close rounds.",
    content: "Insert hook in next stitch, pull up a loop, repeat in following stitch, yarn over, pull through all loops.",
    difficulty: "intermediate",
    duration_minutes: 10,
    sort_order: 7,
    illustration_url: "/assets/stitch/illustrations/png/decreasing.png",
    is_published: true,
  },
  {
    slug: "magic-ring",
    title: "Magic Ring",
    category: "Working in the Round",
    description: "Start amigurumi with a tight, adjustable center.",
    content: "Wrap yarn into a ring, crochet into the ring, pull tail to close, mark the first stitch.",
    difficulty: "intermediate",
    duration_minutes: 15,
    sort_order: 8,
    illustration_url: "/assets/stitch/illustrations/png/magic-ring.png",
    is_published: true,
  },
  {
    slug: "working-in-rounds",
    title: "Working in Rounds",
    category: "Working in the Round",
    description: "Use stitch markers and spiral rounds for seamless plushies.",
    content: "Place a marker in the first stitch of each round and move it up as you work.",
    difficulty: "intermediate",
    duration_minutes: 14,
    sort_order: 9,
    illustration_url: "/assets/stitch/illustrations/png/working-in-round.png",
    is_published: true,
  },
  {
    slug: "reading-pattern-abbreviations",
    title: "Reading Pattern Abbreviations",
    category: "Reading Patterns",
    description: "Decode common crochet shorthand used in patterns and charts.",
    content: "Learn sc, hdc, dc, tr, inc, dec, MR, and repeat notation like *...* x6.",
    difficulty: "beginner",
    duration_minutes: 9,
    sort_order: 10,
    illustration_url: "/assets/stitch/illustrations/png/pattern-ai.png",
    is_published: true,
  },
  {
    slug: "weaving-in-ends",
    title: "Weaving In Ends",
    category: "Finishing",
    description: "Secure yarn tails for durable finished projects.",
    content: "Thread the tail on a needle and weave through several stitches in multiple directions before trimming.",
    difficulty: "beginner",
    duration_minutes: 8,
    sort_order: 11,
    illustration_url: "/assets/stitch/illustrations/png/cozy-sweater.png",
    is_published: true,
  },
  {
    slug: "blocking-basics",
    title: "Blocking Basics",
    category: "Finishing",
    description: "Shape and relax fibers for a polished finish.",
    content: "Pin project to measurements, mist with water or steam lightly, and let dry completely.",
    difficulty: "intermediate",
    duration_minutes: 11,
    sort_order: 12,
    illustration_url: "/assets/stitch/illustrations/png/granny-blanket.png",
    is_published: true,
  },
];

function buildDemoProjects(userId: string): SeedProject[] {
  return [
    {
      id: randomUUID(),
      user_id: userId,
      title: "Dachshund Plushie",
      description: "Amigurumi dachshund with elongated body and floppy ears.",
      status: "In Progress",
      progress_percent: 68,
      current_row: 24,
      total_rows: 38,
      cover_image_url: "/assets/projects/dachshund-plushie.jpg",
    },
    {
      id: randomUUID(),
      user_id: userId,
      title: "Sunflower Bag",
      description: "Market bag with sunflower motif panel and sturdy handles.",
      status: "In Progress",
      progress_percent: 54,
      current_row: 18,
      total_rows: 34,
      cover_image_url: "/assets/projects/sunflower-bag.jpg",
    },
    {
      id: randomUUID(),
      user_id: userId,
      title: "Granny Blanket",
      description: "Classic granny square blanket in teal, coral, and cream.",
      status: "In Progress",
      progress_percent: 32,
      current_row: 12,
      total_rows: 40,
      cover_image_url: "/assets/projects/granny-blanket.jpg",
    },
    {
      id: randomUUID(),
      user_id: userId,
      title: "Cozy Sweater",
      description: "Top-down raglan sweater in soft merino blend.",
      status: "Ready to Start",
      progress_percent: 0,
      current_row: 0,
      total_rows: null,
      cover_image_url: "/assets/projects/cozy-sweater.jpg",
    },
  ];
}

function buildYarnInventory(userId: string): SeedYarn[] {
  return [
    {
      id: randomUUID(),
      user_id: userId,
      brand: "Stitch Co.",
      name: "Soft Cotton DK",
      color_name: "Teal",
      color_hex: "#2A9D8F",
      weight: "DK",
      fiber_content: "100% cotton",
      yardage: 245,
      weight_grams: 100,
      quantity_skeins: 3,
      image_url: "/assets/stitch/illustrations/png/yarn-teal.png",
      notes: "Great for bags and home decor.",
    },
    {
      id: randomUUID(),
      user_id: userId,
      brand: "Stitch Co.",
      name: "Soft Cotton DK",
      color_name: "Coral",
      color_hex: "#E76F51",
      weight: "DK",
      fiber_content: "100% cotton",
      yardage: 245,
      weight_grams: 100,
      quantity_skeins: 2,
      image_url: "/assets/stitch/illustrations/png/yarn-coral.png",
      notes: "Used in granny blanket squares.",
    },
    {
      id: randomUUID(),
      user_id: userId,
      brand: "Nuvio Loft",
      name: "Merino Worsted",
      color_name: "Cream",
      color_hex: "#F4F1DE",
      weight: "Worsted",
      fiber_content: "80% merino, 20% nylon",
      yardage: 220,
      weight_grams: 100,
      quantity_skeins: 5,
      image_url: "/assets/stitch/illustrations/png/yarn-cream.png",
      notes: "Primary yarn for plushie bodies.",
    },
    {
      id: randomUUID(),
      user_id: userId,
      brand: "Nuvio Loft",
      name: "Merino Worsted",
      color_name: "Lavender",
      color_hex: "#B8A9C9",
      weight: "Worsted",
      fiber_content: "80% merino, 20% nylon",
      yardage: 220,
      weight_grams: 100,
      quantity_skeins: 1,
      image_url: "/assets/stitch/illustrations/png/yarn-lavender.png",
      notes: "Accent color for flowers and trims.",
    },
    {
      id: randomUUID(),
      user_id: userId,
      brand: "Golden Thread",
      name: "Sparkle Fingering",
      color_name: "Gold",
      color_hex: "#E9C46A",
      weight: "Fingering",
      fiber_content: "75% wool, 25% metallic",
      yardage: 400,
      weight_grams: 100,
      quantity_skeins: 1,
      image_url: "/assets/stitch/illustrations/png/yarn-gold.png",
      notes: "Sunflower bag center detail.",
    },
  ];
}

function buildSeedPayload(userId: string, mode: SeedPayload["mode"]): SeedPayload {
  return {
    mode,
    seeded_at: new Date().toISOString(),
    demo_user_id: userId,
    lessons: LESSONS,
    projects: buildDemoProjects(userId),
    yarn_inventory: buildYarnInventory(userId),
  };
}

function isTruthy(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}

function hasSupabaseCredentials(): boolean {
  return Boolean(
    process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
  );
}

function shouldUseDemoMode(): boolean {
  return (
    isTruthy(process.env.DEMO_MODE) ||
    isTruthy(process.env.NEXT_PUBLIC_DEMO_MODE) ||
    !hasSupabaseCredentials()
  );
}

async function writeDemoOutput(payload: SeedPayload): Promise<void> {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote local demo seed to ${OUTPUT_PATH}`);
}

async function seedLessons(supabase: SupabaseClient): Promise<void> {
  const { error } = await supabase.from("lessons").upsert(LESSONS, { onConflict: "slug" });
  if (error) {
    throw new Error(`Failed to seed lessons: ${error.message}`);
  }
  console.log(`Seeded ${LESSONS.length} lessons`);
}

async function seedUserScopedData(
  supabase: SupabaseClient,
  userId: string,
  payload: SeedPayload,
): Promise<void> {
  const { error: projectsError } = await supabase.from("projects").insert(payload.projects);
  if (projectsError) {
    throw new Error(`Failed to seed projects: ${projectsError.message}`);
  }
  console.log(`Seeded ${payload.projects.length} projects`);

  const { error: yarnError } = await supabase.from("yarn_inventory").insert(payload.yarn_inventory);
  if (yarnError) {
    throw new Error(`Failed to seed yarn inventory: ${yarnError.message}`);
  }
  console.log(`Seeded ${payload.yarn_inventory.length} yarn inventory items`);
}

async function seedSupabase(payload: SeedPayload): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY!;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await seedLessons(supabase);

  const seedUserId = process.env.SEED_USER_ID ?? payload.demo_user_id;
  if (process.env.SEED_USER_ID) {
    await seedUserScopedData(supabase, seedUserId, {
      ...payload,
      demo_user_id: seedUserId,
      projects: buildDemoProjects(seedUserId),
      yarn_inventory: buildYarnInventory(seedUserId),
    });
  } else {
    console.log(
      "Lessons seeded. Set SEED_USER_ID to an existing auth user to seed projects and yarn inventory.",
    );
  }
}

async function main(): Promise<void> {
  const demoMode = shouldUseDemoMode();
  const payload = buildSeedPayload(DEMO_USER_ID, demoMode ? "demo" : "supabase");

  if (demoMode) {
    await writeDemoOutput(payload);
    console.log("Demo mode: no Supabase credentials or DEMO_MODE enabled.");
    return;
  }

  await seedSupabase(payload);
  await writeDemoOutput(payload);
  console.log("Supabase seed complete.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Seed failed: ${message}`);
  process.exit(1);
});
