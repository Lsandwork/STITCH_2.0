import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
} from "@/lib/api-utils";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { MARKETPLACE_SEED_LISTINGS } from "@/lib/marketplace-seed";
import { normalizeMarketplaceListing } from "@/lib/marketplace-i18n";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mapListingRow } from "@/services/marketplacePersistence";
import type { Database } from "@/types/database";

type ListingRow = Database["public"]["Tables"]["marketplace_listings"]["Row"];

type RouteContext = { params: Promise<{ id: string }> };

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const seed = MARKETPLACE_SEED_LISTINGS.find((listing) => listing.id === id);
  if (seed) {
    return jsonSuccess({ listing: normalizeMarketplaceListing(seed) });
  }

  if (!isSupabaseConfigured() || !isUuid(id)) {
    return jsonError("Listing not found.", 404);
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to view this listing.", 401);

    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to view this listing.", 503);

    const { data, error } = await supabase
      .from("marketplace_listings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return jsonError("Listing not found.", 404);

    const row = data as ListingRow;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email")
      .eq("id", row.designer_id)
      .maybeSingle();

    return jsonSuccess({
      listing: mapListingRow(
        row,
        profile as {
          display_name: string | null;
          avatar_url: string | null;
          email: string | null;
        } | null,
      ),
    });
  } catch (error) {
    console.error("[api/marketplace/[id] GET]", error);
    return jsonError("Failed to load listing.", 500);
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { action?: string };

  if (body.action === "download") {
    if (!isSupabaseConfigured() || !isUuid(id)) {
      return jsonSuccess({ ok: true, downloads: null });
    }

    try {
      const userId = await getAuthenticatedUserId();
      if (!userId) return jsonError("Sign in required.", 401);

      const supabase = await createClient();
      if (!supabase) return jsonError("Sign in required.", 503);

      const { data, error } = await supabase.rpc(
        "increment_marketplace_downloads" as never,
        { p_listing_id: id } as never,
      );
      if (error) throw error;

      return jsonSuccess({ ok: true, downloads: Number(data ?? 0) });
    } catch (error) {
      console.error("[api/marketplace/[id] download]", error);
      return jsonError("Failed to record download.", 500);
    }
  }

  return methodNotAllowed();
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
