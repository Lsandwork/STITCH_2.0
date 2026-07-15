"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { DEMO_USER } from "@/lib/demo-data";
import type { SocialAiRecommendationsResult } from "@/lib/schemas/social";

export function SocialAiPanel() {
  const [result, setResult] = useState<SocialAiRecommendationsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/social/ai/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skillLevel: DEMO_USER.skillLevel,
            interests: ["amigurumi", "market bags"],
            recentProjects: ["Dachshund Plushie", "Sunflower Bag"],
            followingCount: 2,
          }),
        });
        const payload = await response.json();
        if (response.ok) setResult(payload.result);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  if (loading) {
    return <LoadingState label="Finding projects, makers, and groups for you…" />;
  }

  if (!result) return null;

  return (
    <div className="space-y-4">
      <Card padding="lg" className="border-stitch-teal/20 bg-gradient-to-br from-stitch-mint/40 to-stitch-paper">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StitchIcon name="sparkles" tone="teal" size={22} />
            AI For You
          </CardTitle>
        </CardHeader>
        <p className="text-xs text-stitch-muted">
          Personalized suggestions based on your skill level and projects.
        </p>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Suggested projects</CardTitle>
        </CardHeader>
        <ul className="space-y-3">
          {result.projectSuggestions.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="block rounded-stitch-md p-2 transition-colors hover:bg-stitch-cream"
              >
                <p className="text-sm font-semibold text-stitch-ink">{item.title}</p>
                <p className="text-xs text-stitch-muted">{item.reason}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Maker matches</CardTitle>
        </CardHeader>
        <ul className="space-y-3">
          {result.makerMatches.map((maker) => (
            <li key={maker.makerId} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stitch-peach">
                <StitchIcon name="user" tone="coral" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {maker.displayName}{" "}
                  <span className="font-normal text-stitch-muted">{maker.handle}</span>
                </p>
                <p className="text-xs text-stitch-teal">{maker.matchScore}% match</p>
                <p className="text-xs text-stitch-muted">{maker.matchReason}</p>
              </div>
            </li>
          ))}
        </ul>
        <Button href="/social/discover" variant="secondary" size="sm" className="mt-3 w-full">
          Discover more makers
        </Button>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Pattern finds</CardTitle>
        </CardHeader>
        <ul className="space-y-2">
          {result.patternFinds.map((pattern) => (
            <li key={pattern.title}>
              <Link
                href={pattern.href}
                className="flex items-center gap-2 rounded-stitch-md p-2 text-sm transition-colors hover:bg-stitch-cream"
              >
                <StitchIcon name="star" tone="gold" size={16} />
                <div>
                  <p className="font-medium">{pattern.title}</p>
                  <p className="text-xs text-stitch-muted">{pattern.reason}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle className="text-base">Recommended groups</CardTitle>
        </CardHeader>
        <ul className="space-y-2">
          {result.groupRecommendations.map((group) => (
            <li key={group.groupId}>
              <Link
                href="/social/groups"
                className="block rounded-stitch-md p-2 transition-colors hover:bg-stitch-cream"
              >
                <p className="text-sm font-medium">{group.name}</p>
                <p className="text-xs text-stitch-muted">{group.reason}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
