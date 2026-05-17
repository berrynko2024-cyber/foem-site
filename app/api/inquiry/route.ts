import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { artworkId, artworkTitle, artistName, name, email, phone, message } = await req.json();

  if (!artworkId || !name || !email) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  const { error: dbError } = await supabase.from("inquiries").insert({
    artwork_id: artworkId,
    artwork_title: artworkTitle,
    artist_name: artistName,
    name,
    email,
    phone: phone || null,
    message: message || null,
  });

  if (dbError) {
    return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
  }

  await Promise.all([
    resend.emails.send({
      from: "FOEM <onboarding@resend.dev>",
      to: "berrynko2024@gmail.com",
      subject: `새 작품 문의 — ${artworkTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">새 작품 문의가 접수되었습니다</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #9A9A9A; width: 80px;">작품</td><td style="padding: 8px 0;">${artworkTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #9A9A9A;">작가</td><td style="padding: 8px 0;">${artistName}</td></tr>
            <tr><td style="padding: 8px 0; color: #9A9A9A;">이름</td><td style="padding: 8px 0;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #9A9A9A;">이메일</td><td style="padding: 8px 0;">${email}</td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #9A9A9A;">연락처</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
            ${message ? `<tr><td style="padding: 8px 0; color: #9A9A9A; vertical-align: top;">메시지</td><td style="padding: 8px 0;">${message}</td></tr>` : ""}
          </table>
        </div>
      `,
    }),
    resend.emails.send({
      from: "FOEM <onboarding@resend.dev>",
      to: email,
      subject: `문의 접수 확인 — ${artworkTitle}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1A1A1A;">
          <h1 style="font-size: 24px; font-weight: normal; margin-bottom: 16px;">문의해 주셔서 감사합니다.</h1>
          <p style="font-size: 14px; line-height: 1.7; color: #4A4A4A;">
            <strong>${artworkTitle}</strong>에 대한 문의가 접수되었습니다.<br>
            빠른 시일 내에 연락드리겠습니다.
          </p>
          <p style="font-size: 12px; color: #9A9A9A; margin-top: 40px;">
            Field of Emotions — foem.art
          </p>
        </div>
      `,
    }),
  ]);

  return NextResponse.json({ success: true });
}
