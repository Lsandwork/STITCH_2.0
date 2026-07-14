import { describe, expect, it } from "vitest";
import {
  tutorMessageInputSchema,
  tutorResponseSchema,
  validateTutorMessageInput,
  validateTutorResponse,
} from "@/lib/schemas/tutor";

describe("tutor schemas", () => {
  it("parses valid tutor response", () => {
    const result = validateTutorResponse({
      likelyIssue: "You may have skipped a stitch in the previous row.",
      howToConfirm: "Count stitches across the row and compare to the pattern.",
      howToFix: "Undo to the previous row and recount carefully.",
      howToPrevent: "Use a stitch marker every 10 stitches.",
      suggestedNextAction: {
        label: "Open workspace",
        action: "open_workspace",
        href: "/workspace/demo-dachshund",
      },
      confidence: 0.82,
      followUpQuestions: ["Which row are you on?"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects tutor response missing required fields", () => {
    const result = tutorResponseSchema.safeParse({
      likelyIssue: "Issue only",
    });

    expect(result.success).toBe(false);
  });

  it("parses tutor message input with defaults", () => {
    const result = validateTutorMessageInput({
      message: "Why is my edge curling?",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.includePhoto).toBe(false);
      expect(result.data.voiceTranscript).toBe(false);
    }
  });

  it("rejects empty tutor messages", () => {
    const result = tutorMessageInputSchema.safeParse({
      message: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts demo-style project ids", () => {
    const result = tutorMessageInputSchema.safeParse({
      projectId: "demo-dachshund",
      message: "How do I fix a magic ring?",
      currentRow: 24,
    });

    expect(result.success).toBe(true);
  });

  it("accepts optional conversation and project ids", () => {
    const result = tutorMessageInputSchema.safeParse({
      conversationId: "550e8400-e29b-41d4-a716-446655440000",
      projectId: "550e8400-e29b-41d4-a716-446655440001",
      message: "How do I fix a magic ring?",
      currentRow: 3,
    });

    expect(result.success).toBe(true);
  });
});
