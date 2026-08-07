import { NextResponse } from "next/server";

// Rough fallback if the live FX API is unreachable, so checkout never breaks.
// Approximate KRW pivot rates as of 2026-08.
const FALLBACK_RATES = { USD: 0.0007, EUR: 0.00061 };

export async function GET() {
  try {
    const res = await fetch("https://api.frankfurter.dev/v1/latest?base=KRW&symbols=USD,EUR", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`frankfurter ${res.status}`);
    const data = await res.json();
    return NextResponse.json({
      rates: { USD: data.rates.USD, EUR: data.rates.EUR },
      date: data.date,
      source: "frankfurter",
    });
  } catch {
    return NextResponse.json({ rates: FALLBACK_RATES, date: null, source: "fallback" });
  }
}
