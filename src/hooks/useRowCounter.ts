"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyCompleteRow,
  applyRepeatRow,
  applySetCurrentRow,
  applySetNote,
  applyUndo,
  canUndo,
  computeProgressPercent,
  createInitialState,
  isRowComplete,
  storageKey,
  type RowCounterState,
} from "@/lib/row-counter-logic";

type UseRowCounterOptions = {
  projectId: string;
  initialRow?: number;
  totalRows?: number;
  storageKeyPrefix?: string;
};

function loadState(key: string, initialRow: number): RowCounterState {
  if (typeof window === "undefined") {
    return createInitialState(initialRow);
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return createInitialState(initialRow);
    }
    return JSON.parse(raw) as RowCounterState;
  } catch {
    return createInitialState(initialRow);
  }
}

export function useRowCounter({
  projectId,
  initialRow = 1,
  totalRows,
  storageKeyPrefix,
}: UseRowCounterOptions) {
  const key = useMemo(
    () => storageKey(projectId, storageKeyPrefix),
    [projectId, storageKeyPrefix],
  );

  const [state, setState] = useState<RowCounterState>(() =>
    loadState(key, initialRow),
  );

  useEffect(() => {
    setState(loadState(key, initialRow));
  }, [key, initialRow]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const setCurrentRow = useCallback(
    (row: number) => {
      setState((prev) => applySetCurrentRow(prev, row, totalRows));
    },
    [totalRows],
  );

  const nextRow = useCallback(() => {
    setCurrentRow(state.currentRow + 1);
  }, [setCurrentRow, state.currentRow]);

  const prevRow = useCallback(() => {
    setCurrentRow(state.currentRow - 1);
  }, [setCurrentRow, state.currentRow]);

  const completeRow = useCallback(() => {
    setState((prev) => applyCompleteRow(prev, totalRows));
  }, [totalRows]);

  const undo = useCallback(() => {
    setState((prev) => applyUndo(prev));
  }, []);

  const setNote = useCallback((row: number, note: string) => {
    setState((prev) => applySetNote(prev, row, note));
  }, []);

  const repeatRow = useCallback(() => {
    setState((prev) => applyRepeatRow(prev));
  }, []);

  return {
    currentRow: state.currentRow,
    completedRows: state.completedRows,
    notes: state.notes,
    canUndo: canUndo(state.history),
    isComplete: isRowComplete(state),
    progressPercent: computeProgressPercent(state.completedRows, totalRows),
    setCurrentRow,
    nextRow,
    prevRow,
    completeRow,
    undo,
    repeatRow,
    setNote,
  };
}
