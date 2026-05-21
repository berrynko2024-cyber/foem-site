import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { artists, artworks } from "@/lib/mockData";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "berrynko2024@gmail.com";
const CRON_SECRET = process.env.CRON_SECRET;

// 4주 사이클 주제
const TOPICS = ["foem", "artist", "artwork", "consulting"] as const;
const START_WEEK = 21; // 2026년 21번째 주부터 시작

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
}

const FOEM_STORY = `
FOEM 브랜드 스토리 (모든 포스팅에 맥락으로 활용):

[왜 시작했는가]
국내 작가들이 실력이 있어도 알려질 채널이 턱없이 부족하다는 문제를 직접 느꼈다.
오프라인 전시회는 공간과 시간의 한계가 명확하다 — 전시 기간이 끝나면 작품도, 작가도 사라진다.
그 한계를 넘어서기 위해 FOEM을 시작했다.

[무엇을 하는가]
FOEM(Field of Emotions, 감정의 장)은 독립 작가들의 원화를 소개하고 판매하는 큐레이션 플랫폼이다.
루이지애나 채널(Louisiana Channel)처럼 '살아있는 예술 아카이브'를 지향한다.
작품을 장르가 아닌 감정으로 경험하게 한다.

[궁극적인 목표]
국내 작가들의 해외 진출 발판을 만드는 것.
KIAF, Frieze Seoul, Art Busan 등 국제 아트페어 참가를 통해 한국 작가를 세계에 알린다.
오프라인의 한계를 온라인으로 극복하고, 온라인의 깊이를 오프라인으로 완성한다.

[브랜드 철학]
"이곳은 단순한 갤러리가 아니라, 예술이 만들어내는 감정의 장이다."
작가와 컬렉터, 그리고 예술을 처음 접하는 사람 모두가 연결되는 공간.
`;

const SEO_RULES = `
네이버 블로그 검색 최적화 필수 규칙:
1. 글자 수: 본문 최소 2,000자 이상 (해시태그 제외)
2. 제목: 25~35자, 핵심 검색 키워드를 제목 앞쪽에 배치
3. 소제목: 3~5개 사용 (▶ 또는 ✅ 이모지로 시작하면 가독성 향상)
4. 키워드: 핵심 키워드를 본문에 자연스럽게 5~8회 반복
5. 첫 문단: 핵심 키워드와 글의 요약을 150자 이내로 작성
6. 문단: 3~4문장마다 줄바꿈, 한 문단 최대 5줄
7. 해시태그: 20개 (주제 키워드 + 연관 키워드 + 브랜드 키워드 혼합)
8. 마무리: 독자에게 공감/댓글/이웃추가 유도 문장 포함
`;

function buildPrompt(topicIndex: number): string {
  const topic = TOPICS[topicIndex % 4];

  if (topic === "artist") {
    const activeArtists = artists.filter((a) => a.artworkCount > 0);
    const artist = activeArtists[Math.floor(getWeekNumber() / 4) % activeArtists.length];
    const koName = artist.name_ko?.split(" ")[0] ?? artist.name;
    return `
당신은 FOEM(Field of Emotion) 갤러리의 블로그 에디터입니다.
아래 작가 정보를 바탕으로 네이버 블로그용 포스팅을 한국어로 작성해주세요.

${FOEM_STORY}
${SEO_RULES}

작가 정보:
- 이름: ${artist.name} (${artist.name_ko ?? ""})
- 작가 소개: ${artist.bio_ko}

구성 (이 순서대로 작성):
1. 제목: "[작가 소개] ${koName} — (감성적인 부제목)" 형식, 핵심 키워드 포함
2. 첫 문단: 독자의 관심을 끄는 도입 (150자 이내 요약 포함)
3. ▶ ${koName}는 누구인가 (작가 소개, 300자 이상)
4. ▶ ${koName}의 작품 세계 (작품 철학과 특징, 500자 이상)
5. ▶ 작품에서 느껴지는 감정 (독자 공감 유도, 300자 이상)
6. ▶ FOEM에서 ${koName} 작품 만나기 (구매/감상 안내, 200자 이상)
7. 마무리: 공감/댓글 유도 + 링크
   "FOEM에서 ${artist.name}의 작품을 만나보세요 👉 https://www.foem.co.kr/artists/${artist.slug}"
8. 해시태그 20개: #${koName} #${artist.name} #현대미술 #아트갤러리 #원화 #그림구매 #작가소개 #FOEM 등 포함

핵심 키워드 (본문에 자연스럽게 반복): ${koName}, FOEM, 현대미술, 원화, 작가
`;
  }

  if (topic === "artwork") {
    const activeWorks = artworks.filter(
      (a) => !a.isSold && a.images[0]?.startsWith("/artworks/")
    );
    const work = activeWorks[getWeekNumber() % activeWorks.length];
    const artist = artists.find((a) => a.id === work.artistId);
    const koName = artist?.name_ko?.split(" ")[0] ?? work.artistName;
    return `
당신은 FOEM(Field of Emotion) 갤러리의 블로그 에디터입니다.
아래 작품 정보를 바탕으로 네이버 블로그용 포스팅을 한국어로 작성해주세요.

${FOEM_STORY}
${SEO_RULES}

작품 정보:
- 제목: ${work.title}
- 작가: ${work.artistName} (${artist?.name_ko ?? ""})
- 재료: ${work.medium ?? ""}
- 크기: ${work.dimensions ?? ""}
- 작가 작품 세계: ${artist?.bio_ko ?? ""}

구성 (이 순서대로 작성):
1. 제목: 검색 키워드 포함, 클릭하고 싶은 감성적 제목 (예: "이 그림 앞에서 멈추게 되는 이유 — ${koName}의 '${work.title}'")
2. 첫 문단: 작품을 처음 본 순간의 감정 묘사 + 요약 (150자 이내)
3. ▶ 작품 소개 — '${work.title}' (작품 기본 정보 + 감성적 묘사, 400자 이상)
4. ▶ 이 작품이 특별한 이유 (작품 해석과 의미, 400자 이상)
5. ▶ 작가 ${koName}의 작품 세계 (작가 소개, 300자 이상)
6. ▶ 나의 공간에 이 작품이 있다면 (인테리어/감상 제안, 300자 이상)
7. ▶ 구매 안내 (가격 정책, 컨설팅 안내, 200자 이상)
8. 마무리: 공감/댓글 유도 + 링크
   "작품 상세 보기 👉 https://www.foem.co.kr/shop/${work.id}"
9. 해시태그 20개: #${koName} #원화구매 #그림구매 #현대미술 #아트갤러리 #인테리어그림 #FOEM 등 포함

핵심 키워드: ${koName}, 원화, 현대미술, FOEM, 그림구매
`;
  }

  if (topic === "consulting") {
    const topics = [
      "처음 원화를 살 때 반드시 알아야 할 5가지",
      "우리 집 공간에 어울리는 그림 고르는 법",
      "아트 컨설팅이란? 전문가에게 그림 추천받는 방법",
      "그림 투자 vs 감상용 구매, 어떻게 다를까?",
    ];
    const chosenTopic = topics[getWeekNumber() % topics.length];
    return `
당신은 FOEM(Field of Emotion) 갤러리의 블로그 에디터입니다.
아트 컨설팅을 주제로 네이버 블로그용 포스팅을 한국어로 작성해주세요.

${FOEM_STORY}
${SEO_RULES}

주제: "${chosenTopic}"

구성 (이 순서대로 작성):
1. 제목: 주제를 그대로 활용하되 검색 키워드 강화
2. 첫 문단: 독자의 고민/상황 공감 + 글 요약 (150자 이내)
3. ✅ 소제목1 (핵심 내용 첫 번째, 400자 이상)
4. ✅ 소제목2 (핵심 내용 두 번째, 400자 이상)
5. ✅ 소제목3 (핵심 내용 세 번째, 400자 이상)
6. ✅ 소제목4 (핵심 내용 네 번째, 300자 이상)
7. ▶ FOEM 아트 컨설팅 서비스 소개 (무료 컨설팅 안내, 300자 이상)
8. 마무리: 공감/댓글 유도 + 링크
   "FOEM 무료 아트 컨설팅 신청 👉 https://www.foem.co.kr/consulting"
9. 해시태그 20개: #아트컨설팅 #그림추천 #원화구매 #인테리어그림 #현대미술 #FOEM #그림고르는법 등 포함

핵심 키워드: 아트컨설팅, 원화, 그림추천, FOEM, 인테리어그림
`;
  }

  // foem
  const foemTopics = [
    "국내 작가들의 해외 진출을 돕는 온라인 갤러리 FOEM 이야기",
    "오프라인 전시의 한계를 넘어 — FOEM이 온라인 갤러리를 시작한 이유",
    "FOEM 작가들이 참가한 국제 아트페어 이야기 — KIAF, Frieze Seoul, Art Busan",
  ];
  const chosenFoemTopic = foemTopics[getWeekNumber() % foemTopics.length];
  return `
당신은 FOEM(Field of Emotion) 갤러리의 블로그 에디터입니다.
FOEM 갤러리를 소개하는 네이버 블로그용 포스팅을 한국어로 작성해주세요.

${FOEM_STORY}
${SEO_RULES}

주제: "${chosenFoemTopic}"

구성 (이 순서대로 작성):
1. 제목: 주제를 활용한 검색 최적화 제목
2. 첫 문단: 공감 가는 문제 제기 — "좋은 작가는 많은데, 알려질 곳이 없다" (150자 이내)
3. ▶ FOEM을 시작하게 된 이유 (창업 배경 — 작가 홍보 채널 부족, 오프라인 한계, 해외 진출 필요성, 400자 이상)
4. ▶ FOEM이란 무엇인가 (브랜드 철학 — '감정의 장', 루이지애나 채널 같은 살아있는 아카이브 지향, 400자 이상)
5. ▶ FOEM의 작가들 (소속 작가 소개 — 베티문, 박의영, 하린, 박성은 등, 400자 이상)
6. ▶ 주제 관련 핵심 내용 (아트페어/해외 진출/온라인 갤러리 등, 400자 이상)
7. ▶ FOEM에서 할 수 있는 것들 (원화 구매, 아트 컨설팅, 300자 이상)
8. 마무리: "예술은 전시장에서만 만나는 것이 아닙니다" 류의 감성적 마무리 + 공감/이웃추가 유도
   "FOEM 둘러보기 👉 https://www.foem.co.kr"
9. 해시태그 20개: #FOEM #아트갤러리 #현대미술 #원화갤러리 #온라인갤러리 #국내작가 #한국작가 #해외아트페어 #작가지원 #원화구매 #베티문 #박성은 등 포함

핵심 키워드: FOEM, 국내작가, 아트갤러리, 원화, 온라인갤러리, 아트페어
`;
}

export async function GET(request: Request) {
  // Vercel Cron 요청 검증
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekNumber = getWeekNumber();
  const topicIndex = (weekNumber - START_WEEK + 4) % 4;
  const topicNames = ["FOEM 소개", "작가 소개", "작품 소개", "아트 컨설팅 팁"];
  const topicName = topicNames[topicIndex];

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: buildPrompt(topicIndex),
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const blogPost = content.text;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ADMIN_EMAIL,
      subject: `[FOEM 블로그 초안] ${topicName} — ${new Date().toLocaleDateString("ko-KR")}`,
      html: `
        <div style="font-family: sans-serif; max-width: 700px; margin: 0 auto; padding: 24px;">
          <div style="background: #268042; color: white; padding: 16px 24px; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0; font-size: 18px;">FOEM 주간 블로그 초안</h2>
            <p style="margin: 4px 0 0; opacity: 0.8; font-size: 14px;">${topicName} · ${new Date().toLocaleDateString("ko-KR")}</p>
          </div>
          <div style="background: #f9f9f7; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #666; font-size: 13px; margin-top: 0;">아래 내용을 복사해서 네이버 블로그에 붙여넣으세요.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
            <div style="white-space: pre-wrap; line-height: 1.8; font-size: 15px; color: #1a1a1a;">${blogPost.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, topic: topicName, week: weekNumber });
  } catch (error) {
    console.error("Blog draft error:", error);
    return NextResponse.json({ error: "Failed to generate draft" }, { status: 500 });
  }
}
