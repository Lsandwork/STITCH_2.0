"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { VocabTermCard } from "@/components/stitch/vocab/VocabTermCard";
import { VocabTermDetail } from "@/components/stitch/vocab/VocabTermDetail";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  VOCABULARY_TERMS,
  countByCategory,
  getTermById,
  getTermBySlug,
} from "@/data/vocabulary";
import type {
  VocabCategoryFilter,
  VocabularyLevel,
  VocabularyType,
  VocabTerminologyFilter,
} from "@/data/vocabulary/types";
import {
  POPULAR_TERM_IDS,
  VOCAB_ALPHABET,
  VOCAB_CATEGORY_OPTIONS,
  VOCAB_LEVEL_OPTIONS,
  VOCAB_TERMINOLOGY_OPTIONS,
  VOCAB_TYPE_OPTIONS,
} from "@/lib/vocab-constants";
import {
  fetchRemoteVocabFavorites,
  getLocalVocabFavorites,
  getRecentVocabTermIds,
  recordRecentVocabTerm,
  saveLocalVocabFavorites,
  syncRemoteVocabFavorite,
  toggleLocalVocabFavorite,
} from "@/lib/vocab-storage";
import {
  filterVocabularyTerms,
  getAvailableLetters,
  parseCategoryParam,
} from "@/lib/vocab-utils";
import { cn } from "@/lib/utils";

type VocabClientProps = {
  initialSlug?: string;
};

export function VocabClient({ initialSlug }: VocabClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<VocabCategoryFilter>(
    parseCategoryParam(searchParams.get("category")),
  );
  const [levels, setLevels] = useState<VocabularyLevel[]>([]);
  const [types, setTypes] = useState<VocabularyType[]>([]);
  const [terminology, setTerminology] = useState<VocabTerminologyFilter>("all");
  const [letter, setLetter] = useState<string | null>(searchParams.get("letter"));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(
    initialSlug ?? searchParams.get("term"),
  );

  const counts = useMemo(() => countByCategory(), []);

  useEffect(() => {
    setSavedIds(getLocalVocabFavorites());
    setRecentIds(getRecentVocabTermIds());
    void fetchRemoteVocabFavorites().then((remote) => {
      if (remote) {
        setSavedIds(remote);
        saveLocalVocabFavorites(remote);
      }
    });
  }, []);

  useEffect(() => {
    const slug = initialSlug ?? searchParams.get("term");
    if (slug) setActiveSlug(slug);
  }, [initialSlug, searchParams]);

  const updateUrl = useCallback(
    (next: {
      category?: VocabCategoryFilter;
      q?: string;
      letter?: string | null;
      term?: string | null;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextCategory = next.category ?? category;
      const nextQuery = next.q ?? search;
      const nextLetter = next.letter === undefined ? letter : next.letter;
      const nextTerm = next.term === undefined ? activeSlug : next.term;

      if (nextCategory === "all") params.delete("category");
      else params.set("category", nextCategory);

      if (nextQuery.trim()) params.set("q", nextQuery.trim());
      else params.delete("q");

      if (nextLetter) params.set("letter", nextLetter);
      else params.delete("letter");

      if (nextTerm) params.set("term", nextTerm);
      else params.delete("term");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [activeSlug, category, letter, pathname, router, search, searchParams],
  );

  const filteredTerms = useMemo(
    () =>
      filterVocabularyTerms(VOCABULARY_TERMS, {
        category,
        search,
        levels,
        types,
        terminology,
        letter,
        savedIds: new Set(savedIds),
      }),
    [category, search, levels, types, terminology, letter, savedIds],
  );

  const availableLetters = useMemo(
    () =>
      getAvailableLetters(
        filterVocabularyTerms(VOCABULARY_TERMS, {
          category,
          search,
          levels,
          types,
          terminology,
          letter: null,
          savedIds: new Set(savedIds),
        }),
      ),
    [category, search, levels, types, terminology, savedIds],
  );

  const activeTerm = activeSlug ? getTermBySlug(activeSlug) : undefined;

  function openTerm(slug: string) {
    const term = getTermBySlug(slug);
    if (!term) return;
    setActiveSlug(slug);
    const nextRecent = recordRecentVocabTerm(term.id);
    setRecentIds(nextRecent);
    updateUrl({ term: slug });
  }

  function closeTerm() {
    setActiveSlug(null);
    updateUrl({ term: null });
  }

  async function toggleSave(termId: string) {
    const isSaved = savedIds.includes(termId);
    const localNext = toggleLocalVocabFavorite(termId);
    setSavedIds(localNext);
    const remoteNext = await syncRemoteVocabFavorite(termId, !isSaved);
    if (remoteNext) {
      setSavedIds(remoteNext);
      saveLocalVocabFavorites(remoteNext);
    }
  }

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setLevels([]);
    setTypes([]);
    setTerminology("all");
    setLetter(null);
    updateUrl({ category: "all", q: "", letter: null, term: null });
  }

  const hasActiveFilters =
    Boolean(search.trim()) ||
    category !== "all" ||
    levels.length > 0 ||
    types.length > 0 ||
    terminology !== "all" ||
    Boolean(letter);

  return (
    <>
      <PageHeading
        title="Vocab"
        description="Learn the language of crochet, stitching, embroidery, and knitting."
      />

      <div className="mb-6 rounded-stitch-lg border border-stitch-border bg-gradient-to-r from-stitch-peach/60 via-stitch-paper to-stitch-mint/40 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stitch-paper shadow-stitch-card">
            <StitchIcon name="book" tone="coral" size={24} />
          </div>
          <div>
            <p className="text-sm text-stitch-ink">
              Search abbreviations, stitches, tools, techniques, and pattern instructions.
            </p>
            <p className="mt-2 text-xs text-stitch-muted">
              {VOCABULARY_TERMS.length} terms · Crochet {counts.crochet} · Stitching{" "}
              {counts.stitching} · Embroidery {counts.embroidery} · Knitting {counts.knitting}
            </p>
          </div>
        </div>
      </div>

      {category === "crochet" ? (
        <p className="mb-4 rounded-stitch-md border border-stitch-border bg-stitch-cream px-4 py-3 text-sm text-stitch-muted">
          Crochet terminology can differ between U.S. and U.K. patterns. Always check which
          terminology system your pattern uses.
        </p>
      ) : null}

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-stitch-ink">Popular Terms to Learn</h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TERM_IDS.map((id) => {
            const term = getTermById(id);
            if (!term) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => openTerm(term.slug)}
                className="rounded-stitch-pill border border-stitch-border bg-stitch-paper px-3 py-1.5 text-sm hover:border-stitch-coral"
              >
                {term.term}
              </button>
            );
          })}
        </div>
      </section>

      {recentIds.length ? (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-stitch-ink">Recently Viewed</h2>
          <div className="flex flex-wrap gap-2">
            {recentIds.map((id) => {
              const term = getTermById(id);
              if (!term) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => openTerm(term.slug)}
                  className="rounded-stitch-pill border border-stitch-border bg-stitch-cream px-3 py-1.5 text-sm"
                >
                  {term.abbreviation ?? term.term}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <div
        className="mb-4 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Vocabulary categories"
      >
        {VOCAB_CATEGORY_OPTIONS.map((item) => {
          const active = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setCategory(item.id);
                updateUrl({ category: item.id });
              }}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-stitch-pill border px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-stitch-coral bg-stitch-peach text-stitch-coral"
                  : "border-stitch-border bg-stitch-paper text-stitch-muted hover:border-stitch-coral",
              )}
            >
              <StitchIcon
                name={item.icon}
                tone={active ? "coral" : "muted"}
                size={16}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <label htmlFor="vocab-search" className="sr-only">
          Search vocabulary
        </label>
        <div className="relative">
          <StitchIcon
            name="search"
            tone="muted"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            id="vocab-search"
            type="search"
            value={search}
            onChange={(event) => {
              const value = event.target.value;
              setSearch(value);
              updateUrl({ q: value });
            }}
            placeholder="Search a term, abbreviation, stitch, or technique…"
            className="w-full rounded-stitch-md border border-stitch-border bg-stitch-paper py-3 pl-10 pr-10 text-sm"
          />
          {search ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                updateUrl({ q: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stitch-muted"
              aria-label="Clear search"
            >
              <StitchIcon name="close" tone="muted" size={16} />
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-stitch-muted" aria-live="polite">
          {filteredTerms.length} {filteredTerms.length === 1 ? "term" : "terms"} found
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <StitchIcon name="filter" tone="coral" size={16} className="mr-1.5" />
          Filters
        </Button>
        {hasActiveFilters ? (
          <Button type="button" variant="secondary" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        ) : null}
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setLevels((current) => current.filter((item) => item !== level))}
            className="rounded-stitch-pill bg-stitch-peach px-3 py-1 text-xs"
          >
            {level} ×
          </button>
        ))}
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTypes((current) => current.filter((item) => item !== type))}
            className="rounded-stitch-pill bg-stitch-peach px-3 py-1 text-xs"
          >
            {type} ×
          </button>
        ))}
        {terminology !== "all" ? (
          <button
            type="button"
            onClick={() => setTerminology("all")}
            className="rounded-stitch-pill bg-stitch-peach px-3 py-1 text-xs"
          >
            {terminology} ×
          </button>
        ) : null}
        {letter ? (
          <button
            type="button"
            onClick={() => {
              setLetter(null);
              updateUrl({ letter: null });
            }}
            className="rounded-stitch-pill bg-stitch-peach px-3 py-1 text-xs"
          >
            {letter} ×
          </button>
        ) : null}
      </div>

      {filtersOpen ? (
        <div className="mb-4 space-y-4 rounded-stitch-lg border border-stitch-border bg-stitch-paper p-4">
          <div>
            <p className="mb-2 text-sm font-semibold">Skill level</p>
            <div className="flex flex-wrap gap-2">
              {VOCAB_LEVEL_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setLevels((current) =>
                      current.includes(option.id)
                        ? current.filter((item) => item !== option.id)
                        : [...current, option.id],
                    )
                  }
                  className={cn(
                    "rounded-stitch-pill border px-3 py-1.5 text-sm",
                    levels.includes(option.id)
                      ? "border-stitch-coral bg-stitch-peach text-stitch-coral"
                      : "border-stitch-border",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Term type</p>
            <div className="flex flex-wrap gap-2">
              {VOCAB_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setTypes((current) =>
                      current.includes(option.id)
                        ? current.filter((item) => item !== option.id)
                        : [...current, option.id],
                    )
                  }
                  className={cn(
                    "rounded-stitch-pill border px-3 py-1.5 text-sm",
                    types.includes(option.id)
                      ? "border-stitch-coral bg-stitch-peach text-stitch-coral"
                      : "border-stitch-border",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold">Terminology</p>
            <div className="flex flex-wrap gap-2">
              {VOCAB_TERMINOLOGY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTerminology(option.id)}
                  className={cn(
                    "rounded-stitch-pill border px-3 py-1.5 text-sm",
                    terminology === option.id
                      ? "border-stitch-coral bg-stitch-peach text-stitch-coral"
                      : "border-stitch-border",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex gap-1 overflow-x-auto pb-1" aria-label="Alphabetical navigation">
        {VOCAB_ALPHABET.map((value) => {
          const enabled = availableLetters.has(value);
          const active = letter === value;
          return (
            <button
              key={value}
              type="button"
              disabled={!enabled}
              onClick={() => {
                const next = active ? null : value;
                setLetter(next);
                updateUrl({ letter: next });
              }}
              className={cn(
                "flex h-8 min-w-8 items-center justify-center rounded-stitch-sm text-xs font-semibold",
                active
                  ? "bg-stitch-coral text-white"
                  : enabled
                    ? "bg-stitch-cream text-stitch-ink"
                    : "bg-stitch-cream/40 text-stitch-muted/50",
              )}
            >
              {value}
            </button>
          );
        })}
      </div>

      {filteredTerms.length === 0 ? (
        <EmptyState
          title="No vocabulary terms found"
          description="Try another word, abbreviation, or category."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTerms.map((term) => (
            <VocabTermCard
              key={term.id}
              term={term}
              searchQuery={search}
              isSaved={savedIds.includes(term.id)}
              onOpen={() => openTerm(term.slug)}
              onToggleSave={() => void toggleSave(term.id)}
              onCopy={() => void navigator.clipboard.writeText(term.abbreviation ?? term.term)}
            />
          ))}
        </div>
      )}

      {activeTerm ? (
        <VocabTermDetail
          term={activeTerm}
          isSaved={savedIds.includes(activeTerm.id)}
          onClose={closeTerm}
          onToggleSave={() => void toggleSave(activeTerm.id)}
          onOpenRelated={(slug) => openTerm(slug)}
        />
      ) : null}
    </>
  );
}
