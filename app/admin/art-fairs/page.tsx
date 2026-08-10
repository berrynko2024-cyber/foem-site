import Link from "next/link";
import { artFairs } from "@/lib/mockData";
import { supabase, mapDbArtFairToArtFair } from "@/lib/supabase";
import DeleteArtFairButton from "@/components/admin/DeleteArtFairButton";

export const dynamic = "force-dynamic";

export default async function AdminArtFairsPage() {
  const { data: dbArtFairs } = await supabase
    .from("art_fairs")
    .select("*")
    .order("created_at", { ascending: false });

  const mappedDbArtFairs = dbArtFairs ? dbArtFairs.map(mapDbArtFairToArtFair) : [];
  const finalArtFairs = mappedDbArtFairs.length > 0 ? mappedDbArtFairs : artFairs;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Art Fairs</span>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h1
          className="text-3xl font-normal text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Art Fairs
        </h1>
        <Link
          href="/admin/art-fairs/new"
          className="text-xs tracking-[0.15em] uppercase px-5 py-2.5 bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-[0.98]"
        >
          + Add art fair
        </Link>
      </div>

      <div className="border border-[#E8E6E2]">
        <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#E8E6E2] bg-[#EFEDE8]">
          {["Name", "Status", "Dates", "Actions"].map((h) => (
            <span key={h} className="text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A]">
              {h}
            </span>
          ))}
        </div>

        {finalArtFairs.map((fair) => (
          <div
            key={fair.id}
            className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-[#E8E6E2] last:border-0 items-center hover:bg-[#FAFAF8] transition-colors"
          >
            <div>
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                {fair.name}
              </p>
              <p className="text-[11px] text-[#9A9A9A]">{fair.location}</p>
            </div>
            <p className="text-sm text-[#4A4A4A] capitalize">{fair.status}</p>
            <p className="text-sm text-[#4A4A4A]">{fair.startDate} ~ {fair.endDate}</p>
            <div className="flex gap-3">
              <Link
                href={`/admin/art-fairs/${fair.id}/edit`}
                className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors focus:outline-none"
              >
                Edit
              </Link>
              <DeleteArtFairButton id={fair.id} name={fair.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
