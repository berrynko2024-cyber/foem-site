"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/store/CartContext";
import { formatPrice, convertPrice } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import { supabase } from "@/lib/supabase";

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

// v2 SDK (needed for PayPal, which only works through the Payment Widget — not
// the v1 requestPayment() popup). Cast separately so it doesn't clash with the
// v1 `window.TossPayments` signature above; only one of the two scripts is ever
// loaded per checkout session since currency determines the branch.
type TossPaymentsV2Widgets = {
  setAmount: (amount: { value: number; currency: "USD" }) => Promise<void>;
  requestPayment: (options: {
    orderId: string;
    amount: { value: number; currency: "USD" };
    successUrl: string;
    failUrl: string;
  }) => Promise<void>;
};

type PaymentMethod = "toss" | "paypal";

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

function loadTossWidgetScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(
      'script[src="https://js.tosspayments.com/v2/standard"][data-loaded="true"]'
    );
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v2/standard";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, removeItem, displayCurrency, rates, convertToDisplay, totalInDisplayCurrency } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    displayCurrency === "KRW" ? "toss" : "paypal"
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "KR",
  });
  const [removedSoldOutTitles, setRemovedSoldOutTitles] = useState<string[]>([]);

  useEffect(() => {
    setPaymentMethod(displayCurrency === "KRW" ? "toss" : "paypal");
  }, [displayCurrency]);

  // 체크아웃 진입 시 한 번, 장바구니에 담긴 작품 중 그새 품절된 게 있는지 실시간 확인해서 걸러낸다.
  // (최종 방어선은 결제 승인 API의 원자적 가드지만, 여기서 미리 걸러야 고객이 헛되이
  //  결제 정보를 다 입력한 뒤에야 실패를 겪는 걸 막을 수 있다.)
  const checkedRef = useRef(false);
  useEffect(() => {
    if (checkedRef.current || items.length === 0) return;
    checkedRef.current = true;

    const ids = items.map((i) => i.id);
    supabase
      .from("artworks")
      .select("id, title, is_sold")
      .in("id", ids)
      .then(({ data, error }) => {
        if (error || !data) return;
        const soldOut = data.filter((a) => a.is_sold);
        if (soldOut.length === 0) return;
        soldOut.forEach((a) => removeItem(a.id));
        setRemovedSoldOutTitles(soldOut.map((a) => a.title));
      });
  }, [items, removeItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalInDisplayCurrency || totalInDisplayCurrency === 0) {
      alert("결제 금액이 0입니다. 작품 가격을 확인해 주세요.");
      return;
    }
    if (paymentMethod === "paypal" && !rates) {
      alert("환율 정보를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    setLoading(true);

    const orderId = crypto.randomUUID();

    // Calculate final payment amount depending on payment method
    let finalAmount = Math.round(totalInDisplayCurrency);
    let totalInUSD = 0;
    if (paymentMethod === "paypal") {
      const usdRates = rates;
      totalInUSD = items.reduce(
        (sum, i) => sum + convertPrice(i.price, i.currency, "USD", usdRates!) * i.quantity,
        0
      );
      finalAmount = Math.round(totalInUSD * 100) / 100;
    }

    // 1. Register pending order in DB
    try {
      const initRes = await fetch("/api/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customer: form,
          items,
          currency: displayCurrency,
          amount: finalAmount,
        }),
      });

      if (!initRes.ok) {
        const initErr = await initRes.json();
        throw new Error(initErr.error || "결제 초기화에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "결제 준비 중 오류가 발생했습니다.";
      alert(msg);
      setLoading(false);
      return;
    }

    localStorage.setItem(
      "foem_pending_order",
      JSON.stringify({ orderId, customer: form, items, currency: displayCurrency })
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
          amount: finalAmount,
          orderId,
          orderName,
          customerName: form.name,
          customerEmail: form.email,
          successUrl: `${window.location.origin}/order/success?currency=KRW`,
          failUrl: `${window.location.origin}/order/fail`,
        });
      } else {
        // PayPal via the Toss widget only accepts USD from our side — PayPal's
        // own checkout page converts to the buyer's local currency automatically
        // (confirmed in Toss's overseas-payment deck), so EUR selection here is
        // a display estimate; the widget submission is always USD-denominated.
        await loadTossWidgetScript();
        const TossPaymentsV2 = (
          window as unknown as {
            TossPayments: (clientKey: string) => {
              widgets: (opts: { variantKey: string }) => TossPaymentsV2Widgets;
            };
          }
        ).TossPayments;
        const widgets = TossPaymentsV2(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!).widgets({
          variantKey: "PAYPAL",
        });
        const roundedUSD = Math.round(totalInUSD * 100) / 100;
        await widgets.setAmount({ value: roundedUSD, currency: "USD" });
        await widgets.requestPayment({
          orderId,
          amount: { value: roundedUSD, currency: "USD" },
          successUrl: `${window.location.origin}/order/success?currency=USD`,
          failUrl: `${window.location.origin}/order/fail`,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "결제 중 오류가 발생했습니다.";
      if (!msg.includes("취소") && !msg.includes("cancel")) {
        alert(msg);
      }
      setLoading(false);
    }
  };

  const soldOutBanner = removedSoldOutTitles.length > 0 && (
    <div className="border border-[#E8B4B4] bg-[#FBEDED] text-[#9A3E3E] text-sm px-4 py-3 mb-8">
      죄송합니다. 다음 작품이 이미 판매 완료되어 장바구니에서 제외되었습니다:{" "}
      <strong>{removedSoldOutTitles.join(", ")}</strong>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-32 text-center">
        {soldOutBanner}
        <p className="text-[#9A9A9A] text-sm">No items to checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1
          className="text-4xl font-normal text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Checkout
        </h1>
        <CurrencySelector />
      </div>

      {soldOutBanner}

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
              {/* Card via Toss — only settles in KRW */}
              {displayCurrency === "KRW" && (
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

              {/* PayPal via Toss — for USD/EUR selection */}
              {displayCurrency !== "KRW" && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex flex-col items-start px-4 py-4 border text-left col-span-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 ${
                    paymentMethod === "paypal"
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F3EF]"
                      : "border-[#E8E6E2] text-[#1A1A1A] hover:border-[#4A4A4A]"
                  }`}
                >
                  <span className="text-xs font-medium tracking-[0.08em] mb-1">PayPal</span>
                  <span
                    className={`text-[10px] tracking-[0.05em] ${
                      paymentMethod === "paypal" ? "text-[#C0C0C0]" : "text-[#9A9A9A]"
                    }`}
                  >
                    via 토스페이먼츠
                  </span>
                </button>
              )}
            </div>
            {displayCurrency === "EUR" && (
              <p className="text-[11px] text-[#9A9A9A] mt-3">
                PayPal 결제 화면에서 유로(EUR) 등 실제 사용하시는 통화로 자동 환산되어
                표시됩니다.
              </p>
            )}
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
              : "Pay with PayPal"}
          </button>

          <p className="text-[11px] text-[#9A9A9A] text-center">
            {paymentMethod === "toss"
              ? "토스페이먼츠 · SSL 암호화 보안 결제"
              : "PayPal via 토스페이먼츠 · SSL 암호화 보안 결제"}
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
                  {formatPrice(convertToDisplay(item.price * item.quantity, item.currency), displayCurrency)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-sm text-[#4A4A4A]">Subtotal</span>
            <span className="text-sm text-[#1A1A1A]">
              {formatPrice(totalInDisplayCurrency, displayCurrency)}
            </span>
          </div>
          <div className="flex justify-between mb-6">
            <span className="text-sm text-[#4A4A4A]">Shipping</span>
            <span className="text-sm text-[#9A9A9A]">Calculated at next step</span>
          </div>
          <div className="flex justify-between border-t border-[#E8E6E2] pt-4">
            <span className="text-base font-medium text-[#1A1A1A]">Total</span>
            <span className="text-base font-medium text-[#1A1A1A]">
              {formatPrice(totalInDisplayCurrency, displayCurrency)}
            </span>
          </div>
          {displayCurrency !== "KRW" && (
            <p className="text-[10px] text-[#9A9A9A] text-center mt-4">
              실시간 환율 기준 예상 금액입니다
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
