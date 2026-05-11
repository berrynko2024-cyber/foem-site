import Link from "next/link";

export default function AdminOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-[#9A9A9A] mb-8">
        <Link href="/admin" className="hover:text-[#1A1A1A] transition-colors">Admin</Link>
        <span>/</span>
        <span className="text-[#4A4A4A]">Orders</span>
      </div>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-10"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Orders
      </h1>

      <div className="border border-[#E8E6E2] p-12 text-center">
        <p
          className="text-2xl font-normal text-[#1A1A1A] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          No orders yet
        </p>
        <p className="text-sm text-[#9A9A9A]">
          Orders will appear here once Stripe and Supabase are connected in Phase 3.
        </p>
      </div>
    </div>
  );
}
