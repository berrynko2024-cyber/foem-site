-- 주문(orders) 테이블 생성
-- Supabase 대시보드 → SQL Editor 에서 실행

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KRW',
  payment_method TEXT NOT NULL,
  payment_key TEXT,
  payment_status TEXT DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 결제 확인 API(app/api/payments/toss/confirm, stripe/verify-session)가 익명 키로 주문 기록
CREATE POLICY "Anyone can insert" ON orders
  FOR INSERT WITH CHECK (true);

-- 관리자 페이지(/admin/orders)가 익명 키로 목록 조회 (다른 admin 테이블과 동일한 패턴)
CREATE POLICY "Anyone can select" ON orders
  FOR SELECT USING (true);
