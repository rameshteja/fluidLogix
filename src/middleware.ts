import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie keys for authentication
const AUTH_COOKIE_NAME = "fluidlogix_auth_token";
const FALLBACK_AUTH_COOKIE = "auth_token";

// Strict Auth Route Protection Flag (Set to true in production when NestJS backend is connected)
const STRICT_AUTH_ENFORCEMENT = process.env.NEXT_PUBLIC_STRICT_AUTH === "true";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from request cookies or Authorization header
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ||
    request.cookies.get(FALLBACK_AUTH_COOKIE)?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  const isAuthenticated = Boolean(token && token.trim().length > 0);

  // When strict auth is enabled, enforce redirects
  if (STRICT_AUTH_ENFORCEMENT) {
    const isProtectedRoute = pathname.startsWith("/dashboard");
    const isAuthRoute =
      pathname.startsWith("/login") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/register");

    // 1. Unauthenticated access to protected dashboard
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Already-authenticated access to login / register / forgot-password
    if (isAuthRoute && isAuthenticated) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Allow all navigation seamlessly for UI inspection & dummy data testing
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Backend-Mode", STRICT_AUTH_ENFORCEMENT ? "Live-NestJS" : "Preview-DummyData");

  return response;
}

// Next.js Middleware Matcher Configuration (Excludes static assets and internal next files)
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (.png, .jpg, .svg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
