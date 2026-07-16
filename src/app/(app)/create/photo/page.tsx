"use client";

import { useState } from "react";
import type { PhotoPatternResult } from "@/services/photoPatternService";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { useSubscription } from "@/components/providers/SubscriptionProvider";

async function compressImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.82,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not read that image."));
      img.src = objectUrl;
    });

    const scale = Math.min(
      1,
      maxDimension / Math.max(image.width, image.height, 1),
    );
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not prepare image for upload.");
    }
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function PhotoPatternPage() {
  const { featureTier, lifetimeAccess } = useSubscription();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [skillLevel, setSkillLevel] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");
  const [terminology, setTerminology] = useState<"us" | "uk">("us");
  const [result, setResult] = useState<PhotoPatternResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file);
      setPreview(dataUrl);
      setImageDataUrl(dataUrl);
    } catch (err) {
      setPreview(null);
      setImageDataUrl(null);
      setError(err instanceof Error ? err.message : "Could not load that image.");
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!imageDataUrl) {
      setError("Upload a photo to generate a pattern.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ai/photo-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl,
          description: description.trim() || undefined,
          skillLevel,
          terminology,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        result?: PhotoPatternResult;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Generation failed");
      }
      if (!payload.result) {
        throw new Error("The server returned an empty pattern.");
      }
      setResult(payload.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your pattern.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Photo to Pattern"
        description="Upload a plushie or project photo for an approximate reconstruction."
        backHref="/create"
      />

      <FeatureGate
        tier={featureTier}
        feature="photo_to_pattern"
        hideUpgradePrompt={lifetimeAccess}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block text-sm font-medium">
                Upload photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm"
                />
              </label>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Upload preview"
                  className="max-h-48 rounded-stitch-md object-cover"
                />
              ) : null}
              <label className="block text-sm font-medium">
                Notes (optional)
                <textarea
                  className="mt-1.5 w-full rounded-stitch-md border border-stitch-border px-4 py-3 text-sm"
                  rows={3}
                  placeholder="Long body, floppy ears, cream snout…"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium">
                Skill level
                <select
                  className="mt-1.5 w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-2.5 text-sm"
                  value={skillLevel}
                  onChange={(event) =>
                    setSkillLevel(
                      event.target.value as "beginner" | "intermediate" | "advanced",
                    )
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Terminology
                <select
                  className="mt-1.5 w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-2.5 text-sm"
                  value={terminology}
                  onChange={(event) =>
                    setTerminology(event.target.value as "us" | "uk")
                  }
                >
                  <option value="us">US</option>
                  <option value="uk">UK</option>
                </select>
              </label>
              <Button
                type="submit"
                disabled={isSubmitting || !imageDataUrl}
                className="w-full"
              >
                Generate from photo
              </Button>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
            </form>
          </Card>

          <div>
            {isSubmitting ? <LoadingState label="Analyzing photo…" /> : null}
            {result ? (
              <Card padding="lg">
                <CardHeader>
                  <CardTitle>{result.pattern.title}</CardTitle>
                </CardHeader>
                <p className="text-xs text-stitch-muted">{result.disclaimer}</p>
                <p className="mt-3 text-sm">
                  Confidence: {Math.round(result.confidence * 100)}%
                </p>
                <Button href="/patterns" className="mt-4">
                  Save to patterns
                </Button>
              </Card>
            ) : null}
          </div>
        </div>
      </FeatureGate>
    </>
  );
}
