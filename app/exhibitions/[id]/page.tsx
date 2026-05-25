import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exhibitions } from "@/lib/mockData";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return exhibitions.map((ex) => ({ id: ex.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ex = exhibitions.find((e) => e.id === id);
  if (!ex) return {};
  return {
    title: `${ex.title} — FOEM`,
    description: ex.description ?? `${ex.title} by ${ex.artists.join(", ")}`,
    openGraph: {
      title: `${ex.title} — FOEM`,
      description: ex.description ?? `${ex.title} by ${ex.artists.join(", ")}`,
      images: [{ url: ex.coverImage }],
    },
  };
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const fmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" });
  const year = new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(e);
  return `${fmt.format(s)} – ${fmt.format(e)}, ${year}`;
}

const statusLabel: Record<string, string> = {
  current: "Current Exhibition",
  upcoming: "Upcoming Exhibition",
  past: "Past Exhibition",
};

export default async function ExhibitionDetailPage({ params }: Props) {
  const { id } = await params;
  const ex = exhibitions.find((e) => e.id === id);
  if (!ex) notFound();

  return (
    <div className="bg-[#F6F4EB] min-h-screen">

      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <Link
          href="/exhibitions"
          className="text-[11px] tracking-[0.2em] uppercase text-[#9A9A9A] hover:text-[#268042] transition-colors"
        >
          ← Exhibitions
        </Link>
      </div>

      {/* Title block */}
      <div className="max-w-7xl mx-auto px-6 pb-10 border-b border-[#d4e8da]">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#268042] mb-5">
          {statusLabel[ex.status]}
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase text-[#1A1A1A] leading-[1.0] mb-2"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {ex.title}
        </h1>
        {ex.titleEn && (
          <p
            className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase text-[#5a9e72] leading-[1.0] mb-8"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {ex.titleEn}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[#9A9A9A]">
          <span className="text-[#4A4A4A] font-medium">{ex.artists.join(", ")}</span>
          {ex.venue && <span>{ex.venue}</span>}
          <span>{ex.location}</span>
          <span>{formatDateRange(ex.startDate, ex.endDate)}</span>
        </div>
      </div>

      {/* Poster left / Description right */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: poster */}
          <div className={`relative overflow-hidden bg-[#e8f0eb] w-full ${
            ex.orientation === "portrait" ? "aspect-[3/4]" :
            ex.orientation === "square" ? "aspect-square" :
            "aspect-[4/3]"
          }`}>
            <Image
              src={ex.coverImage}
              alt={ex.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Right: description */}
          <div className="lg:sticky lg:top-24 space-y-10">
            {ex.description && (
              <div className="space-y-4">
                {ex.description.split("\n\n").map((para, i) => (
                  <p key={i} className="text-base md:text-lg text-[#4A4A4A] leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                    {para}
                  </p>
                ))}
              </div>
            )}
            {ex.descriptionKo && (
              <div className="space-y-4 border-t border-[#d4e8da] pt-10">
                {ex.descriptionKo.split("\n\n").map((para, i) => (
                  <p key={i} className="text-base text-[#4A4A4A] leading-relaxed" style={{ whiteSpace: "pre-line", wordBreak: "keep-all" }}>
                    {para}
                  </p>
                ))}
              </div>
            )}
            {ex.videoUrl && (
              <div className="pt-2">
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#268042] border border-[#268042] px-6 py-3 hover:bg-[#268042] hover:text-[#F6F4EB] transition-all duration-200"
                >
                  View Video ↗
                </a>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Photo gallery */}
      {ex.photos && ex.photos.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="border-t border-[#d4e8da] pt-10 mb-8">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A]">
              Exhibition Views
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-8">
            {ex.photos.map((photo, i) => {
              const src = typeof photo === "string" ? photo : photo.src;
              const caption = typeof photo === "string" ? undefined : photo.caption;
              const captionKo = typeof photo === "string" ? undefined : photo.captionKo;
              return (
                <div key={i}>
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#e8f0eb]">
                    <Image
                      src={src}
                      alt={`${ex.title} — ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 45vw"
                    />
                  </div>
                  {(caption || captionKo) && (
                    <div className="mt-3 space-y-1">
                      {caption && (
                        <p className="text-xs text-[#9A9A9A] leading-relaxed">{caption}</p>
                      )}
                      {captionKo && (
                        <p className="text-xs text-[#9A9A9A] leading-relaxed" style={{ wordBreak: "keep-all" }}>{captionKo}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
