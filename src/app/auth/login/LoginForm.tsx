"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { AuthLayout } from "@/components/stitch/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signInWithEmail } from "@/lib/auth-client";
import { isDemoModeEnabled } from "@/lib/constants";
import { setDemoSession } from "@/lib/demo-session";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const demoMode = isDemoModeEnabled();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: demoMode
      ? {
          email: "lsand.work@gmail.com",
          password: "password123",
        }
      : {
          email: "",
          password: "",
        },
  });

  async function onSubmit(data: LoginFormValues) {
    setAuthError(null);

    if (demoMode) {
      setDemoSession({ email: data.email });
      router.push(redirect);
      return;
    }

    const result = await signInWithEmail(data.email, data.password);
    if (!result.ok) {
      setAuthError(result.error ?? "Could not sign in. Check your email and password.");
      return;
    }

    router.push(redirect);
    router.refresh();

    void fetch("/api/activity/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType: "login" }),
    });
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your crochet projects."
    >
      <div className="mb-5 rounded-stitch-md border border-stitch-border bg-stitch-peach/40 px-4 py-3 text-center text-sm">
        <span className="text-stitch-muted">Don&apos;t have an account? </span>
        <Link
          href="/auth/signup"
          className="font-semibold text-stitch-coral hover:underline"
        >
          Sign up free
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-stitch-coral hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {authError ? (
          <p className="rounded-stitch-sm bg-stitch-rose/60 px-3 py-2 text-sm text-stitch-coral">
            {authError}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
        {demoMode ? (
          <p className="text-center text-xs text-stitch-muted">
            Demo mode: any valid credentials will sign you in locally.
          </p>
        ) : null}
      </form>
      <p className="mt-6 text-center text-sm text-stitch-muted">
        New to Stitch?{" "}
        <Link href="/auth/signup" className="font-medium text-stitch-coral hover:underline">
          Create a free account
        </Link>
      </p>
    </AuthLayout>
  );
}
