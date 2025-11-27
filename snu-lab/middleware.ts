import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_BASE = "/admin";
const PROTECTED_PREFIXES = [ADMIN_BASE, "/api/admin"];
const LOGIN_PATH = `${ADMIN_BASE}/login`;
const AUTH_API_PREFIX = "/api/admin/auth";

const generateNonce = () => {
  const array = new Uint8Array(16);
  // Use Web Crypto (Edge runtime compatible)
  globalThis.crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Generate nonce for CSP
  const nonce = generateNonce();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  // Build CSP with nonce
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "base-uri 'self'"
  ].join("; ");

  // Base response with headers set
  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Auth guard for admin paths
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isLogin = pathname === LOGIN_PATH;
  const isAuthApi = pathname.startsWith(AUTH_API_PREFIX);

  if (!isProtected || isLogin || isAuthApi) {
    return response;
  }

  const expected = (process.env.ADMIN_TOKEN ?? "").trim();
  const token = (req.cookies.get("admin_token")?.value ?? "").trim();
  const isApi = pathname.startsWith("/api/");

  if (expected && token === expected) {
    return response;
  }

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: response.headers });
  }

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = LOGIN_PATH;
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl, { headers: response.headers });
}

export const config = {
  matcher: ["/:path*"]
};
