import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/sessions/[id]/attendance/[attendanceId] - Edit attendance record
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; attendanceId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: sessionId, attendanceId } = await params;
        const body = await request.json();
        const { matricNumber, studentName } = body;

        if (!matricNumber && !studentName) {
            return NextResponse.json(
                { error: "At least one field (matricNumber or studentName) is required" },
                { status: 400 }
            );
        }

        // Get the attendance record with session and course info
        const attendance = await db.attendance.findUnique({
            where: { id: attendanceId },
            include: {
                session: {
                    include: {
                        course: {
                            select: { repId: true }
                        }
                    }
                }
            }
        });

        if (!attendance) {
            return NextResponse.json(
                { error: "Attendance record not found" },
                { status: 404 }
            );
        }

        // Verify session matches
        if (attendance.sessionId !== sessionId) {
            return NextResponse.json(
                { error: "Attendance record does not belong to this session" },
                { status: 400 }
            );
        }

        // Verify the user owns this course
        if (attendance.session.course.repId !== session.user.id) {
            return NextResponse.json(
                { error: "You don't have permission to modify this attendance" },
                { status: 403 }
            );
        }

        // If updating matric number, check for duplicates
        if (matricNumber && matricNumber.toUpperCase() !== attendance.matricNumber) {
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
                    { error: "This matric number already exists in this session" },
                    { status: 400 }
                );
            }
        }

        // Update the attendance record
        const updatedAttendance = await db.attendance.update({
            where: { id: attendanceId },
            data: {
                ...(matricNumber && { matricNumber: matricNumber.toUpperCase() }),
                ...(studentName && { studentName }),
            }
        });

        return NextResponse.json(
            { message: "Attendance updated successfully", attendance: updatedAttendance },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating attendance:", error);
        return NextResponse.json(
            { error: "Failed to update attendance" },
            { status: 500 }
        );
    }
}

// DELETE /api/sessions/[id]/attendance/[attendanceId] - Delete attendance record
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; attendanceId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: sessionId, attendanceId } = await params;

        // Get the attendance record with session and course info
        const attendance = await db.attendance.findUnique({
            where: { id: attendanceId },
            include: {
                session: {
                    include: {
                        course: {
                            select: { repId: true }
                        }
                    }
                }
            }
        });

        if (!attendance) {
            return NextResponse.json(
                { error: "Attendance record not found" },
                { status: 404 }
            );
        }

        // Verify session matches
        if (attendance.sessionId !== sessionId) {
            return NextResponse.json(
                { error: "Attendance record does not belong to this session" },
                { status: 400 }
            );
        }

        // Verify the user owns this course
        if (attendance.session.course.repId !== session.user.id) {
            return NextResponse.json(
                { error: "You don't have permission to delete this attendance" },
                { status: 403 }
            );
        }

        // Delete the attendance record
        await db.attendance.delete({
            where: { id: attendanceId }
        });

        return NextResponse.json(
            { message: "Attendance deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting attendance:", error);
        return NextResponse.json(
            { error: "Failed to delete attendance" },
            { status: 500 }
        );
    }
}
