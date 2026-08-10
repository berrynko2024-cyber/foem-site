"use client";

import { useState } from "react";
import { getBlurDataUrl, getOptimizedUrl } from "@/lib/blurUrl";

const DEFAULT_RATIO: Record<string, number> = {
  portrait: 0.8,
  landscape: 1.5,
  square: 1,
};

/**
 * 전시회 스타일 "justified gallery" 타일. 크롭 없이 원본 비율 그대로 보여주되,
 * w-full h-auto로 폭을 그리드 칸에 맞추면(예전 방식) 세로가 긴 작품이 실제 크기와
 * 무관하게 화면에서 훨씬 커 보이는 문제가 있었다. 대신 행 높이(heightClassName)를
 * 고정하고 폭을 실제 비율만큼만 늘려서, 모든 작품이 같은 높이 기준으로 나란히
 * 정렬되고 실제 비율 차이만 폭 차이로 드러나게 한다.
 *
 * 비율은 블러 썸네일(w=32, 용량 작아 거의 즉시 로드됨)의 naturalWidth/naturalHeight를
 * 읽어 실측한다 — DB에 원본 크기를 저장하지 않아도 되므로 스키마 변경이 없다.
 * 측정 전에는 orientation 버킷 기반 추정치로 렌더링하다가 갱신되면 살짝 리사이즈된다.
 */
export default function NaturalImage({
  src,
  alt,
  orientation,
  heightClassName = "h-[220px] sm:h-[260px] lg:h-[300px]",
  sizes = "300px",
  hoverZoom = true,
}: {
  src: string;
  alt: string;
  orientation?: string;
  heightClassName?: string;
  sizes?: string;
  hoverZoom?: boolean;
}) {
  const [ratio, setRatio] = useState(DEFAULT_RATIO[orientation ?? "portrait"] ?? 0.8);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden shrink-0 ${heightClassName}`}
      style={{ aspectRatio: ratio }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={getBlurDataUrl(src)}
        alt=""
        aria-hidden="true"
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth && naturalHeight) setRatio(naturalWidth / naturalHeight);
        }}
        className="absolute inset-0 w-full h-full object-cover scale-105 blur-md"
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
