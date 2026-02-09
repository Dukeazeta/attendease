import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

// Generate short, unique share code
function generateShareCode(): string {
    return nanoid(6).toUpperCase();
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { courseId, locationId, endTime } = body;

        if (!courseId || !locationId || !endTime) {
            return NextResponse.json(
                { error: "Course, location, and end time are required" },
                { status: 400 }
            );
        }

        // Verify the course belongs to this user
        const course = await db.course.findFirst({
            where: { id: courseId, repId: session.user.id },
        });

        if (!course) {
            return NextResponse.json(
                { error: "Course not found or unauthorized" },
                { status: 404 }
            );
        }

        // Create the session
        const attendanceSession = await db.attendanceSession.create({
            data: {
                courseId,
                locationId,
                endTime: new Date(endTime),
                shareCode: generateShareCode(),
                isActive: true,
            },
        });

        return NextResponse.json(attendanceSession, { status: 201 });
    } catch (error) {
        console.error("Error creating session:", error);
        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 500 }
        );
    }
}

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await db.attendanceSession.findMany({
        where: { course: { repId: session.user.id } },
        include: {
            course: true,
            location: true,
            _count: { select: { attendances: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sessions);
}
