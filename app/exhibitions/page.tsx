import { Metadata } from "next";
import Image from "next/image";
import { exhibitions, type Exhibition } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "Exhibitions",
  description: "Explore current, upcoming, and past exhibitions by FOEM artists.",
  openGraph: {
    title: "Exhibitions — FOEM",
    description: "Current, upcoming, and past exhibitions by FOEM artists.",
    url: "https://www.foem.co.kr/exhibitions",
  },
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const yearFmt = new Intl.DateTimeFormat("en-US", { year: "numeric" });
  return `${monthFmt.format(s)} – ${monthFmt.format(e)}, ${yearFmt.format(e)}`;
}

function ExhibitionCard({ ex }: { ex: Exhibition }) {
  const cardContent = (
    <>
      <div className={`relative overflow-hidden bg-[#e8f0eb] mb-5 ${
        ex.orientation === 'portrait' ? 'aspect-[4/5]' :
        ex.orientation === 'square' ? 'aspect-square' : 'aspect-[4/3]'
      }`}>
        <Image
          src={ex.coverImage}
          alt={ex.title}
          fill
          className={`transition-transform duration-700 group-hover:scale-[1.03] ${
            ex.orientation === 'portrait' ? 'object-contain' : 'object-cover'
          }`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {ex.status === "upcoming" && (
          <div className="absolute top-3 left-3 bg-[#268042] text-[#F6F4EB] text-[10px] tracking-[0.15em] uppercase px-3 py-1">
            Upcoming
          </div>
        )}
        {ex.videoUrl && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-2xl font-light">
              ↗
            </span>
          </div>
        )}
      </div>
      <p className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] mb-3">
        {ex.artists.join(", ")}
      </p>
      <h3
        className="text-3xl md:text-4xl font-bold uppercase text-[#268042] mb-3 leading-[1.1] group-hover:text-[#1a5c30] transition-colors"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {ex.title}
      </h3>
      <p className="text-sm text-[#9A9A9A] mb-1">
        {ex.venue ? `${ex.venue} · ` : ""}{ex.location}
      </p>
      <p className="text-sm text-[#9A9A9A]">
        {formatDateRange(ex.startDate, ex.endDate)}
      </p>
      {ex.description && (
        <p className="text-base text-[#4A4A4A] leading-relaxed mt-4">
          {ex.description}
        </p>
      )}
    </>
  );

  if (ex.videoUrl) {
    return (
      <a
        href={ex.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group cursor-pointer block"
      >
        {cardContent}
      </a>
    );
  }

  return <div className="group cursor-default">{cardContent}</div>;
}

export default function ExhibitionsPage() {
  const sorted = [...exhibitions].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="bg-[#F6F4EB] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">

        <div className="mb-14">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-4">
            FOEM
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold uppercase text-[#1A1A1A] leading-[1.0]"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Exhibitions
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {sorted.map((ex) => (
            <ExhibitionCard key={ex.id} ex={ex} />
          ))}
        </div>

      </div>
    </div>
  );
}
