import { z } from "zod";

export const marketplaceTranslationSchema = z.object({
  language: z.string().min(2),
  languageLabel: z.string().min(2),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const marketplaceListingSchema = z.object({
  id: z.string().min(1),
  designerId: z.string().min(1),
  designerName: z.string().min(1),
  designerAvatarUrl: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  aiDescription: z.string().min(1),
  previewText: z.string().min(1),
  patternContent: z.string().min(1),
  priceCents: z.number().int().min(0),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  projectType: z.string().min(1),
  yarnWeight: z.string().optional(),
  hookSize: z.string().optional(),
  thumbnailUrl: z.string().min(1),
  thumbnailStyle: z
    .object({
      gradientFrom: z.string(),
      gradientTo: z.string(),
      emoji: z.string().optional(),
    })
    .optional(),
  languages: z.array(marketplaceTranslationSchema).min(1),
  tags: z.array(z.string()).default([]),
  downloads: z.number().int().min(0).default(0),
  rating: z.number().min(0).max(5).default(0),
  ratingCount: z.number().int().min(0).default(0),
  duplicateScore: z.number().min(0).max(100).default(0),
  duplicateOfId: z.string().nullable().default(null),
  duplicateNote: z.string().optional(),
  status: z.enum(["published", "pending", "flagged"]).default("published"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const marketplaceProcessInputSchema = z.object({
  title: z.string().min(2).max(120),
  patternContent: z.string().min(20),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  projectType: z.string().min(1),
  yarnWeight: z.string().optional(),
  hookSize: z.string().optional(),
  priceCents: z.number().int().min(0).default(0),
  existingTitles: z.array(z.string()).default([]),
  existingSummaries: z.array(z.string()).default([]),
});

export const marketplaceProcessResultSchema = z.object({
  aiDescription: z.string().min(1),
  previewText: z.string().min(1),
  tags: z.array(z.string()).min(1),
  thumbnailStyle: z.object({
    gradientFrom: z.string(),
    gradientTo: z.string(),
    emoji: z.string(),
  }),
  languages: z.array(marketplaceTranslationSchema).min(3),
  duplicateScore: z.number().min(0).max(100),
  duplicateNote: z.string(),
  suggestedTitle: z.string().optional(),
});

export type MarketplaceListing = z.infer<typeof marketplaceListingSchema>;
export type MarketplaceProcessInput = z.infer<typeof marketplaceProcessInputSchema>;
export type MarketplaceProcessResult = z.infer<typeof marketplaceProcessResultSchema>;
