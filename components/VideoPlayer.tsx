"use client";

import Image from "next/image";
import { useState } from "react";
import { ArtistVideo } from "@/lib/mockData";

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function VideoPlayer({ video }: { video: ArtistVideo }) {
  const [playing, setPlaying] = useState(false);
  const youtubeId = extractYoutubeId(video.url);
  const thumbSrc = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : null;

  const thumbnail = (
    <>
      {thumbSrc && (
        <Image
          src={thumbSrc}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-70 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
          <svg viewBox="0 0 24 24" className="w-14 h-14 drop-shadow-lg">
            <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.2" />
            <polygon points="10,8 10,16 17,12" fill="white" />
          </svg>
        </div>
      </div>
    </>
  );

  return (
    <div className="group">
      <div className="relative aspect-video bg-[#e8f0eb] overflow-hidden">
        {playing && youtubeId ? (
          <iframe
            key={youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full"
          />
        ) : video.noEmbed ? (
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 w-full h-full cursor-pointer"
            aria-label={`Watch ${video.title} on YouTube`}
          >
            {thumbnail}
          </a>
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full cursor-pointer"
            aria-label={`Play ${video.title}`}
          >
            {thumbnail}
          </button>
        )}
      </div>
      <div className="pt-3">
        <p
          className="text-sm font-normal text-[#268042]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {video.title}
        </p>
        {video.duration && <p className="text-[11px] text-[#5a9e72] mt-1 tracking-wide">{video.duration}</p>}
      </div>
    </div>
  );
}
