"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { artworks, artists, type Artwork } from "@/lib/mockData";

const categories = [
  { value: "all", label: "All" },
  { value: "photo", label: "Photography" },
  { value: "painting", label: "Painting" },
  { value: "craft", label: "Craft" },
];

const EMOTION_LABELS: Record<string, string> = {
  stillness: "Stillness",
  memory: "Memory",
  freedom: "Freedom",
  tension: "Tension",
  luminous: "Luminous",
  calm: "Calm",
  nostalgia: "Nostalgia",
  longing: "Longing",
  renewal: "Renewal",
  transcendence: "Transcendence",
  connection: "Connection",
  solitude: "Solitude",
  introspection: "Introspection",
  intimacy: "Intimacy",
  warmth: "Warmth",
  depth: "Depth",
  awe: "Awe",
  joy: "Joy",
  presence: "Presence",
  fragility: "Fragility",
  transparency: "Transparency",
  time: "Time",
  hope: "Hope",
  light: "Light",
  contrast: "Contrast",
};

const PRICE_RANGES = [
  { value: "all", label: "All prices" },
  { value: "under1m", label: "Under ₩1M" },
  { value: "1m-3m", label: "₩1M – ₩3M" },
  { value: "3m-10m", label: "₩3M – ₩10M" },
  { value: "over10m", label: "Over ₩10M" },
  { value: "inquiry", label: "On request" },
];

function priceMatches(work: Artwork, range: string): boolean {
  if (range === "all") return true;
  if (range === "inquiry") return work.priceDisplay === "문의";
  const p = work.price;
  if (range === "under1m") return p > 0 && p < 1000000;
  if (range === "1m-3m") return p >= 1000000 && p < 3000000;
  if (range === "3m-10m") return p >= 3000000 && p < 10000000;
  if (range === "over10m") return p >= 10000000;
  return true;
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeEmotion, setActiveEmotion] = useState<string>("all");
  const [activeArtist, setActiveArtist] = useState<string>("all");
  const [activePriceRange, setActivePriceRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const shopArtworks = artworks;

  const availableEmotions = useMemo(() => {
    const set = new Set<string>();
    shopArtworks.forEach((a) => a.emotions?.forEach((e) => set.add(e)));
    return Array.from(set).sort();
  }, []);

  const availableArtists = useMemo(() => {
    const map = new Map<string, string>();
    shopArtworks.forEach((a) => map.set(a.artistId, a.artistName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  const filtered = useMemo(() => {
    return shopArtworks.filter((a) => {
      if (activeCategory !== "all" && a.category !== activeCategory) return false;
      if (activeEmotion !== "all" && !a.emotions?.includes(activeEmotion)) return false;
      if (activeArtist !== "all" && a.artistId !== activeArtist) return false;
      if (!priceMatches(a, activePriceRange)) return false;
      return true;
    });
  }, [activeCategory, activeEmotion, activeArtist, activePriceRange]);

  const hasActiveFilters =
    activeEmotion !== "all" || activeArtist !== "all" || activePriceRange !== "all";

  function clearAll() {
    setActiveCategory("all");
    setActiveEmotion("all");
    setActiveArtist("all");
    setActivePriceRange("all");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-10">
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

      {/* Category tabs */}
      <div className="flex items-center gap-0 border-b border-[#E8E6E2] mb-4">
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
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`ml-auto text-xs tracking-[0.15em] uppercase px-4 py-3 pb-4 flex items-center gap-2 transition-colors ${
            hasActiveFilters ? "text-[#268042]" : "text-[#9A9A9A] hover:text-[#4A4A4A]"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Filter{hasActiveFilters ? " ·" : ""}
          {hasActiveFilters && <span className="text-[#268042]">On</span>}
        </button>
        <span className="text-xs text-[#9A9A9A] pb-3 pl-3 border-l border-[#E8E6E2]">
          {filtered.length} work{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="mb-8 p-5 bg-[#F5F3EF] border border-[#E8E6E2] space-y-5">

          {/* Emotion filter */}
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">Emotion</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveEmotion("all")}
                className={`text-xs px-3 py-1 border transition-colors ${
                  activeEmotion === "all"
                    ? "border-[#1A1A1A] text-[#1A1A1A] bg-[#1A1A1A] text-[#F5F3EF]"
                    : "border-[#D0CEC9] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
                }`}
              >
                All
              </button>
              {availableEmotions.map((e) => (
                <button
                  key={e}
                  onClick={() => setActiveEmotion(activeEmotion === e ? "all" : e)}
                  className={`text-xs px-3 py-1 border transition-colors capitalize ${
                    activeEmotion === e
                      ? "border-[#268042] text-[#268042] bg-[#e8f5ee]"
                      : "border-[#D0CEC9] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
                  }`}
                >
                  {EMOTION_LABELS[e] ?? e}
                </button>
              ))}
            </div>
          </div>

          {/* Artist filter */}
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">Artist</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveArtist("all")}
                className={`text-xs px-3 py-1 border transition-colors ${
                  activeArtist === "all"
                    ? "border-[#1A1A1A] text-[#1A1A1A] bg-[#1A1A1A] text-[#F5F3EF]"
                    : "border-[#D0CEC9] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
                }`}
              >
                All
              </button>
              {availableArtists.map(({ id, name }) => (
                <button
                  key={id}
                  onClick={() => setActiveArtist(activeArtist === id ? "all" : id)}
                  className={`text-xs px-3 py-1 border transition-colors ${
                    activeArtist === id
                      ? "border-[#268042] text-[#268042] bg-[#e8f5ee]"
                      : "border-[#D0CEC9] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">Price</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setActivePriceRange(activePriceRange === r.value ? "all" : r.value)}
                  className={`text-xs px-3 py-1 border transition-colors ${
                    activePriceRange === r.value
                      ? "border-[#268042] text-[#268042] bg-[#e8f5ee]"
                      : "border-[#D0CEC9] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[#9A9A9A] underline hover:text-[#4A4A4A] transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

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
          <p className="text-[#9A9A9A] text-sm mb-3">No works match these filters.</p>
          <button onClick={clearAll} className="text-xs text-[#268042] underline">
            Clear filters
          </button>
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
          className={`${work.orientation === 'landscape' || work.orientation === 'square' ? 'object-contain' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
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
        {work.emotions && work.emotions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {work.emotions.slice(0, 2).map((e) => (
              <span key={e} className="text-[10px] tracking-[0.08em] text-[#268042] border border-[#d4e8da] px-2 py-0.5 capitalize">
                {e}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm font-medium text-[#1A1A1A]">
          {work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`}
        </p>
      </div>
    </Link>
  );
}
