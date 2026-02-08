"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 lg:px-32 bg-background relative">
                <Link href="/" className="absolute top-10 left-8 md:left-24 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="space-y-6 max-w-sm w-full mx-auto">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Welcome back</h1>
                        <p className="text-muted-foreground">Enter your credentials to access your dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
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

                        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <p className="text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-semibold text-foreground hover:underline underline-offset-4">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-foreground text-background flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                <div className="relative z-10 max-w-lg text-center space-y-6">
                    <div className="h-12 w-12 bg-background mx-auto rounded-full mb-8"></div>
                    <blockquote className="text-3xl font-serif leading-tight">
                        "Reliability is the precondition for trust."
                    </blockquote>
                    <p className="text-background/60 text-sm font-mono uppercase tracking-widest">
                        AttendEase Secure Systems
                    </p>
                </div>

                {/* Abstract Pattern */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-background/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-background/20 rounded-full dark:border-white/20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-background/10 rounded-full"></div>
            </div>
        </div>
    );
}
