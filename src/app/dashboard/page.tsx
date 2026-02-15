"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Activity, LogOut, Plus, BookOpen, MapPin, History, Users, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { listCourses } from "@/app/actions/courses";
import { listLocations } from "@/app/actions/locations";
import { listSessions } from "@/app/actions/sessions";

type CourseItem = Awaited<ReturnType<typeof listCourses>>[number];
type LocationItem = Awaited<ReturnType<typeof listLocations>>[number];
type SessionItem = Awaited<ReturnType<typeof listSessions>>[number];

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [signOutError, setSignOutError] = useState<string | null>(null);

    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [locations, setLocations] = useState<LocationItem[]>([]);
    const [sessions, setSessions] = useState<SessionItem[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [c, l, s] = await Promise.all([
                    listCourses(),
                    listLocations(),
                    listSessions()
                ]);
                setCourses(c);
                setLocations(l);
                setSessions(s);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setIsLoadingData(false);
            }
        }
        if (status === "authenticated") {
            fetchData();
        }
    }, [status]);

    const handleSignOut = async () => {
        try {
            setSignOutError(null);
            await signOut({ redirect: false });
            router.push("/");
        } catch (error) {
            setSignOutError("Unable to sign out right now.");
        }
    };

    const recentSessions = sessions?.slice(0, 5);
    const isLoading = status === "loading" || isLoadingData;
    const user = session?.user;

    return (
        <div className="min-h-screen bg-surface text-foreground">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 glass border-b border-border">
                <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-primary flex items-center justify-center">
                            <Activity className="w-[18px] h-[18px] text-primary-foreground" />
                        </div>
                        <span className="text-[17px] font-[450] tracking-[-0.3px]">AttendEase</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-caption text-muted-foreground">
                            {user?.name || user?.email}
                        </span>
                        <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground">
                            <LogOut className="h-[18px] w-[18px]" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 py-10">
                {signOutError && (
                    <div className="mb-6 p-4 bg-destructive/5 border border-destructive/15 text-[13px] font-[450] text-destructive rounded-[var(--radius-full)]">
                        {signOutError}
                    </div>
                )}

                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <h1 className="text-headline-3 text-foreground mb-2">
                        {isLoading ? (
                            <span className="inline-block w-48 h-8 bg-surface-container rounded-[var(--radius-sm)] animate-pulse" />
                        ) : (
                            <>Welcome, {user?.name || "Operator"}</>
                        )}
                    </h1>
                    <p className="text-caption text-muted-foreground">Your attendance management dashboard.</p>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
                >
                    {[
                        { icon: BookOpen, label: "Courses", value: courses?.length ?? 0, color: "text-blue-600 bg-blue-50" },
                        { icon: MapPin, label: "Locations", value: locations?.length ?? 0, color: "text-emerald-600 bg-emerald-50" },
                        { icon: History, label: "Sessions", value: sessions?.length ?? 0, color: "text-violet-600 bg-violet-50" },
                        { icon: Users, label: "Total Sessions", value: sessions?.length ?? 0, color: "text-amber-600 bg-amber-50" },
                    ].map((stat, i) => (
                        <div key={i} className="surface-elevated p-6 flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-[18px] h-[18px]" />
                            </div>
                            <div>
                                <p className="text-[28px] font-[450] text-foreground leading-none mb-0.5">
                                    {isLoading ? (
                                        <span className="inline-block w-8 h-7 bg-surface-container rounded animate-pulse" />
                                    ) : stat.value}
                                </p>
                                <p className="text-small text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
                >
                    {[
                        { href: "/sessions/new", icon: Plus, label: "New Session", desc: "Start a new attendance session", primary: true },
                        { href: "/courses", icon: BookOpen, label: "Courses", desc: "Manage your courses" },
                        { href: "/locations", icon: MapPin, label: "Locations", desc: "Manage saved locations" },
                    ].map((action, i) => (
                        <Link key={i} href={action.href}>
                            <div className={`p-6 rounded-[var(--radius-lg)] transition-all duration-200 h-full cursor-pointer ${action.primary
                                ? "surface-inverse hover:bg-[#2F3034]"
                                : "surface-elevated hover:shadow-lg"
                                }`}>
                                <div className={`w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center mb-4 ${action.primary ? "bg-white/10" : "bg-surface-container"
                                    }`}>
                                    <action.icon className={`w-[18px] h-[18px] ${action.primary ? "text-white/70" : "text-muted-foreground"}`} />
                                </div>
                                <h3 className={`text-[15px] font-[450] mb-1 ${action.primary ? "" : "text-foreground"}`}>{action.label}</h3>
                                <p className={`text-small ${action.primary ? "text-white/50" : "text-muted-foreground"}`}>{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </motion.div>

                {/* Recent Sessions */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div className="surface-elevated overflow-hidden">
                        <div className="px-6 py-5 flex items-center justify-between border-b border-border">
                            <div className="flex items-center gap-3">
                                <Layers className="w-[18px] h-[18px] text-muted-foreground" />
                                <h2 className="text-[15px] font-[450] text-foreground">Recent Sessions</h2>
                            </div>
                            <Link href="/sessions" className="text-small text-accent hover:text-accent/80 transition-colors">
                                View All
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-12 bg-surface-container rounded-[var(--radius-sm)] animate-pulse" />
                                ))}
                            </div>
                        ) : recentSessions && recentSessions.length > 0 ? (
                            <div className="divide-y divide-border">
                                {recentSessions.map((session) => (
                                    <Link key={session.id} href={`/sessions/${session.id}`} className="block hover:bg-surface-container/50 transition-colors">
                                        <div className="px-6 py-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-[14.5px] font-[450] text-foreground">{session.course?.courseCode} — {session.course?.courseTitle}</p>
                                                <p className="text-small text-muted-foreground mt-0.5">
                                                    {new Date(session.startTime).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[11px] font-[450] tracking-[0.3px] uppercase ${session.isActive
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-surface-container text-muted-foreground'
                                                }`}>
                                                {session.isActive ? 'Active' : 'Ended'}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-surface-container flex items-center justify-center mx-auto mb-4">
                                    <Layers className="w-6 h-6 text-muted-foreground/40" />
                                </div>
                                <p className="text-caption text-muted-foreground">No sessions yet.</p>
                                <Link href="/sessions/new" className="text-small text-accent hover:text-accent/80 mt-2 inline-block">
                                    Start your first session
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
