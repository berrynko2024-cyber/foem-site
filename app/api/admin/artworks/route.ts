import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id || !body.title || !body.artist_id || body.price === undefined) {
      return NextResponse.json({ error: "id, title, artist_id, price는 필수입니다" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase.from("artworks").select("id").eq("id", body.id).maybeSingle();
    if (existing) {
      return NextResponse.json({ error: `이미 존재하는 작품 id입니다: ${body.id}` }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("artworks")
      .insert({
        id: body.id,
        title: body.title,
        title_ko: body.title_ko || null,
        description: body.description || null,
        description_ko: body.description_ko || null,
        price: body.price,
        currency: body.currency || "KRW",
        category: body.category,
        images: body.images ?? [],
        artist_id: body.artist_id,
        artist_name: body.artist_name,
        stock: body.stock ?? 1,
        is_sold: body.is_sold ?? false,
        year: body.year || null,
        medium: body.medium || null,
        dimensions: body.dimensions || null,
        orientation: body.orientation || "portrait",
        price_display: body.price_display || null,
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
