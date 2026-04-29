import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isLocalRequest } from "@/lib/localOnly";

function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(request: Request) {
  if (!isLocalRequest(request)) return notFound();

  const { data, error } = await supabaseAdmin
    .from("publications")
    .select("*")
    .order("id", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ publications: data ?? [] }, { status: 200 });
}

export async function POST(request: Request) {
  if (!isLocalRequest(request)) return notFound();

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, authors, venue, year, type, doi, link, volume, issue, pages, summary } = body;

  if (!title || !Array.isArray(authors) || authors.length === 0) {
    return NextResponse.json({ error: "title and authors (array) are required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("publications")
    .insert([
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
    ])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ publication: data }, { status: 201 });
}
