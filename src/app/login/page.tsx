"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Activity, Lock, ShieldCheck } from "lucide-react";
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
        <div className="min-h-screen w-full flex bg-background bg-grain overflow-hidden">
            {/* Cinematic Background */}
            <div className="fixed inset-0 kinetic-mesh opacity-30 pointer-events-none" />

            {/* Form Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <Link href="/" className="mb-12 inline-flex items-center text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-colors group">
                        <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Terminal
                    </Link>

                    <div className="space-y-8 max-w-sm w-full">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg shadow-accent/20 mb-6">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tighter text-white">Identify.</h1>
                            <p className="text-white/40 font-light tracking-wide">Enter your secure credentials to bridge the connection.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 glass border-destructive/20 text-xs font-bold uppercase tracking-widest text-destructive rounded-xl"
                                >
                                    Auth Error: {error}
                                </motion.div>
                            )}
                            <div className="space-y-4">
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="operator@attendease.sys"
                                    label="Identity (Email)"
                                    required
                                />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    label="Security Key"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full rounded-2xl h-14" size="lg" isLoading={isLoading}>
                                Initialize Connection
                            </Button>
                        </form>

                        <div className="text-center md:text-left">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/20">
                                Unregistered entity?{" "}
                                <Link href="/register" className="text-accent hover:text-accent/80 transition-colors">
                                    Request Access
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Visual Side */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full animate-pulse-slow" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative z-10 glass p-16 rounded-[3rem] border-white/5 max-w-lg text-center backdrop-blur-3xl"
                >
                    <div className="flex justify-center mb-10">
                        <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center relative">
                            <Lock className="w-10 h-10 text-accent opacity-50" />
                            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
                        </div>
                    </div>
                    <blockquote className="text-2xl font-light leading-relaxed text-white/80 mb-8 italic">
                        "In the void of anonymity, presence is the only currency."
                    </blockquote>
                    <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                            <ShieldCheck className="w-3 h-3 text-accent" />
                            Encrypted
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                            <Activity className="w-3 h-3 text-accent" />
                            Verified
                        </div>
                    </div>
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 glass rounded-full opacity-10 animate-float" />
                <div className="absolute bottom-20 left-20 w-24 h-24 glass rounded-2xl opacity-10 animate-float" style={{ animationDelay: "-3s" } as any} />
            </div>
        </div>
    );
}
