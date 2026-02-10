"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Activity, LogOut, Plus, BookOpen, MapPin, History, Users, Layers } from "lucide-react";
import { motion } from "framer-motion";

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
            <div className="min-h-screen bg-background bg-grain flex items-center justify-center">
                <div className="fixed inset-0 kinetic-mesh opacity-50" />
                <div className="relative z-10 w-12 h-12 border-t-2 border-accent rounded-full animate-spin"></div>
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
        <div className="min-h-screen bg-background text-foreground bg-grain overflow-x-hidden">
            {/* Cinematic Background */}
            <div className="fixed inset-0 kinetic-mesh opacity-30 pointer-events-none" />
            <div className="fixed top-[-10%] right-[-10%] glow-orb opacity-10" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass m-4 rounded-2xl max-w-7xl mx-auto backdrop-blur-2xl">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg shadow-accent/20">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-white leading-none">AttendEase</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">{user.name}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-white/40 hover:text-white"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">Dashboard</h2>
                    <p className="text-white/40 font-light tracking-wide">Real-time attendance infrastructure and analytics.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: "Total Courses", value: courseCount, icon: BookOpen, color: "text-blue-500" },
                        { label: "Active Sessions", value: activeSessionCount, icon: Layers, color: "text-purple-500", live: activeSessionCount > 0 },
                        { label: "Signed Today", value: totalStudentsSigned, icon: Users, color: "text-accent" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-3xl hover:bg-white/5 transition-colors group relative overflow-hidden"
                        >
                            {stat.live && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 px-2 py-1 rounded-full glass border-emerald-500/20">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live</span>
                                </div>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</h3>
                            </div>
                            <p className="text-5xl font-bold tracking-tighter text-white group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {[
                        { href: "/sessions/new", label: "New Session", icon: Plus, variant: "primary" as const },
                        { href: "/courses", label: "Courses", icon: BookOpen, variant: "glass" as const },
                        { href: "/locations", label: "Locations", icon: MapPin, variant: "glass" as const },
                        { href: "/sessions", label: "History", icon: History, variant: "glass" as const },
                    ].map((action, i) => (
                        <motion.div
                            key={action.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                        >
                            <Link href={action.href} className="block group">
                                <Button
                                    variant={action.variant}
                                    className="w-full h-16 justify-center rounded-2xl tracking-wide group-hover:border-accent/50 transition-all"
                                >
                                    <action.icon className="w-4 h-4 mr-2" />
                                    {action.label}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Active Sessions Table / List */}
                <div className="glass rounded-[2rem] overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-accent" />
                            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/50">Active Infrastructure</h2>
                        </div>
                        {activeSessions.length > 0 && (
                            <div className="px-2 py-0.5 rounded-full glass border-white/10 text-[10px] font-bold text-white/40">
                                {activeSessions.length} Running
                            </div>
                        )}
                    </div>

                    <div className="p-2">
                        {activeSessions.length === 0 ? (
                            <div className="p-20 text-center">
                                <Activity className="w-12 h-12 text-white/10 mx-auto mb-6" />
                                <p className="text-white/40 font-light mb-8">No active sessions detected.</p>
                                <Link href="/sessions/new">
                                    <Button variant="primary" className="rounded-full px-8">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Initialize Session
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {activeSessions.map((sess) => (
                                    <motion.div
                                        key={sess._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors rounded-2xl group"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center relative z-10">
                                                    <BookOpen className="w-5 h-5 text-accent" />
                                                </div>
                                                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse-slow" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-accent transition-colors">
                                                    {sess.course?.courseCode}
                                                </h3>
                                                <div className="flex items-center gap-2 text-white/30 text-xs mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {sess.location?.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-white tracking-tighter leading-none">{sess.attendanceCount}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">Verified</p>
                                            </div>
                                            <Link href={`/sessions/${sess._id}`}>
                                                <Button variant="glass" size="sm" className="rounded-full px-4 border-white/5 hover:border-accent/30 group">
                                                    View Details
                                                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
