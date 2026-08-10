import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Artwork, getArtistBySlug, getArtworksByArtist, getVideosByArtist } from "@/lib/mockData";
import VideoPlayer from "@/components/VideoPlayer";
import { supabase, mapDbArtworkToArtwork, mapDbArtistToArtist } from "@/lib/supabase";
import { getBlurDataUrl } from "@/lib/blurUrl";
import NaturalImage from "@/components/NaturalImage";

// 어드민에서 작품을 등록/수정/삭제하면 재배포 없이 바로 반영되도록 정적 캐싱을 끈다.
export const dynamic = "force-dynamic";

/**
 * 전시회 스타일 작품 타일 — 행 높이를 고정하고 폭은 NaturalImage가 실측한 원본
 * 비율만큼만 늘어난다. 크롭 없이 작품마다 실제 비율 차이가 폭 차이로만 드러난다.
 */
function WorkTile({ work, heightClassName }: { work: Artwork; heightClassName?: string }) {
  return (
    <Link href={`/shop/${work.id}`} className="group flex flex-col items-start">
      <div className="relative bg-[#e8f0eb]">
        <NaturalImage
          src={work.images[0]}
          alt={work.title}
          orientation={work.orientation}
          heightClassName={heightClassName}
          sizes="300px"
        />
        {work.isSold && (
          <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1 z-10">
            Sold
          </div>
        )}
      </div>
      <div className="pt-5 w-full">
        <h3 className="text-base font-normal text-[#268042] mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
          {work.title}
        </h3>
        {work.title_ko && work.title_ko !== work.title && (
          <p className="text-xs text-[#9A9A9A] mb-1">{work.title_ko}</p>
        )}
        {work.dimensions && <p className="text-xs text-[#9A9A9A] mb-2">{work.dimensions}</p>}
        {(work.isSold || work.priceDisplay || work.price > 0) && (
          <p className="text-sm text-[#4A4A4A]">
            {work.isSold ? "Sold Out" : (work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`)}
          </p>
        )}
      </div>
    </Link>
  );
}

async function getArtist(slug: string) {
  const { data } = await supabase.from("artists").select("*").eq("slug", slug).maybeSingle();
  if (data) return mapDbArtistToArtist(data);
  return getArtistBySlug(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtist(slug);
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
    alternates: {
      canonical: `https://www.foem.co.kr/artists/${slug}`,
    },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = await getArtist(slug);

  if (!artist) notFound();

  // Supabase DB에서 해당 작가의 작품 조회
  const { data: dbArtworks } = await supabase
    .from("artworks")
    .select("*")
    .eq("artist_id", artist.id);

  const mappedDbArtworks = dbArtworks ? dbArtworks.map(mapDbArtworkToArtwork) : [];
  const allWorks = mappedDbArtworks.length > 0 ? (mappedDbArtworks as Artwork[]) : [...getArtworksByArtist(artist.id)];

  const hasSeries = allWorks.some(w => w.series);
  const works = artist.id === 'a8'
    ? allWorks.reverse()
    : hasSeries
      ? allWorks
      : allWorks.reverse().slice(0, 6);
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
              style={artist.photoFilter ? { filter: artist.photoFilter } : undefined}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={getBlurDataUrl(artist.photo)}
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

            {!artist.statement && (
              <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">{artist.bio}</p>
            )}
            {artist.statement && (
              <div className="mb-8 pt-6 border-t border-[#d4e8da]">
                <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">{artist.statement}</p>
                {artist.statement_ko && (
                  <p className="text-sm text-[#9A9A9A] leading-relaxed">{artist.statement_ko}</p>
                )}
              </div>
            )}

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

            {/* 시리즈 그룹 렌더링 */}
            {hasSeries && (() => {
              const groupMap = new Map<string, Artwork[]>();
              for (const w of works) {
                const key = w.series ?? '';
                if (!groupMap.has(key)) groupMap.set(key, []);
                groupMap.get(key)!.push(w);
              }
              return (
                <div className="space-y-16">
                  {[...groupMap.entries()].map(([seriesName, seriesWorks]) => (
                    <div key={seriesName}>
                      {seriesName && (
                        <div className="inline-block bg-[#268042] text-[#F6F4EB] text-[11px] tracking-[0.2em] uppercase px-4 py-2 mb-6">
                          {seriesName}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-x-6 gap-y-12">
                        {seriesWorks.map(w => <WorkTile key={w.id} work={w} />)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* 베티문: 이전 고정 비율 그리드로 복구 (worksGrid:2라 항상 object-cover라 크롭 문제 없음) */}
            {!hasSeries && artist.id === 'a1' && (() => {
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
                            className={`${twoCol ? 'object-cover' : isFeatured ? 'object-cover' : (work.orientation === 'landscape' || work.orientation === 'square') && !work.fillFrame ? 'object-contain' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
                            sizes={twoCol ? '50vw' : isFeatured ? '100vw' : '(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw'}
                            placeholder="blur"
                            blurDataURL={getBlurDataUrl(work.images[0])}
                          />
                          {work.isSold && (
                            <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1">Sold</div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-base font-normal text-[#268042] mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{work.title}</h3>
                          {work.dimensions && <p className="text-xs text-[#9A9A9A] mb-2">{work.dimensions}</p>}
                          {(work.isSold || work.priceDisplay || work.price > 0) && (
                            <p className="text-sm text-[#4A4A4A]">
                              {work.isSold ? "Sold Out" : (work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`)}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              );
            })()}

            {/* 나머지 작가(박성은 포함): 전시회 스타일 통일 그리드, 크롭 없음 */}
            {!hasSeries && artist.id !== 'a1' && (() => {
              const twoCol = artist.worksGrid === 2;
              const heightClassName = twoCol
                ? "h-[280px] sm:h-[360px] lg:h-[440px]"
                : "h-[220px] sm:h-[260px] lg:h-[320px]";

              let orderedWorks = works;
              if (artist.worksLayout === 'portrait3-mixed') {
                const rawPortraits = works.filter(w => !w.orientation || w.orientation === 'portrait');
                const rest = works.filter(w => w.orientation && w.orientation !== 'portrait');
                const portraits = rawPortraits.length === 3
                  ? [rawPortraits[1], rawPortraits[0], rawPortraits[2]]
                  : rawPortraits;
                orderedWorks = [...portraits, ...rest];
              }

              return (
                <div className="flex flex-wrap gap-x-6 gap-y-12">
                  {orderedWorks.map(work => (
                    <WorkTile key={work.id} work={work} heightClassName={heightClassName} />
                  ))}
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
}
