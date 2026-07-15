import { learnImage, projectImage } from "@/lib/project-images";

export type HomePattern = {
  id: string;
  slug: string;
  title: string;
  author: string;
  craft: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced beginner";
  imageUrl: string;
  imageAlt: string;
  href: string;
  featured?: boolean;
};

export const TRENDING_PATTERNS: HomePattern[] = [
  {
    id: "01",
    slug: "sunset-market-bag",
    title: "Sunset Market Bag",
    author: "Stitch Originals",
    craft: "Crochet",
    difficulty: "Intermediate",
    imageUrl: projectImage.sunflower,
    imageAlt: "Floral granny-square crochet market tote",
    href: "/marketplace",
  },
  {
    id: "02",
    slug: "retro-garden-cardigan",
    title: "Retro Garden Cardigan",
    author: "MadeByKnot",
    craft: "Crochet",
    difficulty: "Intermediate",
    imageUrl: learnImage.grannySquareHoodie,
    imageAlt: "Colorful floral granny-square cardigan",
    href: "/marketplace",
  },
  {
    id: "03",
    slug: "cloud-comfort-blanket",
    title: "Cloud Comfort Blanket",
    author: "Stitch Originals",
    craft: "Crochet",
    difficulty: "Advanced beginner",
    imageUrl: projectImage.granny,
    imageAlt: "Cream textured crochet blanket",
    href: "/marketplace",
  },
  {
    id: "04",
    slug: "boho-granny-top",
    title: "Boho Granny Top",
    author: "Stitch Originals",
    craft: "Crochet",
    difficulty: "Intermediate",
    imageUrl: learnImage.bucketHat,
    imageAlt: "Olive and cream crochet summer top",
    href: "/marketplace",
  },
  {
    id: "05",
    slug: "wildflower-dreams",
    title: "Wildflower Dreams",
    author: "Stitch Originals",
    craft: "Embroidery",
    difficulty: "Intermediate",
    imageUrl: learnImage.hexagonCoasters,
    imageAlt: "Colorful wildflower embroidery hoop",
    href: "/marketplace",
  },
  {
    id: "06",
    slug: "city-stripes-beanie",
    title: "City Stripes Beanie",
    author: "Stitch Originals",
    craft: "Knitting",
    difficulty: "Beginner",
    imageUrl: learnImage.jellyfish,
    imageAlt: "Striped knit beanie in warm tones",
    href: "/marketplace",
  },
];

export const FOR_YOU_PATTERNS: HomePattern[] = [
  {
    id: "07",
    slug: "heritage-patchwork-pillow",
    title: "Heritage Patchwork Pillow",
    author: "Stitch Originals",
    craft: "Crochet",
    difficulty: "Intermediate",
    imageUrl: learnImage.hexagonCoasters,
    imageAlt: "Colorful granny-square pillow",
    href: "/marketplace",
    featured: true,
  },
  {
    id: "08",
    slug: "coastal-rib-sweater",
    title: "Coastal Rib Sweater",
    author: "Stitch Originals",
    craft: "Knitting",
    difficulty: "Intermediate",
    imageUrl: projectImage.sweater,
    imageAlt: "Neutral relaxed knitted sweater",
    href: "/marketplace",
  },
  {
    id: "09",
    slug: "sage-pocket-dino",
    title: "Sage Pocket Dino",
    author: "Stitch Originals",
    craft: "Crochet",
    difficulty: "Beginner",
    imageUrl: projectImage.dino,
    imageAlt: "Sage green crochet dinosaur plushie",
    href: "/marketplace",
  },
  {
    id: "10",
    slug: "heirloom-rose-garden",
    title: "Heirloom Rose Garden",
    author: "Stitch Originals",
    craft: "Embroidery",
    difficulty: "Intermediate",
    imageUrl: learnImage.rippleBlanket,
    imageAlt: "Pink rose floral embroidery hoop",
    href: "/marketplace",
  },
  {
    id: "11",
    slug: "sunday-grid-cardigan",
    title: "Sunday Grid Cardigan",
    author: "Stitch Originals",
    craft: "Crochet",
    difficulty: "Intermediate",
    imageUrl: learnImage.grannySquareHoodie,
    imageAlt: "Cream cardigan with pastel grid blocks",
    href: "/marketplace",
  },
  {
    id: "12",
    slug: "blush-cloud-throw",
    title: "Blush Cloud Throw",
    author: "Stitch Originals",
    craft: "Knitting",
    difficulty: "Advanced beginner",
    imageUrl: learnImage.rippleBlanket,
    imageAlt: "Plush pink knitted throw blanket",
    href: "/marketplace",
  },
];

export const HOME_CATEGORIES = [
  { id: "crochet", label: "Crochet", color: "bg-stitch-blush", icon: "yarn" },
  { id: "knitting", label: "Knitting", color: "bg-stitch-lavender-soft", icon: "pattern" },
  { id: "embroidery", label: "Embroidery", color: "bg-stitch-mint-soft", icon: "palette" },
  { id: "weaving", label: "Weaving", color: "bg-stitch-peach-soft", icon: "pattern" },
  { id: "punch-needle", label: "Punch Needle", color: "bg-stitch-sage-soft", icon: "sparkles" },
  { id: "more", label: "More", color: "bg-stitch-olive/15", icon: "plus" },
] as const;
