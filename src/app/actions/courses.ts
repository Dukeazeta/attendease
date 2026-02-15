"use server";

import { db } from "@/db";
import { courses, attendanceSessions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function listCourses() {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) return [];

    const userCourses = await db.query.courses.findMany({
        where: eq(courses.repId, sessionUser.user.id),
    });

    // Get session counts
    const enriched = await Promise.all(
        userCourses.map(async (c: (typeof userCourses)[number]) => {
            const courseSessions = await db.query.attendanceSessions.findMany({
                where: eq(attendanceSessions.courseId, c.id),
            });
            return {
                ...c,
                sessionCount: courseSessions.length,
            };
        })
    );

    return enriched;
}

export async function createCourse(args: {
    courseCode: string;
    courseTitle: string;
}) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const existing = await db.query.courses.findFirst({
        where: and(
            eq(courses.courseCode, args.courseCode),
            eq(courses.repId, sessionUser.user.id)
        ),
    });

    if (existing) throw new Error("You already have a course with this code");

    const id = nanoid();
    await db.insert(courses).values({
        id,
        courseCode: args.courseCode,
        courseTitle: args.courseTitle,
        repId: sessionUser.user.id,
    });

    revalidatePath("/courses");
    return id;
}

export async function removeCourse(id: string) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const course = await db.query.courses.findFirst({
        where: eq(courses.id, id),
    });

    if (!course || course.repId !== sessionUser.user.id) throw new Error("Unauthorized");

    // Drizzle deletes are handled by CASCADE if configured in schema,
    // but let's be explicit if needed or just trust the DB.
    // Our schema has references(() => ..., { onDelete: "cascade" })
    await db.delete(courses).where(eq(courses.id, id));

    revalidatePath("/courses");
}

export async function getCourse(id: string) {
    return await db.query.courses.findFirst({
        where: eq(courses.id, id),
    });
}
