import {
  VOCAB_FAVORITES_KEY,
  VOCAB_RECENT_KEY,
  VOCAB_RECENT_LIMIT,
} from "@/lib/vocab-constants";

export function getLocalVocabFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VOCAB_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function saveLocalVocabFavorites(termIds: string[]): void {
  localStorage.setItem(VOCAB_FAVORITES_KEY, JSON.stringify(termIds));
}

export function toggleLocalVocabFavorite(termId: string): string[] {
  const current = new Set(getLocalVocabFavorites());
  if (current.has(termId)) {
    current.delete(termId);
  } else {
    current.add(termId);
  }
  const next = [...current];
  saveLocalVocabFavorites(next);
  return next;
}

export function getRecentVocabTermIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VOCAB_RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export function recordRecentVocabTerm(termId: string): string[] {
  const current = getRecentVocabTermIds().filter((id) => id !== termId);
  const next = [termId, ...current].slice(0, VOCAB_RECENT_LIMIT);
  localStorage.setItem(VOCAB_RECENT_KEY, JSON.stringify(next));
  return next;
}

export async function fetchRemoteVocabFavorites(): Promise<string[] | null> {
  try {
    const response = await fetch("/api/vocab/favorites", { method: "GET" });
    if (response.status === 401 || response.status === 503) return null;
    if (!response.ok) return null;
    const payload = (await response.json()) as { termIds?: string[] };
    return Array.isArray(payload.termIds) ? payload.termIds : [];
  } catch {
    return null;
  }
}

export async function syncRemoteVocabFavorite(
  termId: string,
  saved: boolean,
): Promise<string[] | null> {
  try {
    const response = await fetch("/api/vocab/favorites", {
      method: saved ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ termId }),
    });
    if (response.status === 401 || response.status === 503) return null;
    if (!response.ok) return null;
    const payload = (await response.json()) as { termIds?: string[] };
    return Array.isArray(payload.termIds) ? payload.termIds : null;
  } catch {
    return null;
  }
}
