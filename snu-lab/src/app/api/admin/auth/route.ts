import { NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({}));
  const expected = process.env.ADMIN_TOKEN || '';

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set('admin_token', expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: 60 * 30 // 30분 세션
  });
  return res;
}
