import type { MarketplaceListing } from "@/lib/schemas/marketplace";
import {
  getMarketplaceListing as getLocalListing,
  getMarketplaceListings as getLocalListings,
  getSavedMarketplaceListingIds as getLocalSavedIds,
  toggleSavedMarketplaceListing as toggleLocalSaved,
} from "@/lib/marketplace-storage";

export async function fetchMarketplaceListings(): Promise<MarketplaceListing[]> {
  try {
    const response = await fetch("/api/marketplace");
    if (!response.ok) {
      return getLocalListings();
    }
    const payload = (await response.json()) as {
      listings?: MarketplaceListing[];
    };
    return payload.listings ?? getLocalListings();
  } catch {
    return getLocalListings();
  }
}

export async function fetchMarketplaceListing(
  id: string,
): Promise<MarketplaceListing | null> {
  try {
    const response = await fetch(`/api/marketplace/${id}`);
    if (response.ok) {
      const payload = (await response.json()) as {
        listing?: MarketplaceListing;
      };
      if (payload.listing) return payload.listing;
    }
  } catch {
    /* fall through */
  }
  return getLocalListing(id);
}

export async function publishMarketplaceListing(
  listing: MarketplaceListing,
): Promise<MarketplaceListing> {
  const response = await fetch("/api/marketplace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listing),
  });
  const payload = (await response.json()) as {
    error?: string;
    listing?: MarketplaceListing;
  };
  if (!response.ok || !payload.listing) {
    throw new Error(payload.error ?? "Failed to publish listing");
  }
  return payload.listing;
}

export async function fetchSavedMarketplaceIds(): Promise<string[]> {
  try {
    const response = await fetch("/api/marketplace/saved");
    if (!response.ok) return getLocalSavedIds();
    const payload = (await response.json()) as { listingIds?: string[] };
    return payload.listingIds ?? getLocalSavedIds();
  } catch {
    return getLocalSavedIds();
  }
}

export async function setMarketplaceListingSaved(
  listingId: string,
  saved: boolean,
): Promise<string[]> {
  try {
    const response = await fetch("/api/marketplace/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, saved }),
    });
    if (!response.ok) {
      toggleLocalSaved(listingId);
      return getLocalSavedIds();
    }
    const payload = (await response.json()) as { listingIds?: string[] };
    return payload.listingIds ?? getLocalSavedIds();
  } catch {
    toggleLocalSaved(listingId);
    return getLocalSavedIds();
  }
}

export async function recordMarketplaceDownload(listingId: string): Promise<void> {
  try {
    await fetch(`/api/marketplace/${listingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "download" }),
    });
  } catch {
    /* ignore */
  }
}
