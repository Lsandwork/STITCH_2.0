import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
  parseJsonBody,
  zodErrorResponse,
} from "@/lib/api-utils";
import { socialAiRecommendationsInputSchema } from "@/lib/schemas/social";
import { rateLimit } from "@/lib/rate-limit";
import { getSocialRecommendations } from "@/services/socialRecommendationService";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  const limit = rateLimit(request);
  if (!limit.success) {
    return jsonError("Rate limit exceeded. Try again shortly.", 429);
  }

  try {
    const body = await parseJsonBody(request);
    const input = socialAiRecommendationsInputSchema.parse(body);
    const result = await getSocialRecommendations(input);
    return jsonSuccess({ result }, limit);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof Error && error.message === "Invalid JSON body") {
      return jsonError("Invalid JSON body", 400);
    }
    console.error("[api/social/ai/recommendations]", error);
    return jsonError("Failed to get recommendations", 500);
  }
}

export function GET() {
  return methodNotAllowed();
}
