import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function SessionsHistoryPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const sessions = await prisma.attendanceSession.findMany({
        where: { course: { repId: session.user.id } },
        include: {
            course: true,
            location: true,
            _count: { select: { attendances: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
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
                        <h1 className="text-lg font-bold text-[var(--text-primary)]">Session History</h1>
                    </div>
                    <Link
                        href="/sessions/new"
                        className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-medium rounded-[var(--radius-md)] transition text-sm shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                    >
                        + New Session
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="card-industrial overflow-hidden animate-fade-in opacity-0">
                    {sessions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-[var(--text-secondary)] mb-4">No sessions created yet.</p>
                            <Link
                                href="/sessions/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] rounded-[var(--radius-md)] transition font-medium"
                            >
                                Create Session
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-subtle)]">
                            {sessions.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/sessions/${s.id}`}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors block"
                                >
                                    <div>
                                        <h3 className="text-[var(--text-primary)] font-medium">
                                            {s.course.courseCode} - {s.course.courseTitle}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] text-sm">
                                            📍 {s.location.name} • <span className="text-[var(--accent-primary)]">{s._count.attendances} signed</span>
                                        </p>
                                        <p className="text-[var(--text-muted)] text-xs mt-1">
                                            {new Date(s.startTime).toLocaleDateString()} at{" "}
                                            {new Date(s.startTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${s.isActive
                                                ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20"
                                                : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-default)]"
                                                }`}
                                        >
                                            {s.isActive ? "Active" : "Ended"}
                                        </span>
                                        <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

