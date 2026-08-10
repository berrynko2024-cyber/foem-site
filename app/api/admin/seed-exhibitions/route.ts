import { NextResponse } from "next/server";
import { exhibitions } from "@/lib/mockData";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const formattedExhibitions = exhibitions.map((ex) => ({
      id: ex.id,
      title: ex.title,
      title_en: ex.titleEn || null,
      artists: ex.artists,
      venue: ex.venue || null,
      location: ex.location,
      start_date: ex.startDate,
      end_date: ex.endDate,
      status: ex.status,
      cover_image: ex.coverImage,
      hero_image: ex.heroImage || null,
      description: ex.description || null,
      description_ko: ex.descriptionKo || null,
      video_url: ex.videoUrl || null,
      orientation: ex.orientation || null,
      photos: ex.photos || [],
    }));

    const { data, error } = await supabase
      .from("exhibitions")
      .upsert(formattedExhibitions, { onConflict: "id" });

    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${formattedExhibitions.length} exhibitions seeded successfully.`,
      data,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
