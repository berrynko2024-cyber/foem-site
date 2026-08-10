import Link from "next/link";
import { notFound } from "next/navigation";
import ArtworkForm from "@/components/admin/ArtworkForm";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("artworks").select("*").eq("id", id).maybeSingle();

  if (!data) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <Link href="/admin/artworks" className="hover:text-[#1A1A1A] transition-colors">Artworks</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Edit</span>
      </div>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Edit artwork
      </h1>

      <ArtworkForm
        mode="edit"
        initial={{
          id: data.id,
          title: data.title ?? "",
          title_ko: data.title_ko ?? "",
          description: data.description ?? "",
          price: String(data.price ?? ""),
          currency: data.currency ?? "KRW",
          category: data.category ?? "painting",
          images: (data.images ?? []).join("\n"),
          artist_id: data.artist_id,
          stock: String(data.stock ?? 1),
          is_sold: data.is_sold ?? false,
          year: data.year ? String(data.year) : "",
          medium: data.medium ?? "",
          dimensions: data.dimensions ?? "",
          orientation: data.orientation ?? "portrait",
          price_display: data.price_display ?? "",
        }}
      />
    </div>
  );
}
