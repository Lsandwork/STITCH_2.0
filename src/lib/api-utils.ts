import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { rateLimitHeaders, type RateLimitResult } from "@/lib/rate-limit";
import { isMockMode } from "@/services/ai/provider";

export function jsonError(
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json(
    {
      error: message,
      details: details ?? undefined,
      demoMode: isMockMode(),
    },
    { status },
  );
}

export function zodErrorResponse(error: ZodError) {
  return jsonError("Validation failed", 400, error.flatten());
}

export function jsonSuccess<T extends Record<string, unknown>>(
  data: T,
  rateLimit?: RateLimitResult,
) {
  return NextResponse.json(
    { ...data, demoMode: isMockMode() },
    {
      status: 200,
      headers: rateLimit ? rateLimitHeaders(rateLimit) : undefined,
    },
  );
}

export function methodNotAllowed() {
  return jsonError("Method not allowed", 405);
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON body");
  }
}
