import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const envCheck = {
      TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL ? "Set" : "Missing",
      TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN ? "Set" : "Missing",
      NODE_ENV: process.env.NODE_ENV,
    };

    // Try simple query
    const userCount = await prisma.user.count();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
      env: envCheck,
    });
  } catch (error: unknown) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : String(error),
        env: {
          TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL ? "Set" : "Missing",
          TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN ? "Set" : "Missing",
          NODE_ENV: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}
