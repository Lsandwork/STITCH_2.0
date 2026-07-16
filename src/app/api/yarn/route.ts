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
import {
  getVaultSummary,
  mapInputToInsert,
  mapRowToVaultYarn,
} from "@/services/yarnService";
import type { YarnInventory } from "@/types/database";
import { ZodError } from "zod";

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to use your Yarn Vault.", 503);
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return jsonError("Sign in to view your Yarn Vault.", 401);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Sign in to use your Yarn Vault.", 503);
    }

    const { data, error } = await supabase
      .from("yarn_inventory")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const yarns = ((data ?? []) as YarnInventory[]).map(mapRowToVaultYarn);

    return jsonSuccess({
      yarns,
      summary: getVaultSummary(yarns),
    });
  } catch (error) {
    console.error("[api/yarn GET]", error);
    return jsonError("Failed to load your yarn stash.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to save yarn to your vault.", 503);
  }

  try {
    const body = await parseJsonBody(request);
    const input = yarnInventoryInputSchema.parse(body);

    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return jsonError("Sign in to save yarn to your vault.", 401);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Sign in to save yarn to your vault.", 503);
    }

    const { data, error } = await supabase
      .from("yarn_inventory")
      .insert(mapInputToInsert(userId, input) as never)
      .select("*")
      .single();

    if (error) throw error;

    const yarn = mapRowToVaultYarn(data as YarnInventory);
    return jsonSuccess({ yarn }, undefined);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    console.error("[api/yarn POST]", error);
    return jsonError("Failed to save yarn to your vault.", 500);
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
