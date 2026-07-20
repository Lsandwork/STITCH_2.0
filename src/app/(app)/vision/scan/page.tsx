"use client";

import { useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/ui/LoadingState";
import { useSubscription } from "@/components/providers/SubscriptionProvider";
import { compressImageFile } from "@/lib/ai-image-compress";
import type { VisionScanResult } from "@/lib/schemas/vision";

export default function VisionScanPage() {
  const { featureTier, lifetimeAccess } = useSubscription();
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<VisionScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const dataUrl = await compressImageFile(file, 1280, 0.82);
      setPreview(dataUrl);
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : "Could not load that image.");
    }
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
          currentRow: 24,
        }),
      });
      const payload = (await response.json()) as {
        result?: VisionScanResult;
        error?: string;
        demoMode?: boolean;
      };

      setDemoMode(
        Boolean(payload.demoMode) || payload.result?.analysisSource === "mock",
      );

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
      <FeatureGate
        tier={featureTier}
        feature="camera_analysis"
        hideUpgradePrompt={lifetimeAccess}
      >
        <Card padding="lg" className="max-w-2xl">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(event) => void handleFile(event)}
          />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Scan preview"
              className="mt-4 max-h-80 w-full rounded-stitch-md object-contain"
            />
          ) : null}
          <Button
            onClick={() => void runScan()}
            disabled={!preview || loading}
            className="mt-4"
          >
            Run scan
          </Button>
          {loading ? <LoadingState label="Analyzing your crochet work…" /> : null}
          {demoMode ? (
            <p className="mt-4 rounded-stitch-md border border-stitch-gold/40 bg-stitch-peach/50 px-4 py-2 text-sm">
              Demo mode — AI API keys are missing on this deployment, so analysis
              is approximate.
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
                {result.analysisSource === "ai" ? (
                  <Badge>Live AI</Badge>
                ) : null}
                {result.detectedStitchType ? (
                  <Badge>{result.detectedStitchType}</Badge>
                ) : null}
              </div>
              {result.summary ? (
                <p className="text-sm text-stitch-ink">{result.summary}</p>
              ) : null}
              {result.estimatedRowNumber ? (
                <p className="text-sm text-stitch-muted">
                  Estimated row/round: {result.estimatedRowNumber}
                </p>
              ) : null}
              {result.findings.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {result.findings.map((finding) => (
                    <li key={`${finding.type}-${finding.description}`}>
                      <span className="font-medium capitalize">
                        {finding.severity}:
                      </span>{" "}
                      {finding.description}
                    </li>
                  ))}
                </ul>
              ) : null}
              {result.suggestedCorrections.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-stitch-ink">
                    Suggested next steps
                  </p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-stitch-muted">
                    {result.suggestedCorrections.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </Card>
      </FeatureGate>
    </>
  );
}
