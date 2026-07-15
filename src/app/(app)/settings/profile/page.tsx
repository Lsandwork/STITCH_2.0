"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSubscription } from "@/components/providers/SubscriptionProvider";
import { createClient } from "@/lib/supabase/client";
import { getOnboardingProfile } from "@/lib/onboarding-storage";

export default function ProfileSettingsPage() {
  const { refresh } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/assets/stitch/avatars/svg/avatar-1.svg");
  const [userId, setUserId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      if (!supabase) {
        const onboarding = getOnboardingProfile();
        if (onboarding?.displayName) setDisplayName(onboarding.displayName);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, email, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      const profileRow = profile as {
        display_name: string | null;
        email: string | null;
        avatar_url: string | null;
      } | null;

      const onboarding = getOnboardingProfile();
      setDisplayName(
        profileRow?.display_name ??
          onboarding?.displayName ??
          (user.user_metadata as { display_name?: string } | undefined)
            ?.display_name ??
          "",
      );

      if (profileRow?.avatar_url) {
        setAvatarUrl(profileRow.avatar_url);
      }
    }

    void loadProfile();
  }, []);

  async function saveProfile() {
    setError(null);
    setSaved(null);
    const supabase = createClient();

    if (!supabase || !userId) {
      setSaved("Profile saved locally.");
      return;
    }

    const { error: saveError } = await supabase.from("profiles").upsert({
      id: userId,
      email,
      display_name: displayName,
    } as never);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    await fetch("/api/activity/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType: "profile_updated" }),
    });

    await refresh();
    setSaved("Profile updated.");
  }

  async function saveEmail() {
    setError(null);
    setSaved(null);

    const response = await fetch("/api/profile/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Failed to update email");
      return;
    }

    setSaved(data.message ?? "Email update requested.");
  }

  async function savePassword() {
    setError(null);
    setSaved(null);

    const response = await fetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmPassword }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Failed to update password");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setSaved(data.message ?? "Password updated.");
  }

  async function uploadAvatar(file: File) {
    setUploading(true);
    setError(null);
    setSaved(null);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Failed to upload photo");
      setUploading(false);
      return;
    }

    if (data.avatarUrl) {
      setAvatarUrl(data.avatarUrl);
    }

    await refresh();
    setSaved("Profile photo updated.");
    setUploading(false);
  }

  return (
    <>
      <PageHeading
        title="Profile"
        description="Update your photo, display name, email, and password."
        backHref="/settings"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg" className="space-y-4">
          <h2 className="text-base font-semibold text-stitch-ink">Profile photo</h2>
          <div className="flex items-center gap-4">
            <Image
              src={avatarUrl}
              alt={displayName || "Profile photo"}
              width={88}
              height={88}
              className="h-[88px] w-[88px] rounded-full border-2 border-stitch-border object-cover"
            />
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadAvatar(file);
                }}
              />
              <Button
                variant="secondary"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Uploading…" : "Upload photo"}
              </Button>
              <p className="mt-2 text-xs text-stitch-muted">JPG, PNG, or WebP up to 5 MB.</p>
            </div>
          </div>
        </Card>

        <Card padding="lg" className="space-y-4">
          <h2 className="text-base font-semibold text-stitch-ink">Display name</h2>
          <Input
            label="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <Button onClick={saveProfile}>Save profile</Button>
        </Card>

        <Card padding="lg" className="space-y-4">
          <h2 className="text-base font-semibold text-stitch-ink">Email</h2>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button variant="secondary" onClick={saveEmail}>
            Update email
          </Button>
        </Card>

        <Card padding="lg" className="space-y-4">
          <h2 className="text-base font-semibold text-stitch-ink">Password</h2>
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Input
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          <Button variant="secondary" onClick={savePassword}>
            Change password
          </Button>
        </Card>
      </div>

      {error ? <p className="mt-4 text-sm text-stitch-coral">{error}</p> : null}
      {saved ? <p className="mt-4 text-sm text-stitch-teal">{saved}</p> : null}
    </>
  );
}
