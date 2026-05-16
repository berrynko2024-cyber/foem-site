"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/mockData";

const DISPLAY_COUNT = 6;
const INTERVAL_MS = 10000;
const FADE_OUT_MS = 2000;
const EXCHANGE_MS = 3000;

export default function WorksGrid({ items }: { items: Artwork[] }) {
  const [displayed, setDisplayed] = useState<Artwork[]>(() => items.slice(0, DISPLAY_COUNT));
  const [fadingIdx, setFadingIdx] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const swapPos = Math.floor(Math.random() * DISPLAY_COUNT);
      setFadingIdx(swapPos);

      // 페이드 아웃 완료 후 작품 교체 (opacity 0인 상태에서 교체)
      setTimeout(() => {
        setDisplayed(prev => {
          const currentIds = new Set(prev.map(a => a.id));
          const pool = items.filter(a => !currentIds.has(a.id));
          if (pool.length === 0) return prev;
          const next = [...prev];
          next[swapPos] = pool[Math.floor(Math.random() * pool.length)];
          return next;
        });
      }, FADE_OUT_MS);

      // 교체 대기 후 페이드 인
      setTimeout(() => setFadingIdx(null), FADE_OUT_MS + EXCHANGE_MS);
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [items]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#d4e8da]">
      {displayed.map((artwork, idx) => (
        <Link
          key={idx}
          href={`/shop/${artwork.id}`}
          className={`group relative overflow-hidden bg-[#F6F4EB] aspect-square transition-opacity duration-[2000ms] ${
            fadingIdx === idx ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={artwork.images[0]}
            alt={artwork.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/70 mb-0.5">
              {artwork.artistName}
            </p>
            <p
              className="text-[12px] font-normal text-white leading-snug"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {artwork.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
