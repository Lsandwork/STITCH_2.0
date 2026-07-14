import { describe, expect, it } from "vitest";
import {
  VOCABULARY_TERMS,
  countByCategory,
  getTermBySlug,
  getRelatedTerms,
} from "@/data/vocabulary";
import { validateNoDuplicates } from "@/data/vocabulary/helpers";
import {
  filterVocabularyTerms,
  getAvailableLetters,
  getTermDisplayLetter,
  parseCategoryParam,
} from "@/lib/vocab-utils";

describe("vocabulary data", () => {
  it("has no duplicate ids or slugs", () => {
    expect(() => validateNoDuplicates(VOCABULARY_TERMS)).not.toThrow();
  });

  it("includes all four craft categories", () => {
    const counts = countByCategory();
    expect(counts.crochet).toBeGreaterThanOrEqual(60);
    expect(counts.stitching).toBeGreaterThanOrEqual(50);
    expect(counts.embroidery).toBeGreaterThanOrEqual(50);
    expect(counts.knitting).toBeGreaterThanOrEqual(60);
  });

  it("resolves terms by slug", () => {
    const term = getTermBySlug("crochet-sc-single-crochet");
    expect(term?.abbreviation).toBe("sc");
    expect(term?.term).toBe("Single Crochet");
  });

  it("resolves related terms", () => {
    const term = getTermBySlug("crochet-sc-single-crochet");
    expect(term).toBeDefined();
    if (!term) return;
    const related = getRelatedTerms(term);
    expect(related.length).toBeGreaterThan(0);
  });
});

describe("vocabulary filters", () => {
  it("parses category query params", () => {
    expect(parseCategoryParam("crochet")).toBe("crochet");
    expect(parseCategoryParam("saved")).toBe("saved");
    expect(parseCategoryParam("invalid")).toBe("all");
  });

  it("filters by category and search", () => {
    const results = filterVocabularyTerms(VOCABULARY_TERMS, {
      category: "crochet",
      search: "magic ring",
      levels: [],
      types: [],
      terminology: "all",
      letter: null,
      savedIds: new Set(),
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((term) => term.category === "crochet")).toBe(true);
  });

  it("filters saved category by favorite ids", () => {
    const sample = VOCABULARY_TERMS[0];
    const results = filterVocabularyTerms(VOCABULARY_TERMS, {
      category: "saved",
      search: "",
      levels: [],
      types: [],
      terminology: "all",
      letter: null,
      savedIds: new Set([sample.id]),
    });

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(sample.id);
  });

  it("supports A-Z letter filtering", () => {
    const crochet = filterVocabularyTerms(VOCABULARY_TERMS, {
      category: "crochet",
      search: "",
      levels: [],
      types: [],
      terminology: "all",
      letter: "S",
      savedIds: new Set(),
    });

    expect(crochet.length).toBeGreaterThan(0);
    expect(
      crochet.every((term) => getTermDisplayLetter(term) === "S"),
    ).toBe(true);
  });

  it("computes available letters for active filters", () => {
    const crochet = filterVocabularyTerms(VOCABULARY_TERMS, {
      category: "crochet",
      search: "",
      levels: [],
      types: [],
      terminology: "all",
      letter: null,
      savedIds: new Set(),
    });
    const letters = getAvailableLetters(crochet);
    expect(letters.has("S")).toBe(true);
  });
});
