import {
  socialAiRecommendationsInputSchema,
  socialAiRecommendationsResultSchema,
  type SocialAiRecommendationsResult,
} from "@/lib/schemas/social";
import { generateJSONWithFallback, isMockMode } from "@/services/ai/provider";

function buildMockRecommendations(
  skillLevel: string,
  interests: string[],
): SocialAiRecommendationsResult {
  const interestHint = interests.length > 0 ? interests.join(", ") : "general crochet";

  return {
    projectSuggestions: [
      {
        title: "Mini Bee Amigurumi",
        description: "A quick 2-hour stash buster perfect for gift season.",
        reason: `Matches your ${skillLevel} level and interest in ${interestHint}`,
        skillLevel: skillLevel as "beginner" | "intermediate" | "advanced",
        href: "/create/pattern",
      },
      {
        title: "Textured Dishcloth Set",
        description: "Learn new stitch patterns with a practical kitchen project.",
        reason: "Great warm-up project between larger WIPs",
        skillLevel: "beginner",
        href: "/create/pattern",
      },
      {
        title: "Colorblock Market Tote",
        description: "Combine your favorite colors in a sturdy everyday bag.",
        reason: "Trending in the community this week",
        skillLevel: "intermediate",
        href: "/marketplace/mp-sunflower-tote",
      },
    ],
    makerMatches: [
      {
        makerId: "maker-maya",
        displayName: "Maya Chen",
        handle: "@mayastitches",
        matchScore: 92,
        matchReason: "Specializes in amigurumi at your skill level",
        specialties: ["amigurumi", "colorwork", "design"],
      },
      {
        makerId: "maker-elena",
        displayName: "Elena Wright",
        handle: "@elena_hooks",
        matchScore: 85,
        matchReason: "Active in beginner-friendly groups you might enjoy",
        specialties: ["blankets", "granny squares", "community"],
      },
      {
        makerId: "maker-sam",
        displayName: "Sam Rivera",
        handle: "@samhooks",
        matchScore: 78,
        matchReason: "Similar project pace and weekend maker schedule",
        specialties: ["beginner", "quick makes", "stash busting"],
      },
    ],
    patternFinds: [
      {
        title: "Longbody Dachshund Amigurumi",
        description: "4.9★ · 1,247 downloads · Intermediate amigurumi",
        href: "/marketplace/mp-dachshund-plushie",
        reason: "Top-rated in amigurumi this month",
      },
      {
        title: "Classic Granny Square Throw",
        description: "4.7★ · Beginner friendly · Join-as-you-go method",
        href: "/marketplace/mp-granny-throw",
        reason: "Perfect first blanket project",
      },
    ],
    groupRecommendations: [
      {
        groupId: "group-amigurumi",
        name: "Amigurumi Makers United",
        reason: "8,420 members sharing plushie WIPs daily",
      },
      {
        groupId: "group-beginners",
        name: "Crochet Beginners Circle",
        reason: "Supportive space matched to your skill level",
      },
      {
        groupId: "group-stash",
        name: "Stash Busters Anonymous",
        reason: "Weekly challenges to use leftover yarn",
      },
    ],
  };
}

export async function getSocialRecommendations(
  input: unknown,
): Promise<SocialAiRecommendationsResult> {
  const validated = socialAiRecommendationsInputSchema.parse(input);

  if (isMockMode()) {
    return buildMockRecommendations(validated.skillLevel, validated.interests);
  }

  const prompt = `You are the AI social assistant for Stitch — a crochet community (Instagram meets Ravelry).

User profile:
- Skill level: ${validated.skillLevel}
- Interests: ${validated.interests.join(", ") || "general crochet"}
- Recent projects: ${validated.recentProjects.join(", ") || "none listed"}
- Following count: ${validated.followingCount}

Provide personalized recommendations:
1. projectSuggestions (3 items) — title, description, reason, skillLevel, href (use /create/pattern or /marketplace/mp-* paths)
2. makerMatches (3 items) — makerId, displayName, handle, matchScore 0-100, matchReason, specialties
3. patternFinds (2 items) — title, description, href (/marketplace/...), reason
4. groupRecommendations (3 items) — groupId (group-amigurumi, group-beginners, group-garments, group-stash, group-market, group-vision), name, reason

Use realistic crochet community language. Respond as JSON.`;

  try {
    const { data } = await generateJSONWithFallback(
      prompt,
      socialAiRecommendationsResultSchema,
    );
    return data;
  } catch (error) {
    console.error("[getSocialRecommendations] AI failed:", error);
    throw new Error(
      error instanceof Error
        ? `Social AI failed: ${error.message}`
        : "Social AI failed. Please try again.",
    );
  }
}
