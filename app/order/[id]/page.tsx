import Link from "next/link";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center">
      <div className="w-12 h-12 border border-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-8">
        <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <p className="text-xs tracking-[0.2em] uppercase text-[#9A9A9A] mb-4">Order confirmed</p>

      <h1
        className="text-3xl font-normal text-[#1A1A1A] mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Thank you for your order
      </h1>

      <p className="text-sm text-[#4A4A4A] mb-2">
        Order #{id}
      </p>

      <p className="text-sm text-[#9A9A9A] leading-relaxed mb-10 max-w-md mx-auto">
        A confirmation email has been sent to you. Your artwork will be carefully packaged and shipped within 5–7 business days.
      </p>

      <div className="h-px w-16 bg-[#E8E6E2] mx-auto mb-10" />

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#1A1A1A] border border-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F5F3EF] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:ring-offset-2 active:scale-95"
      >
        Continue browsing
      </Link>
    </div>
  );
}
