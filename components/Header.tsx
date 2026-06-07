"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/store/CartContext";

const NAV_LEFT = [
  { href: "/", label: "Home" },
  { href: "/video", label: "Video" },
  { href: "/artists", label: "Artists" },
  { href: "/art-fair", label: "Art Fair" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/consulting", label: "Consulting" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/join", label: "Join" },
];

const NAV_RIGHT = [
  { href: "https://www.instagram.com/we_are_tide/", label: "Instagram", external: true },
];

const navLinkClass =
  "text-[12px] tracking-[0.18em] uppercase text-[#1a5c30] hover:opacity-60 transition-opacity duration-200";

export default function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F6F4EB]">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LEFT.map(({ href, label }) => (
            <Link key={href} href={href} className={navLinkClass}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_RIGHT.map(({ href, label, external }) => (
            <a
              key={href}
              href={href}
              className={navLinkClass}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {label}
            </a>
          ))}
          <Link href="/cart" className={navLinkClass}>
            Cart{totalItems > 0 ? ` (${totalItems})` : " ↗"}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1">
            <span className={`block h-px bg-[#268042] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-px bg-[#268042] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-[#268042] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#F6F4EB]">
          <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
            {[
              ...NAV_LEFT,
              { href: "/cart", label: `Cart (${totalItems})` },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[11px] tracking-[0.22em] uppercase text-[#268042]"
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
