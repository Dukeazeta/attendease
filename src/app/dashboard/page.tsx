"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/../convex/_generated/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const { signOut } = useAuthActions();
    const dashboardData = useQuery(api.users.dashboardStats);

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    // Loading state
    if (dashboardData === undefined) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Not authenticated
    if (dashboardData === null) {
        router.push("/login");
        return null;
    }

    const { user, courseCount, activeSessionCount, totalStudentsSigned, activeSessions } = dashboardData;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Logo Mark */}
                        <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[var(--bg-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">AttendEase</h1>
                            <p className="text-[var(--text-muted)] text-xs">{user.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-md transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Total Courses */}
                    <div className="card-industrial p-6 animate-fade-in opacity-0">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wide">Courses</h3>
                            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <p className="data-display text-4xl text-[var(--text-primary)]">{courseCount}</p>
                    </div>

                    {/* Active Sessions */}
                    <div className="card-industrial p-6 animate-fade-in opacity-0 delay-100">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wide">Active</h3>
                            {activeSessionCount > 0 && <span className="live-indicator">Live</span>}
                        </div>
                        <p className="data-display text-4xl text-[var(--success)]">{activeSessionCount}</p>
                    </div>

                    {/* Students Signed Today */}
                    <div className="card-industrial p-6 animate-fade-in opacity-0 delay-200">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wide">Signed Today</h3>
                            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="data-display text-4xl text-[var(--accent-primary)] data-glow">{totalStudentsSigned}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 animate-fade-in-up opacity-0 delay-300">
                    <Link
                        href="/sessions/new"
                        className="btn-primary flex items-center justify-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Session
                    </Link>
                    <Link
                        href="/courses"
                        className="btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Courses
                    </Link>
                    <Link
                        href="/locations"
                        className="btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Locations
                    </Link>
                    <Link
                        href="/sessions"
                        className="btn-secondary flex items-center justify-center gap-2 text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        History
                    </Link>
                </div>

                {/* Active Sessions */}
                <div className="card-industrial overflow-hidden animate-fade-in-up opacity-0 delay-400">
                    <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[var(--text-primary)]">Active Sessions</h2>
                        {activeSessions.length > 0 && (
                            <span className="text-xs text-[var(--text-muted)]">{activeSessions.length} running</span>
                        )}
                    </div>
                    {activeSessions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[var(--text-secondary)] mb-4">No active sessions</p>
                            <Link
                                href="/sessions/new"
                                className="btn-primary inline-flex items-center gap-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Session
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-subtle)]">
                            {activeSessions.map((sess, idx) => (
                                <div
                                    key={sess._id}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors"
                                    style={{ animationDelay: `${500 + idx * 100}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse-dot" />
                                        <div>
                                            <h3 className="text-[var(--text-primary)] font-medium">
                                                {sess.course?.courseCode}
                                            </h3>
                                            <p className="text-[var(--text-muted)] text-sm">
                                                {sess.location?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="data-display text-lg text-[var(--text-primary)]">{sess.attendanceCount}</p>
                                            <p className="text-[var(--text-muted)] text-xs">signed</p>
                                        </div>
                                        <Link
                                            href={`/sessions/${sess._id}`}
                                            className="px-3 py-1.5 text-sm text-[var(--accent-primary)] hover:bg-[var(--accent-subtle)] rounded-md transition-colors font-medium"
                                        >
                                            View →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
