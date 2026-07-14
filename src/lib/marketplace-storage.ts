import { MARKETPLACE_SEED_LISTINGS } from "@/lib/marketplace-seed";
import {
  marketplaceListingSchema,
  type MarketplaceListing,
} from "@/lib/schemas/marketplace";

export const MARKETPLACE_STORAGE_KEY = "stitch-marketplace-listings-v2";

const SEED_BY_ID = Object.fromEntries(
  MARKETPLACE_SEED_LISTINGS.map((listing) => [listing.id, listing]),
);

function syncSeedThumbnails(listings: MarketplaceListing[]): MarketplaceListing[] {
  let changed = false;
  const synced = listings.map((listing) => {
    const seed = SEED_BY_ID[listing.id];
    if (!seed || listing.thumbnailUrl === seed.thumbnailUrl) {
      return listing;
    }
    changed = true;
    return { ...listing, thumbnailUrl: seed.thumbnailUrl };
  });
  if (changed) {
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
  if (typeof window === "undefined") return MARKETPLACE_SEED_LISTINGS;
  const raw = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
  const listings = parseListings(raw);
  if (listings.length === 0) {
    saveMarketplaceListings(MARKETPLACE_SEED_LISTINGS);
    return MARKETPLACE_SEED_LISTINGS;
  }
  return syncSeedThumbnails(listings);
}

export function saveMarketplaceListings(listings: MarketplaceListing[]): void {
  localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(listings));
}

export function getMarketplaceListing(id: string): MarketplaceListing | null {
  return getMarketplaceListings().find((l) => l.id === id) ?? null;
}

export function addMarketplaceListing(listing: MarketplaceListing): void {
  const listings = getMarketplaceListings();
  listings.unshift(listing);
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
