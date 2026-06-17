import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artFairs, artworks, getArtworkById } from "@/lib/mockData";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return artFairs.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const fair = artFairs.find((f) => f.id === id);
  if (!fair) return {};
  return {
    title: `${fair.name} — FOEM`,
    description: fair.description ?? `FOEM at ${fair.name}, ${fair.location}.`,
    openGraph: {
      title: `${fair.name} — FOEM`,
      description: fair.description ?? `FOEM at ${fair.name}, ${fair.location}.`,
      images: [{ url: fair.coverImage }],
    },
    alternates: {
      canonical: `https://www.foem.co.kr/art-fair/${id}`,
    },
  };
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" });
  const yearFmt = new Intl.DateTimeFormat("en-US", { year: "numeric" });
  return `${monthFmt.format(s)} – ${monthFmt.format(e)}, ${yearFmt.format(e)}`;
}

function formatDate(date: string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(d);
}

const STATUS_LABEL: Record<string, string> = {
  upcoming: "Upcoming",
  current: "On Now",
  past: "Past",
};

const STATUS_COLOR: Record<string, string> = {
  upcoming: "text-[#268042] border-[#268042]",
  current: "text-[#1A5C30] border-[#1A5C30] bg-[#e8f5ee]",
  past: "text-[#9A9A9A] border-[#9A9A9A]",
};

export default async function ArtFairDetailPage({ params }: Props) {
  const { id } = await params;
  const fair = artFairs.find((f) => f.id === id);
  if (!fair) notFound();

  const featuredWorks = (fair.artworkIds ?? [])
    .map((wid) => getArtworkById(wid))
    .filter(Boolean)
    .filter((w) => w!.images[0].startsWith("/artworks/"));

  return (
    <div className="bg-[#F6F4EB] min-h-screen">

      {/* Hero */}
      <div className="relative w-full h-screen bg-[#1A1A1A] overflow-hidden">
        <Image
          src={fair.coverImage}
          alt={fair.name}
          fill
          className="object-contain object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/art-fair"
            className="text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
          >
            ← Art Fair
          </Link>
        </div>
        <div className="absolute bottom-10 left-0 right-0 px-8 z-10">
          <span className={`inline-block text-[10px] tracking-[0.2em] uppercase border px-3 py-1 mb-4 ${STATUS_COLOR[fair.status]}`}>
            {STATUS_LABEL[fair.status]}
          </span>
          <h1
            className="text-4xl md:text-6xl font-bold uppercase text-white leading-[0.95] max-w-3xl"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {fair.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-20">

          {/* Left: Details */}
          <div className="lg:col-span-1">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-5">Fair Details</p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-1">Venue</p>
                <p className="text-[#1A1A1A]">{fair.venue}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-1">Location</p>
                <p className="text-[#1A1A1A]">{fair.location}</p>
              </div>
              {fair.boothNumber && (
                <div>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-1">Booth</p>
                  <p className="text-[#1A1A1A]">{fair.boothNumber}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-1">Dates</p>
                <p className="text-[#1A1A1A]">{formatDateRange(fair.startDate, fair.endDate)}</p>
              </div>
              {fair.previewDate && (
                <div>
                  <p className="text-[10px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-1">VIP Preview</p>
                  <p className="text-[#1A1A1A]">{formatDate(fair.previewDate)}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-1">Artists</p>
                <p className="text-[#1A1A1A]">{fair.artists.join(", ")}</p>
              </div>
            </div>
          </div>

          {/* Right: Description */}
          <div className="lg:col-span-2">
            {fair.description && (
              <>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-5">About</p>
                <p className="text-[1.05rem] text-[#3A3A3A] leading-[1.85]">
                  {fair.description}
                </p>
              </>
            )}

            {!fair.description && (
              <p className="text-[1.05rem] text-[#3A3A3A] leading-[1.85]">
                FOEM participates in {fair.name}, presenting carefully selected works by {fair.artists.join(", ")}.
              </p>
            )}
          </div>
        </div>

        {/* Featured works */}
        {featuredWorks.length > 0 && (
          <div className="mt-20 pt-16 border-t border-[#d4e8da]">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-8">
              Works Presented
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#d4e8da]">
              {featuredWorks.map((work) => {
                if (!work) return null;
                const isWide = work.orientation === "landscape";
                return (
                  <Link
                    key={work.id}
                    href={`/shop/${work.id}`}
                    className="group bg-[#F6F4EB] overflow-hidden block"
                  >
                    <div
                      className="relative overflow-hidden bg-[#e8f0eb]"
                      style={{ aspectRatio: isWide ? "3/2" : work.orientation === "square" ? "1/1" : "4/5" }}
                    >
                      <Image
                        src={work.images[0]}
                        alt={work.title}
                        fill
                        className={`${isWide || work.orientation === "square" ? "object-contain" : "object-cover"} transition-transform duration-700 group-hover:scale-[1.03]`}
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      {work.isSold && (
                        <div className="absolute top-2 left-2 bg-[#1A1A1A] text-[#F6F4EB] text-[10px] tracking-[0.1em] uppercase px-2 py-0.5">
                          Sold
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-0.5">
                        {work.artistName}
                      </p>
                      <h3
                        className="text-sm font-normal text-[#1A1A1A] mb-1 group-hover:text-[#268042] transition-colors"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {work.title}
                      </h3>
                      <p className="text-xs text-[#9A9A9A]">
                        {work.isSold ? "Sold Out" : work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Other fairs */}
        <div className="mt-20 pt-16 border-t border-[#d4e8da]">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A]">Other Art Fairs</p>
            <Link
              href="/art-fair"
              className="text-[11px] tracking-[0.15em] uppercase text-[#268042] hover:text-[#1a5c30] transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {artFairs
              .filter((f) => f.id !== fair.id)
              .slice(0, 3)
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/art-fair/${f.id}`}
                  className="group flex gap-4 items-start"
                >
                  <div className="relative w-20 h-14 flex-shrink-0 overflow-hidden bg-[#e8f0eb]">
                    <Image
                      src={f.coverImage}
                      alt={f.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#1A1A1A] group-hover:text-[#268042] transition-colors leading-tight">
                      {f.name}
                    </p>
                    <p className="text-[11px] text-[#9A9A9A] mt-0.5">{f.location}</p>
                    <span className={`text-[10px] tracking-[0.1em] uppercase mt-1 inline-block ${
                      f.status === "current" ? "text-[#268042]" :
                      f.status === "upcoming" ? "text-[#268042]" : "text-[#9A9A9A]"
                    }`}>
                      {STATUS_LABEL[f.status]}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
