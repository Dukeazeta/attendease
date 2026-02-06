import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const session = req.auth;
    const { pathname } = req.nextUrl;

    // Protected routes
    const protectedPaths = ["/dashboard", "/courses", "/sessions", "/locations"];
    const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

    // Auth routes (redirect if already logged in)
    const authPaths = ["/login", "/register"];
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

    if (isProtectedPath && !session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthPath && session) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/courses/:path*",
        "/sessions/:path*",
        "/locations/:path*",
        "/login",
        "/register",
    ],
};
