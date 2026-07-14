import { z } from "zod";
import { aiUserProfileSchema } from "@/lib/ai-user-context";

export const tutorNextActionSchema = z.object({
  label: z.string().min(1),
  href: z.string().optional(),
  action: z
    .enum([
      "open_workspace",
      "open_vision",
      "open_lesson",
      "rescan",
      "add_note",
      "mark_row_complete",
    ])
    .optional(),
});

export const tutorRelatedLessonSchema = z.object({
  lessonId: z.string().optional(),
  slug: z.string().optional(),
  title: z.string().min(1),
  href: z.string().optional(),
});

export const tutorResponseSchema = z.object({
  likelyIssue: z.string().min(1),
  howToConfirm: z.string().min(1),
  howToFix: z.string().min(1),
  howToPrevent: z.string().min(1),
  relatedLesson: tutorRelatedLessonSchema.optional(),
  suggestedNextAction: tutorNextActionSchema,
  confidence: z.number().min(0).max(1).optional(),
  followUpQuestions: z.array(z.string()).optional(),
});

export const tutorHistoryMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

export const tutorMessageInputSchema = z.object({
  conversationId: z.string().optional(),
  projectId: z.string().optional(),
  message: z.string().min(1, "Ask the Tutor a question."),
  currentRow: z.number().int().positive().optional(),
  includePhoto: z.boolean().default(false),
  voiceTranscript: z.boolean().default(false),
  history: z.array(tutorHistoryMessageSchema).max(12).optional(),
  userProfile: aiUserProfileSchema.optional(),
});

export const tutorConversationSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  projectId: z.string().uuid().nullable(),
  lastMessagePreview: z.string().optional(),
  updatedAt: z.string().datetime(),
});

export type TutorResponse = z.infer<typeof tutorResponseSchema>;
export type TutorMessageInput = z.infer<typeof tutorMessageInputSchema>;
export type TutorConversationSummary = z.infer<
  typeof tutorConversationSummarySchema
>;

export function validateTutorResponse(data: unknown) {
  return tutorResponseSchema.safeParse(data);
}

export function validateTutorMessageInput(data: unknown) {
  return tutorMessageInputSchema.safeParse(data);
}
