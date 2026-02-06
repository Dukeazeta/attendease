import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AttendClient from "./AttendClient";

export default async function AttendPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;

    const session = await prisma.attendanceSession.findUnique({
        where: { shareCode: code },
        include: {
            course: true,
            location: true,
        },
    });

    if (!session) {
        notFound();
    }

    return (
        <AttendClient
            session={{
                id: session.id,
                isActive: session.isActive,
                endTime: session.endTime.toISOString(),
                course: {
                    courseCode: session.course.courseCode,
                    courseTitle: session.course.courseTitle,
                },
                location: {
                    name: session.location.name,
                    latitude: session.location.latitude,
                    longitude: session.location.longitude,
                    radiusMeters: session.location.radiusMeters,
                },
            }}
        />
    );
}
