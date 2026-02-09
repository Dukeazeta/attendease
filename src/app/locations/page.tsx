import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import LocationsClient from "./LocationsClient";

export default async function LocationsPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const locations = await db.location.findMany({
        orderBy: { createdAt: "desc" },
    });

    return <LocationsClient locations={locations} />;
}
