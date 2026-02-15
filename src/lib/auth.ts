import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { authConfig } from "./auth.config";
import { hashPassword, verifyPassword } from "./password";

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
                const password = credentials.password as string | undefined;
                const flow = credentials.flow as string;

                if (!password) return null;

                if (flow === "signUp") {
                    const name = credentials.name as string;
                    const matricNumber = credentials.matricNumber as string;

                    if (!name || !matricNumber) {
                        return null;
                    }

                    const existingUser = await db.query.users.findFirst({
                        where: eq(users.email, email),
                    });

                    if (existingUser) {
                        return null;
                    }

                    const newUser = {
                        id: nanoid(),
                        email,
                        name,
                        matricNumber,
                        passwordHash: hashPassword(password),
                    };

                    await db.insert(users).values(newUser);
                    return newUser;
                }

                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });

                if (!user) {
                    return null;
                }

                if (!user.passwordHash) {
                    return null;
                }

                const isValidPassword = verifyPassword(password, user.passwordHash);
                if (!isValidPassword) {
                    return null;
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
                        const mutableUser = session.user as typeof session.user & { matricNumber?: string | null };
                        mutableUser.matricNumber = dbUser.matricNumber;
                    }
                } catch (e) {
                    console.error("Session callback DB error:", e);
                }
            }
            return session;
        },
    },
});
