import { z } from "zod";
import {
  DEMO_LESSONS,
  DEMO_PROJECTS,
  DEMO_RECOMMENDATIONS,
  DEMO_YARN_PREVIEW,
  DEMO_WHAT_CAN_I_MAKE,
} from "@/lib/demo-data";

export const recommendationInputSchema = z.object({
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  inventoryYarnIds: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(20).default(6),
});

export const recommendationItemSchema = z.object({
  id: z.string(),
  type: z.enum(["project", "pattern", "lesson", "yarn_idea"]),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  href: z.string(),
  reason: z.string(),
  score: z.number().min(0).max(100),
  matchingYarnIds: z.array(z.string()).optional(),
});

export const recommendationResultSchema = z.object({
  recommendations: z.array(recommendationItemSchema).min(1),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  generatedAt: z.string().datetime(),
});

export type RecommendationInput = z.infer<typeof recommendationInputSchema>;
export type RecommendationResult = z.infer<typeof recommendationResultSchema>;

const SKILL_PROJECT_MAP: Record<string, string[]> = {
  beginner: ["demo-granny", "demo-sunflower"],
  intermediate: ["demo-dachshund", "demo-sunflower", "demo-dino"],
  advanced: ["demo-sweater", "demo-dino"],
};

function scoreProject(
  projectId: string,
  skillLevel: string,
  inventoryIds: Set<string>,
): number {
  let score = 50;
  const skillProjects = SKILL_PROJECT_MAP[skillLevel] ?? [];
  if (skillProjects.includes(projectId)) score += 25;

  const project = DEMO_PROJECTS.find((p) => p.id === projectId);
  if (project && project.progressPercent === 0) score += 10;
  if (project && project.status === "In Progress") score += 15;

  const yarnMatch = DEMO_YARN_PREVIEW.find(
    (y) => inventoryIds.has(y.id) && project?.yarnName.includes(y.name.split(" ")[0] ?? ""),
  );
  if (yarnMatch) score += 20;

  return Math.min(100, score);
}

export function getRecommendations(input: unknown): RecommendationResult {
  const parsed = recommendationInputSchema.parse(input);
  const inventoryIds = new Set(
    parsed.inventoryYarnIds ?? DEMO_YARN_PREVIEW.map((y) => y.id),
  );

  const projectRecs = DEMO_PROJECTS.filter(
    (p) => p.status === "Ready to Start" || p.status === "In Progress",
  )
    .map((project) =>
      recommendationItemSchema.parse({
        id: project.id,
        type: "project",
        title: project.title,
        description: `${project.yarnName} · ${project.hookSize} · ${project.totalRows} rows`,
        imageUrl: project.imageUrl,
        href: project.href,
        reason:
          project.status === "In Progress"
            ? "Continue where you left off"
            : "Matches your skill level and available yarn",
        score: scoreProject(project.id, parsed.skillLevel, inventoryIds),
        matchingYarnIds: DEMO_YARN_PREVIEW.filter((y) =>
          inventoryIds.has(y.id),
        ).map((y) => y.id),
      }),
    );

  const patternRecs = DEMO_RECOMMENDATIONS.map((rec) =>
    recommendationItemSchema.parse({
      id: rec.id,
      type: "pattern",
      title: rec.title,
      description: rec.description,
      imageUrl: rec.imageUrl,
      href: rec.href,
      reason: rec.reason,
      score: 78,
    }),
  );

  const lessonRecs = DEMO_LESSONS.filter((l) => l.progressPercent < 100)
    .slice(0, 2)
    .map((lesson) =>
      recommendationItemSchema.parse({
        id: lesson.id,
        type: "lesson",
        title: lesson.title,
        description: `${lesson.category} · ${lesson.durationMinutes} min`,
        imageUrl: lesson.illustrationUrl,
        href: lesson.href,
        reason: "Build skills for your current projects",
        score: 100 - lesson.progressPercent,
      }),
    );

  const yarnIdea = recommendationItemSchema.parse({
    id: DEMO_WHAT_CAN_I_MAKE.id,
    type: "yarn_idea",
    title: DEMO_WHAT_CAN_I_MAKE.title,
    description: DEMO_WHAT_CAN_I_MAKE.description,
    imageUrl: DEMO_WHAT_CAN_I_MAKE.imageUrl,
    href: DEMO_WHAT_CAN_I_MAKE.href,
    reason: DEMO_WHAT_CAN_I_MAKE.reason,
    score: 85,
    matchingYarnIds: Array.from(inventoryIds).slice(0, 2),
  });

  const all = [...projectRecs, ...patternRecs, ...lessonRecs, yarnIdea]
    .sort((a, b) => b.score - a.score)
    .slice(0, parsed.limit);

  return recommendationResultSchema.parse({
    recommendations: all,
    skillLevel: parsed.skillLevel,
    generatedAt: new Date().toISOString(),
  });
}

export const searchResultItemSchema = z.object({
  id: z.string(),
  type: z.enum(["project", "pattern", "yarn", "lesson"]),
  title: z.string(),
  subtitle: z.string().optional(),
  href: z.string(),
  score: z.number(),
});

export type SearchResultItem = z.infer<typeof searchResultItemSchema>;

export function searchDemoData(query: string, limit = 20): SearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResultItem[] = [];

  for (const project of DEMO_PROJECTS) {
    const haystack = `${project.title} ${project.yarnName} ${project.status}`.toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: project.id,
        type: "project",
        title: project.title,
        subtitle: project.status,
        href: project.href,
        score: haystack.indexOf(q) === 0 ? 100 : 70,
      });
    }
  }

  for (const lesson of DEMO_LESSONS) {
    const haystack = `${lesson.title} ${lesson.category} ${lesson.slug}`.toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: lesson.id,
        type: "lesson",
        title: lesson.title,
        subtitle: lesson.category,
        href: lesson.href,
        score: 65,
      });
    }
  }

  for (const yarn of DEMO_YARN_PREVIEW) {
    const haystack = `${yarn.name} ${yarn.colorName}`.toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: yarn.id,
        type: "yarn",
        title: yarn.name,
        subtitle: yarn.colorName,
        href: "/yarn",
        score: 60,
      });
    }
  }

  for (const rec of DEMO_RECOMMENDATIONS) {
    const haystack = `${rec.title} ${rec.description}`.toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        id: rec.id,
        type: "pattern",
        title: rec.title,
        subtitle: rec.reason,
        href: rec.href,
        score: 55,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
