import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
  return (
    <Link href={`/exhibitions/${ex.id}`} className="group cursor-pointer block">
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
        className="text-3xl md:text-4xl font-bold uppercase text-[#268042] mb-1 leading-[1.1] group-hover:text-[#1a5c30] transition-colors"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {ex.title}
      </h3>
      {ex.titleEn && (
        <p
          className="text-lg md:text-xl font-bold uppercase text-[#5a9e72] mb-3 leading-[1.1]"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {ex.titleEn}
        </p>
      )}
      <p className="text-sm text-[#9A9A9A] mb-1">
        {ex.venue ? `${ex.venue} · ` : ""}{ex.location}
      </p>
      <p className="text-sm text-[#9A9A9A]">
        {formatDateRange(ex.startDate, ex.endDate)}
      </p>
    </Link>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="col-span-full flex items-center gap-4 mb-2">
      <span className="text-[10px] tracking-[0.3em] uppercase text-[#9A9A9A]">{label}</span>
      <div className="flex-1 h-px bg-[#d4e8da]" />
    </div>
  );
}

export default function ExhibitionsPage() {
  const byDate = (a: Exhibition, b: Exhibition) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime();

  const current  = exhibitions.filter(e => e.status === "current").sort(byDate);
  const upcoming = exhibitions.filter(e => e.status === "upcoming").sort(byDate);
  const past     = exhibitions.filter(e => e.status === "past").sort(byDate);

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
          {current.length > 0 && (
            <>
              <SectionLabel label="Current" />
              {current.map(ex => <ExhibitionCard key={ex.id} ex={ex} />)}
            </>
          )}
          {upcoming.length > 0 && (
            <>
              <SectionLabel label="Upcoming" />
              {upcoming.map(ex => <ExhibitionCard key={ex.id} ex={ex} />)}
            </>
          )}
          {past.length > 0 && (
            <>
              <SectionLabel label="Past" />
              {past.map(ex => <ExhibitionCard key={ex.id} ex={ex} />)}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
