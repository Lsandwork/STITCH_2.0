import { describe, expect, it } from "vitest";
import { mergeSeedListings, mapListingRow } from "@/services/marketplacePersistence";
import { mergeSeedPosts, mapPostRow } from "@/services/socialPersistence";
import type { Database } from "@/types/database";

type ListingRow = Database["public"]["Tables"]["marketplace_listings"]["Row"];
type PostRow = Database["public"]["Tables"]["social_posts"]["Row"];

describe("marketplace/social persistence mappers", () => {
  it("merges seed listings when the database is empty", () => {
    const merged = mergeSeedListings([]);
    expect(merged.length).toBeGreaterThan(0);
    expect(merged[0]?.title).toBeTruthy();
  });

  it("keeps database listings ahead of seed duplicates", () => {
    const dbListing = mergeSeedListings([])[0];
    expect(dbListing).toBeTruthy();
    if (!dbListing) return;

    const custom = {
      ...dbListing,
      title: "Custom DB Listing",
    };
    const merged = mergeSeedListings([custom]);
    expect(merged[0]?.title).toBe("Custom DB Listing");
    expect(merged.filter((item) => item.id === custom.id)).toHaveLength(1);
  });

  it("maps listing rows with profile fallbacks", () => {
    const row = {
      id: "11111111-1111-4111-8111-111111111111",
      designer_id: "22222222-2222-4222-8222-222222222222",
      title: "Test Bag",
      description: "A bag",
      ai_description: "AI desc",
      preview_text: "Preview",
      pattern_content: "Round 1: sc around.",
      price_cents: 499,
      skill_level: "beginner",
      project_type: "bag",
      yarn_weight: "worsted",
      hook_size: "5.0 mm",
      thumbnail_url: null,
      thumbnail_style: null,
      languages: [
        {
          language: "en",
          languageLabel: "English",
          title: "Test Bag",
          description: "A bag",
        },
      ],
      tags: ["bag"],
      downloads: 2,
      rating: 4.5,
      rating_count: 3,
      duplicate_score: 0,
      duplicate_of_id: null,
      duplicate_note: null,
      status: "published",
      created_at: "2026-07-19T00:00:00.000Z",
      updated_at: "2026-07-19T00:00:00.000Z",
    } satisfies ListingRow;

    const listing = mapListingRow(row, {
      display_name: "Maya",
      avatar_url: "/avatar.svg",
      email: "maya@example.com",
    });

    expect(listing.designerName).toBe("Maya");
    expect(listing.thumbnailUrl).toContain("/assets/");
    expect(listing.priceCents).toBe(499);
  });

  it("maps social posts and falls back to seed feed", () => {
    const row = {
      id: "33333333-3333-4333-8333-333333333333",
      user_id: "22222222-2222-4222-8222-222222222222",
      content: "My first WIP",
      image_url: null,
      project_title: "Beanie",
      pattern_ref: null,
      likes: [],
      created_at: "2026-07-19T00:00:00.000Z",
      updated_at: "2026-07-19T00:00:00.000Z",
    } satisfies PostRow;

    const post = mapPostRow(row, {
      profile: {
        id: row.user_id,
        display_name: "Elena",
        avatar_url: null,
        email: "elena@example.com",
        bio: null,
        skill_level: "intermediate",
      },
      likeUserIds: [row.user_id],
      comments: [],
    });

    expect(post.userName).toBe("Elena");
    expect(post.likes).toEqual([row.user_id]);
    expect(mergeSeedPosts([]).length).toBeGreaterThan(0);
  });
});
