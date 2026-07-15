import Link from "next/link";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { QUICK_NAV_ITEMS } from "@/lib/quick-navigation";
import { cn } from "@/lib/utils";

type QuickNavigationGridProps = {
  showViewAll?: boolean;
  viewAllHref?: string;
};

export function QuickNavigationGrid({
  showViewAll = true,
  viewAllHref = "/",
}: QuickNavigationGridProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-stitch-ink">
          Quick navigation
          <StitchIcon name="sparkles" tone="gold" size={18} />
        </h3>
        {showViewAll ? (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-medium text-stitch-coral hover:underline"
          >
            View all
            <StitchIcon name="arrow-right" tone="coral" size={16} />
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {QUICK_NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block min-w-0"
            aria-label={`${item.label} — ${item.description}`}
          >
            <article className="flex h-full min-h-[148px] flex-col overflow-hidden rounded-stitch-lg border border-stitch-border bg-stitch-paper shadow-stitch-card transition-transform hover:-translate-y-0.5 hover:shadow-stitch-floating">
              <div
                className={cn(
                  "flex h-20 items-center justify-center border-b border-stitch-border/60",
                  item.bgClass,
                )}
              >
                <StitchIcon name={item.icon} tone={item.iconTone} size={36} />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h4 className="font-semibold text-stitch-ink">{item.label}</h4>
                <p className="mt-1 flex-1 text-sm leading-snug text-stitch-muted">
                  {item.description}
                </p>
                <div className="mt-3 flex justify-end">
                  <span
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:scale-105",
                      item.buttonClass,
                    )}
                    aria-hidden
                  >
                    <StitchIcon
                      name="arrow-right"
                      size={16}
                      className={
                        item.buttonClass.includes("gold")
                          ? "[filter:brightness(0)_saturate(100%)_invert(18%)_sepia(8%)_saturate(1018%)_hue-rotate(349deg)_brightness(95%)_contrast(92%)]"
                          : "brightness-0 invert"
                      }
                    />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
