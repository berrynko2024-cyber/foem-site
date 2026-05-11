"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/store/CartContext";

export default function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/logo.png"
            alt="FOEM"
            width={80}
            height={36}
            className="object-contain"
            style={{ width: "auto", height: "36px" }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { href: "/shop", label: "Shop" },
            { href: "/artists", label: "Artists" },
            { href: "/art-fair", label: "Art Fair" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-[0.15em] uppercase text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Cart + Mobile menu */}
        <div className="flex items-center gap-6">
          <Link
            href="/cart"
            className="relative hidden md:flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors duration-200"
          >
            Cart
            {totalItems > 0 && (
              <span className="ml-1 bg-[#1A1A1A] text-[#F5F0E8] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 space-y-1">
              <span className={`block h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#E5E0D8] bg-[#F5F0E8]">
          <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {[
              { href: "/shop", label: "Shop" },
              { href: "/artists", label: "Artists" },
              { href: "/art-fair", label: "Art Fair" },
              { href: "/cart", label: `Cart (${totalItems})` },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm tracking-[0.15em] uppercase text-[#4A4A4A]"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
