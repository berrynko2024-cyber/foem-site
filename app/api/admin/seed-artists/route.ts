import { NextResponse } from "next/server";
import { artists } from "@/lib/mockData";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const formattedArtists = artists.map((artist) => ({
      id: artist.id,
      slug: artist.slug,
      name: artist.name,
      name_ko: artist.name_ko || null,
      bio: artist.bio,
      bio_ko: artist.bio_ko,
      photo: artist.photo,
      photo_filter: artist.photoFilter || null,
      instagram: artist.instagram || null,
      youtube: artist.youtube || null,
      statement: artist.statement || null,
      statement_ko: artist.statement_ko || null,
      artwork_count: artist.artworkCount ?? 0,
      works_grid: artist.worksGrid || null,
      works_layout: artist.worksLayout || null,
      medium: artist.medium || null,
    }));

    const { data, error } = await supabase
      .from("artists")
      .upsert(formattedArtists, { onConflict: "id" });

    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${formattedArtists.length} artists seeded successfully.`,
      data,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
