"use client";

import Image from "next/image";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { setGroupJoined } from "@/lib/social-api";
import type { SocialGroup } from "@/lib/schemas/social";
import { cn } from "@/lib/utils";

type GroupCardProps = {
  group: SocialGroup;
  onUpdate: (group: SocialGroup) => void;
  compact?: boolean;
};

export function GroupCard({ group, onUpdate, compact }: GroupCardProps) {
  function handleJoin() {
    const nextJoined = !group.isJoined;
    onUpdate({
      ...group,
      isJoined: nextJoined,
      memberCount: nextJoined
        ? group.memberCount + 1
        : Math.max(0, group.memberCount - 1),
    });
    void setGroupJoined(group.id, nextJoined).then((result) => {
      onUpdate({
        ...group,
        isJoined: result.joined,
        memberCount:
          result.memberCount ??
          (result.joined
            ? group.memberCount + 1
            : Math.max(0, group.memberCount - 1)),
      });
    });
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-stitch-md border border-stitch-border bg-stitch-paper p-3">
        {group.imageUrl ? (
          <Image
            src={group.imageUrl}
            alt={group.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-stitch-sm object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-stitch-sm bg-stitch-peach">
            <StitchIcon name="users" tone="coral" size={20} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{group.name}</p>
          <p className="text-xs text-stitch-muted">
            {group.memberCount.toLocaleString()} members
          </p>
        </div>
        <Button
          size="sm"
          variant={group.isJoined ? "secondary" : "primary"}
          onClick={handleJoin}
        >
          {group.isJoined ? "Joined" : "Join"}
        </Button>
      </div>
    );
  }

  return (
    <article
      className={cn(
        "stitch-card overflow-hidden transition-transform hover:-translate-y-0.5",
        group.isJoined && "ring-2 ring-stitch-teal/30",
      )}
    >
      {group.imageUrl ? (
        <div className="relative aspect-[3/1] bg-stitch-cream">
          <Image src={group.imageUrl} alt={group.name} fill className="object-cover" />
          <span className="absolute left-3 top-3 rounded-stitch-pill bg-stitch-paper/90 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
            {group.category}
          </span>
        </div>
      ) : null}
      <div className="p-4">
        <h3 className="font-semibold text-stitch-ink">{group.name}</h3>
        <p className="mt-1 text-sm text-stitch-muted line-clamp-2">{group.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-stitch-muted">
            <StitchIcon name="users" tone="muted" size={14} />
            {group.memberCount.toLocaleString()} members
          </span>
          <Button
            size="sm"
            variant={group.isJoined ? "secondary" : "primary"}
            onClick={handleJoin}
          >
            {group.isJoined ? "Joined" : "Join group"}
          </Button>
        </div>
      </div>
    </article>
  );
}
