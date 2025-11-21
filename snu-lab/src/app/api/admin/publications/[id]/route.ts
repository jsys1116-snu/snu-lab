import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type Params = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, { params }: Params) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

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

  const { data, error } = await supabaseAdmin
    .from('publications')
    .update({
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
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ publication: data }, { status: 200 });
}

export async function DELETE(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const { error } = await supabaseAdmin.from('publications').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 200 });
}
