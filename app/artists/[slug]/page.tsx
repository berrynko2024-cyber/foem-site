import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { artists, getArtistBySlug, getArtworksByArtist, getVideosByArtist } from "@/lib/mockData";
import VideoPlayer from "@/components/VideoPlayer";

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) notFound();

  const works = getArtworksByArtist(artist.id).slice(0, 6);
  const videos = getVideosByArtist(artist.id);
  const featuredVideo = videos[0] ?? null;

  return (
    <div className="bg-[#F6F4EB]">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#5a9e72] mb-12">
          <Link href="/artists" className="hover:text-[#268042] transition-colors">
            Artists
          </Link>
          <span>/</span>
          <span className="text-[#268042]">{artist.name}</span>
        </div>

        {/* 1. 대형 영상 플레이어 */}
        {featuredVideo && (
          <div className="mb-20">
            <VideoPlayer video={featuredVideo} />
          </div>
        )}

        {/* 2. 아티스트 프로필 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <div className="relative aspect-[4/5] bg-[#e8f0eb] overflow-hidden">
            <Image
              src={artist.photo}
              alt={artist.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="lg:sticky lg:top-24 flex flex-col justify-center">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#5a9e72] mb-4">
              Artist
            </p>
            <h1
              className="text-4xl md:text-5xl font-normal text-[#268042] mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {artist.name}
            </h1>

            <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">
              {artist.bio}
            </p>
            <p className="text-sm text-[#9A9A9A] leading-relaxed mb-8">
              {artist.bio_ko}
            </p>

            {artist.instagram && (
              <p className="text-xs text-[#9A9A9A] tracking-wide mb-2">
                Instagram:{" "}
                <span className="text-[#268042]">{artist.instagram}</span>
              </p>
            )}

            <div className="mt-8 pt-8 border-t border-[#d4e8da]">
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#5a9e72]">
                {works.length} works available
              </p>
            </div>
          </div>
        </div>

        {/* 3. 작품 6개 그리드 */}
        {works.length > 0 && (
          <div>
            <h2
              className="text-2xl font-normal text-[#268042] mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Works
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-[#d4e8da]">
              {works.map((work) => (
                <Link
                  key={work.id}
                  href={`/shop/${work.id}`}
                  className="group bg-[#F6F4EB] overflow-hidden block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e8f0eb]">
                    <Image
                      src={work.images[0]}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {work.isSold && (
                      <div className="absolute inset-0 bg-[#F6F4EB]/70 flex items-center justify-center">
                        <span className="text-xs tracking-[0.2em] uppercase text-[#268042]">Sold</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3
                      className="text-base font-normal text-[#268042] mb-1"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {work.title}
                    </h3>
                    {work.dimensions && (
                      <p className="text-xs text-[#9A9A9A] mb-2">{work.dimensions}</p>
                    )}
                    <p className="text-sm text-[#4A4A4A]">
                      {work.price.toLocaleString("ko-KR")}원
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
