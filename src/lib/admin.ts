/**
 * Demo-grade admin auth. The password unlocks the panel client-side and stores
 * the key; admin API routes require the key header. NOTE: the key is visible to
 * the client — replace with real server-side sessions/JWT before production.
 */
export const ADMIN_PASSWORD = "unity2026";
export const ADMIN_KEY = "unity-pitwall-key-2026";
export const ADMIN_HEADER = "x-admin-key";

export function requireAdmin(req: Request): boolean {
  return req.headers.get(ADMIN_HEADER) === ADMIN_KEY;
}
