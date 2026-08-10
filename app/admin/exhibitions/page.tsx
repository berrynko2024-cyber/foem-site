import Link from "next/link";
import { exhibitions } from "@/lib/mockData";
import { supabase, mapDbExhibitionToExhibition } from "@/lib/supabase";
import DeleteExhibitionButton from "@/components/admin/DeleteExhibitionButton";

export const dynamic = "force-dynamic";

export default async function AdminExhibitionsPage() {
  const { data: dbExhibitions } = await supabase
    .from("exhibitions")
    .select("*")
    .order("created_at", { ascending: false });

  const mappedDbExhibitions = dbExhibitions ? dbExhibitions.map(mapDbExhibitionToExhibition) : [];
  const finalExhibitions = mappedDbExhibitions.length > 0 ? mappedDbExhibitions : exhibitions;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Exhibitions</span>
      </div>

      <div className="flex items-center justify-between mb-10">
        <h1
          className="text-3xl font-normal text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Exhibitions
        </h1>
        <Link
          href="/admin/exhibitions/new"
          className="text-xs tracking-[0.15em] uppercase px-5 py-2.5 bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-[0.98]"
        >
          + Add exhibition
        </Link>
      </div>

      <div className="border border-[#E8E6E2]">
        <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#E8E6E2] bg-[#EFEDE8]">
          {["Title", "Status", "Dates", "Actions"].map((h) => (
            <span key={h} className="text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A]">
              {h}
            </span>
          ))}
        </div>

        {finalExhibitions.map((ex) => (
          <div
            key={ex.id}
            className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-[#E8E6E2] last:border-0 items-center hover:bg-[#FAFAF8] transition-colors"
          >
            <div>
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                {ex.title}
              </p>
              <p className="text-[11px] text-[#9A9A9A]">{ex.artists.join(", ")}</p>
            </div>
            <p className="text-sm text-[#4A4A4A] capitalize">{ex.status}</p>
            <p className="text-sm text-[#4A4A4A]">{ex.startDate} ~ {ex.endDate}</p>
            <div className="flex gap-3">
              <Link
                href={`/admin/exhibitions/${ex.id}/edit`}
                className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors focus:outline-none"
              >
                Edit
              </Link>
              <DeleteExhibitionButton id={ex.id} title={ex.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
