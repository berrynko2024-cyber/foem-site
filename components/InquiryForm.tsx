"use client";

import { useState } from "react";

interface InquiryFormProps {
  artworkId: string;
  artworkTitle: string;
  artistName: string;
}

export default function InquiryForm({ artworkId, artworkTitle, artistName }: InquiryFormProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, artworkId, artworkTitle, artistName }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-[#E8E6E2] p-6 text-center">
        <p className="text-sm text-[#4A4A4A] mb-1">문의가 접수되었습니다 · Your inquiry has been received.</p>
        <p className="text-xs text-[#9A9A9A]">빠른 시일 내에 연락드리겠습니다 · We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs tracking-[0.12em] uppercase text-[#9A9A9A] mb-5">
        작품 구매 문의 · Artwork Inquiry
      </p>

      {[
        { name: "name", label: "이름 · Name", type: "text", required: true },
        { name: "email", label: "이메일 · Email", type: "email", required: true },
        { name: "phone", label: "연락처 · Phone (optional)", type: "tel", required: false },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={form[field.name as keyof typeof form]}
            onChange={handleChange}
            required={field.required}
            className="w-full border border-[#E8E6E2] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
          />
        </div>
      ))}

      <div>
        <label className="block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2">
          메시지 · Message (optional)
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          className="w-full border border-[#E8E6E2] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-xs tracking-[0.15em] uppercase bg-[#1A1A1A] text-[#F5F3EF]
          hover:bg-[#2D2D2D] transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 focus:ring-offset-[#F5F3EF]
          active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "전송 중... · Sending..." : "문의하기 · Send Inquiry"}
      </button>
    </form>
  );
}
