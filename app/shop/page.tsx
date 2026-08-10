"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { artworks, type Artwork } from "@/lib/mockData";
import { supabase, mapDbArtworkToArtwork } from "@/lib/supabase";
import NaturalImage from "@/components/NaturalImage";

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
  const [shopArtworks, setShopArtworks] = useState<Artwork[]>(artworks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtworks() {
      try {
        const { data, error } = await supabase
          .from("artworks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch artworks:", error);
          setShopArtworks(artworks);
        } else if (data && data.length > 0) {
          setShopArtworks(data.map(mapDbArtworkToArtwork) as Artwork[]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setShopArtworks(artworks);
      } finally {
        setLoading(false);
      }
    }
    loadArtworks();
  }, []);

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
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">
            FOEM Shop
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold uppercase text-black leading-[1.0]"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            All works
          </h1>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-0 border-b border-[#E5E5E5] mb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-xs tracking-[0.15em] uppercase px-5 py-3 border-b-[1.5px] transition-all duration-200 focus:outline-none ${
                activeCategory === cat.value
                  ? "border-black text-black"
                  : "border-transparent text-[#9A9A9A] hover:text-[#4A4A4A]"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-auto text-xs tracking-[0.15em] uppercase px-4 py-3 pb-4 flex items-center gap-2 transition-colors ${
              hasActiveFilters ? "text-black" : "text-[#9A9A9A] hover:text-[#4A4A4A]"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Filter{hasActiveFilters ? " · On" : ""}
          </button>
          <span className="text-xs text-[#9A9A9A] pb-3 pl-3 border-l border-[#E5E5E5]">
            {filtered.length} work{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Expanded filter panel */}
        {showFilters && (
          <div className="mb-8 p-5 bg-white border border-[#E5E5E5] space-y-5">

            {/* Emotion filter */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">Emotion</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveEmotion("all")}
                  className={`text-xs px-3 py-1 border transition-colors ${
                    activeEmotion === "all"
                      ? "border-black text-white bg-black"
                      : "border-[#D0D0D0] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
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
                        ? "border-black text-white bg-black"
                        : "border-[#D0D0D0] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
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
                      ? "border-black text-white bg-black"
                      : "border-[#D0D0D0] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
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
                        ? "border-black text-white bg-black"
                        : "border-[#D0D0D0] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
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
                        ? "border-black text-white bg-black"
                        : "border-[#D0D0D0] text-[#9A9A9A] hover:border-[#4A4A4A] hover:text-[#4A4A4A]"
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

        {/* Grid — natural aspect ratio, no cropping */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16 items-start">
          {filtered.map((work) => (
            <ArtworkCard key={work.id} work={work} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-32 text-center">
            <p className="text-[#9A9A9A] text-sm mb-3">No works match these filters.</p>
            <button onClick={clearAll} className="text-xs text-black underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ArtworkCard({ work }: { work: Artwork }) {
  return (
    <Link href={`/shop/${work.id}`} className="group block">
      <div className="relative bg-[#F2F2F2]">
        <NaturalImage
          src={work.images[0]}
          alt={work.title}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {work.isSold && (
          <div className="absolute top-3 left-3 bg-black text-white text-[11px] tracking-[0.15em] uppercase px-3 py-1">
            Sold
          </div>
        )}
      </div>
      <div className="pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-black">
          {work.title}
        </h3>
        <p className="text-sm uppercase tracking-wide text-[#767676] mt-0.5">
          {work.isSold ? "Sold Out" : work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`}
        </p>
      </div>
    </Link>
  );
}
