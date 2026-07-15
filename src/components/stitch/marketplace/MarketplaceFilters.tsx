"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import type { MarketplaceFilterState } from "@/lib/marketplace-filters";
import type { MarketplaceListing } from "@/lib/schemas/marketplace";
import { cn } from "@/lib/utils";

type MarketplaceFiltersProps = {
  open: boolean;
  filters: MarketplaceFilterState;
  activeCount: number;
  onClose: () => void;
  onChange: (patch: Partial<MarketplaceFilterState>) => void;
  onClear: () => void;
};

const SKILL_LEVELS: MarketplaceListing["skillLevel"][] = [
  "beginner",
  "intermediate",
  "advanced",
];

const PRICE_OPTIONS = [
  { label: "Any price", value: null },
  { label: "Free only", value: 0 },
  { label: "Under $5", value: 500 },
  { label: "Under $10", value: 1000 },
  { label: "Under $15", value: 1500 },
] as const;

export function MarketplaceFilters({
  open,
  filters,
  activeCount,
  onClose,
  onChange,
  onClear,
}: MarketplaceFiltersProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  function toggleSkillLevel(level: MarketplaceListing["skillLevel"]) {
    const next = filters.skillLevels.includes(level)
      ? filters.skillLevels.filter((item) => item !== level)
      : [...filters.skillLevels, level];
    onChange({ skillLevels: next });
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Marketplace filters"
      className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-[min(320px,calc(100vw-2rem))] rounded-stitch-lg border border-stitch-border bg-stitch-paper p-4 shadow-stitch-floating"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stitch-ink">Filters</h3>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-stitch-coral hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stitch-muted">
            Skill level
          </p>
          <div className="flex flex-wrap gap-2">
            {SKILL_LEVELS.map((level) => {
              const active = filters.skillLevels.includes(level);
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => toggleSkillLevel(level)}
                  className={cn(
                    "rounded-stitch-pill border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    active
                      ? "border-stitch-coral bg-stitch-coral text-white"
                      : "border-stitch-border bg-stitch-cream text-stitch-muted hover:border-stitch-coral",
                  )}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="marketplace-max-price"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stitch-muted"
          >
            Max price
          </label>
          <select
            id="marketplace-max-price"
            value={filters.maxPriceCents ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              onChange({
                maxPriceCents: value === "" ? null : Number(value),
              });
            }}
            className="w-full rounded-stitch-md border border-stitch-border bg-stitch-paper px-3 py-2.5 text-sm"
          >
            {PRICE_OPTIONS.map((option) => (
              <option
                key={option.label}
                value={option.value ?? ""}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="button" className="mt-4 w-full" size="sm" onClick={onClose}>
        Apply filters
      </Button>
    </div>
  );
}
