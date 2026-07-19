"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  findSavedPattern,
  type SavedPattern,
} from "@/lib/saved-patterns";

type Props = { params: Promise<{ patternId: string }> };

export default function PatternDetailPage({ params }: Props) {
  const [pattern, setPattern] = useState<SavedPattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ patternId: id }) => {
      // Support legacy index URLs like demo-0 for one release.
      const legacyMatch = id.match(/^demo-(\d+)$/);
      if (legacyMatch) {
        const index = Number(legacyMatch[1]);
        const raw = localStorage.getItem("stitch-saved-patterns");
        const patterns = raw ? (JSON.parse(raw) as SavedPattern[]) : [];
        const found = patterns[index] ?? null;
        setPattern(found);
        setMissing(!found);
        setLoading(false);
        return;
      }

      const found = findSavedPattern(id);
      setPattern(found);
      setMissing(!found);
      setLoading(false);
    });
  }, [params]);

  async function handleExportPdf() {
    if (!pattern) return;
    setExportError(null);
    setExporting(true);

    try {
      const response = await fetch("/api/export/pattern-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pattern.pattern),
      });

      const payload = (await response.json()) as {
        error?: string;
        dataUrl?: string;
        filename?: string;
      };

      if (!response.ok || !payload.dataUrl) {
        throw new Error(payload.error ?? "Failed to export PDF");
      }

      const link = document.createElement("a");
      link.href = payload.dataUrl;
      link.download = payload.filename ?? "pattern.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to export PDF",
      );
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <LoadingState label="Loading pattern…" />;
  if (missing || !pattern) {
    return (
      <EmptyState
        title="Pattern not found"
        description="This pattern may have been removed from this device."
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

        <div className="flex flex-wrap gap-2">
          <Button href="/workspace">Open workspace</Button>
          <Button
            type="button"
            variant="secondary"
            disabled={exporting}
            onClick={() => void handleExportPdf()}
          >
            {exporting ? "Exporting…" : "Export PDF"}
          </Button>
        </div>
        {exportError ? (
          <p className="text-sm text-stitch-coral">{exportError}</p>
        ) : null}
      </Card>
    </>
  );
}
