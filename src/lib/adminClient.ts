"use client";

/**
 * Client helpers for the admin console. Auth state lives in an httpOnly session
 * cookie set by the server, so there are no secrets here — the cookie rides
 * along automatically with same-origin requests.
 */

export async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/session", { cache: "no-store" });
    const data = await res.json();
    return !!data.authed;
  } catch {
    return false;
  }
}

export async function login(password: string): Promise<boolean> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

export async function logout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
}

/** fetch wrapper for admin API calls — adds JSON content type; the session
 *  cookie is sent automatically. */
export async function adminFetch(url: string, opts: RequestInit = {}) {
  return fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers as Record<string, string> | undefined) },
  });
}
