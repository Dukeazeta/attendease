"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function SessionsContent() {
    const sessions = useQuery(api.sessions.list);

    if (sessions === undefined) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border">
                <div className="max-w-[900px] mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-[13px] font-[450] group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </Link>
                        <div className="h-5 w-px bg-border" />
                        <h1 className="text-[15px] font-[450] text-foreground">Session History</h1>
                    </div>
                    <Link href="/sessions/new">
                        <Button size="sm" className="gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            New Session
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="surface-elevated overflow-hidden"
                >
                    {sessions.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-surface-container flex items-center justify-center mx-auto mb-4">
                                <History className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-caption text-muted-foreground mb-4">No sessions created yet.</p>
                            <Link href="/sessions/new">
                                <Button size="sm">Create Session</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {sessions.map((s: any) => (
                                <Link
                                    key={s._id}
                                    href={`/sessions/${s._id}`}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-surface-container/50 transition-colors block"
                                >
                                    <div>
                                        <h3 className="text-[14.5px] font-[450] text-foreground">
                                            {s.course?.courseCode} — {s.course?.courseTitle}
                                        </h3>
                                        <p className="text-small text-muted-foreground mt-0.5">
                                            {s.location?.name}
                                            <span className="text-accent ml-2">{s.attendanceCount} signed</span>
                                        </p>
                                        <p className="text-[11px] text-muted-foreground/60 mt-1">
                                            {new Date(s.startTime).toLocaleDateString()} at{" "}
                                            {new Date(s.startTime).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-[11px] font-[450] tracking-[0.3px] uppercase ${s.isActive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-surface-container text-muted-foreground"
                                            }`}>
                                            {s.isActive ? "Active" : "Ended"}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}

function RedirectToLogin() {
    redirect("/login");
    return null;
}

export default function SessionsHistoryPage() {
    return (
        <>
            <Authenticated>
                <SessionsContent />
            </Authenticated>
            <Unauthenticated>
                <RedirectToLogin />
            </Unauthenticated>
        </>
    );
}
