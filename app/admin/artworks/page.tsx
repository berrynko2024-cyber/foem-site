import Link from "next/link";
import { artworks } from "@/lib/mockData";

export default function AdminArtworksPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Artworks</span>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h1
          className="text-3xl font-normal text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Artworks
        </h1>
        <button className="text-xs tracking-[0.15em] uppercase px-5 py-2.5 bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-[0.98]">
          + Add artwork
        </button>
      </div>

      <div className="border border-[#E8E6E2]">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#E8E6E2] bg-[#EFEDE8]">
          {["Title", "Artist", "Category", "Price", "Actions"].map((h) => (
            <span key={h} className="text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A]">
              {h}
            </span>
          ))}
        </div>

        {artworks.map((work) => (
          <div
            key={work.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-[#E8E6E2] last:border-0 items-center hover:bg-[#FAFAF8] transition-colors"
          >
            <div>
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                {work.title}
              </p>
              {work.isSold && (
                <span className="text-[10px] tracking-[0.1em] uppercase text-[#9A9A9A]">Sold</span>
              )}
            </div>
            <p className="text-sm text-[#4A4A4A]">{work.artistName}</p>
            <p className="text-sm text-[#4A4A4A] capitalize">{work.category}</p>
            <p className="text-sm text-[#1A1A1A]">{work.price.toLocaleString("ko-KR")}원</p>
            <div className="flex gap-3">
              <button className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors focus:outline-none">
                Edit
              </button>
              <button className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-red-500 transition-colors focus:outline-none">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#9A9A9A] mt-4">
        Full CRUD will be connected to Supabase in Phase 3.
      </p>
    </div>
  );
}
