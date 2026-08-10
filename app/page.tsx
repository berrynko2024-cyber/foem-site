import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { artworks, artists, artistVideos } from "@/lib/mockData";
import VideoGrid from "@/components/VideoGrid";
import WorksGrid from "@/components/WorksGrid";
import MailingListForm from "@/components/MailingListForm";
import { supabase, mapDbArtworkToArtwork } from "@/lib/supabase";

// artworks가 Supabase에서 로드되므로, 어드민에서 수정한 내용이 재배포 없이 바로 반영되도록 정적 캐싱을 끈다.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.foem.co.kr",
  },
};

export default async function HomePage() {
  // Supabase에서 artworks 목록 조회
  const { data: dbArtworks } = await supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  // DB 데이터 매핑, 비어있으면 fallback으로 mockData 사용
  const mappedDbArtworks = dbArtworks ? dbArtworks.map(mapDbArtworkToArtwork) : [];
  const finalArtworks = mappedDbArtworks.length > 0 ? mappedDbArtworks : artworks;

  const galleryItems = finalArtworks.filter(a => a && a.images && a.images[0] && a.images[0].startsWith('/artworks/')) as any[];
  const featuredArtists = artists;

  return (
    <div>
      {/* Hero — fullscreen centered typography */}
      <section className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-6 text-center">
        {/* Main title */}
        <h1
          className="text-[38vw] md:text-[32vw] leading-[0.88] uppercase text-[#268042] text-center"
          style={{
            fontFamily: "var(--font-oswald)",
            letterSpacing: "-0.03em",
          }}
        >
          FOEM
        </h1>

        {/* Bottom subtitle */}
        <p
          className="text-[11px] md:text-[13px] tracking-[0.5em] uppercase text-[#268042] mt-12 md:mt-16"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 700 }}
        >
          FIELD OF EMOTIONS
        </p>
      </section>

      {/* Video Grid */}
      <VideoGrid videos={artistVideos} />

      {/* Curated Works Grid */}
      <section className="max-w-[65vw] mx-auto pb-24 md:pb-36">
        <div className="flex items-end justify-between mb-8">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-[#268042]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 700 }}
          >
            Works
          </p>
          <Link
            href="/shop"
            className="text-xs tracking-[0.15em] uppercase text-[#5a9e72] hover:text-[#268042] transition-colors duration-200"
          >
            Shop all →
          </Link>
        </div>

        <WorksGrid items={galleryItems} />
      </section>

      {/* Artists Section */}
      <section className="border-t border-[#d4e8da]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-12">
            <h2
              className="text-3xl md:text-4xl font-normal text-[#268042]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              The artists
            </h2>
            <Link
              href="/artists"
              className="text-xs tracking-[0.15em] uppercase text-[#5a9e72] hover:text-[#268042] transition-colors duration-200"
            >
              All artists →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.slug}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e8f0eb] mb-4">
                  <Image
                    src={artist.photo}
                    alt={artist.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#5a9e72] mb-1">
                  {artist.artworkCount} works
                </p>
                <h3
                  className="text-xl font-normal text-[#268042]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {artist.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p
            className="text-2xl md:text-3xl font-normal text-[#268042] leading-relaxed"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            &ldquo;Every work on FOEM is an original — made by hand, shaped by feeling, carried by intention.&rdquo;
          </p>
          <div className="mt-8 h-px w-16 bg-[#268042]" />
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-[#d4e8da]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-end">
            <div>
              <p
                className="text-[10px] tracking-[0.3em] uppercase text-[#5a9e72] mb-4"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 700 }}
              >
                Newsletter
              </p>
              <h2
                className="text-3xl md:text-4xl font-normal text-[#268042] leading-snug"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Stay in the field.
              </h2>
            </div>
            <div>
              <p
                className="text-sm text-[#5a9e72] leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                New works, artist stories, and art fair updates —
                <br className="hidden md:block" />
                delivered to your inbox.
              </p>
              <MailingListForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
