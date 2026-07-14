"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  yarnSubstitutionInputSchema,
  type YarnSubstitutionInput,
  type YarnSubstitutionResult,
} from "@/lib/schemas/yarn";
import { PageHeading } from "@/components/stitch/PageHeading";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { getSubscriptionTier } from "@/lib/demo-session";

export default function YarnSubstitutePage() {
  const tier = getSubscriptionTier();
  const [result, setResult] = useState<YarnSubstitutionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<YarnSubstitutionInput>({
    resolver: zodResolver(yarnSubstitutionInputSchema),
    defaultValues: {
      sourceYarnName: "Bernat Velvet",
      requiredWeight: "worsted",
      requiredYardage: 180,
    },
  });

  async function onSubmit(data: YarnSubstitutionInput) {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/substitute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();
      if (response.ok) setResult(payload.result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Yarn Substitution"
        description="Find compatible yarns from your vault or recommendations."
        backHref="/yarn"
      />
      <FeatureGate tier={tier} feature="yarn_substitution">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Source yarn" {...register("sourceYarnName")} />
              <Input label="Required weight" {...register("requiredWeight")} />
              <Input
                label="Required yardage"
                type="number"
                {...register("requiredYardage", { valueAsNumber: true })}
              />
              <Button type="submit" disabled={loading}>
                Find substitutes
              </Button>
            </form>
          </Card>
          <div>
            {loading ? <LoadingState label="Comparing yarns…" /> : null}
            {result ? (
              <Card padding="lg" className="space-y-3">
                <h3 className="font-semibold">Matches for {result.sourceYarnName}</h3>
                {result.recommendations.map((rec) => (
                  <div key={rec.yarnName} className="rounded-stitch-md bg-stitch-cream p-3 text-sm">
                    <p className="font-medium">{rec.yarnName}</p>
                    <p className="text-stitch-muted">{rec.reasoning}</p>
                    <p className="mt-1 text-xs text-stitch-teal">
                      {rec.compatibilityScore}% compatible
                      {rec.inInventory ? " · In your vault" : ""}
                    </p>
                  </div>
                ))}
              </Card>
            ) : null}
          </div>
        </div>
      </FeatureGate>
    </>
  );
}
