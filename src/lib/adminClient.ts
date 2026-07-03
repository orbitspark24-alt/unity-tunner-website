"use client";

import { ADMIN_KEY, ADMIN_PASSWORD, ADMIN_HEADER } from "./admin";

const LS = "unity-admin-auth";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LS) === ADMIN_KEY;
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(LS, ADMIN_KEY);
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(LS);
}

/** fetch wrapper that attaches the admin key header + JSON content type. */
export async function adminFetch(url: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    [ADMIN_HEADER]: (typeof window !== "undefined" && localStorage.getItem(LS)) || "",
    ...(opts.headers as Record<string, string> | undefined),
  };
  return fetch(url, { ...opts, headers });
}
