"use client";

import { useState, useEffect, use } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, CheckCircle2, XCircle, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { getSessionByShareCode } from "@/app/actions/sessions";
import { submitAttendance } from "@/app/actions/attendance";

type ShareSession = Awaited<ReturnType<typeof getSessionByShareCode>>;

function getFingerprintComponentValue(components: unknown, key: string): unknown {
    if (!components || typeof components !== "object") {
        return undefined;
    }

    const component = (components as Record<string, { value?: unknown }>)[key];
    return component?.value;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const ph1 = (lat1 * Math.PI) / 180;
    const ph2 = (lat2 * Math.PI) / 180;
    const dph = ((lat2 - lat1) * Math.PI) / 180;
    const dla = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dph / 2) * Math.sin(dph / 2) + Math.cos(ph1) * Math.cos(ph2) * Math.sin(dla / 2) * Math.sin(dla / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function AttendContent({ shareCode }: { shareCode: string }) {
    const [step, setStep] = useState<"checking" | "location" | "form" | "success" | "error">("checking");
    const [error, setError] = useState<string | null>(null);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deviceFingerprint, setDeviceFingerprint] = useState<string | null>(null);
    const [session, setSession] = useState<ShareSession>(null);
    const [isLoadingSession, setIsLoadingSession] = useState(true);

    async function generateHardwareFingerprint(): Promise<string> {
        try {
            const fp = await FingerprintJS.load();
            const result = await fp.get();

            // visitorId is the standard unique identifier provided by FingerprintJS
            // It's already a hash of multiple browser/hardware signals
            const visitorId = result.visitorId;

            // To make it even more unique to AttendEase and slightly harder to spoof
            // we can combine it with a few high-entropy but stable signals
            const components = result.components;
            const extraSignals = {
                vendor: getFingerprintComponentValue(components, "vendor") ?? "",
                renderer: getFingerprintComponentValue(components, "webGlRenderer") ?? "",
                languages: getFingerprintComponentValue(components, "languages") ?? [],
            };

            const salt = "attendease_v2_stable";
            const combinedString = `${visitorId}:${JSON.stringify(extraSignals)}:${salt}`;

            // Hash the combined string for a clean fingerprint
            const encoder = new TextEncoder();
            const data = encoder.encode(combinedString);
            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

            return hashHex.slice(0, 48);
        } catch (err) {
            console.error("Fingerprint generation failed:", err);
            throw new Error("Could not verify device security. Please use a standard browser.");
        }
    }

    useEffect(() => {
        async function fetchSession() {
            try {
                const s = await getSessionByShareCode(shareCode);
                setSession(s);
            } catch (err) {
                console.error("Failed to fetch session:", err);
                setError("Failed to load session.");
                setStep("error");
            } finally {
                setIsLoadingSession(false);
            }
        }
        fetchSession();
    }, [shareCode]);

    useEffect(() => {
        if (!session) return;
        if (!session.isActive) { setError("This session has ended."); setStep("error"); return; }
        if (new Date(session.endTime).getTime() < Date.now()) { setError("This session has expired."); setStep("error"); return; }

        generateHardwareFingerprint()
            .then(fp => setDeviceFingerprint(fp))
            .catch(err => { setError(err.message || "Could not verify device."); setStep("error"); });

        setStep("location");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });
                if (!session.location) { setError("Session location data is missing."); setStep("error"); return; }
                const dist = calculateDistance(latitude, longitude, session.location.latitude, session.location.longitude);
                setDistance(dist);
                if (dist <= session.location.radiusMeters) { setStep("form"); }
                else { setError(`You are ${Math.round(dist)}m away from the class. You must be within ${session.location.radiusMeters}m to sign attendance.`); setStep("error"); }
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) setError("Location permission denied. Please enable location access.");
                else if (err.code === err.POSITION_UNAVAILABLE) setError("Location unavailable. Please try again.");
                else setError("Could not get your location. Please enable GPS and try again.");
                setStep("error");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [session]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!deviceFingerprint) { setError("Device verification failed. Please refresh."); setStep("error"); setIsSubmitting(false); return; }
        if (!session) { setError("Session not found."); setStep("error"); setIsSubmitting(false); return; }

        const formData = new FormData(e.currentTarget);
        try {
            const result = await submitAttendance({
                sessionId: session.id,
                matricNumber: formData.get("matricNumber") as string,
                studentName: formData.get("studentName") as string,
                latitude: coords?.lat ?? 0,
                longitude: coords?.lng ?? 0,
                deviceFingerprint,
            });

            if (result.error) {
                setError(result.error);
                setStep("error");
            } else {
                setStep("success");
            }
        } catch (err) {
            setError("A connection error occurred. Please try again.");
            setStep("error");
        } finally { setIsSubmitting(false); }
    };

    // Loading
    if (isLoadingSession) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-10 text-center max-w-sm w-full">
                    <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                    <p className="text-caption text-muted-foreground">Loading session...</p>
                </motion.div>
            </div>
        );
    }

    // Not found
    if (session === null) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-10 text-center max-w-sm w-full">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-[var(--radius-lg)] bg-destructive/8 flex items-center justify-center">
                        <XCircle className="w-8 h-8 text-destructive/60" />
                    </div>
                    <h2 className="text-headline-3 text-foreground mb-2">Session Not Found</h2>
                    <p className="text-caption text-muted-foreground">This attendance session does not exist or has been removed.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Course Info Header */}
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-full)] bg-surface-container text-small text-muted-foreground mb-5">
                        <Shield className="w-3.5 h-3.5 text-accent" />
                        AttendEase
                    </div>
                    <h1 className="text-headline-1 text-foreground mb-1">{session.course?.courseCode}</h1>
                    <p className="text-body text-muted-foreground">{session.course?.courseTitle}</p>
                    <p className="text-small text-muted-foreground/60 mt-2 flex items-center justify-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {session.location?.name}
                    </p>
                </motion.div>

                {/* Checking */}
                {step === "checking" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-10 text-center">
                        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                        <p className="text-caption text-muted-foreground">Checking session...</p>
                    </motion.div>
                )}

                {/* Location */}
                {step === "location" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-5 rounded-[var(--radius-lg)] bg-accent/8 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-accent/60 animate-pulse" />
                        </div>
                        <p className="text-[16px] font-[450] text-foreground mb-2">Getting your location...</p>
                        <p className="text-small text-muted-foreground">Please allow location access when prompted</p>
                    </motion.div>
                )}

                {/* Form */}
                {step === "form" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-8">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-[var(--radius-lg)] bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                            </div>
                            <p className="text-[14.5px] font-[450] text-emerald-700">Location verified!</p>
                            <p className="text-small text-muted-foreground mt-0.5">
                                You are {Math.round(distance!)}m from the class location
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                name="matricNumber"
                                label="Matric Number"
                                placeholder="CSC/2020/001"
                                required
                                className="uppercase font-mono"
                            />
                            <Input
                                name="studentName"
                                label="Full Name"
                                placeholder="John Doe"
                                required
                            />
                            <Button type="submit" className="w-full h-12 mt-2" isLoading={isSubmitting}>
                                Sign Attendance
                            </Button>
                        </form>
                    </motion.div>
                )}

                {/* Success */}
                {step === "success" && (
                    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="surface-card p-10 text-center">
                        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-headline-2 text-foreground mb-2">Attendance Signed!</h2>
                        <p className="text-caption text-muted-foreground">Your attendance has been recorded successfully.</p>
                    </motion.div>
                )}

                {/* Error */}
                {step === "error" && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="surface-card p-10 text-center">
                        <div className="w-16 h-16 mx-auto mb-5 rounded-[var(--radius-lg)] bg-destructive/8 flex items-center justify-center">
                            <XCircle className="w-8 h-8 text-destructive/60" />
                        </div>
                        <h2 className="text-headline-3 text-foreground mb-2">Cannot Sign Attendance</h2>
                        <p className="text-[13px] text-destructive leading-relaxed mb-6">{error}</p>
                        <Button variant="tonal" onClick={() => window.location.reload()} className="rounded-full">
                            Try Again
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function AttendPage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params);
    return <AttendContent shareCode={code} />;
}
