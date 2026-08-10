import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id || !body.slug || !body.name || !body.bio || !body.bio_ko || !body.photo) {
      return NextResponse.json(
        { error: "id, slug, name, bio, bio_ko, photo는 필수입니다" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase.from("artists").select("id").eq("id", body.id).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: `이미 존재하는 작가 id입니다: ${body.id}` }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("artists")
      .insert({
        id: body.id,
        slug: body.slug,
        name: body.name,
        name_ko: body.name_ko || null,
        bio: body.bio,
        bio_ko: body.bio_ko,
        photo: body.photo,
        photo_filter: body.photo_filter || null,
        instagram: body.instagram || null,
        youtube: body.youtube || null,
        statement: body.statement || null,
        statement_ko: body.statement_ko || null,
        artwork_count: body.artwork_count ?? 0,
        works_grid: body.works_grid || null,
        works_layout: body.works_layout || null,
        medium: body.medium || null,
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
