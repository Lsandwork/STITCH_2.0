export type QuickNavItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  iconTone: "coral" | "teal" | "gold" | "muted";
  bgClass: string;
  buttonClass: string;
};

export const QUICK_NAV_ITEMS: QuickNavItem[] = [
  {
    id: "create-studio",
    label: "Create Studio",
    description: "Design with AI and build patterns",
    href: "/create",
    icon: "sparkles",
    iconTone: "coral",
    bgClass: "bg-stitch-peach/80",
    buttonClass: "bg-stitch-coral text-white",
  },
  {
    id: "pattern-workspace",
    label: "Pattern Workspace",
    description: "Follow, edit and track your rows",
    href: "/workspace",
    icon: "pattern",
    iconTone: "teal",
    bgClass: "bg-stitch-mint/70",
    buttonClass: "bg-stitch-teal text-white",
  },
  {
    id: "vision-mode",
    label: "Vision Mode",
    description: "Scan, check stitches and find mistakes",
    href: "/vision",
    icon: "vision",
    iconTone: "muted",
    bgClass: "bg-purple-50",
    buttonClass: "bg-stitch-lavender text-white",
  },
  {
    id: "crochet-tutor",
    label: "Crochet Tutor",
    description: "Get help, tips and step-by-step guidance",
    href: "/tutor",
    icon: "tutor",
    iconTone: "gold",
    bgClass: "bg-amber-50",
    buttonClass: "bg-stitch-gold text-stitch-ink",
  },
  {
    id: "yarn-vault",
    label: "Yarn Vault",
    description: "Manage your yarn inventory",
    href: "/yarn",
    icon: "yarn",
    iconTone: "teal",
    bgClass: "bg-stitch-mint/60",
    buttonClass: "bg-stitch-teal text-white",
  },
  {
    id: "my-projects",
    label: "My Projects",
    description: "View all your current projects",
    href: "/projects",
    icon: "projects",
    iconTone: "gold",
    bgClass: "bg-stitch-peach/60",
    buttonClass: "bg-stitch-gold text-stitch-ink",
  },
  {
    id: "learn",
    label: "Learn",
    description: "Lessons, guides and tutorials",
    href: "/learn",
    icon: "learn",
    iconTone: "teal",
    bgClass: "bg-stitch-sky/50",
    buttonClass: "bg-stitch-teal text-white",
  },
  {
    id: "vocab",
    label: "Vocab",
    description: "Abbreviations, stitches, tools and techniques",
    href: "/vocab",
    icon: "book",
    iconTone: "coral",
    bgClass: "bg-stitch-rose/40",
    buttonClass: "bg-stitch-coral text-white",
  },
  {
    id: "saved-patterns",
    label: "Saved Patterns",
    description: "Your favorite patterns and notes",
    href: "/patterns",
    icon: "bookmark",
    iconTone: "coral",
    bgClass: "bg-stitch-peach/50",
    buttonClass: "bg-stitch-coral text-white",
  },
];
