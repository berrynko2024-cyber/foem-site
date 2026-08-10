import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 폼(/admin)과 로그인 API는 항상 통과
  if (pathname === "/admin" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!verifyAdminSessionToken(token)) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
