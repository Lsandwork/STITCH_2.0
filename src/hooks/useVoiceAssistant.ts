"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type VoiceSettings = {
  rate: number;
  pitch: number;
  volume: number;
  voiceName: string | null;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

const VOICE_SETTINGS_KEY = "stitch-voice-settings";

const DEFAULT_SETTINGS: VoiceSettings = {
  rate: 0.95,
  pitch: 1,
  volume: 1,
  voiceName: null,
};

const VOICE_COMMANDS = [
  { phrase: "next row", action: "next" },
  { phrase: "previous row", action: "prev" },
  { phrase: "complete row", action: "complete" },
  { phrase: "repeat row", action: "repeat" },
  { phrase: "read row", action: "read" },
  { phrase: "explain", action: "explain" },
  { phrase: "undo", action: "undo" },
] as const;

export type VoiceCommandAction = (typeof VOICE_COMMANDS)[number]["action"];

function loadSettings(): VoiceSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(VOICE_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function useVoiceAssistant(
  onCommand?: (action: VoiceCommandAction, transcript: string) => void,
) {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onCommandRef = useRef(onCommand);
  onCommandRef.current = onCommand;

  useEffect(() => {
    setSettings(loadSettings());
    setSupported(
      typeof window !== "undefined" &&
        (!!getSpeechRecognitionCtor() || "speechSynthesis" in window),
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const parseCommand = useCallback((transcript: string): VoiceCommandAction | null => {
    const normalized = transcript.toLowerCase().trim();
    for (const cmd of VOICE_COMMANDS) {
      if (normalized.includes(cmd.phrase)) return cmd.action;
    }
    return null;
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      if (settings.voiceName) {
        const voice = window.speechSynthesis
          .getVoices()
          .find((v) => v.name === settings.voiceName);
        if (voice) utterance.voice = voice;
      }
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [settings],
  );

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setLastTranscript(transcript);
      const action = parseCommand(transcript);
      if (action) {
        onCommandRef.current?.(action, transcript);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [parseCommand]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const updateSettings = useCallback((patch: Partial<VoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const availableVoices =
    typeof window !== "undefined" && "speechSynthesis" in window
      ? window.speechSynthesis.getVoices()
      : [];

  return {
    settings,
    isListening,
    isSpeaking,
    lastTranscript,
    supported,
    commands: VOICE_COMMANDS,
    availableVoices,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    toggleListening,
    updateSettings,
    parseCommand,
  };
}
