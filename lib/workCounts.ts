import type { Artist } from "@/lib/mockData";

type WorkLike = { artistId: string; isSold?: boolean };

export type ArtistWithCounts = Artist & { availableCount: number };

/**
 * artists.artwork_count는 수동 관리 값이라 실제 작품 수와 어긋날 수 있다.
 * 실제 작품 목록에서 작가별 전체/판매 가능 개수를 다시 세어 덮어쓴다.
 * 작품 목록이 비어 있으면(DB 조회 실패 등) 기존 artworkCount를 그대로 둔다.
 */
export function withLiveWorkCounts(artists: Artist[], works: WorkLike[]): ArtistWithCounts[] {
  if (works.length === 0) {
    return artists.map((a) => ({ ...a, availableCount: a.artworkCount }));
  }
  return artists.map((a) => {
    const own = works.filter((w) => w.artistId === a.id);
    return {
      ...a,
      artworkCount: own.length,
      availableCount: own.filter((w) => !w.isSold).length,
    };
  });
}

/** "12 works · 7 available" — 품절이 없으면 "10 works available". */
export function formatWorkCount(total: number, available: number) {
  if (total === 0) return "Works coming soon";
  if (available === total) return `${total} works available`;
  return `${total} works · ${available} available`;
}
