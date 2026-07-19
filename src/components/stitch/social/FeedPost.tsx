"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/components/providers/SubscriptionProvider";
import {
  addSocialPostComment,
  toggleSocialPostLike,
} from "@/lib/social-api";
import { getCurrentUserId } from "@/lib/social-storage";
import type { SocialPost } from "@/lib/schemas/social";
import { cn } from "@/lib/utils";

type FeedPostProps = {
  post: SocialPost;
  onUpdate: (post: SocialPost) => void;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function FeedPost({ post, onUpdate }: FeedPostProps) {
  const currentUser = useCurrentUser();
  const userId = getCurrentUserId();
  const liked = userId ? post.likes.includes(userId) : false;
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  function handleLike() {
    if (!userId) return;
    void toggleSocialPostLike(post.id, userId).then((result) => {
      if (!result) return;
      onUpdate({ ...post, likes: result.likes });
    });
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || !userId || !currentUser) return;
    const content = commentText.trim();
    void addSocialPostComment(post.id, {
      userId,
      userName: currentUser.displayName,
      userAvatarUrl: currentUser.avatarUrl,
      content,
    }).then((comment) => {
      if (!comment) return;
      onUpdate({ ...post, comments: [...post.comments, comment] });
      setCommentText("");
      setShowComments(true);
    });
  }

  return (
    <article className="stitch-card overflow-hidden">
      <header className="flex items-center gap-3 p-4 pb-0">
        <Image
          src={post.userAvatarUrl ?? "/assets/stitch/avatars/svg/avatar-3.svg"}
          alt={post.userName}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full border border-stitch-border"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-stitch-ink">{post.userName}</p>
          <p className="text-xs text-stitch-muted">
            {post.userHandle} · {timeAgo(post.createdAt)}
          </p>
        </div>
        {post.projectTitle ? (
          <span className="rounded-stitch-pill bg-stitch-peach px-2.5 py-1 text-xs font-medium text-stitch-coral">
            {post.projectTitle}
          </span>
        ) : null}
      </header>

      <div className="px-4 py-3">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-stitch-ink">
          {post.content}
        </p>
      </div>

      {post.imageUrl ? (
        <div className="relative aspect-[4/3] bg-stitch-cream">
          <Image
            src={post.imageUrl}
            alt={post.projectTitle ?? "Project photo"}
            fill
            className="object-cover"
          />
        </div>
      ) : null}

      <footer className="border-t border-stitch-border p-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              liked ? "text-stitch-coral" : "text-stitch-muted hover:text-stitch-coral",
            )}
          >
            <StitchIcon name="heart" tone={liked ? "coral" : "muted"} size={20} />
            {post.likes.length > 0 ? post.likes.length : "Like"}
          </button>
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-sm font-medium text-stitch-muted hover:text-stitch-teal"
          >
            <StitchIcon name="chat" tone="muted" size={20} />
            {post.comments.length > 0 ? post.comments.length : "Comment"}
          </button>
          {post.patternRef ? (
            <Link
              href={`/marketplace/${post.patternRef}`}
              className="ml-auto flex items-center gap-1.5 text-sm font-medium text-stitch-teal hover:underline"
            >
              <StitchIcon name="star" tone="teal" size={18} />
              View pattern
            </Link>
          ) : null}
        </div>

        {showComments ? (
          <div className="mt-4 space-y-3 border-t border-stitch-border pt-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Image
                  src={comment.userAvatarUrl ?? "/assets/stitch/avatars/svg/avatar-3.svg"}
                  alt={comment.userName}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full"
                />
                <div className="min-w-0 flex-1 rounded-stitch-md bg-stitch-cream px-3 py-2">
                  <p className="text-xs font-semibold">{comment.userName}</p>
                  <p className="text-sm text-stitch-ink">{comment.content}</p>
                </div>
              </div>
            ))}
            {currentUser && userId ? (
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment…"
                  className="min-w-0 flex-1 rounded-stitch-pill border border-stitch-border bg-stitch-paper px-4 py-2 text-sm"
                />
                <Button type="submit" size="sm" disabled={!commentText.trim()}>
                  Post
                </Button>
              </form>
            ) : (
              <p className="text-xs text-stitch-muted">
                <Link href="/auth/login?redirect=/social" className="font-medium text-stitch-coral hover:underline">
                  Sign in
                </Link>{" "}
                to comment.
              </p>
            )}
          </div>
        ) : null}
      </footer>
    </article>
  );
}
