/**
 * Next.js 이미지 최적화 서버(/_next/image)로 특정 너비의 최적화된 URL을 만든다.
 * width/quality는 next.config.ts의 images.imageSizes/deviceSizes/qualities 허용 목록에
 * 있는 값만 써야 한다(기본값: imageSizes [32,48,64,96,128,256,384], deviceSizes
 * [640,750,828,1080,1200,1920,2048,3840], qualities [75]). 허용 목록 밖의 값은
 * 최적화 서버가 400 Bad Request로 거부한다.
 */
export function getOptimizedUrl(url: string | undefined, width: number, quality = 75): string | undefined {
  if (!url) return undefined;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}

/**
 * 가로 32px 초소형 블러 플레이스홀더 URL.
 * <Image placeholder="blur" blurDataURL={...} /> 또는 <NaturalImage>의 배경으로 쓴다.
 */
export function getBlurDataUrl(url: string | undefined): string | undefined {
  return getOptimizedUrl(url, 32, 75);
}
