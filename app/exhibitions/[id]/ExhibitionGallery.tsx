"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getBlurDataUrl } from "@/lib/blurUrl";

type Photo = {
  src: string;
  caption?: string;
  captionKo?: string;
  orientation?: "portrait" | "landscape" | "square";
};

export function ExhibitionGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => setActive((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next = useCallback(
    () => setActive((i) => (i !== null && i < photos.length - 1 ? i + 1 : i)),
    [photos.length]
  );

  useEffect(() => {
    if (active === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [active, close, prev, next]);

  const current = active !== null ? photos[active] : null;

  return (
    <>
      {/* 3열 정사각형 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group relative aspect-square overflow-hidden bg-[#e8f0eb] cursor-pointer"
          >
            <Image
              src={photo.src}
              alt={`${title} — view ${i + 1}`}
              fill
              className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={getBlurDataUrl(photo.src)}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && current && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center"
          onClick={close}
        >
          {/* 닫기 + 카운터 */}
          <div className="absolute top-5 right-6 flex items-center gap-5 z-10">
            <span className="text-white/40 text-xs tracking-[0.2em]">
              {active + 1} / {photos.length}
            </span>
            <button
              onClick={close}
              className="text-white/60 hover:text-white text-2xl leading-none transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* 이전 */}
          {active > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white text-3xl z-10 transition-colors p-4"
              aria-label="Previous"
            >
              ←
            </button>
          )}

          {/* 이미지 */}
          <div
            className="relative w-[92vw] h-[86vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.src}
              alt={`${title} — view ${active + 1}`}
              fill
              className="object-contain"
              sizes="92vw"
              priority
              placeholder="blur"
              blurDataURL={getBlurDataUrl(current.src)}
            />
          </div>

          {/* 다음 */}
          {active < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white text-3xl z-10 transition-colors p-4"
              aria-label="Next"
            >
              →
            </button>
          )}

          {/* 캡션 */}
          {(current.caption || current.captionKo) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-[580px] px-6 pointer-events-none">
              {current.caption && (
                <p className="text-[11px] text-white/70 leading-relaxed">{current.caption}</p>
              )}
              {current.captionKo && (
                <p className="text-[11px] text-white/50 leading-relaxed mt-1" style={{ wordBreak: "keep-all" }}>
                  {current.captionKo}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
