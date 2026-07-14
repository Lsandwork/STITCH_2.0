"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DEMO_USER } from "@/lib/demo-data";
import { getDemoSession, setDemoSession } from "@/lib/demo-session";
import { getOnboardingProfile } from "@/lib/onboarding-storage";

export default function ProfileSettingsPage() {
  const [displayName, setDisplayName] = useState(DEMO_USER.displayName);
  const [email, setEmail] = useState(DEMO_USER.email);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const session = getDemoSession();
    const onboarding = getOnboardingProfile();
    if (session?.displayName) setDisplayName(session.displayName);
    if (session?.email) setEmail(session.email);
    if (onboarding?.displayName) setDisplayName(onboarding.displayName);
  }, []);

  function save() {
    setDemoSession({ displayName, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <PageHeading title="Profile" description="Update your display name and email." backHref="/settings" />
      <Card padding="lg" className="max-w-lg space-y-4">
        <Input label="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={save}>{saved ? "Saved!" : "Save profile"}</Button>
      </Card>
    </>
  );
}
