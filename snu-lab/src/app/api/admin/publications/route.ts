import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    title,
    authors,
    venue,
    year,
    type,
    doi,
    link,
    volume,
    issue,
    pages,
    summary
  } = body;

  if (!title || !Array.isArray(authors) || authors.length === 0) {
    return NextResponse.json({ error: 'title and authors (array) are required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from('publications').insert([
    {
      title,
      authors,
      venue,
      year: year ? Number(year) : null,
      type,
      doi,
      link,
      volume,
      issue,
      pages,
      summary
    }
  ]).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ publication: data }, { status: 201 });
}
