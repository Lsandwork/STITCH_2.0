"use client";

import { useRowCounter } from "@/hooks/useRowCounter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type RowCounterProps = {
  projectId: string;
  initialRow?: number;
  totalRows?: number;
  onRowChange?: (row: number) => void;
  className?: string;
};

export function RowCounter({
  projectId,
  initialRow = 1,
  totalRows,
  onRowChange,
  className,
}: RowCounterProps) {
  const {
    currentRow,
    completedRows,
    canUndo,
    isComplete,
    progressPercent,
    setCurrentRow,
    nextRow,
    prevRow,
    completeRow,
    undo,
    repeatRow,
  } = useRowCounter({ projectId, initialRow, totalRows });

  function handleRowChange(row: number) {
    setCurrentRow(row);
    onRowChange?.(row);
  }

  return (
    <div className={cn("stitch-card p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stitch-muted">
            Row counter
          </p>
          <p className="text-3xl font-bold tabular-nums text-stitch-ink">
            {currentRow}
            {totalRows ? (
              <span className="text-lg font-medium text-stitch-muted">
                {" "}
                / {totalRows}
              </span>
            ) : null}
          </p>
        </div>
        {totalRows ? (
          <div className="text-right">
            <p className="text-xs text-stitch-muted">{progressPercent}% done</p>
            <p className="text-sm font-medium text-stitch-teal">
              {completedRows.length} completed
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => { prevRow(); onRowChange?.(currentRow - 1); }}>
          <StitchIcon name="chevron-left" tone="muted" size={16} />
          Prev
        </Button>
        <Button size="sm" onClick={completeRow}>
          <StitchIcon name="check" tone="default" size={16} />
          Complete
        </Button>
        <Button variant="secondary" size="sm" onClick={() => { nextRow(); onRowChange?.(currentRow + 1); }}>
          Next
          <StitchIcon name="chevron-right" tone="muted" size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={repeatRow}>
          Repeat
        </Button>
        <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo}>
          Undo
        </Button>
      </div>

      {totalRows ? (
        <div className="mt-4">
          <input
            type="range"
            min={1}
            max={totalRows}
            value={currentRow}
            onChange={(e) => handleRowChange(Number(e.target.value))}
            className="w-full accent-stitch-teal"
            aria-label="Jump to row"
          />
        </div>
      ) : null}

      {isComplete ? (
        <p className="mt-3 text-xs font-medium text-stitch-teal">
          Row {currentRow} marked complete
        </p>
      ) : null}
    </div>
  );
}
