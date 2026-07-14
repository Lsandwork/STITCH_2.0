import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
  parseJsonBody,
  zodErrorResponse,
} from "@/lib/api-utils";
import { generatedPatternSchema } from "@/lib/schemas/pattern";
import { rateLimit } from "@/lib/rate-limit";
import { validatePattern } from "@/services/patternValidationService";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  const limit = rateLimit(request);
  if (!limit.success) {
    return jsonError("Rate limit exceeded. Try again shortly.", 429);
  }

  try {
    const body = await parseJsonBody(request);
    const pattern = generatedPatternSchema.parse(body);
    const validation = validatePattern(pattern);
    return jsonSuccess({ validation }, limit);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof Error && error.message === "Invalid JSON body") {
      return jsonError("Invalid JSON body", 400);
    }
    console.error("[api/ai/validate]", error);
    return jsonError("Failed to validate pattern", 500);
  }
}

export function GET() {
  return methodNotAllowed();
}
