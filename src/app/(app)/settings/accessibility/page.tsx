"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  getOnboardingProfile,
  saveOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboarding-storage";

export default function AccessibilitySettingsPage() {
  const [settings, setSettings] = useState<OnboardingProfile["accessibility"]>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    voiceEnabled: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const profile = getOnboardingProfile();
    if (profile?.accessibility) setSettings(profile.accessibility);
  }, []);

  function save() {
    const existing = getOnboardingProfile();
    saveOnboardingProfile({
      displayName: existing?.displayName ?? "Crocheter",
      skillLevel: existing?.skillLevel ?? "beginner",
      terminology: existing?.terminology ?? "us",
      measurement: existing?.measurement ?? "imperial",
      handedness: existing?.handedness ?? "right",
      projectTypes: existing?.projectTypes ?? [],
      yarnWeights: existing?.yarnWeights ?? [],
      accessibility: settings,
      completedAt: new Date().toISOString(),
    });
    document.documentElement.classList.toggle("reduce-motion", settings.reducedMotion);
    document.documentElement.classList.toggle("large-text", settings.largeText);
    setSaved(true);
  }

  return (
    <>
      <PageHeading title="Accessibility" description="Customize motion, text, and voice preferences." backHref="/settings" />
      <Card padding="lg" className="max-w-lg space-y-4">
        {(
          [
            ["reducedMotion", "Reduce motion"],
            ["highContrast", "High contrast"],
            ["largeText", "Larger text"],
            ["voiceEnabled", "Voice assistant enabled"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={settings[key]}
              onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.checked }))}
            />
            {label}
          </label>
        ))}
        <Button onClick={save}>{saved ? "Saved!" : "Save preferences"}</Button>
      </Card>
    </>
  );
}
