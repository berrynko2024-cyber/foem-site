import Image from "next/image";
import { artFairs, type ArtFair } from "@/lib/mockData";

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const yearFmt = new Intl.DateTimeFormat("en-US", { year: "numeric" });
  return `${monthFmt.format(s)} – ${monthFmt.format(e)}, ${yearFmt.format(e)}`;
}

function formatDate(date: string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}

const STATUS_LABEL: Record<ArtFair["status"], string> = {
  upcoming: "Upcoming",
  current: "Current",
  past: "Past",
};

const STATUS_ORDER: Record<ArtFair["status"], number> = {
  current: 0,
  upcoming: 1,
  past: 2,
};

function ArtFairCard({ fair }: { fair: ArtFair }) {
  return (
    <div className="group cursor-default">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e8f0eb] mb-5">
        <Image
          src={fair.coverImage}
          alt={fair.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute top-3 left-3 bg-[#F6F4EB] text-[#268042] text-[10px] tracking-[0.15em] uppercase px-3 py-1">
          {STATUS_LABEL[fair.status]}
        </div>
      </div>
      <p className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] mb-3">
        {fair.artists.join(", ")}
      </p>
      <h3
        className="text-3xl md:text-4xl font-bold uppercase text-[#268042] mb-3 leading-[1.1] group-hover:text-[#1a5c30] transition-colors"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {fair.name}
      </h3>
      <p className="text-sm text-[#9A9A9A] mb-1">
        {fair.venue} · {fair.location}
        {fair.boothNumber && ` · Booth ${fair.boothNumber}`}
      </p>
      <p className="text-sm text-[#9A9A9A]">
        {fair.previewDate && `VIP Preview ${formatDate(fair.previewDate)} · `}
        {formatDateRange(fair.startDate, fair.endDate)}
      </p>
      {fair.description && (
        <p className="text-base text-[#4A4A4A] leading-relaxed mt-4">
          {fair.description}
        </p>
      )}
    </div>
  );
}

export default function ArtFairPage() {
  const sorted = [...artFairs].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
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
            Art Fair
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {sorted.map((fair) => (
            <ArtFairCard key={fair.id} fair={fair} />
          ))}
        </div>

      </div>
    </div>
  );
}
