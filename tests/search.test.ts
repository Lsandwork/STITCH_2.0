import { describe, expect, it } from "vitest";
import { searchDemoData } from "@/services/recommendationService";

describe("searchDemoData", () => {
  it("returns empty results for blank query", () => {
    expect(searchDemoData("")).toEqual([]);
    expect(searchDemoData("   ")).toEqual([]);
  });

  it("finds projects by title", () => {
    const results = searchDemoData("dachshund");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe("project");
    expect(results[0].title.toLowerCase()).toContain("dachshund");
    expect(results[0].href).toMatch(/^\/workspace\//);
  });

  it("finds lessons by category or title", () => {
    const results = searchDemoData("magic ring");

    const lesson = results.find((r) => r.type === "lesson");
    expect(lesson).toBeDefined();
    expect(lesson?.href).toMatch(/^\/learn\//);
  });

  it("finds yarn inventory items", () => {
    const results = searchDemoData("bernat");

    const yarn = results.find((r) => r.type === "yarn");
    expect(yarn).toBeDefined();
    expect(yarn?.href).toBe("/yarn");
  });

  it("sorts by score descending and respects limit", () => {
    const results = searchDemoData("yarn", 2);

    expect(results.length).toBeLessThanOrEqual(2);
    for (let i = 1; i < results.length; i += 1) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("is case-insensitive", () => {
    const lower = searchDemoData("granny");
    const upper = searchDemoData("GRANNY");

    expect(lower.length).toBeGreaterThan(0);
    expect(upper.length).toBe(lower.length);
  });
});
