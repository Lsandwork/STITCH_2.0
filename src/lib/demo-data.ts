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
      "Hold the yarn tail between your thumb and middle finger.",
      "Wrap the working yarn around your index and middle fingers twice.",
      "Insert the hook under both loops, yarn over, and pull up a loop.",
      "Chain 1 to secure, then work your first round of stitches into the ring.",
      "Pull the tail tight to close the center hole completely.",
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
      "Insert hook into the next stitch.",
      "Yarn over and pull up a loop — you now have 2 loops on the hook.",
      "Yarn over again and pull through both loops.",
      "That's one single crochet! Repeat across the row.",
      "At the end of the row, chain 1 and turn your work.",
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
      "Work 2 single crochets into the same stitch.",
      "This adds one extra stitch to your round or row count.",
      "For even shaping, space increases evenly — e.g., 'inc every 6th st'.",
      "Count your stitches after each increase round to stay on track.",
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
      "Insert hook into the next stitch, yarn over, pull up a loop (2 loops on hook).",
      "Insert hook into the following stitch, yarn over, pull up a loop (3 loops on hook).",
      "Yarn over and pull through all 3 loops — that's one decrease (sc2tog).",
      "Your stitch count drops by 1 each time you decrease.",
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
      "Start with a magic ring (see Magic Ring lesson).",
      "Work each round continuously without joining — use a stitch marker to track the start.",
      "Move the marker up after completing each round.",
      "Most amigurumi uses single crochet in continuous spirals.",
      "Stuff the piece as you go, especially before the opening gets too small.",
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
  imageUrl: projectImage.sunflower,
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
