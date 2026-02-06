import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, matricNumber } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    ...(matricNumber ? [{ matricNumber }] : []),
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email or matric number already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
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
                user: { id: user.id, name: user.name, email: user.email },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: error?.message || "An error occurred during registration" },
            { status: 500 }
        );
    }
}

