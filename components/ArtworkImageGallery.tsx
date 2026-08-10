"use client";

import { useState } from "react";
import Image from "next/image";
import { getBlurDataUrl } from "@/lib/blurUrl";

type Props = {
  images: string[];
  title: string;
  orientation?: "portrait" | "landscape" | "square";
  isSold?: boolean;
  fillFrame?: boolean;
};

export default function ArtworkImageGallery({ images, title, orientation, isSold, fillFrame }: Props) {
  const [selected, setSelected] = useState(0);

  const aspectClass =
    orientation === "landscape"
      ? "aspect-[3/2]"
      : orientation === "square"
      ? "aspect-square"
      : "aspect-[4/5]";

  const fitClass = fillFrame
    ? "object-cover"
    : images.length > 1
    ? "object-contain"
    : orientation === "landscape" || orientation === "square"
    ? "object-contain"
    : "object-cover";

  if (images.length === 1) {
    return (
      <div className={`relative ${aspectClass} bg-[#E8E6E2] overflow-hidden`}>
        <Image
          src={images[0]}
          alt={title}
          fill
          className={fitClass}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={getBlurDataUrl(images[0])}
        />
        {isSold && (
          <div className="absolute top-4 left-4 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1">
            Sold
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 메인 이미지 */}
      <div className={`relative ${aspectClass} bg-[#E8E6E2] overflow-hidden`}>
        <Image
          src={images[selected]}
          alt={`${title} — ${selected + 1}`}
          fill
          className={`${fitClass} transition-opacity duration-300`}
          priority={selected === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={getBlurDataUrl(images[selected])}
        />
        {isSold && (
          <div className="absolute top-4 left-4 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1">
            Sold
          </div>
        )}
      </div>

      {/* 썸네일 스트립 */}
      <div className="flex gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`relative w-16 h-16 shrink-0 bg-[#E8E6E2] overflow-hidden transition-all duration-200 ${
              i === selected
                ? "ring-2 ring-[#268042] ring-offset-1"
                : "opacity-50 hover:opacity-80"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${title} — ${i + 1}`}
              fill
              className="object-cover"
              sizes="64px"
              placeholder="blur"
              blurDataURL={getBlurDataUrl(src)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
