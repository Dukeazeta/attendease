"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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
            const result = await signIn("credentials", {
                name,
                email,
                matricNumber,
                password,
                flow: "signUp",
                redirect: false,
            });

            if (result?.error) {
                if (result.error === "CredentialsSignin") {
                    setError("Registration failed. Check your details or use a different email.");
                } else {
                    setError(result.error);
                }
            } else {
                router.replace("/dashboard");
            }
        } catch (err) {
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background">
            {/* Visual Side (Left) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative bg-surface-container border-r border-border">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10 surface-card p-14 rounded-[var(--radius-xl)] max-w-md text-center"
                >
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-accent/8 flex items-center justify-center">
                            <UserPlus className="w-8 h-8 text-accent/60" />
                        </div>
                    </div>
                    <h2 className="text-headline-3 text-foreground mb-4">Join the ecosystem</h2>
                    <p className="text-caption text-muted-foreground leading-relaxed mb-8">
                        Secure your position in the verified attendance system.
                        Multi-factor binding ensures your identity is protected.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="surface-container p-4 rounded-[var(--radius-lg)]">
                            <p className="text-[14.5px] font-[450] text-foreground">Multi-layer</p>
                            <p className="text-small text-muted-foreground/60 mt-0.5">Security</p>
                        </div>
                        <div className="surface-container p-4 rounded-[var(--radius-lg)]">
                            <p className="text-[14.5px] font-[450] text-foreground">HW-Locked</p>
                            <p className="text-small text-muted-foreground/60 mt-0.5">Verification</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Form Side (Right) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-28 relative z-10 py-12 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                    <Link href="/" className="mb-10 inline-flex items-center text-[13px] font-[450] text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>

                    <div className="max-w-md w-full">
                        <div className="space-y-3 mb-10">
                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-6">
                                <UserPlus className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <h1 className="text-headline-3 text-foreground">Create account</h1>
                            <p className="text-caption text-muted-foreground">Set up your identity to access the attendance dashboard.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 bg-destructive/5 border border-destructive/15 text-[13px] font-[450] text-destructive rounded-[var(--radius-full)]">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    label="Name"
                                    required
                                />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    label="Email"
                                    required
                                />
                                <Input
                                    id="matricNumber"
                                    name="matricNumber"
                                    type="text"
                                    placeholder="e.g. CSC/2022/001"
                                    label="Matric Number"
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            <Button type="submit" className="w-full h-12 mt-2" isLoading={isLoading}>
                                Create Account
                            </Button>
                        </form>

                        <div className="text-center md:text-left mt-6">
                            <p className="text-[13px] text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-accent hover:text-accent/80 font-[450] transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
