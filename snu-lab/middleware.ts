import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/api/admin"];
const BASIC_USER = process.env.ADMIN_BASIC_USER;
const BASIC_PASS = process.env.ADMIN_BASIC_PASS;

const unauthorized = () =>
  new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
  });

const enforceBasicAuth = (req: NextRequest) => {
  if (!BASIC_USER || !BASIC_PASS) return null;
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorized();
  }
  const base64 = authHeader.replace("Basic ", "").trim();
  try {
    const decoded = atob(base64);
    const separatorIndex = decoded.indexOf(":");
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);
    if (user === BASIC_USER && pass === BASIC_PASS) {
      return null;
    }
    return unauthorized();
  } catch {
    return unauthorized();
  }
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login API itself (otherwise POST /api/admin/auth would be redirected)
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // Bypass if path is not protected
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const basicAuthResponse = enforceBasicAuth(req);
  if (basicAuthResponse) {
    return basicAuthResponse;
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
