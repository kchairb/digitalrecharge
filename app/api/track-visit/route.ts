import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { visitorId?: string; path?: string };
    const path = (body.path || "").trim();
    const visitorId = (body.visitorId || "").trim();
    if (!visitorId || !path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (
      path.startsWith("/_next") ||
      path.startsWith("/api") ||
      path.startsWith("/icon") ||
      path.endsWith(".svg")
    ) {
      return NextResponse.json({ ok: true });
    }

    const headerStore = await headers();
    const referrer = (headerStore.get("referer") || "").slice(0, 500) || null;
    const userAgent = (headerStore.get("user-agent") || "").slice(0, 500) || null;

    const supabase = getSupabaseAdmin();
    await supabase.from("site_visits").insert({
      visitor_id: visitorId,
      path,
      referrer,
      user_agent: userAgent,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
