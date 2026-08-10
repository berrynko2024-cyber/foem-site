/**
 * Next.js의 이미지 최적화 서버를 이용해 초소형 미니 캐시 URL을 생성합니다.
 * 이 URL은 <Image placeholder="blur" blurDataURL={...} /> 의 blurDataURL 속성에 런타임에 직접 매핑됩니다.
 *
 * w=32, q=75를 쓰는 이유: next.config.ts에 images.imageSizes/qualities를 별도 설정하지 않아
 * Next.js 기본 허용값(imageSizes 최솟값 32, qualities 기본값 75)만 통과된다.
 * 다른 값(예: w=16, q=10)을 쓰면 최적화 서버가 400 Bad Request로 거부한다.
 */
export function getBlurDataUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return `/_next/image?url=${encodeURIComponent(url)}&w=32&q=75`;
}
