"use client";

import { useState } from "react";
export default function MailingListForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
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
      <p
        className="text-lg text-[#268042] tracking-wide"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Thank you. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 bg-transparent border-b border-[#268042] pb-2 text-sm text-[#268042] placeholder:text-[#5a9e72] outline-none focus:border-[#1d6334] transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="text-[10px] tracking-[0.22em] uppercase text-[#F6F4EB] bg-[#268042] px-6 py-2.5
            hover:bg-[#1d6334] focus:outline-none focus:ring-2 focus:ring-[#268042] focus:ring-offset-2 focus:ring-offset-[#F6F4EB]
            active:scale-[0.98] transition-all duration-200 self-end sm:self-auto
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : "Subscribe"}
        </button>
      </form>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
