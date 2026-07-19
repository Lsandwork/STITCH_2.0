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
import { mapGroupRow, mergeSeedGroups } from "@/services/socialPersistence";
import type { Database } from "@/types/database";
import { z, ZodError } from "zod";

type GroupRow = Database["public"]["Tables"]["social_groups"]["Row"];

const joinSchema = z.object({
  groupId: z.string().uuid(),
  joined: z.boolean(),
});

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonSuccess({ groups: mergeSeedGroups([]) });
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to view groups.", 401);

    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to view groups.", 503);

    const [{ data: groups, error }, { data: memberships }] = await Promise.all([
      supabase.from("social_groups").select("*").order("name"),
      supabase
        .from("social_group_members")
        .select("group_id")
        .eq("user_id", userId),
    ]);

    if (error) throw error;

    const joined = new Set(
      ((memberships ?? []) as { group_id: string }[]).map((row) => row.group_id),
    );

    const mapped = ((groups ?? []) as GroupRow[]).map((row) =>
      mapGroupRow(row, joined),
    );

    return jsonSuccess({ groups: mergeSeedGroups(mapped) });
  } catch (error) {
    console.error("[api/social/groups GET]", error);
    return jsonError("Failed to load groups.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to join groups.", 503);
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to join groups.", 401);

    const input = joinSchema.parse(await parseJsonBody(request));
    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to join groups.", 503);

    if (input.joined) {
      const { error } = await supabase.from("social_group_members").upsert(
        {
          group_id: input.groupId,
          user_id: userId,
        } as never,
        { onConflict: "group_id,user_id" },
      );
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("social_group_members")
        .delete()
        .eq("group_id", input.groupId)
        .eq("user_id", userId);
      if (error) throw error;
    }

    const { count } = await supabase
      .from("social_group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", input.groupId);

    return jsonSuccess({ joined: input.joined, memberCount: count ?? 0 });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    console.error("[api/social/groups POST]", error);
    return jsonError("Failed to update group membership.", 500);
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
