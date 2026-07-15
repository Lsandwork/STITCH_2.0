"use client";

import { useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { useSubscription } from "@/components/providers/SubscriptionProvider";
import type { ColorPaletteResult } from "@/services/colorPaletteService";

const MOODS = ["cozy", "playful", "earthy"] as const;

export default function ColorStudioPage() {
  const { featureTier, lifetimeAccess } = useSubscription();
  const [mood, setMood] = useState<(typeof MOODS)[number]>("cozy");
  const [palette, setPalette] = useState<ColorPaletteResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function generatePalette() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, count: 5 }),
      });
      const payload = await response.json();
      if (response.ok) setPalette(payload.palette);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Color Studio"
        description="Build yarn palettes for your next project."
        backHref="/create"
      />

      <FeatureGate
        tier={featureTier}
        feature="color_studio"
        hideUpgradePrompt={lifetimeAccess}
      >
        <Card padding="lg" className="max-w-2xl">
          <p className="mb-3 text-sm font-medium">Choose a mood</p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`rounded-stitch-pill border px-4 py-2 text-sm capitalize ${
                  mood === m
                    ? "border-stitch-coral bg-stitch-peach text-stitch-coral"
                    : "border-stitch-border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <Button onClick={generatePalette} className="mt-4" disabled={loading}>
            Generate palette
          </Button>
        </Card>

        {loading ? <LoadingState label="Mixing colors…" /> : null}

        {palette ? (
          <Card padding="lg" className="mt-6 max-w-2xl">
            <h3 className="font-semibold">{palette.name}</h3>
            <p className="text-sm text-stitch-muted">
              Contrast score: {palette.contrastScore}/100
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {palette.swatches.map((swatch) => (
                <div key={swatch.hex} className="text-center">
                  <div
                    className="mx-auto h-16 w-16 rounded-full border border-stitch-border"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <p className="mt-2 text-xs font-medium">{swatch.name}</p>
                  <p className="text-[11px] text-stitch-muted">{swatch.hex}</p>
                </div>
              ))}
            </div>
            <Button href="/create/pattern" variant="secondary" className="mt-4">
              Use in pattern generator
            </Button>
          </Card>
        ) : null}
      </FeatureGate>
    </>
  );
}
