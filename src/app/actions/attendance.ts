"use server";

import { db } from "@/db";
import { attendances, attendanceSessions, locations, courses } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

// Haversine formula to calculate distance between two points in meters
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// List attendances for a session
export async function listAttendancesBySession(sessionId: string) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) return [];

    const session = await db.query.attendanceSessions.findFirst({
        where: eq(attendanceSessions.id, sessionId),
    });
    if (!session) return [];

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, session.courseId),
    });
    if (!course || course.repId !== sessionUser.user.id) return [];

    const records = await db.query.attendances.findMany({
        where: eq(attendances.sessionId, sessionId),
        orderBy: [desc(attendances.signedAt)],
    });

    const normalizedRecords = records
        .map((a: (typeof records)[number]) => ({ ...a, signedAt: a.signedAt.getTime() }));

    return normalizedRecords.sort((a: (typeof normalizedRecords)[number], b: (typeof normalizedRecords)[number]) =>
        a.studentName.localeCompare(b.studentName)
    );
}

// Submit attendance (students)
export async function submitAttendance(args: {
    sessionId: string;
    matricNumber: string;
    studentName: string;
    latitude: number;
    longitude: number;
    deviceFingerprint: string;
}) {
    try {
        // Get the session
        const session = await db.query.attendanceSessions.findFirst({
            where: eq(attendanceSessions.id, args.sessionId),
        });

        if (!session) return { error: "Session not found" };
        if (!session.isActive) return { error: "This session has ended" };
        if (session.endTime.getTime() < Date.now()) return { error: "This session has expired" };

        // Get location
        const location = await db.query.locations.findFirst({
            where: eq(locations.id, session.locationId),
        });

        if (!location) return { error: "Session location not found" };
        if (!args.deviceFingerprint) return { error: "Device verification failed." };

        const matricUpper = args.matricNumber.toUpperCase();

        // Check existing
        const existingByMatric = await db.query.attendances.findFirst({
            where: and(
                eq(attendances.sessionId, args.sessionId),
                eq(attendances.matricNumber, matricUpper)
            ),
        });
        if (existingByMatric) return { error: "You have already signed attendance" };

        const existingByDevice = await db.query.attendances.findFirst({
            where: and(
                eq(attendances.sessionId, args.sessionId),
                eq(attendances.deviceFingerprint, args.deviceFingerprint)
            ),
        });
        if (existingByDevice) return { error: "This device has already been used for this session." };

        // Geo validation
        const distance = calculateDistance(
            args.latitude,
            args.longitude,
            location.latitude,
            location.longitude
        );

        if (distance > location.radiusMeters) {
            return { error: `Too far away (${Math.round(distance)}m). You must be within the class premises.` };
        }

        const id = nanoid();
        await db.insert(attendances).values({
            id,
            sessionId: args.sessionId,
            matricNumber: matricUpper,
            studentName: args.studentName,
            signedLatitude: args.latitude,
            signedLongitude: args.longitude,
            deviceFingerprint: args.deviceFingerprint,
            isManualEntry: false,
            signedAt: new Date(),
        });

        revalidatePath(`/sessions/${args.sessionId}`);
        return { success: true, id };
    } catch (err) {
        console.error("Attendance submission error:", err);
        return { error: "An unexpected error occurred. Please try again." };
    }
}

// Add manual attendance (Course Rep)
export async function addManualAttendance(args: {
    sessionId: string;
    matricNumber: string;
    studentName: string;
}) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const session = await db.query.attendanceSessions.findFirst({
        where: eq(attendanceSessions.id, args.sessionId),
    });
    if (!session) throw new Error("Session not found");

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, session.courseId),
    });
    if (!course || course.repId !== sessionUser.user.id) throw new Error("Unauthorized");

    const matricUpper = args.matricNumber.toUpperCase();
    const existing = await db.query.attendances.findFirst({
        where: and(
            eq(attendances.sessionId, args.sessionId),
            eq(attendances.matricNumber, matricUpper)
        ),
    });
    if (existing) throw new Error("This student has already signed");

    const id = nanoid();
    await db.insert(attendances).values({
        id,
        sessionId: args.sessionId,
        matricNumber: matricUpper,
        studentName: args.studentName,
        signedLatitude: 0,
        signedLongitude: 0,
        deviceFingerprint: `manual_${Date.now()}_${nanoid()}`,
        isManualEntry: true,
        signedAt: new Date(),
    });

    revalidatePath(`/sessions/${args.sessionId}`);
    return id;
}

export async function updateAttendance(args: {
    id: string;
    matricNumber: string;
    studentName: string;
}) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const record = await db.query.attendances.findFirst({
        where: eq(attendances.id, args.id),
    });
    if (!record) throw new Error("Record not found");

    const session = await db.query.attendanceSessions.findFirst({
        where: eq(attendanceSessions.id, record.sessionId),
    });
    if (!session) throw new Error("Session not found");

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, session.courseId),
    });
    if (!course || course.repId !== sessionUser.user.id) throw new Error("Unauthorized");

    await db.update(attendances)
        .set({
            matricNumber: args.matricNumber.toUpperCase(),
            studentName: args.studentName,
        })
        .where(eq(attendances.id, args.id));

    revalidatePath(`/sessions/${record.sessionId}`);
}

export async function removeAttendance(id: string) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const record = await db.query.attendances.findFirst({
        where: eq(attendances.id, id),
    });
    if (!record) throw new Error("Record not found");

    const session = await db.query.attendanceSessions.findFirst({
        where: eq(attendanceSessions.id, record.sessionId),
    });
    if (!session) throw new Error("Session not found");

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, session.courseId),
    });
    if (!course || course.repId !== sessionUser.user.id) throw new Error("Unauthorized");

    await db.delete(attendances).where(eq(attendances.id, id));
    revalidatePath(`/sessions/${record.sessionId}`);
}
