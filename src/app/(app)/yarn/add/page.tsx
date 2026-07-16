"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { yarnInventoryInputSchema, type YarnInventoryInput } from "@/lib/schemas/yarn";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AddYarnPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<YarnInventoryInput>({
    resolver: zodResolver(yarnInventoryInputSchema) as Resolver<YarnInventoryInput>,
    defaultValues: { quantitySkeins: 1 },
  });

  async function onSubmit(data: YarnInventoryInput) {
    setError(null);
    try {
      const response = await fetch("/api/yarn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save yarn to your vault.");
      }
      router.push("/yarn");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save yarn to your vault.");
    }
  }

  return (
    <>
      <PageHeading title="Add Yarn" description="Track a new yarn in your vault." backHref="/yarn" />
      <Card padding="lg" className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Yarn name" error={errors.name?.message} {...register("name")} />
          <Input label="Brand" {...register("brand")} />
          <Input label="Color name" {...register("colorName")} />
          <Input label="Color hex (optional)" placeholder="#AABBCC" {...register("colorHex")} />
          <Input label="Weight" placeholder="worsted, dk…" {...register("weight")} />
          <Input label="Fiber content" {...register("fiberContent")} />
          <Input label="Recommended hook" {...register("recommendedHook")} />
          <Input
            label="Quantity (skeins)"
            type="number"
            step="0.5"
            error={errors.quantitySkeins?.message}
            {...register("quantitySkeins", { valueAsNumber: true })}
          />
          <Input
            label="Yardage per skein (optional)"
            type="number"
            step="1"
            {...register("yardage", { valueAsNumber: true })}
          />
          <textarea
            className="w-full rounded-stitch-md border border-stitch-border px-4 py-3 text-sm"
            rows={3}
            placeholder="Notes (optional)"
            {...register("notes")}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving…" : "Save to vault"}
          </Button>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </form>
      </Card>
    </>
  );
}
