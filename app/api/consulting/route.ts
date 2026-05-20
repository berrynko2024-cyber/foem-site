import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { mediums, mediumOther, vibe, vibeOther, size, placement, spaceOther, name, email, phone } =
    await req.json();

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  const { error: dbError } = await supabase.from("consulting_requests").insert({
    mediums: mediums?.length ? mediums : null,
    medium_other: mediumOther || null,
    vibe: vibe || null,
    vibe_other: vibeOther || null,
    artwork_size: size || null,
    placement: placement || null,
    space_other: spaceOther || null,
    name,
    email,
    phone,
  });

  if (dbError) {
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }

  const mediumLabel: Record<string, string> = {
    photography: "사진 (Fine Art Photography)",
    "painting-figurative": "회화 · 구상",
    "painting-non-figurative": "회화 · 비구상",
    craft: "공예",
  };
  const vibeLabel: Record<string, string> = {
    oriental: "동양적 여백",
    geometric: "기하학적 구조",
    lyrical: "서정적 서사",
    minimal: "미니멀 & 정제",
    bold: "대담한 에너지",
  };
  const sizeLabel: Record<string, string> = {
    large: "대형 (160cm+)",
    medium: "중소형 (100cm 내외)",
    custom: "공간 맞춤형",
  };
  const placementLabel: Record<string, string> = {
    living: "거실",
    dining: "다이닝",
    lobby: "오피스 로비",
    private: "서재 / 프라이빗 룸",
    commercial: "상업 공간 / 갤러리",
  };

  const mediumsText = [
    ...(mediums?.map((m: string) => mediumLabel[m] ?? m) ?? []),
    ...(mediumOther ? [`기타: ${mediumOther}`] : []),
  ].join(", ") || "—";

  const vibeText = [
    vibe ? (vibeLabel[vibe] ?? vibe) : "",
    vibeOther ? `기타: ${vibeOther}` : "",
  ].filter(Boolean).join(", ") || "—";

  await Promise.all([
    resend.emails.send({
      from: "FOEM <onboarding@resend.dev>",
      to: "berrynko2024@gmail.com",
      subject: `새 아트 컨설팅 신청 — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 20px;">새 아트 컨설팅 신청이 접수되었습니다</h2>
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
              <td style="padding: 10px 0;">${phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #9A9A9A; vertical-align: top;">관심 매체</td>
              <td style="padding: 10px 0;">${mediumsText}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #9A9A9A; vertical-align: top;">미학적 경향</td>
              <td style="padding: 10px 0;">${vibeText}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #9A9A9A; vertical-align: top;">작품 크기</td>
              <td style="padding: 10px 0;">${size ? (sizeLabel[size] ?? size) : "—"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; color: #9A9A9A; vertical-align: top;">설치 공간</td>
              <td style="padding: 10px 0;">${placement ? (placementLabel[placement] ?? placement) : "—"}</td>
            </tr>
            ${spaceOther ? `<tr><td style="padding: 10px 0; color: #9A9A9A; vertical-align: top;">공간 메모</td><td style="padding: 10px 0;">${spaceOther}</td></tr>` : ""}
          </table>
        </div>
      `,
    }),
    resend.emails.send({
      from: "FOEM <onboarding@resend.dev>",
      to: email,
      subject: "아트 컨설팅 신청이 접수되었습니다 — FOEM",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1A1A1A;">
          <h1 style="font-size: 22px; font-weight: normal; margin-bottom: 20px;">신청해 주셔서 감사합니다.</h1>
          <p style="font-size: 14px; line-height: 1.8; color: #4A4A4A;">
            <strong>${name}</strong>님의 아트 컨설팅 신청이 정상적으로 접수되었습니다.<br>
            담당자가 검토 후 빠른 시일 내에 연락드리겠습니다.
          </p>
          <p style="font-size: 12px; color: #9A9A9A; margin-top: 48px; border-top: 1px solid #eee; padding-top: 16px;">
            Field of Emotions — foem.art
          </p>
        </div>
      `,
    }),
  ]);

  return NextResponse.json({ success: true });
}
