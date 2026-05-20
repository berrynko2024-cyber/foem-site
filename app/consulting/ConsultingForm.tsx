"use client";

import { useState } from "react";

const MEDIUMS = [
  { value: "photography", label: "사진" },
  { value: "painting-figurative", label: "회화 · 구상" },
  { value: "painting-non-figurative", label: "회화 · 비구상" },
  { value: "craft", label: "공예" },
];

const VIBES = [
  { value: "oriental", label: "동양적 여백" },
  { value: "geometric", label: "기하학적 구조" },
  { value: "lyrical", label: "서정적 서사" },
  { value: "minimal", label: "미니멀 & 정제" },
  { value: "bold", label: "대담한 에너지" },
];

const SIZES = [
  { value: "large", label: "대형 (160cm+)" },
  { value: "medium", label: "중소형 (100cm 내외)" },
  { value: "custom", label: "공간 맞춤형" },
];

const PLACEMENTS = [
  { value: "living", label: "거실" },
  { value: "dining", label: "다이닝" },
  { value: "lobby", label: "오피스 로비" },
  { value: "private", label: "서재 / 프라이빗 룸" },
  { value: "commercial", label: "상업 공간 / 갤러리" },
];

const inputClass =
  "w-full border border-[#E8E6E2] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#C0BEB9] focus:outline-none focus:border-[#1A1A1A] transition-colors";

function chip(selected: boolean) {
  return `px-4 py-2 text-xs tracking-[0.08em] border cursor-pointer transition-colors select-none
    ${selected
      ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F6F4EB]"
      : "border-[#E8E6E2] text-[#4A4A4A] hover:border-[#1A1A1A]"
    }`;
}

function SectionHeader({
  num, title, sub, required,
}: {
  num: string; title: string; sub: string; required?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3 mb-5">
      <span
        className="text-2xl font-bold leading-none text-[#268042]"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {num}
      </span>
      <div className="flex items-baseline gap-2">
        <p className="text-sm font-medium text-[#1A1A1A] tracking-wide">{title}</p>
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A]">{sub}</p>
        <span className={`text-[10px] tracking-[0.15em] uppercase ${required ? "text-[#268042] font-semibold" : "text-[#C0BEB9]"}`}>
          {required ? "· 필수" : "· 선택"}
        </span>
      </div>
    </div>
  );
}

function OtherInput({ value, onChange, placeholder = "기타 · 의견 · Other" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="mt-3">
      <label className="block text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">
        기타 · 의견 · Other
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export default function ConsultingForm() {
  const [mediums, setMediums] = useState<string[]>([]);
  const [mediumOther, setMediumOther] = useState("");

  const [vibe, setVibe] = useState("");
  const [vibeOther, setVibeOther] = useState("");

  const [size, setSize] = useState("");
  const [placement, setPlacement] = useState("");
  const [spaceOther, setSpaceOther] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleMedium(value: string) {
    setMediums((prev) =>
      prev.includes(value) ? prev.filter((m) => m !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/consulting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediums, mediumOther, vibe, vibeOther, size, placement, spaceOther, name, email, phone }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("제출 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-16 border-t border-[#E8E6E2] mt-12">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#9A9A9A] mb-4">Inquiry Received</p>
        <p className="text-sm text-[#1A1A1A] mb-2 leading-relaxed">
          컬렉터의 안목이 반영된 데이터가 안전하게 접수되었습니다.
        </p>
        <p className="text-xs text-[#9A9A9A]">
          빠른 시일 내에 연락드리겠습니다 · We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 space-y-12 pb-24">

      {/* 01. 관심 매체 */}
      <section>
        <SectionHeader num="01" title="관심 매체" sub="Preferred Medium" />
        <div className="flex flex-wrap gap-2">
          {MEDIUMS.map(({ value, label }) => (
            <label key={value} className={chip(mediums.includes(value))}>
              <input
                type="checkbox"
                className="sr-only"
                checked={mediums.includes(value)}
                onChange={() => toggleMedium(value)}
              />
              {label}
            </label>
          ))}
        </div>
        <OtherInput value={mediumOther} onChange={setMediumOther} placeholder="직접 입력해주세요." />
      </section>

      {/* 02. 미학적 경향 */}
      <section>
        <SectionHeader num="02" title="미학적 경향" sub="Aesthetic Vibe" />
        <div className="flex flex-wrap gap-2">
          {VIBES.map(({ value, label }) => (
            <label key={value} className={chip(vibe === value)}>
              <input
                type="radio"
                name="vibe"
                value={value}
                className="sr-only"
                checked={vibe === value}
                onChange={() => setVibe(value)}
              />
              {label}
            </label>
          ))}
        </div>
        <OtherInput value={vibeOther} onChange={setVibeOther} placeholder="직접 입력해주세요." />
      </section>

      {/* 03. 설치 공간 */}
      <section>
        <SectionHeader num="03" title="설치 공간 정보" sub="Space & Scale" />

        <p className="text-[10px] tracking-[0.18em] uppercase text-[#9A9A9A] mb-3">작품 크기</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {SIZES.map(({ value, label }) => (
            <label key={value} className={chip(size === value)}>
              <input
                type="radio"
                name="size"
                value={value}
                className="sr-only"
                checked={size === value}
                onChange={() => setSize(value)}
              />
              {label}
            </label>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.18em] uppercase text-[#9A9A9A] mb-3">설치 공간</p>
        <div className="flex flex-wrap gap-2">
          {PLACEMENTS.map(({ value, label }) => (
            <label key={value} className={chip(placement === value)}>
              <input
                type="radio"
                name="placement"
                value={value}
                className="sr-only"
                checked={placement === value}
                onChange={() => setPlacement(value)}
              />
              {label}
            </label>
          ))}
        </div>
        <OtherInput
          value={spaceOther}
          onChange={setSpaceOther}
          placeholder="공간 분위기, 마감재, 조도 등 자유롭게 입력해주세요."
        />
      </section>

      {/* 04. 연락처 */}
      <section className="border border-[#E8E6E2] p-6">
        <SectionHeader num="04" title="연락처" sub="Client Contact" required />
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#268042] font-bold mb-2">
              성함 · Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="이름을 입력해주세요"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#268042] font-bold mb-2">
              이메일 · Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#268042] font-bold mb-2">
              연락처 · Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="010-0000-0000"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 -mt-6">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 text-[11px] tracking-[0.2em] uppercase bg-[#1A1A1A] text-[#F6F4EB]
          hover:bg-[#2D2D2D] transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 focus:ring-offset-[#F6F4EB]
          active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "제출 중..." : "Request Art Curation"}
      </button>
    </form>
  );
}
