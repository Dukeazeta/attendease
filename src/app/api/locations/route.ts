import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, building, latitude, longitude, radiusMeters } = body;

        if (!name || latitude === undefined || longitude === undefined) {
            return NextResponse.json(
                { error: "Name, latitude, and longitude are required" },
                { status: 400 }
            );
        }

        const location = await db.location.create({
            data: {
                name,
                building,
                latitude,
                longitude,
                radiusMeters: radiusMeters || 100,
            },
        });

        return NextResponse.json(location, { status: 201 });
    } catch (error) {
        console.error("Error creating location:", error);
        return NextResponse.json(
            { error: "Failed to create location" },
            { status: 500 }
        );
    }
}

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locations = await db.location.findMany({
        orderBy: { name: "asc" },
    });

    return NextResponse.json(locations);
}
