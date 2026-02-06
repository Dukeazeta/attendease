"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import QRCode from "qrcode";

interface Session {
    id: string;
    shareCode: string;
    isActive: boolean;
    startTime: string;
    endTime: string;
    course: {
        courseCode: string;
        courseTitle: string;
    };
    location: {
        name: string;
        building: string | null;
    };
    attendances: {
        id: string;
        matricNumber: string;
        studentName: string;
        signedAt: string;
    }[];
}

export default function SessionClient({
    session: initialSession,
    shareUrl,
    onEndSession,
}: {
    session: Session;
    shareUrl: string;
    onEndSession: (id: string) => Promise<void>;
}) {
    const router = useRouter();
    // Sort attendances alphabetically by student name
    const [attendances, setAttendances] = useState<Session["attendances"]>(
        [...initialSession.attendances].sort((a, b) => a.studentName.localeCompare(b.studentName))
    );
    const [formattedSession, setSession] = useState(initialSession); // Renamed to avoid confusion with props
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [copied, setCopied] = useState(false);

    // Update attendances when session updates (e.g. from polling or prop update)
    useEffect(() => {
        setAttendances([...initialSession.attendances].sort((a, b) => a.studentName.localeCompare(b.studentName)));
        setSession(initialSession);
    }, [initialSession]);

    useEffect(() => {
        if (canvasRef.current && formattedSession.isActive) {
            QRCode.toCanvas(canvasRef.current, shareUrl, {
                width: 200,
                margin: 2,
                color: {
                    dark: "#F4F4F5",
                    light: "#141416",
                },
            });
        }
    }, [shareUrl, formattedSession.isActive]);

    // Timer
    useEffect(() => {
        const updateTimeLeft = () => {
            const now = new Date();
            const end = new Date(formattedSession.endTime);
            const diff = end.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("Expired");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else if (minutes > 0) {
                setTimeLeft(`${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(`${seconds}s`);
            }
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [formattedSession.endTime]);

    // Polling for updates
    useEffect(() => {
        if (!formattedSession.isActive) return;

        const interval = setInterval(() => {
            router.refresh();
        }, 5000);

        return () => clearInterval(interval);
    }, [formattedSession.isActive, router]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEndSession = async () => {
        if (confirm("Are you sure you want to end this session?")) {
            await onEndSession(formattedSession.id);
        }
    };

    const exportToCSV = () => {
        // User Request: Name before matric number, No time signed
        const headers = ["Student Name", "Matric Number"];
        const rows = attendances.map((a) => [
            a.studentName,
            a.matricNumber,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) => row.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance-${formattedSession.shareCode}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/sessions"
                            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </Link>
                        <div className="h-5 w-px bg-[var(--border-default)]" />
                        <div>
                            <h1 className="text-lg font-bold text-[var(--text-primary)]">{formattedSession.course.courseCode}</h1>
                            <p className="text-xs text-[var(--text-secondary)]">{formattedSession.course.courseTitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${formattedSession.isActive
                                    ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20"
                                    : "bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-default)]"
                                }`}
                        >
                            {formattedSession.isActive ? "Active" : "Ended"}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Session Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in opacity-0">
                    <div className="card-industrial p-5">
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Location</p>
                        <p className="text-[var(--text-primary)] font-medium">{formattedSession.location.name}</p>
                        <p className="text-[var(--text-secondary)] text-sm">{formattedSession.location.building || "—"}</p>
                    </div>
                    <div className="card-industrial p-5">
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Time Remaining</p>
                        <p className="text-[var(--text-primary)] font-medium font-mono">{timeLeft}</p>
                    </div>
                    <div className="card-industrial p-5">
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Duration</p>
                        <p className="text-[var(--text-primary)] font-medium">{new Date(formattedSession.startTime).toLocaleTimeString()}</p>
                        <p className="text-[var(--text-secondary)] text-sm">to {new Date(formattedSession.endTime).toLocaleTimeString()}</p>
                    </div>
                    <div className="card-industrial p-5">
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">Attendance</p>
                        <p className="text-[var(--accent-primary)] font-bold text-2xl">{attendances.length}</p>
                        <p className="text-[var(--text-secondary)] text-sm">students signed</p>
                    </div>
                </div>

                {/* QR Code and Actions */}
                <div className="card-industrial p-6 animate-fade-in-up opacity-0 delay-100">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 bg-white p-2 rounded-lg">
                            <canvas ref={canvasRef} className="block" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Share with Students</h2>
                            <p className="text-[var(--text-secondary)] text-sm mb-4">
                                Students can scan the QR code or use the link below to sign attendance.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleCopyLink}
                                    className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-medium rounded-[var(--radius-md)] transition shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                                >
                                    {copied ? "✓ Copied!" : "📋 Copy Attendance Link"}
                                </button>
                                {formattedSession.isActive && (
                                    <button
                                        onClick={handleEndSession}
                                        className="px-4 py-2 bg-[var(--error)]/10 hover:bg-[var(--error)]/20 text-[var(--error)] font-medium rounded-[var(--radius-md)] transition border border-[var(--error)]/20"
                                    >
                                        End Session
                                    </button>
                                )}
                            </div>
                            <p className="text-[var(--text-muted)] text-xs mt-3 font-mono break-all">{shareUrl}</p>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="card-industrial overflow-hidden animate-fade-in-up opacity-0 delay-200">
                    <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
                        <h2 className="text-base font-semibold text-[var(--text-primary)]">Attendance List</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={exportToCSV}
                                className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm rounded-[var(--radius-md)] transition border border-[var(--border-default)] flex items-center gap-2"
                            >
                                📊 Export CSV
                            </button>
                        </div>
                    </div>
                    {attendances.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <p className="text-[var(--text-secondary)]">No students have signed yet. Share the QR code!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                                        <th className="text-left px-6 py-3 text-[var(--text-muted)] text-xs uppercase tracking-wider font-medium w-16">#</th>
                                        <th className="text-left px-6 py-3 text-[var(--text-muted)] text-xs uppercase tracking-wider font-medium">Name</th>
                                        <th className="text-left px-6 py-3 text-[var(--text-muted)] text-xs uppercase tracking-wider font-medium">Matric No.</th>
                                        <th className="text-left px-6 py-3 text-[var(--text-muted)] text-xs uppercase tracking-wider font-medium">Signed At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-subtle)]">
                                    {attendances.map((a, i) => (
                                        <tr key={a.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                                            <td className="px-6 py-4 text-[var(--text-muted)] text-sm">{i + 1}</td>
                                            <td className="px-6 py-4 text-[var(--text-primary)] font-medium">{a.studentName}</td>
                                            <td className="px-6 py-4 text-[var(--text-secondary)] font-mono text-sm">{a.matricNumber || "—"}</td>
                                            <td className="px-6 py-4 text-[var(--text-secondary)] text-sm">{new Date(a.signedAt).toLocaleTimeString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
