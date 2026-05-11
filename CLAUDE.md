@AGENTS.md

---

# FOEM 프로젝트 규칙

## ⚠️ 스크린샷 금지
- `screenshot.mjs` (Playwright) 실행 금지 — 컴퓨터 다운됨
- 사이트 확인은 `npm run dev` 후 사용자에게 `http://localhost:3000` 직접 열도록 안내

## 현재 진행 상태
- **Phase 2 완료**: 모든 페이지 UI 완성
- **Phase 3 미착수**: Stripe / Supabase 연동 필요 (`.env.local` 없음)
- **2025.05 추가 완료**: VideoGrid 개편 + 아티스트 페이지 재구성

## 디자인 기준 (네오 미니멀리즘 — 2025.05)
- 배경색: `#F6F4EB` (따뜻한 크림)
- 메인 텍스트: `#268042` (에메랄드 그린) — 내비게이션 포함 전체
- 보조 텍스트: `#5a9e72` (연한 그린)
- 구분선: `#d4e8da` (그린 틴트)
- 헤더: 테두리 없음, 좌우 분할 네비 (좌: Home/Shop/Artists, 우: Email/Instagram/Cart)
- 폰트: Oswald 700 (대형 타이틀) + Playfair Display (서브타이틀/세리프) + Inter (본문)
- 히어로: 풀스크린, 중앙 정렬, FIELD OF EMOTIONS (Oswald 18vw, tracking -0.02em)

## 콘텐츠
- Betty Moon 유튜브: `https://www.youtube.com/@bettymoonstudio` (추후 변경 예정)
- Art Fair 페이지: 현재 Coming Soon 상태
- 목데이터: `lib/mockData.ts`

## 서버 실행
```bash
cd /Users/ko/Projects/foem-site && npm run dev
```

## YouTube 썸네일 자동화 패턴
- `ArtistVideo.url` = YouTube watch URL (`https://www.youtube.com/watch?v=ID`)
- `youtubeId` 필드 없음 — 컴포넌트 내 `extractYoutubeId(url)` 함수로 자동 추출
- 정규식: `/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/`
- 썸네일 폴백 순서: `hqdefault.jpg` → `maxresdefault.jpg` → CSS 폴백
- SD 영상 주의: `maxresdefault`는 SD 영상에서 검정 빈 이미지(200 OK) 반환 → `hqdefault` 먼저 사용
- 위치: `components/VideoGrid.tsx`, `components/VideoPlayer.tsx`

## VideoGrid 구조 (홈페이지)
- 파일: `components/VideoGrid.tsx`
- 레이아웃: 피처드(전체폭) + 하단 비대칭 [2fr | 1fr]
- 데이터: `artistVideos[0]` 피처드, `[1]` 하단좌측, `[2]` 하단우측
- 크기: `max-w-[65vw] mx-auto`
- 클릭 → 아티스트 페이지 이동 (`/artists/[artistSlug]`) — 모달 없음
- `ArtistVideo` 타입에 `artistSlug` 필드 필수

## 아티스트 페이지 구조 (`/artists/[slug]`)
- 파일: `app/artists/[slug]/page.tsx` (서버 컴포넌트)
- 레이아웃 순서: 대형 영상 → 프로필(사진+소개) → 작품 6개 그리드
- 영상 플레이어: `components/VideoPlayer.tsx` (클라이언트 컴포넌트 분리 필수)
- `VideoPlayer`는 썸네일 클릭 시 iframe 인라인 재생
- 작품: `getArtworksByArtist(id).slice(0, 6)`, 클릭 → `/shop/[id]`

## 아티스트 프로필 사진
- 위치: `public/artists/` 폴더
- 파일명 규칙: `{slug}.jpg` (소문자, 하이픈)
- 현재: `betty-moon.jpg` ✅, `uiyeong-park.jpg` ✅, Sora Kim ⏳ (플레이스홀더)
- mockData slug: betty-moon, uiyeong-park, sora-kim

## mockData 헬퍼 함수
- `getVideosByArtist(artistId)` — 아티스트별 영상 필터링
- `getArtworksByArtist(artistId)` — 아티스트별 작품 필터링
- `getArtistBySlug(slug)` — slug로 아티스트 조회
