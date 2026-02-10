"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Crosshair, Trash2, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function LocationsPage() {
    const locations = useQuery(api.locations.list);
    const createLocation = useMutation(api.locations.create);
    const removeLocation = useMutation(api.locations.remove);

    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        try {
            await createLocation({
                name: formData.get("name") as string,
                building: (formData.get("building") as string) || undefined,
                latitude: parseFloat(formData.get("latitude") as string),
                longitude: parseFloat(formData.get("longitude") as string),
                radiusMeters: parseInt(formData.get("radiusMeters") as string) || 100,
            });
            (e.target as HTMLFormElement).reset();
            setCurrentCoords(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to add location");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: Id<"locations">) => {
        if (!confirm("Delete this location?")) return;
        try {
            await removeLocation({ id });
        } catch (err) {
            alert(err instanceof Error ? err.message : "Failed to delete location");
        }
    };

    if (locations === undefined) {
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
                <div className="max-w-[900px] mx-auto px-6 h-14 flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-[13px] font-[450] group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </Link>
                    <div className="h-5 w-px bg-border" />
                    <h1 className="text-[15px] font-[450] text-foreground">Manage Locations</h1>
                </div>
            </header>

            <main className="max-w-[900px] mx-auto px-6 py-8 space-y-6">
                {/* Add Location Form */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="surface-elevated p-6"
                >
                    <h2 className="text-[14.5px] font-[450] text-foreground mb-5 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        Add New Location
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input name="name" placeholder="Location Name (e.g., LT1, Room 204)" required />
                            <Input name="building" placeholder="Building (optional)" />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                variant="tonal"
                                onClick={getCurrentLocation}
                                disabled={isGettingLocation}
                                className="gap-2"
                            >
                                <Crosshair className="w-4 h-4" />
                                {isGettingLocation ? "Getting Location..." : "Use Current Location"}
                            </Button>
                            {currentCoords && (
                                <span className="text-small text-success flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5" />
                                    {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Input
                                type="number"
                                name="latitude"
                                placeholder="Latitude"
                                step="any"
                                required
                                value={currentCoords?.lat || ""}
                                onChange={(e) => setCurrentCoords((prev) => ({ ...prev!, lat: parseFloat(e.target.value) }))}
                            />
                            <Input
                                type="number"
                                name="longitude"
                                placeholder="Longitude"
                                step="any"
                                required
                                value={currentCoords?.lng || ""}
                                onChange={(e) => setCurrentCoords((prev) => ({ ...prev!, lng: parseFloat(e.target.value) }))}
                            />
                            <Input
                                type="number"
                                name="radiusMeters"
                                placeholder="Radius (meters)"
                                defaultValue={100}
                                min={10}
                                max={500}
                            />
                        </div>

                        <Button type="submit" isLoading={isSubmitting}>
                            Add Location
                        </Button>
                    </form>
                </motion.div>

                {/* Locations List */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="surface-elevated overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-border flex items-center gap-3">
                        <MapPin className="w-[18px] h-[18px] text-muted-foreground" />
                        <h2 className="text-[15px] font-[450] text-foreground">Saved Locations</h2>
                        <span className="ml-auto text-small text-muted-foreground">{locations.length} total</span>
                    </div>
                    {locations.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-surface-container flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-caption text-muted-foreground">No locations saved yet. Add your class venues above!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {locations.map((location) => (
                                <div key={location._id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container/50 transition-colors">
                                    <div>
                                        <h3 className="text-[14.5px] font-[450] text-foreground">{location.name}</h3>
                                        <p className="text-small text-muted-foreground mt-0.5">
                                            {location.building && `${location.building} · `}
                                            {location.radiusMeters}m radius
                                        </p>
                                        <p className="text-[11px] font-mono text-muted-foreground/60 mt-1">
                                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(location._id)}
                                        className="p-2.5 rounded-full hover:bg-destructive/8 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
