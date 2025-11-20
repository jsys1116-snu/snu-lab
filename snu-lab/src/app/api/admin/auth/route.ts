import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({}));
  const expected = process.env.ADMIN_TOKEN || '';

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 인증 성공
  return NextResponse.json({ ok: true }, { status: 200 });
}
