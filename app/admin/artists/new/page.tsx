import Link from "next/link";
import ArtistForm from "@/components/admin/ArtistForm";

export default function NewArtistPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin/artists" className="hover:text-[#1A1A1A] transition-colors">Artists</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">New</span>
      </div>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Add artist
      </h1>

      <ArtistForm mode="create" />
    </div>
  );
}
