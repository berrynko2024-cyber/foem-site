import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";


export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("mailing_list")
    .insert({ email });

  if (dbError && dbError.code !== "23505") {
    return NextResponse.json({ error: "Failed to save email" }, { status: 500 });
  }

  await Promise.all([
    resend.emails.send({
      from: "FOEM <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to FOEM",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1A1A1A;">
          <h1 style="font-size: 28px; font-weight: normal; margin-bottom: 16px;">Thank you for subscribing.</h1>
          <p style="font-size: 15px; line-height: 1.7; color: #4A4A4A;">
            You're now on the FOEM mailing list. We'll be in touch with new works, exhibitions, and art fair news.
          </p>
          <p style="font-size: 13px; color: #9A9A9A; margin-top: 40px;">
            Field of Emotions — foem.art
          </p>
        </div>
      `,
    }),
    resend.emails.send({
      from: "FOEM <onboarding@resend.dev>",
      to: "berrynko2024@gmail.com",
      subject: `New subscriber: ${email}`,
      html: `
        <p style="font-family: sans-serif;">새 구독자가 등록되었습니다.</p>
        <p style="font-family: sans-serif; font-size: 18px;"><strong>${email}</strong></p>
      `,
    }),
  ]);

  return NextResponse.json({ success: true });
}
