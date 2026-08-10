import Link from "next/link";
import { notFound } from "next/navigation";
import ArtFairForm from "@/components/admin/ArtFairForm";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function EditArtFairPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("art_fairs").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin/art-fairs" className="hover:text-[#1A1A1A] transition-colors">Art Fairs</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Edit</span>
      </div>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Edit art fair
      </h1>

      <ArtFairForm
        mode="edit"
        initial={{
          id: data.id,
          name: data.name ?? "",
          venue: data.venue ?? "",
          location: data.location ?? "",
          artists: (data.artists ?? []).join(", "),
          preview_date: data.preview_date ?? "",
          start_date: data.start_date ?? "",
          end_date: data.end_date ?? "",
          status: data.status ?? "upcoming",
          cover_image: data.cover_image ?? "",
          description: data.description ?? "",
          artwork_ids: (data.artwork_ids ?? []).join(", "),
          booth_number: data.booth_number ?? "",
        }}
      />
    </div>
  );
}
