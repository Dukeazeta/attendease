import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// POST /api/sessions/[id]/attendance - Manual add attendance (course rep only)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: sessionId } = await params;
        const body = await request.json();
        const { matricNumber, studentName } = body;

        if (!matricNumber || !studentName) {
            return NextResponse.json(
                { error: "Matric number and student name are required" },
                { status: 400 }
            );
        }

        // Get the attendance session and verify ownership
        const attendanceSession = await db.attendanceSession.findUnique({
            where: { id: sessionId },
            include: {
                course: {
                    select: { repId: true }
                }
            }
        });

        if (!attendanceSession) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        // Verify the user owns this course
        if (attendanceSession.course.repId !== session.user.id) {
            return NextResponse.json(
                { error: "You don't have permission to modify this session" },
                { status: 403 }
            );
        }

        // Check if matric number already exists in this session
        const existingAttendance = await db.attendance.findUnique({
            where: {
                sessionId_matricNumber: {
                    sessionId,
                    matricNumber: matricNumber.toUpperCase(),
                }
            }
        });

        if (existingAttendance) {
            return NextResponse.json(
                { error: "This matric number has already signed attendance for this session" },
                { status: 400 }
            );
        }

        // Create manual attendance entry with unique fingerprint
        const manualFingerprint = `MANUAL_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        
        const attendance = await db.attendance.create({
            data: {
                sessionId,
                matricNumber: matricNumber.toUpperCase(),
                studentName,
                signedLatitude: 0,
                signedLongitude: 0,
                deviceFingerprint: manualFingerprint,
                isManualEntry: true,
            }
        });

        return NextResponse.json(
            { message: "Attendance added successfully", attendance },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding manual attendance:", error);
        return NextResponse.json(
            { error: "Failed to add attendance" },
            { status: 500 }
        );
    }
}
