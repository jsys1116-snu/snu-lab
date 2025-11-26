import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_BASE = "/admin";
const PROTECTED_PREFIXES = [ADMIN_BASE, "/api/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login API itself (otherwise POST /api/admin/auth would be blocked)
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // Bypass if path is not protected
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow login page (kept at /admin/login)
  if (pathname === `${ADMIN_BASE}/login`) {
    return NextResponse.next();
  }

  const expected = (process.env.ADMIN_TOKEN ?? "").trim();
  const token = (req.cookies.get("admin_token")?.value ?? "").trim();

  if (expected && token === expected) {
    return NextResponse.next();
  }

  // Hide admin surface from unauthenticated users
  return new NextResponse("Not Found", { status: 404 });
}

export const config = {
  matcher: [`${ADMIN_BASE}/:path*`, "/api/admin/:path*"],
};