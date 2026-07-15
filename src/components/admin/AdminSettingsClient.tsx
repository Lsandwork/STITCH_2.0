"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import type { AppSettings } from "@/lib/app-settings";

type SettingsState = AppSettings & {
  saving: boolean;
};

const SETTING_ITEMS: {
  key: keyof AppSettings;
  label: string;
  description: string;
  enabledLabel: string;
  disabledLabel: string;
}[] = [
  {
    key: "requireEmailConfirmation",
    label: "Require email confirmation",
    description:
      "When off, new accounts are confirmed automatically and users can sign in immediately after signup.",
    enabledLabel: "Users must confirm email before signing in",
    disabledLabel: "Users can sign in immediately (recommended)",
  },
  {
    key: "allowPublicSignup",
    label: "Allow public signups",
    description: "When off, the signup page is disabled for new accounts.",
    enabledLabel: "Anyone can create a free account",
    disabledLabel: "Signups are disabled",
  },
];

export function AdminSettingsClient() {
  const [settings, setSettings] = useState<SettingsState>({
    requireEmailConfirmation: false,
    allowPublicSignup: true,
    saving: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/settings");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Failed to load settings");
        setSettings((current) => ({
          ...current,
          ...data.settings,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  async function save(patch: Partial<AppSettings>) {
    setSettings((current) => ({ ...current, ...patch, saving: true }));
    setError(null);
    setSaved(false);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to save settings");

      setSettings((current) => ({
        ...current,
        ...data.settings,
        saving: false,
      }));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
      setSettings((current) => ({ ...current, saving: false }));
    }
  }

  return (
    <>
      <PageHeading
        title="Settings"
        description="Control authentication and signup behavior for Stitch."
        backHref="/admin/users"
      />

      {error ? (
        <Card padding="md" className="mb-4 border-stitch-coral/30 bg-stitch-rose/40 text-sm text-stitch-coral">
          {error}
        </Card>
      ) : null}

      {loading ? (
        <p className="text-sm text-stitch-muted">Loading settings…</p>
      ) : (
        <div className="space-y-4">
          {SETTING_ITEMS.map((item) => {
            const enabled = settings[item.key];
            return (
              <Card key={item.key} padding="lg">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="max-w-xl">
                    <h3 className="font-semibold text-stitch-ink">{item.label}</h3>
                    <p className="mt-1 text-sm text-stitch-muted">{item.description}</p>
                    <p className="mt-2 text-xs text-stitch-muted">
                      {enabled ? item.enabledLabel : item.disabledLabel}
                    </p>
                  </div>

                  <label className="flex shrink-0 cursor-pointer items-center gap-3 rounded-stitch-md border border-stitch-border bg-stitch-cream/50 px-4 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-stitch-coral"
                      checked={enabled}
                      disabled={settings.saving}
                      onChange={(event) =>
                        void save({ [item.key]: event.target.checked })
                      }
                    />
                    <span className="text-sm font-medium text-stitch-ink">
                      {enabled ? "On" : "Off"}
                    </span>
                  </label>
                </div>
              </Card>
            );
          })}

          {saved ? (
            <p className="text-sm text-stitch-teal">Settings saved.</p>
          ) : null}

          <Card padding="md" className="border-stitch-border/80 bg-stitch-cream/40 text-sm text-stitch-muted">
            Changes apply immediately for new signups and login attempts. Existing
            unconfirmed users are auto-confirmed on their next sign-in when email
            confirmation is off.
          </Card>
        </div>
      )}
    </>
  );
}
