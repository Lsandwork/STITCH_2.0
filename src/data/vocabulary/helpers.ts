import type { VocabularyTerm } from "./types";

export function slugify(
  term: string,
  abbreviation?: string,
  category?: string,
): string {
  const base = abbreviation ? `${abbreviation}-${term}` : term;
  const slug = base
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return category ? `${category}-${slug}` : slug;
}

export type CreateTermInput = Omit<VocabularyTerm, "slug"> & { slug?: string };

export function createTerm(input: CreateTermInput): VocabularyTerm {
  if (!input.id.trim()) {
    throw new Error("Vocabulary term id is required.");
  }
  if (!input.term.trim()) {
    throw new Error(`Vocabulary term "${input.id}" is missing a term name.`);
  }
  if (!input.definition.trim()) {
    throw new Error(`Vocabulary term "${input.id}" is missing a definition.`);
  }

  const slug = input.slug ?? slugify(input.term, input.abbreviation, input.category);

  return {
    ...input,
    slug,
  };
}

export function validateNoDuplicates(terms: VocabularyTerm[]): void {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const term of terms) {
    if (ids.has(term.id)) {
      throw new Error(`Duplicate vocabulary id: ${term.id}`);
    }
    if (slugs.has(term.slug)) {
      throw new Error(`Duplicate vocabulary slug: ${term.slug}`);
    }
    ids.add(term.id);
    slugs.add(term.slug);
  }
}
