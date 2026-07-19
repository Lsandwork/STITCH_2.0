"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  ensureSavedPatternId,
  readSavedPatterns,
  type SavedPattern,
} from "@/lib/saved-patterns";

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<SavedPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPatterns(readSavedPatterns());
    setLoading(false);
  }, []);

  return (
    <>
      <PageHeading
        title="Saved Patterns"
        description="AI-generated patterns saved on this device."
        actionLabel="Generate pattern"
        actionHref="/create/pattern"
      />

      {loading ? <LoadingState label="Loading patterns…" /> : null}

      {!loading && patterns.length === 0 ? (
        <EmptyState
          title="No saved patterns yet"
          description="Generate your first AI pattern or upload an existing one. Saves stay on this browser until cloud sync is available."
          actionLabel="Create pattern"
          actionHref="/create/pattern"
        />
      ) : (
        <ul className="space-y-3">
          {patterns.map((item) => {
            const id = ensureSavedPatternId(item);
            return (
              <li key={id}>
                <Link href={`/patterns/${id}`}>
                  <Card className="transition-colors hover:bg-stitch-cream/50">
                    <h3 className="font-semibold text-stitch-ink">
                      {item.pattern.title}
                    </h3>
                    <p className="mt-1 text-sm text-stitch-muted">
                      {item.pattern.projectType} · {item.pattern.skillLevel}
                    </p>
                    {item.savedAt ? (
                      <p className="mt-1 text-xs text-stitch-muted">
                        Saved {new Date(item.savedAt).toLocaleDateString()}
                      </p>
                    ) : null}
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Button href="/create/photo" variant="secondary" className="mt-6">
        From a photo
      </Button>
    </>
  );
}
