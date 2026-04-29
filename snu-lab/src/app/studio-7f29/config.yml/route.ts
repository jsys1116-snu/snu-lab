import { NextResponse } from "next/server";
import { DECAP_CMS_CONFIG } from "@/lib/decapConfig";

export async function GET() {
  return new NextResponse(DECAP_CMS_CONFIG, {
    status: 200,
    headers: {
      "Content-Type": "text/yaml; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}
