import type { MarketplaceListing } from "@/lib/schemas/marketplace";

export type MarketplaceCategory = {
  id: string;
  label: string;
};

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  { id: "all", label: "All patterns" },
  { id: "amigurumi", label: "Amigurumi" },
  { id: "bag", label: "Bags" },
  { id: "blanket", label: "Blankets" },
  { id: "garment", label: "Garments" },
  { id: "home-decor", label: "Home Decor" },
  { id: "accessories", label: "Accessories" },
  { id: "toys", label: "Toys" },
  { id: "more", label: "More" },
];

export const MARKETPLACE_SORT_OPTIONS = [
  { id: "popular", label: "Most popular" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Top rated" },
  { id: "price-low", label: "Price: low to high" },
] as const;

export type MarketplaceSortId = (typeof MARKETPLACE_SORT_OPTIONS)[number]["id"];

export type MarketplaceFilterState = {
  category: string;
  sort: MarketplaceSortId;
  search: string;
  skillLevels: MarketplaceListing["skillLevel"][];
  maxPriceCents: number | null;
};

export const DEFAULT_MARKETPLACE_FILTERS: MarketplaceFilterState = {
  category: "all",
  sort: "popular",
  search: "",
  skillLevels: [],
  maxPriceCents: null,
};

const PRIMARY_TYPES = new Set([
  "amigurumi",
  "bag",
  "blanket",
  "garment",
]);

export function listingMatchesCategory(
  listing: MarketplaceListing,
  categoryId: string,
): boolean {
  if (categoryId === "all") return true;

  const type = listing.projectType.toLowerCase();
  const tags = listing.tags.map((tag) => tag.toLowerCase());

  switch (categoryId) {
    case "amigurumi":
      return type.includes("amigurumi") || tags.some((tag) => tag.includes("plush"));
    case "bag":
      return type.includes("bag") || type.includes("tote") || tags.includes("bag");
    case "blanket":
      return type.includes("blanket") || type.includes("throw") || tags.includes("blanket");
    case "garment":
      return (
        type.includes("garment") ||
        type.includes("cardigan") ||
        type.includes("sweater") ||
        tags.includes("cardigan")
      );
    case "home-decor":
      return tags.some((tag) => tag.includes("home") || tag.includes("decor") || tag.includes("blanket"));
    case "accessories":
      return tags.some((tag) =>
        ["bag", "market", "coaster", "accessory"].some((needle) => tag.includes(needle)),
      );
    case "toys":
      return tags.some((tag) =>
        ["toy", "kids", "dinosaur", "mini", "fairytale"].some((needle) => tag.includes(needle)),
      );
    case "more":
      return !PRIMARY_TYPES.has(type) && !tags.some((tag) => tag.includes("amigurumi"));
    default:
      return (
        type.includes(categoryId) ||
        tags.some((tag) => tag.includes(categoryId.replace("-", " ")))
      );
  }
}

export function filterMarketplaceListings(
  listings: MarketplaceListing[],
  filters: MarketplaceFilterState,
): MarketplaceListing[] {
  let result = [...listings];

  if (filters.category !== "all") {
    result = result.filter((listing) =>
      listingMatchesCategory(listing, filters.category),
    );
  }

  if (filters.search.trim()) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (listing) =>
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.designerName.toLowerCase().includes(query) ||
        listing.previewText.toLowerCase().includes(query) ||
        listing.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  if (filters.skillLevels.length > 0) {
    result = result.filter((listing) => filters.skillLevels.includes(listing.skillLevel));
  }

  if (filters.maxPriceCents !== null) {
    result = result.filter((listing) => listing.priceCents <= filters.maxPriceCents!);
  }

  switch (filters.sort) {
    case "newest":
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "price-low":
      result.sort((a, b) => a.priceCents - b.priceCents);
      break;
    default:
      result.sort((a, b) => b.downloads - a.downloads);
  }

  return result;
}

export function formatSkillLevel(level: MarketplaceListing["skillLevel"]): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function buildListingSecondaryMeta(listing: MarketplaceListing): string {
  const parts: string[] = [];
  if (listing.yarnWeight) {
    parts.push(`${listing.yarnWeight} weight`);
  }
  parts.push(`${formatSkillLevel(listing.skillLevel)} friendly`);
  return parts.join(" · ");
}
