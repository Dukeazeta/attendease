"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bootstrapLegacyPassword } from "@/app/actions/auth";

export default function BootstrapPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const matricNumber = String(formData.get("matricNumber") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      await bootstrapLegacyPassword({ email, matricNumber, newPassword: password });
      setSuccess("Password has been configured. You can now sign in.");
      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not set password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="w-full max-w-md mx-auto px-8 py-16">
        <Link
          href="/login"
          className="mb-10 inline-flex items-center text-[13px] font-[450] text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        <div className="surface-card p-8 space-y-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-headline-3 text-foreground">Set Legacy Password</h1>
            <p className="text-caption text-muted-foreground">
              For accounts created before password enforcement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-destructive/5 border border-destructive/15 text-[13px] font-[450] text-destructive rounded-[var(--radius-full)]">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-[13px] font-[450] text-emerald-700 rounded-[var(--radius-full)]">
                {success}
              </div>
            )}

            <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
            <Input
              name="matricNumber"
              type="text"
              label="Matric Number"
              placeholder="CSC/2022/001"
              className="uppercase"
              required
            />
            <Input name="password" type="password" label="New Password" minLength={8} required />
            <Input name="confirmPassword" type="password" label="Confirm Password" minLength={8} required />

            <Button type="submit" className="w-full h-12" isLoading={isSubmitting}>
              Set Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
