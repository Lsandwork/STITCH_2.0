import type {
  VocabCategoryFilter,
  VocabularyCategory,
  VocabularyLevel,
  VocabularyTerm,
  VocabularyType,
  VocabTerminologyFilter,
} from "@/data/vocabulary/types";

export type VocabFilterState = {
  category: VocabCategoryFilter;
  search: string;
  levels: VocabularyLevel[];
  types: VocabularyType[];
  terminology: VocabTerminologyFilter;
  letter: string | null;
  savedIds: Set<string>;
};

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function termSearchBlob(term: VocabularyTerm): string {
  return normalizeSearchText(
    [
      term.abbreviation,
      term.term,
      term.definition,
      ...(term.alternateNames ?? []),
      ...(term.keywords ?? []),
      term.category,
      term.level,
      term.type,
      term.ukEquivalent,
      term.usEquivalent,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function isTypoTolerantMatch(haystack: string, query: string): boolean {
  if (!query) return true;
  if (haystack.includes(query)) return true;

  const tokens = query.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

export function getTermDisplayLetter(term: VocabularyTerm): string {
  const source = term.abbreviation ?? term.term;
  const match = source.trim().match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : "#";
}

export function filterVocabularyTerms(
  terms: VocabularyTerm[],
  filters: VocabFilterState,
): VocabularyTerm[] {
  const query = normalizeSearchText(filters.search);

  return terms.filter((term) => {
    if (filters.category === "saved") {
      if (!filters.savedIds.has(term.id)) return false;
    } else if (filters.category !== "all") {
      if (term.category !== filters.category) return false;
    }

    if (filters.levels.length && !filters.levels.includes(term.level)) {
      return false;
    }

    if (filters.types.length && !filters.types.includes(term.type)) {
      return false;
    }

    if (filters.terminology !== "all") {
      if (
        term.terminologySystem &&
        term.terminologySystem !== "Universal" &&
        term.terminologySystem !== filters.terminology
      ) {
        return false;
      }
    }

    if (filters.letter) {
      if (getTermDisplayLetter(term) !== filters.letter) return false;
    }

    if (query && !isTypoTolerantMatch(termSearchBlob(term), query)) {
      return false;
    }

    return true;
  });
}

export function getAvailableLetters(terms: VocabularyTerm[]): Set<string> {
  return new Set(terms.map(getTermDisplayLetter));
}

export function highlightMatch(text: string, query: string): string {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return text;

  const index = normalizeSearchText(text).indexOf(normalizedQuery);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + normalizedQuery.length);
  const after = text.slice(index + normalizedQuery.length);
  return `${before}<mark class="rounded bg-stitch-peach px-0.5 text-stitch-ink">${match}</mark>${after}`;
}

export function categoryLabel(category: VocabularyCategory): string {
  const labels: Record<VocabularyCategory, string> = {
    crochet: "Crochet",
    stitching: "Stitching & Sewing",
    embroidery: "Embroidery",
    knitting: "Knitting",
  };
  return labels[category];
}

export function typeLabel(type: VocabularyTerm["type"]): string {
  const labels: Record<VocabularyTerm["type"], string> = {
    abbreviation: "Abbreviation",
    stitch: "Stitch",
    technique: "Technique",
    tool: "Tool",
    "pattern-instruction": "Pattern Instruction",
    material: "Material",
    measurement: "Measurement",
  };
  return labels[type];
}

export function parseCategoryParam(
  value: string | null | undefined,
): VocabCategoryFilter {
  if (
    value === "crochet" ||
    value === "stitching" ||
    value === "embroidery" ||
    value === "knitting" ||
    value === "saved"
  ) {
    return value;
  }
  return "all";
}
