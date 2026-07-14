"use client";

import { useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingState";
import { getSubscriptionTier } from "@/lib/demo-session";
import type { VisionScanResult } from "@/lib/schemas/vision";

export default function VisionScanPage() {
  const tier = getSubscriptionTier();
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<VisionScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function runScan() {
    if (!preview) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanType: "stitch_check",
          imageDataUrl: preview,
          projectId: "demo-dachshund",
          currentRow: 24,
        }),
      });
      const payload = (await response.json()) as {
        result?: VisionScanResult;
        error?: string;
        demoMode?: boolean;
      };

      setDemoMode(Boolean(payload.demoMode));

      if (!response.ok) {
        throw new Error(payload.error ?? "Scan failed");
      }

      setResult(payload.result ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Scan My Work"
        description="Upload or capture a photo for AI stitch analysis."
        backHref="/vision"
      />
      <FeatureGate tier={tier} feature="camera_analysis">
        <Card padding="lg" className="max-w-2xl">
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Scan preview"
              className="mt-4 max-h-80 w-full rounded-stitch-md object-contain"
            />
          ) : null}
          <Button onClick={runScan} disabled={!preview || loading} className="mt-4">
            Run scan
          </Button>
          {loading ? <LoadingState label="Analyzing your crochet work…" /> : null}
          {demoMode ? (
            <p className="mt-4 rounded-stitch-md border border-stitch-gold/40 bg-stitch-peach/50 px-4 py-2 text-sm">
              Demo mode — add an AI API key for live photo analysis.
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 text-sm text-stitch-coral-dark" role="alert">
              {error}
            </p>
          ) : null}
          {result ? (
            <div className="mt-6 space-y-4 rounded-stitch-md border border-stitch-border bg-stitch-cream p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-stitch-ink">Scan results</h3>
                <Badge>
                  {Math.round(result.confidence * 100)}% confidence
                </Badge>
                {result.detectedStitchType ? (
                  <Badge>{result.detectedStitchType}</Badge>
                ) : null}
              </div>
              {result.summary ? (
                <p className="text-sm text-stitch-ink">{result.summary}</p>
              ) : null}
              {result.estimatedRowNumber ? (
                <p className="text-sm text-stitch-muted">
                  Estimated row: {result.estimatedRowNumber}
                  {result.estimatedStitchCount
                    ? ` · ~${result.estimatedStitchCount} stitches`
                    : ""}
                </p>
              ) : null}
              {result.findings.length ? (
                <ul className="space-y-2 text-sm">
                  {result.findings.map((finding, index) => (
                    <li
                      key={`${finding.type}-${index}`}
                      className="rounded-stitch-sm bg-stitch-paper px-3 py-2"
                    >
                      <span className="font-medium">{finding.type}: </span>
                      {finding.description}
                    </li>
                  ))}
                </ul>
              ) : null}
              {result.suggestedCorrections.length ? (
                <div>
                  <p className="mb-2 text-sm font-semibold">Suggested corrections</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-stitch-muted">
                    {result.suggestedCorrections.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
          <Button href="/vision/history" variant="secondary" className="mt-4">
            View scan history
          </Button>
        </Card>
      </FeatureGate>
    </>
  );
}
