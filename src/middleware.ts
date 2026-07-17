import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register"];
const ADMIN_PATHS = ["/admin", "/api/admin"];

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

  // Allow public keep-alive cron endpoint
  if (pathname === "/api/cron/keep-alive") {
    return NextResponse.next();
  }

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api/");

  // Validate token from cookie
  const token = req.cookies.get("cc_auth")?.value;

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "احراز هویت الزامی است.", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyToken(token);

  if (!user) {
    if (isApiRoute) {
      const response = NextResponse.json(
        { error: "توکن منقضی یا نامعتبر است.", code: "TOKEN_INVALID" },
        { status: 401 }
      );
      response.cookies.delete("cc_auth");
      return response;
    }
    const response = NextResponse.redirect(new URL("/auth/login", req.url));
    response.cookies.delete("cc_auth");
    return response;
  }

  // Admin-only route protection
  if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && user.role !== "ADMIN") {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز. فقط ادمین می‌تواند این عملیات را انجام دهد.", code: "FORBIDDEN" },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Attach user info to request headers for server components / route handlers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", user.userId);
  requestHeaders.set("x-user-email", user.email);
  requestHeaders.set("x-user-role", user.role);
  // URL encode the name because HTTP headers don't support Persian (UTF-8) characters natively
  requestHeaders.set("x-user-name", encodeURIComponent(user.name));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
