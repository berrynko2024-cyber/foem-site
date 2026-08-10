import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * 고객이 결제창을 켠 채 이탈(브라우저 종료, 네트워크 끊김 등)해서
 * /order/fail도, /order/success도 거치지 못한 pending_orders를 하루 지나면 정리한다.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("pending_orders")
    .delete()
    .lt("created_at", cutoff)
    .select("order_id");

  if (error) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }

  return NextResponse.json({
    status: "ok",
    deleted: data?.length ?? 0,
    ran_at: new Date().toISOString(),
  });
}
