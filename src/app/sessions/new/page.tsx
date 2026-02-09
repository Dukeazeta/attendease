"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { redirect } from "next/navigation";
import type { Id } from "../../../../convex/_generated/dataModel";

function NewSessionContent() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const courses = useQuery(api.courses.list);
    const locations = useQuery(api.locations.list);
    const createSession = useMutation(api.sessions.create);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const durationMinutes = parseInt(formData.get("duration") as string);

        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);

        try {
            const sessionId = await createSession({
                courseId: formData.get("courseId") as Id<"courses">,
                locationId: formData.get("locationId") as Id<"locations">,
                durationMinutes,
            });

            router.push(`/sessions/${sessionId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create session");
            setIsLoading(false);
        }
    };

    // Loading state
    if (courses === undefined || locations === undefined) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial flex items-center justify-center">
                <div className="text-center p-8 animate-fade-in opacity-0">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                        <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">No Courses Found</h2>
                    <p className="text-[var(--text-secondary)] mb-6">You need to add courses before creating a session.</p>
                    <Link
                        href="/courses"
                        className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-medium rounded-[var(--radius-md)] transition shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                    >
                        Add Courses
                    </Link>
                </div>
            </div>
        );
    }

    if (locations.length === 0) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial flex items-center justify-center">
                <div className="text-center p-8 animate-fade-in opacity-0">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                        <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">No Locations Found</h2>
                    <p className="text-[var(--text-secondary)] mb-6">You need to add class locations before creating a session.</p>
                    <Link
                        href="/locations"
                        className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-medium rounded-[var(--radius-md)] transition shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                    >
                        Add Locations
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </Link>
                    <div className="h-5 w-px bg-[var(--border-default)]" />
                    <h1 className="text-lg font-bold text-[var(--text-primary)]">Create Attendance Session</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="card-industrial p-8 animate-fade-in opacity-0">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-[var(--error)]/10 border border-[var(--error)]/30 rounded-[var(--radius-md)] text-[var(--error)] text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Select Course
                            </label>
                            <select
                                name="courseId"
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2371717A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="" className="bg-[var(--bg-secondary)]">Choose a course...</option>
                                {courses.map((course: any) => (
                                    <option key={course._id} value={course._id} className="bg-[var(--bg-secondary)]">
                                        {course.courseCode} - {course.courseTitle}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Select Location
                            </label>
                            <select
                                name="locationId"
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2371717A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="" className="bg-[var(--bg-secondary)]">Choose a location...</option>
                                {locations.map((location: any) => (
                                    <option key={location._id} value={location._id} className="bg-[var(--bg-secondary)]">
                                        {location.name} {location.building && `(${location.building})`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Session Duration
                            </label>
                            <select
                                name="duration"
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2371717A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="15" className="bg-[var(--bg-secondary)]">15 minutes</option>
                                <option value="30" className="bg-[var(--bg-secondary)]">30 minutes</option>
                                <option value="45" className="bg-[var(--bg-secondary)]">45 minutes</option>
                                <option value="60" className="bg-[var(--bg-secondary)]">1 hour</option>
                                <option value="90" className="bg-[var(--bg-secondary)]">1.5 hours</option>
                                <option value="120" className="bg-[var(--bg-secondary)]">2 hours</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-4 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                        >
                            {isLoading ? "Creating Session..." : "Start Session"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

function RedirectToLogin() {
    redirect("/login");
    return null;
}

export default function NewSessionPage() {
    return (
        <>
            <Authenticated>
                <NewSessionContent />
            </Authenticated>
            <Unauthenticated>
                <RedirectToLogin />
            </Unauthenticated>
        </>
    );
}
