"use client";

import { useState } from "react";

export default function JoinForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/join-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-[#268042] p-10 text-center">
        <p
          className="text-2xl font-bold text-[#268042] mb-3"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          문의가 접수되었습니다.
        </p>
        <p className="text-sm text-[#4A4A4A]">검토 후 빠른 시일 내에 연락드리겠습니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">
            이름 <span className="text-[#268042]">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="홍길동"
            className="w-full border border-[#d4e8da] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#C0C0C0] focus:outline-none focus:border-[#268042] transition-colors duration-200"
          />
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">
            이메일 <span className="text-[#268042]">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full border border-[#d4e8da] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#C0C0C0] focus:outline-none focus:border-[#268042] transition-colors duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">
          연락처
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="010-0000-0000"
          className="w-full border border-[#d4e8da] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#C0C0C0] focus:outline-none focus:border-[#268042] transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-[#9A9A9A] mb-2">
          메시지
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="간단한 자기소개나 문의 사항을 남겨주세요."
          className="w-full border border-[#d4e8da] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#C0C0C0] focus:outline-none focus:border-[#268042] transition-colors duration-200 resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-500">오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="border border-[#268042] text-[#268042] text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#268042] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#268042] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {status === "loading" ? "전송 중..." : "문의 보내기"}
      </button>
    </form>
  );
}
