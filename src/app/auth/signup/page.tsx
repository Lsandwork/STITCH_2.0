"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/components/stitch/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signUpWithEmail } from "@/lib/auth-client";
import { isDemoModeEnabled } from "@/lib/constants";
import { setDemoSession } from "@/lib/demo-session";

const signupSchema = z
  .object({
    displayName: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const demoMode = isDemoModeEnabled();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupForm) {
    setAuthError(null);

    if (demoMode) {
      setDemoSession({ email: data.email, displayName: data.displayName });
      router.push("/onboarding");
      return;
    }

    const result = await signUpWithEmail(
      data.email,
      data.password,
      data.displayName,
    );

    if (!result.ok) {
      setAuthError(result.error ?? "Could not create your account. Please try again.");
      return;
    }

    if (result.requiresEmailConfirmation) {
      router.push("/auth/login?message=confirm-email");
      return;
    }

    router.push("/onboarding");
    router.refresh();

    void fetch("/api/activity/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType: "signup" }),
    });
  }

  return (
    <AuthLayout
      title="Stitch Your Itch"
      subtitle="Create your free account and start your next crochet project."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Display name"
          autoComplete="name"
          error={errors.displayName?.message}
          {...register("displayName")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        {authError ? (
          <p className="rounded-stitch-sm bg-stitch-rose/60 px-3 py-2 text-sm text-stitch-coral">
            {authError}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create free account"}
        </Button>
        <p className="text-center text-xs text-stitch-muted">
          Free forever to start. No credit card required.
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-stitch-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-stitch-coral hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
