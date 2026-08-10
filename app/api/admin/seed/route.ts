import { NextResponse } from "next/server";
import { artworks } from "@/lib/mockData";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    // Supabase DB에 artworks 적재
    // id가 중복될 경우 업데이트(upsert) 하도록 설정
    const formattedArtworks = artworks.map((artwork) => ({
      id: artwork.id,
      title: artwork.title,
      title_ko: artwork.title_ko || null,
      description: artwork.description || null,
      description_ko: artwork.description_ko || null,
      price: artwork.price,
      currency: artwork.currency || "KRW",
      category: artwork.category,
      images: artwork.images,
      artist_id: artwork.artistId,
      artist_name: artwork.artistName,
      stock: artwork.stock ?? 1,
      is_sold: artwork.isSold ?? false,
      year: artwork.year || null,
      medium: artwork.medium || null,
      dimensions: artwork.dimensions || null,
      orientation: artwork.orientation || "portrait",
      price_display: artwork.priceDisplay || null,
      emotions: artwork.emotions || null,
      artist_statement: artwork.artistStatement || null,
      series: artwork.series || null,
      fill_frame: artwork.fillFrame ?? null,
    }));

    const { data, error } = await supabase
      .from("artworks")
      .upsert(formattedArtworks, { onConflict: "id" });

    if (error) {
      console.error("Seed error details:", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${formattedArtworks.length} artworks seeded successfully.`,
      data,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
