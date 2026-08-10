import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendOrderEmails } from "@/lib/orderEmail";

async function cancelTossPayment(paymentKey: string, reason: string) {
  const secretKey = process.env.TOSS_SECRET_KEY!;
  const encodedKey = Buffer.from(secretKey + ":").toString("base64");
  try {
    await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancelReason: reason }),
    });
  } catch (e) {
    console.error("[Confirm] Failed to auto-cancel payment after lost race:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await req.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. pending_orders에서 임시 주문 정보 조회
    const { data: pendingOrder, error: pendingError } = await supabase
      .from("pending_orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (pendingError || !pendingOrder) {
      console.error("Pending order not found:", pendingError);
      return NextResponse.json({ error: "Order session not found or expired" }, { status: 400 });
    }

    // 결제 요청 금액과 승인 요청 금액 불일치 검증
    if (Number(pendingOrder.amount) !== Number(amount)) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // [사전 가드] 승인 API를 부를 필요도 없이, 이미 품절된 게 뻔한 경우 조기 차단 (완전한 동시성 보장은 아래 3번 원자적 업데이트가 담당)
    const items = pendingOrder.items ?? [];
    const itemIds = items.map((i: { id: string }) => i.id);

    const { data: dbArtworks, error: artFetchError } = await supabase
      .from("artworks")
      .select("id, title, is_sold")
      .in("id", itemIds);

    if (artFetchError) {
      console.error("Failed to check artworks stock:", artFetchError.message);
      return NextResponse.json({ error: "Failed to verify items availability" }, { status: 500 });
    }

    const soldOutItem = dbArtworks?.find((art) => art.is_sold);
    if (soldOutItem) {
      console.warn(`[Confirm Guard] Blocked purchase of already sold out item: ${soldOutItem.title}`);
      return NextResponse.json({
        error: `죄송합니다. 작품 [${soldOutItem.title}]은(는) 이미 판매 완료(Sold Out)되었습니다.`,
      }, { status: 400 });
    }

    // 2. Toss Payments 승인 API 호출
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

    // 3. [동시구매 최종 가드] 승인은 이미 끝났으므로, 여기서부터는 "누가 먼저 팔았는지"를 원자적으로 확정한다.
    //    is_sold=false 조건이 걸린 UPDATE라서, 동시에 두 요청이 들어와도 DB 레벨에서 단 하나만 성공한다.
    //    (사전 체크만으로는 두 결제 모두 Toss 승인까지 통과할 수 있어 막을 수 없는 진짜 레이스 컨디션 지점)
    const wonItemIds: string[] = [];
    for (const item of items) {
      const { data: updated, error: artError } = await supabase
        .from("artworks")
        .update({ is_sold: true, stock: 0 })
        .eq("id", item.id)
        .eq("is_sold", false)
        .select("id");

      if (artError) {
        console.error(`[Confirm] Failed to atomically mark artwork ${item.id} as sold:`, artError.message);
      } else if (updated && updated.length > 0) {
        wonItemIds.push(item.id);
      }
    }

    const lostItems = items.filter((i: { id: string }) => !wonItemIds.includes(i.id));
    if (lostItems.length > 0) {
      // 늦게 도착한 결제 — 이미 실제 카드 승인은 났으니 즉시 취소(환불) 처리하고 주문은 만들지 않는다.
      console.warn(`[Confirm] Lost race for items: ${lostItems.map((i: { id: string }) => i.id).join(", ")}. Auto-cancelling payment ${paymentKey}.`);
      await cancelTossPayment(paymentKey, "선택하신 작품이 방금 다른 고객에게 먼저 판매되어 결제가 자동 취소되었습니다.");
      // 이번 시도로 다른 작품 일부가 먼저 팔렸다면 그 부분은 되돌린다 (부분 판매 방지)
      for (const wonId of wonItemIds) {
        await supabase.from("artworks").update({ is_sold: false, stock: 1 }).eq("id", wonId);
      }
      return NextResponse.json({
        error: `죄송합니다. 작품 [${lostItems[0].title ?? lostItems[0].id}]이(가) 결제 처리 중 다른 고객에게 먼저 판매되었습니다. 결제는 자동 취소됩니다.`,
      }, { status: 409 });
    }

    // 4. orders 테이블에 최종 주문 내역 적재 (중복 인서트 방지)
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", orderId)
      .maybeSingle();

    if (!existingOrder) {
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
        console.error("[orders] DB insert failed:", dbError.message);
        return NextResponse.json({ error: "Failed to save order to database" }, { status: 500 });
      }

      // 주문이 새로 생성됐을 때만 발송 (중복 발송 방지). 실패해도 주문 처리는 계속 진행.
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
    }

    // 5. 성공 시 pending_orders 테이블에서 임시 데이터 삭제
    await supabase.from("pending_orders").delete().eq("order_id", orderId);

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
