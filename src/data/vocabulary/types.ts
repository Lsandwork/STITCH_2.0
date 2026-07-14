export type VocabularyCategory =
  | "crochet"
  | "stitching"
  | "embroidery"
  | "knitting";

export type VocabularyLevel = "beginner" | "intermediate" | "advanced";

export type VocabularyType =
  | "abbreviation"
  | "stitch"
  | "technique"
  | "tool"
  | "pattern-instruction"
  | "material"
  | "measurement";

export type TerminologySystem = "US" | "UK" | "Universal";

export interface VocabularyTerm {
  id: string;
  slug: string;
  abbreviation?: string;
  term: string;
  category: VocabularyCategory;
  level: VocabularyLevel;
  type: VocabularyType;
  definition: string;
  alternateNames?: string[];
  keywords?: string[];
  terminologySystem?: TerminologySystem;
  ukEquivalent?: string;
  usEquivalent?: string;
  relatedTermIds?: string[];
  patternExample?: string;
  tip?: string;
  pronunciation?: string;
}

export type VocabCategoryFilter =
  | "all"
  | "crochet"
  | "stitching"
  | "embroidery"
  | "knitting"
  | "saved";

export type VocabLevelFilter = VocabularyLevel;
export type VocabTypeFilter = VocabularyType;
export type VocabTerminologyFilter = "all" | "US" | "UK";
