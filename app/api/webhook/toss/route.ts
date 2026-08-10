import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendOrderEmails } from "@/lib/orderEmail";

/**
 * Toss 웹훅 검증 방식
 *
 * body.secret 필드는 가상계좌(무통장입금) DEPOSIT_CALLBACK 이벤트에만 존재하며,
 * 이 라우트가 처리하는 일반 카드결제 PAYMENT_STATUS_CHANGED 이벤트에는 애초에 없다.
 * (https://docs.tosspayments.com/reference/using-api/webhook-events)
 * 따라서 웹훅 본문의 값은 신뢰하지 않고, paymentKey로 Toss 결제 조회 API를 직접 호출해
 * 서버가 스스로 결제 상태/금액을 재확인한다.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, data } = body;

    if (eventType !== "PAYMENT_STATUS_CHANGED" || data?.status !== "DONE") {
      return NextResponse.json({ received: true, status: "ignored_event" });
    }

    const { orderId, paymentKey } = data;
    if (!orderId || !paymentKey) {
      return NextResponse.json({ error: "Missing orderId or paymentKey" }, { status: 400 });
    }

    // Toss 결제 조회 API로 실제 결제 상태를 서버에서 직접 재확인 (웹훅 본문은 신뢰하지 않음)
    const secretKey = process.env.TOSS_SECRET_KEY!;
    const encodedKey = Buffer.from(secretKey + ":").toString("base64");

    const verifyRes = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
      headers: { Authorization: `Basic ${encodedKey}` },
    });

    if (!verifyRes.ok) {
      console.error(`[Webhook] Failed to verify payment ${paymentKey} with Toss`);
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const verified = await verifyRes.json();

    if (verified.status !== "DONE" || verified.orderId !== orderId) {
      console.error(`[Webhook] Verified payment does not match: ${JSON.stringify(verified)}`);
      return NextResponse.json({ error: "Payment status/orderId mismatch" }, { status: 400 });
    }

    const amount = verified.totalAmount;

    let supabase;
    try {
      supabase = getSupabaseAdmin();
    } catch (e) {
      console.error("[Webhook]", e instanceof Error ? e.message : e);
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // 1. 이미 해당 주문이 orders 테이블에 등록되었는지 조회 (멱등성 — 중복 처리 방지)
    const { data: existingOrder, error: checkError } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", orderId)
      .maybeSingle();

    if (checkError) {
      console.error("[Webhook] Failed to query existing order:", checkError.message);
      return NextResponse.json({ error: "Database query error" }, { status: 500 });
    }

    if (existingOrder) {
      console.info(`[Webhook] Order ${orderId} already processed via client redirect.`);
      return NextResponse.json({ success: true, status: "already_processed" });
    }

    // 2. 클라이언트 이탈로 누락된 경우 pending_orders에서 복구
    console.info(`[Webhook] Order ${orderId} not found in DB. Restoring from pending_orders…`);

    const { data: pendingOrder, error: pendingError } = await supabase
      .from("pending_orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (pendingError || !pendingOrder) {
      console.error(`[Webhook] Pending order ${orderId} not found for restoration:`, pendingError?.message);
      return NextResponse.json({ error: "Pending order not found" }, { status: 200 });
    }

    // 결제 금액 검증 — Toss가 실제로 확인해준 금액과 비교 (웹훅 body 값 아님)
    if (Number(pendingOrder.amount) !== Number(amount)) {
      console.error(`[Webhook] Amount mismatch for order ${orderId}. Expected ${pendingOrder.amount}, got ${amount}`);
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // 3. orders 테이블에 주문 데이터 강제 적재
    const cur = pendingOrder.currency === "USD" ? "USD" : "KRW";
    const { error: dbError } = await supabase.from("orders").insert({
      order_number: orderId,
      customer_name: pendingOrder.customer?.name ?? "",
      customer_email: pendingOrder.customer?.email ?? "",
      customer_phone: pendingOrder.customer?.phone ?? null,
      shipping_address: pendingOrder.customer
        ? {
            address: pendingOrder.customer.address,
            city: pendingOrder.customer.city,
            country: pendingOrder.customer.country,
          }
        : null,
      items: pendingOrder.items ?? [],
      total_amount: amount,
      currency: cur,
      payment_method: cur === "USD" ? "paypal" : "toss",
      payment_key: paymentKey,
      payment_status: "paid",
    });

    if (dbError) {
      console.error("[Webhook] Failed to force insert order to DB:", dbError.message);
      return NextResponse.json({ error: "Database insert error" }, { status: 500 });
    }

    // 3-1. 신규 주문이 이 경로로 처음 생성됐을 때만 발송 (order가 이미 있었다면 위에서 이미 return됨 — 중복 발송 없음)
    await sendOrderEmails({
      orderId,
      customerName: pendingOrder.customer?.name ?? "",
      customerEmail: pendingOrder.customer?.email ?? "",
      customerPhone: pendingOrder.customer?.phone ?? null,
      shippingAddress: pendingOrder.customer
        ? {
            address: pendingOrder.customer.address,
            city: pendingOrder.customer.city,
            country: pendingOrder.customer.country,
          }
        : null,
      items: pendingOrder.items ?? [],
      amount,
      currency: cur,
      paymentMethod: cur === "USD" ? "paypal" : "toss",
    });

    // 4. 품절 처리 (원자적 업데이트 — confirm 라우트와 동일한 방식)
    //    이미 결제는 Toss에서 완료 확인된 상태이므로, 레이스에서 졌더라도 주문 자체는 생성한다.
    //    (자동 취소는 confirm 라우트의 주 경로에서 처리되고, 이 웹훅 복구 경로는 드문 폴백이라 수동 확인 대상으로 로그만 남긴다.)
    const items = pendingOrder.items ?? [];
    for (const item of items) {
      const { data: updated } = await supabase
        .from("artworks")
        .update({ is_sold: true, stock: 0 })
        .eq("id", item.id)
        .eq("is_sold", false)
        .select("id");

      if (!updated || updated.length === 0) {
        console.warn(`[Webhook] Artwork ${item.id} was already sold — order ${orderId} may need manual review (double sale via recovery path).`);
      }
    }

    // 5. 성공 시 pending_orders 삭제
    await supabase.from("pending_orders").delete().eq("order_id", orderId);

    console.info(`[Webhook] Order ${orderId} successfully restored and saved to DB.`);
    return NextResponse.json({ success: true, restored: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[Webhook] Error processing Toss webhook:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
