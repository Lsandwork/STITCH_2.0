import { projectImage, yarnImage, lessonImage, scanImage } from "@/lib/project-images";
import type { ProjectStatus } from "@/types/database";

export type DemoUser = {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  greeting: string;
  subscriptionTier: "stitch_plus";
};

export type DemoProject = {
  id: string;
  title: string;
  status: ProjectStatus;
  progressPercent: number;
  currentRow: number;
  totalRows: number;
  imageUrl: string;
  yarnName: string;
  hookSize: string;
  timeSpentMinutes: number;
  rowPreview?: string;
  href: string;
  description: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  finishedSize: string;
  materials: string[];
  overview: string[];
};

export type DemoLesson = {
  id: string;
  slug: string;
  title: string;
  category: string;
  progressPercent: number;
  durationMinutes: number;
  illustrationUrl: string;
  href: string;
  steps: string[];
  tip: string;
};

export type DemoYarnPreview = {
  id: string;
  name: string;
  colorName: string;
  imageUrl: string;
  isLowStock: boolean;
};

export type DemoRecommendation = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  reason: string;
};

export type DemoScan = {
  id: string;
  projectTitle: string;
  scanType: string;
  confidence: number;
  summary: string;
  imageUrl: string;
  createdAt: string;
  href: string;
};

export type DemoDashboardData = {
  user: DemoUser;
  continueProject: DemoProject;
  projects: DemoProject[];
  lessons: DemoLesson[];
  yarnVault: {
    totalYarns: number;
    lowStockCount: number;
    previewYarns: DemoYarnPreview[];
    href: string;
  };
  recommendations: DemoRecommendation[];
  whatCanIMake: DemoRecommendation;
  recentScans: DemoScan[];
  unreadNotifications: number;
};

export const DEMO_USER: DemoUser = {
  id: "demo-user-emma",
  displayName: "Emma",
  email: "emma@demo.stitch.nuviobridge.com",
  avatarUrl: "/assets/stitch/avatars/svg/avatar-3.svg",
  skillLevel: "intermediate",
  greeting: "Welcome back, Emma!",
  subscriptionTier: "stitch_plus",
};

export const DEMO_PROJECTS: DemoProject[] = [
  {
    id: "demo-dachshund",
    title: "Dachshund Plushie",
    status: "In Progress",
    progressPercent: 68,
    currentRow: 24,
    totalRows: 38,
    imageUrl: projectImage.dachshund,
    yarnName: "Bernat Velvet — Chocolate Brown",
    hookSize: "4.0 mm (G-6)",
    timeSpentMinutes: 405,
    rowPreview:
      "Rnd 24: Sc in each st around, inc in every 6th st — you should have 28 sts",
    href: "/workspace/demo-dachshund",
    skillLevel: "intermediate",
    finishedSize: '9 in / 23 cm nose to tail',
    description:
      "A low-sew amigurumi dachshund with a long body, floppy ears, and embroidered face details. Worked entirely in the round.",
    materials: [
      "Bernat Velvet — Chocolate Brown (1 skein)",
      "Bernat Velvet — Cream (small amount for snout)",
      "4.0 mm crochet hook",
      "Polyester stuffing",
      "12 mm safety eyes",
      "Black embroidery floss",
      "Stitch marker",
    ],
    overview: [
      "Start with a magic ring and work the head, then continue into the elongated body without joining.",
      "Stuff firmly as you go — the long body needs even stuffing to keep its shape.",
      "Ears and legs are made separately and sewn on at the end.",
      "Use a stitch marker every round — it's easy to lose your place on long body rounds.",
    ],
  },
  {
    id: "demo-sunflower",
    title: "Sunflower Bag",
    status: "In Progress",
    progressPercent: 54,
    currentRow: 18,
    totalRows: 34,
    imageUrl: projectImage.sunflower,
    yarnName: "Red Heart Super Saver — Gold & Brown",
    hookSize: "5.0 mm (H-8)",
    timeSpentMinutes: 220,
    rowPreview:
      "Rnd 18: Work 12 dc petals around the brown center — 12 petals total",
    href: "/workspace/demo-sunflower",
    skillLevel: "beginner",
    finishedSize: "8 in / 20 cm diameter flower, 12 in strap",
    description:
      "A cheerful sunflower motif bag with a brown center, yellow petals, and a sturdy green strap. Perfect for market days.",
    materials: [
      "Red Heart Super Saver — Gold (1 skein)",
      "Red Heart Super Saver — Coffee (½ skein)",
      "Red Heart Super Saver — Green (½ skein)",
      "5.0 mm crochet hook",
      "Lining fabric (optional)",
      "Button or magnetic snap",
    ],
    overview: [
      "Make the brown center first in continuous rounds, then attach yellow petals.",
      "Each petal is worked individually and joined to the center ring.",
      "The bag back and strap are worked in rows of single crochet for durability.",
      "Line the bag if you plan to carry heavier items.",
    ],
  },
  {
    id: "demo-granny",
    title: "Granny Blanket",
    status: "In Progress",
    progressPercent: 32,
    currentRow: 12,
    totalRows: 40,
    imageUrl: projectImage.granny,
    yarnName: "Caron Simply Soft — Multi",
    hookSize: "5.5 mm (I-9)",
    timeSpentMinutes: 180,
    rowPreview:
      "Square 12: Work 3 dc clusters per side with ch-1 corners — join with sl st",
    href: "/workspace/demo-granny",
    skillLevel: "beginner",
    finishedSize: "48 in × 60 in throw",
    description:
      "A classic granny square blanket made from colorful individual squares joined together. Great for using up yarn scraps.",
    materials: [
      "Caron Simply Soft — assorted colors (6–8 skeins)",
      "5.5 mm crochet hook",
      "Yarn needle for joining",
      "Blocking mats (optional)",
    ],
    overview: [
      "Each square starts with a magic ring and works outward in 3-dc clusters.",
      "Change colors every round or every square — there's no wrong way.",
      "Join squares with slip stitch or whip stitch as you go, or make all squares first.",
      "Add a simple border of dc around the entire blanket when all squares are joined.",
    ],
  },
  {
    id: "demo-sweater",
    title: "Cozy Sweater",
    status: "Paused",
    progressPercent: 15,
    currentRow: 16,
    totalRows: 52,
    imageUrl: projectImage.sweater,
    yarnName: "Lion Brand Wool-Ease — Fisherman",
    hookSize: "6.0 mm (J-10)",
    timeSpentMinutes: 310,
    rowPreview:
      "Row 16: Sc across 42 sts, turn — back panel half complete",
    href: "/workspace/demo-sweater",
    skillLevel: "advanced",
    finishedSize: "Adult medium — 38 in chest",
    description:
      "A relaxed-fit crochet pullover worked in panels and seamed. Features ribbed cuffs and a cozy rolled collar.",
    materials: [
      "Lion Brand Wool-Ease — Fisherman (5 skeins)",
      "6.0 mm crochet hook",
      "5.0 mm hook for ribbing",
      "Stitch markers",
      "Yarn needle",
      "Blocking pins",
    ],
    overview: [
      "Work the back panel first in rows of half double crochet.",
      "Front panel is identical with a neckline opening at the top.",
      "Sleeves are worked flat and seamed, then set into the armholes.",
      "Check gauge before starting — 14 hdc × 10 rows = 4 in square.",
    ],
  },
  {
    id: "demo-dino",
    title: "Dino Plushie",
    status: "In Progress",
    progressPercent: 77,
    currentRow: 34,
    totalRows: 44,
    imageUrl: projectImage.dino,
    yarnName: "Paintbox Yarns Cotton DK — Green",
    hookSize: "3.5 mm (E-4)",
    timeSpentMinutes: 280,
    rowPreview:
      "Rnd 34: Dec around to close body — stuff firmly before final rounds",
    href: "/workspace/demo-dino",
    skillLevel: "intermediate",
    finishedSize: '7 in / 18 cm tall standing',
    description:
      "A friendly standing dinosaur with spines down the back, stubby legs, and a big smile. Low-sew construction.",
    materials: [
      "Paintbox Yarns Cotton DK — Grass Green (1 skein)",
      "Paintbox Yarns Cotton DK — Lemon (small amount)",
      "3.5 mm crochet hook",
      "Polyester stuffing",
      "9 mm safety eyes",
      "White felt for teeth (optional)",
      "Stitch marker",
    ],
    overview: [
      "Body and head are one piece — start at the feet and work upward.",
      "Spines are crocheted as you go by working bobble stitches on alternate rounds.",
      "Arms and tail are made separately and sewn on.",
      "Use tight stitches (3.5 mm hook) so stuffing doesn't show through.",
    ],
  },
];

export const DEMO_LESSONS: DemoLesson[] = [
  {
    id: "demo-lesson-magic-ring",
    slug: "magic-ring",
    title: "Magic Ring",
    category: "Working in the Round",
    progressPercent: 100,
    durationMinutes: 12,
    illustrationUrl: lessonImage.magicRing,
    href: "/learn/magic-ring",
    steps: [
      "Hold the yarn tail between your thumb and middle finger on your non-dominant hand — this controls the starting tension.",
      "Wrap the working yarn around your index and middle fingers twice, crossing the yarn to form an X.",
      "Insert the hook under both loops from front to back. Yarn over (wrap yarn over the hook from back to front).",
      "Pull the yarn through both loops — you now have one loop on the hook.",
      "Chain 1 to lock the ring. This chain does not count as a stitch.",
      "Work your first round of stitches (usually 6 single crochet) into the center of the ring, crocheting over both the ring and the yarn tail.",
      "Hold the ring flat with your fingers while you work — it helps keep stitches even.",
      "After completing the round, pull the yarn tail firmly. The center hole should close completely.",
      "Replace the stitch marker in the first stitch of the round before continuing to Round 2.",
      "Keep the tail long until you've finished 2–3 rounds — you can tug it again if the center loosens.",
    ],
    tip: "Keep the tail long until you've worked 2–3 rounds — it's your safety net if the ring loosens.",
  },
  {
    id: "demo-lesson-single-crochet",
    slug: "single-crochet",
    title: "Single Crochet",
    category: "Crochet Basics",
    progressPercent: 100,
    durationMinutes: 18,
    illustrationUrl: lessonImage.singleCrochet,
    href: "/learn/single-crochet",
    steps: [
      "Insert your hook under the top two loops of the next stitch (both loops, not just the front).",
      "Yarn over — wrap the yarn from back to front over the hook.",
      "Pull the yarn through the stitch. You now have 2 loops on the hook.",
      "Yarn over again.",
      "Pull through both loops on the hook. That is one single crochet (sc) completed.",
      "Move to the next stitch and repeat steps 1–5 across the row.",
      "Count your stitches at the end of the row to make sure you didn't skip or add any.",
      "At the end of the row: chain 1 (this is the turning chain for sc height).",
      "Turn your work so the opposite side faces you — the hook is now at the right edge, ready for the next row.",
      "Work into the first stitch of the new row (not the turning chain unless the pattern says so).",
    ],
    tip: "Keep your tension even — if stitches feel too tight, try a hook one size larger.",
  },
  {
    id: "demo-lesson-increasing",
    slug: "increasing",
    title: "Increasing",
    category: "Shaping",
    progressPercent: 60,
    durationMinutes: 15,
    illustrationUrl: lessonImage.increasing,
    href: "/learn/increasing",
    steps: [
      "Identify the stitch where you need to increase — usually marked in the pattern as 'inc'.",
      "Work a normal single crochet in that stitch: insert hook, yarn over, pull up a loop, yarn over, pull through both loops.",
      "Without moving to the next stitch, work a second single crochet in the SAME stitch.",
      "You have now added one extra stitch — your stitch count went up by 1.",
      "For even shaping in the round: space increases evenly. Example: 'inc every 6th st' means sc in 5 stitches, then inc in the 6th.",
      "Count all stitches after each increase round. Write the number down — amigurumi patterns depend on accurate counts.",
      "Place a stitch marker in the first stitch of each round so you know when you've completed a full circle.",
      "If your piece is cupping (edges pulling up), you may need more increases. If it's ruffling (edges wavy), you may need fewer.",
    ],
    tip: "Mark the first increase of each round with a stitch marker so you know where the round begins.",
  },
  {
    id: "demo-lesson-decreasing",
    slug: "decreasing",
    title: "Decreasing",
    category: "Shaping",
    progressPercent: 40,
    durationMinutes: 15,
    illustrationUrl: lessonImage.decreasing,
    href: "/learn/decreasing",
    steps: [
      "Insert your hook into the next stitch. Yarn over and pull up a loop — 2 loops on the hook.",
      "Do NOT finish this stitch. Instead, insert the hook into the FOLLOWING stitch.",
      "Yarn over and pull up a loop again — you now have 3 loops on the hook.",
      "Yarn over one more time and pull through all 3 loops at once.",
      "That is one decrease (written as sc2tog — single crochet two together). Your stitch count dropped by 1.",
      "For amigurumi: decreases usually happen evenly around the round, e.g., 'sc in 4, dec' repeated 6 times.",
      "Stuff your piece BEFORE the opening gets too small — once you're down to 12 stitches, stuffing is difficult.",
      "Use the invisible decrease for a smoother finish: insert hook through the front loop only of the next 2 stitches, then yarn over and pull through all loops.",
    ],
    tip: "Decrease rounds are common at the top of amigurumi heads — stuff well before the last decrease round.",
  },
  {
    id: "demo-lesson-working-in-round",
    slug: "working-in-round",
    title: "Working in the Round",
    category: "Amigurumi",
    progressPercent: 0,
    durationMinutes: 20,
    illustrationUrl: lessonImage.workingInRound,
    href: "/learn/working-in-round",
    steps: [
      "Start with a magic ring (see Magic Ring lesson) or chain 2 and work into the first chain.",
      "Place a stitch marker in the first stitch of Round 1 — this is essential for tracking your place.",
      "Work each round in a continuous spiral. Do NOT join with a slip stitch at the end of each round.",
      "When you finish Round 1, move the marker to the first stitch of Round 2 before you begin.",
      "The stitch marker shows where each new round starts — without it, you will lose count.",
      "Most amigurumi uses single crochet in spirals. Your piece will have a slight diagonal 'jog' — this is normal.",
      "Add stuffing as you go. For heads and bodies, stuff firmly every 3–4 rounds so the shape stays round.",
      "Before the final decrease rounds, fill the piece completely — under-stuffed toys look lumpy and collapse.",
      "When the opening is 6 stitches or fewer, finish stuffing through the hole, then close with decreases.",
      "Weave the yarn tail through the last 6 stitches, pull tight, and bury the end inside the piece.",
    ],
    tip: "The 'jog' (slight stair-step) at round joins is normal in spiral work — it won't show on stuffed toys.",
  },
];

export const DEMO_YARN_PREVIEW: DemoYarnPreview[] = [
  {
    id: "demo-yarn-coral",
    name: "Bernat Velvet",
    colorName: "Coral Blush",
    imageUrl: yarnImage.coral,
    isLowStock: false,
  },
  {
    id: "demo-yarn-teal",
    name: "Paintbox Cotton DK",
    colorName: "Marine",
    imageUrl: yarnImage.teal,
    isLowStock: true,
  },
  {
    id: "demo-yarn-gold",
    name: "Red Heart Super Saver",
    colorName: "Gold",
    imageUrl: yarnImage.gold,
    isLowStock: false,
  },
  {
    id: "demo-yarn-lavender",
    name: "Caron Simply Soft",
    colorName: "Lavender",
    imageUrl: yarnImage.lavender,
    isLowStock: true,
  },
  {
    id: "demo-yarn-cream",
    name: "Lion Brand Wool-Ease",
    colorName: "Fisherman",
    imageUrl: yarnImage.cream,
    isLowStock: true,
  },
];

export const DEMO_RECOMMENDATIONS: DemoRecommendation[] = [
  {
    id: "demo-rec-frog-prince",
    title: "Frog Prince Plushie",
    description:
      "A charming amigurumi frog with a crown — matches your Bernat Velvet stash and intermediate skill level.",
    imageUrl: projectImage.frog,
    href: "/create/plushie?template=frog-prince",
    reason: "Uses yarn you already own",
  },
  {
    id: "demo-rec-color-studio",
    title: "Try Color Studio",
    description:
      "Build a custom palette from your coral and teal yarns for your next sunflower-inspired project.",
    imageUrl: projectImage.colorStudio,
    href: "/create/colors",
    reason: "Based on your recent projects",
  },
];

export const DEMO_WHAT_CAN_I_MAKE: DemoRecommendation = {
  id: "demo-make-sunflower",
  title: "Mini Sunflower Coaster Set",
  description:
    "You have enough gold and cream yarn for a cheerful 4-piece coaster set this weekend.",
  imageUrl: projectImage.sunflowerCoasters,
  href: "/create/pattern?idea=sunflower-coasters",
  reason: "Matches yarn in your vault",
};

export const DEMO_RECENT_SCANS: DemoScan[] = [
  {
    id: "demo-scan-1",
    projectTitle: "Dachshund Plushie",
    scanType: "Stitch check",
    confidence: 0.87,
    summary: "Row 24 detected with 2 likely missed stitches near the tail join.",
    imageUrl: scanImage.dachshund,
    createdAt: "2026-07-12T18:42:00.000Z",
    href: "/vision/history/demo-scan-1",
  },
  {
    id: "demo-scan-2",
    projectTitle: "Sunflower Bag",
    scanType: "Row counter",
    confidence: 0.92,
    summary: "Estimated row 18 with consistent edge tension.",
    imageUrl: scanImage.sunflower,
    createdAt: "2026-07-11T14:15:00.000Z",
    href: "/vision/history/demo-scan-2",
  },
  {
    id: "demo-scan-3",
    projectTitle: "Granny Blanket",
    scanType: "Pattern read",
    confidence: 0.79,
    summary: "Granny cluster pattern recognized; slight tension variation noted.",
    imageUrl: scanImage.granny,
    createdAt: "2026-07-10T09:08:00.000Z",
    href: "/vision/history/demo-scan-3",
  },
];

export const DEMO_DASHBOARD: DemoDashboardData = {
  user: DEMO_USER,
  continueProject: DEMO_PROJECTS[0],
  projects: DEMO_PROJECTS,
  lessons: DEMO_LESSONS,
  yarnVault: {
    totalYarns: 23,
    lowStockCount: 3,
    previewYarns: DEMO_YARN_PREVIEW,
    href: "/yarn",
  },
  recommendations: DEMO_RECOMMENDATIONS,
  whatCanIMake: DEMO_WHAT_CAN_I_MAKE,
  recentScans: DEMO_RECENT_SCANS,
  unreadNotifications: 2,
};

export function getDemoDashboardData(): DemoDashboardData {
  return DEMO_DASHBOARD;
}

export function getDemoProject(id: string): DemoProject | undefined {
  return DEMO_PROJECTS.find((p) => p.id === id);
}

export function getDemoLesson(slug: string): DemoLesson | undefined {
  return DEMO_LESSONS.find((l) => l.slug === slug || l.id === slug);
}
