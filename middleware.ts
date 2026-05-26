import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/auth",
  },
});

export default async function middleware(req: NextRequest, event: any) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  // Rate Limit check for POST /api/auth/signin or credentials callback
  if (
    method === "POST" &&
    (pathname.startsWith("/api/auth/signin") ||
      pathname.startsWith("/api/auth/callback/credentials"))
  ) {
    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    try {
      const { success } = await rateLimit.limit(ip);
      if (!success) {
        return new NextResponse(
          JSON.stringify({ error: "Too many attempts. Try again in 10 minutes." }),
          { status: 429, headers: { "content-type": "application/json" } }
        );
      }
    } catch (err) {
      console.error("Rate limit error:", err);
      // In development/test, do not block the user if Redis rest credentials fail
    }
  }

  // If path is protected, run next-auth middleware
  if (pathname.startsWith("/dashboard")) {
    return (authMiddleware as any)(req, event);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/auth/signin/:path*", "/api/auth/callback/:path*"],
};
