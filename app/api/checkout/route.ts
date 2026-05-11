import { NextResponse } from "next/server";

// Stripe checkout will be fully implemented in Phase 3
// after STRIPE_SECRET_KEY is provided in .env.local

export async function POST() {
  return NextResponse.json(
    { message: "Stripe not yet configured. Please complete Phase 3 setup." },
    { status: 503 }
  );
}
