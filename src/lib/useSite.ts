"use client";

import { useEffect, useState } from "react";
import { BUILDS, type Build } from "./builds";
import { BOOKING_SERVICES, type TuneService } from "./services";
import { DEFAULT_SITE, type SiteSettings } from "./site";

export interface SiteData {
  settings: SiteSettings;
  builds: Build[];
  services: TuneService[];
}

const FALLBACK: SiteData = { settings: DEFAULT_SITE, builds: BUILDS, services: BOOKING_SERVICES };

/** Module-level cache: one /api/site fetch per page load, shared by every component. */
let cached: SiteData | null = null;
let inflight: Promise<SiteData> | null = null;

function fetchSite(): Promise<SiteData> {
  inflight ??= fetch("/api/site")
    .then((r) => r.json())
    .then((d: SiteData) => {
      if (d?.settings?.hero) cached = d;
      return cached ?? FALLBACK;
    })
    .catch(() => FALLBACK);
  return inflight;
}

/** Bust the cache after admin edits so the storefront refetches. */
export function invalidateSite() {
  cached = null;
  inflight = null;
}

/**
 * Live site content (settings + builds) edited from /admin/site & /admin/builds.
 * Renders with the seeded defaults during SSR, then swaps in the saved content.
 */
export function useSite(): SiteData {
  const [data, setData] = useState<SiteData>(cached ?? FALLBACK);

  useEffect(() => {
    if (cached) return;
    let alive = true;
    fetchSite().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);

  return data;
}
