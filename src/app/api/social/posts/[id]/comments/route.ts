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
import { mapCommentRow } from "@/services/socialPersistence";
import type { Database } from "@/types/database";
import { z, ZodError } from "zod";

type CommentRow = Database["public"]["Tables"]["social_comments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const commentSchema = z.object({
  content: z.string().min(1).max(500),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to comment.", 503);
  }

  try {
    const { id: postId } = await context.params;
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to comment.", 401);

    const input = commentSchema.parse(await parseJsonBody(request));
    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to comment.", 503);

    const { data, error } = await supabase
      .from("social_comments")
      .insert({
        post_id: postId,
        user_id: userId,
        content: input.content.trim(),
      } as never)
      .select("*")
      .single();

    if (error) throw error;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email, bio, skill_level")
      .eq("id", userId)
      .maybeSingle();

    return jsonSuccess({
      comment: mapCommentRow(
        data as CommentRow,
        profile as ProfileRow | null,
      ),
    });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    console.error("[api/social/posts/[id]/comments]", error);
    return jsonError("Failed to add comment.", 500);
  }
}

export function GET() {
  return methodNotAllowed();
}
