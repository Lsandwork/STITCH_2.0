import { z } from "zod";
import { normalizeGeneratedPatternJson } from "@/lib/ai-pattern-normalize";

/** Coerce AI output values into plain strings. */
export function coerceAiString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => coerceAiString(item))
      .filter(Boolean) as string[];
    return parts.length > 0 ? parts.join(" ") : undefined;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of [
      "text",
      "instruction",
      "value",
      "content",
      "description",
      "note",
      "notes",
    ]) {
      const nested = coerceAiString(obj[key]);
      if (nested) return nested;
    }
    try {
      return JSON.stringify(value);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function normalizeConstruction(
  value: unknown,
): "sewn" | "low_sew" | "seamless" | undefined {
  const text = coerceAiString(value)?.toLowerCase();
  if (!text) return undefined;
  if (text.includes("seamless")) return "seamless";
  if (text.includes("low")) return "low_sew";
  if (text.includes("seam") || text.includes("sew")) return "sewn";
  return undefined;
}

function normalizeSkillLevel(
  value: unknown,
): "beginner" | "intermediate" | "advanced" | undefined {
  const text = coerceAiString(value)?.toLowerCase();
  if (!text) return undefined;
  if (text.includes("advanced")) return "advanced";
  if (text.includes("intermediate") || text.includes("confident")) {
    return "intermediate";
  }
  if (text.includes("beginner") || text.includes("easy")) return "beginner";
  return undefined;
}

function normalizeTerminology(value: unknown): "us" | "uk" | undefined {
  const text = coerceAiString(value)?.toLowerCase();
  if (!text) return undefined;
  if (text.includes("uk") || text.includes("british")) return "uk";
  if (text.includes("us") || text.includes("american")) return "us";
  return undefined;
}

function normalizeOptionalUrl(value: unknown): string | undefined {
  const text = coerceAiString(value);
  if (!text) return undefined;
  try {
    const url = new URL(text);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return text;
    }
  } catch {
    // drop invalid urls
  }
  return undefined;
}

function normalizeIsoDateTime(value: unknown): string {
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  return new Date().toISOString();
}

function normalizeAbbreviations(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record: Record<string, string> = {};
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
      const text = coerceAiString(raw);
      if (text) record[key] = text;
    }
    if (Object.keys(record).length > 0) return record;
  }

  if (Array.isArray(value)) {
    const record: Record<string, string> = {};
    for (const item of value) {
      if (typeof item === "object" && item !== null) {
        const obj = item as Record<string, unknown>;
        const abbr = coerceAiString(obj.abbr ?? obj.abbreviation ?? obj.key);
        const meaning = coerceAiString(obj.meaning ?? obj.definition ?? obj.value);
        if (abbr && meaning) record[abbr] = meaning;
      } else {
        const text = coerceAiString(item);
        if (text) {
          const [abbr, ...rest] = text.split(":");
          if (abbr && rest.length > 0) {
            record[abbr.trim()] = rest.join(":").trim();
          }
        }
      }
    }
    if (Object.keys(record).length > 0) return record;
  }

  return {
    sc: "single crochet",
    inc: "increase",
    dec: "decrease",
    MR: "magic ring",
  };
}

/** Repair common AI JSON shape issues before Zod validation. */
export function repairAiJson(data: unknown): unknown {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  const obj = { ...(data as Record<string, unknown>) };

  if ("sections" in obj) {
    return repairPatternJson(obj);
  }

  if ("projectType" in obj && "confidence" in obj) {
    obj.projectType = coerceAiString(obj.projectType) ?? "amigurumi";
    obj.description =
      coerceAiString(obj.description) ??
      "Handmade crochet project inspired by uploaded photo.";
    obj.construction = coerceAiString(obj.construction);
    if (Array.isArray(obj.colors)) {
      obj.colors = obj.colors
        .map((color) => {
          if (color && typeof color === "object") {
            const record = color as Record<string, unknown>;
            return (
              coerceAiString(record.name) ??
              coerceAiString(record.color) ??
              coerceAiString(record.value)
            );
          }
          return coerceAiString(color);
        })
        .filter(Boolean);
    } else {
      obj.colors = [];
    }
    if (Array.isArray(obj.inspirationNotes)) {
      obj.inspirationNotes = obj.inspirationNotes
        .map((note) => {
          if (note && typeof note === "object") {
            return coerceAiString((note as Record<string, unknown>).note);
          }
          return coerceAiString(note);
        })
        .filter(Boolean);
    } else {
      obj.inspirationNotes = [];
    }
    if (typeof obj.confidence !== "number") {
      obj.confidence = Number(obj.confidence);
    }
    if (
      typeof obj.confidence !== "number" ||
      Number.isNaN(obj.confidence) ||
      obj.confidence < 0 ||
      obj.confidence > 1
    ) {
      obj.confidence = 0.5;
    }
    return obj;
  }

  return obj;
}

export function repairPatternJson(data: Record<string, unknown>): unknown {
  let obj = normalizeGeneratedPatternJson(data) as Record<string, unknown>;

  obj.title = coerceAiString(obj.title) ?? "Generated Pattern";
  obj.description = coerceAiString(obj.description);
  obj.projectType = coerceAiString(obj.projectType) ?? "amigurumi";

  const skill = normalizeSkillLevel(obj.skillLevel ?? obj.difficulty);
  if (skill) {
    obj.skillLevel = skill;
    obj.difficulty = skill;
  }

  const terminology = normalizeTerminology(obj.terminology);
  if (terminology) obj.terminology = terminology;

  const previewImageUrl = normalizeOptionalUrl(obj.previewImageUrl);
  if (previewImageUrl) obj.previewImageUrl = previewImageUrl;
  else delete obj.previewImageUrl;

  obj.abbreviations = normalizeAbbreviations(obj.abbreviations);

  if (obj.metadata && typeof obj.metadata === "object") {
    const metadata = { ...(obj.metadata as Record<string, unknown>) };
    const construction = normalizeConstruction(metadata.construction);
    if (construction) metadata.construction = construction;
    obj.metadata = metadata;
  }

  if (obj.validation && typeof obj.validation === "object") {
    const validation = { ...(obj.validation as Record<string, unknown>) };
    validation.checkedAt = normalizeIsoDateTime(validation.checkedAt);
    if (Array.isArray(validation.issues)) {
      validation.issues = validation.issues
        .map((issue) => {
          if (!issue || typeof issue !== "object") return null;
          const i = { ...(issue as Record<string, unknown>) };
          i.code = coerceAiString(i.code) ?? "ai_notice";
          i.message = coerceAiString(i.message) ?? "Review this section carefully.";
          const severity = coerceAiString(i.severity)?.toLowerCase();
          i.severity =
            severity === "error" || severity === "warning" ? severity : "info";
          return i;
        })
        .filter(Boolean);
    }
    obj.validation = validation;
  }

  if (Array.isArray(obj.sections)) {
    obj.sections = obj.sections
      .map((section, sectionIndex) => {
        const sec = { ...(section as Record<string, unknown>) };
        sec.name = coerceAiString(sec.name) ?? `Section ${sectionIndex + 1}`;
        sec.instructions = coerceAiString(sec.instructions);
        if (Array.isArray(sec.rows)) {
          sec.rows = sec.rows
            .map((row) => {
              const r = { ...(row as Record<string, unknown>) };
              const instruction = coerceAiString(r.instruction);
              if (!instruction) return null;
              r.instruction = instruction;
              const notes = coerceAiString(r.notes);
              if (notes) r.notes = notes;
              else delete r.notes;
              return r;
            })
            .filter(Boolean);
        }
        if (!Array.isArray(sec.rows) || sec.rows.length === 0) {
          sec.rows = [
            {
              rowNumber: 1,
              instruction: "Follow the maker notes and adjust stitch counts as needed.",
              stitchCount: null,
            },
          ];
        }
        return sec;
      })
      .filter(Boolean);
  }

  if (!Array.isArray(obj.sections) || obj.sections.length === 0) {
    obj.sections = [
      {
        name: "Main",
        sortOrder: 0,
        rows: [
          {
            rowNumber: 1,
            instruction: "Work according to your photo inspiration and notes.",
            stitchCount: null,
          },
        ],
      },
    ];
  }

  obj = normalizeGeneratedPatternJson(obj) as Record<string, unknown>;
  return obj;
}

export function parseAiJson<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  providerLabel: string,
): z.infer<T> {
  const repaired = repairAiJson(data);
  const parsed = schema.safeParse(repaired);
  if (parsed.success) {
    return parsed.data;
  }

  throw new Error(
    `${providerLabel} JSON failed validation: ${parsed.error.message}`,
  );
}
