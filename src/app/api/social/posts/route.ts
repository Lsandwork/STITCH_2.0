import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
  parseJsonBody,
  zodErrorResponse,
} from "@/lib/api-utils";
import { getAuthenticatedUserId } from "@/lib/api-auth";
import { socialCreatePostInputSchema } from "@/lib/schemas/social";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  mapCommentRow,
  mapPostRow,
  mergeSeedPosts,
} from "@/services/socialPersistence";
import type { Database } from "@/types/database";
import { ZodError } from "zod";

type PostRow = Database["public"]["Tables"]["social_posts"]["Row"];
type CommentRow = Database["public"]["Tables"]["social_comments"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type LikeRow = Database["public"]["Tables"]["social_post_likes"]["Row"];

async function loadPostsPayload(supabase: NonNullable<
  Awaited<ReturnType<typeof createClient>>
>) {
  const { data: posts, error } = await supabase
    .from("social_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  const rows = (posts ?? []) as PostRow[];
  if (rows.length === 0) {
    return mergeSeedPosts([]);
  }

  const postIds = rows.map((row) => row.id);
  const userIds = [...new Set(rows.map((row) => row.user_id))];

  const [{ data: comments }, { data: likes }, { data: profiles }] =
    await Promise.all([
      supabase
        .from("social_comments")
        .select("*")
        .in("post_id", postIds)
        .order("created_at", { ascending: true }),
      supabase.from("social_post_likes").select("*").in("post_id", postIds),
      supabase
        .from("profiles")
        .select("id, display_name, avatar_url, email, bio, skill_level")
        .in("id", userIds),
    ]);

  const profilesById = new Map(
    ((profiles ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]),
  );
  const likesByPost = new Map<string, string[]>();
  for (const like of (likes ?? []) as LikeRow[]) {
    const list = likesByPost.get(like.post_id) ?? [];
    list.push(like.user_id);
    likesByPost.set(like.post_id, list);
  }

  const commentUserIds = [
    ...new Set(((comments ?? []) as CommentRow[]).map((row) => row.user_id)),
  ];
  const missingCommentProfiles = commentUserIds.filter(
    (id) => !profilesById.has(id),
  );
  if (missingCommentProfiles.length > 0) {
    const { data: moreProfiles } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email, bio, skill_level")
      .in("id", missingCommentProfiles);
    for (const profile of (moreProfiles ?? []) as ProfileRow[]) {
      profilesById.set(profile.id, profile);
    }
  }

  const commentsByPost = new Map<string, ReturnType<typeof mapCommentRow>[]>();
  for (const comment of (comments ?? []) as CommentRow[]) {
    const mapped = mapCommentRow(comment, profilesById.get(comment.user_id));
    const list = commentsByPost.get(comment.post_id) ?? [];
    list.push(mapped);
    commentsByPost.set(comment.post_id, list);
  }

  const mapped = rows.map((row) =>
    mapPostRow(row, {
      profile: profilesById.get(row.user_id),
      likeUserIds: likesByPost.get(row.id) ?? [],
      comments: commentsByPost.get(row.id) ?? [],
    }),
  );

  return mergeSeedPosts(mapped);
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonSuccess({ posts: mergeSeedPosts([]), source: "seed" as const });
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to view the social feed.", 401);

    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to view the social feed.", 503);

    const posts = await loadPostsPayload(supabase);
    return jsonSuccess({
      posts,
      source: posts.some((post) => !post.id.startsWith("post-"))
        ? ("mixed" as const)
        : ("seed" as const),
    });
  } catch (error) {
    console.error("[api/social/posts GET]", error);
    return jsonError("Failed to load social posts.", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("Sign in to share a post.", 503);
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return jsonError("Sign in to share a post.", 401);

    const input = socialCreatePostInputSchema.parse(await parseJsonBody(request));
    const supabase = await createClient();
    if (!supabase) return jsonError("Sign in to share a post.", 503);

    const { data, error } = await supabase
      .from("social_posts")
      .insert({
        user_id: userId,
        content: input.content.trim(),
        image_url: input.imageUrl ?? null,
        project_title: input.projectTitle?.trim() || null,
      } as never)
      .select("*")
      .single();

    if (error) throw error;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email, bio, skill_level")
      .eq("id", userId)
      .maybeSingle();

    const post = mapPostRow(data as PostRow, {
      profile: profile as ProfileRow | null,
      likeUserIds: [],
      comments: [],
    });

    return jsonSuccess({ post });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    console.error("[api/social/posts POST]", error);
    return jsonError("Failed to create post.", 500);
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
