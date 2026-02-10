import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { authConfig } from "./auth.config";

const isEdge = process.env.NEXT_RUNTIME === "edge";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: isEdge ? undefined : DrizzleAdapter(db),
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text" },
                matricNumber: { label: "Matric Number", type: "text" },
                flow: { label: "Flow", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                const email = (credentials.email as string).toLowerCase();
                const flow = credentials.flow as string;

                if (flow === "signUp") {
                    const name = credentials.name as string;
                    const matricNumber = credentials.matricNumber as string;

                    if (!name || !matricNumber) {
                        throw new Error("Name and Matric Number are required for sign up.");
                    }

                    const existingUser = await db.query.users.findFirst({
                        where: eq(users.email, email),
                    });

                    if (existingUser) {
                        throw new Error("User with this email already exists.");
                    }

                    const newUser = {
                        id: nanoid(),
                        email,
                        name,
                        matricNumber,
                    };

                    await db.insert(users).values(newUser);
                    return newUser;
                }

                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });

                if (!user) {
                    throw new Error("User not found.");
                }

                return user;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (token?.id && session.user) {
                session.user.id = token.id as string;

                // Only fetch additional fields if we have a DB connection
                // This will run on the server in RSC/Actions
                try {
                    const dbUser = await db.query.users.findFirst({
                        where: eq(users.id, token.id as string),
                    });

                    if (dbUser) {
                        (session.user as any).matricNumber = dbUser.matricNumber;
                    }
                } catch (e) {
                    console.error("Session callback DB error:", e);
                }
            }
            return session;
        },
    },
});
