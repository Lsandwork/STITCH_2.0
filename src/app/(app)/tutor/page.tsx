"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOnboardingProfile } from "@/lib/onboarding-storage";
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      setConversationId(crypto.randomUUID());
    }
  }, []);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: messageId(),
      role: "user",
      content: input.trim(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    const profile = getOnboardingProfile();

    try {
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: userMessage.content,
          projectId: "demo-dachshund",
          currentRow: 24,
          history: nextMessages.slice(-10).map((msg) => ({
            role: msg.role,
            content:
              msg.role === "assistant" && msg.response
                ? `${msg.response.likelyIssue} Fix: ${msg.response.howToFix}`
                : msg.content,
          })),
          userProfile: profile
            ? {
                displayName: profile.displayName,
                skillLevel: profile.skillLevel,
                terminology: profile.terminology,
                measurement: profile.measurement,
                handedness: profile.handedness,
                projectTypes: profile.projectTypes,
                yarnWeights: profile.yarnWeights,
              }
            : undefined,
        }),
      });

      const payload = (await res.json()) as {
        response?: unknown;
        error?: string;
        demoMode?: boolean;
      };

      setDemoMode(Boolean(payload.demoMode));

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

      {demoMode ? (
        <p className="mb-4 rounded-stitch-md border border-stitch-gold/40 bg-stitch-peach/50 px-4 py-2 text-sm text-stitch-ink">
          Demo mode — connect an AI API key in production for live personalized answers.
        </p>
      ) : null}

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
                    {msg.response.followUpQuestions?.length ? (
                      <div className="space-y-1 pt-1">
                        <p className="font-semibold">Follow-up ideas:</p>
                        {msg.response.followUpQuestions.map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => setInput(question)}
                            className="block text-left text-stitch-coral hover:underline"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
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
