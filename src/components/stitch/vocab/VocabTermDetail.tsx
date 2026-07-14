"use client";

import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { getRelatedTerms } from "@/data/vocabulary";
import type { VocabularyTerm } from "@/data/vocabulary/types";
import { categoryLabel, typeLabel } from "@/lib/vocab-utils";

type VocabTermDetailProps = {
  term: VocabularyTerm;
  isSaved: boolean;
  onClose: () => void;
  onToggleSave: () => void;
  onOpenRelated: (slug: string) => void;
};

export function VocabTermDetail({
  term,
  isSaved,
  onClose,
  onToggleSave,
  onOpenRelated,
}: VocabTermDetailProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const related = getRelatedTerms(term);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function copyLink() {
    const url = `${window.location.origin}/vocab/${term.slug}`;
    await navigator.clipboard.writeText(url);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stitch-ink/40 p-0 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`vocab-term-${term.id}`}
        tabIndex={-1}
        className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-stitch-xl border border-stitch-border bg-stitch-paper shadow-stitch-floating sm:rounded-stitch-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stitch-border bg-stitch-paper/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <p className="text-sm font-medium text-stitch-muted">Vocabulary detail</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-stitch-md border border-stitch-border"
            aria-label="Close"
          >
            <StitchIcon name="close" tone="muted" size={18} />
          </button>
        </div>

        <div className="space-y-5 p-4 sm:p-6">
          {term.abbreviation ? (
            <p className="text-4xl font-bold text-stitch-coral">{term.abbreviation}</p>
          ) : null}
          <h2 id={`vocab-term-${term.id}`} className="text-2xl font-bold text-stitch-ink">
            {term.term}
          </h2>
          {term.pronunciation ? (
            <p className="text-sm text-stitch-muted">Pronunciation: {term.pronunciation}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Badge variant="coral">{categoryLabel(term.category)}</Badge>
            <Badge>{term.level}</Badge>
            <Badge>{typeLabel(term.type)}</Badge>
            {term.terminologySystem ? (
              <Badge variant="gold">{term.terminologySystem}</Badge>
            ) : null}
          </div>

          <p className="text-sm leading-relaxed text-stitch-ink">{term.definition}</p>

          {term.usEquivalent || term.ukEquivalent ? (
            <div className="rounded-stitch-md bg-stitch-cream p-4 text-sm">
              {term.usEquivalent ? (
                <p>
                  <strong>U.S. equivalent:</strong> {term.usEquivalent}
                </p>
              ) : null}
              {term.ukEquivalent ? (
                <p className={term.usEquivalent ? "mt-1" : undefined}>
                  <strong>U.K. equivalent:</strong> {term.ukEquivalent}
                </p>
              ) : null}
            </div>
          ) : null}

          {term.alternateNames?.length ? (
            <p className="text-sm text-stitch-muted">
              <strong>Also called:</strong> {term.alternateNames.join(", ")}
            </p>
          ) : null}

          {term.patternExample ? (
            <div className="rounded-stitch-md border border-stitch-border bg-stitch-cream p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-stitch-muted">
                Pattern example
              </p>
              <p className="mt-2 font-mono text-sm text-stitch-ink">{term.patternExample}</p>
            </div>
          ) : null}

          {term.tip ? (
            <div className="rounded-stitch-md border border-stitch-gold/30 bg-stitch-peach/40 p-4 text-sm text-stitch-ink">
              <strong>Tip:</strong> {term.tip}
            </div>
          ) : null}

          {related.length ? (
            <div>
              <p className="mb-2 text-sm font-semibold text-stitch-ink">Related terms</p>
              <div className="flex flex-wrap gap-2">
                {related.map((relatedTerm) => (
                  <button
                    key={relatedTerm.id}
                    type="button"
                    onClick={() => onOpenRelated(relatedTerm.slug)}
                    className="rounded-stitch-pill border border-stitch-border bg-stitch-paper px-3 py-1.5 text-sm hover:border-stitch-coral"
                  >
                    {relatedTerm.abbreviation ?? relatedTerm.term}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="button" onClick={onToggleSave}>
              {isSaved ? "Saved" : "Save term"}
            </Button>
            <Button type="button" variant="secondary" onClick={copyLink}>
              Copy link
            </Button>
            <Button href={`/vocab/${term.slug}`} variant="secondary">
              Open shareable page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
