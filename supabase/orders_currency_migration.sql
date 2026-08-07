-- orders 테이블에 다통화(KRW/USD) 지원 추가
-- 이미 orders 테이블을 생성하셨다면 Supabase 대시보드 → SQL Editor에서 이걸 실행하세요.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'KRW';
ALTER TABLE orders ALTER COLUMN total_amount TYPE NUMERIC;
