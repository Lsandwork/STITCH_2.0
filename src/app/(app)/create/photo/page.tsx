"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { photoPatternInputSchema } from "@/services/photoPatternService";
import type { PhotoPatternInput, PhotoPatternResult } from "@/services/photoPatternService";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { getSubscriptionTier } from "@/lib/demo-session";

export default function PhotoPatternPage() {
  const tier = getSubscriptionTier();
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PhotoPatternResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<PhotoPatternInput>({
    resolver: zodResolver(photoPatternInputSchema) as Resolver<PhotoPatternInput>,
    defaultValues: { skillLevel: "intermediate", terminology: "us" },
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setValue("imageDataUrl", dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: PhotoPatternInput) {
    setError(null);
    try {
      const response = await fetch("/api/ai/photo-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Generation failed");
      setResult(payload.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <>
      <PageHeading
        title="Photo to Pattern"
        description="Upload a plushie or project photo for an approximate reconstruction."
        backHref="/create"
      />

      <FeatureGate tier={tier} feature="photo_to_pattern">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <label className="block text-sm font-medium">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm"
                />
              </label>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Upload preview" className="max-h-48 rounded-stitch-md object-cover" />
              ) : null}
              <label className="block text-sm font-medium">
                Notes (optional)
                <textarea
                  className="mt-1.5 w-full rounded-stitch-md border border-stitch-border px-4 py-3 text-sm"
                  rows={3}
                  placeholder="Long body, floppy ears, cream snout…"
                  {...register("description")}
                />
              </label>
              <Button type="submit" disabled={isSubmitting || !preview} className="w-full">
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
