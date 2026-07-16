export type StitchSkillLevel = "beginner" | "intermediate" | "advanced";

export type StitchCatalogPattern = {
  id: string;
  slug: string;
  title: string;
  craft: string;
  difficulty: string;
  skillLevel: StitchSkillLevel;
  sizes: string[];
  tags: string[];
  materials: string[];
  gauge: string;
  summary: string;
  source: string;
  publicationStatus: string;
  authorName: string;
  imageUrl: string;
  imageAlt: string;
  isTrending: boolean;
  isFeatured: boolean;
  durationMinutes: number;
};

export type StitchPatternDetail = StitchCatalogPattern & {
  fullInstructionsMarkdown: string;
  checklistMarkdown: string;
};

export type StitchSharedResource = {
  slug: string;
  title: string;
  filename: string;
};
