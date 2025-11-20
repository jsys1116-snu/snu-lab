import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/admin', '/api/admin'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 보호 경로가 아니면 통과
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 로그인 페이지는 예외
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const adminToken = req.cookies.get('admin_token')?.value;
  const expected = process.env.ADMIN_TOKEN;

  if (adminToken && expected && adminToken === expected) {
    return NextResponse.next();
  }

  // 권한 없으면 로그인 페이지로
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
