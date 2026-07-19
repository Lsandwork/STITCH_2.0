import type {
  SocialComment,
  SocialGroup,
  SocialMaker,
  SocialPost,
} from "@/lib/schemas/social";
import {
  addComment as addLocalComment,
  addSocialPost as addLocalPost,
  getFollows as getLocalFollows,
  getSocialGroups as getLocalGroups,
  getSocialMakers as getLocalMakers,
  getSocialPosts as getLocalPosts,
  toggleFollow as toggleLocalFollow,
  toggleGroupJoin as toggleLocalGroupJoin,
  togglePostLike as toggleLocalLike,
} from "@/lib/social-storage";

export async function fetchSocialPosts(): Promise<SocialPost[]> {
  try {
    const response = await fetch("/api/social/posts");
    if (!response.ok) return getLocalPosts();
    const payload = (await response.json()) as { posts?: SocialPost[] };
    return payload.posts ?? getLocalPosts();
  } catch {
    return getLocalPosts();
  }
}

export async function createSocialPost(input: {
  content: string;
  imageUrl?: string;
  projectTitle?: string;
}): Promise<SocialPost> {
  const response = await fetch("/api/social/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as {
    error?: string;
    post?: SocialPost;
  };
  if (!response.ok || !payload.post) {
    // Fallback for demo / offline: keep local composer working.
    return addLocalPost({
      userId: "local-user",
      userName: "You",
      userHandle: "@you",
      userAvatarUrl: "/assets/stitch/avatars/svg/avatar-3.svg",
      content: input.content,
      imageUrl: input.imageUrl,
      projectTitle: input.projectTitle,
    });
  }
  return payload.post;
}

export async function toggleSocialPostLike(
  postId: string,
  userId: string,
): Promise<{ likes: string[]; liked: boolean } | null> {
  const isSeedPost = postId.startsWith("post-");
  if (isSeedPost) {
    const updated = toggleLocalLike(postId, userId);
    if (!updated) return null;
    return {
      likes: updated.likes,
      liked: updated.likes.includes(userId),
    };
  }

  try {
    const response = await fetch(`/api/social/posts/${postId}/like`, {
      method: "POST",
    });
    if (!response.ok) {
      const updated = toggleLocalLike(postId, userId);
      return updated
        ? { likes: updated.likes, liked: updated.likes.includes(userId) }
        : null;
    }
    return (await response.json()) as { likes: string[]; liked: boolean };
  } catch {
    const updated = toggleLocalLike(postId, userId);
    return updated
      ? { likes: updated.likes, liked: updated.likes.includes(userId) }
      : null;
  }
}

export async function addSocialPostComment(
  postId: string,
  input: { content: string; userId: string; userName: string; userAvatarUrl?: string },
): Promise<SocialComment | null> {
  const isSeedPost = postId.startsWith("post-");
  if (isSeedPost) {
    const updated = addLocalComment(postId, {
      userId: input.userId,
      userName: input.userName,
      userAvatarUrl: input.userAvatarUrl,
      content: input.content,
    });
    return updated?.comments.at(-1) ?? null;
  }

  try {
    const response = await fetch(`/api/social/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input.content }),
    });
    if (!response.ok) {
      const updated = addLocalComment(postId, {
        userId: input.userId,
        userName: input.userName,
        userAvatarUrl: input.userAvatarUrl,
        content: input.content,
      });
      return updated?.comments.at(-1) ?? null;
    }
    const payload = (await response.json()) as { comment?: SocialComment };
    return payload.comment ?? null;
  } catch {
    const updated = addLocalComment(postId, {
      userId: input.userId,
      userName: input.userName,
      userAvatarUrl: input.userAvatarUrl,
      content: input.content,
    });
    return updated?.comments.at(-1) ?? null;
  }
}

export async function fetchSocialGroups(): Promise<SocialGroup[]> {
  try {
    const response = await fetch("/api/social/groups");
    if (!response.ok) return getLocalGroups();
    const payload = (await response.json()) as { groups?: SocialGroup[] };
    return payload.groups ?? getLocalGroups();
  } catch {
    return getLocalGroups();
  }
}

export async function setGroupJoined(
  groupId: string,
  joined: boolean,
): Promise<{ joined: boolean; memberCount?: number }> {
  const isSeedGroup = !/^[0-9a-f-]{36}$/i.test(groupId);
  if (isSeedGroup) {
    const nextJoined = toggleLocalGroupJoin(groupId);
    return { joined: nextJoined };
  }

  try {
    const response = await fetch("/api/social/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, joined }),
    });
    if (!response.ok) {
      return { joined: toggleLocalGroupJoin(groupId) };
    }
    return (await response.json()) as {
      joined: boolean;
      memberCount?: number;
    };
  } catch {
    return { joined: toggleLocalGroupJoin(groupId) };
  }
}

export async function fetchSocialMakers(): Promise<{
  makers: SocialMaker[];
  followingIds: string[];
}> {
  try {
    const response = await fetch("/api/social/follows");
    if (!response.ok) {
      return {
        makers: getLocalMakers(),
        followingIds: getLocalFollows(),
      };
    }
    const payload = (await response.json()) as {
      makers?: SocialMaker[];
      followingIds?: string[];
    };
    return {
      makers: payload.makers ?? getLocalMakers(),
      followingIds: payload.followingIds ?? getLocalFollows(),
    };
  } catch {
    return {
      makers: getLocalMakers(),
      followingIds: getLocalFollows(),
    };
  }
}

export async function setMakerFollowing(
  makerId: string,
  following: boolean,
): Promise<boolean> {
  const isSeedMaker = !/^[0-9a-f-]{36}$/i.test(makerId);
  if (isSeedMaker) {
    return toggleLocalFollow(makerId);
  }

  try {
    const response = await fetch("/api/social/follows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ makerId, following }),
    });
    if (!response.ok) return toggleLocalFollow(makerId);
    return following;
  } catch {
    return toggleLocalFollow(makerId);
  }
}
