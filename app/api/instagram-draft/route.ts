import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { artists, artworks, artFairs, exhibitions } from "@/lib/mockData";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "berrynko2024@gmail.com";
const CRON_SECRET = process.env.CRON_SECRET;

// 2주 체험 종료일 (2026-06-09)
const TRIAL_END = new Date("2026-06-09T23:59:59+09:00");

// 4일 사이클
const CYCLE = ["artwork", "artist", "fair", "brand"] as const;

const FOEM_CONTEXT = `
[FOEM 브랜드 컨텍스트]
FOEM(Field of Emotions) — 국내 독립 작가들의 원화를 소개·판매하는 온라인 큐레이션 갤러리.
철학: 작품을 장르가 아닌 감정으로 경험하게 한다.
소속 작가: Betty Moon(베티문, 사진), Uiyeong Park(박의영, 회화), Harin J(하린, 회화), Sung Eun Park(박성은, 회화)
아트페어 참가: Affordable Art Fair Hong Kong, ARTANKARA, AQUA Art Miami, Seoul Art Show 등
사이트: https://www.foem.co.kr | 인스타그램: @foem_korea
브랜드 컬러: 에메랄드 그린 (#268042), 따뜻한 크림 (#F6F4EB)
`;

const VIRAL_RULES = `
[2026 인스타그램 바이럴 전략 — 반드시 준수]

① 첫 줄 훅 (가장 중요):
   - 반드시 궁금증을 유발하거나 공감을 일으키는 한 문장으로 시작
   - 광고처럼 들리면 절대 안 됨. 사람처럼 말해야 함
   - 예시 패턴:
     • 반전: "좋은 그림을 고르는 법? 사실 고를 필요가 없습니다."
     • 공감: "텅 빈 벽이 불편한 사람들에게."
     • 궁금증: "이 작가는 왜 완성된 그림을 다시 덮어버릴까요."
     • FOMO: "이미 새 집을 찾은 작품입니다."
     • 충격: "이 작품, 홍콩에서 처음 공개한 날 세 분이 동시에 연락을 주셨어요."

② 캡션 구조 (카루셀 기준):
   - 1문장 훅 → 2~3문단 스토리 → 질문형 CTA → 링크
   - 총 200~350자 (짧고 밀도 있게)
   - 줄바꿈 적극 활용 (답답하면 안 읽음)
   - 마지막은 반드시 답할 수 있는 질문으로 끝낼 것

③ 저장 유도:
   - "저장해두면 나중에 도움이 되는" 정보나 인사이트 포함
   - "이런 느낌의 공간에 어울리는 작품" 같은 큐레이션 앵글 활용

④ 시리즈 포맷:
   - 작가 소개는 "작가를 알면 작품이 보인다 — Betty Moon 편" 형식
   - 작품 소개는 "오늘의 작품" 시리즈로 일관성 유지

⑤ 해시태그:
   - 한국어 10개 + 영어 10개 = 총 20개
   - 너무 큰 태그(팔로워 1억+) 피하고, 중간 규모 틈새 태그 우선
   - 작가 이름, 장르, 감정 키워드 반드시 포함
`;

function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

function buildPrompt(type: (typeof CYCLE)[number], dayIndex: number): { prompt: string; label: string } {
  if (type === "artwork") {
    const active = artworks.filter((a) => a.images[0]?.startsWith("/artworks/"));
    const work = active[dayIndex % active.length];
    const artist = artists.find((a) => a.id === work.artistId);
    const koName = artist?.name_ko?.split(" ")[0] ?? work.artistName;
    const soldNote = work.isSold ? "이미 판매된 작품 (FOMO 활용 가능)" : "현재 판매 중";

    return {
      label: `작품 — ${work.title} (${koName})`,
      prompt: `
당신은 바이럴 인스타그램 콘텐츠 전문가이자 FOEM 갤러리 에디터입니다.
아래 작품 정보로 인스타그램 포스팅 초안을 작성하세요.

${FOEM_CONTEXT}
${VIRAL_RULES}

[오늘의 작품 정보]
- 제목: ${work.title}${work.title_ko ? ` / ${work.title_ko}` : ""}
- 작가: ${work.artistName} (${artist?.name_ko ?? ""})
- 재료/크기: ${work.medium ?? "불명"} / ${work.dimensions ?? "불명"}
- 작품 설명: ${work.description_ko || work.description}
- 판매 상태: ${soldNote}
- 링크: https://www.foem.co.kr/shop/${work.id}

아래 형식을 정확히 지켜서 출력하세요:

━━━ 📱 캡션 ━━━
(첫 줄 훅 → 스토리 2~3문단 → 질문형 CTA → 링크)
(줄바꿈 활용, 200~350자)

━━━ 🗂️ 카루셀 슬라이드 구성 (6장) ━━━
슬라이드 1: [훅 텍스트만 — 배경 이미지 없이 타이포그래피]
슬라이드 2: [작품 전체 이미지 + 제목]
슬라이드 3: [작품 디테일 클로즈업 + 한 줄 설명]
슬라이드 4: [작가 사진 + 작가 이름]
슬라이드 5: [작가 한 줄 인용구 — bio에서 가장 강렬한 문장 추출]
슬라이드 6: [CTA 슬라이드 — "작품 보러 가기 @foem_korea"]

━━━ 📹 릴스 콘셉트 (선택) ━━━
(15~30초 릴스로 만든다면 어떤 장면 구성인지 — 구체적으로)

━━━ 🤖 Gemini 이미지 생성 프롬프트 ━━━
(아래 형식으로 영문 프롬프트 3개를 작성하세요. gemini.google.com에 바로 복붙해서 쓸 수 있게.)
(각 프롬프트는 한 줄, 100단어 이내 영문. 텍스트/글자 절대 포함 금지.)
(FOEM 브랜드 톤 필수: warm cream background #F6F4EB, emerald green #268042, minimal, emotional, fine art photography style, no text, no watermark)

[프롬프트 1 — 작품 분위기 무드보드]
(이 작품의 색감·감정·질감을 표현하는 이미지. 작품 자체를 그리는 게 아닌 "이 작품을 볼 때의 느낌"을 시각화)

[프롬프트 2 — 작품이 놓인 공간]
(이 작품이 실제 인테리어 공간에 걸린 장면. 따뜻하고 큐레이션된 거실 or 스튜디오)

[프롬프트 3 — 카루셀 커버용 훅 이미지]
(인스타 카루셀 첫 슬라이드에 쓸 배경 이미지. 타이포 없이 감성적인 배경만)

━━━ #️⃣ 해시태그 (20개) ━━━
(한국어 10개 + 영어 10개 / 줄바꿈 없이 한 줄)

━━━ ⏰ 게시 추천 시간 ━━━
(KST 기준, 이유 한 줄)
`,
    };
  }

  if (type === "artist") {
    const active = artists.filter((a) => a.artworkCount > 0);
    const artist = active[dayIndex % active.length];
    const koName = artist.name_ko?.split(" ")[0] ?? artist.name;
    const seriesNum = Math.floor(dayIndex / 4) + 1;

    return {
      label: `작가 — ${artist.name} (${koName}) 시리즈 #${seriesNum}`,
      prompt: `
당신은 바이럴 인스타그램 콘텐츠 전문가이자 FOEM 갤러리 에디터입니다.
아래 작가 정보로 "작가를 알면 작품이 보인다" 시리즈 포스팅을 작성하세요.

${FOEM_CONTEXT}
${VIRAL_RULES}

[작가 정보]
- 이름: ${artist.name} / ${artist.name_ko ?? ""}
- 장르: ${artist.id === "a1" ? "파인아트 사진" : "회화"}
- 영문 소개: ${artist.bio.slice(0, 400)}
- 한글 소개: ${artist.bio_ko.slice(0, 400)}
- 인스타그램: ${artist.instagram ?? "없음"}
- 작가 페이지: https://www.foem.co.kr/artists/${artist.slug}
- 시리즈 번호: #${seriesNum}

핵심: 이 작가에 대한 "아무도 안 물어봤지만 알면 충격인 사실" 하나를 bio에서 발굴해서 훅으로 쓸 것.

아래 형식을 정확히 지켜서 출력하세요:

━━━ 📱 캡션 ━━━
(시리즈 제목: "작가를 알면 작품이 보인다 — ${koName} 편" 포함)
(충격적이거나 반전 있는 첫 줄 훅 필수)
(200~350자, 줄바꿈 활용)

━━━ 🗂️ 카루셀 슬라이드 구성 (7장) ━━━
슬라이드 1: [시리즈 타이틀 + 훅 질문]
슬라이드 2: [작가 프로필 사진]
슬라이드 3: [작가 배경 — 한 문장 + 이미지]
슬라이드 4: [작업 철학 — 가장 인상적인 한 줄]
슬라이드 5: [대표 작품 1 이미지]
슬라이드 6: [대표 작품 2 이미지]
슬라이드 7: [CTA — "작가 페이지 → @foem_korea"]

━━━ 📹 릴스 콘셉트 (선택) ━━━
(작가 스토리를 15~30초로 — 어떤 장면 구성인지)

━━━ 🤖 Gemini 이미지 생성 프롬프트 ━━━
(아래 형식으로 영문 프롬프트 3개를 작성하세요. gemini.google.com에 바로 복붙해서 쓸 수 있게.)
(각 프롬프트는 한 줄, 100단어 이내 영문. 텍스트/글자 절대 포함 금지.)
(FOEM 브랜드 톤 필수: warm cream background #F6F4EB, emerald green #268042, minimal, emotional, fine art photography style, no text, no watermark)

[프롬프트 1 — 작가 작업실/창작 분위기]
(이 작가가 작업하는 공간의 감성. 장르·철학에 맞는 빛과 질감)

[프롬프트 2 — 작가 작품 세계 무드보드]
(이 작가의 대표 작품들을 연상시키는 색감·형태·감정의 시각화)

[프롬프트 3 — 카루셀 커버용 훅 이미지]
(인스타 카루셀 첫 슬라이드에 쓸 배경 이미지. 타이포 없이 감성적인 배경만)

━━━ #️⃣ 해시태그 (20개) ━━━
(작가 이름 한글/영문 반드시 포함, 한국어 10 + 영어 10)

━━━ ⏰ 게시 추천 시간 ━━━
(KST 기준, 이유 한 줄)
`,
    };
  }

  if (type === "fair") {
    const active = [...artFairs.filter((f) => f.status === "current" || f.status === "upcoming"),
      ...artFairs.filter((f) => f.status === "past").slice(0, 2)];
    const current = artFairs.find((f) => f.status === "current");
    const upcoming = artFairs.find((f) => f.status === "upcoming");
    const currentExhibitions = exhibitions.filter((e) => e.status === "current" || e.status === "upcoming");

    const context = [
      current ? `진행 중 아트페어: ${current.name} (${current.location}, ~${current.endDate})` : null,
      upcoming ? `예정 아트페어: ${upcoming.name} (${upcoming.location}, ${upcoming.startDate})` : null,
      currentExhibitions.length > 0
        ? `진행/예정 전시: ${currentExhibitions.slice(0, 2).map((e) => `${e.title} (~${e.endDate})`).join(", ")}`
        : null,
      `과거 참가 이력: ${artFairs.filter((f) => f.status === "past").map((f) => f.name).join(", ")}`,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      label: "아트페어/전시 현장",
      prompt: `
당신은 바이럴 인스타그램 콘텐츠 전문가이자 FOEM 갤러리 에디터입니다.
아트페어/전시 참가를 알리는 "현장 다이어리" 형식의 포스팅을 작성하세요.

${FOEM_CONTEXT}
${VIRAL_RULES}

[현재 상황]
${context}

전략: 아트페어를 "우리가 목격한 것들" 내러티브로 전달. 홍보가 아닌 리포트 느낌.
훅 예시: "홍콩에서 한국 작가를 가장 오래 본 관객은 외국인이었습니다."

아래 형식을 정확히 지켜서 출력하세요:

━━━ 📱 캡션 ━━━
(현장 다이어리 or 인사이트 리포트 형식)
(첫 줄: 페어/전시에서 목격한 반전 or 인사이트)
(200~350자, 줄바꿈 활용)

━━━ 🗂️ 카루셀 슬라이드 구성 (8장) ━━━
슬라이드 1: [훅 텍스트 — 가장 인상적인 현장 한 줄]
슬라이드 2: [페어/전시 명칭 + 장소 + 날짜]
슬라이드 3~5: [현장 사진 3장 — 각각 짧은 캡션 제안]
슬라이드 6: [참가 작가 소개]
슬라이드 7: [작품 하이라이트 1~2점]
슬라이드 8: [다음 페어/전시 예고 or CTA]

━━━ 📹 릴스 콘셉트 (선택) ━━━
(페어 현장 30초 브이로그 스타일 — 어떤 장면 구성)

━━━ 🤖 Gemini 이미지 생성 프롬프트 ━━━
(아래 형식으로 영문 프롬프트 3개를 작성하세요. gemini.google.com에 바로 복붙해서 쓸 수 있게.)
(각 프롬프트는 한 줄, 100단어 이내 영문. 텍스트/글자 절대 포함 금지.)
(FOEM 브랜드 톤 필수: warm cream background #F6F4EB, emerald green #268042, minimal, emotional, fine art photography style, no text, no watermark)

[프롬프트 1 — 아트페어 현장 분위기]
(화이트큐브 부스, 감성적인 조명, 관람객 실루엣 or 작품 클로즈업)

[프롬프트 2 — 해당 도시/장소 분위기]
(페어가 열린 도시의 감성. 건축, 빛, 공기감)

[프롬프트 3 — 카루셀 커버용 훅 이미지]
(인스타 카루셀 첫 슬라이드에 쓸 배경 이미지. 타이포 없이 감성적인 배경만)

━━━ #️⃣ 해시태그 (20개) ━━━
(페어명, 도시명, 아트페어 관련 영문 태그 포함)

━━━ ⏰ 게시 추천 시간 ━━━
`,
    };
  }

  // brand
  const brandAngles = [
    { hook: "한국 작가가 해외에서 더 비싸지는 이유", angle: "국내 작가 해외 진출 스토리" },
    { hook: "그림을 '사는' 사람과 '고르는' 사람의 차이", angle: "컬렉터 심리 인사이트" },
    { hook: "오프라인 전시가 끝나면 작품도 사라진다 — FOEM이 시작된 이유", angle: "FOEM 창업 스토리" },
    { hook: "감정으로 작품을 고른다는 게 무슨 말일까", angle: "FOEM 철학 — Field of Emotions" },
  ];
  const angle = brandAngles[dayIndex % brandAngles.length];

  return {
    label: `브랜드 스토리 — ${angle.angle}`,
    prompt: `
당신은 바이럴 인스타그램 콘텐츠 전문가이자 FOEM 갤러리 에디터입니다.
FOEM의 브랜드 철학을 담은 "저장하고 싶은" 포스팅을 작성하세요.

${FOEM_CONTEXT}
${VIRAL_RULES}

[오늘의 앵글]
훅: "${angle.hook}"
주제: ${angle.angle}

전략: 브랜드 홍보처럼 보이면 실패. 갤러리 운영자가 솔직하게 털어놓는 이야기처럼 쓸 것.
"저장해두고 나중에 읽고 싶다"는 느낌이 드는 인사이트를 1개 이상 포함.

아래 형식을 정확히 지켜서 출력하세요:

━━━ 📱 캡션 ━━━
(첫 줄: 위의 훅 변형 or 더 강한 버전)
(브랜드 스토리 or 인사이트 — 독백 형식 허용)
(200~350자, 줄바꿈 활용)

━━━ 🗂️ 카루셀 슬라이드 구성 (6장) ━━━
슬라이드 1: [훅 타이포그래피 슬라이드]
슬라이드 2~4: [핵심 메시지 3개 — 각 슬라이드 1개씩, 짧고 강하게]
슬라이드 5: [FOEM 작품/작가 이미지]
슬라이드 6: [CTA — "foem.co.kr에서 만나보세요"]

━━━ 📹 릴스 콘셉트 (선택) ━━━
(이 스토리를 20~30초 릴스로 만든다면)

━━━ 🤖 Gemini 이미지 생성 프롬프트 ━━━
(아래 형식으로 영문 프롬프트 3개를 작성하세요. gemini.google.com에 바로 복붙해서 쓸 수 있게.)
(각 프롬프트는 한 줄, 100단어 이내 영문. 텍스트/글자 절대 포함 금지.)
(FOEM 브랜드 톤 필수: warm cream background #F6F4EB, emerald green #268042, minimal, emotional, fine art photography style, no text, no watermark)

[프롬프트 1 — 오늘 브랜드 스토리 주제 시각화]
(오늘의 훅/앵글을 감성 이미지로 표현. 추상적이어도 좋음)

[프롬프트 2 — FOEM 갤러리/큐레이션 공간]
(큐레이션된 온라인 갤러리 or 작은 독립 갤러리 공간의 감성)

[프롬프트 3 — 카루셀 커버용 훅 이미지]
(인스타 카루셀 첫 슬라이드에 쓸 배경 이미지. 타이포 없이 감성적인 배경만)

━━━ #️⃣ 해시태그 (20개) ━━━

━━━ ⏰ 게시 추천 시간 ━━━
`,
  };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (new Date() > TRIAL_END) {
    return NextResponse.json({ ok: false, message: "2주 체험 종료. 계속 여부를 논의하세요." });
  }

  const { searchParams } = new URL(request.url);
  const forceType = searchParams.get("type") as (typeof CYCLE)[number] | null;

  const dayIndex = getDayIndex();
  const type = (forceType && CYCLE.includes(forceType)) ? forceType : CYCLE[dayIndex % 4];
  const { prompt, label } = buildPrompt(type, dayIndex);
  const today = new Date().toLocaleDateString("ko-KR");

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const draft = content.text;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ADMIN_EMAIL,
      subject: `[FOEM 인스타] ${label} — ${today}`,
      html: `
        <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 660px; margin: 0 auto; background: #ffffff;">

          <!-- 헤더 -->
          <div style="background: #268042; padding: 20px 28px;">
            <p style="margin: 0; color: #a8d4b8; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">FOEM Instagram Draft</p>
            <h2 style="margin: 6px 0 0; color: #ffffff; font-size: 17px; font-weight: 600;">${label}</h2>
            <p style="margin: 4px 0 0; color: #a8d4b8; font-size: 12px;">${today}</p>
          </div>

          <!-- 안내 배너 -->
          <div style="background: #F6F4EB; border-left: 3px solid #268042; padding: 12px 20px; margin: 0;">
            <p style="margin: 0; font-size: 12px; color: #5a9e72; line-height: 1.6;">
              📋 <strong>사용 방법</strong><br>
              1. 캡션 복사 → 인스타그램 붙여넣기<br>
              2. Gemini 프롬프트 복사 → <a href="https://gemini.google.com" style="color: #268042;">gemini.google.com</a> 에서 이미지 생성<br>
              3. 카루셀 슬라이드 구성 참고해서 이미지 배열
            </p>
          </div>

          <!-- 본문 -->
          <div style="padding: 24px 28px;">
            <div style="white-space: pre-wrap; line-height: 2; font-size: 14px; color: #1a1a1a; font-family: 'Courier New', monospace; background: #fafafa; padding: 20px; border-radius: 6px; border: 1px solid #e8e8e8;">${draft.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          </div>

          <!-- 푸터 -->
          <div style="padding: 16px 28px; border-top: 1px solid #e8e8e8;">
            <p style="margin: 0; font-size: 11px; color: #aaa;">
              2주 체험 종료일: 2026-06-09 · FOEM — Field of Emotions
            </p>
          </div>

        </div>
      `,
    });

    return NextResponse.json({ ok: true, type, label });
  } catch (error) {
    console.error("Instagram draft error:", error);
    return NextResponse.json({ error: "Failed to generate draft" }, { status: 500 });
  }
}
