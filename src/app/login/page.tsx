"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial px-4">
            <div className="w-full max-w-md animate-fade-in opacity-0">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
                        <svg className="w-7 h-7 text-[var(--bg-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">AttendEase</h1>
                </div>

                {/* Card */}
                <div className="card-industrial p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Welcome Back</h2>
                        <p className="text-[var(--text-secondary)]">Sign in to manage attendance</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-[var(--radius-md)] text-[var(--error)] text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[var(--text-secondary)]">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-medium transition">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

