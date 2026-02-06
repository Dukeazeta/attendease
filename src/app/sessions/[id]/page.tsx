import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import SessionClient from "./SessionClient";

async function endSession(sessionId: string) {
    "use server";

    await prisma.attendanceSession.update({
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

    const session = await prisma.attendanceSession.findUnique({
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
                attendances: session.attendances.map(a => ({
                    id: a.id,
                    matricNumber: a.matricNumber,
                    studentName: a.studentName,
                    signedAt: a.signedAt.toISOString(),
                })),
                course: session.course
            }}
            shareUrl={shareUrl}
            onEndSession={endSession}
        />
    );
}

