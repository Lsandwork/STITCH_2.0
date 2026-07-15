export type HomeNavItem = {
  label: string;
  href: string;
};

export const HOME_NAV_ITEMS: HomeNavItem[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Patterns", href: "/patterns" },
  { label: "Community", href: "/social" },
  { label: "Studio", href: "/create" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Learn", href: "/learn" },
  { label: "Tools", href: "/vocab" },
];

export const QUICK_CREATE_LINKS = [
  { label: "New Pattern", href: "/create/pattern", icon: "plus" },
  { label: "AI Pattern Generator", href: "/create/pattern", icon: "sparkles" },
  { label: "Smart Chart Maker", href: "/create/colors", icon: "pattern" },
  { label: "Project Tracker", href: "/projects", icon: "projects" },
  { label: "Yarn Stash", href: "/yarn", icon: "yarn" },
  { label: "Tools & Calculators", href: "/vocab", icon: "settings" },
] as const;

export const MY_COLLECTIONS_LINKS = [
  { label: "Favorites", href: "/patterns", icon: "heart" },
  { label: "My Patterns", href: "/patterns", icon: "bookmark" },
  { label: "My Projects", href: "/projects", icon: "projects" },
  { label: "My Library", href: "/learn", icon: "book" },
] as const;

export const FEATURE_SHORTCUTS = [
  {
    label: "AI Pattern Assistant",
    description: "Get help instantly",
    href: "/tutor",
    icon: "sparkles",
  },
  {
    label: "Smart Pattern Builder",
    description: "Design your vision",
    href: "/create/pattern",
    icon: "pattern",
  },
  {
    label: "Track & Organize",
    description: "Every project, in sync",
    href: "/projects",
    icon: "projects",
  },
  {
    label: "Community",
    description: "Share, connect, inspire",
    href: "/social",
    icon: "users",
  },
  {
    label: "Marketplace",
    description: "Support makers",
    href: "/marketplace",
    icon: "star",
  },
] as const;

export const POPULAR_TOOLS = [
  { label: "Yarn Calculator", href: "/yarn/substitute" },
  { label: "Stitch Dictionary", href: "/vocab" },
  { label: "Hook & Needle Converter", href: "/vocab" },
  { label: "Row Counter", href: "/workspace" },
  { label: "Project Planner", href: "/projects" },
] as const;
