-- artworks 테이블 생성
CREATE TABLE IF NOT EXISTS artworks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_ko TEXT,
  description TEXT,
  description_ko TEXT,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'KRW',
  category TEXT CHECK (category IN ('painting', 'photo', 'craft')),
  images TEXT[] NOT NULL,
  artist_id TEXT NOT NULL, -- mockData.ts의 artist.id와 매핑
  artist_name TEXT NOT NULL,
  stock INT DEFAULT 1,
  is_sold BOOLEAN DEFAULT false,
  year INT,
  medium TEXT,
  dimensions TEXT,
  orientation TEXT DEFAULT 'portrait',
  price_display TEXT,
  emotions TEXT[],
  artist_statement TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- pending_orders (임시 주문) 테이블 생성
CREATE TABLE IF NOT EXISTS pending_orders (
  order_id UUID PRIMARY KEY,
  customer JSONB NOT NULL,
  items JSONB NOT NULL,
  currency TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- 설계 원칙: 모든 쓰기(INSERT/UPDATE/DELETE)는 서버 라우트가
-- service_role 키(lib/supabaseAdmin.ts)로 수행하며 RLS를 우회한다.
-- 아래 정책들은 브라우저에 노출되는 anon 키에 대해서만 적용되고,
-- anon에게는 꼭 필요한 조회 권한 외에는 아무 것도 열어주지 않는다.
-- ─────────────────────────────────────────────────────────────

-- 1. artworks: 누구나 조회만 가능 (쇼핑몰 목록/상세 페이지용). 쓰기 정책 없음 = anon은 쓰기 불가.
DROP POLICY IF EXISTS "Public Read Artworks" ON artworks;
CREATE POLICY "Public Read Artworks" ON artworks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert artworks" ON artworks;
DROP POLICY IF EXISTS "Anyone can update artworks" ON artworks;

-- 2. pending_orders: anon에게 어떤 정책도 주지 않는다 (읽기/쓰기 전부 서버 전용).
--    결제 초기화(/api/payments/init), 승인(confirm), 웹훅 복구, 취소 정리(cancel-pending)는
--    전부 service_role 클라이언트로만 접근한다.
DROP POLICY IF EXISTS "Anyone can insert pending" ON pending_orders;
DROP POLICY IF EXISTS "Anyone can select pending" ON pending_orders;

-- 3. orders: 고객 개인정보(이름/이메일/주소)가 담겨있으므로 anon 조회도 금지.
--    관리자 페이지(/admin/orders)는 서버 컴포넌트에서 service_role로 조회한다.
DROP POLICY IF EXISTS "Anyone can select" ON orders;
DROP POLICY IF EXISTS "Only Authenticated can select orders" ON orders;

-- ─────────────────────────────────────────────────────────────
-- artists / exhibitions / art_fairs (2026-08 mockData.ts → DB 이관)
-- artworks와 동일한 원칙: id는 mockData의 id를 그대로 재사용, FK 제약 없음(느슨한 참조),
-- anon은 SELECT만 가능, 쓰기는 전부 service_role 서버 라우트 경유.
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ko TEXT,
  bio TEXT NOT NULL,
  bio_ko TEXT NOT NULL,
  photo TEXT NOT NULL,
  photo_filter TEXT,
  instagram TEXT,
  youtube TEXT,
  statement TEXT,
  statement_ko TEXT,
  artwork_count INT DEFAULT 0,
  works_grid INT,
  works_layout TEXT,
  medium TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exhibitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  artists TEXT[] NOT NULL,
  venue TEXT,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('current','upcoming','past')),
  cover_image TEXT NOT NULL,
  hero_image TEXT,
  description TEXT,
  description_ko TEXT,
  video_url TEXT,
  orientation TEXT,
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS art_fairs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  venue TEXT NOT NULL,
  location TEXT NOT NULL,
  artists TEXT[] NOT NULL,
  preview_date DATE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('current','upcoming','past')),
  cover_image TEXT NOT NULL,
  description TEXT,
  artwork_ids TEXT[],
  booth_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE art_fairs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Artists" ON artists;
CREATE POLICY "Public Read Artists" ON artists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Exhibitions" ON exhibitions;
CREATE POLICY "Public Read Exhibitions" ON exhibitions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Art Fairs" ON art_fairs;
CREATE POLICY "Public Read Art Fairs" ON art_fairs FOR SELECT USING (true);
