import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id || !body.name || !body.venue || !body.location || !body.start_date || !body.end_date || !body.status || !body.cover_image) {
      return NextResponse.json(
        { error: "id, name, venue, location, start_date, end_date, status, cover_image는 필수입니다" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase.from("art_fairs").select("id").eq("id", body.id).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: `이미 존재하는 아트페어 id입니다: ${body.id}` }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("art_fairs")
      .insert({
        id: body.id,
        name: body.name,
        venue: body.venue,
        location: body.location,
        artists: body.artists ?? [],
        preview_date: body.preview_date || null,
        start_date: body.start_date,
        end_date: body.end_date,
        status: body.status,
        cover_image: body.cover_image,
        description: body.description || null,
        artwork_ids: body.artwork_ids ?? null,
        booth_number: body.booth_number || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
