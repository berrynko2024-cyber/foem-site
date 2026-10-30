import type { Metadata } from "next";
import type { Artwork } from "@/lib/mockData";

/**
 * 한국어 검색용 제목·설명 문구.
 * 제목은 "한글명 영문명 — 분야 | FOEM 포엠" 순서, 설명은 검색 결과에서 잘리지 않는 80~100자.
 * og/twitter 설명도 같은 문구를 써야 X(트위터) 공유 카드가 루트 기본 문구로 고정되지 않는다.
 */

const SITE = "https://www.foem.co.kr";
const DEFAULT_OG_IMAGE = { url: "/og-main.png", width: 2172, height: 1258, alt: "FOEM — Field of Emotion" };

export const HOME_SEO = {
  title: "FOEM 포엠 | 글로벌 컨템포러리 아트 · 작품 구매",
  description:
    "유럽·아시아 아트페어에서 주목받은 컨템포러리 작가들의 회화, 사진, 유리, 조각. 포엠(FOEM)에서 소장하세요. 정품 인증서 포함, 해외 배송.",
};

export const ARTISTS_SEO = {
  title: "작가 소개 — 회화·사진·유리·조각 | FOEM 포엠",
  description:
    "베티문, 이영재, 서병관, 박의영, 박성은, 하린, 정재은, 임하정. 포엠과 함께하는 작가 8인의 작품 세계와 원화를 만나보세요.",
};

/** 목록 페이지는 제목·설명에 더해 페이지 상단에 보이는 한글 소개(intro)도 함께 둔다 — 화면 글이 거의 영어뿐이라 한국어 검색에 걸릴 본문이 부족했음. */
export const SHOP_SEO = {
  title: "작품 구매 — 회화·사진·유리·조각 원화 | FOEM 포엠",
  description:
    "베티문, 박의영, 박성은, 하린, 서병관, 이영재 등 포엠 작가들의 회화·사진·유리·조각 원화를 온라인으로 소장하세요. 정품 인증서 포함, 해외 배송.",
  intro:
    "포엠(FOEM) 작가들의 회화, 사진, 유리, 조각 원화를 한곳에서 만나보세요. 모든 작품은 정품 인증서와 함께 보내드리며 해외 배송도 가능합니다.",
};

export const ART_FAIR_SEO = {
  title: "아트페어 — 베를린·홍콩·앙카라·마이애미 | FOEM 포엠",
  description:
    "포엠은 Positions Berlin, Affordable Art Fair Hong Kong, ARTANKARA, AQUA Art Miami 등 해외 아트페어에서 한국 컨템포러리 작가들을 소개합니다.",
  intro:
    "포엠(FOEM)은 유럽·아시아·미국의 아트페어에서 한국 컨템포러리 작가들을 소개합니다. 2026년 베를린 Positions Berlin Art Fair, 앙카라 ARTANKARA, 홍콩 Affordable Art Fair, 서울 BANK Art Fair에 참가했고, 2025년에는 마이애미 AQUA Art Miami와 서울아트쇼에 참여했습니다.",
};

export const EXHIBITIONS_SEO = {
  title: "전시 — 포엠 작가 개인전·단체전 | FOEM 포엠",
  description:
    "베티문 사진전 「beyond the frame」, 수원시립만석미술관 「빛, 그림을 그리다」, 포엠 단체전 「Field of Emotions」 등 포엠 작가들의 전시 소식.",
  intro:
    "포엠 작가들이 참여한 개인전과 단체전을 소개합니다. 진행 중인 전시와 예정된 전시, 지난 전시 기록을 한곳에서 볼 수 있습니다.",
};

export const ABOUT_SEO = {
  title: "포엠 소개 — 서울 강남 컨템포러리 아트 갤러리 | FOEM 포엠",
  description:
    "포엠(FOEM, Field of Emotions)은 감각과 의미 사이를 탐구하는 작가들과 함께하는 서울 강남의 컨템포러리 아트 갤러리입니다. 화–토 오전 11시–오후 6시.",
};

type ArtistSeo ={ nameKo: string; nameEn: string; title: string; description: string };

export const ARTIST_SEO: Record<string, ArtistSeo> = {
  "betty-moon": {
    nameKo: "베티문",
    nameEn: "Betty Moon",
    title: "베티문 Betty Moon — 파인아트 사진가 | FOEM 포엠",
    description:
      "제주 오름과 캘리포니아 사막에서 빛이 바뀌는 순간을 기다려 담는 파인아트 사진가 베티문(문유경). 아카이벌 피그먼트 프린트 작품 구매·문의.",
  },
  "young-jae-lee": {
    nameKo: "이영재",
    nameEn: "Young Jae Lee",
    title: "이영재 Young Jae Lee — 캐스트 글라스 작가 | FOEM 포엠",
    description:
      "녹인 유리를 틀에 부어 빛을 형태로 굳히는 캐스트 글라스 작가 이영재. 고요한 시간과 계절의 순간을 담은 유리 작품을 소개하고 판매합니다.",
  },
  "byeong-gwan-seo": {
    nameKo: "서병관",
    nameEn: "Byeong Gwan Seo",
    title: "서병관 Byeong Gwan Seo — 철 조각가 | FOEM 포엠",
    description:
      "철로 구조와 부재를 탐구하는 조각가 서병관. 선악과를 주제로 한 「The Forbidden Fruit」 연작 등 철 조각 작품을 소개하고 판매합니다.",
  },
  "uiyeong-park": {
    nameKo: "박의영",
    nameEn: "Uiyeong Park",
    title: "박의영 Uiyeong Park — 추상 회화 작가 | FOEM 포엠",
    description:
      "프랑스 노르망디 레지던시에서 만난 전통 줄무늬를 푸른색과 선의 리듬으로 풀어낸 화가 박의영. 「contenir」「dam da」 연작 원화를 만나보세요.",
  },
  "sung-eun-park": {
    nameKo: "박성은",
    nameEn: "Sung Eun Park",
    title: "박성은 Sung Eun Park — 회화 작가 | FOEM 포엠",
    description:
      "순금을 입힌 말이 전통 산수화 위를 떠다니는 「Golden Horse」 연작. 정신적 자유와 자기 수용을 그리는 작가 박성은의 원화를 소개합니다.",
  },
  "harin-j": {
    nameKo: "하린",
    nameEn: "Harin J",
    title: "하린 Harin J — 추상 회화 작가 | FOEM 포엠",
    description:
      "존재와 부재 사이, 사라져 가는 빛과 기억을 캔버스 위에 쌓아 올리는 추상 화가 하린(제은숙). 회화 원화를 소개하고 판매합니다.",
  },
  "jae-eun-jeong": {
    nameKo: "정재은",
    nameEn: "Jae Eun Jeong",
    title: "정재은 Jae Eun Jeong — 회화 작가 | FOEM 포엠",
    description:
      "선과 색면, 건축적 이미지로 기억과 현재 사이의 '간격'을 그리는 화가 정재은. 「Interval」「구조와 속력으로」 연작 원화 구매 문의.",
  },
  "ha-jeong-lim": {
    nameKo: "임하정",
    nameEn: "Ha Jeong Lim",
    title: "임하정 Ha Jeong Lim — 유리 설치 작가 | FOEM 포엠",
    description:
      "색유리와 철사로 빛이 공간을 바꾸는 설치 작품을 만드는 작가 임하정. 2026 수원시립미술관 2인전 「Painting with Light」 참여.",
  },
};

/** 작품 상세 페이지용 제목·설명 템플릿 (작품이 많아 개별 작성 대신 자동 생성). */
export function artworkSeo(work: Artwork, artistSlug?: string) {
  const artist = artistSlug ? ARTIST_SEO[artistSlug] : undefined;
  const nameKo = artist?.nameKo;
  const nameEn = artist?.nameEn ?? work.artistName;
  const byline = nameKo ? `${nameKo} ${nameEn}` : nameEn;

  const specs = [work.medium, work.dimensions].filter(Boolean).join(", ");
  const year = work.year ? `(${work.year})` : "";

  return {
    title: `${work.title} — ${byline} | FOEM 포엠`,
    description: `${nameKo ?? nameEn} 작가의 「${work.title}」${year}.${specs ? ` ${specs}.` : ""} 정품 인증서 포함 원화 구매·문의는 FOEM.`,
  };
}

/**
 * title은 루트 레이아웃의 "%s | FOEM" 템플릿을 거치지 않도록 absolute로 넣고,
 * og/twitter에도 같은 문구를 채운다.
 */
export function buildSeoMetadata({
  title,
  description,
  path,
  images,
}: {
  title: string;
  description: string;
  path: string;
  images?: { url: string; alt?: string; width?: number; height?: number }[];
}): Metadata {
  const url = `${SITE}${path}`;
  // 하위 페이지의 openGraph/twitter는 루트 값을 통째로 덮어쓰므로 이미지가 없으면 기본 OG 이미지를 다시 넣는다.
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE];
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "FOEM",
      type: "website",
      locale: "ko_KR",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
    alternates: { canonical: url },
  };
}
