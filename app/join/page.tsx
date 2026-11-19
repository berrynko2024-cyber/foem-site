import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join",
  description: "FOEM과 함께 세계 무대로 나갈 작가를 모집합니다. 2027년 작가 모집을 준비 중입니다.",
  alternates: {
    canonical: "https://www.foem.co.kr/join",
  },
  openGraph: {
    title: "FOEM — 작가 참여 모집",
    description: "아티스트 영상으로 더 풍부하게 전달하고, 세계 무대로 함께 나갑니다. 2027년 작가 모집 준비 중.",
    url: "https://www.foem.co.kr/join",
    images: [{ url: "https://www.foem.co.kr/og-main.png", width: 2172, height: 1258 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FOEM — 작가 참여 모집",
    description: "아티스트 영상으로 더 풍부하게 전달하고, 세계 무대로 함께 나갑니다.",
    images: ["https://www.foem.co.kr/og-main.png"],
  },
};

export default function JoinPage() {
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
            Join
          </h1>
          <p
            className="text-xl md:text-2xl text-[#268042] mt-8 max-w-2xl leading-relaxed font-bold tracking-tight"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            FOEM과 함께 세계 무대로 나갈 작가를 모집합니다.
          </p>
        </div>

        {/* About FOEM */}
        <div className="border-t border-[#d4e8da] py-16 md:py-20">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-12">
            About
          </p>
          <div className="max-w-3xl space-y-8">
            <p
              className="text-2xl md:text-4xl text-[#268042] leading-tight font-bold"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              단순히 작품 사진으로<br />홍보하는 곳이 아닙니다.
            </p>
            <p className="text-base text-[#4A4A4A] leading-[1.9]">
              작가의 생각, 작업의 과정, 그 안의 이야기를<br />
              영상으로 보고 듣고 — 함께 느낍니다.<br />
              그리고 작품을 직접 감상하고 소장합니다.<br />
              <strong className="text-[#268042]">플랫폼과 온라인 샵이 합쳐진 공간</strong>입니다.
            </p>
            <p className="text-base text-[#4A4A4A] leading-[1.9]">
              FOEM이 가장 먼저 하는 일은<br />
              <strong className="text-[#1A1A1A]">국내 작가들의 국내외 홍보 마케팅</strong>입니다.<br />
              더 많은 사람에게 알려지는 것이 먼저.<br />
              작품 판매는 그 다음에 자연스럽게 따라옵니다.
            </p>
            <div className="border-l-4 border-[#268042] pl-6 py-2">
              <p
                className="text-lg md:text-xl text-[#268042] font-bold leading-snug"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                국내 오프라인 전시의 한계,<br />
                사진 한 장으로는 전할 수 없는 것들.<br />
                아티스트 영상으로 더 풍부하게 전달하고,<br />
                세계 무대로 함께 나간다.
              </p>
            </div>
          </div>
        </div>

        {/* 2027 모집 준비 중 */}
        <div className="border-t border-[#d4e8da] py-16 md:py-24">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-12">
            Coming Soon
          </p>
          <p
            className="text-4xl md:text-6xl text-[#268042] leading-tight font-bold"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            2027년 준비 중입니다.
          </p>
          <p className="text-base text-[#4A4A4A] leading-[1.9] mt-8">
            새로운 작가 모집 안내는 곧 공개됩니다.
          </p>
        </div>

      </div>
    </div>
  );
}
