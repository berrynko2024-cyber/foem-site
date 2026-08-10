import Link from "next/link";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { artists as mockArtists } from "@/lib/mockData";
import { supabase, mapDbArtistToArtist } from "@/lib/supabase";

export default async function NewArtworkPage() {
  const { data: dbArtists } = await supabase.from("artists").select("*").order("name");
  const mappedDbArtists = dbArtists ? dbArtists.map(mapDbArtistToArtist) : [];
  const artists = mappedDbArtists.length > 0 ? mappedDbArtists : mockArtists;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin/artworks" className="hover:text-[#1A1A1A] transition-colors">Artworks</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">New</span>
      </div>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Add artwork
      </h1>

      <ArtworkForm mode="create" artists={artists} />
    </div>
  );
}
