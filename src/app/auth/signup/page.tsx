"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AuthLayout } from "@/components/stitch/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupForm) {
    if (demoMode || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setDemoSession({ email: data.email, displayName: data.displayName });
      router.push("/onboarding");
      return;
    }
    router.push("/onboarding");
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Stitch and start your next project."
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
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
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
