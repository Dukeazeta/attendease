"use server";

import { db } from "@/db";
import { attendanceSessions, courses, locations, attendances, users } from "@/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

// Generate a random 6-character share code
function generateShareCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function listSessions() {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) return [];

    const userCourses = await db.query.courses.findMany({
        where: eq(courses.repId, sessionUser.user.id),
    });

    if (userCourses.length === 0) return [];

    const courseIds = userCourses.map((c: any) => c.id);
    const sessions = await db.query.attendanceSessions.findMany({
        where: inArray(attendanceSessions.courseId, courseIds),
        with: {
            course: true,
            location: true,
        },
        orderBy: [desc(attendanceSessions.startTime)],
    });

    // Manually count attendances for each session
    const enriched = await Promise.all(
        sessions.map(async (s: any) => {
            const records = await db.query.attendances.findMany({
                where: eq(attendances.sessionId, s.id),
            });
            return {
                ...s,
                attendanceCount: records.length,
            };
        })
    );

    return enriched;
}

export async function getSession(id: string) {
    const session = await db.query.attendanceSessions.findFirst({
        where: eq(attendanceSessions.id, id),
        with: {
            course: true,
            location: true,
            attendances: true,
        },
    });

    if (!session) return null;

    return {
        ...session,
        attendances: session.attendances
            .map((a: any) => ({ ...a, signedAt: a.signedAt.getTime() }))
            .sort((a: any, b: any) => a.studentName.localeCompare(b.studentName)),
    };
}

export async function getSessionByShareCode(shareCode: string) {
    const session = await db.query.attendanceSessions.findFirst({
        where: eq(attendanceSessions.shareCode, shareCode.toUpperCase()),
        with: {
            course: true,
            location: true,
        },
    });

    if (!session) return null;

    return {
        id: session.id,
        isActive: session.isActive,
        endTime: session.endTime,
        course: session.course,
        location: session.location,
    };
}

export async function createSession(args: {
    courseId: string;
    locationId: string;
    durationMinutes: number;
}) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, args.courseId),
    });
    if (!course || course.repId !== sessionUser.user.id) throw new Error("Course not found or unauthorized");

    let shareCode = generateShareCode();
    let existing = await db.query.attendanceSessions.findFirst({
        where: eq(attendanceSessions.shareCode, shareCode),
    });

    while (existing) {
        shareCode = generateShareCode();
        existing = await db.query.attendanceSessions.findFirst({
            where: eq(attendanceSessions.shareCode, shareCode),
        });
    }

    const now = new Date();
    const endTime = new Date(now.getTime() + args.durationMinutes * 60 * 1000);

    const id = nanoid();
    await db.insert(attendanceSessions).values({
        id,
        courseId: args.courseId,
        locationId: args.locationId,
        shareCode,
        startTime: now,
        endTime,
        isActive: true,
    });

    revalidatePath("/dashboard");
    revalidatePath("/sessions");
    return id;
}

export async function endSession(id: string) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const session = await db.query.attendanceSessions.findFirst({
        where: eq(attendanceSessions.id, id),
    });
    if (!session) throw new Error("Session not found");

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, session.courseId),
    });
    if (!course || course.repId !== sessionUser.user.id) throw new Error("Unauthorized");

    await db.update(attendanceSessions)
        .set({ isActive: false })
        .where(eq(attendanceSessions.id, id));

    revalidatePath(`/sessions/${id}`);
    revalidatePath("/dashboard");
}
