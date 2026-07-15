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

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Users", href: "/admin/users", icon: "users" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Create Studio", href: "/create", icon: "create" },
  { label: "Pattern Workspace", href: "/workspace", icon: "pattern" },
  { label: "Vision Mode", href: "/vision", icon: "vision" },
  { label: "Crochet Tutor", href: "/tutor", icon: "tutor" },
  { label: "Yarn Vault", href: "/yarn", icon: "yarn" },
  { label: "My Projects", href: "/projects", icon: "projects" },
  { label: "Learn", href: "/learn", icon: "learn" },
  { label: "Vocab", href: "/vocab", icon: "book" },
  { label: "Saved Patterns", href: "/patterns", icon: "bookmark" },
  { label: "Marketplace", href: "/marketplace", icon: "star" },
  { label: "Social Network", href: "/social", icon: "users" },
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
  { label: "Marketplace", href: "/marketplace", icon: "star" },
  { label: "Social Feed", href: "/social", icon: "users" },
  { label: "From a Photo", href: "/create/photo", icon: "image" },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Social", href: "/social", icon: "users" },
  { label: "Create", href: "/create", icon: "sparkles" },
  { label: "Market", href: "/marketplace", icon: "star" },
  { label: "More", href: "/settings", icon: "menu" },
];

import {
  BILLING_PLANS,
  BILLING_PROMO,
  formatAnnualPrice,
  formatMonthlyPrice,
} from "@/lib/billing";

export type SubscriptionTierId = "free" | "stitch_plus" | "stitch_vision";

export type SubscriptionTier = {
  id: SubscriptionTierId;
  name: string;
  price: string;
  annualPrice: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  promoEligible: boolean;
};

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = BILLING_PLANS.map((plan) => ({
  id: plan.tierId,
  name: plan.name,
  price: formatMonthlyPrice(plan.monthlyPriceCents),
  annualPrice: formatAnnualPrice(plan.annualPriceCents),
  description: plan.description,
  features: plan.features,
  highlighted: plan.highlighted,
  promoEligible: plan.monthlyPriceCents > 0,
}));

export { BILLING_PROMO };

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
