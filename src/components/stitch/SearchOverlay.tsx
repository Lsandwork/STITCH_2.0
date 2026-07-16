"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  DEMO_LESSONS,
  DEMO_PROJECTS,
  DEMO_RECOMMENDATIONS,
} from "@/lib/demo-data";
import { QUICK_ACTIONS } from "@/lib/constants";
import { CATALOG_SEARCH_RESULTS } from "@/lib/patterns/search-results";
import { cn } from "@/lib/utils";
import { StitchIcon } from "@/components/stitch/StitchIcon";

export type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  category: string;
  icon: string;
};

type SearchOverlayProps = {
  open: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onClose: () => void;
};

const ALL_RESULTS: SearchResult[] = [
  ...CATALOG_SEARCH_RESULTS,
  ...DEMO_PROJECTS.map((project) => ({
    id: project.id,
    title: project.title,
    subtitle: project.status,
    href: project.href,
    category: "Projects",
    icon: "projects",
  })),
  ...DEMO_LESSONS.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    subtitle: lesson.category,
    href: lesson.href,
    category: "Lessons",
    icon: "learn",
  })),
  ...QUICK_ACTIONS.map((action) => ({
    id: action.href,
    title: action.label,
    subtitle: "Quick action",
    href: action.href,
    category: "Actions",
    icon: action.icon,
  })),
  ...DEMO_RECOMMENDATIONS.map((rec) => ({
    id: rec.id,
    title: rec.title,
    subtitle: rec.reason,
    href: rec.href,
    category: "Recommendations",
    icon: "sparkles",
  })),
];

function groupResults(results: SearchResult[]) {
  const groups = new Map<string, SearchResult[]>();
  for (const result of results) {
    const existing = groups.get(result.category) ?? [];
    existing.push(result);
    groups.set(result.category, existing);
  }
  return Array.from(groups.entries());
}

export function SearchOverlay({
  open,
  query,
  onQueryChange,
  onClose,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return ALL_RESULTS.slice(0, 8);
    return ALL_RESULTS.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle?.toLowerCase().includes(normalized) ||
        item.category.toLowerCase().includes(normalized),
    );
  }, [query]);

  const flatResults = filtered;
  const grouped = groupResults(filtered);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (flatResults.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % flatResults.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex(
          (index) => (index - 1 + flatResults.length) % flatResults.length,
        );
      } else if (event.key === "Enter") {
        event.preventDefault();
        const selected = flatResults[activeIndex];
        if (selected) {
          onClose();
          window.location.href = selected.href;
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, flatResults, activeIndex, onClose]);

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-stitch-ink/35 p-4 pt-[10vh] backdrop-blur-[2px]">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close search"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-stitch-lg border border-stitch-border bg-stitch-paper shadow-stitch-floating"
      >
        <div className="flex items-center gap-3 border-b border-stitch-border px-4 py-3">
          <StitchIcon name="search" tone="muted" size={20} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search projects, patterns, lessons..."
            className="flex-1 bg-transparent text-sm text-stitch-ink outline-none placeholder:text-stitch-muted"
            aria-label="Search query"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-stitch-sm px-2 py-1 text-xs text-stitch-muted hover:bg-stitch-peach"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {grouped.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-stitch-muted">
              No results found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            grouped.map(([category, items]) => (
              <div key={category} className="mb-2">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-stitch-muted">
                  {category}
                </p>
                <ul>
                  {items.map((item) => {
                    runningIndex += 1;
                    const itemIndex = runningIndex;
                    const isActive = itemIndex === activeIndex;
                    return (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 rounded-stitch-md px-3 py-2.5 transition-colors",
                            isActive
                              ? "bg-stitch-peach text-stitch-coral"
                              : "hover:bg-stitch-cream",
                          )}
                          onMouseEnter={() => setActiveIndex(itemIndex)}
                        >
                          <StitchIcon
                            name={item.icon}
                            tone={isActive ? "coral" : "muted"}
                            size={20}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {item.title}
                            </p>
                            {item.subtitle ? (
                              <p className="truncate text-xs text-stitch-muted">
                                {item.subtitle}
                              </p>
                            ) : null}
                          </div>
                          <StitchIcon name="arrow-right" tone="muted" size={16} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
