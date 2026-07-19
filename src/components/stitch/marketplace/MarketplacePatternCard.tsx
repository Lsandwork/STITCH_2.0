"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { MarketplacePatternStats } from "@/components/stitch/marketplace/MarketplacePatternStats";
import {
  formatSkillLevel,
} from "@/lib/marketplace-filters";
import { setMarketplaceListingSaved } from "@/lib/marketplace-api";
import { formatPrice } from "@/lib/marketplace-storage";
import type { MarketplaceListing } from "@/lib/schemas/marketplace";
import { cn } from "@/lib/utils";

type MarketplacePatternCardProps = {
  listing: MarketplaceListing;
  isSaved?: boolean;
  onSavedChange?: (listingId: string, saved: boolean) => void;
  className?: string;
};

function difficultyStyles(level: MarketplaceListing["skillLevel"]) {
  switch (level) {
    case "beginner":
      return "bg-emerald-50 text-emerald-700";
    case "advanced":
      return "bg-stitch-rose text-stitch-coral";
    default:
      return "bg-amber-50 text-amber-800";
  }
}

export function MarketplacePatternCard({
  listing,
  isSaved = false,
  onSavedChange,
  className,
}: MarketplacePatternCardProps) {
  const [saved, setSaved] = useState(isSaved);
  const href = `/marketplace/${listing.id}`;
  const showGradient = !listing.thumbnailUrl && Boolean(listing.thumbnailStyle);

  function handleBookmark(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const nextSaved = !saved;
    setSaved(nextSaved);
    onSavedChange?.(listing.id, nextSaved);
    void setMarketplaceListingSaved(listing.id, nextSaved).then((ids) => {
      const confirmed = ids.includes(listing.id);
      setSaved(confirmed);
      onSavedChange?.(listing.id, confirmed);
    });
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-stitch-lg border border-stitch-border bg-stitch-paper shadow-stitch-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-stitch-floating motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stitch-cream">
        <Link
          href={href}
          className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral"
          aria-label={`View ${listing.title}`}
        >
          {showGradient && listing.thumbnailStyle ? (
            <div
              className="flex h-full w-full items-center justify-center text-5xl transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
              style={{
                background: `linear-gradient(135deg, ${listing.thumbnailStyle.gradientFrom}, ${listing.thumbnailStyle.gradientTo})`,
              }}
            >
              {listing.thumbnailStyle.emoji ?? "🧶"}
            </div>
          ) : listing.thumbnailUrl ? (
            <Image
              src={listing.thumbnailUrl}
              alt={listing.title}
              width={480}
              height={360}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stitch-peach text-4xl">
              🧶
            </div>
          )}
        </Link>

        {listing.duplicateScore >= 60 ? (
          <span className="absolute left-3 top-3 rounded-stitch-pill bg-stitch-gold/95 px-2.5 py-1 text-[10px] font-semibold text-stitch-ink">
            Review duplicate
          </span>
        ) : null}

        <span className="absolute right-3 top-3 rounded-stitch-sm bg-stitch-coral px-2.5 py-1 text-xs font-bold text-white shadow-sm">
          {formatPrice(listing.priceCents)}
        </span>

        <button
          type="button"
          onClick={handleBookmark}
          aria-label={saved ? "Remove from saved patterns" : "Save pattern"}
          aria-pressed={saved}
          className={cn(
            "absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-stitch-border bg-stitch-paper/95 shadow-stitch-card transition-colors hover:bg-stitch-peach focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral",
            saved && "border-stitch-coral bg-stitch-rose",
          )}
        >
          <StitchIcon
            name={saved ? "bookmark" : "heart"}
            tone={saved ? "coral" : "muted"}
            size={18}
          />
        </button>
      </div>

      <Link
        href={href}
        className="flex flex-1 flex-col p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral"
      >
        <div className="mb-2 flex items-center gap-2">
          {listing.designerAvatarUrl ? (
            <Image
              src={listing.designerAvatarUrl}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 rounded-full border border-stitch-border object-cover"
            />
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-stitch-peach">
              <StitchIcon name="user" tone="muted" size={14} />
            </span>
          )}
          <span className="truncate text-xs text-stitch-muted">{listing.designerName}</span>
        </div>

        <h2 className="line-clamp-2 text-base font-semibold leading-snug text-stitch-ink">
          {listing.title}
        </h2>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stitch-muted">
          {listing.previewText}
        </p>

        <p className="mt-1 line-clamp-1 text-xs text-stitch-muted/90">
          {listing.yarnWeight ? `${listing.yarnWeight} weight` : listing.projectType} ·{" "}
          {formatSkillLevel(listing.skillLevel)} friendly
        </p>

        <span
          className={cn(
            "mt-3 inline-flex w-fit rounded-stitch-pill px-2.5 py-1 text-[11px] font-medium capitalize",
            difficultyStyles(listing.skillLevel),
          )}
        >
          {formatSkillLevel(listing.skillLevel)}
        </span>
      </Link>

      <MarketplacePatternStats
        rating={listing.rating}
        downloads={listing.downloads}
        reviews={listing.ratingCount}
      />
    </article>
  );
}
