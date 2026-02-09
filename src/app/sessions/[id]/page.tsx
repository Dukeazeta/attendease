import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import SessionClient from "./SessionClient";

async function endSession(sessionId: string) {
    "use server";

    await db.attendanceSession.update({
        where: { id: sessionId },
        data: { isActive: false },
    });

    revalidatePath(`/sessions/${sessionId}`);
}

export default async function SessionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const authSession = await auth();

    if (!authSession?.user) {
        redirect("/login");
    }

    const { id } = await params;

    const session = await db.attendanceSession.findUnique({
        where: { id },
        include: {
            course: true,
            location: true,
            attendances: {
                orderBy: { signedAt: "desc" },
            },
        },
    });

    if (!session) {
        notFound();
    }

    // Check if this session belongs to the current user
    if (session.course.repId !== authSession.user.id) {
        redirect("/dashboard");
    }

    const shareUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/attend/${session.shareCode}`;

    return (
        <SessionClient
            session={{
                id: session.id,
                shareCode: session.shareCode,
                isActive: session.isActive,
                startTime: session.startTime.toISOString(),
                endTime: session.endTime.toISOString(),
                location: session.location,
            attendances: session.attendances.map((a: any) => ({
                    id: a.id,
                    matricNumber: a.matricNumber,
                    studentName: a.studentName,
                    signedAt: a.signedAt.toISOString(),
                    isManualEntry: a.isManualEntry,
                })),
                course: session.course
            }}
            shareUrl={shareUrl}
            onEndSession={endSession}
        />
    );
}

