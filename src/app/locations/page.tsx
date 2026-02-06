import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LocationsClient from "./LocationsClient";

export default async function LocationsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const locations = await prisma.location.findMany({
        orderBy: { createdAt: "desc" },
    });

    return <LocationsClient locations={locations} />;
}
