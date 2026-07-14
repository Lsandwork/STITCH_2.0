import { z } from "zod";
import { DEMO_PROJECTS } from "@/lib/demo-data";
import { getDemoWorkspacePattern } from "@/lib/demo-patterns";

export const aiUserProfileSchema = z.object({
  displayName: z.string().optional(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  terminology: z.enum(["us", "uk"]).optional(),
  measurement: z.enum(["imperial", "metric"]).optional(),
  handedness: z.enum(["left", "right"]).optional(),
  projectTypes: z.array(z.string()).optional(),
  yarnWeights: z.array(z.string()).optional(),
});

export type AIUserProfile = z.infer<typeof aiUserProfileSchema>;

export function buildUserContextBlock(profile?: AIUserProfile): string | null {
  if (!profile) return null;

  const lines = [
    profile.displayName ? `Maker: ${profile.displayName}` : null,
    profile.skillLevel ? `Skill level: ${profile.skillLevel}` : null,
    profile.terminology ? `Terminology preference: ${profile.terminology.toUpperCase()}` : null,
    profile.measurement ? `Measurements: ${profile.measurement}` : null,
    profile.handedness ? `Handedness: ${profile.handedness}` : null,
    profile.projectTypes?.length
      ? `Favorite project types: ${profile.projectTypes.join(", ")}`
      : null,
    profile.yarnWeights?.length
      ? `Preferred yarn weights: ${profile.yarnWeights.join(", ")}`
      : null,
  ].filter(Boolean);

  return lines.length ? lines.join("\n") : null;
}

export function buildProjectContextBlock(projectId?: string): string | null {
  if (!projectId) return null;

  const project = DEMO_PROJECTS.find((item) => item.id === projectId);
  if (!project) return `Active project id: ${projectId}`;

  const pattern = getDemoWorkspacePattern(projectId);
  const flatRows = pattern
    ? pattern.sections.flatMap((section) => section.rows)
    : [];
  const recentRows = flatRows
    .slice(Math.max(0, (project.currentRow ?? 1) - 3), project.currentRow)
    .map((row) => `Row ${row.rowNumber}: ${row.instruction}`)
    .join("\n");

  return [
    `Active project: ${project.title}`,
    `Status: ${project.status} · ${project.progressPercent}% complete`,
    project.currentRow
      ? `Current row: ${project.currentRow}${project.totalRows ? ` of ${project.totalRows}` : ""}`
      : null,
    project.yarnName ? `Yarn: ${project.yarnName}` : null,
    project.hookSize ? `Hook: ${project.hookSize}` : null,
    project.description,
    recentRows ? `Recent pattern rows:\n${recentRows}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildConversationHistoryBlock(
  history?: Array<{ role: "user" | "assistant"; content: string }>,
): string | null {
  if (!history?.length) return null;

  const recent = history.slice(-8);
  return [
    "Recent conversation (use this to stay consistent and improve follow-up answers):",
    ...recent.map((entry) => `${entry.role.toUpperCase()}: ${entry.content}`),
  ].join("\n");
}
