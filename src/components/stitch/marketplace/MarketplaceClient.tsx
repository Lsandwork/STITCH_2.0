"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MarketplaceCardSkeleton } from "@/components/stitch/marketplace/MarketplaceCardSkeleton";
import { MarketplaceCategoryChips } from "@/components/stitch/marketplace/MarketplaceCategoryChips";
import { MarketplaceCTA } from "@/components/stitch/marketplace/MarketplaceCTA";
import { MarketplaceFeatureCards } from "@/components/stitch/marketplace/MarketplaceFeatureCards";
import { MarketplaceHero } from "@/components/stitch/marketplace/MarketplaceHero";
import { MarketplacePatternCard } from "@/components/stitch/marketplace/MarketplacePatternCard";
import { MarketplaceToolbar } from "@/components/stitch/marketplace/MarketplaceToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import {
  DEFAULT_MARKETPLACE_FILTERS,
  filterMarketplaceListings,
  parseMarketplaceCraftParam,
  type MarketplaceFilterState,
} from "@/lib/marketplace-filters";
import {
  fetchMarketplaceListings,
  fetchSavedMarketplaceIds,
} from "@/lib/marketplace-api";
import type { MarketplaceListing } from "@/lib/schemas/marketplace";

function countActiveFilters(filters: MarketplaceFilterState): number {
  let count = 0;
  if (filters.skillLevels.length > 0) count += 1;
  if (filters.maxPriceCents !== null) count += 1;
  if (filters.craft) count += 1;
  return count;
}

export function MarketplaceClient() {
  const searchParams = useSearchParams();
  const craftFromUrl = parseMarketplaceCraftParam(searchParams.get("craft"));

  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilterState>(() => ({
    ...DEFAULT_MARKETPLACE_FILTERS,
    craft: craftFromUrl,
  }));

  useEffect(() => {
    setFilters((current) =>
      current.craft === craftFromUrl
        ? current
        : { ...current, craft: craftFromUrl },
    );
  }, [craftFromUrl]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [nextListings, nextSaved] = await Promise.all([
          fetchMarketplaceListings(),
          fetchSavedMarketplaceIds(),
        ]);
        if (cancelled) return;
        setListings(nextListings);
        setSavedIds(nextSaved);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("We couldn't load marketplace patterns. Please try again.");
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => filterMarketplaceListings(listings, filters),
    [listings, filters],
  );

  const activeFilterCount = countActiveFilters(filters);

  function updateFilters(patch: Partial<MarketplaceFilterState>) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function clearAdvancedFilters() {
    updateFilters({ skillLevels: [], maxPriceCents: null, craft: null });
  }

  function handleSavedChange(listingId: string, saved: boolean) {
    setSavedIds((current) =>
      saved
        ? [...new Set([...current, listingId])]
        : current.filter((id) => id !== listingId),
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <MarketplaceHero />
        <EmptyState
          icon={<StitchIcon name="warning" tone="coral" size={24} />}
          title="Marketplace unavailable"
          description={error}
          actionLabel="Try again"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <MarketplaceHero />

      <MarketplaceFeatureCards />

      {filters.craft ? (
        <p className="text-sm text-stitch-muted">
          Showing{" "}
          <span className="font-medium text-stitch-ink">{filters.craft}</span>{" "}
          patterns.{" "}
          <button
            type="button"
            className="font-medium text-stitch-coral hover:underline"
            onClick={() => updateFilters({ craft: null })}
          >
            Clear craft filter
          </button>
        </p>
      ) : null}

      <MarketplaceToolbar
        filters={filters}
        filtersOpen={filtersOpen}
        activeFilterCount={activeFilterCount}
        onSearchChange={(search) => updateFilters({ search })}
        onSortChange={(sort) => updateFilters({ sort })}
        onFiltersToggle={() => setFiltersOpen((open) => !open)}
        onFiltersClose={() => setFiltersOpen(false)}
        onFiltersChange={updateFilters}
        onFiltersClear={clearAdvancedFilters}
      />

      <MarketplaceCategoryChips
        activeCategory={filters.category}
        onChange={(category) => updateFilters({ category })}
      />

      {!loaded ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <MarketplaceCardSkeleton key={index} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<StitchIcon name="search" tone="muted" size={24} />}
          title="No patterns found"
          description="Try a different search, category, or filter — or upload your first pattern."
          actionLabel="Clear filters"
          onAction={() => {
            setFilters(DEFAULT_MARKETPLACE_FILTERS);
            setFiltersOpen(false);
          }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((listing) => (
            <MarketplacePatternCard
              key={listing.id}
              listing={listing}
              isSaved={savedIds.includes(listing.id)}
              onSavedChange={handleSavedChange}
            />
          ))}
        </div>
      )}

      <MarketplaceCTA />
    </div>
  );
}
