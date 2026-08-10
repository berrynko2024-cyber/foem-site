import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id || !body.title || !body.location || !body.start_date || !body.end_date || !body.status || !body.cover_image) {
      return NextResponse.json(
        { error: "id, title, location, start_date, end_date, status, cover_image는 필수입니다" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase.from("exhibitions").select("id").eq("id", body.id).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: `이미 존재하는 전시 id입니다: ${body.id}` }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("exhibitions")
      .insert({
        id: body.id,
        title: body.title,
        title_en: body.title_en || null,
        artists: body.artists ?? [],
        venue: body.venue || null,
        location: body.location,
        start_date: body.start_date,
        end_date: body.end_date,
        status: body.status,
        cover_image: body.cover_image,
        hero_image: body.hero_image || null,
        description: body.description || null,
        description_ko: body.description_ko || null,
        video_url: body.video_url || null,
        orientation: body.orientation || null,
        photos: body.photos ?? [],
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
