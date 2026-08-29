import { Metadata } from "next";
import { artistVideos } from "@/lib/mockData";
import { VideoCard } from "@/components/VideoGrid";

export const metadata: Metadata = {
  title: "Video",
  description: "Watch artist films and studio videos from FOEM artists.",
  openGraph: {
    title: "Video — FOEM",
    description: "Artist films and studio videos from FOEM.",
    url: "https://www.foem.co.kr/video",
  },
  alternates: {
    canonical: "https://www.foem.co.kr/video",
  },
};

export default function VideoPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-14">
        <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">FOEM</p>
        <h1
          className="text-6xl md:text-8xl font-bold uppercase text-[#1A1A1A] leading-[1.0]"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Video
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artistVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
