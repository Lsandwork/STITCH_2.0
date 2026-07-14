export type RowCounterState = {
  currentRow: number;
  completedRows: number[];
  notes: Record<number, string>;
  history: number[];
};

const MAX_HISTORY = 50;

export function storageKey(projectId: string, prefix = "stitch-row-counter"): string {
  return `${prefix}:${projectId}`;
}

export function createInitialState(initialRow = 1): RowCounterState {
  return { currentRow: initialRow, completedRows: [], notes: {}, history: [] };
}

export function clampRow(row: number, totalRows?: number): number {
  if (totalRows !== undefined) {
    return Math.max(1, Math.min(row, totalRows));
  }
  return Math.max(1, row);
}

export function pushHistory(
  history: number[],
  currentRow: number,
  maxSize = MAX_HISTORY,
): number[] {
  return [...history.slice(-(maxSize - 1)), currentRow];
}

export function computeProgressPercent(
  completedRows: number[],
  totalRows?: number,
): number {
  if (totalRows && totalRows > 0) {
    return Math.round((completedRows.length / totalRows) * 100);
  }
  return 0;
}

export function canUndo(history: number[]): boolean {
  return history.length > 0;
}

export function isRowComplete(state: RowCounterState): boolean {
  return state.completedRows.includes(state.currentRow);
}

export function applySetCurrentRow(
  state: RowCounterState,
  row: number,
  totalRows?: number,
): RowCounterState {
  const clamped = clampRow(row, totalRows);
  return {
    ...state,
    history: pushHistory(state.history, state.currentRow),
    currentRow: clamped,
  };
}

export function applyCompleteRow(
  state: RowCounterState,
  totalRows?: number,
): RowCounterState {
  const completed = state.completedRows.includes(state.currentRow)
    ? state.completedRows
    : [...state.completedRows, state.currentRow].sort((a, b) => a - b);
  const next =
    totalRows !== undefined
      ? Math.min(state.currentRow + 1, totalRows)
      : state.currentRow + 1;
  return {
    ...state,
    completedRows: completed,
    history: pushHistory(state.history, state.currentRow),
    currentRow: next,
  };
}

export function applyUndo(state: RowCounterState): RowCounterState {
  const last = state.history.at(-1);
  if (last === undefined) return state;
  return {
    ...state,
    currentRow: last,
    history: state.history.slice(0, -1),
    completedRows: state.completedRows.filter((r) => r !== state.currentRow),
  };
}

export function applyRepeatRow(state: RowCounterState): RowCounterState {
  return {
    ...state,
    history: pushHistory(state.history, state.currentRow),
  };
}

export function applySetNote(
  state: RowCounterState,
  row: number,
  note: string,
): RowCounterState {
  return {
    ...state,
    notes: { ...state.notes, [row]: note },
  };
}
