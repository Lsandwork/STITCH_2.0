import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { normalizeGeneratedPatternJson } from "@/lib/ai-pattern-normalize";
import { withJsonSchemaInstruction } from "@/lib/ai-prompt-utils";
import type { ParsedImageData } from "@/lib/ai-image-utils";

export type AIProviderName = "openai" | "anthropic" | "gemini" | "mock";

export interface AIProvider {
  readonly name: AIProviderName;
  readonly model: string;
  generateJSON<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>>;
  generateJSONWithImage<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
    image: ParsedImageData,
  ): Promise<z.infer<T>>;
}

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function mockFromZod(schema: z.ZodTypeAny, seed: number, depth = 0): unknown {
  if (depth > 8) return null;
  const rand = seededRandom(seed);

  if (schema instanceof z.ZodString) {
    const checks = schema._def.checks ?? [];
    const minCheck = checks.find((c) => c.kind === "min") as
      | { value: number }
      | undefined;
    const minLen = minCheck?.value ?? 1;
    const base = "stitch-demo-value";
    return base.padEnd(Math.max(minLen, base.length), "x");
  }

  if (schema instanceof z.ZodNumber) {
    const checks = schema._def.checks ?? [];
    const minCheck = checks.find((c) => c.kind === "min") as
      | { value: number }
      | undefined;
    const maxCheck = checks.find((c) => c.kind === "max") as
      | { value: number }
      | undefined;
    const min = minCheck?.value ?? 1;
    const max = maxCheck?.value ?? min + 10;
    return Math.floor(min + rand() * (max - min + 1));
  }

  if (schema instanceof z.ZodBoolean) {
    return rand() > 0.5;
  }

  if (schema instanceof z.ZodEnum) {
    const values = schema._def.values as string[];
    return values[Math.floor(rand() * values.length)] ?? values[0];
  }

  if (schema instanceof z.ZodNativeEnum) {
    const values = Object.values(schema._def.values).filter(
      (v) => typeof v === "string" || typeof v === "number",
    );
    return values[Math.floor(rand() * values.length)] ?? values[0];
  }

  if (schema instanceof z.ZodArray) {
    const minLength = schema._def.minLength?.value ?? 1;
    const length = Math.max(minLength, 1);
    return Array.from({ length }, (_, i) =>
      mockFromZod(schema._def.type, seed + i + 1, depth + 1),
    );
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape() as Record<string, z.ZodTypeAny>;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(shape)) {
      if (value instanceof z.ZodOptional || value instanceof z.ZodDefault) {
        const inner = value._def.innerType;
        if (rand() > 0.3) {
          result[key] = mockFromZod(inner, seed + key.length, depth + 1);
        }
        continue;
      }
      result[key] = mockFromZod(value, seed + key.length, depth + 1);
    }
    return result;
  }

  if (schema instanceof z.ZodOptional) {
    return rand() > 0.4
      ? mockFromZod(schema._def.innerType, seed, depth + 1)
      : undefined;
  }

  if (schema instanceof z.ZodDefault) {
    return mockFromZod(schema._def.innerType, seed, depth + 1);
  }

  if (schema instanceof z.ZodNullable) {
    return rand() > 0.2
      ? mockFromZod(schema._def.innerType, seed, depth + 1)
      : null;
  }

  if (schema instanceof z.ZodRecord) {
    return { key: mockFromZod(schema._def.valueType, seed, depth + 1) };
  }

  if (schema instanceof z.ZodLiteral) {
    return schema._def.value;
  }

  if (schema instanceof z.ZodUnion) {
    const options = schema._def.options as z.ZodTypeAny[];
    const pick = options[Math.floor(rand() * options.length)] ?? options[0];
    return mockFromZod(pick, seed, depth + 1);
  }

  return null;
}

function parseModelJson<T extends z.ZodTypeAny>(
  content: string,
  schema: T,
  providerLabel: string,
): z.infer<T> {
  const trimmed = content.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenceMatch ? fenceMatch[1].trim() : trimmed;
  let json = JSON.parse(jsonText) as unknown;
  if (typeof json === "object" && json !== null && "sections" in json) {
    json = normalizeGeneratedPatternJson(json);
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `${providerLabel} JSON failed validation: ${parsed.error.message}`,
    );
  }
  return parsed.data;
}

class MockAIProvider implements AIProvider {
  readonly name = "mock" as const;
  readonly model = "stitch-mock-v1";

  async generateJSON<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const seed = hashSeed(prompt);
    const mockData = mockFromZod(schema, seed);
    const parsed = schema.safeParse(mockData);
    if (parsed.success) {
      return parsed.data;
    }
    throw new Error(
      `Mock generator could not satisfy schema: ${parsed.error.message}`,
    );
  }

  async generateJSONWithImage<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
    image: ParsedImageData,
  ): Promise<z.infer<T>> {
    return this.generateJSON(`${prompt}\n[image:${image.mimeType}]`, schema);
  }
}

class OpenAIProvider implements AIProvider {
  readonly name = "openai" as const;
  readonly model: string;

  constructor(model = "gpt-4o-mini") {
    this.model = model;
  }

  private async requestJson<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
    image?: ParsedImageData,
  ): Promise<z.infer<T>> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      const mock = new MockAIProvider();
      return image
        ? mock.generateJSONWithImage(prompt, schema, image)
        : mock.generateJSON(prompt, schema);
    }

    const userContent = image
      ? [
          { type: "text", text: withJsonSchemaInstruction(prompt, schema) },
          {
            type: "image_url",
            image_url: { url: image.dataUrl, detail: "high" },
          },
        ]
      : withJsonSchemaInstruction(prompt, schema);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a crochet pattern assistant for Stitch by Nuvio. Analyze images carefully when provided. Respond with valid JSON only.",
          },
          { role: "user", content: userContent },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${detail}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned an empty response");
    }

    return parseModelJson(content, schema, "OpenAI");
  }

  async generateJSON<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>> {
    return this.requestJson(prompt, schema);
  }

  async generateJSONWithImage<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
    image: ParsedImageData,
  ): Promise<z.infer<T>> {
    return this.requestJson(prompt, schema, image);
  }
}

class AnthropicProvider implements AIProvider {
  readonly name = "anthropic" as const;
  readonly model: string;

  constructor(model = "claude-3-5-haiku-latest") {
    this.model = model;
  }

  private async requestJson<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
    image?: ParsedImageData,
  ): Promise<z.infer<T>> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const mock = new MockAIProvider();
      return image
        ? mock.generateJSONWithImage(prompt, schema, image)
        : mock.generateJSON(prompt, schema);
    }

    const content = image
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: image.mimeType,
              data: image.base64,
            },
          },
          {
            type: "text",
            text: withJsonSchemaInstruction(prompt, schema),
          },
        ]
      : withJsonSchemaInstruction(prompt, schema);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        system:
          "You are a crochet pattern assistant for Stitch by Nuvio. Analyze images carefully when provided. Respond with valid JSON only, no markdown.",
        messages: [{ role: "user", content }],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Anthropic request failed (${response.status}): ${detail}`);
    }

    const payload = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const text = payload.content?.find((c) => c.type === "text")?.text;
    if (!text) {
      throw new Error("Anthropic returned an empty response");
    }

    return parseModelJson(text, schema, "Anthropic");
  }

  async generateJSON<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>> {
    return this.requestJson(prompt, schema);
  }

  async generateJSONWithImage<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
    image: ParsedImageData,
  ): Promise<z.infer<T>> {
    return this.requestJson(prompt, schema, image);
  }
}

class GeminiProvider implements AIProvider {
  readonly name = "gemini" as const;
  readonly model: string;

  constructor(model?: string) {
    this.model = model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  }

  private async requestJson<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
    image?: ParsedImageData,
  ): Promise<z.infer<T>> {
    const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      const mock = new MockAIProvider();
      return image
        ? mock.generateJSONWithImage(prompt, schema, image)
        : mock.generateJSON(prompt, schema);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: this.model,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const parts = image
      ? [
          { text: withJsonSchemaInstruction(prompt, schema) },
          {
            inlineData: {
              mimeType: image.mimeType,
              data: image.base64,
            },
          },
        ]
      : [withJsonSchemaInstruction(prompt, schema)];

    const result = await model.generateContent(parts);
    const text = result.response.text();
    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return parseModelJson(text, schema, "Gemini");
  }

  async generateJSON<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>> {
    return this.requestJson(prompt, schema);
  }

  async generateJSONWithImage<T extends z.ZodTypeAny>(
    prompt: string,
    schema: T,
    image: ParsedImageData,
  ): Promise<z.infer<T>> {
    return this.requestJson(prompt, schema, image);
  }
}

export function isMockMode(): boolean {
  const provider = (process.env.AI_PROVIDER ?? "openai").toLowerCase();
  const keyMap: Record<string, string | undefined> = {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    gemini: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
  };
  return !keyMap[provider];
}

export function getAIProvider(name?: AIProviderName): AIProvider {
  const provider = (name ?? process.env.AI_PROVIDER ?? "openai").toLowerCase();

  switch (provider) {
    case "anthropic":
      return new AnthropicProvider(process.env.ANTHROPIC_MODEL);
    case "gemini":
      return new GeminiProvider(process.env.GEMINI_MODEL);
    case "openai":
    default:
      return new OpenAIProvider(process.env.OPENAI_MODEL);
  }
}

/** Ordered list of configured providers for retry/fallback chains. */
export function getConfiguredAIProviders(): AIProvider[] {
  const preferred = (process.env.AI_PROVIDER ?? "openai").toLowerCase() as AIProviderName;
  const order: AIProviderName[] = [preferred, "openai", "gemini", "anthropic"];
  const seen = new Set<AIProviderName>();
  const providers: AIProvider[] = [];

  for (const name of order) {
    if (seen.has(name)) continue;
    seen.add(name);

    const hasKey =
      (name === "openai" && Boolean(process.env.OPENAI_API_KEY)) ||
      (name === "anthropic" && Boolean(process.env.ANTHROPIC_API_KEY)) ||
      (name === "gemini" &&
        Boolean(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY));

    if (hasKey) {
      providers.push(getAIProvider(name));
    }
  }

  return providers;
}
