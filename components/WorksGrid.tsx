"use client";

import { useState, useEffect } from "react";
import type { Artwork } from "@/lib/mockData";
import ArtworkCard from "@/components/ArtworkCard";

const DISPLAY_COUNT = 8;
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
    // 샵 페이지와 동일한 카드/그리드 (원본 비율, 제목+가격)
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 items-start">
      {displayed.map((artwork, idx) => (
        <div
          key={idx}
          className={`transition-opacity duration-[2000ms] ${
            fadingIdx === idx ? "opacity-0" : "opacity-100"
          }`}
        >
          <ArtworkCard work={artwork} />
        </div>
      ))}
    </div>
  );
}
