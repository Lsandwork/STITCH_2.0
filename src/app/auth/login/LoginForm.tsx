"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AuthLayout } from "@/components/stitch/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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
  const redirect = searchParams.get("redirect") ?? "/";
  const demoMode = isDemoModeEnabled();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "emma@demo.stitch.nuviobridge.com",
      password: "demo1234",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    if (demoMode || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setDemoSession({ email: data.email });
      router.push(redirect);
      return;
    }

    router.push(redirect);
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your crochet projects."
    >
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
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
