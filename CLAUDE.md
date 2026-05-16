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
- **2026.05 업데이트**: 아래 변경사항 참고

## 네비게이션 구조 (2026.05 기준)
좌측: Home / Shop / Artists / Video / Art Fair / Exhibitions
우측: Email / Instagram / Cart

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

---

## 2026.05 변경사항

### 작품 데이터 규칙
- 사진작가는 **Betty Moon 1명** — 나머지 작가 작품은 `category: "painting"` 또는 `"craft"`
- Uiyeong Park 작품: `category: "painting"` (Archival pigment print이나 photo 아님)
- 작품 파일명 규칙: `{작품명-소문자-하이픈}.jpg` (원본 파일명 보존 금지)
- 작품 이미지 위치: `public/artworks/{artist-slug}/`

### Artwork 타입 추가 필드
- `orientation?: 'portrait' | 'landscape' | 'square'` — 명시하지 않으면 세로(portrait) 기본값
  - `landscape`: 가로형 — 컨테이너 `aspect-[3/2]`, 이미지 `object-contain`
  - `square`: 정방형 — 컨테이너 `aspect-square`, 이미지 `object-contain`
  - 없음(portrait): 세로형 — 컨테이너 `aspect-[4/5]`, 이미지 `object-cover`
  - **적용 파일**: `app/shop/page.tsx`, `app/shop/[id]/page.tsx`, `app/artists/[slug]/page.tsx`, `app/page.tsx`
- `priceDisplay?: string` — 달러 등 원화 외 통화 표시 시 사용 (예: `"$2,100"`)
  - 메인/작가 페이지: `priceDisplay` 있으면 그대로 표시, 없으면 `원화` 포맷
  - 상세 페이지: `isSold`이면 "Sold Out" 표시

### Shop 페이지 (`app/shop/page.tsx`)
- 필터 순서: All → Photography → Painting → Craft
- Sold 표시: 이미지 오버레이 ❌ → 좌상단 검정 뱃지 "Sold"
- 가격란: `isSold`여도 가격 표시 (`priceDisplay` 우선)

### 작가 페이지 (`app/artists/[slug]/page.tsx`)
- 작품 순서: **최신 추가순** (`[...getArtworksByArtist(id)].reverse().slice(0, 6)`)
- 영상 없을 때: `aspect-video` 영역에 "준비중입니다" 표시
- Sold 표시: 좌상단 검정 뱃지 통일
- 가격란: `isSold`이면 "Sold Out", `priceDisplay` 있으면 그대로, 없으면 원화

### 현재 작가 현황
| ID | slug | 작품 |
|----|------|------|
| a1 | betty-moon | ✅ 6개 |
| a2 | uiyeong-park | ✅ 6개 |
| a4 | harin-j | ✅ 5개 |
| a5 | seong-eun-park | ✅ 6개 |
| a6 | byeong-gwan-seo | ⏳ 준비중 (artworkCount: 0) |
| a7 | jae-eun-jeong | ⏳ 준비중 (artworkCount: 0) |

### 작품 없는 작가 처리
- `artworkCount: 0`으로 설정
- 아티스트 페이지: Works 섹션에 "준비중입니다" 박스 표시
- 프로필 카운트: "Works coming soon"
- **작품 삭제 시 작가 프로필은 절대 삭제하지 말 것**

### Art Fair 페이지 (`app/art-fair/page.tsx`)
- 탭 없음 — 전체를 한 페이지에 표시
- 정렬: current → upcoming → past
- 카드 좌상단에 상태 뱃지 표시
- VIP 프리뷰 날짜: `previewDate` 필드 (선택)

### Art Fair 사진 폴더 규칙
- 경로: `public/art-fairs/{fair-slug}/cover.jpg` (또는 .png)
- 현재 폴더: artankara-2026 ✅, hong-kong-2026 ✅, kiaf-2026 ⏳, frieze-seoul-2025 ⏳, art-busan-2025 ⏳

### 현재 Art Fair 데이터
| ID | 이름 | 상태 |
|----|------|------|
| f5 | Affordable Art Fair Hong Kong 2026 | current |
| f1 | KIAF SEOUL 2026 | upcoming |
| f2 | Frieze Seoul 2025 | past |
| f3 | Art Busan 2025 | past |
| f4 | ARTANKARA 2026 | past |

### Art Fair 항목 추가 시 필요 정보
- 이름, venue, location, 참가 작가, 시작일/종료일, status, 대표사진
- 선택: boothNumber, previewDate, description

### Exhibitions 페이지 (`app/exhibitions/page.tsx`)
- 탭: Current / Upcoming / Past
- 데이터: `exhibitions` 배열 (`lib/mockData.ts`)

### 현재 실제 작품 현황
| 작가 | ID | 제목 | orientation | 상태 |
|------|-----|------|-------------|------|
| Betty Moon | w22 | Returning to Myself I | landscape | 판매중 |
| Betty Moon | w26 | Returning to Myself II | — | 판매중 |
| Betty Moon | w27 | Table is Ready | landscape | 판매중 |
| Betty Moon | w23 | Mother Nature | landscape | 판매중 |
| Betty Moon | w25 | Light and Shadow | landscape | 판매중 |
| Betty Moon | w24 | Arrival | landscape | 판매중 |
| Uiyeong Park | w28 | contenir 3_5 | — | Sold Out ($2,100) |
| Uiyeong Park | w29 | dam da 4_11 | landscape | 판매중 |
| Uiyeong Park | w30 | contenir 4_10 | — | 판매중 ($2,500) |
| Uiyeong Park | w31 | The Wall and the Wait 1_2 | square | 판매중 |
| Uiyeong Park | w32 | The Wall and The Wait 2_6 | square | 판매중 ($700) |
| Uiyeong Park | w33 | The Wall and The Wait 2_6(O) | square | Sold Out ($700) |
| Harin J | w37 | My October | — | Sold Out |
| Harin J | w38 | Green-Stained Memories | landscape | 판매중 ($1,000) |
| Harin J | w39 | Inner land scape | square | Sold Out ($900) |
| Harin J | w40 | Memory | — | 판매중 (문의) |
| Harin J | w41 | Spring Field | — | 판매중 ($1,700) |
| Sung Eun Park | w13 | Golden Cheonma | square | 판매중 |
| Sung Eun Park | w14 | Golden Freedom | landscape | 판매중 |
| Sung Eun Park | w15 | The Moment We Met | square | 판매중 |
| Sung Eun Park | w34 | Invite into the New World | square | 판매중 |
| Sung Eun Park | w35 | Invite into a New World G | square | 판매중 |
| Sung Eun Park | w36 | The Moment We Met II | square | 판매중 |

### 영상 현황
- Betty Moon: ✅ 영상 있음 (v1, v2)
- Sung Eun Park: ✅ 영상 있음 (v3)
- Uiyeong Park: ⏳ 준비중
