import {
  tutorMessageInputSchema,
  tutorResponseSchema,
  type TutorMessageInput,
  type TutorResponse,
} from "@/lib/schemas/tutor";
import { DEMO_LESSONS, DEMO_PROJECTS } from "@/lib/demo-data";
import {
  buildConversationHistoryBlock,
  buildProjectContextBlock,
  buildUserContextBlock,
} from "@/lib/ai-user-context";
import { generateJSONWithFallback, isMockMode } from "@/services/ai/provider";

function buildMockTutorResponse(input: TutorMessageInput): TutorResponse {
  const project = DEMO_PROJECTS.find((p) => p.id === input.projectId);
  const message = input.message.toLowerCase();
  const row = input.currentRow ?? project?.currentRow ?? 1;

  let likelyIssue =
    "Your stitch count may have drifted by 1–2 stitches in the last round.";
  let howToConfirm =
    "Count the live stitches on your hook row and compare to the pattern count for this round.";
  let howToFix =
    "If you are short, work an increase in the next round where the pattern allows. If you have extra stitches, work an invisible decrease at the join.";
  let howToPrevent =
    "Place a stitch marker in the first stitch of each round and count every 6–8 stitches while working.";

  if (/magic ring|mr\b/.test(message)) {
    likelyIssue = "The magic ring may be leaving a hole or loose center.";
    howToConfirm =
      "Pull the tail firmly — the center should close completely with no visible gap.";
    howToFix =
      "After round 1, weave the tail through the ring base and pull tight before continuing.";
    howToPrevent =
      "Wrap the yarn twice around your fingers and tug the tail after the first round of stitches.";
  } else if (/increase|inc\b/.test(message)) {
    likelyIssue = "Increases may be stacking in the same spot, creating a visible bump.";
    howToConfirm =
      "Lay the piece flat — bumps or points usually mean increases were placed in consecutive stitches.";
    howToFix =
      "For the next shaping round, space increases evenly using a stitch marker between each increase.";
    howToPrevent =
      "Use the pattern's evenly-spaced increase notation, e.g. (sc, inc) x6, rather than clustering.";
  } else if (/decrease|dec\b|gap|hole/.test(message)) {
    likelyIssue = "Decrease gaps are common when stuffing amigurumi firmly.";
    howToConfirm =
      "Look at the decrease stitch from the outside — a small hole or stretched V-shape confirms the issue.";
    howToFix =
      "Switch to invisible decrease (insert hook through front loops only) and tighten the yarn before the next stitch.";
    howToPrevent =
      "Decrease before heavy stuffing and keep tension consistent through decrease rounds.";
  } else if (/row|round|count/.test(message)) {
    likelyIssue = `You may be off by 1–2 stitches around row ${row}.`;
    howToConfirm = `Recount live stitches at row ${row} and compare to the pattern's stated count.`;
    howToFix =
      "Mark the last correct row and frog back one round if the count is wrong, then rework with markers.";
    howToPrevent =
      "Count stitches at the end of every shaping round, not just increase/decrease rows.";
  }

  const lesson =
    DEMO_LESSONS.find((l) =>
      /increase|round|magic/.test(l.slug) &&
      message.includes(l.slug.split("-")[0] ?? ""),
    ) ?? DEMO_LESSONS[2];

  return tutorResponseSchema.parse({
    likelyIssue,
    howToConfirm,
    howToFix,
    howToPrevent,
    relatedLesson: {
      lessonId: lesson?.id,
      slug: lesson?.slug,
      title: lesson?.title ?? "Increasing",
      href: lesson?.href,
    },
    suggestedNextAction: {
      label: input.includePhoto ? "Rescan with Vision Mode" : "Open workspace",
      href: input.includePhoto
        ? "/vision/scan"
        : project?.href ?? "/workspace/demo-dachshund",
      action: input.includePhoto ? "open_vision" : "open_workspace",
    },
    confidence: 0.82,
    followUpQuestions: [
      "Would you like me to walk through counting this round step by step?",
      "Do you want a left-handed version of these instructions?",
    ],
  });
}

function buildTutorPrompt(input: TutorMessageInput): string {
  const userContext = buildUserContextBlock(input.userProfile);
  const projectContext = buildProjectContextBlock(input.projectId);
  const historyContext = buildConversationHistoryBlock(input.history);
  const terminology = input.userProfile?.terminology?.toUpperCase() ?? "US";
  const handedness = input.userProfile?.handedness ?? "right";

  return [
    "You are the Stitch by Nuvio Crochet Tutor — a patient expert who gives practical, accurate crochet help.",
    "Use the maker's conversation history and profile to personalize your answer and avoid repeating prior advice.",
    "If they already tried something in earlier messages, acknowledge it and go deeper.",
    "",
    userContext ? `Maker profile:\n${userContext}` : null,
    projectContext ? `Project context:\n${projectContext}` : null,
    historyContext,
    "",
    `Current question: ${input.message}`,
    input.currentRow ? `Current row/round: ${input.currentRow}` : null,
    input.includePhoto
      ? "The maker may attach a photo — suggest Vision Mode for visual confirmation when helpful."
      : null,
    `Use ${terminology} crochet terminology and ${handedness}-handed guidance.`,
    "",
    "Respond with JSON containing: likelyIssue, howToConfirm, howToFix, howToPrevent, suggestedNextAction, optional relatedLesson, confidence (0-1), followUpQuestions (2-3 specific follow-ups based on this conversation).",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function getTutorResponse(
  input: unknown,
): Promise<TutorResponse> {
  const parsed = tutorMessageInputSchema.parse(input);

  if (isMockMode()) {
    return buildMockTutorResponse(parsed);
  }

  try {
    const { data } = await generateJSONWithFallback(
      buildTutorPrompt(parsed),
      tutorResponseSchema,
    );
    return data;
  } catch (error) {
    console.error("[crochetTutorService] AI provider failed:", error);
    throw new Error(
      error instanceof Error
        ? `Tutor AI failed: ${error.message}`
        : "Tutor AI failed. Please try again.",
    );
  }
}
