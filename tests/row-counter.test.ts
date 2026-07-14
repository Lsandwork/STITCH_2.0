import { describe, expect, it } from "vitest";
import {
  applyCompleteRow,
  applyRepeatRow,
  applySetCurrentRow,
  applySetNote,
  applyUndo,
  canUndo,
  clampRow,
  computeProgressPercent,
  createInitialState,
  isRowComplete,
  pushHistory,
} from "@/lib/row-counter-logic";

describe("row-counter-logic", () => {
  it("clamps row within total bounds", () => {
    expect(clampRow(0, 10)).toBe(1);
    expect(clampRow(15, 10)).toBe(10);
    expect(clampRow(5, 10)).toBe(5);
    expect(clampRow(-3)).toBe(1);
  });

  it("tracks undo history with a max size", () => {
    let history: number[] = [];
    for (let i = 1; i <= 55; i += 1) {
      history = pushHistory(history, i);
    }
    expect(history).toHaveLength(50);
    expect(history.at(-1)).toBe(55);
    expect(history[0]).toBe(6);
  });

  it("computes progress percent from completed rows", () => {
    expect(computeProgressPercent([1, 2, 3], 10)).toBe(30);
    expect(computeProgressPercent([], 10)).toBe(0);
    expect(computeProgressPercent([1, 2], undefined)).toBe(0);
  });

  it("advances row and marks completion", () => {
    const initial = createInitialState(1);
    const afterComplete = applyCompleteRow(initial, 5);

    expect(afterComplete.completedRows).toEqual([1]);
    expect(afterComplete.currentRow).toBe(2);
    expect(canUndo(afterComplete.history)).toBe(true);
    expect(isRowComplete(afterComplete)).toBe(false);
  });

  it("does not duplicate completed rows", () => {
    const state = {
      ...createInitialState(2),
      completedRows: [2],
    };
    const after = applyCompleteRow(state, 10);

    expect(after.completedRows).toEqual([2]);
    expect(after.currentRow).toBe(3);
  });

  it("restores previous row on undo and removes completion", () => {
    let state = createInitialState(1);
    state = applySetCurrentRow(state, 3, 10);
    state = applyCompleteRow(state, 10);
    state = applyUndo(state);

    expect(state.currentRow).toBe(3);
    expect(state.completedRows).not.toContain(4);
    expect(canUndo(state.history)).toBe(true);
    expect(state.history).toEqual([1]);
  });

  it("records repeat without changing current row", () => {
    const state = applyRepeatRow(createInitialState(4));

    expect(state.currentRow).toBe(4);
    expect(state.history).toEqual([4]);
  });

  it("stores row notes", () => {
    const state = applySetNote(createInitialState(1), 3, "Check tension");

    expect(state.notes[3]).toBe("Check tension");
  });
});
