"use client";

import { MARKETPLACE_CATEGORIES } from "@/lib/marketplace-filters";
import { cn } from "@/lib/utils";

type MarketplaceCategoryChipsProps = {
  activeCategory: string;
  onChange: (categoryId: string) => void;
};

export function MarketplaceCategoryChips({
  activeCategory,
  onChange,
}: MarketplaceCategoryChipsProps) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className="flex min-w-max gap-2"
        role="tablist"
        aria-label="Pattern categories"
      >
        {MARKETPLACE_CATEGORIES.map((category) => {
          const active = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(category.id)}
              className={cn(
                "rounded-stitch-pill px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral",
                active
                  ? "bg-stitch-coral text-white shadow-sm"
                  : "border border-stitch-border bg-stitch-paper text-stitch-muted hover:border-stitch-coral hover:text-stitch-ink",
              )}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
