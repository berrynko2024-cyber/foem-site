"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "The payment was cancelled or failed.";

  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="w-12 h-12 border border-[#E8E6E2] rounded-full flex items-center justify-center mx-auto mb-8">
        <svg className="w-5 h-5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">Payment failed</p>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Payment unsuccessful
      </h1>

      <p className="text-sm text-[#9A9A9A] leading-relaxed mb-10 max-w-md mx-auto">{message}</p>

      <div className="flex items-center justify-center gap-4">
        <Link
          href="/checkout"
          className="inline-flex items-center text-xs tracking-[0.15em] uppercase text-[#1A1A1A] border border-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F3EF] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-95"
        >
          Try again
        </Link>
        <Link
          href="/cart"
          className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors duration-200"
        >
          Back to cart
        </Link>
      </div>
    </div>
  );
}

export default function OrderFailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="w-8 h-8 border border-[#E8E6E2] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
