import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
  parseJsonBody,
  zodErrorResponse,
} from "@/lib/api-utils";
import { marketplaceProcessInputSchema } from "@/lib/schemas/marketplace";
import { rateLimit } from "@/lib/rate-limit";
import { processMarketplaceListing } from "@/services/marketplaceService";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  const limit = rateLimit(request);
  if (!limit.success) {
    return jsonError("Rate limit exceeded. Try again shortly.", 429);
  }

  try {
    const body = await parseJsonBody(request);
    const input = marketplaceProcessInputSchema.parse(body);
    const result = await processMarketplaceListing(input);
    return jsonSuccess({ result }, limit);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof Error && error.message === "Invalid JSON body") {
      return jsonError("Invalid JSON body", 400);
    }
    console.error("[api/marketplace/process]", error);
    return jsonError("Failed to process listing", 500);
  }
}

export function GET() {
  return methodNotAllowed();
}
