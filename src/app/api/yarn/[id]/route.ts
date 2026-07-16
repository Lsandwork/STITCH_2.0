import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
  parseJsonBody,
  zodErrorResponse,
} from "@/lib/api-utils";
import { yarnInventoryInputSchema } from "@/lib/schemas/yarn";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mapInputToUpdate, mapRowToVaultYarn } from "@/services/yarnService";
import type { YarnInventory } from "@/types/database";
import { ZodError } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to update your yarn stash.", 503);
  }

  try {
    const { id } = await context.params;
    const body = await parseJsonBody(request);
    const input = yarnInventoryInputSchema.parse(body);

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return jsonError("Sign in to update your yarn stash.", 401);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Sign in to update your yarn stash.", 503);
    }

    const { data, error } = await supabase
      .from("yarn_inventory")
      .update(mapInputToUpdate(input) as never)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) throw error;

    return jsonSuccess({ yarn: mapRowToVaultYarn(data as YarnInventory) });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    console.error("[api/yarn/[id] PATCH]", error);
    return jsonError("Failed to update yarn.", 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to manage your yarn stash.", 503);
  }

  try {
    const { id } = await context.params;

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return jsonError("Sign in to manage your yarn stash.", 401);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Sign in to manage your yarn stash.", 503);
    }

    const { error } = await supabase
      .from("yarn_inventory")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    return jsonSuccess({ deleted: true });
  } catch (error) {
    console.error("[api/yarn/[id] DELETE]", error);
    return jsonError("Failed to remove yarn.", 500);
  }
}

export function GET() {
  return methodNotAllowed();
}

export function POST() {
  return methodNotAllowed();
}

export function PUT() {
  return methodNotAllowed();
}
