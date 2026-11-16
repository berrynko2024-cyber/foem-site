import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";

/**
 * foem.co.kr 도메인을 2013~2022년에 쓰던 카페24 커피용품 쇼핑몰의 옛 경로들.
 * Google 검색에 아직 남아 있어서, 410 Gone으로 "영구 삭제됨"을 알려 색인에서 빨리 빠지게 한다.
 * (현재 FOEM 경로와 겹치지 않는 접두어만 포함. /order는 현재도 쓰므로 .html 파일만 410 처리)
 */
const LEGACY_PREFIXES = [
  "/category", "/product", "/board", "/article", "/member", "/myshop", "/shopinfo",
  "/2_imgs", "/app", "/ind-script", "/ec-js", "/web", "/won", "/mbn_slider", "/exec",
  "/mds", "/link", "/images", "/Asia", "/Europe", "/America", "/Etc",
];

function isLegacyPath(pathname: string): boolean {
  if (pathname === "/index.html" || pathname === "/foemcafe_adult.png") return true;
  if (pathname.startsWith("/order/") && pathname.endsWith(".html")) return true;
  return LEGACY_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function gone() {
  return new NextResponse(
    "<!doctype html><meta charset=\"utf-8\"><title>410 Gone</title><p>이 페이지는 영구적으로 삭제되었습니다. <a href=\"https://www.foem.co.kr/\">FOEM 홈으로 이동</a></p>",
    {
      status: 410,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex",
        "cache-control": "public, max-age=86400",
      },
    }
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isLegacyPath(pathname)) {
    return gone();
  }

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
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    // 옛 카페24 쇼핑몰 경로 (LEGACY_PREFIXES와 맞춰 유지)
    "/category/:path*", "/product/:path*", "/board/:path*", "/article/:path*",
    "/member/:path*", "/myshop/:path*", "/shopinfo/:path*", "/2_imgs/:path*",
    "/app/:path*", "/ind-script/:path*", "/ec-js/:path*", "/web/:path*", "/won/:path*",
    "/mbn_slider/:path*", "/exec/:path*", "/mds/:path*", "/link/:path*", "/images/:path*",
    "/Asia/:path*", "/Europe/:path*", "/America/:path*", "/Etc/:path*",
    "/order/:path*", "/index.html", "/foemcafe_adult.png",
  ],
};
