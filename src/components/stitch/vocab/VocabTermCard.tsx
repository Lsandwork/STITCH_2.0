"use client";

import { Badge } from "@/components/ui/Badge";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import type { VocabularyTerm } from "@/data/vocabulary/types";
import { categoryLabel, highlightMatch, typeLabel } from "@/lib/vocab-utils";
import { cn } from "@/lib/utils";

type VocabTermCardProps = {
  term: VocabularyTerm;
  searchQuery: string;
  isSaved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
  onCopy: () => void;
};

const CATEGORY_BADGE: Record<VocabularyTerm["category"], "coral" | "teal" | "lavender" | "gold"> = {
  crochet: "coral",
  stitching: "teal",
  embroidery: "lavender",
  knitting: "gold",
};

export function VocabTermCard({
  term,
  searchQuery,
  isSaved,
  onOpen,
  onToggleSave,
  onCopy,
}: VocabTermCardProps) {
  const abbreviationHtml = term.abbreviation
    ? highlightMatch(term.abbreviation, searchQuery)
    : null;
  const termHtml = highlightMatch(term.term, searchQuery);

  return (
    <article className="stitch-card flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 text-left"
          aria-label={`Open ${term.term}`}
        >
          {abbreviationHtml ? (
            <p
              className="text-2xl font-bold tracking-tight text-stitch-coral"
              dangerouslySetInnerHTML={{ __html: abbreviationHtml }}
            />
          ) : null}
          <h3
            className={cn(
              "font-semibold text-stitch-ink",
              abbreviationHtml ? "mt-1 text-base" : "text-lg",
            )}
            dangerouslySetInnerHTML={{ __html: termHtml }}
          />
        </button>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onToggleSave}
            className="flex h-9 w-9 items-center justify-center rounded-stitch-md border border-stitch-border bg-stitch-paper"
            aria-label={isSaved ? "Remove from saved" : "Save term"}
          >
            <StitchIcon
              name={isSaved ? "bookmark" : "heart"}
              tone={isSaved ? "coral" : "muted"}
              size={18}
            />
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="flex h-9 w-9 items-center justify-center rounded-stitch-md border border-stitch-border bg-stitch-paper"
            aria-label="Copy term"
          >
            <StitchIcon name="share" tone="muted" size={18} />
          </button>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stitch-muted">
        {term.definition}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant={CATEGORY_BADGE[term.category]}>{categoryLabel(term.category)}</Badge>
        <Badge>{term.level}</Badge>
        <Badge variant="default">{typeLabel(term.type)}</Badge>
        {term.terminologySystem && term.terminologySystem !== "Universal" ? (
          <Badge variant="gold">{term.terminologySystem} Term</Badge>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-stitch-coral hover:underline"
      >
        View details
        <StitchIcon name="chevron-right" tone="coral" size={16} />
      </button>
    </article>
  );
}
