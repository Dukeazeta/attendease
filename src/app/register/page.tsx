"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, matricNumber }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed");
            } else {
                router.push("/login?registered=true");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial px-4 py-12">
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
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create Account</h2>
                        <p className="text-[var(--text-secondary)]">Register as a Course Representative</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-[var(--radius-md)] text-[var(--error)] text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition"
                                placeholder="John Doe"
                            />
                        </div>

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
                            <label htmlFor="matricNumber" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Matric Number
                            </label>
                            <input
                                type="text"
                                id="matricNumber"
                                name="matricNumber"
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition"
                                placeholder="CSC/2020/001"
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
                                minLength={6}
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)] mt-2"
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[var(--text-secondary)]">
                            Already have an account?{" "}
                            <Link href="/login" className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] font-medium transition">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

