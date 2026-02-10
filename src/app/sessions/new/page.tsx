"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { redirect } from "next/navigation";
import type { Id } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Layers, BookOpen, MapPin, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";

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
            <div className="min-h-screen bg-background bg-grain flex items-center justify-center">
                <div className="fixed inset-0 kinetic-mesh opacity-50" />
                <div className="relative z-10 w-12 h-12 border-t-2 border-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    const EmptyState = ({ title, description, href, actionLabel, icon: Icon }: any) => (
        <div className="min-h-screen bg-background bg-grain flex items-center justify-center p-6 text-center">
            <div className="fixed inset-0 kinetic-mesh opacity-30" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 glass p-12 rounded-[3.5rem] max-w-md w-full border-white/5"
            >
                <div className="w-20 h-20 mx-auto mb-8 rounded-[2rem] glass flex items-center justify-center">
                    <Icon className="w-10 h-10 text-white/30" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tighter mb-4">{title}</h2>
                <p className="text-white/40 font-light mb-10 leading-relaxed">{description}</p>
                <Link href={href}>
                    <Button variant="primary" className="w-full rounded-2xl h-14">
                        {actionLabel}
                    </Button>
                </Link>
            </motion.div>
        </div>
    );

    if (courses.length === 0) {
        return <EmptyState
            title="No Courses"
            description="Bridge the connection. You must register at least one course infrastructure before initializing sessions."
            href="/courses"
            actionLabel="Initialize Courses"
            icon={BookOpen}
        />;
    }

    if (locations.length === 0) {
        return <EmptyState
            title="No Locations"
            description="Geospatial data missing. Map your class locations to enable verified attendance tracking."
            href="/locations"
            actionLabel="Map Locations"
            icon={MapPin}
        />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground bg-grain overflow-hidden relative">
            <div className="fixed inset-0 kinetic-mesh opacity-30 pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass m-4 rounded-2xl max-w-7xl mx-auto backdrop-blur-2xl">
                <div className="px-6 py-4 flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-4 h-4 text-white/50" />
                    </Link>
                    <div className="h-4 w-px bg-white/10" />
                    <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white/70">Initialize Session</h1>
                </div>
            </header>

            <main className="relative z-10 flex flex-col items-center justify-center min-h-screen pt-24 px-6 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-lg"
                >
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-accent/20 mb-6">
                            <Activity className="w-3 h-3 text-accent" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Infrastructure Prep</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">Provisioning.</h2>
                        <p className="text-white/40 font-light tracking-wide max-w-sm mx-auto">Configure the parameters for your attendance infrastructure.</p>
                    </div>

                    <div className="glass p-10 rounded-[3rem] border-white/5 backdrop-blur-3xl shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <div className="p-4 glass border-destructive/20 text-xs font-bold uppercase tracking-widest text-destructive rounded-2xl">
                                    Config Error: {error}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1 flex items-center gap-2">
                                        <BookOpen className="w-3 h-3" />
                                        Target Infrastructure (Course)
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="courseId"
                                            required
                                            className="w-full h-14 glass rounded-2xl px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer hover:bg-white/5 transition-all"
                                        >
                                            <option value="" className="bg-neutral-900">Select course identifier...</option>
                                            {courses.map((course: any) => (
                                                <option key={course._id} value={course._id} className="bg-neutral-900">
                                                    {course.courseCode} — {course.courseTitle}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1 flex items-center gap-2">
                                        <MapPin className="w-3 h-3" />
                                        Geospatial Domain (Location)
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="locationId"
                                            required
                                            className="w-full h-14 glass rounded-2xl px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer hover:bg-white/5 transition-all"
                                        >
                                            <option value="" className="bg-neutral-900">Select mapped location...</option>
                                            {locations.map((location: any) => (
                                                <option key={location._id} value={location._id} className="bg-neutral-900">
                                                    {location.name} {location.building && `(${location.building})`}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1 flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        Temporal Window (Duration)
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="duration"
                                            required
                                            className="w-full h-14 glass rounded-2xl px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer hover:bg-white/5 transition-all"
                                        >
                                            {[15, 30, 45, 60, 90, 120].map((m) => (
                                                <option key={m} value={m} className="bg-neutral-900">
                                                    {m >= 60 ? `${m / 60} ${m === 60 ? "Hour" : "Hours"}` : `${m} Minutes`}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 rounded-[1.5rem] tracking-wide text-lg"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                        Deploying Infrastructure...
                                    </span>
                                ) : "Initialize Session Pipeline"}
                            </Button>
                        </form>
                    </div>

                    <div className="mt-8 flex justify-center gap-8 border-t border-white/5 pt-8">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            Verified Protocol
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            Real-time Sync
                        </div>
                    </div>
                </motion.div>
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
