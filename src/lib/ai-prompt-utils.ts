import { z } from "zod";

export function schemaFieldSummary(schema: z.ZodTypeAny, depth = 0): string {
  if (depth > 4) return "object";

  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape() as Record<string, z.ZodTypeAny>;
    const fields = Object.entries(shape).map(([key, value]) => {
      const inner =
        value instanceof z.ZodOptional || value instanceof z.ZodDefault
          ? value._def.innerType
          : value;
      return `${key}: ${schemaFieldSummary(inner, depth + 1)}`;
    });
    return `{ ${fields.join(", ")} }`;
  }

  if (schema instanceof z.ZodArray) {
    return `array<${schemaFieldSummary(schema._def.type, depth + 1)}>`;
  }

  if (schema instanceof z.ZodEnum) {
    return (schema._def.values as string[]).join(" | ");
  }

  if (schema instanceof z.ZodNumber) return "number";
  if (schema instanceof z.ZodBoolean) return "boolean";
  if (schema instanceof z.ZodString) return "string";

  return "value";
}

export function withJsonSchemaInstruction<T extends z.ZodTypeAny>(
  prompt: string,
  schema: T,
): string {
  return [
    prompt,
    "",
    "Return valid JSON only. No markdown fences.",
    `Required JSON shape: ${schemaFieldSummary(schema)}`,
  ].join("\n");
}
