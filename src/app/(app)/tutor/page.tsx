"use client";

import { useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { validateTutorResponse, type TutorResponse } from "@/lib/schemas/tutor";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: TutorResponse;
};

function messageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: messageId(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          projectId: "demo-dachshund",
          currentRow: 24,
        }),
      });

      const payload = (await res.json()) as {
        response?: unknown;
        error?: string;
        details?: unknown;
      };

      if (!res.ok) {
        const detail =
          typeof payload.error === "string"
            ? payload.error
            : "The Tutor could not respond right now.";
        throw new Error(detail);
      }

      const parsed = validateTutorResponse(payload.response);
      if (!parsed.success) {
        throw new Error("The Tutor returned an unexpected response. Please try again.");
      }

      const response = parsed.data;
      setMessages((prev) => [
        ...prev,
        {
          id: messageId(),
          role: "assistant",
          content: response.howToFix,
          response,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "I'm having trouble connecting. Try again when you're back online.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: messageId(),
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Crochet Tutor"
        description="Ask questions about stitches, shaping, and fixing mistakes."
      />

      <Card padding="lg" className="flex min-h-[480px] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState
              title="Ask your first question"
              description='Try: "How do I fix a gap when joining in the round?"'
            />
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-stitch-lg px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-stitch-coral text-white"
                    : "bg-stitch-cream text-stitch-ink"
                }`}
              >
                {msg.role === "assistant" && msg.response ? (
                  <div className="space-y-2">
                    <p>
                      <strong>Likely issue:</strong> {msg.response.likelyIssue}
                    </p>
                    <p>
                      <strong>How to confirm:</strong> {msg.response.howToConfirm}
                    </p>
                    <p>
                      <strong>How to fix:</strong> {msg.response.howToFix}
                    </p>
                    <p>
                      <strong>Prevent:</strong> {msg.response.howToPrevent}
                    </p>
                    {msg.response.relatedLesson ? (
                      <p className="text-stitch-muted">
                        <strong>Related lesson:</strong>{" "}
                        {msg.response.relatedLesson.title}
                      </p>
                    ) : null}
                    {msg.response.suggestedNextAction?.href ? (
                      <Button
                        href={msg.response.suggestedNextAction.href}
                        size="sm"
                        variant="secondary"
                      >
                        {msg.response.suggestedNextAction.label}
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            ))
          )}
          {loading ? <LoadingState label="Tutor is thinking…" size="sm" /> : null}
        </div>

        {error ? (
          <p className="mt-2 text-sm text-stitch-coral-dark" role="alert">
            {error}
          </p>
        ) : null}

        <form
          onSubmit={sendMessage}
          className="mt-4 flex gap-2 border-t border-stitch-border pt-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Tutor…"
            className="flex-1 rounded-stitch-pill border border-stitch-border px-4 py-2.5 text-sm"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            Send
          </Button>
        </form>
      </Card>
    </>
  );
}
