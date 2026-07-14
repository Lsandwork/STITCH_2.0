import { NextRequest } from "next/server";
import {
  jsonError,
  jsonSuccess,
  methodNotAllowed,
  parseJsonBody,
} from "@/lib/api-utils";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function getUserTermIds(): Promise<{ userId: string; termIds: string[] } | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_vocab_favorites")
    .select("term_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as Array<{ term_id: string }>;

  return {
    userId: user.id,
    termIds: rows.map((row) => row.term_id),
  };
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonError("Supabase not configured", 503);
  }

  try {
    const result = await getUserTermIds();
    if (!result) {
      return jsonError("Sign in to sync saved vocabulary", 401);
    }
    return jsonSuccess({ termIds: result.termIds });
  } catch (error) {
    console.error("[api/vocab/favorites GET]", error);
    return jsonError("Failed to load saved vocabulary", 500);
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("Supabase not configured", 503);
  }

  try {
    const body = (await parseJsonBody(request)) as { termId?: string };
    if (!body.termId) {
      return jsonError("termId is required", 400);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Supabase not configured", 503);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Sign in to save vocabulary", 401);
    }

    const { error } = await supabase.from("user_vocab_favorites").upsert(
      {
        user_id: user.id,
        term_id: body.termId,
      } as never,
      { onConflict: "user_id,term_id" },
    );

    if (error) throw error;

    const result = await getUserTermIds();
    return jsonSuccess({ termIds: result?.termIds ?? [] });
  } catch (error) {
    console.error("[api/vocab/favorites POST]", error);
    return jsonError("Failed to save vocabulary term", 500);
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("Supabase not configured", 503);
  }

  try {
    const body = (await parseJsonBody(request)) as { termId?: string };
    if (!body.termId) {
      return jsonError("termId is required", 400);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Supabase not configured", 503);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Sign in to manage saved vocabulary", 401);
    }

    const { error } = await supabase
      .from("user_vocab_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("term_id", body.termId);

    if (error) throw error;

    const result = await getUserTermIds();
    return jsonSuccess({ termIds: result?.termIds ?? [] });
  } catch (error) {
    console.error("[api/vocab/favorites DELETE]", error);
    return jsonError("Failed to remove saved vocabulary term", 500);
  }
}

export function PUT() {
  return methodNotAllowed();
}
