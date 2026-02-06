import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            if (token.matricNumber) {
                session.user.matricNumber = token.matricNumber as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.matricNumber = (user as { matricNumber?: string }).matricNumber;
            }
            return token;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
