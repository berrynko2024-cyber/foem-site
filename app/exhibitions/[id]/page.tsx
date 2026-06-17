import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exhibitions } from "@/lib/mockData";
import { ExhibitionGallery } from "./ExhibitionGallery";

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
    alternates: {
      canonical: `https://www.foem.co.kr/exhibitions/${id}`,
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

  const hasDescription = ex.description || ex.descriptionKo || ex.videoUrl;

  return (
    <div className="bg-[#F6F4EB] min-h-screen">

      {/* 1. 풀스크린 히어로 */}
      <div className={`relative w-full h-screen bg-[#1A1A1A]`}>
        <Image
          src={ex.heroImage ?? ex.coverImage}
          alt={ex.title}
          fill
          className={`${ex.orientation === "portrait" && !ex.heroImage ? "object-contain" : "object-cover"} object-center`}
          priority
        />
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/exhibitions"
            className="text-[11px] tracking-[0.2em] uppercase transition-colors drop-shadow-sm text-white/70 hover:text-white"
          >
            ← Exhibitions
          </Link>
        </div>
      </div>

      {/* 2. 전시 정보(좌) + 서문(우) */}
      <section className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* 좌: 전시 주제 정보 */}
          <div className="lg:sticky lg:top-24">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#268042] mb-5">
              {statusLabel[ex.status]}
            </p>
            <h1
              className="text-[2.6rem] sm:text-[3.2rem] md:text-[3.8rem] font-bold uppercase text-[#1A1A1A] leading-[0.93] mb-4 tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              {ex.title}
            </h1>
            {ex.titleEn && (
              <p
                className="text-lg sm:text-xl md:text-2xl font-bold uppercase text-[#268042] leading-tight mb-10 tracking-[-0.01em]"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                {ex.titleEn}
              </p>
            )}

            <div className="space-y-2 text-sm text-[#4A4A4A]">
              <div className="flex gap-3">
                <span className="text-[#9A9A9A] w-16 shrink-0">Date</span>
                <span>{formatDateRange(ex.startDate, ex.endDate)}</span>
              </div>
              {ex.venue && (
                <div className="flex gap-3">
                  <span className="text-[#9A9A9A] w-16 shrink-0">Venue</span>
                  <span>{ex.venue}</span>
                </div>
              )}
              <div className="flex gap-3">
                <span className="text-[#9A9A9A] w-16 shrink-0">Location</span>
                <span>{ex.location}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#9A9A9A] w-16 shrink-0">Artists</span>
                <span>{ex.artists.join(", ")}</span>
              </div>
            </div>

            {ex.videoUrl && (
              <div className="mt-10">
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

          {/* 우: 전시 서문 */}
          {hasDescription && (
            <div className="space-y-10">
              {ex.description && (
                <div className="space-y-5 text-[1.02rem] text-[#3A3A3A]">
                  {ex.description.split("\n\n").map((para, i) => (
                    <p key={i} style={{ lineHeight: "1.9", whiteSpace: "pre-line" }}>
                      {para}
                    </p>
                  ))}
                </div>
              )}
              {ex.descriptionKo && (
                <div className="space-y-5 text-[1.02rem] text-[#3A3A3A] border-t border-[#d4e8da] pt-10">
                  {ex.descriptionKo.split("\n\n").map((para, i) => (
                    <p key={i} style={{ lineHeight: "1.9", whiteSpace: "pre-line", wordBreak: "keep-all" }}>
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* 3. 전시 사진 — 3열 정사각형, 클릭 시 원본 보기 */}
      {ex.photos && ex.photos.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 pb-28">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-6">
            Exhibition Views
          </p>
          <ExhibitionGallery
            photos={ex.photos.map((p) =>
              typeof p === "string"
                ? { src: p }
                : { src: p.src, caption: p.caption, captionKo: p.captionKo, orientation: p.orientation }
            )}
            title={ex.title}
          />
        </section>
      )}

    </div>
  );
}
