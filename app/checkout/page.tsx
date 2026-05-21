"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/store/CartContext";

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (
        method: string,
        options: {
          amount: number;
          orderId: string;
          orderName: string;
          customerName?: string;
          customerEmail?: string;
          successUrl: string;
          failUrl: string;
        }
      ) => Promise<void>;
    };
  }
}

type PaymentMethod = "toss" | "stripe";

function loadTossScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window.TossPayments === "function") {
      resolve();
      return;
    }
    const existing = document.querySelector(
      'script[src="https://js.tosspayments.com/v1/payment"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1/payment";
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("toss");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "KR",
  });

  useEffect(() => {
    setPaymentMethod(form.country === "KR" ? "toss" : "stripe");
  }, [form.country]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalPrice || totalPrice === 0) {
      alert("결제 금액이 0원입니다. 작품 가격을 확인해 주세요.");
      return;
    }
    setLoading(true);

    const orderId = crypto.randomUUID();
    localStorage.setItem(
      "foem_pending_order",
      JSON.stringify({ orderId, customer: form, items })
    );

    try {
      if (paymentMethod === "toss") {
        await loadTossScript();
        const tossPayments = window.TossPayments(
          process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
        );
        const orderName =
          items.length === 1
            ? items[0].title
            : `${items[0].title} 외 ${items.length - 1}점`;
        await tossPayments.requestPayment("카드", {
          amount: totalPrice,
          orderId,
          orderName,
          customerName: form.name,
          customerEmail: form.email,
          successUrl: `${window.location.origin}/order/success`,
          failUrl: `${window.location.origin}/order/fail`,
        });
      } else {
        const res = await fetch("/api/payments/stripe/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            customer: form,
            orderId,
            origin: window.location.origin,
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error || "Stripe session creation failed");
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "결제 중 오류가 발생했습니다.";
      if (!msg.includes("취소") && !msg.includes("cancel")) {
        alert(msg);
      }
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <p className="text-[#9A9A9A] text-sm">No items to checkout.</p>
      </div>
    );
  }

  const isKorea = form.country === "KR";

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <h1
        className="text-4xl font-normal text-[#1A1A1A] mb-14"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer info */}
          <div>
            <h2 className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] mb-5">
              Customer information
            </h2>
            {[
              { name: "name", label: "Full name", type: "text", required: true },
              { name: "email", label: "Email address", type: "email", required: true },
              { name: "phone", label: "Phone number", type: "tel", required: false },
            ].map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2">
                  {field.label} {field.required && "*"}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full border border-[#E8E6E2] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] placeholder-[#C0B9B0] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>
            ))}
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] mb-5 mt-4">
              Shipping address
            </h2>
            <div className="mb-4">
              <label className="block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="w-full border border-[#E8E6E2] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#E8E6E2] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border border-[#E8E6E2] bg-[#F5F3EF] px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                >
                  <option value="KR">Korea</option>
                  <option value="US">United States</option>
                  <option value="JP">Japan</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment method selector */}
          <div>
            <h2 className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] mb-4 mt-4">
              Payment method
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {/* Toss — only shown for Korea */}
              {isKorea && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod("toss")}
                  className={`flex flex-col items-start px-4 py-4 border text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 ${
                    paymentMethod === "toss"
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F3EF]"
                      : "border-[#E8E6E2] text-[#1A1A1A] hover:border-[#4A4A4A]"
                  }`}
                >
                  <span className="text-xs font-medium tracking-[0.08em] mb-1">
                    토스페이먼츠
                  </span>
                  <span
                    className={`text-[10px] tracking-[0.05em] ${
                      paymentMethod === "toss" ? "text-[#C0C0C0]" : "text-[#9A9A9A]"
                    }`}
                  >
                    카드 · 간편결제
                  </span>
                </button>
              )}

              {/* Stripe */}
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`flex flex-col items-start px-4 py-4 border text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 ${
                  !isKorea ? "col-span-2" : ""
                } ${
                  paymentMethod === "stripe"
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F3EF]"
                    : "border-[#E8E6E2] text-[#1A1A1A] hover:border-[#4A4A4A]"
                }`}
              >
                <span className="text-xs font-medium tracking-[0.08em] mb-1">Stripe</span>
                <span
                  className={`text-[10px] tracking-[0.05em] ${
                    paymentMethod === "stripe" ? "text-[#C0C0C0]" : "text-[#9A9A9A]"
                  }`}
                >
                  {isKorea ? "International card" : "Credit / Debit card"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xs tracking-[0.15em] uppercase bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 focus:ring-offset-[#F5F3EF] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-4"
          >
            {loading
              ? "Processing…"
              : paymentMethod === "toss"
              ? "토스페이먼츠로 결제"
              : "Pay with Stripe"}
          </button>

          <p className="text-[11px] text-[#9A9A9A] text-center">
            {paymentMethod === "toss"
              ? "토스페이먼츠 · SSL 암호화 보안 결제"
              : "Secure payment powered by Stripe · SSL encrypted"}
          </p>
        </form>

        {/* Order summary */}
        <div className="border border-[#E8E6E2] p-6 h-fit sticky top-24">
          <h2
            className="text-lg font-normal text-[#1A1A1A] mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Order summary
          </h2>

          <div className="space-y-4 mb-6 pb-6 border-b border-[#E8E6E2]">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm text-[#1A1A1A] truncate"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[#9A9A9A]">
                    {item.artist} · qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-[#1A1A1A] flex-shrink-0">
                  {(item.price * item.quantity).toLocaleString("ko-KR")}원
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-sm text-[#4A4A4A]">Subtotal</span>
            <span className="text-sm text-[#1A1A1A]">
              {totalPrice.toLocaleString("ko-KR")}원
            </span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="text-sm text-[#4A4A4A]">Shipping</span>
            <span className="text-sm text-[#9A9A9A]">Calculated at next step</span>
          </div>
          <div className="flex justify-between border-t border-[#E8E6E2] pt-4">
            <span className="text-base font-medium text-[#1A1A1A]">Total</span>
            <span className="text-base font-medium text-[#1A1A1A]">
              {totalPrice.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
