"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, MapPin, Clock, Activity, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { listCourses } from "@/app/actions/courses";
import { listLocations } from "@/app/actions/locations";
import { createSession } from "@/app/actions/sessions";

type CourseItem = Awaited<ReturnType<typeof listCourses>>[number];
type LocationItem = Awaited<ReturnType<typeof listLocations>>[number];

type EmptyStateProps = {
    title: string;
    description: string;
    href: string;
    actionLabel: string;
    icon: LucideIcon;
};

export default function NewSessionPage() {
    const router = useRouter();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [locations, setLocations] = useState<LocationItem[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [c, l] = await Promise.all([listCourses(), listLocations()]);
                setCourses(c);
                setLocations(l);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const durationMinutes = parseInt(formData.get("duration") as string);

        try {
            const sessionId = await createSession({
                courseId: formData.get("courseId") as string,
                locationId: formData.get("locationId") as string,
                durationMinutes,
            });
            router.push(`/sessions/${sessionId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create session");
            setIsCreating(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const EmptyState = ({ title, description, href, actionLabel, icon: Icon }: EmptyStateProps) => (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="surface-card p-12 max-w-md w-full"
            >
                <div className="w-16 h-16 mx-auto mb-6 rounded-[var(--radius-lg)] bg-surface-container flex items-center justify-center">
                    <Icon className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h2 className="text-headline-3 text-foreground mb-3">{title}</h2>
                <p className="text-caption text-muted-foreground mb-8 leading-relaxed">{description}</p>
                <Link href={href}>
                    <Button className="w-full h-12">{actionLabel}</Button>
                </Link>
            </motion.div>
        </div>
    );

    if (courses.length === 0) {
        return <EmptyState
            title="No Courses"
            description="You need at least one course before you can start an attendance session."
            href="/courses"
            actionLabel="Add Courses"
            icon={BookOpen}
        />;
    }

    if (locations.length === 0) {
        return <EmptyState
            title="No Locations"
            description="Add your class locations to enable geotagged attendance tracking."
            href="/locations"
            actionLabel="Map Locations"
            icon={MapPin}
        />;
    }

    return (
        <div className="min-h-screen bg-surface text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border">
                <div className="max-w-[700px] mx-auto px-6 h-14 flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-[13px] font-[450] group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                    <div className="h-5 w-px bg-border" />
                    <h1 className="text-[15px] font-[450] text-foreground">New Session</h1>
                </div>
            </header>

            <main className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full max-w-lg"
                >
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-full)] bg-surface-container text-small text-muted-foreground mb-5">
                            <Activity className="w-3.5 h-3.5 text-accent" />
                            Session Setup
                        </div>
                        <h2 className="text-headline-2 text-foreground mb-3">Create Session</h2>
                        <p className="text-caption text-muted-foreground max-w-sm mx-auto">Configure the parameters for your attendance session.</p>
                    </div>

                    <div className="surface-card p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-destructive/5 border border-destructive/15 text-[13px] font-[450] text-destructive rounded-full">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                {/* Course */}
                                <div className="space-y-2">
                                    <label className="text-[13px] font-[450] text-muted-foreground ml-0.5 flex items-center gap-2">
                                        <BookOpen className="w-3.5 h-3.5" /> Course
                                    </label>
                                    <div className="relative">
                                        <select name="courseId" required
                                            className="w-full h-12 rounded-full border border-border bg-background px-5 text-[15px] text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 appearance-none cursor-pointer transition-all"
                                        >
                                            <option value="">Select course...</option>
                                            {courses.map((course) => (
                                                <option key={course.id} value={course.id}>
                                                    {course.courseCode} — {course.courseTitle}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                                            <Layers className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <label className="text-[13px] font-[450] text-muted-foreground ml-0.5 flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" /> Location
                                    </label>
                                    <div className="relative">
                                        <select name="locationId" required
                                            className="w-full h-12 rounded-full border border-border bg-background px-5 text-[15px] text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 appearance-none cursor-pointer transition-all"
                                        >
                                            <option value="">Select location...</option>
                                            {locations.map((location) => (
                                                <option key={location.id} value={location.id}>
                                                    {location.name} {location.building && `(${location.building})`}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="space-y-2">
                                    <label className="text-[13px] font-[450] text-muted-foreground ml-0.5 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Duration
                                    </label>
                                    <div className="relative">
                                        <select name="duration" required
                                            className="w-full h-12 rounded-full border border-border bg-background px-5 text-[15px] text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 appearance-none cursor-pointer transition-all"
                                        >
                                            {[15, 30, 45, 60, 90, 120].map((m) => (
                                                <option key={m} value={m}>
                                                    {m >= 60 ? `${m / 60} ${m === 60 ? "Hour" : "Hours"}` : `${m} Minutes`}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 mt-2" isLoading={isCreating}>
                                Start Session
                            </Button>
                        </form>
                    </div>

                    <div className="mt-6 flex justify-center gap-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 text-small text-muted-foreground/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-success" />
                            Verified Protocol
                        </div>
                        <div className="flex items-center gap-2 text-small text-muted-foreground/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            Real-time Sync
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
