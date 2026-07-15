"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeedPost } from "@/components/stitch/social/FeedPost";
import { SocialAiPanel } from "@/components/stitch/social/SocialAiPanel";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCurrentUser } from "@/components/providers/SubscriptionProvider";
import {
  addSocialPost,
  getSocialPosts,
} from "@/lib/social-storage";
import type { SocialPost } from "@/lib/schemas/social";
import { cn } from "@/lib/utils";

type FeedTab = "all" | "following";

export function SocialFeedClient() {
  const currentUser = useCurrentUser();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<FeedTab>("all");
  const [showComposer, setShowComposer] = useState(false);
  const [content, setContent] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPosts(getSocialPosts());
    setLoaded(true);
  }, []);

  function refreshPosts() {
    setPosts(getSocialPosts());
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    addSocialPost({
      userId: currentUser.id,
      userName: currentUser.displayName,
      userHandle: currentUser.handle,
      userAvatarUrl: currentUser.avatarUrl,
      content: content.trim(),
      imageUrl: imagePreview ?? undefined,
      projectTitle: projectTitle.trim() || undefined,
    });

    setContent("");
    setProjectTitle("");
    setImagePreview(null);
    setShowComposer(false);
    refreshPosts();
  }

  const followingIds = ["maker-maya", "maker-elena"];
  const filtered =
    tab === "following"
      ? posts.filter(
          (p) =>
            followingIds.includes(p.userId) || p.userId === currentUser.id,
        )
      : posts;

  return (
    <>
      <PageHeading
        title="Social Network"
        description="Crochet & Projects Social Network — Instagram meets Ravelry. Free for everyone."
        actionLabel="Share WIP"
        actionHref="#compose"
      />

      <div className="mb-6 grid gap-4 rounded-stitch-lg border border-stitch-border bg-gradient-to-br from-stitch-sky/50 to-stitch-rose/30 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: "sparkles", label: "Project ideas", desc: "AI suggests your next make" },
          { icon: "users", label: "Maker matches", desc: "Find crocheters like you" },
          { icon: "star", label: "Pattern finds", desc: "Discover patterns from the feed" },
          { icon: "chat", label: "Groups", desc: "Join communities that fit" },
        ].map((feature) => (
          <div key={feature.label} className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-stitch-md bg-stitch-paper shadow-stitch-card">
              <StitchIcon name={feature.icon} tone="teal" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-stitch-ink">{feature.label}</p>
              <p className="text-xs text-stitch-muted">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-stitch-pill border border-stitch-border bg-stitch-paper p-1">
          {(["all", "following"] as FeedTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-stitch-pill px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                tab === t ? "bg-stitch-teal text-white" : "text-stitch-muted hover:text-stitch-ink",
              )}
            >
              {t === "all" ? "For you" : "Following"}
            </button>
          ))}
        </div>
        <Link
          href="/social/groups"
          className="flex items-center gap-1.5 text-sm font-medium text-stitch-teal hover:underline"
        >
          <StitchIcon name="users" tone="teal" size={18} />
          Groups
        </Link>
        <Link
          href="/social/discover"
          className="flex items-center gap-1.5 text-sm font-medium text-stitch-teal hover:underline"
        >
          <StitchIcon name="search" tone="teal" size={18} />
          Discover makers
        </Link>
        <Link
          href="/marketplace"
          className="flex items-center gap-1.5 text-sm font-medium text-stitch-coral hover:underline"
        >
          <StitchIcon name="star" tone="coral" size={18} />
          Marketplace
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div id="compose">
          <Card padding="lg">
            {!showComposer ? (
              <button
                type="button"
                onClick={() => setShowComposer(true)}
                className="flex w-full items-center gap-3 text-left"
              >
                <Image
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full border border-stitch-border"
                />
                <span className="flex-1 rounded-stitch-pill border border-stitch-border bg-stitch-cream px-4 py-2.5 text-sm text-stitch-muted">
                  Share your WIP, finished project, or tip…
                </span>
              </button>
            ) : (
              <form onSubmit={handlePost} className="space-y-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your hooks today?"
                  rows={3}
                  className="w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-3 text-sm"
                  autoFocus
                />
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Project name (optional)"
                  className="w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-2.5 text-sm"
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative aspect-video max-w-xs overflow-hidden rounded-stitch-md">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute right-2 top-2 rounded-full bg-stitch-ink/60 p-1 text-white"
                    >
                      <StitchIcon name="close" tone="default" size={14} />
                    </button>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <StitchIcon name="image" tone="muted" size={18} className="mr-1" />
                    Photo
                  </Button>
                  <div className="ml-auto flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowComposer(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={!content.trim()}>
                      Post
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Card>
          </div>

          {loaded
            ? filtered.map((post) => (
                <FeedPost
                  key={post.id}
                  post={post}
                  onUpdate={() => refreshPosts()}
                />
              ))
            : null}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-6">
            <SocialAiPanel />
          </div>
        </aside>
      </div>

      <div className="mt-8 xl:hidden">
        <SocialAiPanel />
      </div>
    </>
  );
}
