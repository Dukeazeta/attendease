"use client";

import Link from "next/link";
import { useEffect, useState, useRef, use } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft, Activity, MapPin, Clock, Users,
    QrCode, Copy, Check, Download,
    Plus, Edit3, Trash2, X, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSession, endSession } from "@/app/actions/sessions";
import { listAttendancesBySession, addManualAttendance, updateAttendance, removeAttendance } from "@/app/actions/attendance";

interface Attendance {
    id: string;
    matricNumber: string;
    studentName: string;
    signedAt: number;
    isManualEntry: boolean;
}

function SessionContent({ sessionId }: { sessionId: string }) {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [copied, setCopied] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalError, setModalError] = useState<string | null>(null);

    const [addForm, setAddForm] = useState({ matricNumber: "", studentName: "" });
    const [editForm, setEditForm] = useState({ matricNumber: "", studentName: "" });

    const [session, setSession] = useState<any>(null);
    const [attendances, setAttendances] = useState<Attendance[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [s, a] = await Promise.all([
                    getSession(sessionId),
                    listAttendancesBySession(sessionId)
                ]);
                if (!s) {
                    router.push("/dashboard");
                    return;
                }
                setSession(s);
                setAttendances(a as Attendance[]);
            } catch (err) {
                console.error("Failed to fetch session data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [sessionId, router]);

    const sortedAttendances = [...attendances].sort((a, b) => a.studentName.localeCompare(b.studentName));

    const shareUrl = typeof window !== "undefined" && session
        ? `${window.location.origin}/attend/${session.shareCode}`
        : "";

    // Generate QR with Antigravity-appropriate colors
    useEffect(() => {
        if (canvasRef.current && session?.isActive && shareUrl) {
            QRCode.toCanvas(canvasRef.current, shareUrl, {
                width: 220,
                margin: 2,
                color: {
                    dark: "#121317",
                    light: "#FFFFFF",
                },
            });
        }
    }, [shareUrl, session?.isActive]);

    useEffect(() => {
        if (!session) return;
        const updateTimeLeft = () => {
            const now = new Date();
            const end = new Date(session.endTime);
            const diff = end.getTime() - now.getTime();
            if (diff <= 0) { setTimeLeft("EXPIRED"); return; }
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
        if (confirm("End this attendance session? This cannot be reversed.")) {
            try {
                await endSession(sessionId);
                const updatedSession = await getSession(sessionId);
                setSession(updatedSession);
            } catch (err) {
                console.error("Failed to end session:", err);
            }
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
            await addManualAttendance({ sessionId, matricNumber: addForm.matricNumber, studentName: addForm.studentName });
            const updatedAttendances = await listAttendancesBySession(sessionId);
            setAttendances(updatedAttendances as Attendance[]);
            setShowAddModal(false);
            setAddForm({ matricNumber: "", studentName: "" });
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to add student");
        } finally { setIsSubmitting(false); }
    };

    const handleEditStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAttendance) return;
        setIsSubmitting(true);
        setModalError(null);
        try {
            await updateAttendance({ id: selectedAttendance.id, matricNumber: editForm.matricNumber, studentName: editForm.studentName });
            const updatedAttendances = await listAttendancesBySession(sessionId);
            setAttendances(updatedAttendances as Attendance[]);
            setShowEditModal(false);
            setSelectedAttendance(null);
            setEditForm({ matricNumber: "", studentName: "" });
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to update student");
        } finally { setIsSubmitting(false); }
    };

    const handleDeleteStudent = async () => {
        if (!selectedAttendance) return;
        setIsSubmitting(true);
        setModalError(null);
        try {
            await removeAttendance(selectedAttendance.id);
            const updatedAttendances = await listAttendancesBySession(sessionId);
            setAttendances(updatedAttendances as Attendance[]);
            setShowDeleteConfirm(false);
            setSelectedAttendance(null);
        } catch (err) {
            setModalError(err instanceof Error ? err.message : "Failed to delete student");
        } finally { setIsSubmitting(false); }
    };

    const openEditModal = (a: Attendance) => {
        setSelectedAttendance(a);
        setEditForm({ matricNumber: a.matricNumber, studentName: a.studentName });
        setModalError(null);
        setShowEditModal(true);
    };

    const openDeleteConfirm = (a: Attendance) => {
        setSelectedAttendance(a);
        setModalError(null);
        setShowDeleteConfirm(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-surface text-foreground overflow-x-hidden">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-border">
                <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-[13px] font-[450] group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </Link>
                        <div className="h-5 w-px bg-border" />
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-[15px] font-[450] text-foreground leading-none">{session.course?.courseCode}</h1>
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-[450] ${session.isActive ? "bg-emerald-50 text-emerald-700" : "bg-surface-container text-muted-foreground"
                                    }`}>
                                    {session.isActive ? "Active" : "Ended"}
                                </span>
                            </div>
                        </div>
                    </div>
                    {session.isActive && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span className="text-[13px] font-mono font-[450] text-accent">{timeLeft}</span>
                        </div>
                    )}
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto px-6 pt-8 pb-20">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Location", val: session.location?.name, sub: session.location?.building || "—", icon: MapPin, color: "text-blue-600 bg-blue-50" },
                        { label: "Students", val: sortedAttendances.length, sub: "Verified", icon: Users, color: "text-accent bg-blue-50" },
                        { label: "Start", val: new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sub: `End: ${new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, icon: Clock, color: "text-violet-600 bg-violet-50" },
                        { label: "Status", val: session.isActive ? "Operational" : "Archived", sub: "Pipeline", icon: ShieldCheck, color: session.isActive ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground bg-surface-container" },
                    ].map((st, i) => (
                        <motion.div
                            key={st.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="surface-elevated p-5"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center ${st.color}`}>
                                    <st.icon className="w-4 h-4" />
                                </div>
                                <span className="text-small text-muted-foreground">{st.label}</span>
                            </div>
                            <p className="text-[20px] font-[450] text-foreground">{st.val}</p>
                            <p className="text-[11px] text-muted-foreground/60 mt-0.5">{st.sub}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* QR Panel */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="surface-card p-8 flex flex-col items-center text-center"
                        >
                            <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-surface-container flex items-center justify-center mb-6">
                                <QrCode className="w-7 h-7 text-accent/60" />
                            </div>
                            <h2 className="text-[18px] font-[450] text-foreground mb-1">Share Access</h2>
                            <p className="text-small text-muted-foreground mb-6">Show this QR or share the link with students.</p>

                            <div className="bg-white p-3 rounded-[var(--radius-md)] mb-6 border border-border">
                                <canvas ref={canvasRef} className="block w-full max-w-[200px]" />
                            </div>

                            <div className="w-full space-y-2">
                                <Button
                                    variant={copied ? "tonal" : "primary"}
                                    onClick={handleCopyLink}
                                    className="w-full h-11 rounded-[var(--radius-sm)] gap-2"
                                >
                                    {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                                </Button>
                                {session.isActive && (
                                    <Button variant="ghost" onClick={handleEndSession}
                                        className="w-full text-[12.5px] text-destructive hover:bg-destructive/5">
                                        End Session
                                    </Button>
                                )}
                            </div>
                            <p className="text-[11px] text-muted-foreground/40 mt-4 break-all max-w-full">{shareUrl}</p>
                        </motion.div>
                    </div>

                    {/* Attendance List */}
                    <div className="lg:col-span-2">
                        <div className="surface-elevated overflow-hidden flex flex-col min-h-[500px]">
                            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <h2 className="text-[15px] font-[450] text-foreground">Attendance ({sortedAttendances.length})</h2>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="tonal" size="sm" className="rounded-[var(--radius-sm)] gap-1.5"
                                        onClick={() => { setModalError(null); setAddForm({ matricNumber: "", studentName: "" }); setShowAddModal(true); }}>
                                        <Plus className="w-3.5 h-3.5" /> Add Student
                                    </Button>
                                    <Button variant="ghost" size="sm" className="rounded-[var(--radius-sm)] gap-1.5 text-muted-foreground"
                                        onClick={exportToCSV}>
                                        <Download className="w-3.5 h-3.5" /> Export
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1">
                                {sortedAttendances.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-20">
                                        <Users className="w-10 h-10 text-muted-foreground/20 mb-4" />
                                        <p className="text-caption text-muted-foreground/60">No students recorded yet.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {sortedAttendances.map((a, i) => (
                                            <motion.div
                                                key={a.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="px-6 py-3.5 flex items-center justify-between hover:bg-surface-container/50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-surface-container flex items-center justify-center text-[12px] font-[450] text-muted-foreground">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-[14.5px] font-[450] text-foreground">{a.studentName}</h3>
                                                            {a.isManualEntry && (
                                                                <span className="text-[10px] font-[450] px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full">
                                                                    Manual
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] font-mono text-muted-foreground/60 mt-0.5 uppercase tracking-wider">
                                                            {a.matricNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-[12px] font-mono text-muted-foreground">
                                                        {new Date(a.signedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </p>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openEditModal(a)}
                                                            className="p-1.5 rounded-[var(--radius-xs)] hover:bg-surface-container text-muted-foreground hover:text-accent transition-colors">
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button onClick={() => openDeleteConfirm(a)}
                                                            className="p-1.5 rounded-[var(--radius-xs)] hover:bg-destructive/8 text-muted-foreground hover:text-destructive transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
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

            {/* Modals */}
            <AnimatePresence>
                {(showAddModal || showEditModal || showDeleteConfirm) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 16 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 16 }}
                            className="surface-card p-8 max-w-md w-full relative shadow-xl"
                        >
                            <button
                                onClick={() => { setShowAddModal(false); setShowEditModal(false); setShowDeleteConfirm(false); }}
                                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {(showAddModal || showEditModal) && (
                                <div>
                                    <h3 className="text-[20px] font-[450] text-foreground mb-1">
                                        {showAddModal ? "Add Student" : "Edit Student"}
                                    </h3>
                                    <p className="text-small text-muted-foreground mb-6">
                                        Enter student details to {showAddModal ? "add to" : "update in"} this session.
                                    </p>
                                    <form onSubmit={showAddModal ? handleAddStudent : handleEditStudent} className="space-y-4">
                                        <Input
                                            label="Matric Number"
                                            placeholder="CSC/2022/001"
                                            value={showAddModal ? addForm.matricNumber : editForm.matricNumber}
                                            onChange={(e) => showAddModal
                                                ? setAddForm({ ...addForm, matricNumber: e.target.value })
                                                : setEditForm({ ...editForm, matricNumber: e.target.value })
                                            }
                                            required
                                            className="uppercase"
                                        />
                                        <Input
                                            label="Student Name"
                                            placeholder="Full Name"
                                            value={showAddModal ? addForm.studentName : editForm.studentName}
                                            onChange={(e) => showAddModal
                                                ? setAddForm({ ...addForm, studentName: e.target.value })
                                                : setEditForm({ ...editForm, studentName: e.target.value })
                                            }
                                            required
                                        />
                                        {modalError && <p className="text-[12.5px] font-[450] text-destructive">{modalError}</p>}
                                        <Button type="submit" className="w-full h-11 rounded-[var(--radius-sm)]" isLoading={isSubmitting}>
                                            {showAddModal ? "Add Student" : "Save Changes"}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {showDeleteConfirm && (
                                <div className="text-center">
                                    <div className="w-14 h-14 mx-auto mb-5 rounded-[var(--radius-lg)] bg-destructive/8 flex items-center justify-center">
                                        <Trash2 className="w-6 h-6 text-destructive/60" />
                                    </div>
                                    <h3 className="text-[20px] font-[450] text-foreground mb-2">Remove student?</h3>
                                    <p className="text-small text-muted-foreground mb-6 leading-relaxed">
                                        This will permanently remove <span className="font-[450] text-foreground">{selectedAttendance?.studentName}</span> from this session.
                                    </p>
                                    {modalError && <p className="text-[12.5px] font-[450] text-destructive mb-4">{modalError}</p>}
                                    <div className="flex gap-3">
                                        <Button variant="tonal" className="flex-1 h-11 rounded-[var(--radius-sm)]" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                                        <Button className="flex-1 h-11 rounded-[var(--radius-sm)] bg-destructive hover:bg-destructive/90 text-white"
                                            onClick={handleDeleteStudent} isLoading={isSubmitting}>Remove</Button>
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

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <SessionContent sessionId={id} />;
}
