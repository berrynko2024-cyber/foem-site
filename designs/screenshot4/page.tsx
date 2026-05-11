import Link from "next/link";
import Image from "next/image";
import { artists, artistVideos } from "@/lib/mockData";

export default function HomePage() {
  const featuredArtists = artists;

  return (
    <div>
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden">
        {/* Background oversized text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <span
            className="text-[18vw] font-bold leading-none text-[#1A1A1A] opacity-[0.04] tracking-tight"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            FOEM
          </span>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-end min-h-[50vh]">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-8">
              Field of Emotions
            </p>
            <h1
              className="text-6xl md:text-8xl font-normal leading-[1.0] text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Art that<br />
              moves<br />
              <em>you.</em>
            </h1>
          </div>

          <div className="flex flex-col gap-6 md:pb-4">
            <p className="text-sm text-[#4A4A4A] leading-relaxed max-w-xs">
              FOEM is a platform for independent artists to share and sell original works — paintings, photographs, and handcrafted objects.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/shop"
                className="text-xs tracking-[0.15em] uppercase text-[#1A1A1A] border-b border-[#1A1A1A] pb-0.5 hover:opacity-50 transition-opacity duration-200"
              >
                Browse works
              </Link>
              <Link
                href="/artists"
                className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] border-b border-[#9A9A9A] pb-0.5 hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors duration-200"
              >
                Meet artists
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Artist Videos */}
      <section className="max-w-7xl mx-auto px-6 pb-24 md:pb-36">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A]">
            Artist Films
          </h2>
          <Link
            href="/artists"
            className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors duration-200"
          >
            All artists →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artistVideos.map((video) => (
            <a
              key={video.id}
              href={video.url ?? "#"}
              target={video.url ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-[#1A1A1A] mb-4">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-[1.03] transition-transform"
                />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/60 flex items-center justify-center bg-black/20 group-hover:bg-black/40 group-hover:border-white transition-all duration-300">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Duration */}
                <span className="absolute bottom-3 right-3 text-[10px] text-white/80 bg-black/40 px-1.5 py-0.5 tracking-wide">
                  {video.duration}
                </span>
              </div>

              {/* Meta */}
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-1">
                {video.artistName}
              </p>
              <h3 className="text-sm text-[#1A1A1A] leading-snug group-hover:opacity-60 transition-opacity duration-200">
                {video.title}
              </h3>
            </a>
          ))}
        </div>
      </section>

      {/* Artists Section */}
      <section className="border-t border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="flex items-end justify-between mb-12">
            <h2
              className="text-3xl md:text-4xl font-normal text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              The artists
            </h2>
            <Link
              href="/artists"
              className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors duration-200"
            >
              All artists →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.slug}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E5E0D8] mb-4">
                  <Image
                    src={artist.photo}
                    alt={artist.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <p className="text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-1">
                  {artist.artworkCount} works
                </p>
                <h3
                  className="text-xl font-normal text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {artist.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <p
            className="text-2xl md:text-3xl font-normal text-[#1A1A1A] leading-relaxed"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            &ldquo;Every work on FOEM is an original — made by hand, shaped by feeling, carried by intention.&rdquo;
          </p>
          <div className="mt-8 h-px w-16 bg-[#1A1A1A]" />
        </div>
      </section>
    </div>
  );
}
