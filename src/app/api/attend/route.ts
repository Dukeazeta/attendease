import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, matricNumber, studentName, latitude, longitude, deviceFingerprint } = body;

        if (!sessionId || !matricNumber || !studentName) {
            return NextResponse.json(
                { error: "Session ID, matric number, and name are required" },
                { status: 400 }
            );
        }

        // Require device fingerprint
        if (!deviceFingerprint) {
            return NextResponse.json(
                { error: "Device verification failed. Please refresh the page and try again." },
                { status: 400 }
            );
        }

        // Get the session with location
        const session = await db.attendanceSession.findUnique({
            where: { id: sessionId },
            include: { location: true },
        });

        if (!session) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        // Check if session is active
        if (!session.isActive) {
            return NextResponse.json(
                { error: "This session has ended" },
                { status: 400 }
            );
        }

        // Check if session has expired
        if (new Date(session.endTime) < new Date()) {
            return NextResponse.json(
                { error: "This session has expired" },
                { status: 400 }
            );
        }

        // Check if student has already signed
        const existingAttendance = await db.attendance.findUnique({
            where: {
                sessionId_matricNumber: {
                    sessionId,
                    matricNumber: matricNumber.toUpperCase(),
                },
            },
        });

        if (existingAttendance) {
            return NextResponse.json(
                { error: "You have already signed attendance for this session" },
                { status: 400 }
            );
        }

        // Verify location (if coordinates provided)
        if (latitude !== undefined && longitude !== undefined) {
            const distance = calculateDistance(
                latitude,
                longitude,
                session.location.latitude,
                session.location.longitude
            );

            if (distance > session.location.radiusMeters) {
                return NextResponse.json(
                    { error: `You are ${Math.round(distance)}m away. Must be within ${session.location.radiusMeters}m.` },
                    { status: 400 }
                );
            }
        }

        // Check if this device has already signed for this session
        const existingDeviceAttendance = await db.attendance.findFirst({
            where: {
                sessionId,
                deviceFingerprint,
            },
        });

        if (existingDeviceAttendance) {
            return NextResponse.json(
                { error: "This device has already been used to sign attendance for this session. Each student must sign from their own device." },
                { status: 403 }
            );
        }

        // Create attendance record
        const attendance = await db.attendance.create({
            data: {
                sessionId,
                matricNumber: matricNumber.toUpperCase(),
                studentName,
                signedLatitude: latitude || 0,
                signedLongitude: longitude || 0,
                deviceFingerprint,
            },
        });

        return NextResponse.json(
            { message: "Attendance signed successfully", id: attendance.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error signing attendance:", error);
        return NextResponse.json(
            { error: "Failed to sign attendance" },
            { status: 500 }
        );
    }
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
