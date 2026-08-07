import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { paymentKey, orderId, amount, customer, items, currency } = await req.json();
  const cur = currency === "USD" ? "USD" : "KRW";

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encodedKey = Buffer.from(secretKey + ":").toString("base64");

  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!tossRes.ok) {
    const err = await tossRes.json();
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: dbError } = await supabase.from("orders").insert({
    order_number: orderId,
    customer_name: customer?.name ?? "",
    customer_email: customer?.email ?? "",
    customer_phone: customer?.phone ?? null,
    shipping_address: customer
      ? { address: customer.address, city: customer.city, country: customer.country }
      : null,
    items: items ?? [],
    total_amount: amount,
    currency: cur,
    payment_method: cur === "USD" ? "paypal" : "toss",
    payment_key: paymentKey,
    payment_status: "paid",
  });

  if (dbError) {
    console.warn("[orders] DB insert failed (table may not exist yet):", dbError.message);
  }

  return NextResponse.json({ success: true, orderId });
}
