"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { artworks, artists } from "@/lib/mockData";

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Incorrect password.");
        setPassword("");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    router.refresh();
  };

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-2 text-center">
            FOEM
          </p>
          <h1
            className="text-2xl font-normal text-[#1A1A1A] mb-10 text-center"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Admin access
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E8E6E2] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-xs tracking-[0.15em] uppercase bg-[#1A1A1A] text-[#F5F3EF] hover:bg-[#2D2D2D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking…" : "Enter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const soldWorks = artworks.filter((a) => a.isSold).length;
  const totalRevenue = artworks.filter((a) => a.isSold).reduce((s, a) => s + a.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-1">FOEM</p>
          <h1
            className="text-3xl font-normal text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Admin dashboard
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs tracking-[0.12em] uppercase text-[#9A9A9A] hover:text-[#1A1A1A] transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E8E6E2] mb-12">
        {[
          { label: "Total artworks", value: artworks.length },
          { label: "Artists", value: artists.length },
          { label: "Sold works", value: soldWorks },
          { label: "Revenue (mock)", value: totalRevenue.toLocaleString("ko-KR") + "원" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#F5F3EF] p-6">
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#9A9A9A] mb-2">{label}</p>
            <p
              className="text-2xl font-normal text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E8E6E2]">
        {[
          { href: "/admin/inquiries", label: "Artwork inquiries", description: "View and manage artwork purchase inquiries" },
          { href: "/admin/consulting", label: "Consulting requests", description: "View and manage art consulting applications" },
          { href: "/admin/subscribers", label: "Mailing list", description: "View all mailing list subscribers" },
          { href: "/admin/orders", label: "Orders", description: "Track and manage customer orders" },
          { href: "/admin/artworks", label: "Manage artworks", description: "Add, edit, or remove works from the shop" },
          { href: "/admin/artists", label: "Manage artists", description: "Add new artists and update profiles" },
        ].map(({ href, label, description }) => (
          <Link
            key={href}
            href={href}
            className="group bg-[#F5F3EF] p-8 flex flex-col justify-between min-h-[180px] hover:bg-[#EFEDE8] transition-colors"
          >
            <div>
              <h2
                className="text-lg font-normal text-[#1A1A1A] mb-2 group-hover:text-[#4A4A4A] transition-colors"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {label}
              </h2>
              <p className="text-sm text-[#9A9A9A]">{description}</p>
            </div>
            <span className="text-xs tracking-[0.15em] uppercase text-[#9A9A9A] group-hover:text-[#1A1A1A] transition-colors mt-6">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
