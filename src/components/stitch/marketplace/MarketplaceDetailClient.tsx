"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "@/components/stitch/PageHeading";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  fetchMarketplaceListing,
  recordMarketplaceDownload,
} from "@/lib/marketplace-api";
import { formatPrice, incrementListingDownload } from "@/lib/marketplace-storage";
import {
  DEFAULT_SITE_LANGUAGE,
  getListingLanguages,
  getListingTranslation,
} from "@/lib/marketplace-i18n";
import type { MarketplaceListing } from "@/lib/schemas/marketplace";

type MarketplaceDetailClientProps = {
  listingId: string;
};

function PatternInstructions({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-4 text-sm leading-relaxed text-stitch-ink">
      {blocks.map((block) => {
        const lines = block.split("\n").filter(Boolean);
        const isSectionHeader =
          lines.length === 1 &&
          lines[0] === lines[0].toUpperCase() &&
          !/^\d+\./.test(lines[0]);
        const isNumberedStep = lines.every((line) => /^\d+\.\s/.test(line));

        if (isSectionHeader) {
          return (
            <h4
              key={block}
              className="border-b border-stitch-border pb-1 text-xs font-bold uppercase tracking-wide text-stitch-teal-dark"
            >
              {lines[0]}
            </h4>
          );
        }

        if (isNumberedStep) {
          return (
            <ol key={block} className="space-y-3">
              {lines.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stitch-teal text-xs font-bold text-white">
                    {line.match(/^(\d+)\./)?.[1]}
                  </span>
                  <span className="pt-0.5">{line.replace(/^\d+\.\s*/, "")}</span>
                </li>
              ))}
            </ol>
          );
        }

        if (lines.every((line) => line.startsWith("•"))) {
          return (
            <ul key={block} className="space-y-1 text-stitch-muted">
              {lines.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-stitch-teal">•</span>
                  <span>{line.replace(/^•\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={block} className="text-stitch-muted">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function MarketplaceDetailClient({ listingId }: MarketplaceDetailClientProps) {
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [activeLang, setActiveLang] = useState(DEFAULT_SITE_LANGUAGE);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchMarketplaceListing(listingId).then((next) => {
      if (cancelled) return;
      setListing(next);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  function handleDownload() {
    if (!listing) return;
    incrementListingDownload(listing.id);
    void recordMarketplaceDownload(listing.id);
    setDownloaded(true);

    const blob = new Blob(
      [
        `${listing.title}\n${"=".repeat(listing.title.length)}\n\n`,
        `Designer: ${listing.designerName}\n`,
        `Skill: ${listing.skillLevel} · Type: ${listing.projectType}\n`,
        `Hook: ${listing.hookSize ?? "—"} · Yarn: ${listing.yarnWeight ?? "—"}\n\n`,
        listing.aiDescription,
        `\n\n--- PATTERN ---\n\n`,
        listing.patternContent,
      ],
      { type: "text/plain" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${listing.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!loaded) return null;

  if (!listing) {
    return (
      <>
        <PageHeading title="Pattern not found" backHref="/marketplace" />
        <Button href="/marketplace">Back to Marketplace</Button>
      </>
    );
  }

  const showGradient = !listing.thumbnailUrl && Boolean(listing.thumbnailStyle);
  const showImage = Boolean(listing.thumbnailUrl);
  const translation = getListingTranslation(listing, activeLang);
  const languages = getListingLanguages(listing);
  const showTranslatedDescription = activeLang !== DEFAULT_SITE_LANGUAGE;

  return (
    <>
      <PageHeading
        title={translation.title}
        description={listing.previewText}
        backHref="/marketplace"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-stitch-lg border border-stitch-border shadow-stitch-card">
            {showGradient && listing.thumbnailStyle ? (
              <div
                className="flex h-full w-full items-center justify-center text-8xl"
                style={{
                  background: `linear-gradient(135deg, ${listing.thumbnailStyle.gradientFrom}, ${listing.thumbnailStyle.gradientTo})`,
                }}
              >
                {listing.thumbnailStyle.emoji ?? "🧶"}
              </div>
            ) : showImage ? (
              <Image
                src={listing.thumbnailUrl}
                alt={listing.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-stitch-peach text-8xl">
                🧶
              </div>
            )}
          </div>

          <Card padding="lg">
            <div className="mb-4 flex items-center gap-3">
              {listing.designerAvatarUrl ? (
                <Image
                  src={listing.designerAvatarUrl}
                  alt={listing.designerName}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
              ) : null}
              <div>
                <p className="font-semibold">{listing.designerName}</p>
                <p className="text-xs text-stitch-muted">Designer</p>
              </div>
            </div>

            <p className="leading-relaxed text-stitch-ink">
              {showTranslatedDescription ? translation.description : listing.aiDescription}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{listing.skillLevel}</Badge>
              <Badge>{listing.projectType}</Badge>
              {listing.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle>Step-by-step pattern</CardTitle>
            </CardHeader>
            <PatternInstructions content={listing.patternContent} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card padding="lg" className="sticky top-6">
            <p className="text-3xl font-bold text-stitch-coral">
              {formatPrice(listing.priceCents)}
            </p>

            <div className="mt-2 flex items-center gap-3 text-sm text-stitch-muted">
              <span className="flex items-center gap-1">
                <StitchIcon name="star" tone="gold" size={16} />
                {listing.rating > 0 ? listing.rating.toFixed(1) : "New"}
              </span>
              <span>{listing.downloads.toLocaleString()} downloads</span>
            </div>

            <Button onClick={handleDownload} className="mt-4 w-full">
              {downloaded ? "Downloaded!" : "Get pattern"}
            </Button>

            <Link
              href="/social"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-stitch-md border border-stitch-border py-2.5 text-sm font-medium text-stitch-teal hover:bg-stitch-mint/30"
            >
              <StitchIcon name="share" tone="teal" size={18} />
              Share with community
            </Link>

            {listing.duplicateScore > 0 ? (
              <div className="mt-4 rounded-stitch-md bg-stitch-peach/50 p-3">
                <p className="flex items-center gap-1 text-xs font-semibold text-stitch-ink">
                  <StitchIcon name="scan" tone="coral" size={14} />
                  Duplicate check: {listing.duplicateScore}%
                </p>
                {listing.duplicateNote ? (
                  <p className="mt-1 text-xs text-stitch-muted">{listing.duplicateNote}</p>
                ) : null}
              </div>
            ) : null}
          </Card>

          <Card padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StitchIcon name="globe" tone="teal" size={20} />
                Languages
              </CardTitle>
            </CardHeader>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {languages.map((lang) => (
                <button
                  key={lang.language}
                  type="button"
                  onClick={() => setActiveLang(lang.language)}
                  className={`rounded-stitch-pill px-3 py-1 text-xs font-medium transition-colors ${
                    activeLang === lang.language
                      ? "bg-stitch-teal text-white"
                      : "bg-stitch-cream text-stitch-muted hover:bg-stitch-mint"
                  }`}
                >
                  {lang.languageLabel}
                </button>
              ))}
            </div>
            <p className="font-medium">{translation.title}</p>
            <p className="mt-1 text-sm text-stitch-muted">{translation.description}</p>
          </Card>

          <Card padding="lg">
            <h3 className="text-sm font-semibold text-stitch-muted">Details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stitch-muted">Hook</dt>
                <dd>{listing.hookSize ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stitch-muted">Yarn</dt>
                <dd>{listing.yarnWeight ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stitch-muted">Type</dt>
                <dd className="capitalize">{listing.projectType}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
