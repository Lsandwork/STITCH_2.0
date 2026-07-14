import Image from "next/image";
import Link from "next/link";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { QUICK_NAV_ITEMS } from "@/lib/quick-navigation";

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block min-w-0 overflow-hidden rounded-stitch-lg shadow-stitch-card transition-transform hover:-translate-y-0.5 hover:shadow-stitch-floating"
            aria-label={`${item.label} — ${item.description}`}
          >
            <div className="relative aspect-[888/216] w-full bg-stitch-paper">
              <Image
                src={item.image}
                alt={`${item.label} — ${item.description}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
