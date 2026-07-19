import { normalizeMarketplaceListing } from "@/lib/marketplace-i18n";
import { MARKETPLACE_SEED_LISTINGS } from "@/lib/marketplace-seed";
import type { MarketplaceListing } from "@/lib/schemas/marketplace";
import { buildUserHandle } from "@/lib/user-handle";
import type { Database, Json } from "@/types/database";

type ListingRow = Database["public"]["Tables"]["marketplace_listings"]["Row"];
type ListingInsert = Database["public"]["Tables"]["marketplace_listings"]["Insert"];

type ProfileBits = {
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export function mapListingRow(
  row: ListingRow,
  profile?: ProfileBits | null,
): MarketplaceListing {
  const designerName =
    profile?.display_name?.trim() ||
    profile?.email?.split("@")[0] ||
    "Stitch Maker";

  return normalizeMarketplaceListing({
    id: row.id,
    designerId: row.designer_id,
    designerName,
    designerAvatarUrl: profile?.avatar_url ?? undefined,
    title: row.title,
    description: row.description,
    aiDescription: row.ai_description,
    previewText: row.preview_text,
    patternContent: row.pattern_content,
    priceCents: row.price_cents,
    skillLevel: row.skill_level,
    projectType: row.project_type,
    yarnWeight: row.yarn_weight ?? undefined,
    hookSize: row.hook_size ?? undefined,
    thumbnailUrl: row.thumbnail_url || "/assets/projects/color-studio.jpg",
    thumbnailStyle:
      (row.thumbnail_style as MarketplaceListing["thumbnailStyle"]) ?? undefined,
    languages: Array.isArray(row.languages)
      ? (row.languages as MarketplaceListing["languages"])
      : [],
    tags: row.tags ?? [],
    downloads: row.downloads,
    rating: Number(row.rating),
    ratingCount: row.rating_count,
    duplicateScore: row.duplicate_score,
    duplicateOfId: row.duplicate_of_id,
    duplicateNote: row.duplicate_note ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export function listingToInsert(
  designerId: string,
  listing: MarketplaceListing,
): ListingInsert {
  return {
    id: listing.id,
    designer_id: designerId,
    title: listing.title,
    description: listing.description,
    ai_description: listing.aiDescription,
    preview_text: listing.previewText,
    pattern_content: listing.patternContent,
    price_cents: listing.priceCents,
    skill_level: listing.skillLevel,
    project_type: listing.projectType,
    yarn_weight: listing.yarnWeight ?? null,
    hook_size: listing.hookSize ?? null,
    thumbnail_url: listing.thumbnailUrl || null,
    thumbnail_style: (listing.thumbnailStyle as Json | undefined) ?? null,
    languages: listing.languages as unknown as Json,
    tags: listing.tags,
    downloads: listing.downloads,
    rating: listing.rating,
    rating_count: listing.ratingCount,
    duplicate_score: listing.duplicateScore,
    duplicate_of_id: listing.duplicateOfId,
    duplicate_note: listing.duplicateNote ?? null,
    status: listing.status,
  };
}

export function mergeSeedListings(
  dbListings: MarketplaceListing[],
): MarketplaceListing[] {
  const ids = new Set(dbListings.map((listing) => listing.id));
  const seeds = MARKETPLACE_SEED_LISTINGS.map(normalizeMarketplaceListing).filter(
    (listing) => !ids.has(listing.id),
  );
  return [...dbListings, ...seeds];
}

export function designerHandleFromListing(listing: MarketplaceListing): string {
  return buildUserHandle(`${listing.designerName}@stitch.local`);
}
