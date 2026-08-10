import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { cancelTossPayment } from "@/lib/toss";

type OrderItem = { id: string };

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: "주문을 찾을 수 없습니다" }, { status: 404 });
  }
  if (order.payment_status !== "paid") {
    return NextResponse.json(
      { error: `이미 처리된 주문입니다 (현재 상태: ${order.payment_status})` },
      { status: 409 }
    );
  }
  if (!order.payment_key) {
    return NextResponse.json({ error: "결제 키가 없어 취소할 수 없습니다" }, { status: 400 });
  }

  // 1. Toss 실제 결제 취소 — 이게 성공해야만 아래 DB 롤백을 진행한다 (역순 금지: 카드 취소 안 됐는데
  //    작품만 다시 판매 가능 상태가 되면 이중판매 위험).
  const cancelResult = await cancelTossPayment(order.payment_key, "관리자 요청에 의한 주문 취소");
  if (!cancelResult.success) {
    return NextResponse.json(
      { error: `Toss 결제 취소 실패: ${cancelResult.error}` },
      { status: 502 }
    );
  }

  // 2. 주문 상태 변경
  const { error: updateError } = await supabase
    .from("orders")
    .update({ payment_status: "cancelled" })
    .eq("id", id);

  if (updateError) {
    console.error(`[Admin Cancel] Toss 취소는 성공했지만 주문 상태 업데이트 실패 (order ${id}):`, updateError.message);
    return NextResponse.json(
      { error: "결제는 취소됐지만 주문 상태 반영에 실패했습니다. 수동으로 확인해주세요." },
      { status: 500 }
    );
  }

  // 3. 작품 품절 상태 롤백
  const items: OrderItem[] = order.items ?? [];
  for (const item of items) {
    const { error: artError } = await supabase
      .from("artworks")
      .update({ is_sold: false, stock: 1 })
      .eq("id", item.id);

    if (artError) {
      console.error(`[Admin Cancel] Failed to roll back artwork ${item.id}:`, artError.message);
    }
  }

  return NextResponse.json({ success: true });
}
