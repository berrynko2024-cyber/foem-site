import Link from "next/link";
import Image from "next/image";
import { artists } from "@/lib/mockData";

export default function ArtistsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-14">
        <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">FOEM</p>
        <h1
          className="text-6xl md:text-8xl font-bold uppercase text-[#1A1A1A] leading-[1.0]"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Artists
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E8E6E2]">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artists/${artist.slug}`}
            className="group bg-[#F5F3EF] overflow-hidden block"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#E8E6E2]">
              <Image
                src={artist.photo}
                alt={artist.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-6">
              <h2
                className="text-xl font-normal text-[#1A1A1A] mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {artist.name}
              </h2>
              <p className="text-sm text-[#4A4A4A] leading-relaxed line-clamp-2 mb-3">
                {artist.bio}
              </p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A]">
                {artist.artworkCount} works available
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
