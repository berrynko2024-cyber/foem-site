"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArtistVideo, artists as allArtists } from "@/lib/mockData";

/** YouTube watch URL / 단축 URL에서 11자리 영상 ID 추출 */
function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/** 영상 매체 라벨: 작가의 medium을 캡션 3번째 줄에 표기 */
const MEDIUM_LABEL: Record<string, string> = {
  photography: "Photography",
  painting: "Painting",
  sculpture: "Sculpture",
  glass: "Glass",
};

function artistMedium(artistId: string): string | null {
  const a = allArtists.find((x) => x.id === artistId);
  if (!a?.medium) return null;
  return (
    MEDIUM_LABEL[a.medium] ??
    a.medium.charAt(0).toUpperCase() + a.medium.slice(1)
  );
}

function FilmIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="2" y="6" width="20" height="12" rx="1" />
      <line x1="7" y1="6" x2="7" y2="18" />
      <line x1="17" y1="6" x2="17" y2="18" />
      <line x1="2" y1="10" x2="7" y2="10" />
      <line x1="17" y1="10" x2="22" y2="10" />
      <line x1="2" y1="14" x2="7" y2="14" />
      <line x1="17" y1="14" x2="22" y2="14" />
    </svg>
  );
}

export function VideoCard({
  video,
  className = "",
}: {
  video: ArtistVideo;
  className?: string;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [useFallbackThumb, setUseFallbackThumb] = useState(false);

  const youtubeId = extractYoutubeId(video.url);

  const thumbSrc = video.thumbnail
    ? video.thumbnail
    : youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/${
        useFallbackThumb ? "maxresdefault" : "hqdefault"
      }.jpg`
    : null;

  const medium = artistMedium(video.artistId);

  return (
    <Link
      href={`/artists/${video.artistSlug}`}
      className={`group block ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#e8f0eb]">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-[#e8f0eb] animate-pulse z-10 pointer-events-none" />
        )}

        {!imgError && thumbSrc && (
          <Image
            src={thumbSrc}
            alt={video.title}
            fill
            className={`object-cover transition-opacity duration-500 group-hover:opacity-90 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 768px) 100vw, 50vw"
            onLoad={() => setImgLoaded(true)}
            onError={() => {
              if (!useFallbackThumb && youtubeId) {
                setUseFallbackThumb(true);
              } else {
                setImgError(true);
                setImgLoaded(false);
              }
            }}
          />
        )}

        {(imgError || !thumbSrc) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FilmIcon className="w-8 h-8 text-[#5a9e72]" />
          </div>
        )}
      </div>

      {/* Caption below */}
      <div className="mt-3">
        <p
          className="text-[15px] md:text-base text-[#268042] leading-snug"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 600 }}
        >
          {video.artistName}
        </p>
        <p
          className="text-[13px] md:text-sm text-[#5a9e72] leading-snug mt-0.5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {video.title}
        </p>
        {medium && (
          <p
            className="text-[11px] tracking-[0.08em] uppercase text-[#5a9e72]/70 mt-1.5"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {medium}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function VideoGrid({ videos }: { videos: ArtistVideo[] }) {
  const topRow = videos.slice(0, 3);
  const bottomRow = videos.slice(3, 6);

  if (topRow.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 pb-24 md:pb-36">
      <div className="mb-6">
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-[#268042]"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 700 }}
        >
          Watch
        </p>
      </div>

      {/* Top row — 3 up */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
        {topRow.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>

      {/* Bottom row — 3 up */}
      {bottomRow.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10 mt-10">
          {bottomRow.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}
    </section>
  );
}
