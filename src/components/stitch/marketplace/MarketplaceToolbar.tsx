"use client";

import { StitchIcon } from "@/components/stitch/StitchIcon";
import { MarketplaceFilters } from "@/components/stitch/marketplace/MarketplaceFilters";
import {
  MARKETPLACE_SORT_OPTIONS,
  type MarketplaceFilterState,
} from "@/lib/marketplace-filters";
import { cn } from "@/lib/utils";

type MarketplaceToolbarProps = {
  filters: MarketplaceFilterState;
  filtersOpen: boolean;
  activeFilterCount: number;
  onSearchChange: (value: string) => void;
  onSortChange: (value: MarketplaceFilterState["sort"]) => void;
  onFiltersToggle: () => void;
  onFiltersClose: () => void;
  onFiltersChange: (patch: Partial<MarketplaceFilterState>) => void;
  onFiltersClear: () => void;
};

export function MarketplaceToolbar({
  filters,
  filtersOpen,
  activeFilterCount,
  onSearchChange,
  onSortChange,
  onFiltersToggle,
  onFiltersClose,
  onFiltersChange,
  onFiltersClear,
}: MarketplaceToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <label htmlFor="marketplace-search" className="sr-only">
          Search patterns
        </label>
        <StitchIcon
          name="search"
          tone="muted"
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
        />
        <input
          id="marketplace-search"
          type="search"
          placeholder="Search patterns, designers, tags..."
          value={filters.search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-11 w-full rounded-stitch-md border border-stitch-border bg-stitch-paper py-2.5 pl-10 pr-4 text-sm text-stitch-ink shadow-stitch-card placeholder:text-stitch-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral"
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <label htmlFor="marketplace-sort" className="sr-only">
          Sort patterns
        </label>
        <select
          id="marketplace-sort"
          value={filters.sort}
          onChange={(event) =>
            onSortChange(event.target.value as MarketplaceFilterState["sort"])
          }
          className="h-11 min-w-[148px] rounded-stitch-md border border-stitch-border bg-stitch-paper px-3 py-2.5 text-sm text-stitch-ink shadow-stitch-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral"
        >
          {MARKETPLACE_SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="relative">
          <button
            type="button"
            onClick={onFiltersToggle}
            aria-expanded={filtersOpen}
            aria-haspopup="dialog"
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-stitch-md border border-stitch-border bg-stitch-paper px-4 text-sm font-medium text-stitch-ink shadow-stitch-card transition-colors hover:border-stitch-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stitch-coral",
              filtersOpen && "border-stitch-coral bg-stitch-peach/60",
            )}
          >
            <StitchIcon name="filter" tone="muted" size={18} />
            Filters
            {activeFilterCount > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-stitch-coral px-1 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          <MarketplaceFilters
            open={filtersOpen}
            filters={filters}
            activeCount={activeFilterCount}
            onClose={onFiltersClose}
            onChange={onFiltersChange}
            onClear={onFiltersClear}
          />
        </div>
      </div>
    </div>
  );
}
