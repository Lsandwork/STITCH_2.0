/** Parse numbers from AI output that may use strings like "R1", "12 sts", etc. */
export function parseAiNumber(
  value: unknown,
  fallback?: number,
): number | undefined {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === "null") {
      return fallback;
    }
    const match = trimmed.match(/-?\d+(?:\.\d+)?/);
    if (match) {
      const parsed = Number(match[0]);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return fallback;
}

/** Normalize Gemini/OpenAI pattern JSON before Zod validation. */
export function normalizeGeneratedPatternJson(data: unknown): unknown {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return data;
  }

  const obj = { ...(data as Record<string, unknown>) };

  if (obj.estimatedTimeMinutes !== undefined) {
    obj.estimatedTimeMinutes = parseAiNumber(obj.estimatedTimeMinutes);
  }

  if (obj.gauge && typeof obj.gauge === "object") {
    const gauge = { ...(obj.gauge as Record<string, unknown>) };
    gauge.stitches = parseAiNumber(gauge.stitches) ?? gauge.stitches;
    gauge.rows = parseAiNumber(gauge.rows) ?? gauge.rows;
    obj.gauge = gauge;
  }

  if (obj.materials && typeof obj.materials === "object") {
    const materials = { ...(obj.materials as Record<string, unknown>) };
    if (Array.isArray(materials.yarns)) {
      materials.yarns = materials.yarns.map((yarn) => {
        const y = { ...(yarn as Record<string, unknown>) };
        if (y.yardage !== undefined) y.yardage = parseAiNumber(y.yardage);
        if (y.skeins !== undefined) y.skeins = parseAiNumber(y.skeins);
        return y;
      });
    }
    obj.materials = materials;
  }

  if (obj.validation && typeof obj.validation === "object") {
    const validation = { ...(obj.validation as Record<string, unknown>) };
    if (validation.score !== undefined) {
      validation.score = parseAiNumber(validation.score) ?? validation.score;
    }
    if (typeof validation.isValid === "string") {
      validation.isValid =
        validation.isValid === "true" || validation.isValid === "1";
    }
    if (Array.isArray(validation.issues)) {
      validation.issues = validation.issues.map((issue) => {
        const i = { ...(issue as Record<string, unknown>) };
        if (i.rowNumber !== undefined) {
          i.rowNumber = parseAiNumber(i.rowNumber);
        }
        return i;
      });
    }
    obj.validation = validation;
  }

  if (Array.isArray(obj.sections)) {
    obj.sections = obj.sections.map((section, sectionIndex) => {
      const sec = { ...(section as Record<string, unknown>) };
      sec.sortOrder = parseAiNumber(sec.sortOrder) ?? sectionIndex;

      if (Array.isArray(sec.rows)) {
        sec.rows = sec.rows.map((row, rowIndex) => {
          const r = { ...(row as Record<string, unknown>) };
          r.rowNumber = parseAiNumber(r.rowNumber) ?? rowIndex + 1;

          if (r.stitchCount === null || r.stitchCount === undefined) {
            r.stitchCount = null;
          } else {
            const stitchCount = parseAiNumber(r.stitchCount);
            r.stitchCount = stitchCount ?? null;
          }

          return r;
        });
      }

      return sec;
    });
  }

  return obj;
}
