import "server-only";
import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "foem_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12시간

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function createAdminSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  const secret = process.env.ADMIN_PASSWORD;
  if (!token || !secret) return false;

  const [expiresStr, sig] = token.split(".");
  if (!expiresStr || !sig) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const expected = sign(expiresStr, secret);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length) return false;

  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}
