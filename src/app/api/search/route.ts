import { NextRequest } from "next/server";
import { jsonError, jsonSuccess, methodNotAllowed } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import { searchDemoData } from "@/services/recommendationService";

export async function GET(request: NextRequest) {
  const limit = rateLimit(request, { limit: 60, windowMs: 60_000 });
  if (!limit.success) {
    return jsonError("Rate limit exceeded. Try again shortly.", 429);
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limitParam = request.nextUrl.searchParams.get("limit");
  const maxResults = limitParam ? Number(limitParam) : 20;

  if (!q.trim()) {
    return jsonError('Query parameter "q" is required', 400);
  }

  const results = searchDemoData(q, Number.isFinite(maxResults) ? maxResults : 20);
  return jsonSuccess({ query: q, results, count: results.length }, limit);
}

export function POST() {
  return methodNotAllowed();
}
