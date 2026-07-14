"use client";

import { useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { getSubscriptionTier } from "@/lib/demo-session";

export default function VisionScanPage() {
  const tier = getSubscriptionTier();
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function runScan() {
    if (!preview) return;
    setLoading(true);
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
      const payload = await response.json();
      setResult(payload.result ?? null);
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
        <Card padding="lg" className="max-w-xl">
          <input type="file" accept="image/*" capture="environment" onChange={handleFile} />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Scan preview" className="mt-4 max-h-64 rounded-stitch-md object-cover" />
          ) : null}
          <Button onClick={runScan} disabled={!preview || loading} className="mt-4">
            Run scan
          </Button>
          {loading ? <LoadingState label="Scanning…" /> : null}
          {result ? (
            <pre className="mt-4 overflow-x-auto rounded-stitch-md bg-stitch-cream p-4 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : null}
          <Button href="/vision/history" variant="secondary" className="mt-4">
            View scan history
          </Button>
        </Card>
      </FeatureGate>
    </>
  );
}
