export type QuickNavItem = {
  id: string;
  label: string;
  description: string;
  href: string;
  image: string;
};

export const QUICK_NAV_ITEMS: QuickNavItem[] = [
  {
    id: "create-studio",
    label: "Create Studio",
    description: "Design with AI and build patterns",
    href: "/create",
    image: "/assets/settings/quick-nav/create-studio.png",
  },
  {
    id: "pattern-workspace",
    label: "Pattern Workspace",
    description: "Follow, edit and track your rows",
    href: "/workspace",
    image: "/assets/settings/quick-nav/pattern-workspace.png",
  },
  {
    id: "vision-mode",
    label: "Vision Mode",
    description: "Scan, check stitches and find mistakes",
    href: "/vision",
    image: "/assets/settings/quick-nav/vision-mode.png",
  },
  {
    id: "crochet-tutor",
    label: "Crochet Tutor",
    description: "Get help, tips and step-by-step guidance",
    href: "/tutor",
    image: "/assets/settings/quick-nav/crochet-tutor.png",
  },
  {
    id: "yarn-vault",
    label: "Yarn Vault",
    description: "Manage your yarn inventory",
    href: "/yarn",
    image: "/assets/settings/quick-nav/yarn-vault.png",
  },
  {
    id: "my-projects",
    label: "My Projects",
    description: "View all your current projects",
    href: "/projects",
    image: "/assets/settings/quick-nav/my-projects.png",
  },
  {
    id: "learn",
    label: "Learn",
    description: "Lessons, guides and tutorials",
    href: "/learn",
    image: "/assets/settings/quick-nav/learn.png",
  },
  {
    id: "vocab",
    label: "Vocab",
    description: "Abbreviations, stitches, tools and techniques",
    href: "/vocab",
    image: "/assets/settings/quick-nav/vocab.png",
  },
  {
    id: "saved-patterns",
    label: "Saved Patterns",
    description: "Your favorite patterns and notes",
    href: "/patterns",
    image: "/assets/settings/quick-nav/saved-patterns.png",
  },
];
