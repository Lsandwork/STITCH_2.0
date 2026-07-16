import type { YarnInventoryInput } from "@/lib/schemas/yarn";
import type { Database, YarnInventory } from "@/types/database";

export type VaultYarn = {
  id: string;
  brand: string | null;
  name: string;
  colorName: string | null;
  colorHex: string | null;
  weight: string | null;
  fiberContent: string | null;
  yardage: number | null;
  weightGrams: number | null;
  quantitySkeins: number;
  notes: string | null;
  recommendedHook: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type YarnInsert = Database["public"]["Tables"]["yarn_inventory"]["Insert"];

const HOOK_PREFIX = "Hook: ";

function cleanOptional(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function buildNotes(input: YarnInventoryInput): string | null {
  const lines: string[] = [];
  if (input.notes?.trim()) lines.push(input.notes.trim());
  if (input.recommendedHook?.trim()) {
    lines.push(`${HOOK_PREFIX}${input.recommendedHook.trim()}`);
  }
  if (input.careInstructions?.trim()) {
    lines.push(`Care: ${input.careInstructions.trim()}`);
  }
  if (input.storageLocation?.trim()) {
    lines.push(`Storage: ${input.storageLocation.trim()}`);
  }
  if (input.purchaseDate?.trim()) {
    lines.push(`Purchased: ${input.purchaseDate.trim()}`);
  }
  if (input.purchasePrice !== undefined) {
    lines.push(`Price: $${input.purchasePrice.toFixed(2)}`);
  }
  if (input.barcode?.trim()) {
    lines.push(`Barcode: ${input.barcode.trim()}`);
  }
  if (input.lowStockThreshold !== undefined) {
    lines.push(`Low stock alert: ${input.lowStockThreshold} skein(s)`);
  }
  return lines.length > 0 ? lines.join("\n") : null;
}

function extractRecommendedHook(notes: string | null): string | null {
  if (!notes) return null;
  const line = notes
    .split("\n")
    .find((entry) => entry.startsWith(HOOK_PREFIX));
  return line ? line.slice(HOOK_PREFIX.length).trim() : null;
}

export function mapInputToInsert(
  userId: string,
  input: YarnInventoryInput,
): YarnInsert {
  return {
    user_id: userId,
    brand: cleanOptional(input.brand),
    name: input.name.trim(),
    color_name: cleanOptional(input.colorName),
    color_hex: cleanOptional(input.colorHex),
    weight: cleanOptional(input.weight),
    fiber_content: cleanOptional(input.fiberContent),
    yardage: input.yardage ?? null,
    weight_grams: input.weightGrams ?? null,
    quantity_skeins: input.quantitySkeins ?? 1,
    notes: buildNotes(input),
    image_url: null,
    storage_path: null,
  };
}

export function mapRowToVaultYarn(row: YarnInventory): VaultYarn {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    colorName: row.color_name,
    colorHex: row.color_hex,
    weight: row.weight,
    fiberContent: row.fiber_content,
    yardage: row.yardage,
    weightGrams: row.weight_grams,
    quantitySkeins: Number(row.quantity_skeins),
    notes: row.notes,
    recommendedHook: extractRecommendedHook(row.notes),
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapInputToUpdate(
  input: YarnInventoryInput,
): Database["public"]["Tables"]["yarn_inventory"]["Update"] {
  const insert = mapInputToInsert("ignored", input);
  const { user_id, ...update } = insert;
  void user_id;
  return update;
}

export function getVaultSummary(yarns: VaultYarn[]) {
  const lowStockCount = yarns.filter((yarn) => yarn.quantitySkeins <= 1).length;
  return {
    totalYarns: yarns.length,
    lowStockCount,
    featuredYarnIds: yarns.slice(0, 3).map((yarn) => yarn.id),
  };
}
