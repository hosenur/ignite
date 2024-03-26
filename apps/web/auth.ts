import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { prisma } from "./lib/db";
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [GitHub],
    basePath: "/api/auth",
    pages: {
        signIn: "/",
    },
    callbacks: {
        authorized: ({ request: { nextUrl }, auth: midAuth }) => {
            const isLoggedIn = Boolean(midAuth?.user);
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

            if (isOnDashboard) {
                // Redirect unauthenticated users to the login page
                return isLoggedIn;
            } else if (isLoggedIn) {
                // Redirect authenticated users to the dashboard
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            // Allow unauthenticated users to access other pages
            return true;
        },
    },
} satisfies NextAuthConfig);