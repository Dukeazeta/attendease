"use client";

import Link from "next/link";
import { useEffect, useState, useRef, use } from "react";
import QRCode from "qrcode";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { redirect, useRouter } from "next/navigation";
import type { Id } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft, Activity, MapPin, Clock, Users,
    QrCode, Copy, Check, LogOut, Download,
    Plus, Edit3, Trash2, X, ShieldCheck, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Attendance {
    _id: Id<"attendances">;
    matricNumber: string;
    studentName: string;
    signedAt: number;
    isManualEntry: boolean;
}

function SessionContent({ sessionId }: { sessionId: Id<"attendanceSessions"> }) {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [copied, setCopied] = useState(false);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    // Form states
    const [addForm, setAddForm] = useState({ matricNumber: "", studentName: "" });
    const [editForm, setEditForm] = useState({ matricNumber: "", studentName: "" });

    // Convex queries and mutations
    const session = useQuery(api.sessions.get, { id: sessionId });
    const attendances = useQuery(api.attendance.listBySession, { sessionId });
    const endSessionMutation = useMutation(api.sessions.endSession);
    const addManualMutation = useMutation(api.attendance.addManual);
    const updateAttendanceMutation = useMutation(api.attendance.update);
    const removeAttendanceMutation = useMutation(api.attendance.remove);

    const sortedAttendances = attendances
        ? [...attendances].sort((a, b) => a.studentName.localeCompare(b.studentName))
        : [];

    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/attend/${session?.shareCode}`
        : "";

    // Generate QR code with Antigravity palette
    useEffect(() => {
        if (canvasRef.current && session?.isActive && shareUrl) {
            QRCode.toCanvas(canvasRef.current, shareUrl, {
                width: 240,
                margin: 2,
                color: {
                    dark: "#ffffff",
                    light: "#00000000", // Transparent background
                },
            });
        }
    }, [shareUrl, session?.isActive]);

    // Timer logic
    useEffect(() => {
        if (!session) return;
        const updateTimeLeft = () => {
            const now = new Date();
            const end = new Date(session.endTime);
            const diff = end.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft("SESSION EXPIRED");
                return;
            }
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${h > 0 ? h + 'h ' : ''}${m}m ${s < 10 ? '0' + s : s}s`);
        };
        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);
        return () => clearInterval(interval);
    }, [session]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEndSession = async () => {
        if (confirm("Deactivate this attendance infrastructure? This cannot be reversed.")) {
            await endSessionMutation({ id: sessionId });
        }
    };

    const exportToCSV = () => {
        const headers = ["Student Name", "Matric Number"];
        const rows = sortedAttendances.map((a) => [a.studentName, a.matricNumber]);
        const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance-${session?.course?.courseCode}-${new Date().toLocaleDateString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setModalError(null);
        try {
            await addManualMutation({
                sessionId,
                matricNumber: addForm.matricNumber,
                studentName: addForm.studentName,
            });
            setShowAddModal(false);
            setAddForm({ matricNumber: "", studentName: "" });
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to add student");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAttendance) return;
        setIsSubmitting(true);
        setModalError(null);
        try {
            await updateAttendanceMutation({
                id: selectedAttendance._id,
                matricNumber: editForm.matricNumber,
                studentName: editForm.studentName,
            });
            setShowEditModal(false);
            setSelectedAttendance(null);
            setEditForm({ matricNumber: "", studentName: "" });
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to update student");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteStudent = async () => {
        if (!selectedAttendance) return;
        setIsSubmitting(true);
        setModalError(null);
        try {
            await removeAttendanceMutation({ id: selectedAttendance._id });
            setShowDeleteConfirm(false);
            setSelectedAttendance(null);
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to delete student");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (session === undefined || attendances === undefined) {
        return (
            <div className="min-h-screen bg-background bg-grain flex items-center justify-center">
                <div className="fixed inset-0 kinetic-mesh opacity-50" />
                <div className="relative z-10 w-12 h-12 border-t-2 border-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (session === null) {
        router.push("/dashboard");
        return null;
    }

    return (
        <div className="min-h-screen bg-background text-foreground bg-grain overflow-x-hidden relative">
            <div className="fixed inset-0 kinetic-mesh opacity-30 pointer-events-none" />

            {/* Mission Control Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass m-4 rounded-2xl max-w-7xl mx-auto backdrop-blur-2xl">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="p-2 glass rounded-xl hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-4 h-4 text-white/50" />
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm font-bold tracking-tight text-white leading-none">
                                    {session.course?.courseCode}
                                </h1>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${session.isActive
                                        ? "bg-accent/10 text-accent border border-accent/20"
                                        : "bg-white/5 text-white/30 border border-white/5"
                                    }`}>
                                    {session.isActive ? "Active Monitoring" : "Sync Completed"}
                                </span>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mt-1">Infrastructure Control</p>
                        </div>
                    </div>
                    {session.isActive && (
                        <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl border-accent/20">
                            <Clock className="w-3 h-3 text-accent animate-pulse" />
                            <span className="text-xs font-mono font-bold text-accent tracking-tighter">{timeLeft}</span>
                        </div>
                    )}
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Location", val: session.location?.name, sub: session.location?.building, icon: MapPin, color: "text-blue-500" },
                        { label: "Active Nodes", val: sortedAttendances.length, sub: "Verified Entities", icon: Users, color: "text-accent" },
                        { label: "Temporal Window", val: new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sub: `End: ${new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, icon: Clock, color: "text-purple-500" },
                        { label: "System Status", val: session.isActive ? "OPERATIONAL" : "ARCHIVED", sub: "Verified Pipeline", icon: ShieldCheck, color: session.isActive ? "text-emerald-500" : "text-white/20" },
                    ].map((st, i) => (
                        <motion.div
                            key={st.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass p-6 rounded-3xl hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 glass rounded-xl">
                                    <st.icon className={`w-4 h-4 ${st.color}`} />
                                </div>
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">{st.label}</h3>
                            </div>
                            <p className="text-xl font-bold text-white tracking-tight">{st.val}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">{st.sub}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: Primary Actions & QR */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-8 rounded-[3rem] border-white/5 flex flex-col items-center text-center relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <div className="w-16 h-16 rounded-[1.5rem] glass flex items-center justify-center mb-6 relative">
                                <QrCode className="w-8 h-8 text-accent opacity-50" />
                                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
                            </div>

                            <h2 className="text-2xl font-bold text-white tracking-tighter mb-2">Access Portal.</h2>
                            <p className="text-white/40 text-xs font-light mb-8 max-w-[200px]">Deploy this visual key to authorized entities for verification.</p>

                            <div className="glass p-4 rounded-3xl mb-8 border-white/10 bg-white/[0.02]">
                                <canvas ref={canvasRef} className="block w-full max-w-[200px]" />
                            </div>

                            <div className="w-full space-y-3">
                                <Button
                                    variant={copied ? "glass" : "primary"}
                                    onClick={handleCopyLink}
                                    className="w-full rounded-2xl h-14"
                                >
                                    {copied ? (
                                        <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Copied</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copy Link</span>
                                    )}
                                </Button>
                                {session.isActive && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleEndSession}
                                        className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-destructive hover:bg-destructive/10"
                                    >
                                        Deactivate Infrastructure
                                    </Button>
                                )}
                            </div>
                            <p className="text-[10px] font-mono text-white/10 mt-6 break-all max-w-full px-4 overflow-hidden text-ellipsis whitespace-nowrap">
                                {shareUrl}
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Panel: Data Stream */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass rounded-[3rem] border-white/5 overflow-hidden flex flex-col min-h-[500px]">
                            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/50">Verification Stream</h2>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="glass"
                                        size="sm"
                                        className="rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest h-9"
                                        onClick={() => { setModalError(null); setAddForm({ matricNumber: "", studentName: "" }); setShowAddModal(true); }}
                                    >
                                        <Plus className="w-3 h-3 mr-2" /> Manual Bypass
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest text-white/40 h-9"
                                        onClick={exportToCSV}
                                    >
                                        <Download className="w-3 h-3 mr-2" /> Data Export
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 p-2">
                                {sortedAttendances.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-20">
                                        <Zap className="w-12 h-12 text-white/5 mb-6" />
                                        <p className="text-sm font-bold tracking-[0.2em] text-white/10 uppercase">Awaiting Data Entry...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {sortedAttendances.map((a, i) => (
                                            <motion.div
                                                key={a._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors rounded-2xl group"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-10 h-10 rounded-xl glass border-white/5 flex items-center justify-center text-[10px] font-bold text-white/20">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-sm font-bold text-white tracking-tight">{a.studentName}</h3>
                                                            {a.isManualEntry && (
                                                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                                                                    Manual
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest mt-0.5">
                                                            {a.matricNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-xs font-mono font-bold text-white/40">
                                                            {new Date(a.signedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                        </p>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/10">Timestamp</p>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => openEditModal(a)}
                                                            className="p-2 glass rounded-lg hover:text-accent transition-colors"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteConfirm(a)}
                                                            className="p-2 glass rounded-lg hover:text-destructive transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals - Standardized Antigravity Glass Modals */}
            <AnimatePresence>
                {(showAddModal || showEditModal || showDeleteConfirm) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass p-10 rounded-[3rem] border-white/10 max-w-md w-full relative shadow-3xl"
                        >
                            <button
                                onClick={() => { setShowAddModal(false); setShowEditModal(false); setShowDeleteConfirm(false); }}
                                className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {(showAddModal || showEditModal) && (
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tighter mb-2">
                                        {showAddModal ? "Manual Provisioning" : "Identify Modulation"}
                                    </h3>
                                    <p className="text-white/30 text-xs font-light mb-8">
                                        Enter student metrics to authenticate record.
                                    </p>
                                    <form onSubmit={showAddModal ? handleAddStudent : handleEditStudent} className="space-y-6">
                                        <Input
                                            label="Entity Identifier (Matric)"
                                            placeholder="ID-V2-000000"
                                            value={showAddModal ? addForm.matricNumber : editForm.matricNumber}
                                            onChange={(e) => showAddModal
                                                ? setAddForm({ ...addForm, matricNumber: e.target.value })
                                                : setEditForm({ ...editForm, matricNumber: e.target.value })
                                            }
                                            required
                                            className="uppercase"
                                        />
                                        <Input
                                            label="Legal Identity (Name)"
                                            placeholder="Operator Name"
                                            value={showAddModal ? addForm.studentName : editForm.studentName}
                                            onChange={(e) => showAddModal
                                                ? setAddForm({ ...addForm, studentName: e.target.value })
                                                : setEditForm({ ...editForm, studentName: e.target.value })
                                            }
                                            required
                                        />
                                        {modalError && <p className="text-destructive text-[10px] font-bold uppercase tracking-widest">{modalError}</p>}
                                        <Button type="submit" className="w-full h-14 rounded-2xl" isLoading={isSubmitting}>
                                            {showAddModal ? "Commit Record" : "Apply Modulation"}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {showDeleteConfirm && (
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl glass flex items-center justify-center">
                                        <Trash2 className="w-8 h-8 text-destructive opacity-50" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tighter mb-2 text-glow-red">Sever Connection?</h3>
                                    <p className="text-white/40 text-xs font-light mb-8 leading-relaxed">
                                        Are you sure you want to permanently remove <span className="text-white font-bold">{selectedAttendance?.studentName}</span> from this session pipeline?
                                    </p>
                                    {modalError && <p className="text-destructive text-[10px] font-bold uppercase tracking-widest mb-4">{modalError}</p>}
                                    <div className="flex gap-4">
                                        <Button variant="glass" className="flex-1 rounded-2xl h-14" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                                        <Button
                                            variant="primary"
                                            className="flex-1 rounded-2xl h-14 bg-destructive hover:bg-destructive/90 text-white"
                                            onClick={handleDeleteStudent}
                                            isLoading={isSubmitting}
                                        >
                                            Sever
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function RedirectToLogin() {
    redirect("/login");
    return null;
}

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <>
            <Authenticated><SessionContent sessionId={id as Id<"attendanceSessions">} /></Authenticated>
            <Unauthenticated><RedirectToLogin /></Unauthenticated>
        </>
    );
}
