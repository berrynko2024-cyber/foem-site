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

// 규칙: orientation → col-span, aspect-ratio, 잘림 없음
function getGridClass(orientation?: Artwork["orientation"]): string {
  if (orientation === "landscape") return "col-span-12 sm:col-span-8";
  if (orientation === "square")    return "col-span-6";
  return "col-span-6 sm:col-span-4"; // portrait / 미지정
}

function getAspectClass(orientation?: Artwork["orientation"]): string {
  if (orientation === "landscape") return "aspect-[3/2]";
  if (orientation === "square")    return "aspect-square";
  return "aspect-[3/4]";
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? artworks
      : artworks.filter((a) => a.category === activeCategory);

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

      {/* Grid — orientation 규칙 + CSS dense 자동 채움 */}
      {filtered.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-[#9A9A9A] text-sm">No works in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-12 grid-flow-dense gap-px bg-[#E8E6E2]">
          {filtered.map((work) => (
            <Link
              key={work.id}
              href={`/shop/${work.id}`}
              className={`${getGridClass(work.orientation)} group bg-[#F5F3EF] block overflow-hidden`}
            >
              <div className={`relative ${getAspectClass(work.orientation)} bg-[#E8E6E2] overflow-hidden`}>
                <Image
                  src={work.images[0]}
                  alt={work.title}
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 30vw"
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
      )}
    </div>
  );
}
