import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  convexEnabled,
  createConvexUser,
  getConvexUserByEmailOrMatricNumber,
} from "@/lib/convex-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, matricNumber } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = convexEnabled()
      ? await getConvexUserByEmailOrMatricNumber(email, matricNumber)
      : await prisma.user.findFirst({
          where: {
            OR: [{ email }, ...(matricNumber ? [{ matricNumber }] : [])],
          },
        });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or matric number already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = convexEnabled()
      ? await createConvexUser({
          name,
          email,
          password: hashedPassword,
          matricNumber,
        })
      : await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            matricNumber,
          },
        });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user ? ("id" in user ? user.id : user._id) : null,
          name: user?.name,
          email: user?.email,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}
