import { NextResponse } from "next/server";
import { DECAP_CMS_HTML } from "@/lib/decapConfig";

export async function GET() {
  return new NextResponse(DECAP_CMS_HTML, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}
