import { artists as mockArtists } from "@/lib/mockData";
import { supabase, mapDbArtistToArtist } from "@/lib/supabase";
import { withLiveWorkCounts } from "@/lib/workCounts";
import ArtistsGrid from "@/components/ArtistsGrid";
import { ARTISTS_SEO } from "@/lib/seo";

// 공개 페이지는 ISR 캐시(최대 1시간) — 어드민·결제에서 데이터가 바뀌면 lib/revalidate.ts로 즉시 무효화
export const revalidate = 3600;

export default async function ArtistsPage() {
  const [{ data: dbArtists }, { data: dbWorks }] = await Promise.all([
    supabase.from("artists").select("*").order("id", { ascending: true }),
    supabase.from("artworks").select("artist_id, is_sold"),
  ]);
  const mappedDbArtists = dbArtists ? dbArtists.map(mapDbArtistToArtist) : [];
  const works = (dbWorks ?? []).map((w) => ({ artistId: w.artist_id as string, isSold: !!w.is_sold }));
  const artists = withLiveWorkCounts(mappedDbArtists.length > 0 ? mappedDbArtists : mockArtists, works);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">FOEM</p>
        <h1
          className="text-6xl md:text-8xl font-bold uppercase text-[#1A1A1A] leading-[1.0]"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Artists
        </h1>
        <p className="text-sm text-[#4A4A4A] leading-relaxed max-w-2xl mt-6">
          {ARTISTS_SEO.description}
        </p>
      </div>

      <ArtistsGrid artists={artists} />
    </div>
  );
}
