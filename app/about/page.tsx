import { Metadata } from "next";
import MailingListForm from "@/components/MailingListForm";

export const metadata: Metadata = {
  title: "About",
  description: "FOEM is a curated art platform connecting independent artists with collectors and art lovers worldwide.",
  openGraph: {
    title: "About — FOEM",
    description: "FOEM is a curated art platform connecting independent artists with collectors.",
    url: "https://www.foem.co.kr/about",
  },
  alternates: {
    canonical: "https://www.foem.co.kr/about",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[#F6F4EB] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">

        {/* Hero */}
        <div className="mb-14">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-4">
            FOEM
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold uppercase text-[#1A1A1A] leading-[1.0]"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            About
          </h1>
        </div>

        {/* Introduction */}
        <div className="border-t border-[#d4e8da] py-16 md:py-20">
          <p
            className="text-2xl md:text-3xl text-[#268042] leading-relaxed max-w-3xl italic"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            FOEM — Field of Emotions — is a Seoul-based contemporary art gallery
            dedicated to artists whose work navigates the terrain between
            sensation and meaning.
          </p>
          <p className="text-base text-[#4A4A4A] leading-relaxed max-w-2xl mt-8">
            Founded with a belief that art is a direct transmission of feeling,
            FOEM represents a carefully selected group of painters, photographers,
            and multidisciplinary artists working across Korea and beyond. We
            collaborate closely with our artists from studio to exhibition,
            connecting their work with collectors and institutions worldwide.
          </p>
        </div>

        {/* Location & Contact */}
        <div className="border-t border-[#d4e8da] py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-6">
              Visit
            </p>
            <p
              className="text-xl text-[#268042] mb-4 leading-snug"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Seoul
            </p>
            <p className="text-sm text-[#4A4A4A] leading-relaxed mb-1">
              서울특별시 강남구 논현로69길 8
            </p>
            <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">
              8 Nonhyeon-ro 69-gil, Gangnam-gu, Seoul
            </p>
            <p className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A]">
              Tuesday – Saturday, 11 am – 6 pm
            </p>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-6">
              Contact
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] mb-1">
                  Email
                </p>
                <a
                  href="mailto:berrynko2024@gmail.com"
                  className="text-sm text-[#268042] hover:opacity-60 transition-opacity duration-200"
                >
                  berrynko2024@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] mb-1">
                  Instagram
                </p>
                <a
                  href="https://www.instagram.com/foem_korea/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#268042] hover:opacity-60 transition-opacity duration-200"
                >
                  @foem_korea
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mailing List */}
        <div className="border-t border-[#d4e8da] py-16 md:py-20">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-6">
            Newsletter
          </p>
          <h2
            className="text-3xl md:text-4xl text-[#268042] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Want to Know More?
          </h2>
          <p className="text-sm text-[#4A4A4A] mb-8 max-w-md leading-relaxed">
            Join our mailing list to be among the first to receive gallery news,
            exhibition announcements, and artist updates.
          </p>
          <MailingListForm />
        </div>

      </div>
    </div>
  );
}
