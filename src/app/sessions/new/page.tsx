import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import NewSessionClient from "./NewSessionClient";

export default async function NewSessionPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const [courses, locations] = await Promise.all([
        db.course.findMany({
            where: { repId: session.user.id },
            orderBy: { courseCode: "asc" },
        }),
        db.location.findMany({
            orderBy: { name: "asc" },
        }),
    ]);

    return <NewSessionClient courses={courses} locations={locations} />;
}
