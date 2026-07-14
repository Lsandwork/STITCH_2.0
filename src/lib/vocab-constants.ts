import type { VocabCategoryFilter } from "@/data/vocabulary/types";

export const VOCAB_CATEGORY_OPTIONS: Array<{
  id: VocabCategoryFilter;
  label: string;
  icon: string;
  accentClass: string;
}> = [
  { id: "all", label: "All", icon: "book", accentClass: "text-stitch-ink" },
  {
    id: "crochet",
    label: "Crochet",
    icon: "yarn",
    accentClass: "text-stitch-coral",
  },
  {
    id: "stitching",
    label: "Stitching & Sewing",
    icon: "pattern",
    accentClass: "text-stitch-teal",
  },
  {
    id: "embroidery",
    label: "Embroidery",
    icon: "sparkles",
    accentClass: "text-stitch-lavender",
  },
  {
    id: "knitting",
    label: "Knitting",
    icon: "create",
    accentClass: "text-stitch-gold",
  },
  {
    id: "saved",
    label: "Saved",
    icon: "bookmark",
    accentClass: "text-stitch-coral",
  },
];

export const VOCAB_LEVEL_OPTIONS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
] as const;

export const VOCAB_TYPE_OPTIONS = [
  { id: "abbreviation", label: "Abbreviations" },
  { id: "stitch", label: "Stitches" },
  { id: "technique", label: "Techniques" },
  { id: "tool", label: "Tools" },
  { id: "pattern-instruction", label: "Pattern Instructions" },
  { id: "material", label: "Materials" },
  { id: "measurement", label: "Measurements" },
] as const;

export const VOCAB_TERMINOLOGY_OPTIONS = [
  { id: "all", label: "All Terms" },
  { id: "US", label: "U.S. Terms" },
  { id: "UK", label: "U.K. Terms" },
] as const;

export const VOCAB_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const POPULAR_TERM_IDS = [
  "crochet-magic-ring",
  "crochet-gauge",
  "embroidery-french-knot",
  "stitching-seam-allowance",
  "knitting-k2tog",
  "stitching-backstitch",
] as const;

export const VOCAB_FAVORITES_KEY = "stitch-vocab-favorites";
export const VOCAB_RECENT_KEY = "stitch-vocab-recent";
export const VOCAB_RECENT_LIMIT = 8;
