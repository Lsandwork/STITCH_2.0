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
import { mapProfileToMaker } from "@/services/socialPersistence";
import { SOCIAL_SEED_MAKERS } from "@/lib/social-seed";
import type { Database } from "@/types/database";
import { z, ZodError } from "zod";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const followSchema = z.object({
  makerId: z.string().uuid(),
  following: z.boolean(),
});

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonSuccess({
      followingIds: ["maker-maya", "maker-elena"],
      makers: SOCIAL_SEED_MAKERS,
    });
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to discover makers.", 401);

    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to discover makers.", 503);

    const { data: follows, error: followsError } = await supabase
      .from("social_follows")
      .select("following_id")
      .eq("follower_id", userId);
    if (followsError) throw followsError;

    const followingIds = ((follows ?? []) as { following_id: string }[]).map(
      (row) => row.following_id,
    );

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email, bio, skill_level")
      .neq("id", userId)
      .limit(40);
    if (profilesError) throw profilesError;

    const profileRows = (profiles ?? []) as ProfileRow[];
    if (profileRows.length === 0) {
      return jsonSuccess({
        followingIds,
        makers: SOCIAL_SEED_MAKERS.map((maker) => ({
          ...maker,
          isFollowing: followingIds.includes(maker.id),
        })),
      });
    }

    const makers = await Promise.all(
      profileRows.map(async (profile) => {
        const [{ count: followerCount }, { count: projectCount }] =
          await Promise.all([
            supabase
              .from("social_follows")
              .select("*", { count: "exact", head: true })
              .eq("following_id", profile.id),
            supabase
              .from("projects")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id),
          ]);

        return mapProfileToMaker(profile, {
          followerCount: followerCount ?? 0,
          projectCount: projectCount ?? 0,
          isFollowing: followingIds.includes(profile.id),
        });
      }),
    );

    return jsonSuccess({ followingIds, makers });
  } catch (error) {
    console.error("[api/social/follows GET]", error);
    return jsonError("Failed to load makers.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to follow makers.", 503);
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to follow makers.", 401);

    const input = followSchema.parse(await parseJsonBody(request));
    if (input.makerId === userId) {
      return jsonError("You cannot follow yourself.", 400);
    }

    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to follow makers.", 503);

    if (input.following) {
      const { error } = await supabase.from("social_follows").upsert(
        {
          follower_id: userId,
          following_id: input.makerId,
        } as never,
        { onConflict: "follower_id,following_id" },
      );
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("social_follows")
        .delete()
        .eq("follower_id", userId)
        .eq("following_id", input.makerId);
      if (error) throw error;
    }

    return jsonSuccess({ following: input.following });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    console.error("[api/social/follows POST]", error);
    return jsonError("Failed to update follow.", 500);
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
