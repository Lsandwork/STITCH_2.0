import { CROCHET_TERMS } from "./crochet";
import { EMBROIDERY_TERMS } from "./embroidery";
import { validateNoDuplicates } from "./helpers";
import { KNITTING_TERMS } from "./knitting";
import { STITCHING_TERMS } from "./stitching";
import type { VocabularyCategory, VocabularyTerm } from "./types";

const ALL_TERMS_RAW: VocabularyTerm[] = [
  ...CROCHET_TERMS,
  ...STITCHING_TERMS,
  ...EMBROIDERY_TERMS,
  ...KNITTING_TERMS,
];

validateNoDuplicates(ALL_TERMS_RAW);

export const VOCABULARY_TERMS: VocabularyTerm[] = [...ALL_TERMS_RAW].sort(
  (a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }),
);

const termsBySlug = new Map(VOCABULARY_TERMS.map((term) => [term.slug, term]));
const termsById = new Map(VOCABULARY_TERMS.map((term) => [term.id, term]));

export function getTermBySlug(slug: string): VocabularyTerm | undefined {
  return termsBySlug.get(slug);
}

export function getTermById(id: string): VocabularyTerm | undefined {
  return termsById.get(id);
}

export function getRelatedTerms(term: VocabularyTerm): VocabularyTerm[] {
  if (!term.relatedTermIds?.length) {
    return [];
  }

  return term.relatedTermIds
    .map((id) => termsById.get(id))
    .filter((related): related is VocabularyTerm => related !== undefined);
}

export function countByCategory(): Record<VocabularyCategory, number> {
  return VOCABULARY_TERMS.reduce<Record<VocabularyCategory, number>>(
    (counts, term) => {
      counts[term.category] += 1;
      return counts;
    },
    { crochet: 0, stitching: 0, embroidery: 0, knitting: 0 },
  );
}

export { CROCHET_TERMS, STITCHING_TERMS, EMBROIDERY_TERMS, KNITTING_TERMS };
