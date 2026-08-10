import Link from "next/link";
import { notFound } from "next/navigation";
import ArtistForm from "@/components/admin/ArtistForm";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("artists").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin/artists" className="hover:text-[#1A1A1A] transition-colors">Artists</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Edit</span>
      </div>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Edit artist
      </h1>

      <ArtistForm
        mode="edit"
        initial={{
          id: data.id,
          slug: data.slug ?? "",
          name: data.name ?? "",
          name_ko: data.name_ko ?? "",
          bio: data.bio ?? "",
          bio_ko: data.bio_ko ?? "",
          photo: data.photo ?? "",
          photo_filter: data.photo_filter ?? "",
          instagram: data.instagram ?? "",
          youtube: data.youtube ?? "",
          statement: data.statement ?? "",
          statement_ko: data.statement_ko ?? "",
          artwork_count: String(data.artwork_count ?? 0),
          works_grid: data.works_grid ? String(data.works_grid) : "",
          works_layout: data.works_layout ?? "",
          medium: data.medium ?? "",
        }}
      />
    </div>
  );
}
