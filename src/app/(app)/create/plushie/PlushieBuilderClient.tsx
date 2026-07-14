"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { assetPath } from "@/lib/constants";
import { cn } from "@/lib/utils";

const BODY_OPTIONS = [
  { id: "dachshund", label: "Long body", image: "dachshund-plushie" },
  { id: "dino", label: "Dino", image: "dino-plushie" },
  { id: "frog", label: "Frog", image: "frog-prince" },
] as const;

const COLOR_OPTIONS = [
  { id: "coral", label: "Coral", image: "yarn-coral" },
  { id: "teal", label: "Teal", image: "yarn-teal" },
  { id: "gold", label: "Gold", image: "yarn-gold" },
  { id: "lavender", label: "Lavender", image: "yarn-lavender" },
] as const;

const FEATURE_OPTIONS = ["Floppy ears", "Safety eyes", "Embroidered face", "Bow tie"] as const;

export default function PlushieBuilderClient() {
  const searchParams = useSearchParams();
  const template = searchParams.get("template");

  const [body, setBody] = useState(
    template === "frog-prince" ? "frog" : "dachshund",
  );
  const [color, setColor] = useState("coral");
  const [features, setFeatures] = useState<string[]>(["Floppy ears"]);

  const previewImage = useMemo(() => {
    const bodyOpt = BODY_OPTIONS.find((b) => b.id === body);
    return assetPath.illustrationSvg(bodyOpt?.image ?? "dachshund-plushie");
  }, [body]);

  function toggleFeature(feature: string) {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature],
    );
  }

  const query = new URLSearchParams({
    body,
    color,
    features: features.join(","),
  }).toString();

  return (
    <>
      <PageHeading
        title="Plushie Builder"
        description="Customize your amigurumi and generate a pattern."
        backHref="/create"
        actionLabel="Generate pattern"
        actionHref={`/create/pattern?${query}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg" className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium">Body shape</p>
            <div className="grid grid-cols-3 gap-2">
              {BODY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBody(opt.id)}
                  className={cn(
                    "rounded-stitch-md border p-2 text-xs font-medium transition-colors",
                    body === opt.id
                      ? "border-stitch-coral bg-stitch-peach"
                      : "border-stitch-border",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Main color</p>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColor(opt.id)}
                  className={cn(
                    "overflow-hidden rounded-stitch-md border-2 transition-colors",
                    color === opt.id ? "border-stitch-coral" : "border-transparent",
                  )}
                >
                  <Image
                    src={assetPath.illustrationSvg(opt.image)}
                    alt={opt.label}
                    width={64}
                    height={64}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Features</p>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={cn(
                    "rounded-stitch-pill border px-3 py-1.5 text-sm",
                    features.includes(feature)
                      ? "border-stitch-teal bg-stitch-mint text-stitch-teal-dark"
                      : "border-stitch-border",
                  )}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card padding="lg" className="flex flex-col items-center">
          <p className="mb-4 text-sm font-medium text-stitch-muted">Live preview</p>
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-stitch-xl bg-stitch-cream">
            <Image
              src={previewImage}
              alt="Plushie preview"
              width={400}
              height={400}
              className="h-full w-full object-contain p-6"
            />
          </div>
          <p className="mt-4 text-center text-sm text-stitch-muted">
            {body} · {color} · {features.join(", ") || "No extras"}
          </p>
          <Button href={`/create/pattern?${query}`} className="mt-6 w-full max-w-sm">
            Generate pattern
          </Button>
        </Card>
      </div>
    </>
  );
}
