import { NextResponse } from "next/server";
import { artFairs } from "@/lib/mockData";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const formattedArtFairs = artFairs.map((fair) => ({
      id: fair.id,
      name: fair.name,
      venue: fair.venue,
      location: fair.location,
      artists: fair.artists,
      preview_date: fair.previewDate || null,
      start_date: fair.startDate,
      end_date: fair.endDate,
      status: fair.status,
      cover_image: fair.coverImage,
      description: fair.description || null,
      artwork_ids: fair.artworkIds || null,
      booth_number: fair.boothNumber || null,
    }));

    const { data, error } = await supabase
      .from("art_fairs")
      .upsert(formattedArtFairs, { onConflict: "id" });

    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${formattedArtFairs.length} art fairs seeded successfully.`,
      data,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
