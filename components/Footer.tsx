import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#d4e8da] bg-[#F6F4EB] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase font-medium text-[#268042] mb-3">
              FOEM
            </p>
            <p className="text-xs text-[#5a9e72] leading-relaxed max-w-xs">
              Field of Emotion — a platform for independent artists to share and sell original works.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#5a9e72] mb-4">
              Navigate
            </p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/shop", label: "Shop" },
                { href: "/artists", label: "Artists" },
                { href: "/cart", label: "Cart" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-[#268042] hover:opacity-60 transition-opacity duration-200"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#5a9e72] mb-4">
              Info
            </p>
            <div className="flex flex-col gap-2.5">
              <p className="text-xs text-[#268042]">
                All works are original and authenticated.
              </p>
              <p className="text-xs text-[#268042]">
                Worldwide shipping available.
              </p>
              <a
                href="mailto:hello@foem.art"
                className="text-xs text-[#268042] hover:opacity-60 transition-opacity duration-200"
              >
                hello@foem.art
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#d4e8da] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#5a9e72] tracking-wide">
            © {new Date().getFullYear()} FOEM — Field of Emotion. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-[11px] text-[#5a9e72] hover:text-[#268042] transition-colors duration-200"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
