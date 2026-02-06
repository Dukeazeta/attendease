"use client";

import { useState, useEffect } from "react";

interface SessionData {
    id: string;
    isActive: boolean;
    endTime: string;
    course: {
        courseCode: string;
        courseTitle: string;
    };
    location: {
        name: string;
        latitude: number;
        longitude: number;
        radiusMeters: number;
    };
}

// Haversine formula to calculate distance between two points
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

export default function AttendClient({ session }: { session: SessionData }) {
    const [step, setStep] = useState<"checking" | "location" | "form" | "success" | "error">("checking");
    const [error, setError] = useState<string | null>(null);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Check if session is still active
        if (!session.isActive) {
            setError("This session has ended.");
            setStep("error");
            return;
        }

        // Check if session has expired
        if (new Date(session.endTime) < new Date()) {
            setError("This session has expired.");
            setStep("error");
            return;
        }

        // Request location
        setStep("location");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });

                // Calculate distance from class location
                const dist = calculateDistance(
                    latitude,
                    longitude,
                    session.location.latitude,
                    session.location.longitude
                );
                setDistance(dist);

                // Check if within radius
                if (dist <= session.location.radiusMeters) {
                    setStep("form");
                } else {
                    setError(
                        `You are ${Math.round(dist)}m away from the class. You must be within ${session.location.radiusMeters}m to sign attendance.`
                    );
                    setStep("error");
                }
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    setError("Location permission denied. Please enable location access to sign attendance.");
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    setError("Location unavailable. Please try again.");
                } else {
                    setError("Could not get your location. Please enable GPS and try again.");
                }
                setStep("error");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [session]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const matricNumber = formData.get("matricNumber") as string;
        const studentName = formData.get("studentName") as string;

        try {
            const response = await fetch("/api/attend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: session.id,
                    matricNumber,
                    studentName,
                    latitude: coords?.lat,
                    longitude: coords?.lng,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to sign attendance");
                setStep("error");
            } else {
                setStep("success");
            }
        } catch {
            setError("An error occurred. Please try again.");
            setStep("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Course Info */}
                <div className="text-center mb-8 animate-fade-in opacity-0">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-full mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        AttendEase
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                        {session.course.courseCode}
                    </h1>
                    <p className="text-[var(--text-secondary)]">{session.course.courseTitle}</p>
                    <p className="text-[var(--text-muted)] text-sm mt-2 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {session.location.name}
                    </p>
                </div>

                {/* Checking State */}
                {step === "checking" && (
                    <div className="card-industrial p-8 text-center animate-fade-in-up opacity-0">
                        <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                        <p className="text-[var(--text-primary)]">Checking session...</p>
                    </div>
                )}

                {/* Getting Location */}
                {step === "location" && (
                    <div className="card-industrial p-8 text-center animate-fade-in-up opacity-0">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center animate-pulse">
                            <svg className="w-8 h-8 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <p className="text-[var(--text-primary)] text-lg font-medium mb-2">Getting your location...</p>
                        <p className="text-[var(--text-secondary)] text-sm">
                            Please allow location access when prompted
                        </p>
                    </div>
                )}

                {/* Sign In Form */}
                {step === "form" && (
                    <div className="card-industrial p-8 animate-fade-in-up opacity-0">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
                                <svg className="w-7 h-7 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-[var(--success)] font-medium">Location verified!</p>
                            <p className="text-[var(--text-muted)] text-sm">
                                You are {Math.round(distance!)}m from the class location
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="matricNumber" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Matric Number <span className="text-[var(--error)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="matricNumber"
                                    name="matricNumber"
                                    required
                                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] uppercase font-mono"
                                    placeholder="CSC/2020/001"
                                />
                            </div>

                            <div>
                                <label htmlFor="studentName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                    Full Name <span className="text-[var(--error)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="studentName"
                                    name="studentName"
                                    required
                                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                                    placeholder="John Doe"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 px-4 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                            >
                                {isSubmitting ? "Signing..." : "✍️ Sign Attendance"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Success State */}
                {step === "success" && (
                    <div className="card-industrial p-8 border-[var(--success)]/30 text-center animate-fade-in-up opacity-0">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
                            <svg className="w-10 h-10 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            Attendance Signed!
                        </h2>
                        <p className="text-[var(--text-secondary)]">
                            Your attendance has been recorded successfully.
                        </p>
                    </div>
                )}

                {/* Error State */}
                {step === "error" && (
                    <div className="card-industrial p-8 border-[var(--error)]/30 text-center animate-fade-in-up opacity-0">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--error)]/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                            Cannot Sign Attendance
                        </h2>
                        <p className="text-[var(--error)]">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] rounded-[var(--radius-md)] transition border border-[var(--border-default)]"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
