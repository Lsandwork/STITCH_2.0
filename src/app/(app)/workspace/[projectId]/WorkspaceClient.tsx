"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { RowCounter } from "@/components/stitch/RowCounter";
import { VoiceControls } from "@/components/stitch/VoiceControls";
import { FeatureGate } from "@/components/stitch/FeatureGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { useRowCounter } from "@/hooks/useRowCounter";
import type { VoiceCommandAction } from "@/hooks/useVoiceAssistant";
import {
  flattenPatternRows,
  getDemoWorkspacePattern,
  getTotalRows,
} from "@/lib/demo-patterns";
import { getSubscriptionTier } from "@/lib/demo-session";
import { cn } from "@/lib/utils";

export default function WorkspaceClient() {
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const projectId = params.projectId;
  const tier = getSubscriptionTier();
  const pattern = getDemoWorkspacePattern(projectId);
  const rows = useMemo(
    () => (pattern ? flattenPatternRows(pattern) : []),
    [pattern],
  );
  const totalRows = pattern ? getTotalRows(pattern) : 0;

  const {
    currentRow,
    notes,
    setCurrentRow,
    nextRow,
    prevRow,
    completeRow,
    undo,
    repeatRow,
    setNote,
  } = useRowCounter({
    projectId,
    initialRow: pattern?.currentRow ?? 1,
    totalRows,
  });

  const [noteDraft, setNoteDraft] = useState("");
  const [explainOpen, setExplainOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const activeRow = rows.find((r) => r.rowNumber === currentRow);

  useEffect(() => {
    setNoteDraft(notes[currentRow] ?? "");
  }, [currentRow, notes]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const handleVoiceCommand = useCallback(
    (action: VoiceCommandAction) => {
      switch (action) {
        case "next":
          nextRow();
          break;
        case "prev":
          prevRow();
          break;
        case "complete":
          completeRow();
          break;
        case "repeat":
          repeatRow();
          break;
        case "undo":
          undo();
          break;
        case "explain":
          setExplainOpen(true);
          break;
        case "read":
          break;
      }
    },
    [nextRow, prevRow, completeRow, repeatRow, undo],
  );

  function saveNote() {
    setNote(currentRow, noteDraft);
  }

  if (!pattern) {
    return (
      <EmptyState
        title="Project not found"
        description="This workspace pattern isn't available in demo mode."
        actionLabel="Browse projects"
        actionHref="/projects"
      />
    );
  }

  const readAloud = activeRow
    ? `Row ${activeRow.rowNumber}. ${activeRow.instruction}`
    : undefined;

  return (
    <>
      <PageHeading
        title={pattern.title}
        description={`Pattern workspace · Row ${currentRow} of ${totalRows}`}
        backHref="/projects"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card padding="lg" className="overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-stitch-lg bg-stitch-cream sm:mx-0">
                <Image
                  src={pattern.imageUrl}
                  alt={pattern.title}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                {activeRow ? (
                  <>
                    <Badge variant="teal">Row {activeRow.rowNumber}</Badge>
                    <p className="mt-3 font-mono text-lg leading-relaxed text-stitch-ink">
                      {activeRow.instruction}
                    </p>
                    {activeRow.stitchCount !== null ? (
                      <p className="mt-2 text-sm text-stitch-muted">
                        Stitch count: {activeRow.stitchCount}
                      </p>
                    ) : null}
                    {activeRow.notes ? (
                      <p className="mt-2 rounded-stitch-md bg-stitch-cream px-3 py-2 text-sm text-stitch-muted">
                        {activeRow.notes}
                      </p>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={prevRow}>
                Previous
              </Button>
              <Button size="sm" onClick={completeRow}>
                Complete row
              </Button>
              <Button variant="secondary" size="sm" onClick={nextRow}>
                Next
              </Button>
              <Button variant="ghost" size="sm" onClick={repeatRow}>
                Repeat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExplainOpen((v) => !v)}
              >
                Explain
              </Button>
              <Button variant="ghost" size="sm" onClick={undo}>
                Undo
              </Button>
              <Button href="/vision/scan" variant="ghost" size="sm">
                <StitchIcon name="camera" tone="muted" size={16} />
                Scan
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTimerRunning((r) => !r)}
              >
                Timer {Math.floor(timerSeconds / 60)}:
                {String(timerSeconds % 60).padStart(2, "0")}
              </Button>
            </div>

            {explainOpen && activeRow ? (
              <div className="mt-4 rounded-stitch-md border border-stitch-border bg-stitch-mint/30 p-4 text-sm">
                <strong>Explain:</strong> Work{" "}
                {activeRow.instruction.toLowerCase()}.
                {activeRow.stitchCount
                  ? ` You should have ${activeRow.stitchCount} stitches when finished.`
                  : ""}
              </div>
            ) : null}

            <div className="mt-4">
              <label className="text-sm font-medium">Row note</label>
              <div className="mt-1 flex gap-2">
                <input
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add a note for this row…"
                  className="flex-1 rounded-stitch-md border border-stitch-border px-3 py-2 text-sm"
                />
                <Button size="sm" variant="secondary" onClick={saveNote}>
                  Save
                </Button>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <h3 className="mb-3 text-sm font-semibold">All rows</h3>
            <ol className="max-h-64 space-y-1 overflow-y-auto text-sm">
              {rows.map((row) => (
                <li key={row.rowNumber}>
                  <button
                    type="button"
                    onClick={() => setCurrentRow(row.rowNumber)}
                    className={cn(
                      "w-full rounded-stitch-sm px-2 py-1.5 text-left font-mono transition-colors hover:bg-stitch-cream",
                      row.rowNumber === currentRow &&
                        "bg-stitch-peach text-stitch-coral",
                    )}
                  >
                    R{row.rowNumber}: {row.instruction}
                  </button>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-4">
          <RowCounter
            projectId={projectId}
            initialRow={pattern.currentRow}
            totalRows={totalRows}
            onRowChange={setCurrentRow}
          />

          <FeatureGate tier={tier} feature="voice_pattern_player">
            <div id="voice-controls">
              <VoiceControls
                onCommand={handleVoiceCommand}
                readAloudText={readAloud}
                autoStart={searchParams.get("voice") === "1"}
              />
            </div>
          </FeatureGate>

          <Card padding="md">
            <h3 className="text-sm font-semibold">Quick links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link
                  href="/tutor"
                  className="text-stitch-coral hover:underline"
                >
                  Ask Tutor about this row
                </Link>
              </li>
              <li>
                <Link
                  href="/vision/live"
                  className="text-stitch-coral hover:underline"
                >
                  Live stitch check
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
