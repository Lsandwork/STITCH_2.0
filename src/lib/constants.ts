export const ASSETS_BASE = "/assets/stitch";

export const assetPath = {
  brand: (name: string) => `${ASSETS_BASE}/brand/svg/${name}.svg`,
  icon: (name: string) => `${ASSETS_BASE}/icons/svg/${name}.svg`,
  illustration: (name: string) =>
    `${ASSETS_BASE}/illustrations/png/${name}.png`,
  illustrationSvg: (name: string) =>
    `${ASSETS_BASE}/illustrations/svg/${name}.svg`,
  avatar: (name: string, format: "png" | "svg" = "svg") =>
    `${ASSETS_BASE}/avatars/${format}/${name}.${format}`,
  background: (name: string) => `${ASSETS_BASE}/backgrounds/svg/${name}.svg`,
} as const;

export const BRAND = {
  name: "Stitch by Nuvio",
  tagline: "Your smartest crochet companion.",
  secondaryTagline: "Create it. Stitch it. Fix it. Finish it.",
  domain: "stitch.nuviobridge.com",
  logoHorizontal: assetPath.brand("stitch-by-nuvio-horizontal"),
  wordmark: assetPath.brand("stitch-wordmark"),
  mark: assetPath.brand("stitch-mark"),
} as const;

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Create Studio", href: "/create", icon: "create" },
  { label: "Pattern Workspace", href: "/workspace", icon: "pattern" },
  { label: "Vision Mode", href: "/vision", icon: "vision" },
  { label: "Crochet Tutor", href: "/tutor", icon: "tutor" },
  { label: "Yarn Vault", href: "/yarn", icon: "yarn" },
  { label: "My Projects", href: "/projects", icon: "projects" },
  { label: "Learn", href: "/learn", icon: "learn" },
  { label: "Saved Patterns", href: "/patterns", icon: "bookmark" },
  { label: "Profile & Settings", href: "/settings", icon: "settings" },
];

export type QuickAction = {
  label: string;
  href: string;
  icon: string;
};

export const QUICK_ACTIONS: QuickAction[] = [
  { label: "Create Pattern", href: "/create/pattern", icon: "sparkles" },
  { label: "Scan My Work", href: "/vision/scan", icon: "camera" },
  { label: "Ask Tutor", href: "/tutor", icon: "chat" },
  { label: "Add Yarn", href: "/yarn/add", icon: "yarn" },
  { label: "Upload Pattern", href: "/patterns", icon: "upload" },
  { label: "From a Photo", href: "/create/photo", icon: "image" },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Create", href: "/create", icon: "sparkles" },
  { label: "Project", href: "/projects", icon: "projects" },
  { label: "Vision", href: "/vision", icon: "vision" },
  { label: "More", href: "/settings", icon: "menu" },
];

export type SubscriptionTierId = "free" | "stitch_plus" | "stitch_vision";

export type SubscriptionTier = {
  id: SubscriptionTierId;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Essential crochet tools to get started.",
    features: [
      "Up to 3 active projects",
      "Basic manual row counter",
      "3 pattern uploads",
      "10 Tutor messages per month",
      "Manual Yarn Vault",
    ],
  },
  {
    id: "stitch_plus",
    name: "Stitch Plus",
    price: "$9.99/mo",
    description: "AI-powered pattern tools and unlimited projects.",
    features: [
      "Unlimited projects",
      "AI pattern generation",
      "Pattern translation",
      "Voice pattern player",
      "Yarn substitutions",
      "Color Studio",
      "PDF export",
    ],
    highlighted: true,
  },
  {
    id: "stitch_vision",
    name: "Stitch Vision",
    price: "$14.99/mo",
    description: "Everything in Plus with camera intelligence.",
    features: [
      "Everything in Stitch Plus",
      "Camera stitch analysis",
      "Smart row detection",
      "Mistake detection",
      "Photo-to-pattern",
      "Advanced scan history",
    ],
  },
];

export const PROJECT_STATUSES = [
  "Idea",
  "Ready to Start",
  "In Progress",
  "Paused",
  "Needs Fixing",
  "Completed",
  "Frogged",
  "Archived",
] as const;

export const SKILL_LEVELS = ["beginner", "intermediate", "advanced"] as const;

export const AUTH_ROUTES = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
] as const;

export const PUBLIC_ROUTE_PREFIXES = [
  "/auth",
  "/assets",
  "/_next",
  "/favicon",
  "/manifest",
] as const;

export function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_DATA === "true";
}
