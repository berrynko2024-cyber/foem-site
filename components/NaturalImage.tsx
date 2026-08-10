"use client";

import { useState } from "react";
import { getBlurDataUrl, getOptimizedUrl } from "@/lib/blurUrl";

/**
 * 크롭 없이 원본 비율 그대로 보여주는 이미지. next/image의 fill 방식은 컨테이너 비율을
 * 미리 고정해야 해서 크롭이 생기므로 쓰지 않는다. 대신 블러 썸네일(w=32)을 먼저
 * w-full h-auto로 그려 컨테이너 높이를 원본과 동일한 비율로 잡고, 그 위에 실제
 * 이미지를 절대 위치로 겹쳐 로드되면 페이드인한다 — 두 이미지 모두 같은 원본을
 * 리사이즈한 것이라 비율이 항상 일치해 잘리는 부분이 없다.
 */
export default function NaturalImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 50vw, 33vw",
  hoverZoom = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  hoverZoom?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getBlurDataUrl(src)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="w-full h-auto block scale-105 blur-md"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getOptimizedUrl(src, 1080)}
        srcSet={`${getOptimizedUrl(src, 640)} 640w, ${getOptimizedUrl(src, 1080)} 1080w, ${getOptimizedUrl(src, 1920)} 1920w`}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${hoverZoom ? "group-hover:scale-[1.03]" : ""}`}
      />
    </div>
  );
}
