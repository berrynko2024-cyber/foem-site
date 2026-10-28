import Link from "next/link";
import { type Artwork } from "@/lib/mockData";

function getArtworkPriceDisplay(work: Artwork): string {
  if (work.priceDisplay) return work.priceDisplay;
  if (work.price > 0) return `${work.price.toLocaleString("ko-KR")}원`;
  if (work.isSold) return "Sold Out";
  return "문의";
}

// 샵/메인 공용 작품 카드 — 원본 비율 그대로(크롭 없음) + 제목/가격
export default function ArtworkCard({ work }: { work: Artwork }) {
  return (
    <Link href={`/shop/${work.id}`} className="group block">
      <div className="relative overflow-hidden bg-[#F2F2F2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={work.images[0]}
          alt={work.title}
          loading="lazy"
          className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02]"
        />
        {work.isSold && (
          <div className="absolute top-3 left-3 bg-black text-white text-[11px] tracking-[0.15em] uppercase px-3 py-1 z-10">
            Sold
          </div>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-black">
          {work.title}
        </h3>
        <p className="text-sm uppercase tracking-wide text-[#767676] mt-0.5">
          {getArtworkPriceDisplay(work)}
        </p>
      </div>
    </Link>
  );
}
