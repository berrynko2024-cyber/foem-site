import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * 서버 전용 Supabase 클라이언트. service_role 키로 RLS를 우회해 쓰기 작업을 수행한다.
 * 절대 클라이언트 컴포넌트/브라우저 번들에 노출되면 안 됨 — API 라우트/서버 컴포넌트에서만 import.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_URL) is not configured. " +
        "Set it in .env.local and in Vercel project environment variables."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
