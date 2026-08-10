import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * 고객이 결제창에서 취소/실패한 경우 pending_orders에 남은 임시 데이터를 정리한다.
 * anon key에는 pending_orders에 대한 DELETE 권한을 주지 않으므로(schema.sql 참고),
 * 클라이언트는 이 라우트를 통해서만 자신의 orderId 하나를 지울 수 있다.
 */
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    await supabase.from("pending_orders").delete().eq("order_id", orderId);

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[cancel-pending]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
