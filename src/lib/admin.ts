import type { NextRequest } from "next/server";

/**
 * Admin auth. The password is verified server-side against ADMIN_PASSWORD; on
 * success the login route sets an httpOnly session cookie holding ADMIN_KEY,
 * which admin API routes check via requireAdmin(). Neither secret is ever sent
 * to the browser. Configure both in the environment (see .env.example); the
 * fallbacks below only exist so the demo runs out of the box.
 *
 * This is a single shared-password gate — fine for a private, single-operator
 * console. For a team, swap in per-user accounts + a real session store.
 */
export const ADMIN_COOKIE = "unity_admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "unity2026";
}

export function adminKey(): string {
  return process.env.ADMIN_KEY || "unity-pitwall-key-2026";
}

export function requireAdmin(req: NextRequest): boolean {
  return req.cookies.get(ADMIN_COOKIE)?.value === adminKey();
}
