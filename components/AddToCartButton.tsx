"use client";

import { useState } from "react";
import { useCart } from "@/store/CartContext";
import type { Artwork } from "@/lib/mockData";

export default function AddToCartButton({ work }: { work: Artwork }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: work.id,
      title: work.title,
      artist: work.artistName,
      price: work.price,
      image: work.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
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
  );
}
