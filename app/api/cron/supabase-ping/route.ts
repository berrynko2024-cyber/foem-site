import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.from("mailing_list").select("count").limit(1);

  if (error) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "berrynko2024@gmail.com",
      subject: "FOEM — Supabase 연결 실패",
      html: `
        <p><strong>Supabase가 응답하지 않습니다.</strong></p>
        <p>오류: ${error.message}</p>
        <p>수동 재개: <a href="https://supabase.com/dashboard">supabase.com/dashboard</a></p>
        <p>발생 시각: ${new Date().toISOString()}</p>
      `,
    });

    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: "ok", pinged_at: new Date().toISOString() });
}
