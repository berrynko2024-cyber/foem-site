import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Artwork, artists, getArtistBySlug, getArtworksByArtist, getVideosByArtist } from "@/lib/mockData";
import VideoPlayer from "@/components/VideoPlayer";

type RowItem = { work: Artwork; colSpan: 4 | 6 | 8 | 12 };

function buildRows(works: Artwork[]): RowItem[][] {
  const rows: RowItem[][] = [];
  const pool = [...works];

  while (pool.length > 0) {
    const first = pool[0];

    if (first.orientation === 'landscape') {
      const pairIdx = pool.slice(1, 4).findIndex(w => w.orientation !== 'landscape');
      if (pairIdx >= 0) {
        const pair = pool.splice(1 + pairIdx, 1)[0];
        pool.shift();
        rows.push([{ work: first, colSpan: 8 }, { work: pair, colSpan: 4 }]);
      } else if (pool.length >= 2) {
        const second = pool.splice(1, 1)[0];
        pool.shift();
        rows.push([{ work: first, colSpan: 6 }, { work: second, colSpan: 6 }]);
      } else {
        pool.shift();
        rows.push([{ work: first, colSpan: 12 }]);
      }
    } else {
      const landscapeIdx = pool.slice(1, 4).findIndex(w => w.orientation === 'landscape');
      if (landscapeIdx >= 0) {
        const landscape = pool.splice(1 + landscapeIdx, 1)[0];
        pool.shift();
        rows.push([{ work: first, colSpan: 4 }, { work: landscape, colSpan: 8 }]);
      } else {
        const group: Artwork[] = [pool.shift()!];
        while (group.length < 3 && pool.length > 0 && pool[0].orientation !== 'landscape') {
          group.push(pool.shift()!);
        }
        const span = (group.length >= 3 ? 4 : 6) as 4 | 6;
        rows.push(group.map(w => ({ work: w, colSpan: span })));
      }
    }
  }

  return rows;
}

function getAspectClass(orientation?: string): string {
  if (orientation === 'landscape') return 'aspect-[3/2]';
  if (orientation === 'square') return 'aspect-square';
  return 'aspect-[3/4]';
}

const colSpanClass: Record<4 | 6 | 8 | 12, string> = {
  4:  'col-span-12 sm:col-span-4',
  6:  'col-span-12 sm:col-span-6',
  8:  'col-span-12 sm:col-span-8',
  12: 'col-span-12',
};

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) return {};

  const description = artist.bio.slice(0, 155) + "…";
  const koKeywords = artist.name_ko ? artist.name_ko.split(" ") : [];

  const titleKo = artist.name_ko ? ` (${artist.name_ko})` : "";

  return {
    title: `${artist.name}${titleKo}`,
    description,
    keywords: [artist.name, ...koKeywords, "FOEM", "아트갤러리", "현대미술", "원화"],
    openGraph: {
      title: `${artist.name}${titleKo} — FOEM`,
      description,
      url: `https://www.foem.co.kr/artists/${slug}`,
      images: artist.photo ? [{ url: artist.photo, alt: artist.name }] : [],
    },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) notFound();

  const works = artist.id === 'a8'
    ? [...getArtworksByArtist(artist.id)].reverse()
    : [...getArtworksByArtist(artist.id)].reverse().slice(0, 6);
  const videos = getVideosByArtist(artist.id);
  const featuredVideo = videos[0] ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    alternateName: artist.name_ko ? artist.name_ko.split(" ") : undefined,
    description: artist.bio,
    url: `https://www.foem.co.kr/artists/${artist.slug}`,
    image: artist.photo ? `https://www.foem.co.kr${artist.photo}` : undefined,
    sameAs: artist.instagram
      ? [`https://www.instagram.com/${artist.instagram.replace("@", "")}`]
      : [],
    memberOf: {
      "@type": "Organization",
      name: "FOEM",
      url: "https://www.foem.co.kr",
    },
  };

  return (
    <div className="bg-[#F6F4EB]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        {featuredVideo ? (
          <div className="mb-20">
            <VideoPlayer video={featuredVideo} />
          </div>
        ) : (
          <div className="mb-20 aspect-video bg-[#e8f0eb] flex flex-col items-center justify-center gap-3">
            <p className="text-xs tracking-[0.2em] uppercase text-[#5a9e72]">Video</p>
            <p className="text-sm text-[#9A9A9A]">준비중입니다</p>
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
              className="text-4xl md:text-5xl font-normal text-[#268042] mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {artist.name}
            </h1>
            {artist.name_ko && (
              <p
                className="text-base text-[#5a9e72] mb-8"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {artist.name_ko}
              </p>
            )}

            <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">
              {artist.bio}
            </p>
            <p className="text-sm text-[#9A9A9A] leading-relaxed mb-8">
              {artist.bio_ko}
            </p>

            {artist.instagram && (
              <p className="text-xs text-[#9A9A9A] tracking-wide mb-2">
                Instagram:{" "}
                <a
                  href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#268042] hover:text-[#1a5c30] transition-colors"
                >
                  {artist.instagram}
                </a>
              </p>
            )}

            <div className="mt-8 pt-8 border-t border-[#d4e8da]">
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#5a9e72]">
                {works.length > 0 ? `${works.length} works available` : "Works coming soon"}
              </p>
            </div>
          </div>
        </div>

        {/* 3. 작품 그리드 */}
        {works.length === 0 && (
          <div className="mb-20">
            <h2
              className="text-2xl font-normal text-[#268042] mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Works
            </h2>
            <div className="aspect-[3/1] bg-[#e8f0eb] flex flex-col items-center justify-center gap-3">
              <p className="text-xs tracking-[0.2em] uppercase text-[#5a9e72]">Works</p>
              <p className="text-sm text-[#9A9A9A]">준비중입니다</p>
            </div>
          </div>
        )}
        {works.length > 0 && (
          <div>
            <h2
              className="text-2xl font-normal text-[#268042] mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Works
            </h2>

            {/* 이영재(a8): orientation 기반 동적 그리드 */}
            {artist.id === 'a8' && (
              <div className="space-y-px">
                {buildRows(works).map((row, ri) => (
                  <div key={ri} className="grid grid-cols-12 gap-px bg-[#d4e8da]">
                    {row.map(({ work, colSpan }) => (
                      <Link
                        key={work.id}
                        href={`/shop/${work.id}`}
                        className={`${colSpanClass[colSpan]} group bg-[#F6F4EB] block overflow-hidden`}
                      >
                        <div className={`relative ${getAspectClass(work.orientation)} bg-[#e8f0eb] overflow-hidden`}>
                          <Image
                            src={work.images[0]}
                            alt={work.title}
                            fill
                            className={`${work.orientation === 'landscape' ? 'object-contain' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          {work.isSold && (
                            <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1">
                              Sold
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-base font-normal text-[#268042] mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                            {work.title}
                          </h3>
                          {work.dimensions && <p className="text-xs text-[#9A9A9A] mb-2">{work.dimensions}</p>}
                          <p className="text-sm text-[#4A4A4A]">
                            {work.isSold ? "Sold Out" : (work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* 나머지 작가: 기존 레이아웃 */}
            {artist.id !== 'a8' && (() => {
              if (artist.worksLayout === 'portrait3-mixed') {
                const rawPortraits = works.filter(w => !w.orientation || w.orientation === 'portrait');
                const portraits = rawPortraits.length === 3
                  ? [rawPortraits[1], rawPortraits[0], rawPortraits[2]]
                  : rawPortraits;
                const landscapes = works.filter(w => w.orientation === 'landscape');
                const squares = works.filter(w => w.orientation === 'square');
                const WorkCard = ({ work, colClass, aspectClass, imgClass }: { work: typeof works[0]; colClass: string; aspectClass: string; imgClass: string }) => (
                  <Link key={work.id} href={`/shop/${work.id}`} className={`group bg-[#F6F4EB] overflow-hidden block ${colClass}`}>
                    <div className={`relative overflow-hidden bg-[#e8f0eb] ${aspectClass}`}>
                      <Image src={work.images[0]} alt={work.title} fill className={`${imgClass} transition-transform duration-700 group-hover:scale-[1.03]`} sizes="(max-width: 640px) 50vw, 33vw" />
                      {work.isSold && <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1">Sold</div>}
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-normal text-[#268042] mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{work.title}</h3>
                      {work.dimensions && <p className="text-xs text-[#9A9A9A] mb-2">{work.dimensions}</p>}
                      <p className="text-sm text-[#4A4A4A]">{work.isSold ? "Sold Out" : (work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`)}</p>
                    </div>
                  </Link>
                );
                return (
                  <div className="grid grid-cols-6 gap-px bg-[#d4e8da]">
                    {portraits.map(w => <WorkCard key={w.id} work={w} colClass="col-span-2" aspectClass="aspect-[4/5]" imgClass="object-cover" />)}
                    {landscapes.map(w => <WorkCard key={w.id} work={w} colClass="col-span-3" aspectClass="aspect-[3/2]" imgClass="object-contain" />)}
                    {squares.map(w => <WorkCard key={w.id} work={w} colClass="col-span-3 flex flex-col" aspectClass="flex-1 min-h-0" imgClass="object-contain" />)}
                  </div>
                );
              }

              const twoCol = artist.worksGrid === 2;
              return (
                <div className={`grid gap-px bg-[#d4e8da] ${twoCol ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
                  {works.map((work, index) => {
                    const isFeatured = !twoCol && index === 0 && work.orientation === 'landscape';
                    return (
                      <Link
                        key={work.id}
                        href={`/shop/${work.id}`}
                        className={`group bg-[#F6F4EB] overflow-hidden block${isFeatured ? ' col-span-2 lg:col-span-3' : ''}`}
                      >
                        <div className={`relative overflow-hidden bg-[#e8f0eb]${twoCol ? ' aspect-[3/2]' : isFeatured ? ' aspect-[3/2]' : ' aspect-[4/5]'}`}>
                          <Image
                            src={work.images[0]}
                            alt={work.title}
                            fill
                            className={`${twoCol ? 'object-cover' : isFeatured ? 'object-cover' : work.orientation === 'landscape' || work.orientation === 'square' ? 'object-contain' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
                            sizes={twoCol ? '50vw' : isFeatured ? '100vw' : '(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw'}
                          />
                          {work.isSold && (
                            <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1">Sold</div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-base font-normal text-[#268042] mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{work.title}</h3>
                          {work.dimensions && <p className="text-xs text-[#9A9A9A] mb-2">{work.dimensions}</p>}
                          <p className="text-sm text-[#4A4A4A]">
                            {work.isSold ? "Sold Out" : (work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}
