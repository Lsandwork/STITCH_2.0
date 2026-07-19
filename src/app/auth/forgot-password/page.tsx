"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AuthLayout } from "@/components/stitch/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { requestPasswordReset } from "@/lib/auth-client";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  async function onSubmit(data: ForgotForm) {
    setError(null);
    const result = await requestPasswordReset(data.email);
    if (!result.ok) {
      setError(result.error ?? "Could not send a reset link. Try again.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll send a reset link to your email."
    >
      {sent ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stitch-mint">
            <StitchIcon name="success" tone="teal" size={24} />
          </div>
          <p className="text-sm text-stitch-muted">
            If an account exists for that email, a reset link is on its way.
          </p>
          <Button href="/auth/login" className="mt-6 w-full">
            Back to sign in
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          {error ? (
            <p className="rounded-stitch-sm bg-stitch-rose/60 px-3 py-2 text-sm text-stitch-coral">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-stitch-muted">
        <Link href="/auth/login" className="font-medium text-stitch-coral hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
