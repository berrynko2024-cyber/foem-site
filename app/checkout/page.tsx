"use client";

import { useState } from "react";
import { useCart } from "@/store/CartContext";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "KR",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Stripe checkout will be wired here in Phase 3
    // For now, simulate the flow
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: form }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("결제 연동 준비 중입니다. Phase 3에서 Stripe 설정 후 활성화됩니다.");
    } finally {
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xs tracking-[0.15em] uppercase bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 focus:ring-offset-[#F5F3EF] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Processing…" : "Pay with Stripe"}
          </button>

          <p className="text-[11px] text-[#9A9A9A] text-center">
            Secure payment powered by Stripe · SSL encrypted
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
