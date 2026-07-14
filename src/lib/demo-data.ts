import { assetPath } from "@/lib/constants";
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
  avatarUrl: assetPath.avatar("avatar-3"),
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
    imageUrl: assetPath.illustration("dachshund-plushie"),
    yarnName: "Bernat Velvet",
    hookSize: "4.0mm",
    timeSpentMinutes: 405,
    rowPreview:
      "Rnd 24: (sc in next 3 sts, inc) repeat 6 times — 42 sts",
    href: "/workspace/demo-dachshund",
  },
  {
    id: "demo-sunflower",
    title: "Sunflower Bag",
    status: "In Progress",
    progressPercent: 54,
    currentRow: 18,
    totalRows: 34,
    imageUrl: assetPath.illustration("sunflower-bag"),
    yarnName: "Red Heart Super Saver",
    hookSize: "5.0mm",
    timeSpentMinutes: 220,
    href: "/workspace/demo-sunflower",
  },
  {
    id: "demo-granny",
    title: "Granny Blanket",
    status: "In Progress",
    progressPercent: 32,
    currentRow: 12,
    totalRows: 40,
    imageUrl: assetPath.illustration("granny-blanket"),
    yarnName: "Caron Simply Soft",
    hookSize: "5.5mm",
    timeSpentMinutes: 180,
    href: "/workspace/demo-granny",
  },
  {
    id: "demo-sweater",
    title: "Cozy Sweater",
    status: "Paused",
    progressPercent: 15,
    currentRow: 16,
    totalRows: 52,
    imageUrl: assetPath.illustration("cozy-sweater"),
    yarnName: "Lion Brand Wool-Ease",
    hookSize: "6.0mm",
    timeSpentMinutes: 310,
    href: "/workspace/demo-sweater",
  },
  {
    id: "demo-dino",
    title: "Dino Plushie",
    status: "In Progress",
    progressPercent: 77,
    currentRow: 34,
    totalRows: 44,
    imageUrl: assetPath.illustration("dino-plushie"),
    yarnName: "Paintbox Yarns Cotton DK",
    hookSize: "3.5mm",
    timeSpentMinutes: 0,
    href: "/workspace/demo-dino",
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
    illustrationUrl: assetPath.illustration("magic-ring"),
    href: "/learn/magic-ring",
  },
  {
    id: "demo-lesson-single-crochet",
    slug: "single-crochet",
    title: "Single Crochet",
    category: "Crochet Basics",
    progressPercent: 100,
    durationMinutes: 18,
    illustrationUrl: assetPath.illustration("single-crochet"),
    href: "/learn/single-crochet",
  },
  {
    id: "demo-lesson-increasing",
    slug: "increasing",
    title: "Increasing",
    category: "Shaping",
    progressPercent: 60,
    durationMinutes: 15,
    illustrationUrl: assetPath.illustration("increasing"),
    href: "/learn/increasing",
  },
  {
    id: "demo-lesson-decreasing",
    slug: "decreasing",
    title: "Decreasing",
    category: "Shaping",
    progressPercent: 40,
    durationMinutes: 15,
    illustrationUrl: assetPath.illustration("decreasing"),
    href: "/learn/decreasing",
  },
  {
    id: "demo-lesson-working-in-round",
    slug: "working-in-round",
    title: "Working in the Round",
    category: "Amigurumi",
    progressPercent: 0,
    durationMinutes: 20,
    illustrationUrl: assetPath.illustration("working-in-round"),
    href: "/learn/working-in-round",
  },
];

export const DEMO_YARN_PREVIEW: DemoYarnPreview[] = [
  {
    id: "demo-yarn-coral",
    name: "Bernat Velvet",
    colorName: "Coral Blush",
    imageUrl: assetPath.illustration("yarn-coral"),
    isLowStock: false,
  },
  {
    id: "demo-yarn-teal",
    name: "Paintbox Cotton DK",
    colorName: "Marine",
    imageUrl: assetPath.illustration("yarn-teal"),
    isLowStock: true,
  },
  {
    id: "demo-yarn-gold",
    name: "Red Heart Super Saver",
    colorName: "Gold",
    imageUrl: assetPath.illustration("yarn-gold"),
    isLowStock: false,
  },
  {
    id: "demo-yarn-lavender",
    name: "Caron Simply Soft",
    colorName: "Lavender",
    imageUrl: assetPath.illustration("yarn-lavender"),
    isLowStock: true,
  },
  {
    id: "demo-yarn-cream",
    name: "Lion Brand Wool-Ease",
    colorName: "Fisherman",
    imageUrl: assetPath.illustration("yarn-cream"),
    isLowStock: true,
  },
];

export const DEMO_RECOMMENDATIONS: DemoRecommendation[] = [
  {
    id: "demo-rec-frog-prince",
    title: "Frog Prince Plushie",
    description:
      "A charming amigurumi project that matches your Bernat Velvet stash and intermediate skill level.",
    imageUrl: assetPath.illustration("frog-prince"),
    href: "/create/plushie?template=frog-prince",
    reason: "Uses yarn you already own",
  },
  {
    id: "demo-rec-color-studio",
    title: "Try Color Studio",
    description:
      "Build a custom palette from your coral and teal yarns for your next sunflower-inspired project.",
    imageUrl: assetPath.illustration("color-studio"),
    href: "/create/colors",
    reason: "Based on your recent projects",
  },
];

export const DEMO_WHAT_CAN_I_MAKE: DemoRecommendation = {
  id: "demo-make-sunflower",
  title: "Mini Sunflower Coaster Set",
  description:
    "You have enough gold and cream yarn for a cheerful 4-piece coaster set this weekend.",
  imageUrl: assetPath.illustration("sunflower-bag"),
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
    imageUrl: assetPath.illustration("camera-scan"),
    createdAt: "2026-07-12T18:42:00.000Z",
    href: "/vision/history/demo-scan-1",
  },
  {
    id: "demo-scan-2",
    projectTitle: "Sunflower Bag",
    scanType: "Row counter",
    confidence: 0.92,
    summary: "Estimated row 18 with consistent edge tension.",
    imageUrl: assetPath.illustration("camera-scan"),
    createdAt: "2026-07-11T14:15:00.000Z",
    href: "/vision/history/demo-scan-2",
  },
  {
    id: "demo-scan-3",
    projectTitle: "Granny Blanket",
    scanType: "Pattern read",
    confidence: 0.79,
    summary: "Granny cluster pattern recognized; slight tension variation noted.",
    imageUrl: assetPath.illustration("camera-scan"),
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
