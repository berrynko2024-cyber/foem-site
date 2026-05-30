"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { artworks, type Artwork } from "@/lib/mockData";

const categories = [
  { value: "all",      label: "All" },
  { value: "photo",    label: "Photography" },
  { value: "painting", label: "Painting" },
  { value: "craft",    label: "Craft" },
];

// ── Layout helpers ──────────────────────────────────────────────

type RowItem = { work: Artwork; colSpan: 4 | 6 | 8 | 12 };

function buildRows(works: Artwork[]): RowItem[][] {
  const rows: RowItem[][] = [];
  const pool = [...works];

  while (pool.length > 0) {
    const first = pool[0];

    if (first.orientation === "landscape") {
      // 가로: 가까운 세로/정방형과 8+4 페어링 시도
      const pairIdx = pool.slice(1, 4).findIndex(w => w.orientation !== "landscape");
      if (pairIdx >= 0) {
        const pair = pool.splice(1 + pairIdx, 1)[0];
        pool.shift();
        rows.push([{ work: first, colSpan: 8 }, { work: pair, colSpan: 4 }]);
      } else if (pool.length >= 2) {
        // 가로+가로 → 6+6
        const second = pool.splice(1, 1)[0];
        pool.shift();
        rows.push([{ work: first, colSpan: 6 }, { work: second, colSpan: 6 }]);
      } else {
        pool.shift();
        rows.push([{ work: first, colSpan: 12 }]);
      }
    } else {
      // 세로/정방형: 가까운 가로와 4+8 페어링 시도
      const landscapeIdx = pool.slice(1, 4).findIndex(w => w.orientation === "landscape");
      if (landscapeIdx >= 0) {
        const landscape = pool.splice(1 + landscapeIdx, 1)[0];
        pool.shift();
        rows.push([{ work: first, colSpan: 4 }, { work: landscape, colSpan: 8 }]);
      } else {
        // 비가로끼리 최대 3개 묶기
        const group: Artwork[] = [pool.shift()!];
        while (group.length < 3 && pool.length > 0 && pool[0].orientation !== "landscape") {
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
  if (orientation === "landscape") return "aspect-[3/2]";
  if (orientation === "square")    return "aspect-square";
  return "aspect-[3/4]";
}

const colSpanClass: Record<4 | 6 | 8 | 12, string> = {
  4:  "col-span-12 sm:col-span-4",
  6:  "col-span-12 sm:col-span-6",
  8:  "col-span-12 sm:col-span-8",
  12: "col-span-12",
};

// ── Component ───────────────────────────────────────────────────

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? artworks
      : artworks.filter((a) => a.category === activeCategory);

  const rows = buildRows(filtered);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-14">
        <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">
          FOEM Shop
        </p>
        <h1
          className="text-6xl md:text-8xl font-bold uppercase text-[#1A1A1A] leading-[1.0]"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          All works
        </h1>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-0 mb-12 border-b border-[#E8E6E2]">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`text-xs tracking-[0.15em] uppercase px-5 py-3 border-b-[1.5px] transition-all duration-200 focus:outline-none ${
              activeCategory === cat.value
                ? "border-[#1A1A1A] text-[#1A1A1A]"
                : "border-transparent text-[#9A9A9A] hover:text-[#4A4A4A]"
            }`}
          >
            {cat.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-[#9A9A9A] pb-3">
          {filtered.length} work{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-[#9A9A9A] text-sm">No works in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-px">
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-12 gap-px bg-[#E8E6E2]">
              {row.map(({ work, colSpan }) => (
                <Link
                  key={work.id}
                  href={`/shop/${work.id}`}
                  className={`${colSpanClass[colSpan]} group bg-[#F5F3EF] block overflow-hidden`}
                >
                  <div className={`relative ${getAspectClass(work.orientation)} bg-[#E8E6E2] overflow-hidden`}>
                    <Image
                      src={work.images[0]}
                      alt={work.title}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {work.isSold && (
                      <div className="absolute top-3 left-3 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1">
                        Sold
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-1">
                      {work.artistName} · {work.year}
                    </p>
                    <h3
                      className="text-base font-normal text-[#1A1A1A] mb-1 group-hover:text-[#4A4A4A] transition-colors"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {work.title}
                    </h3>
                    {work.dimensions && (
                      <p className="text-xs text-[#9A9A9A] mb-2">{work.dimensions}</p>
                    )}
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {work.isSold
                        ? "Sold Out"
                        : (work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
