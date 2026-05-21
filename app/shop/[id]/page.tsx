import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArtworkById, artworks, artists } from "@/lib/mockData";
import ArtworkCTA from "@/components/ArtworkCTA";

export function generateStaticParams() {
  return artworks.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const work = getArtworkById(id);
  if (!work) return {};

  const priceText = work.isSold
    ? "Sold"
    : work.priceDisplay ?? `₩${work.price.toLocaleString()}`;

  return {
    title: `${work.title} — ${work.artistName}`,
    description: `${work.title} by ${work.artistName}. ${work.medium ?? ""} ${work.dimensions ?? ""}. ${priceText}.`.trim(),
    openGraph: {
      title: `${work.title} by ${work.artistName}`,
      description: `${work.medium ?? ""} ${work.dimensions ?? ""}. ${priceText}.`.trim(),
      url: `https://www.foem.co.kr/shop/${id}`,
      images: work.images[0]?.startsWith("/artworks/")
        ? [{ url: work.images[0], alt: work.title }]
        : [],
    },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = getArtworkById(id);

  if (!work) notFound();

  const related = artworks
    .filter((a) => a.category === work.category && a.id !== work.id && a.images[0].startsWith('/artworks/'))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: work.title,
    description: work.description || `${work.title} by ${work.artistName}`,
    image: work.images[0]?.startsWith("/artworks/")
      ? `https://www.foem.co.kr${work.images[0]}`
      : undefined,
    brand: { "@type": "Brand", name: "FOEM" },
    creator: { "@type": "Person", name: work.artistName },
    offers: {
      "@type": "Offer",
      availability: work.isSold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      price: work.isSold ? undefined : work.price,
      priceCurrency: "KRW",
      url: `https://www.foem.co.kr/shop/${id}`,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-10">
          <Link href="/shop" className="hover:text-[#1A1A1A] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <span className="text-[#4A4A4A]">{work.title}</span>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div className={`relative ${work.orientation === 'landscape' ? 'aspect-[3/2]' : work.orientation === 'square' ? 'aspect-square' : 'aspect-[4/5]'} bg-[#E8E6E2] overflow-hidden`}>
            <Image
              src={work.images[0]}
              alt={work.title}
              fill
              className={work.orientation === 'landscape' || work.orientation === 'square' ? 'object-contain' : 'object-cover'}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {work.isSold && (
              <div className="absolute top-4 left-4 bg-[#1A1A1A] text-[#F5F3EF] text-[11px] tracking-[0.15em] uppercase px-3 py-1">
                Sold
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-24">
            <Link
              href={`/artists/${artists.find((a) => a.id === work.artistId)?.slug ?? ""}`}
              className="text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors mb-3 block"
            >
              {work.artistName}
            </Link>

            <h1
              className="text-3xl md:text-4xl font-normal text-[#1A1A1A] mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {work.title}
            </h1>

            <p className="text-2xl font-medium text-[#1A1A1A] mb-8">
              {work.isSold
                ? "Sold Out"
                : work.priceDisplay ?? `${work.price.toLocaleString("ko-KR")}원`}
            </p>

            {/* Metadata */}
            <div className="border-t border-[#E8E6E2] py-6 grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "Year", value: String(work.year) },
                ...(work.medium ? [{ label: "Medium", value: work.medium }] : []),
                ...(work.dimensions ? [{ label: "Dimensions", value: work.dimensions }] : []),
                { label: "Availability", value: work.isSold ? "Sold" : work.stock > 1 ? `${work.stock} available` : "1 of 1" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-1">{label}</p>
                  <p className="text-sm text-[#1A1A1A]">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                {work.description}
              </p>
            </div>

            {/* CTA */}
            <ArtworkCTA work={work} />

            <p className="text-[11px] text-[#9A9A9A] mt-4 text-center">
              Worldwide shipping · Certificate of authenticity included
            </p>
          </div>
        </div>
      </div>

      {/* Related works */}
      {related.length > 0 && (
        <section className="border-t border-[#E8E6E2] bg-[#EFEDE8]">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <h2
              className="text-2xl font-normal text-[#1A1A1A] mb-10"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              More in {work.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#E8E6E2]">
              {related.map((r) => (
                <Link key={r.id} href={`/shop/${r.id}`} className="group bg-[#EFEDE8] overflow-hidden block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#E8E6E2]">
                    <Image
                      src={r.images[0]}
                      alt={r.title}
                      fill
                      className={`${r.orientation === 'landscape' || r.orientation === 'square' ? 'object-contain' : 'object-cover'} transition-transform duration-700 group-hover:scale-[1.03]`}
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-1">{r.artistName}</p>
                    <h3
                      className="text-base font-normal text-[#1A1A1A]"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {r.title}
                    </h3>
                    <p className="text-sm text-[#4A4A4A] mt-1">
                      {r.isSold ? "Sold Out" : r.priceDisplay ?? `${r.price.toLocaleString("ko-KR")}원`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
