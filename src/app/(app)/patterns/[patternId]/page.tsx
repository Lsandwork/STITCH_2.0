"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PatternGenerationResultSchema } from "@/lib/schemas/pattern";

type Props = { params: Promise<{ patternId: string }> };

type SavedPattern = PatternGenerationResultSchema & { savedAt?: string };

export default function PatternDetailPage({ params }: Props) {
  const [pattern, setPattern] = useState<SavedPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    params.then(({ patternId: id }) => {
      const match = id.match(/^demo-(\d+)$/);
      if (!match) {
        setMissing(true);
        setLoading(false);
        return;
      }
      const index = Number(match[1]);
      const raw = localStorage.getItem("stitch-saved-patterns");
      const patterns = raw ? (JSON.parse(raw) as SavedPattern[]) : [];
      setPattern(patterns[index] ?? null);
      setMissing(!patterns[index]);
      setLoading(false);
    });
  }, [params]);

  if (loading) return <LoadingState label="Loading pattern…" />;
  if (missing || !pattern) {
    return (
      <EmptyState
        title="Pattern not found"
        description="This pattern may have been removed from local storage."
        actionLabel="Browse patterns"
        actionHref="/patterns"
      />
    );
  }

  return (
    <>
      <PageHeading
        title={pattern.pattern.title}
        description={`${pattern.pattern.projectType} · ${pattern.pattern.skillLevel}`}
        backHref="/patterns"
      />

      <Card padding="lg" className="max-w-3xl space-y-6">
        {pattern.pattern.description ? (
          <p className="text-sm text-stitch-muted">{pattern.pattern.description}</p>
        ) : null}

        <div>
          <h3 className="font-semibold">Materials</h3>
          <p className="text-sm">Hook: {pattern.pattern.materials.hookSize}</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {pattern.pattern.materials.yarns.map((yarn) => (
              <li key={yarn.colorName}>
                {yarn.colorName} ({yarn.weight})
              </li>
            ))}
          </ul>
        </div>

        {pattern.pattern.sections.map((section) => (
          <div key={section.name}>
            <h3 className="font-semibold">{section.name}</h3>
            <ol className="mt-2 space-y-1 font-mono text-sm">
              {section.rows.map((row) => (
                <li key={row.rowNumber}>
                  R{row.rowNumber}: {row.instruction}
                </li>
              ))}
            </ol>
          </div>
        ))}

        <div className="flex gap-2">
          <Button href="/workspace/demo-dachshund">Open in workspace</Button>
          <Button
            href={`/api/export/pattern-pdf?title=${encodeURIComponent(pattern.pattern.title)}`}
            variant="secondary"
          >
            Export PDF
          </Button>
        </div>
      </Card>
    </>
  );
}
