import { SOCIAL_SEED_GROUPS, SOCIAL_SEED_POSTS } from "@/lib/social-seed";
import type {
  SocialComment,
  SocialGroup,
  SocialMaker,
  SocialPost,
} from "@/lib/schemas/social";
import { buildUserHandle } from "@/lib/user-handle";
import type { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["social_posts"]["Row"];
type CommentRow = Database["public"]["Tables"]["social_comments"]["Row"];
type GroupRow = Database["public"]["Tables"]["social_groups"]["Row"];
type ProfileRow = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "id" | "display_name" | "avatar_url" | "email" | "bio" | "skill_level"
>;

export function mapCommentRow(
  row: CommentRow,
  profile?: ProfileRow | null,
): SocialComment {
  const email = profile?.email ?? "maker@stitch.local";
  return {
    id: row.id,
    userId: row.user_id,
    userName: profile?.display_name?.trim() || email.split("@")[0] || "Maker",
    userAvatarUrl: profile?.avatar_url ?? undefined,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function mapPostRow(
  row: PostRow,
  options: {
    profile?: ProfileRow | null;
    likeUserIds: string[];
    comments: SocialComment[];
  },
): SocialPost {
  const email = options.profile?.email ?? "maker@stitch.local";
  const displayName =
    options.profile?.display_name?.trim() || email.split("@")[0] || "Maker";

  return {
    id: row.id,
    userId: row.user_id,
    userName: displayName,
    userAvatarUrl: options.profile?.avatar_url ?? undefined,
    userHandle: buildUserHandle(email),
    content: row.content,
    imageUrl: row.image_url ?? undefined,
    projectTitle: row.project_title ?? undefined,
    patternRef: row.pattern_ref ?? undefined,
    likes: options.likeUserIds,
    comments: options.comments,
    createdAt: row.created_at,
  };
}

export function mapGroupRow(
  row: GroupRow,
  joinedGroupIds: Set<string>,
): SocialGroup {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    memberCount: row.member_count,
    imageUrl: row.image_url ?? undefined,
    isJoined: joinedGroupIds.has(row.id),
  };
}

export function mapProfileToMaker(
  profile: ProfileRow,
  options: {
    followerCount: number;
    projectCount: number;
    isFollowing: boolean;
  },
): SocialMaker {
  const email = profile.email ?? "maker@stitch.local";
  return {
    id: profile.id,
    displayName: profile.display_name?.trim() || email.split("@")[0] || "Maker",
    handle: buildUserHandle(email),
    avatarUrl: profile.avatar_url || "/assets/stitch/avatars/svg/avatar-3.svg",
    bio: profile.bio?.trim() || "Stitch maker",
    skillLevel: profile.skill_level ?? "beginner",
    projectCount: options.projectCount,
    followerCount: options.followerCount,
    specialties: [],
    isFollowing: options.isFollowing,
  };
}

export function mergeSeedPosts(dbPosts: SocialPost[]): SocialPost[] {
  if (dbPosts.length === 0) {
    return SOCIAL_SEED_POSTS;
  }
  const ids = new Set(dbPosts.map((post) => post.id));
  const seeds = SOCIAL_SEED_POSTS.filter((post) => !ids.has(post.id));
  return [...dbPosts, ...seeds];
}

export function mergeSeedGroups(dbGroups: SocialGroup[]): SocialGroup[] {
  if (dbGroups.length === 0) {
    return SOCIAL_SEED_GROUPS;
  }
  return dbGroups;
}
