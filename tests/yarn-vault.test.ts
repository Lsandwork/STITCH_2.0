import { describe, expect, it } from "vitest";
import {
  getVaultSummary,
  mapInputToInsert,
  mapInputToUpdate,
  mapRowToVaultYarn,
} from "@/services/yarnService";

describe("yarnService", () => {
  it("maps form input to database insert shape", () => {
    const insert = mapInputToInsert("user-123", {
      name: "Soft Merino",
      brand: "Cascade",
      colorName: "Sage",
      weight: "worsted",
      fiberContent: "100% merino wool",
      recommendedHook: "5.0 mm",
      quantitySkeins: 2,
    });

    expect(insert.user_id).toBe("user-123");
    expect(insert.name).toBe("Soft Merino");
    expect(insert.color_name).toBe("Sage");
    expect(insert.quantity_skeins).toBe(2);
    expect(insert.notes).toContain("Hook: 5.0 mm");
  });

  it("maps database rows back to vault yarn", () => {
    const yarn = mapRowToVaultYarn({
      id: "yarn-1",
      user_id: "user-123",
      brand: "Cascade",
      name: "Soft Merino",
      color_name: "Sage",
      color_hex: "#8FA68E",
      weight: "worsted",
      fiber_content: "100% merino wool",
      yardage: 220,
      weight_grams: 100,
      quantity_skeins: 2,
      image_url: null,
      storage_path: null,
      notes: "Hook: 5.0 mm",
      created_at: "2026-07-15T00:00:00.000Z",
      updated_at: "2026-07-15T00:00:00.000Z",
    });

    expect(yarn.recommendedHook).toBe("5.0 mm");
    expect(yarn.quantitySkeins).toBe(2);
  });

  it("builds vault summary counts", () => {
    const summary = getVaultSummary([
      {
        id: "1",
        brand: null,
        name: "A",
        colorName: null,
        colorHex: null,
        weight: null,
        fiberContent: null,
        yardage: null,
        weightGrams: null,
        quantitySkeins: 2,
        notes: null,
        recommendedHook: null,
        imageUrl: null,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: "2",
        brand: null,
        name: "B",
        colorName: null,
        colorHex: null,
        weight: null,
        fiberContent: null,
        yardage: null,
        weightGrams: null,
        quantitySkeins: 1,
        notes: null,
        recommendedHook: null,
        imageUrl: null,
        createdAt: "",
        updatedAt: "",
      },
    ]);

    expect(summary.totalYarns).toBe(2);
    expect(summary.lowStockCount).toBe(1);
  });

  it("omits user_id from update payload", () => {
    const update = mapInputToUpdate({
      name: "Updated Yarn",
      quantitySkeins: 3,
    });

    expect(update).not.toHaveProperty("user_id");
    expect(update.name).toBe("Updated Yarn");
    expect(update.quantity_skeins).toBe(3);
  });
});
