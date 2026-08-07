"use client";

import { useCart } from "@/store/CartContext";
import type { Currency } from "@/lib/currency";

const OPTIONS: { value: Currency; label: string }[] = [
  { value: "KRW", label: "KRW ₩" },
  { value: "USD", label: "USD $" },
  { value: "EUR", label: "EUR €" },
];

export default function CurrencySelector() {
  const { displayCurrency, setDisplayCurrency } = useCart();

  return (
    <div className="inline-flex border border-[#E8E6E2]">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setDisplayCurrency(opt.value)}
          className={`px-3 py-2 text-[11px] tracking-[0.1em] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-1 ${
            displayCurrency === opt.value
              ? "bg-[#1A1A1A] text-[#F5F3EF]"
              : "text-[#4A4A4A] hover:bg-[#F5F3EF]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
