import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const { orderId, customer, items, currency, amount } = await request.json();

    if (!orderId || !customer || !items || !currency || amount === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // pending_orders 테이블에 임시 주문 내역 적재
    const { error } = await supabase.from("pending_orders").upsert({
      order_id: orderId,
      customer,
      items,
      currency,
      amount,
      status: "pending",
    });

    if (error) {
      console.error("Failed to insert pending order:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
