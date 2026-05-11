"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { artworks, type Artwork } from "@/lib/mockData";

const categories = [
  { value: "all", label: "All" },
  { value: "painting", label: "Painting" },
  { value: "photo", label: "Photography" },
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
          className="text-4xl md:text-5xl font-normal text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E8E6E2]">
        {filtered.map((work) => (
          <ArtworkCard key={work.id} work={work} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-32 text-center">
          <p className="text-[#9A9A9A] text-sm">No works in this category yet.</p>
        </div>
      )}
    </div>
  );
}

function ArtworkCard({ work }: { work: Artwork }) {
  return (
    <Link href={`/shop/${work.id}`} className="group bg-[#F5F3EF] overflow-hidden block">
      <div className="relative overflow-hidden bg-[#E8E6E2]" style={{ aspectRatio: "4/5" }}>
        <Image
          src={work.images[0]}
          alt={work.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {work.isSold && (
          <div className="absolute inset-0 bg-[#F5F3EF] bg-opacity-70 flex items-center justify-center">
            <span className="text-xs tracking-[0.2em] uppercase text-[#4A4A4A]">Sold</span>
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
          {work.price.toLocaleString("ko-KR")}원
        </p>
      </div>
    </Link>
  );
}
