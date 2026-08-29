@AGENTS.md

---

# FOEM 프로젝트 규칙

## ⚠️ 스크린샷 금지
- `screenshot.mjs` (Playwright) 실행 금지 — 컴퓨터 다운됨
- 사이트 확인은 `npm run dev` 후 사용자에게 `http://localhost:3000` 직접 열도록 안내

## 🚨 사이트 오류 시 체크리스트

**"클릭 안 됨 / 사진 없음 / 기능 안 됨" 같은 증상 → 1번부터 순서대로 확인**

1. **재배포 먼저**: 로컬 코드는 정상인데 라이브 사이트가 이상하면 → `npx vercel --prod`
   - 코드 변경 후 배포를 안 한 경우가 90%
   - 배포 전 `npm run build`로 오류 없는지 확인 (TypeScript 오류 등)
2. **로컬 확인**: `npm run dev` → `curl http://localhost:3000/[경로]` 또는 브라우저 직접 확인
3. **코드 버그**: 로컬도 안 되면 코드 문제

## 📋 전시(Exhibition) 데이터 관리 규칙

전시 추가·수정 시 반드시 확인:

| 항목 | 규칙 |
|------|------|
| **status** | 날짜 기준으로 정확히 유지. `endDate` 지나면 반드시 `"past"`로 변경 |
| **coverImage** | 파일이 실제로 존재하는지 확인. `public/exhibitions/{폴더명}/` 에 이미지 있어야 함 |
| **이미지 파일명** | 공백 금지 → 하이픈 사용 (`beyond-the-frame.jpg`) |

**전시 상태 업데이트 시점**: 사용자가 날짜 변경 요청할 때 또는 현재 날짜 기준 만료된 전시 발견 시

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
- 기본 동작(썸네일 필드 미지정 시): `hqdefault.jpg`(480x360)로 먼저 시도 → 로드 실패(에러) 시에만 런타임에 `maxresdefault.jpg`로 전환
- **주의**: `hqdefault`는 저해상도라서 VideoGrid의 피처드(전체폭) 슬롯처럼 큰 영역에 표시되면 확대되며 화질이 깨져 보임(블러/픽셀化). 에러가 나지 않는 한 자동으로 고화질로 안 바뀜.

### ⚠️ 새 아티스트 영상 추가할 때마다 반드시 할 것
1. `mockData.ts`의 `artistVideos`에 새 항목 추가 (id, artistId, artistSlug, artistName, title, url)
2. **아래 명령으로 고화질 썸네일 존재 여부 확인**:
   ```bash
   curl -s -o /dev/null -w "%{size_download}\n" "https://img.youtube.com/vi/{videoId}/maxresdefault.jpg"
   ```
3. **다운로드 크기가 15KB 이상**이면 진짜 HD 썸네일 → mockData 항목에 `thumbnail` 필드로 명시 지정:
   ```ts
   thumbnail: "https://img.youtube.com/vi/{videoId}/maxresdefault.jpg",
   ```
4. **15KB 미만**이면 SD 영상이라 `maxresdefault`가 검정 빈 이미지일 가능성 높음 → `thumbnail` 필드 생략하고 기본 `hqdefault` 폴백 그대로 둠
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

### 현재 작가 현황 (2026-08-10 기준)
| ID | slug | medium | 작품 | 영상 |
|----|------|--------|------|------|
| a1 | betty-moon | photography | ✅ 6개 | ✅ |
| a2 | uiyeong-park | painting | ✅ 10개 | ✅ |
| a4 | harin-j | painting | ✅ 5개 | ✅ |
| a5 | sung-eun-park | painting | ✅ 6개 | ✅ |
| a6 | byeong-gwan-seo | sculpture | ✅ 10개 | ✅ (v6) |
| a7 | jae-eun-jeong | painting | ✅ 16개 (Interval 10 + 구조와 속력 6) | ⏳ |
| a8 | young-jae-lee | glass | ✅ 8개 | ✅ |
| a9 | ha-jeong-lim | glass | ⏳ 준비중 (artworkCount: 0) | ⏳ |

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

### 개별 작품 현황 (2026.08 — Supabase 마이그레이션 이후)
- 작품 데이터의 원본(source of truth)은 **Supabase `artworks` 테이블**. `lib/mockData.ts`의 `artworks` 배열은 DB 조회 실패 시에만 쓰이는 비상 폴백.
- 홈/샵/작가 상세/어드민 목록 페이지는 전부 `force-dynamic`으로 Supabase에서 매 요청마다 직접 읽음 (정적 캐싱 없음)
- 작품 등록/수정/삭제 방법 (둘 다 즉시 반영됨, 동일한 결과):
  - Claude Code 세션에서 요청 → `lib/supabaseAdmin.ts`(service role)로 직접 DB 반영
  - `/admin/artworks`에서 직접 등록/수정/삭제 (실제 CRUD 동작함, `/api/admin/artworks*` 라우트)
- `mockData.ts`는 더 이상 "여기에 추가하면 끝"이 아님 — DB에도 반영해야 사이트에 보임. 폴백용으로 mockData.ts도 함께 업데이트해두면 좋지만 필수는 아님.
- 작가별 개수는 위 "현재 작가 현황" 표 참고 (단, 실제 최신 개수는 DB가 우선)

### 작품 이미지 업로드 (Supabase Storage)
- Storage 버킷 `artworks` (public) 사용. 업로드는 `/api/admin/upload`(service role, 어드민 세션 필요) → 공개 CDN URL 반환
- `/admin/artworks/new`, `/admin/artworks/[id]/edit` 폼에 드래그앤드롭 업로드 영역 있음 — 업로드하면 자동으로 `images` 배열에 URL 추가
- 기존 로컬 이미지(`public/artworks/...`)는 마이그레이션 안 함, 계속 그대로 사용 — 새로 추가하는 이미지부터 Storage 사용
- `next.config.ts`의 `images.remotePatterns`에 `*.supabase.co` 등록됨 → `next/image`가 자동으로 WebP 등 최적화 포맷으로 서빙

### 영상 현황
- Betty Moon: ✅ 영상 있음 (v7 프로필 + v1 Mother Nature Exhibition)
- Young Jae Lee: ✅ 영상 있음 (v2)
- Sung Eun Park: ✅ 영상 있음 (v3)
- Uiyeong Park: ✅ 영상 있음 (v4)
- Harin J: ✅ 영상 있음 (v5)
- Byeong Gwan Seo: ✅ 영상 있음 (v6)
- Jae-eun Jeong: ⏳ 준비중
