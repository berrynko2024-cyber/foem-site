import { revalidatePath } from "next/cache";

/**
 * 공개 페이지(홈/샵/작가/아트페어/전시)는 ISR로 캐시된다.
 * 작품·작가·전시·아트페어 데이터나 판매 상태(is_sold)가 바뀌는 곳에서 호출하면
 * 루트 레이아웃 아래 모든 페이지 캐시를 무효화해서 다음 방문 시 새로 렌더링된다.
 * (DB를 직접 수정한 경우엔 호출되지 않으므로 각 페이지의 revalidate 주기(1시간) 후 반영)
 */
export function revalidatePublicPages() {
  revalidatePath("/", "layout");
}
