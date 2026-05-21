"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/store/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const tossOrderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const sessionId = searchParams.get("session_id");

    const raw = localStorage.getItem("foem_pending_order");
    const pending = raw ? JSON.parse(raw) : {};

    if (paymentKey && tossOrderId && amount) {
      fetch("/api/payments/toss/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentKey,
          orderId: tossOrderId,
          amount: Number(amount),
          customer: pending.customer,
          items: pending.items,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            localStorage.removeItem("foem_pending_order");
            clearCart();
            setOrderId(tossOrderId.slice(0, 8).toUpperCase());
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } else if (sessionId) {
      fetch("/api/payments/stripe/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          customer: pending.customer,
          items: pending.items,
          orderId: pending.orderId,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            localStorage.removeItem("foem_pending_order");
            clearCart();
            setOrderId((pending.orderId || sessionId).slice(0, 8).toUpperCase());
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    } else {
      setStatus("error");
    }
  }, [searchParams, clearCart]);

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <div className="w-8 h-8 border border-[#268042] border-t-transparent rounded-full animate-spin mx-auto mb-8" />
        <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A]">Processing payment…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">Payment issue</p>
        <h1
          className="text-3xl font-normal text-[#1A1A1A] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Something went wrong
        </h1>
        <p className="text-sm text-[#9A9A9A] leading-relaxed mb-10 max-w-md mx-auto">
          Your payment could not be confirmed. Please contact us at{" "}
          <a href="mailto:foem.art@gmail.com" className="underline">
            foem.art@gmail.com
          </a>
          .
        </p>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#1A1A1A] border border-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F3EF] transition-all duration-300"
        >
          Back to checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="w-12 h-12 border border-[#268042] rounded-full flex items-center justify-center mx-auto mb-8">
        <svg className="w-5 h-5 text-[#268042]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">Order confirmed</p>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Thank you for your order
      </h1>

      {orderId && (
        <p className="text-sm text-[#4A4A4A] mb-2">Order #{orderId}</p>
      )}

      <p className="text-sm text-[#9A9A9A] leading-relaxed mb-10 max-w-md mx-auto">
        A confirmation email has been sent to you. Your artwork will be carefully packaged and
        shipped within 5–7 business days.
      </p>

      <div className="h-px w-16 bg-[#E8E6E2] mx-auto mb-10" />

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#1A1A1A] border border-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F3EF] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-95"
      >
        Continue browsing
      </Link>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="w-8 h-8 border border-[#268042] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
