import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const expected = process.env.ADMIN_TOKEN || '';
  const cookie = request.headers.get('cookie') || '';
  const tokenMatch = cookie.match(/admin_token=([^;]+)/);
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : '';

  if (expected && token === expected) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
