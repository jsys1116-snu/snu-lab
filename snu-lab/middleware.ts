import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/api/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bypass if path is not protected
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const expected = (process.env.ADMIN_TOKEN ?? "").trim();
  const token = (req.cookies.get("admin_token")?.value ?? "").trim();

  if (expected && token === expected) {
    return NextResponse.next();
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
