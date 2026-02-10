"use server";

import { db } from "@/db";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function listLocations() {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) return [];

    return await db.query.locations.findMany({
        where: eq(locations.createdBy, sessionUser.user.id),
    });
}

export async function createLocation(args: {
    name: string;
    building?: string;
    latitude: number;
    longitude: number;
    radiusMeters: number;
}) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const id = nanoid();
    await db.insert(locations).values({
        id,
        name: args.name,
        building: args.building,
        latitude: args.latitude,
        longitude: args.longitude,
        radiusMeters: args.radiusMeters,
        createdBy: sessionUser.user.id,
    });

    revalidatePath("/locations");
    return id;
}

export async function removeLocation(id: string) {
    const sessionUser = await auth();
    if (!sessionUser?.user?.id) throw new Error("Unauthorized");

    const location = await db.query.locations.findFirst({
        where: eq(locations.id, id),
    });

    if (!location || location.createdBy !== sessionUser.user.id) throw new Error("Unauthorized");

    await db.delete(locations).where(eq(locations.id, id));

    revalidatePath("/locations");
}

export async function getLocation(id: string) {
    return await db.query.locations.findFirst({
        where: eq(locations.id, id),
    });
}
