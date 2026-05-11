"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArtistVideo } from "@/lib/mockData";

/** YouTube watch URL / 단축 URL에서 11자리 영상 ID 추출 */
function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg">
      <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.2" />
      <polygon points="10,8 10,16 17,12" fill="white" />
    </svg>
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

function VideoCard({
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

  const thumbSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/${
        useFallbackThumb ? "maxresdefault" : "hqdefault"
      }.jpg`
    : (video.thumbnail ?? null);

  return (
    <Link
      href={`/artists/${video.artistSlug}`}
      className={`relative overflow-hidden group cursor-pointer bg-[#e8f0eb] block ${className}`}
    >
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-[#e8f0eb] animate-pulse z-10 pointer-events-none" />
      )}

      {!imgError && thumbSrc && (
        <Image
          src={thumbSrc}
          alt={video.title}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-[1.03] ${
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
        <div className="absolute inset-0 bg-[#e8f0eb] flex flex-col items-center justify-center gap-2 px-4">
          <FilmIcon className="w-8 h-8 text-[#5a9e72]" />
          <p
            className="text-[10px] tracking-[0.2em] uppercase text-[#5a9e72] text-center mt-1"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {video.artistName}
          </p>
          <p
            className="text-[11px] font-semibold text-[#268042] text-center leading-snug"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {video.title}
          </p>
          {youtubeId && (
            <div className="mt-2 opacity-50">
              <PlayIcon />
            </div>
          )}
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
          <PlayIcon />
        </div>
      </div>

      {imgLoaded && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent">
          <p
            className="text-[10px] tracking-[0.2em] uppercase text-white/70 mb-0.5"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {video.artistName}
          </p>
          <p
            className="text-[12px] font-semibold text-white leading-tight"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {video.title}
          </p>
        </div>
      )}

      <div className="absolute top-3 right-3 z-20">
        <span
          className={`text-[10px] tracking-[0.1em] px-1.5 py-0.5 ${
            imgLoaded
              ? "text-white/80 bg-black/40"
              : "text-[#5a9e72] bg-[#d4e8da]"
          }`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {video.duration}
        </span>
      </div>
    </Link>
  );
}

export default function VideoGrid({ videos }: { videos: ArtistVideo[] }) {
  const featured = videos[0];
  const bottomLeft = videos[1];
  const tall = videos[2];

  return (
    <section className="max-w-[65vw] mx-auto pb-24 md:pb-36">
      <div className="mb-6">
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-[#268042]"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 700 }}
        >
          Watch
        </p>
      </div>

      <VideoCard video={featured} className="w-full aspect-video" />

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2.5 mt-2.5">
        <VideoCard video={bottomLeft} className="aspect-video" />
        <VideoCard video={tall} className="aspect-video md:aspect-auto" />
      </div>
    </section>
  );
}
