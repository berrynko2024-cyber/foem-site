"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/store/CartContext";
import { formatPrice } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import { getBlurDataUrl } from "@/lib/blurUrl";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, displayCurrency, convertToDisplay, totalInDisplayCurrency } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h1
          className="text-3xl font-normal text-[#1A1A1A] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Your cart is empty
        </h1>
        <p className="text-sm text-[#9A9A9A] mb-10">
          Add works from the shop to begin.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#1A1A1A] border border-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F3EF] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-95"
        >
          Browse works
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="flex items-center justify-between mb-14 flex-wrap gap-4">
        <h1
          className="text-4xl font-normal text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Cart ({totalItems})
        </h1>
        <CurrencySelector />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2 space-y-px bg-[#E8E6E2]">
          {items.map((item) => (
            <div key={item.id} className="flex gap-5 bg-[#F5F3EF] p-5">
              <Link href={`/shop/${item.id}`} className="flex-shrink-0">
                <div className="relative w-24 h-28 bg-[#E8E6E2] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                    placeholder="blur"
                    blurDataURL={getBlurDataUrl(item.image)}
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-1">
                  {item.artist}
                </p>
                <Link href={`/shop/${item.id}`}>
                  <h3
                    className="text-base font-normal text-[#1A1A1A] mb-3 hover:text-[#4A4A4A] transition-colors"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {item.title}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-[#E8E6E2]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#E8E6E2] transition-colors focus:outline-none"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm text-[#1A1A1A]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#4A4A4A] hover:text-[#1A1A1A] hover:bg-[#E8E6E2] transition-colors focus:outline-none"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {formatPrice(
                          convertToDisplay(item.price * item.quantity, item.currency),
                          displayCurrency
                        )}
                      </p>
                      {item.currency !== displayCurrency && (
                        <p className="text-[10px] text-[#9A9A9A]">
                          ≈ {formatPrice(item.price * item.quantity, item.currency)} 기준 환산
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors focus:outline-none"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border border-[#E8E6E2] p-6 sticky top-24">
            <h2
              className="text-lg font-normal text-[#1A1A1A] mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Order summary
            </h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-[#E8E6E2]">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-sm text-[#4A4A4A] truncate max-w-[60%]">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-sm text-[#1A1A1A] flex-shrink-0 ml-2">
                    {formatPrice(
                      convertToDisplay(item.price * item.quantity, item.currency),
                      displayCurrency
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mb-8">
              <span className="text-sm font-medium text-[#1A1A1A]">Total</span>
              <span className="text-lg font-medium text-[#1A1A1A]">
                {formatPrice(totalInDisplayCurrency, displayCurrency)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full py-4 text-center text-xs tracking-[0.15em] uppercase bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 focus:ring-offset-[#F5F3EF] active:scale-[0.98]"
            >
              Proceed to checkout
            </Link>

            {displayCurrency !== "KRW" && (
              <p className="text-[10px] text-[#9A9A9A] text-center mt-3">
                실시간 환율 기준 예상 금액이며 결제 화면에서 최종 확정됩니다
              </p>
            )}

            <p className="text-[11px] text-[#9A9A9A] text-center mt-4">
              Shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
