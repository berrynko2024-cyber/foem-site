import type { Artwork } from "./mockData";

/** 작품 상세 경로. slug가 있으면 /shop/bettymoon-murmur, 없으면 예전 /shop/w82 */
export function artworkPath(work: Pick<Artwork, "id" | "slug">): string {
  return `/shop/${work.slug ?? work.id}`;
}
