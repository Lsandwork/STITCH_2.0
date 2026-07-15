"use client";

import { useCallback, useRef, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { useSubscription } from "@/components/providers/SubscriptionProvider";

export default function VisionLivePage() {
  const { featureTier, lifetimeAccess } = useSubscription();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) videoRef.current.srcObject = media;
      setStream(media);
    } catch {
      setResult("Camera access denied. Try Scan My Work with a photo instead.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);

  async function analyzeFrame() {
    if (!videoRef.current) return;
    setLoading(true);
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);

    try {
      const response = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanType: "stitch_check", imageDataUrl }),
      });
      const payload = await response.json();
      setResult(payload.result?.summary ?? "Analysis complete.");
    } catch {
      setResult("Live analysis unavailable offline.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Live Stitch Check"
        description="Point your camera at your work for real-time feedback."
        backHref="/vision"
      />
      <FeatureGate
        tier={featureTier}
        feature="camera_analysis"
        hideUpgradePrompt={lifetimeAccess}
      >
        <Card padding="lg" className="max-w-2xl">
          <div className="overflow-hidden rounded-stitch-lg bg-stitch-ink/5">
            <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full object-cover" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {!stream ? (
              <Button onClick={startCamera}>Start camera</Button>
            ) : (
              <>
                <Button onClick={analyzeFrame} disabled={loading}>
                  Analyze now
                </Button>
                <Button variant="secondary" onClick={stopCamera}>
                  Stop
                </Button>
              </>
            )}
            <Button href="/vision/scan" variant="ghost">
              Use photo scan instead
            </Button>
          </div>
          {loading ? <LoadingState label="Checking stitches…" /> : null}
          {result ? (
            <p className="mt-4 rounded-stitch-md bg-stitch-cream px-4 py-3 text-sm">{result}</p>
          ) : null}
        </Card>
      </FeatureGate>
    </>
  );
}
