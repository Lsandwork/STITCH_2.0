"use client";

import { useEffect } from "react";
import type { VoiceCommandAction } from "@/hooks/useVoiceAssistant";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type VoiceControlsProps = {
  onCommand?: (action: VoiceCommandAction, transcript: string) => void;
  readAloudText?: string;
  className?: string;
  autoStart?: boolean;
};

export function VoiceControls({
  onCommand,
  readAloudText,
  className,
  autoStart = false,
}: VoiceControlsProps) {
  const {
    settings,
    isListening,
    isSpeaking,
    lastTranscript,
    supported,
    commands,
    availableVoices,
    speak,
    stopSpeaking,
    toggleListening,
    updateSettings,
  } = useVoiceAssistant(onCommand);

  useEffect(() => {
    if (!autoStart || !supported || isListening) return;
    toggleListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start once when linked with ?voice=1
  }, [autoStart, supported]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Voice Assistant</CardTitle>
        <StitchIcon name="microphone" tone="coral" />
      </CardHeader>

      {!supported ? (
        <p className="text-sm text-stitch-muted">
          Voice features are not supported in this browser. Use the fallback
          buttons below.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={isListening ? "soft" : "primary"}
          onClick={toggleListening}
        >
          <StitchIcon name="microphone" tone="default" size={16} />
          {isListening ? "Listening…" : "Listen"}
        </Button>
        {readAloudText ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => speak(readAloudText)}
            disabled={isSpeaking}
          >
            Read row
          </Button>
        ) : null}
        {isSpeaking ? (
          <Button size="sm" variant="ghost" onClick={stopSpeaking}>
            Stop
          </Button>
        ) : null}
      </div>

      {lastTranscript ? (
        <p className="mt-3 rounded-stitch-md bg-stitch-cream px-3 py-2 text-sm text-stitch-ink">
          Heard: &ldquo;{lastTranscript}&rdquo;
        </p>
      ) : null}

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stitch-muted">
          Voice commands
        </p>
        <ul className="grid grid-cols-2 gap-1 text-xs text-stitch-muted">
          {commands.map((cmd) => (
            <li key={cmd.action} className="rounded bg-stitch-cream px-2 py-1">
              &ldquo;{cmd.phrase}&rdquo;
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 space-y-3 border-t border-stitch-border pt-4">
        <label className="block text-xs font-medium text-stitch-muted">
          Speed ({settings.rate.toFixed(2)})
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={settings.rate}
            onChange={(e) => updateSettings({ rate: Number(e.target.value) })}
            className="mt-1 w-full accent-stitch-teal"
          />
        </label>
        <label className="block text-xs font-medium text-stitch-muted">
          Volume ({Math.round(settings.volume * 100)}%)
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
            className="mt-1 w-full accent-stitch-teal"
          />
        </label>
        {availableVoices.length > 0 ? (
          <label className="block text-xs font-medium text-stitch-muted">
            Voice
            <select
              value={settings.voiceName ?? ""}
              onChange={(e) =>
                updateSettings({ voiceName: e.target.value || null })
              }
              className="mt-1 w-full rounded-stitch-sm border border-stitch-border bg-stitch-paper px-3 py-2 text-sm"
            >
              <option value="">System default</option>
              {availableVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </Card>
  );
}
