import { StitchIcon } from "@/components/stitch/StitchIcon";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: "image",
    title: "AI Thumbnails",
    description: "Auto-generated preview art",
    iconClass: "bg-stitch-rose text-stitch-coral",
  },
  {
    icon: "sparkles",
    title: "Smart Descriptions",
    description: "Marketing copy in seconds",
    iconClass: "bg-stitch-mint text-stitch-teal",
  },
  {
    icon: "globe",
    title: "Translations",
    description: "5+ languages instantly",
    iconClass: "bg-purple-50 text-stitch-lavender",
  },
  {
    icon: "scan",
    title: "Duplicate Detection",
    description: "Protect original designers",
    iconClass: "bg-amber-50 text-stitch-gold",
  },
] as const;

export function MarketplaceFeatureCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {FEATURES.map((feature) => (
        <article
          key={feature.title}
          className="flex min-h-[92px] items-start gap-3 rounded-stitch-lg border border-stitch-border bg-stitch-paper p-4 shadow-stitch-card"
        >
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-stitch-md",
              feature.iconClass,
            )}
          >
            <StitchIcon
              name={feature.icon}
              tone={
                feature.icon === "sparkles"
                  ? "teal"
                  : feature.icon === "globe"
                    ? "gold"
                    : "coral"
              }
              size={20}
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-stitch-ink">{feature.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-stitch-muted">
              {feature.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
