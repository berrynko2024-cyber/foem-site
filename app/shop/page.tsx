"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { artworks, type Artwork } from "@/lib/mockData";

const categories = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photography" },
  { value: "painting", label: "Painting" },
  { value: "craft", label: "Craft" },
];

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

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-[#E8E6E2]">
        {sortedWithPadding(filtered).map((work, idx) => {
          if (work === null) {
            return <div key={`empty-${idx}`} className="hidden lg:block lg:col-span-3 bg-[#F5F3EF]" />;
          }
          const isPhoto = work.category === "photo";
          const isLandscapePainting = work.category === "painting" && work.orientation === "landscape";
          const colClass = (isPhoto || isLandscapePainting) ? "col-span-2 lg:col-span-3" : "col-span-1 lg:col-span-2";
          return <ArtworkCard key={work.id} work={work} className={colClass} />;
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-[#9A9A9A] text-sm">No works in this category yet.</p>
        </div>
      )}
    </div>
  );
}

function sortedWithPadding(items: Artwork[]): (Artwork | null)[] {
  const isWide = (a: Artwork) =>
    a.category === "photo" || (a.category === "painting" && a.orientation === "landscape");

  const wideItems = items.filter(isWide);
  const narrowItems = items.filter((a) => !isWide(a));

  const result: (Artwork | null)[] = [...wideItems];
  if (wideItems.length % 2 === 1) result.push(null);
  result.push(...narrowItems);
  return result;
}

function ArtworkCard({ work, className = "" }: { work: Artwork; className?: string }) {
  const isWide = work.category === "photo" || (work.category === "painting" && work.orientation === "landscape");
  return (
    <Link href={`/shop/${work.id}`} className={`group bg-[#F5F3EF] overflow-hidden block ${className}`}>
      <div
        className="relative overflow-hidden bg-[#E8E6E2]"
        style={{ aspectRatio: isWide ? "3/2" : "4/5" }}
      >
        <Image
          src={work.images[0]}
          alt={work.title}
          fill
          className={`${work.orientation === 'square' ? 'object-contain' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
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
          {work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`}
        </p>
      </div>
    </Link>
  );
}
