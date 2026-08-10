import Link from "next/link";
import { notFound } from "next/navigation";
import ExhibitionForm from "@/components/admin/ExhibitionForm";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function EditExhibitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("exhibitions").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin/exhibitions" className="hover:text-[#1A1A1A] transition-colors">Exhibitions</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Edit</span>
      </div>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Edit exhibition
      </h1>

      <ExhibitionForm
        mode="edit"
        initial={{
          id: data.id,
          title: data.title ?? "",
          title_en: data.title_en ?? "",
          artists: (data.artists ?? []).join(", "),
          venue: data.venue ?? "",
          location: data.location ?? "",
          start_date: data.start_date ?? "",
          end_date: data.end_date ?? "",
          status: data.status ?? "upcoming",
          cover_image: data.cover_image ?? "",
          hero_image: data.hero_image ?? "",
          description: data.description ?? "",
          description_ko: data.description_ko ?? "",
          video_url: data.video_url ?? "",
          orientation: data.orientation ?? "",
          photos: JSON.stringify(data.photos ?? [], null, 2),
        }}
      />
    </div>
  );
}
