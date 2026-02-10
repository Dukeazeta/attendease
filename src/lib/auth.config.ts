import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    providers: [
        // We'll add providers in the main auth.ts to keep DB logic separate if needed,
        // but for Credentials with custom authorize, it often needs to stay in auth.ts.
        // However, middleware just needs to verify the JWT.
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;
