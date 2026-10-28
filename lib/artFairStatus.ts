import { type ArtFair } from "./mockData";

/** 아트페어 상세 페이지 경로 — slug가 있으면 /art-fair/{slug}, 없으면 /art-fair/{id} */
export function artFairPath(fair: Pick<ArtFair, "id" | "slug">): string {
  return `/art-fair/${fair.slug ?? fair.id}`;
}

/**
 * DB·목데이터에 저장된 status 값 대신 오늘 날짜 기준으로 페어 상태를 계산한다.
 * 시작일~종료일(종료일 당일 포함) 사이면 "current",
 * 시작 전이면 "upcoming", 종료일이 지났으면 "past".
 * 날짜가 없으면 저장된 status를 그대로 사용한다.
 *
 * 이렇게 하면 페어가 열리는 날 자동으로 "On Now"가 되고,
 * 끝나면 자동으로 "Past"로 내려가 매번 수동으로 status를 바꿀 필요가 없다.
 */
export function resolveArtFairStatus(fair: ArtFair): ArtFair["status"] {
  if (!fair.startDate || !fair.endDate) return fair.status;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(fair.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(fair.endDate);
  end.setHours(23, 59, 59, 999);

  if (today < start) return "upcoming";
  if (today > end) return "past";
  return "current";
}

/** 상태 계산을 적용한 새 배열을 돌려준다. */
export function withResolvedStatus(fairs: ArtFair[]): ArtFair[] {
  return fairs.map((f) => ({ ...f, status: resolveArtFairStatus(f) }));
}

/**
 * 홈페이지 등에서 "지금 강조할 페어" 하나를 고른다.
 * 진행 중(current) 우선, 없으면 가장 임박한 예정(upcoming), 그것도 없으면 null.
 */
export function pickHighlightFair(fairs: ArtFair[]): ArtFair | null {
  const resolved = withResolvedStatus(fairs);
  const current = resolved
    .filter((f) => f.status === "current")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (current.length > 0) return current[0];

  const upcoming = resolved
    .filter((f) => f.status === "upcoming")
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (upcoming.length > 0) return upcoming[0];

  return null;
}
