"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  PROJECT_TYPE_OPTIONS,
  YARN_WEIGHT_OPTIONS,
  saveOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboarding-storage";
import { cn } from "@/lib/utils";

const STEPS = [
  "name",
  "skill",
  "region",
  "measurement",
  "handedness",
  "projects",
  "accessibility",
  "yarn",
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<Partial<OnboardingProfile>>({
    skillLevel: "beginner",
    terminology: "us",
    measurement: "imperial",
    handedness: "right",
    projectTypes: [],
    yarnWeights: [],
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      voiceEnabled: true,
    },
  });

  const step = STEPS[stepIndex];

  function next() {
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
    else finish();
  }

  function back() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  function finish() {
    const completed: OnboardingProfile = {
      displayName: profile.displayName ?? "Crocheter",
      skillLevel: profile.skillLevel ?? "beginner",
      terminology: profile.terminology ?? "us",
      measurement: profile.measurement ?? "imperial",
      handedness: profile.handedness ?? "right",
      projectTypes: profile.projectTypes ?? [],
      accessibility: profile.accessibility ?? {
        reducedMotion: false,
        highContrast: false,
        largeText: false,
        voiceEnabled: true,
      },
      yarnWeights: profile.yarnWeights ?? [],
      completedAt: new Date().toISOString(),
    };
    saveOnboardingProfile(completed);
    router.push("/");
  }

  function toggleProjectType(type: string) {
    setProfile((prev) => {
      const current = prev.projectTypes ?? [];
      return {
        ...prev,
        projectTypes: current.includes(type)
          ? current.filter((t) => t !== type)
          : [...current, type],
      };
    });
  }

  function toggleYarnWeight(weight: string) {
    setProfile((prev) => {
      const current = prev.yarnWeights ?? [];
      return {
        ...prev,
        yarnWeights: current.includes(weight)
          ? current.filter((w) => w !== weight)
          : [...current, weight],
      };
    });
  }

  return (
    <div className="min-h-dvh bg-stitch-cream px-4 py-10">
      <div className="mx-auto max-w-lg">
        <PageHeading
          title="Welcome to Stitch"
          description={`Step ${stepIndex + 1} of ${STEPS.length}`}
        />

        <div className="mb-6 flex gap-1">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i <= stepIndex ? "bg-stitch-coral" : "bg-stitch-border",
              )}
            />
          ))}
        </div>

        <Card padding="lg">
          {step === "name" ? (
            <Input
              label="What should we call you?"
              value={profile.displayName ?? ""}
              onChange={(e) =>
                setProfile((p) => ({ ...p, displayName: e.target.value }))
              }
              placeholder="Emma"
            />
          ) : null}

          {step === "skill" ? (
            <fieldset className="space-y-2">
              <legend className="mb-3 text-sm font-medium">Skill level</legend>
              {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                <label key={level} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="skill"
                    checked={profile.skillLevel === level}
                    onChange={() => setProfile((p) => ({ ...p, skillLevel: level }))}
                  />
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </label>
              ))}
            </fieldset>
          ) : null}

          {step === "region" ? (
            <fieldset className="space-y-2">
              <legend className="mb-3 text-sm font-medium">Pattern terminology</legend>
              {(["us", "uk"] as const).map((term) => (
                <label key={term} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="terminology"
                    checked={profile.terminology === term}
                    onChange={() => setProfile((p) => ({ ...p, terminology: term }))}
                  />
                  {term.toUpperCase()} terms
                </label>
              ))}
            </fieldset>
          ) : null}

          {step === "measurement" ? (
            <fieldset className="space-y-2">
              <legend className="mb-3 text-sm font-medium">Measurements</legend>
              {(["imperial", "metric"] as const).map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="measurement"
                    checked={profile.measurement === m}
                    onChange={() => setProfile((p) => ({ ...p, measurement: m }))}
                  />
                  {m === "imperial" ? "Inches / yards" : "Centimeters / meters"}
                </label>
              ))}
            </fieldset>
          ) : null}

          {step === "handedness" ? (
            <fieldset className="space-y-2">
              <legend className="mb-3 text-sm font-medium">Dominant hand</legend>
              {(["right", "left"] as const).map((hand) => (
                <label key={hand} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="handedness"
                    checked={profile.handedness === hand}
                    onChange={() => setProfile((p) => ({ ...p, handedness: hand }))}
                  />
                  {hand.charAt(0).toUpperCase() + hand.slice(1)}-handed
                </label>
              ))}
            </fieldset>
          ) : null}

          {step === "projects" ? (
            <div>
              <p className="mb-3 text-sm font-medium">What do you like to make?</p>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPE_OPTIONS.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleProjectType(type)}
                    className={cn(
                      "rounded-stitch-pill border px-3 py-1.5 text-sm transition-colors",
                      profile.projectTypes?.includes(type)
                        ? "border-stitch-coral bg-stitch-peach text-stitch-coral"
                        : "border-stitch-border bg-stitch-paper",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === "accessibility" ? (
            <fieldset className="space-y-3">
              <legend className="mb-3 text-sm font-medium">Accessibility</legend>
              {(
                [
                  ["reducedMotion", "Reduce motion"],
                  ["highContrast", "High contrast"],
                  ["largeText", "Larger text"],
                  ["voiceEnabled", "Enable voice assistant"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={profile.accessibility?.[key] ?? false}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        accessibility: {
                          ...p.accessibility!,
                          [key]: e.target.checked,
                        },
                      }))
                    }
                  />
                  {label}
                </label>
              ))}
            </fieldset>
          ) : null}

          {step === "yarn" ? (
            <div>
              <p className="mb-3 text-sm font-medium">Preferred yarn weights</p>
              <div className="flex flex-wrap gap-2">
                {YARN_WEIGHT_OPTIONS.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => toggleYarnWeight(weight)}
                    className={cn(
                      "rounded-stitch-pill border px-3 py-1.5 text-sm capitalize transition-colors",
                      profile.yarnWeights?.includes(weight)
                        ? "border-stitch-teal bg-stitch-mint text-stitch-teal-dark"
                        : "border-stitch-border bg-stitch-paper",
                    )}
                  >
                    {weight.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex justify-between gap-3">
            <Button variant="ghost" onClick={back} disabled={stepIndex === 0}>
              Back
            </Button>
            <Button onClick={next}>
              {stepIndex === STEPS.length - 1 ? "Finish" : "Continue"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
