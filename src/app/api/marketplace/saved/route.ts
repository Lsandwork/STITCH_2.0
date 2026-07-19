import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
  parseJsonBody,
  zodErrorResponse,
} from "@/lib/api-utils";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { z, ZodError } from "zod";

const toggleSchema = z.object({
  listingId: z.string().min(1),
  saved: z.boolean(),
});

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonSuccess({ listingIds: [] as string[] });
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to view saved listings.", 401);

    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to view saved listings.", 503);

    const { data, error } = await supabase
      .from("saved_marketplace_listings")
      .select("listing_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return jsonSuccess({
      listingIds: ((data ?? []) as { listing_id: string }[]).map(
        (row) => row.listing_id,
      ),
    });
  } catch (error) {
    console.error("[api/marketplace/saved GET]", error);
    return jsonError("Failed to load saved listings.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to save listings.", 503);
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to save listings.", 401);

    const body = toggleSchema.parse(await parseJsonBody(request));
    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to save listings.", 503);

    if (body.saved) {
      const { error } = await supabase.from("saved_marketplace_listings").upsert(
        {
          user_id: userId,
          listing_id: body.listingId,
        } as never,
        { onConflict: "user_id,listing_id" },
      );
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("saved_marketplace_listings")
        .delete()
        .eq("user_id", userId)
        .eq("listing_id", body.listingId);
      if (error) throw error;
    }

    const { data, error } = await supabase
      .from("saved_marketplace_listings")
      .select("listing_id")
      .eq("user_id", userId);

    if (error) throw error;

    return jsonSuccess({
      listingIds: ((data ?? []) as { listing_id: string }[]).map(
        (row) => row.listing_id,
      ),
      saved: body.saved,
    });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    console.error("[api/marketplace/saved POST]", error);
    return jsonError("Failed to update saved listing.", 500);
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
