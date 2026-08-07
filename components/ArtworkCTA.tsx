"use client";

import { useState } from "react";
import { useCart } from "@/store/CartContext";
import InquiryForm from "@/components/InquiryForm";
import type { Artwork } from "@/lib/mockData";

export default function ArtworkCTA({ work }: { work: Artwork }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);

  const handleAdd = () => {
    addItem({
      id: work.id,
      title: work.title,
      artist: work.artistName,
      price: work.price,
      currency: work.currency ?? "KRW",
      image: work.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (work.isSold) {
    return (
      <div className="w-full py-4 text-center text-xs tracking-[0.15em] uppercase text-[#9A9A9A] border border-[#E8E6E2]">
        This work has been sold
      </div>
    );
  }

  if (work.priceDisplay === "문의") {
    return (
      <InquiryForm
        artworkId={work.id}
        artworkTitle={work.title}
        artistName={work.artistName}
      />
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleAdd}
        className={`w-full py-4 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F5F3EF] active:scale-[0.98] ${
          added
            ? "bg-[#4A4A4A] text-[#F5F3EF] focus:ring-[#4A4A4A]"
            : "bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] focus:ring-[#1A1A1A]"
        }`}
      >
        {added ? "Added to cart ✓" : "Add to cart"}
      </button>

      <button
        onClick={() => setShowInquiry((prev) => !prev)}
        className="w-full py-3 text-xs tracking-[0.15em] uppercase text-[#4A4A4A] border border-[#E8E6E2]
          hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 focus:ring-offset-[#F5F3EF]
          active:scale-[0.98]"
      >
        {showInquiry ? "닫기 · Close" : "구매 문의 · Inquiry"}
      </button>

      {showInquiry && (
        <div className="pt-2">
          <InquiryForm
            artworkId={work.id}
            artworkTitle={work.title}
            artistName={work.artistName}
          />
        </div>
      )}
    </div>
  );
}
