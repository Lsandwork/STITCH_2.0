import {
  SOCIAL_SEED_GROUPS,
  SOCIAL_SEED_MAKERS,
  SOCIAL_SEED_POSTS,
} from "@/lib/social-seed";
import {
  socialGroupSchema,
  socialPostSchema,
  type SocialComment,
  type SocialGroup,
  type SocialMaker,
  type SocialPost,
} from "@/lib/schemas/social";
import { AUTH_USER_ID_KEY } from "@/lib/auth-client";
import { isDemoModeEnabled } from "@/lib/constants";
import { DEMO_USER } from "@/lib/demo-data";

export const SOCIAL_POSTS_KEY = "stitch-social-posts";
export const SOCIAL_GROUPS_KEY = "stitch-social-groups";
export const SOCIAL_MAKERS_KEY = "stitch-social-makers";
export const SOCIAL_FOLLOWS_KEY = "stitch-social-follows";

export function getCurrentUserId(): string | null {
  if (typeof window !== "undefined") {
    const authUserId = localStorage.getItem(AUTH_USER_ID_KEY);
    if (authUserId) return authUserId;
  }
  if (isDemoModeEnabled()) return DEMO_USER.id;
  return null;
}

function parsePosts(raw: string | null): SocialPost[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown[];
    return parsed
      .map((item) => socialPostSchema.safeParse(item))
      .filter((r) => r.success)
      .map((r) => r.data);
  } catch {
    return [];
  }
}

function parseGroups(raw: string | null): SocialGroup[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown[];
    return parsed
      .map((item) => socialGroupSchema.safeParse(item))
      .filter((r) => r.success)
      .map((r) => r.data);
  } catch {
    return [];
  }
}

export function getSocialPosts(): SocialPost[] {
  if (typeof window === "undefined") return SOCIAL_SEED_POSTS;
  const raw = localStorage.getItem(SOCIAL_POSTS_KEY);
  const posts = parsePosts(raw);
  if (posts.length === 0) {
    saveSocialPosts(SOCIAL_SEED_POSTS);
    return SOCIAL_SEED_POSTS;
  }
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function saveSocialPosts(posts: SocialPost[]): void {
  localStorage.setItem(SOCIAL_POSTS_KEY, JSON.stringify(posts));
}

export function getSocialGroups(): SocialGroup[] {
  if (typeof window === "undefined") return SOCIAL_SEED_GROUPS;
  const raw = localStorage.getItem(SOCIAL_GROUPS_KEY);
  const groups = parseGroups(raw);
  if (groups.length === 0) {
    saveSocialGroups(SOCIAL_SEED_GROUPS);
    return SOCIAL_SEED_GROUPS;
  }
  return groups;
}

export function saveSocialGroups(groups: SocialGroup[]): void {
  localStorage.setItem(SOCIAL_GROUPS_KEY, JSON.stringify(groups));
}

export function getSocialMakers(): SocialMaker[] {
  if (typeof window === "undefined") return SOCIAL_SEED_MAKERS;
  const raw = localStorage.getItem(SOCIAL_MAKERS_KEY);
  if (!raw) {
    saveSocialMakers(SOCIAL_SEED_MAKERS);
    return SOCIAL_SEED_MAKERS;
  }
  try {
    return JSON.parse(raw) as SocialMaker[];
  } catch {
    return SOCIAL_SEED_MAKERS;
  }
}

export function saveSocialMakers(makers: SocialMaker[]): void {
  localStorage.setItem(SOCIAL_MAKERS_KEY, JSON.stringify(makers));
}

export function getFollows(): string[] {
  if (typeof window === "undefined") return ["maker-maya", "maker-elena"];
  const raw = localStorage.getItem(SOCIAL_FOLLOWS_KEY);
  if (!raw) {
    const seed = ["maker-maya", "maker-elena"];
    localStorage.setItem(SOCIAL_FOLLOWS_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function toggleFollow(makerId: string): boolean {
  const follows = getFollows();
  const isFollowing = follows.includes(makerId);
  const updated = isFollowing
    ? follows.filter((id) => id !== makerId)
    : [...follows, makerId];
  localStorage.setItem(SOCIAL_FOLLOWS_KEY, JSON.stringify(updated));
  return !isFollowing;
}

export function toggleGroupJoin(groupId: string): boolean {
  const groups = getSocialGroups();
  const index = groups.findIndex((g) => g.id === groupId);
  if (index === -1) return false;
  groups[index] = {
    ...groups[index],
    isJoined: !groups[index].isJoined,
    memberCount: groups[index].isJoined
      ? groups[index].memberCount - 1
      : groups[index].memberCount + 1,
  };
  saveSocialGroups(groups);
  return groups[index].isJoined;
}

export function addSocialPost(post: Omit<SocialPost, "id" | "likes" | "comments" | "createdAt">): SocialPost {
  const newPost: SocialPost = {
    ...post,
    id: `post-${Date.now().toString(36)}`,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };
  const posts = getSocialPosts();
  posts.unshift(newPost);
  saveSocialPosts(posts);
  return newPost;
}

export function togglePostLike(postId: string, userId: string): SocialPost | null {
  const posts = getSocialPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return null;
  const post = posts[index];
  const liked = post.likes.includes(userId);
  posts[index] = {
    ...post,
    likes: liked ? post.likes.filter((id) => id !== userId) : [...post.likes, userId],
  };
  saveSocialPosts(posts);
  return posts[index];
}

export function addComment(
  postId: string,
  comment: Omit<SocialComment, "id" | "createdAt">,
): SocialPost | null {
  const posts = getSocialPosts();
  const index = posts.findIndex((p) => p.id === postId);
  if (index === -1) return null;
  const newComment: SocialComment = {
    ...comment,
    id: `c-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  posts[index] = {
    ...posts[index],
    comments: [...posts[index].comments, newComment],
  };
  saveSocialPosts(posts);
  return posts[index];
}

export function generatePostId(): string {
  return `post-${Date.now().toString(36)}`;
}
