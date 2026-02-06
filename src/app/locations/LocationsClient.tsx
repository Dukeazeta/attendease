"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Location {
    id: string;
    name: string;
    building: string | null;
    latitude: number;
    longitude: number;
    radiusMeters: number;
}

export default function LocationsClient({ locations }: { locations: Location[] }) {
    const router = useRouter();
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);

    const getCurrentLocation = () => {
        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setIsGettingLocation(false);
            },
            (error) => {
                alert("Failed to get location: " + error.message);
                setIsGettingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const response = await fetch("/api/locations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formData.get("name"),
                building: formData.get("building") || null,
                latitude: parseFloat(formData.get("latitude") as string),
                longitude: parseFloat(formData.get("longitude") as string),
                radiusMeters: parseInt(formData.get("radiusMeters") as string) || 100,
            }),
        });

        if (response.ok) {
            router.refresh();
            (e.target as HTMLFormElement).reset();
            setCurrentCoords(null);
        } else {
            const data = await response.json();
            alert(data.error || "Failed to add location");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this location?")) return;

        const response = await fetch(`/api/locations/${id}`, { method: "DELETE" });
        if (response.ok) {
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </Link>
                    <div className="h-5 w-px bg-[var(--border-default)]" />
                    <h1 className="text-lg font-bold text-[var(--text-primary)]">Manage Locations</h1>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Location Form */}
                <div className="card-industrial p-6 mb-8 animate-fade-in opacity-0">
                    <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">Add New Location</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Location Name (e.g., LT1, Room 204)"
                                required
                                className="px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                            />
                            <input
                                type="text"
                                name="building"
                                placeholder="Building (optional)"
                                className="px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={isGettingLocation}
                                className="px-4 py-3 bg-[var(--success)]/10 hover:bg-[var(--success)]/20 text-[var(--success)] font-medium rounded-[var(--radius-md)] transition disabled:opacity-50 border border-[var(--success)]/20"
                            >
                                {isGettingLocation ? "Getting Location..." : "📍 Use Current Location"}
                            </button>
                            {currentCoords && (
                                <span className="text-[var(--success)] text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Location captured: {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="number"
                                name="latitude"
                                placeholder="Latitude"
                                step="any"
                                required
                                value={currentCoords?.lat || ""}
                                onChange={(e) => setCurrentCoords((prev) => ({ ...prev!, lat: parseFloat(e.target.value) }))}
                                className="px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                            />
                            <input
                                type="number"
                                name="longitude"
                                placeholder="Longitude"
                                step="any"
                                required
                                value={currentCoords?.lng || ""}
                                onChange={(e) => setCurrentCoords((prev) => ({ ...prev!, lng: parseFloat(e.target.value) }))}
                                className="px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                            />
                            <input
                                type="number"
                                name="radiusMeters"
                                placeholder="Radius (meters)"
                                defaultValue={100}
                                min={10}
                                max={500}
                                className="px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-medium rounded-[var(--radius-md)] transition shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                        >
                            Add Location
                        </button>
                    </form>
                </div>

                {/* Locations List */}
                <div className="card-industrial overflow-hidden animate-fade-in-up opacity-0 delay-100">
                    <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
                        <h2 className="text-base font-semibold text-[var(--text-primary)]">Saved Locations</h2>
                    </div>
                    {locations.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center">
                                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-[var(--text-secondary)]">No locations saved yet. Add your class venues above!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--border-subtle)]">
                            {locations.map((location) => (
                                <div key={location.id} className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors">
                                    <div>
                                        <h3 className="text-[var(--text-primary)] font-medium">{location.name}</h3>
                                        <p className="text-[var(--text-secondary)] text-sm">
                                            {location.building && `${location.building} • `}
                                            {location.radiusMeters}m radius
                                        </p>
                                        <p className="text-[var(--text-muted)] text-xs mt-1 font-mono">
                                            📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(location.id)}
                                        className="px-4 py-2 bg-[var(--error)]/10 hover:bg-[var(--error)]/20 text-[var(--error)] text-sm rounded-[var(--radius-md)] transition font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

