import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSessionToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    console.error("[Admin Login] ADMIN_PASSWORD is not configured.");
    return NextResponse.json({ error: "Admin password is not configured on the server" }, { status: 500 });
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = createAdminSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
