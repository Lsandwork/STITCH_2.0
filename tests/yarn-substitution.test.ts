import { describe, expect, it } from "vitest";
import { findYarnSubstitutions } from "@/services/yarnSubstitutionService";

describe("yarnSubstitutionService", () => {
  it("returns ranked substitution recommendations", () => {
    const result = findYarnSubstitutions({
      sourceYarnName: "Red Heart Super Saver",
      requiredWeight: "worsted",
      requiredYardage: 200,
    });

    expect(result.sourceYarnName).toBe("Red Heart Super Saver");
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.bestMatchId).toBe(result.recommendations[0]?.yarnId);
    expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("prioritizes in-inventory yarns", () => {
    const result = findYarnSubstitutions({
      requiredWeight: "worsted",
    });

    const inventoryFirst = result.recommendations.every(
      (rec, index, arr) =>
        index === 0 || !arr[index - 1]?.inInventory || rec.inInventory,
    );
    expect(inventoryFirst).toBe(true);
  });

  it("sorts by compatibility score within inventory tier", () => {
    const result = findYarnSubstitutions({
      requiredWeight: "worsted",
    });

    const inventoryRecs = result.recommendations.filter((r) => r.inInventory);
    for (let i = 1; i < inventoryRecs.length; i += 1) {
      expect(inventoryRecs[i - 1].compatibilityScore).toBeGreaterThanOrEqual(
        inventoryRecs[i].compatibilityScore,
      );
    }
  });

  it("includes warnings for weight mismatches", () => {
    const result = findYarnSubstitutions({
      requiredWeight: "lace",
    });

    const withWarnings = result.recommendations.filter(
      (r) => r.warnings.length > 0,
    );
    expect(withWarnings.length).toBeGreaterThan(0);
  });

  it("rejects invalid input", () => {
    expect(() =>
      findYarnSubstitutions({ requiredYardage: -10 }),
    ).toThrow();
  });
});
