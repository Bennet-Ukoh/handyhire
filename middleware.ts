import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { SessionData, UserRole } from "./lib/auth/types";

const COOKIE_NAME = "hh_session";

const PROTECTED: string[] = ["/dashboard", "/client", "/worker", "/admin"];

const ROLE_GATES: Record<string, UserRole> = {
  "/client": "client",
  "/worker": "worker",
  "/admin":  "admin",
};

const AUTH_PATHS: string[] = ["/auth/signin", "/auth/signup"];

function parseSession(raw: string): SessionData | null {
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(COOKIE_NAME)?.value;
  const session = raw ? parseSession(raw) : null;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage  = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isProtected && session) {
    for (const [prefix, requiredRole] of Object.entries(ROLE_GATES)) {
      if (pathname.startsWith(prefix) && session.role !== requiredRole && session.role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  if (isAuthPage && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
