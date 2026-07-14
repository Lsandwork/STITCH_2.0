"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patternGenerationInputSchema } from "@/lib/schemas/pattern";
import type { PatternGenerationInputSchema, PatternGenerationResultSchema } from "@/lib/schemas/pattern";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { Badge } from "@/components/ui/Badge";
import { getSubscriptionTier } from "@/lib/demo-session";

export default function PatternGeneratorPage() {
  const tier = getSubscriptionTier();
  const [result, setResult] = useState<PatternGenerationResultSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatternGenerationInputSchema>({
    resolver: zodResolver(patternGenerationInputSchema) as Resolver<PatternGenerationInputSchema>,
    defaultValues: {
      description: "A long-bodied dachshund plushie with floppy ears and a cream snout.",
      projectType: "amigurumi",
      skillLevel: "intermediate",
      terminology: "us",
      instructionFormat: "written",
      handedness: "right",
      yarnWeight: "worsted",
      hookSize: "4.0mm",
    },
  });

  async function onSubmit(data: PatternGenerationInputSchema) {
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/ai/pattern", {
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

  function savePattern() {
    if (!result) return;
    const key = "stitch-saved-patterns";
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
    existing.unshift({ ...result, savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
    setSaved(true);
  }

  return (
    <>
      <PageHeading
        title="AI Pattern Generator"
        description="Describe your project and Stitch will draft a structured pattern."
        backHref="/create"
      />

      <FeatureGate tier={tier} feature="ai_pattern_generation">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <label className="block text-sm font-medium">
                Project description
                <textarea
                  className="mt-1.5 w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-3 text-sm"
                  rows={4}
                  {...register("description")}
                />
                {errors.description ? (
                  <span className="text-xs text-red-500">{errors.description.message}</span>
                ) : null}
              </label>

              <Input label="Project type" error={errors.projectType?.message} {...register("projectType")} />
              <Input label="Hook size" {...register("hookSize")} />
              <Input label="Yarn weight" {...register("yarnWeight")} />

              <label className="block text-sm font-medium">
                Skill level
                <select
                  className="mt-1.5 w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 py-2.5 text-sm"
                  {...register("skillLevel")}
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
                  {...register("terminology")}
                >
                  <option value="us">US</option>
                  <option value="uk">UK</option>
                </select>
              </label>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Generating…" : "Generate pattern"}
              </Button>
              {error ? <p className="text-sm text-red-500">{error}</p> : null}
            </form>
          </Card>

          <div>
            {isSubmitting ? <LoadingState label="Stitching your pattern…" /> : null}
            {result ? (
              <Card padding="lg" className="space-y-4">
                <CardHeader>
                  <CardTitle>{result.pattern.title}</CardTitle>
                  <Badge variant="teal">{result.pattern.skillLevel}</Badge>
                </CardHeader>
                {result.pattern.description ? (
                  <p className="text-sm text-stitch-muted">{result.pattern.description}</p>
                ) : null}
                {result.pattern.sections.map((section) => (
                  <div key={section.name}>
                    <h4 className="font-semibold text-stitch-ink">{section.name}</h4>
                    <ol className="mt-2 space-y-1 text-sm">
                      {section.rows.slice(0, 8).map((row) => (
                        <li key={row.rowNumber} className="font-mono text-stitch-ink">
                          R{row.rowNumber}: {row.instruction}
                          {row.stitchCount !== null ? ` (${row.stitchCount})` : ""}
                        </li>
                      ))}
                    </ol>
                    {section.rows.length > 8 ? (
                      <p className="mt-1 text-xs text-stitch-muted">
                        + {section.rows.length - 8} more rows
                      </p>
                    ) : null}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button onClick={savePattern}>{saved ? "Saved!" : "Save pattern"}</Button>
                  <Button href="/patterns" variant="secondary">
                    View saved
                  </Button>
                </div>
              </Card>
            ) : !isSubmitting ? (
              <Card className="text-center text-sm text-stitch-muted">
                Your generated pattern will appear here.
              </Card>
            ) : null}
          </div>
        </div>
      </FeatureGate>
    </>
  );
}
