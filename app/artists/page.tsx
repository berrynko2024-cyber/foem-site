import { artists as mockArtists } from "@/lib/mockData";
import { supabase, mapDbArtistToArtist } from "@/lib/supabase";
import ArtistsGrid from "@/components/ArtistsGrid";

export const dynamic = "force-dynamic";

export default async function ArtistsPage() {
  const { data: dbArtists } = await supabase.from("artists").select("*");
  const mappedDbArtists = dbArtists ? dbArtists.map(mapDbArtistToArtist) : [];
  const artists = mappedDbArtists.length > 0 ? mappedDbArtists : mockArtists;

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
      </div>

      <ArtistsGrid artists={artists} />
    </div>
  );
}
