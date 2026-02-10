"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuthActions();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set("flow", "signIn");

        try {
            await signIn("password", formData);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background">
            {/* Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-28 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                    <Link href="/" className="mb-10 inline-flex items-center text-[13px] font-[450] text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>

                    <div className="space-y-8 max-w-sm w-full">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-primary flex items-center justify-center mb-6">
                                <Activity className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <h1 className="text-headline-3 text-foreground">Welcome back</h1>
                            <p className="text-caption text-muted-foreground">Enter your credentials to access the dashboard.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-destructive/5 border border-destructive/15 text-[13px] font-[450] text-destructive rounded-[var(--radius-sm)]"
                                >
                                    {error}
                                </motion.div>
                            )}
                            <div className="space-y-4">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    label="Email"
                                    required
                                />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    label="Password"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 rounded-[var(--radius-sm)]" isLoading={isLoading}>
                                Sign In
                            </Button>
                        </form>

                        <div className="text-center md:text-left">
                            <p className="text-[13px] text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-accent hover:text-accent/80 font-[450] transition-colors">
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Visual Side */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative bg-surface-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10 surface-card p-14 rounded-[var(--radius-xl)] max-w-md text-center"
                >
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-surface-container flex items-center justify-center">
                            <Activity className="w-8 h-8 text-accent/60" />
                        </div>
                    </div>
                    <blockquote className="text-[22px] font-[450] leading-relaxed text-foreground/80 mb-6 tracking-[-0.08px]">
                        &ldquo;Presence is the only currency that cannot be faked.&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-center gap-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 text-small text-muted-foreground/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-success" />
                            Encrypted
                        </div>
                        <div className="flex items-center gap-2 text-small text-muted-foreground/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            Verified
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
