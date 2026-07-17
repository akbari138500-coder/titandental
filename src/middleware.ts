import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Paths that do NOT require authentication
const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register"];
// Paths that are only accessible by ADMIN role
const ADMIN_PATHS = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // Allow public auth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow public keep-alive cron (called by external scheduler)
  if (pathname === "/api/cron/keep-alive") {
    return NextResponse.next();
  }

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Validate token from cookie
  const token = req.cookies.get("cc_auth")?.value;

  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyToken(token);

  if (!user) {
    // Token is invalid or expired — clear cookie and redirect to login
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.delete("cc_auth");
    return response;
  }

  // Admin-only route protection
  if (
    ADMIN_PATHS.some((p) => pathname.startsWith(p)) &&
    user.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Attach user info to request headers for server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", user.userId);
  requestHeaders.set("x-user-email", user.email);
  requestHeaders.set("x-user-role", user.role);
  requestHeaders.set("x-user-name", user.name);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
