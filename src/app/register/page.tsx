"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Activity, UserPlus, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
    const router = useRouter();
    const { signIn } = useAuthActions();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Set the flow type and remove confirmPassword
        formData.set("flow", "signUp");
        formData.delete("confirmPassword");

        try {
            await signIn("password", formData);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background bg-grain overflow-hidden">
            {/* Cinematic Background */}
            <div className="fixed inset-0 kinetic-mesh opacity-30 pointer-events-none" />

            {/* Visual Side (Left) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative border-r border-white/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/5 blur-[120px] rounded-full animate-pulse-slow" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="relative z-10 glass p-16 rounded-[4rem] border-white/5 max-w-lg text-center backdrop-blur-3xl"
                >
                    <div className="flex justify-center mb-10">
                        <div className="w-20 h-20 rounded-[2.5rem] glass flex items-center justify-center relative">
                            <Fingerprint className="w-10 h-10 text-purple-400 opacity-50" />
                            <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter text-white mb-6">Digital Sovereignty.</h2>
                    <p className="text-white/40 font-light leading-relaxed mb-10">
                        Secure your position in the verified ecosystem.
                        Multi-factor binding ensures your identity is immutable.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass p-4 rounded-2xl">
                            <p className="text-sm font-bold text-white tracking-tight">V4-Layer</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Security</p>
                        </div>
                        <div className="glass p-4 rounded-2xl">
                            <p className="text-sm font-bold text-white tracking-tight">HW-Locked</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Verification</p>
                        </div>
                    </div>
                </motion.div>

                {/* Accent particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping" />
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
            </div>

            {/* Form Side (Right) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 relative z-10 py-16 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Link href="/" className="mb-12 inline-flex items-center text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-colors group">
                        <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Origin
                    </Link>

                    <div className="max-w-md w-full">
                        <div className="space-y-3 mb-12">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-accent flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
                                <UserPlus className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tighter text-white">Join.</h1>
                            <p className="text-white/40 font-light tracking-wide">Provision your system identity and access the verified dashboard.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 glass border-destructive/20 text-xs font-bold uppercase tracking-widest text-destructive rounded-xl animate-shake">
                                    Provision Error: {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Operator Name"
                                    label="Legal Identity"
                                    required
                                />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="operator@attendease.sys"
                                    label="Identity (Email)"
                                    required
                                />
                                <Input
                                    id="matricNumber"
                                    name="matricNumber"
                                    type="text"
                                    placeholder="ID-V2-000000"
                                    label="System ID (Matric No)"
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        label="Secure Key"
                                        required
                                        minLength={6}
                                    />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        label="Confirm Key"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full rounded-2xl h-16 mt-4" size="lg" isLoading={isLoading}>
                                Initialize Enrollment
                            </Button>
                        </form>

                        <div className="text-center md:text-left mt-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/20">
                                Existing entity found?{" "}
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                                    Establish Link
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
