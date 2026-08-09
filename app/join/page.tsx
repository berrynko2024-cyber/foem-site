import { Metadata } from "next";
import Link from "next/link";
import JoinForm from "./JoinForm";

export const metadata: Metadata = {
  title: "Join — FOEM",
  description: "FOEM과 함께할 작가를 모집합니다. 2026 베를린 Positions Art Fair 공동 참가 작가를 모집 중입니다.",
  openGraph: {
    title: "FOEM — 작가 참여 모집",
    description: "아티스트 영상으로 더 풍부하게 전달하고, 세계 무대로 함께 나갑니다. 2026 베를린 Positions Art Fair 참가 확정.",
    url: "https://www.foem.co.kr/join",
    images: [{ url: "https://www.foem.co.kr/og-main.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FOEM — 작가 참여 모집",
    description: "아티스트 영상으로 더 풍부하게 전달하고, 세계 무대로 함께 나갑니다.",
    images: ["https://www.foem.co.kr/og-main.png"],
  },
};

const artists = [
  { name: "Betty Moon", nameKo: "문유경", medium: "Photography" },
  { name: "Uiyeong Park", nameKo: "박의영", medium: "Painting" },
  { name: "Harin J", nameKo: "제은숙", medium: "Painting" },
];

const benefits = [
  {
    number: "01",
    title: "전용 아티스트 페이지",
    body:
      "FOEM 내 개인 아티스트 페이지가 제공됩니다. 작가 소개, 작품 아카이브, 아티스트 영상이 하나의 공간에 구성되며 국내외 방문자에게 일관된 작가 브랜드를 전달합니다.",
    example: { label: "페이지 예시 보기 — Betty Moon →", href: "/artists/betty-moon" },
  },
  {
    number: "02",
    title: "작품 판매 채널",
    body:
      "플랫폼 내 Shop을 통해 원화 및 프린트 판매가 가능합니다. 국내외 컬렉터와의 직접 연결 채널이 마련됩니다.",
  },
  {
    number: "03",
    title: "2026 베를린 Positions Art Fair — 공동 참가",
    body:
      "FOEM은 2026 베를린 Positions Art Fair 참가가 확정되었습니다. 참여 작가는 함께 출품할 수 있으며, 페어 신청부터 부스 운영, 현지 홍보까지 전 과정을 함께 진행합니다. Positions Art Fair는 베를린을 기반으로 한 국제 아트페어로, 유럽 컬렉터 및 갤러리 관계자와의 접점을 만들 수 있는 중요한 기회입니다.",
    highlight: true,
  },
  {
    number: "04",
    title: "아티스트 필름 제작",
    body:
      "작가의 작업 과정과 철학을 담은 영상을 제작합니다. 제작된 영상은 아티스트 페이지, 아트페어 홍보물, SNS 채널 등에 활용됩니다.",
  },
];

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

        {/* Benefits */}
        <div className="border-t border-[#d4e8da] py-16 md:py-20">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-12">
            참여 혜택
          </p>
          <div className="space-y-0">
            {benefits.map((b) => (
              <div
                key={b.number}
                className={`border-t border-[#d4e8da] py-10 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 ${
                  b.highlight ? "bg-[#268042]/5 -mx-6 px-6" : ""
                }`}
              >
                <p
                  className="text-4xl font-bold text-[#d4e8da]"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {b.number}
                </p>
                <div>
                  <h3
                    className={`text-lg md:text-xl font-semibold mb-3 ${
                      b.highlight ? "text-[#268042]" : "text-[#1A1A1A]"
                    }`}
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {b.title}
                    {b.highlight && (
                      <span className="ml-3 text-[10px] tracking-[0.2em] uppercase bg-[#268042] text-white px-2 py-0.5 align-middle">
                        확정
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed">{b.body}</p>
                  {b.example && (
                    <Link
                      href={b.example.href}
                      className="inline-block mt-5 text-[11px] tracking-[0.15em] uppercase text-[#268042] border-b border-[#268042] pb-0.5 hover:opacity-60 transition-opacity duration-200"
                    >
                      {b.example.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing — 전체 래퍼 (패딩 없이 full-bleed 블록 사용) */}
        <div className="border-t border-[#d4e8da] pt-16 md:pt-20 pb-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14 px-0">
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A]">
              참여 비용
            </p>
            <p className="text-[11px] text-[#268042] font-semibold tracking-wide">
              ※ 아래 금액은 2026년 8월 31일까지 적용됩니다. 이후 가격은 변동될 수 있습니다.
            </p>
          </div>

          {/* ── 블록 A : 초기 참여 비용 ── */}
          <div className="bg-[#1a1a1a] -mx-6 px-6 md:px-10 py-12 md:py-16 mb-0">
            <p
              className="text-[10px] tracking-[0.3em] uppercase text-[#5a9e72] mb-10"
            >
              초기 참여 비용
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* 필수 */}
              <div className="border border-[#268042] p-8 bg-[#268042]/10">
                <div className="flex items-center gap-3 mb-8">
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase bg-[#268042] text-white px-3 py-1 font-bold"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    필수
                  </span>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                    아티스트 영상 촬영
                  </p>
                </div>
                <p
                  className="text-6xl font-bold text-[#268042] leading-none mb-3"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  150만원
                </p>
                <p className="text-xs text-[#666] mb-8">
                  <span className="line-through text-[#555]">정가 200만원</span>
                  <span className="text-[#5a9e72] ml-2">8월 31일까지 혜택가</span>
                </p>
                <div className="border-t border-[#333] pt-6 space-y-2">
                  <p className="text-sm text-[#aaa] leading-[1.8]">
                    FOEM의 핵심은 영상입니다.<br />
                    작가의 생각, 작업의 과정을 보고 들어야<br />
                    작품이 비로소 살아납니다.<br />
                    아티스트 영상은 <strong className="text-white">참여의 필수 조건</strong>입니다.
                  </p>
                </div>
              </div>

              {/* 선택 */}
              <div className="border border-[#333] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase border border-[#5a9e72] text-[#5a9e72] px-3 py-1 font-bold"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    선택
                  </span>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">
                    작품 촬영
                  </p>
                </div>
                <p
                  className="text-6xl font-bold text-white leading-none mb-3"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  별도 문의
                </p>
                <p className="text-xs text-[#666] mb-8">
                  작품 수 및 크기에 따라 상이
                </p>
                <div className="border-t border-[#333] pt-6 space-y-2">
                  <p className="text-sm text-[#aaa] leading-[1.8]">
                    보유 사진의 화질이 충분하면<br />
                    별도 촬영 없이 진행할 수 있습니다.<br />
                    화질이 좋지 않을 경우<br />
                    작품 촬영을 <strong className="text-white">권장</strong>합니다.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ── 블록 B : 월 관리비 ── */}
          <div className="bg-[#eef5f0] -mx-6 px-6 md:px-10 py-12 md:py-16 mb-16 md:mb-24">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#268042] mb-10">
              월 관리비
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* 초기 3개월 무료 */}
              <div className="bg-white border border-[#d4e8da] p-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-8">
                  참여 후 초기 3개월
                </p>
                <p
                  className="text-6xl font-bold text-[#268042] leading-none mb-8"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  무료
                </p>
                <div className="border-t border-[#d4e8da] pt-6">
                  <p className="text-sm text-[#4A4A4A] leading-[1.8]">
                    먼저 경험해보세요.<br />
                    3개월 동안 플랫폼을 충분히 써보고<br />
                    계속할지 결정하셔도 됩니다.
                  </p>
                </div>
              </div>

              {/* 3개월 이후 */}
              <div className="bg-white border border-[#d4e8da] p-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-8">
                  3개월 이후 / 월
                </p>
                <p
                  className="text-6xl font-bold text-[#1A1A1A] leading-none mb-3"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  3–5만원
                </p>
                <p className="text-xs text-[#9A9A9A] mb-8">
                  작품 수 및 트래픽에 따라 변동 예상
                </p>
                <div className="border-t border-[#d4e8da] pt-6">
                  <p className="text-sm text-[#4A4A4A] leading-[1.8]">
                    관리비는 전액<br />
                    <strong className="text-[#268042]">광고 집행 및 SNS 계정 관리</strong>에<br />
                    사용됩니다.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Current Artists */}
        <div className="border-t border-[#d4e8da] py-16 md:py-20">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-12">
            현재 참여 작가
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#d4e8da]">
            {artists.map((a) => (
              <div key={a.name} className="bg-[#F6F4EB] p-8">
                <p
                  className="text-base font-semibold text-[#1A1A1A] mb-1"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {a.name}
                </p>
                <p className="text-xs text-[#9A9A9A] mb-3">{a.nameKo}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#5a9e72]">
                  {a.medium}
                </p>
              </div>
            ))}
            {/* 빈 자리 */}
            <div className="bg-[#F6F4EB] p-8 flex flex-col justify-between border border-dashed border-[#b8d8c2]">
              <p
                className="text-xl font-bold text-[#268042] leading-tight"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                당신의<br />자리입니다.
              </p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#b8d8c2] mt-6">
                참여를 기다립니다
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="border-t border-[#d4e8da] py-16 md:py-20">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-12">
            문의 및 신청
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* 좌: 제출 서류 */}
            <div>
              <h2
                className="text-2xl md:text-3xl text-[#1A1A1A] font-bold mb-8 leading-tight"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                참여 신청 시<br />아래 내용을 함께 보내주세요.
              </h2>

              <div className="space-y-6">
                {/* 항목 1 */}
                <div className="border-t border-[#d4e8da] pt-6">
                  <div className="flex gap-4">
                    <span
                      className="text-2xl font-bold text-[#d4e8da] leading-none mt-1 shrink-0"
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      01
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A] mb-2">
                        작가 CV &amp; 작가 노트
                      </p>
                      <p className="text-xs text-[#4A4A4A] leading-[1.8]">
                        작가 이력서와 작업 노트를 포함해 주세요.<br />
                        영문 작성을 권장합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 항목 2 */}
                <div className="border-t border-[#d4e8da] pt-6">
                  <div className="flex gap-4">
                    <span
                      className="text-2xl font-bold text-[#d4e8da] leading-none mt-1 shrink-0"
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      02
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A] mb-2">
                        작품 이미지 6장
                      </p>
                      <p className="text-xs text-[#4A4A4A] leading-[1.8]">
                        각 이미지 파일명은 아래 형식으로 작성해 주세요.
                      </p>
                      <div className="mt-3 bg-[#1a1a1a] px-4 py-3 rounded-none">
                        <p
                          className="text-xs text-[#5a9e72] leading-[2] font-mono"
                        >
                          Artist Name_Artwork Title<br />
                          _Medium_Size_Year_Price
                        </p>
                        <p className="text-[10px] text-[#666] mt-2">
                          예) Betty Moon_Returning to Myself<br />
                          _Photography_60×90cm_2024_₩1,200,000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 항목 3 */}
                <div className="border-t border-[#d4e8da] pt-6">
                  <div className="flex gap-4">
                    <span
                      className="text-2xl font-bold text-[#d4e8da] leading-none mt-1 shrink-0"
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      03
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A] mb-2">
                        해외 아트페어 참여 의사
                      </p>
                      <p className="text-xs text-[#4A4A4A] leading-[1.8]">
                        2026 베를린 Positions Art Fair를 비롯한<br />
                        해외 아트페어 공동 참가 희망 여부를 알려주세요.<br />
                        참여 의사가 있으신 경우 선호 페어나<br />
                        일정도 함께 적어주시면 좋습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 우: 이메일 + 폼 */}
            <div className="space-y-10">
              {/* 이메일 직접 보내기 */}
              <div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">
                  서류가 준비되셨다면 이메일로 직접 보내주세요.
                </p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=berrynko2024@gmail.com&su=FOEM+%EC%9E%91%EA%B0%80+%EC%B0%B8%EC%97%AC+%EB%AC%B8%EC%9D%98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-[#268042] text-[#268042] text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#268042] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#268042] active:scale-[0.98] transition-all duration-300"
                >
                  Gmail로 보내기 →
                </a>
                <p className="text-[10px] text-[#9A9A9A] mt-3">berrynko2024@gmail.com</p>
              </div>

              {/* 구분선 */}
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t border-[#d4e8da]" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">또는</span>
                <div className="flex-1 border-t border-[#d4e8da]" />
              </div>

              {/* 사이트 내 문의 폼 */}
              <div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">
                  간단히 연락처만 남겨주셔도 됩니다.<br />
                  검토 후 순차적으로 연락드리겠습니다.
                </p>
                <JoinForm />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
