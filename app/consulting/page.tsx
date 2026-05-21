import ConsultingForm from "./ConsultingForm";

export const metadata = {
  title: "Art Consulting",
  description: "FOEM offers personalized art consulting — helping you find the right artwork for your space, taste, and budget. 아트 컨설팅, 그림 추천, 공간 맞춤 작품 제안.",
  keywords: ["아트컨설팅", "아트 컨설팅", "그림 추천", "인테리어 그림", "원화 구매 상담", "art consulting", "FOEM"],
  openGraph: {
    title: "Art Consulting — FOEM",
    description: "Personalized art consulting to find the right artwork for your space and taste.",
    url: "https://www.foem.co.kr/consulting",
  },
};

export default function ConsultingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-14">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-4">FOEM</p>
        <h1
          className="text-6xl md:text-8xl font-bold uppercase text-[#1A1A1A] leading-[1.0]"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Art Consulting
        </h1>
      </div>
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.1em] text-[#9A9A9A] leading-relaxed border-b border-[#E8E6E2] pb-10">
          공간의 가치와 개인의 심미안에 부합하는 오리지널 작품 및 아카이브 제안을 위한 프라이빗 폼입니다.
        </p>
        <ConsultingForm />
      </div>
    </div>
  );
}
