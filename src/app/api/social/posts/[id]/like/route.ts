import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
} from "@/lib/api-utils";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to like posts.", 503);
  }

  try {
    const { id: postId } = await context.params;
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to like posts.", 401);

    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to like posts.", 503);

    const { data: existing } = await supabase
      .from("social_post_likes")
      .select("post_id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("social_post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("social_post_likes").insert({
        post_id: postId,
        user_id: userId,
      } as never);
      if (error) throw error;
    }

    const { data: likes, error: likesError } = await supabase
      .from("social_post_likes")
      .select("user_id")
      .eq("post_id", postId);
    if (likesError) throw likesError;

    return jsonSuccess({
      liked: !existing,
      likes: ((likes ?? []) as { user_id: string }[]).map((row) => row.user_id),
    });
  } catch (error) {
    console.error("[api/social/posts/[id]/like]", error);
    return jsonError("Failed to update like.", 500);
  }
}

export function GET() {
  return methodNotAllowed();
}
