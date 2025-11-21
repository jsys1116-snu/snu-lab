import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/admin', '/api/admin'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 보호 대상이 아니면 통과
  if (!PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 로그인 페이지는 예외
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const expected = process.env.ADMIN_TOKEN ?? '';
  const token = req.cookies.get('admin_token')?.value ?? '';

  // ADMIN_TOKEN이 비어 있더라도 값이 일치해야만 통과
  if (expected && token === expected) {
    return NextResponse.next();
  }

  // 미인증 시 로그인으로 보냄
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
