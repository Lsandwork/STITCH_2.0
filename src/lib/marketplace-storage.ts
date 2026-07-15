import {
  FEATURED_MARKETPLACE_LISTING_ID,
  MARKETPLACE_SEED_LISTINGS,
} from "@/lib/marketplace-seed";
import { normalizeMarketplaceListing } from "@/lib/marketplace-i18n";
import {
  marketplaceListingSchema,
  type MarketplaceListing,
} from "@/lib/schemas/marketplace";

export const MARKETPLACE_STORAGE_KEY = "stitch-marketplace-listings-v2";

const SEED_BY_ID = Object.fromEntries(
  MARKETPLACE_SEED_LISTINGS.map((listing) => [listing.id, listing]),
);

function isLegacyFeaturedHoodieListing(id: string): boolean {
  return (
    id.startsWith("mp-cozy-granny-square-hoodie") &&
    id !== FEATURED_MARKETPLACE_LISTING_ID
  );
}

function applyFeaturedListingDefaults(
  listing: MarketplaceListing,
): MarketplaceListing {
  const seed = SEED_BY_ID[FEATURED_MARKETPLACE_LISTING_ID];
  if (!seed || listing.id !== FEATURED_MARKETPLACE_LISTING_ID) {
    return listing;
  }

  return {
    ...listing,
    title: seed.title,
    description: seed.description,
    aiDescription: seed.aiDescription,
    previewText: seed.previewText,
    patternContent: seed.patternContent,
    thumbnailUrl: seed.thumbnailUrl,
    languages: seed.languages,
    tags: seed.tags,
    priceCents: seed.priceCents,
    downloads: Math.max(listing.downloads, seed.downloads),
    rating: listing.rating > 0 ? listing.rating : seed.rating,
    ratingCount: Math.max(listing.ratingCount, seed.ratingCount),
  };
}

function mergeFeaturedListings(listings: MarketplaceListing[]): MarketplaceListing[] {
  const featuredSeed = SEED_BY_ID[FEATURED_MARKETPLACE_LISTING_ID];
  if (!featuredSeed) {
    return listings;
  }

  const withoutLegacyHoodie = listings.filter(
    (listing) => !isLegacyFeaturedHoodieListing(listing.id),
  );
  const hasFeatured = withoutLegacyHoodie.some(
    (listing) => listing.id === FEATURED_MARKETPLACE_LISTING_ID,
  );

  if (hasFeatured) {
    return withoutLegacyHoodie.map(applyFeaturedListingDefaults);
  }

  return [
    normalizeMarketplaceListing(featuredSeed),
    ...withoutLegacyHoodie,
  ];
}

function listingContentEqual(
  a: MarketplaceListing,
  b: MarketplaceListing,
): boolean {
  return (
    a.title === b.title &&
    a.description === b.description &&
    a.thumbnailUrl === b.thumbnailUrl &&
    a.patternContent === b.patternContent &&
    JSON.stringify(a.languages) === JSON.stringify(b.languages)
  );
}

function listingNeedsSync(
  a: MarketplaceListing,
  b: MarketplaceListing,
): boolean {
  return (
    !listingContentEqual(a, b) ||
    a.downloads !== b.downloads ||
    a.rating !== b.rating ||
    a.ratingCount !== b.ratingCount ||
    a.priceCents !== b.priceCents
  );
}

function syncSeedListings(listings: MarketplaceListing[]): MarketplaceListing[] {
  let changed = false;
  const merged = mergeFeaturedListings(listings);
  const synced = merged.map((listing) => {
    const seed = SEED_BY_ID[listing.id];
    let next = normalizeMarketplaceListing(listing);

    if (seed) {
      next = {
        ...next,
        ...(next.thumbnailUrl !== seed.thumbnailUrl
          ? { thumbnailUrl: seed.thumbnailUrl }
          : {}),
        ...(next.patternContent !== seed.patternContent
          ? { patternContent: seed.patternContent }
          : {}),
      };
      next = applyFeaturedListingDefaults(next);
    }

    if (listingNeedsSync(next, listing)) {
      changed = true;
    }

    return next;
  });
  if (changed || merged.length !== listings.length) {
    saveMarketplaceListings(synced);
  }
  return synced;
}

function parseListings(raw: string | null): MarketplaceListing[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown[];
    return parsed
      .map((item) => marketplaceListingSchema.safeParse(item))
      .filter((r) => r.success)
      .map((r) => r.data);
  } catch {
    return [];
  }
}

export function getMarketplaceListings(): MarketplaceListing[] {
  if (typeof window === "undefined") {
    return MARKETPLACE_SEED_LISTINGS.map(normalizeMarketplaceListing);
  }
  const raw = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
  const listings = parseListings(raw);
  if (listings.length === 0) {
    saveMarketplaceListings(MARKETPLACE_SEED_LISTINGS);
    return MARKETPLACE_SEED_LISTINGS.map(normalizeMarketplaceListing);
  }
  return syncSeedListings(listings);
}

export function saveMarketplaceListings(listings: MarketplaceListing[]): void {
  localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(listings));
}

export function getMarketplaceListing(id: string): MarketplaceListing | null {
  const listings = getMarketplaceListings();
  const direct = listings.find((listing) => listing.id === id);
  if (direct) return direct;
  if (isLegacyFeaturedHoodieListing(id)) {
    return (
      listings.find((listing) => listing.id === FEATURED_MARKETPLACE_LISTING_ID) ??
      null
    );
  }
  return null;
}

export function addMarketplaceListing(listing: MarketplaceListing): void {
  const listings = getMarketplaceListings();
  listings.unshift(normalizeMarketplaceListing(listing));
  saveMarketplaceListings(listings);
}

export function updateMarketplaceListing(
  id: string,
  updates: Partial<MarketplaceListing>,
): MarketplaceListing | null {
  const listings = getMarketplaceListings();
  const index = listings.findIndex((l) => l.id === id);
  if (index === -1) return null;
  listings[index] = { ...listings[index], ...updates, updatedAt: new Date().toISOString() };
  saveMarketplaceListings(listings);
  return listings[index];
}

export function incrementListingDownload(id: string): void {
  const listing = getMarketplaceListing(id);
  if (!listing) return;
  updateMarketplaceListing(id, { downloads: listing.downloads + 1 });
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(2)}`;
}

export function generateListingId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `mp-${slug}-${Date.now().toString(36)}`;
}

const SAVED_MARKETPLACE_KEY = "stitch-saved-marketplace-listings";

export function getSavedMarketplaceListingIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_MARKETPLACE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function isMarketplaceListingSaved(id: string): boolean {
  return getSavedMarketplaceListingIds().includes(id);
}

export function toggleSavedMarketplaceListing(id: string): boolean {
  const saved = getSavedMarketplaceListingIds();
  const isSaved = saved.includes(id);
  const next = isSaved ? saved.filter((item) => item !== id) : [...saved, id];
  localStorage.setItem(SAVED_MARKETPLACE_KEY, JSON.stringify(next));
  return !isSaved;
}

export function pickThumbnailForType(
  projectType: string,
  customUrl?: string,
): string {
  if (customUrl) return customUrl;
  const type = projectType.toLowerCase();
  if (type.includes("amigurumi") || type.includes("plush")) {
    return "/assets/projects/dachshund-plushie.jpg?v=2";
  }
  if (type.includes("bag") || type.includes("tote")) {
    return "/assets/projects/sunflower-bag.jpg";
  }
  if (type.includes("blanket") || type.includes("throw")) {
    return "/assets/projects/granny-blanket.jpg";
  }
  if (type.includes("garment") || type.includes("sweater") || type.includes("cardigan")) {
    return "/assets/projects/cozy-sweater.jpg";
  }
  return "/assets/projects/color-studio.jpg";
}
