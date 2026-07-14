"use client";

import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { yarnInventoryInputSchema, type YarnInventoryInput } from "@/lib/schemas/yarn";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AddYarnPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<YarnInventoryInput>({
    resolver: zodResolver(yarnInventoryInputSchema) as Resolver<YarnInventoryInput>,
    defaultValues: { quantitySkeins: 1 },
  });

  function onSubmit(data: YarnInventoryInput) {
    const key = "stitch-yarn-vault";
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
    existing.unshift({ ...data, id: crypto.randomUUID(), addedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(existing));
    router.push("/yarn");
  }

  return (
    <>
      <PageHeading title="Add Yarn" description="Track a new yarn in your vault." backHref="/yarn" />
      <Card padding="lg" className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Yarn name" error={errors.name?.message} {...register("name")} />
          <Input label="Brand" {...register("brand")} />
          <Input label="Color name" {...register("colorName")} />
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
          <Button type="submit" disabled={isSubmitting} className="w-full">
            Save to vault
          </Button>
        </form>
      </Card>
    </>
  );
}
