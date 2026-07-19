"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingState } from "@/components/ui/LoadingState";
import { Badge } from "@/components/ui/Badge";
import { publishMarketplaceListing } from "@/lib/marketplace-api";
import {
  generateListingId,
  getMarketplaceListings,
} from "@/lib/marketplace-storage";
import { normalizeListingLanguages } from "@/lib/marketplace-i18n";
import type { MarketplaceProcessResult } from "@/lib/schemas/marketplace";
import { useCurrentUser } from "@/components/providers/SubscriptionProvider";

export function MarketplaceUploadClient() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [title, setTitle] = useState("");
  const [patternContent, setPatternContent] = useState("");
  const [projectType, setProjectType] = useState("amigurumi");
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [yarnWeight, setYarnWeight] = useState("worsted");
  const [hookSize, setHookSize] = useState("4.0 mm");
  const [priceDollars, setPriceDollars] = useState("4.99");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<MarketplaceProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function processWithAI() {
    if (title.length < 2 || patternContent.length < 20) {
      setError("Add a title and at least 20 characters of pattern content.");
      return;
    }
    setError(null);
    setProcessing(true);
    setAiResult(null);

    try {
      const existing = getMarketplaceListings();
      const response = await fetch("/api/marketplace/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          patternContent,
          skillLevel,
          projectType,
          yarnWeight,
          hookSize,
          priceCents: Math.round(parseFloat(priceDollars || "0") * 100),
          existingTitles: existing.map((l) => l.title),
          existingSummaries: existing.map((l) => l.aiDescription.slice(0, 100)),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Processing failed");
      setAiResult(payload.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProcessing(false);
    }
  }

  async function publishListing() {
    if (!aiResult || !currentUser) {
      setError("Sign in to publish a marketplace listing.");
      return;
    }
    setPublishing(true);
    setError(null);

    const now = new Date().toISOString();
    const id = generateListingId(title);
    const priceCents = Math.round(parseFloat(priceDollars || "0") * 100);

    try {
      const listing = await publishMarketplaceListing({
        id,
        designerId: currentUser.id,
        designerName: currentUser.displayName,
        designerAvatarUrl: currentUser.avatarUrl,
        title,
        description: aiResult.aiDescription.slice(0, 200),
        aiDescription: aiResult.aiDescription,
        previewText: aiResult.previewText,
        patternContent,
        priceCents,
        skillLevel,
        projectType,
        yarnWeight,
        hookSize,
        thumbnailUrl: imagePreview || "/assets/projects/color-studio.jpg",
        thumbnailStyle: imagePreview ? undefined : aiResult.thumbnailStyle,
        languages: normalizeListingLanguages(aiResult.languages, {
          title,
          description: aiResult.aiDescription.slice(0, 200),
        }),
        tags: aiResult.tags,
        downloads: 0,
        rating: 0,
        ratingCount: 0,
        duplicateScore: aiResult.duplicateScore,
        duplicateOfId: null,
        duplicateNote: aiResult.duplicateNote,
        status: aiResult.duplicateScore >= 80 ? "flagged" : "published",
        createdAt: now,
        updatedAt: now,
      });

      router.push(`/marketplace/${listing.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish listing");
      setPublishing(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Upload Pattern"
        description="Paste your pattern — Stitch AI creates thumbnails, previews, descriptions, translations, and checks for duplicates."
        backHref="/marketplace"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void processWithAI();
            }}
            className="space-y-4"
          >
            <Input
              label="Pattern title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cozy Winter Beanie"
              required
            />

            <label className="block text-sm font-medium">
              Pattern content
              <textarea
                className="mt-1.5 w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-3 text-sm font-mono"
                rows={10}
                value={patternContent}
                onChange={(e) => setPatternContent(e.target.value)}
                placeholder="Paste your full pattern instructions here…"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Project type
                <select
                  className="mt-1.5 w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-2.5 text-sm"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <option value="amigurumi">Amigurumi</option>
                  <option value="bag">Bag / Tote</option>
                  <option value="blanket">Blanket / Throw</option>
                  <option value="garment">Garment</option>
                  <option value="accessory">Accessory</option>
                  <option value="home decor">Home Decor</option>
                </select>
              </label>

              <label className="block text-sm font-medium">
                Skill level
                <select
                  className="mt-1.5 w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-2.5 text-sm"
                  value={skillLevel}
                  onChange={(e) =>
                    setSkillLevel(e.target.value as typeof skillLevel)
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Yarn weight"
                value={yarnWeight}
                onChange={(e) => setYarnWeight(e.target.value)}
              />
              <Input
                label="Hook size"
                value={hookSize}
                onChange={(e) => setHookSize(e.target.value)}
              />
            </div>

            <Input
              label="Price (USD)"
              type="number"
              step="0.01"
              min="0"
              value={priceDollars}
              onChange={(e) => setPriceDollars(e.target.value)}
              placeholder="0.00 for free"
            />

            <label className="block text-sm font-medium">
              Cover photo (optional)
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1.5 block w-full text-sm text-stitch-muted file:mr-4 file:rounded-stitch-md file:border-0 file:bg-stitch-peach file:px-4 file:py-2 file:text-sm file:font-medium file:text-stitch-coral"
              />
            </label>

            {imagePreview ? (
              <div className="relative aspect-video overflow-hidden rounded-stitch-md">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}

            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : null}

            <Button type="submit" disabled={processing} className="w-full">
              {processing ? "AI processing…" : "Process with AI"}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          {processing ? (
            <LoadingState label="Creating thumbnail, descriptions, translations, and checking duplicates…" />
          ) : null}

          {aiResult ? (
            <>
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>AI Preview</CardTitle>
                </CardHeader>

                {aiResult.thumbnailStyle && !imagePreview ? (
                  <div
                    className="mb-4 flex aspect-video items-center justify-center rounded-stitch-md text-6xl"
                    style={{
                      background: `linear-gradient(135deg, ${aiResult.thumbnailStyle.gradientFrom}, ${aiResult.thumbnailStyle.gradientTo})`,
                    }}
                  >
                    {aiResult.thumbnailStyle.emoji}
                  </div>
                ) : null}

                <p className="text-sm leading-relaxed text-stitch-ink">
                  {aiResult.aiDescription}
                </p>
                <p className="mt-2 text-xs text-stitch-muted">{aiResult.previewText}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {aiResult.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StitchIcon name="globe" tone="teal" size={20} />
                    Translations
                  </CardTitle>
                </CardHeader>
                <ul className="space-y-3">
                  {aiResult.languages.map((lang) => (
                    <li key={lang.language} className="border-b border-stitch-border pb-3 last:border-0">
                      <p className="text-xs font-semibold text-stitch-coral">
                        {lang.languageLabel}
                      </p>
                      <p className="text-sm font-medium">{lang.title}</p>
                      <p className="text-xs text-stitch-muted">{lang.description}</p>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card
                padding="lg"
                className={
                  aiResult.duplicateScore >= 60
                    ? "border-stitch-gold bg-stitch-peach/30"
                    : "border-stitch-teal bg-stitch-mint/30"
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StitchIcon name="scan" tone="coral" size={20} />
                    Duplicate Detection
                  </CardTitle>
                </CardHeader>
                <p className="text-2xl font-bold text-stitch-ink">
                  {aiResult.duplicateScore}%
                  <span className="ml-2 text-sm font-normal text-stitch-muted">
                    similarity score
                  </span>
                </p>
                <p className="mt-2 text-sm text-stitch-muted">{aiResult.duplicateNote}</p>
              </Card>

              <Button
                onClick={() => void publishListing()}
                disabled={publishing}
                className="w-full"
              >
                {publishing ? "Publishing…" : "Publish to Marketplace"}
              </Button>
            </>
          ) : (
            <Card padding="lg" className="bg-stitch-cream/50">
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <StitchIcon name="sparkles" tone="coral" size={40} />
                <p className="text-sm text-stitch-muted">
                  Fill in your pattern and click Process with AI to generate your listing preview.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
