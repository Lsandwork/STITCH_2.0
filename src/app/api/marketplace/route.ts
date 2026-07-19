import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
  parseJsonBody,
  zodErrorResponse,
} from "@/lib/api-utils";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { marketplaceListingSchema } from "@/lib/schemas/marketplace";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  listingToInsert,
  mapListingRow,
  mergeSeedListings,
} from "@/services/marketplacePersistence";
import type { Database } from "@/types/database";
import { ZodError } from "zod";

type ListingRow = Database["public"]["Tables"]["marketplace_listings"]["Row"];
type ProfileBits = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonSuccess({
      listings: mergeSeedListings([]),
      source: "seed" as const,
    });
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return jsonSuccess({
        listings: mergeSeedListings([]),
        source: "seed" as const,
      });
    }

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return jsonError("Sign in to browse the marketplace.", 401);
    }

    const { data, error } = await supabase
      .from("marketplace_listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = (data ?? []) as ListingRow[];
    const designerIds = [...new Set(rows.map((row) => row.designer_id))];
    const profilesById = new Map<string, ProfileBits>();

    if (designerIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, email")
        .in("id", designerIds);
      for (const profile of (profiles ?? []) as ProfileBits[]) {
        profilesById.set(profile.id, profile);
      }
    }

    const dbListings = rows.map((row) =>
      mapListingRow(row, profilesById.get(row.designer_id)),
    );

    return jsonSuccess({
      listings: mergeSeedListings(dbListings),
      source: dbListings.length > 0 ? ("mixed" as const) : ("seed" as const),
    });
  } catch (error) {
    console.error("[api/marketplace GET]", error);
    return jsonError("Failed to load marketplace listings.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to publish marketplace listings.", 503);
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return jsonError("Sign in to publish a marketplace listing.", 401);
    }

    const body = await parseJsonBody(request);
    const listing = marketplaceListingSchema.parse(body);

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Sign in to publish a marketplace listing.", 503);
    }

    const insert = listingToInsert(userId, {
      ...listing,
      designerId: userId,
      id: listing.id || crypto.randomUUID(),
    });

    const { data, error } = await supabase
      .from("marketplace_listings")
      .insert(insert as never)
      .select("*")
      .single();

    if (error) throw error;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email")
      .eq("id", userId)
      .maybeSingle();

    return jsonSuccess({
      listing: mapListingRow(data as ListingRow, profile as ProfileBits | null),
    });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    console.error("[api/marketplace POST]", error);
    return jsonError("Failed to publish marketplace listing.", 500);
  }
}

export function PUT() {
  return methodNotAllowed();
}

export function PATCH() {
  return methodNotAllowed();
}

export function DELETE() {
  return methodNotAllowed();
}
