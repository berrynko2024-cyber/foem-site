import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { name, email, phone, message } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  const { error: dbError } = await supabase.from("join_inquiries").insert({
    name,
    email,
    phone: phone || null,
    message: message || null,
  });

  if (dbError) {
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }

  await Promise.all([
    resend.emails.send({
      from: "FOEM <onboarding@resend.dev>",
      to: "berrynko2024@gmail.com",
      subject: `새 작가 참여 문의 — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">새 작가 참여 문의가 접수되었습니다</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #9A9A9A; width: 110px; vertical-align: top;">성함</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #9A9A9A; vertical-align: top;">이메일</td>
              <td style="padding: 10px 0;">${email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #9A9A9A; vertical-align: top;">연락처</td>
              <td style="padding: 10px 0;">${phone || "—"}</td>
            </tr>
            ${message ? `<tr><td style="padding: 10px 0; color: #9A9A9A; vertical-align: top;">메시지</td><td style="padding: 10px 0; white-space: pre-wrap;">${message}</td></tr>` : ""}
          </table>
        </div>
      `,
    }),
    resend.emails.send({
      from: "FOEM <onboarding@resend.dev>",
      to: email,
      subject: "참여 문의가 접수되었습니다 — FOEM",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1A1A1A;">
          <h1 style="font-size: 22px; font-weight: normal; margin-bottom: 20px;">문의해 주셔서 감사합니다.</h1>
          <p style="font-size: 14px; line-height: 1.8; color: #4A4A4A;">
            <strong>${name}</strong>님의 참여 문의가 정상적으로 접수되었습니다.<br>
            검토 후 빠른 시일 내에 연락드리겠습니다.
          </p>
          <p style="font-size: 12px; color: #9A9A9A; margin-top: 48px; border-top: 1px solid #eee; padding-top: 16px;">
            Field of Emotions — foem.co.kr
          </p>
        </div>
      `,
    }),
  ]);

  return NextResponse.json({ success: true });
}
