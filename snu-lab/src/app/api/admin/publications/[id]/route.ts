import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Helper to normalize id from params or body
function parseId(paramsId: string, body: any): number | null {
  const paramId = Number(paramsId);
  const bodyId = body?.id !== undefined ? Number(body.id) : NaN;
  const id = Number.isFinite(paramId) && paramId > 0
    ? paramId
    : Number.isFinite(bodyId) && bodyId > 0
    ? bodyId
    : NaN;
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: paramIdRaw } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const id = parseId(paramIdRaw, body);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

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
    return NextResponse.json({ error: "title and authors (array) are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("publications")
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
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ publication: data }, { status: 200 });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: paramIdRaw } = await context.params;
  const body = await request.json().catch(() => null);
  const id = parseId(paramIdRaw, body);
  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const { error } = await supabaseAdmin.from("publications").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 200 });
}
