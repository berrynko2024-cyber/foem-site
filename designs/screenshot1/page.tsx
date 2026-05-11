import Link from "next/link";
import Image from "next/image";
import { artworks, artists } from "@/lib/mockData";

export default function HomePage() {
  const galleryItems = artworks.slice(0, 5);
  const featuredArtists = artists;

  return (
    <div>
      {/* Hero — split layout */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-8 md:pt-20 md:pb-12">
        <div className="flex flex-col md:flex-row md:items-end min-h-[65vh]">
          {/* Left: small description + scroll */}
          <div className="md:w-[35%] flex flex-col justify-end pb-4 mb-12 md:mb-0">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A] leading-relaxed mb-10 max-w-[220px]">
              A global platform connecting independent artists and collectors worldwide.
            </p>
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#9A9A9A]">Scroll</span>
          </div>

          {/* Right: massive headline */}
          <div className="md:w-[65%] flex items-end justify-end">
            <h1
              className="text-[22vw] md:text-[17vw] leading-[0.86] text-[#1A1A1A] uppercase text-right"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Field<br />
              of<br />
              Emotions
            </h1>
          </div>
        </div>
      </section>

      {/* Horizontal Image Gallery */}
      <section className="pb-24 md:pb-36">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2.5">
            {galleryItems.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/shop/${artwork.id}`}
                className="group relative flex-1 overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src={artwork.images[0]}
                  alt={artwork.title}
                  fill
                  className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artists Section */}
      <section className="border-t border-[#E5E5E5]">
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
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EFED] mb-4">
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
