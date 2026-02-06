import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NewSessionClient from "./NewSessionClient";

export default async function NewSessionPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const [courses, locations] = await Promise.all([
        prisma.course.findMany({
            where: { repId: session.user.id },
            orderBy: { courseCode: "asc" },
        }),
        prisma.location.findMany({
            orderBy: { name: "asc" },
        }),
    ]);

    return <NewSessionClient courses={courses} locations={locations} />;
}
