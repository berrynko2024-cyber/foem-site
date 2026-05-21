import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { sessionId, customer, items, orderId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ success: false, error: "Payment not completed" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const orderNumber = orderId || session.id;
  const details = session.customer_details;

  await supabase.from("orders").insert({
    order_number: orderNumber,
    customer_name: customer?.name ?? details?.name ?? "",
    customer_email: customer?.email ?? details?.email ?? "",
    customer_phone: customer?.phone ?? details?.phone ?? null,
    shipping_address: customer
      ? { address: customer.address, city: customer.city, country: customer.country }
      : null,
    items: items ?? [],
    total_amount: session.amount_total ?? 0,
    payment_method: "stripe",
    payment_key: session.id,
    payment_status: "paid",
  });

  return NextResponse.json({ success: true, orderId: orderNumber });
}
