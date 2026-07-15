"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getFollows, getSocialMakers, toggleFollow } from "@/lib/social-storage";
import type { SocialMaker } from "@/lib/schemas/social";

export function SocialDiscoverClient() {
  const [makers, setMakers] = useState<SocialMaker[]>([]);
  const [follows, setFollows] = useState<string[]>([]);

  useEffect(() => {
    setMakers(getSocialMakers());
    setFollows(getFollows());
  }, []);

  function handleFollow(makerId: string) {
    toggleFollow(makerId);
    setFollows(getFollows());
  }

  const sorted = [...makers].sort((a, b) => {
    const aFollow = follows.includes(a.id);
    const bFollow = follows.includes(b.id);
    if (aFollow && !bFollow) return -1;
    if (!aFollow && bFollow) return 1;
    return b.followerCount - a.followerCount;
  });

  return (
    <>
      <PageHeading
        title="Discover Makers"
        description="Find crocheters to follow — matched by skill level, specialties, and project style."
        backHref="/social"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((maker) => {
          const isFollowing = follows.includes(maker.id);
          return (
            <article key={maker.id} className="stitch-card p-5">
              <div className="flex items-start gap-4">
                <Image
                  src={maker.avatarUrl}
                  alt={maker.displayName}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border-2 border-stitch-border"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-stitch-ink">{maker.displayName}</h2>
                  <p className="text-sm text-stitch-muted">{maker.handle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-stitch-ink">{maker.bio}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge>{maker.skillLevel}</Badge>
                {maker.specialties.slice(0, 3).map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-stitch-muted">
                <span>{maker.projectCount} projects</span>
                <span>{maker.followerCount.toLocaleString()} followers</span>
              </div>

              <Button
                variant={isFollowing ? "secondary" : "primary"}
                size="sm"
                className="mt-4 w-full"
                onClick={() => handleFollow(maker.id)}
              >
                {isFollowing ? (
                  <>
                    <StitchIcon name="check" tone="teal" size={16} className="mr-1" />
                    Following
                  </>
                ) : (
                  "Follow"
                )}
              </Button>
            </article>
          );
        })}
      </div>
    </>
  );
}
