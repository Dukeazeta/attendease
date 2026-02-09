"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const matricNumber = formData.get("matricNumber") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, matricNumber }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed");
            } else {
                setSuccess("Account created. Signing you in...");
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    setSuccess(null);
                    setError("Account created, but auto sign-in failed. Please sign in.");
                } else {
                    router.push("/dashboard");
                    router.refresh();
                }
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Visual Side (Left for Register to alternate) - Hidden on Mobile */}
            <div className="hidden lg:flex w-1/2 bg-foreground text-background flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                <div className="relative z-10 max-w-lg text-center space-y-6">
                    <div className="h-12 w-12 bg-background mx-auto rounded-full mb-8"></div>
                    <blockquote className="text-3xl font-serif leading-tight">
                        &quot;Your integrity is your currency.&quot;
                    </blockquote>
                    <p className="text-background/60 text-sm font-mono uppercase tracking-widest">
                        Join the ecosystem
                    </p>
                </div>

                {/* Abstract Pattern */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-background/5"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] border border-background/20 rounded-full"></div>
            </div>

            {/* Form Side (Right) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 bg-background relative py-12">
                <Link href="/" className="absolute top-10 left-8 md:left-24 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="space-y-6 max-w-sm w-full mx-auto">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Create Account</h1>
                        <p className="text-muted-foreground">Register as a Course Representative.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 text-sm text-emerald-700 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                                {success}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                label="Full Name"
                                required
                            />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                label="Email"
                                required
                            />
                            <Input
                                id="matricNumber"
                                name="matricNumber"
                                type="text"
                                placeholder="CSC/2020/001"
                                label="Matric Number"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    label="Password"
                                    required
                                    minLength={6}
                                />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    label="Confirm"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <p className="text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-foreground hover:underline underline-offset-4">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
