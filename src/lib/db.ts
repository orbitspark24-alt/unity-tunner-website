import { promises as fs } from "fs";
import path from "path";
import { SEED_PRODUCTS, type Product } from "./products";
import { BUILDS, type Build } from "./builds";
import { BOOKING_SERVICES, type TuneService } from "./services";
import { DEFAULT_SITE, type SiteSettings } from "./site";

/**
 * Tiny JSON-file store so the whole app — storefront + admin CMS — works with
 * zero external services. Swap these helpers for Supabase/Firebase to scale
 * beyond a single server.
 *
 * DATA_DIR is overridable so it can point at a mounted persistent disk (e.g.
 * Render's Disks feature) instead of the ephemeral app directory — see
 * render.yaml. Defaults to ./data for local dev and hosts with a real filesystem.
 */
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

/**
 * In-memory read cache. The app runs as a single server instance (JSON-file
 * store by design), so caching parsed files here is safe: every write goes
 * through writeJson which refreshes the cache. Cuts disk+parse off the hot
 * path for storefront reads (/api/products on every shop page load).
 */
const cache = new Map<string, unknown>();

async function readJson<T>(file: string, fallback: T): Promise<T> {
  if (cache.has(file)) return cache.get(file) as T;
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    const parsed = JSON.parse(raw) as T;
    cache.set(file, parsed);
    return parsed;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
  cache.set(file, data);
}

async function fileExists(file: string) {
  try {
    await fs.access(path.join(DATA_DIR, file));
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ types */

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  car: { make: string; model: string; year: string; fuel: string; mods: string; reg: string };
  date: string;
  slot: string;
  contact: { name: string; phone: string; email: string; notes: string };
  deposit: boolean;
  status: "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface Order {
  id: string;
  items: { slug: string; name: string; qty: number; price: number }[];
  total: number;
  shipping: { name: string; phone: string; email: string; address: string; city: string; pincode: string; method: string };
  payment: string;
  status: "paid" | "packed" | "shipped" | "delivered" | "refunded";
  createdAt: string;
}

export interface Review {
  id: string;
  slug: string; // product slug
  name: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  type: "contact" | "newsletter";
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export interface Media {
  id: string;
  name: string;
  url: string; // external URL or data URL
  createdAt: string;
}

/* --------------------------------------------------------------- products */

export async function getProducts(): Promise<Product[]> {
  if (!(await fileExists("products.json"))) {
    await writeJson("products.json", SEED_PRODUCTS);
    return SEED_PRODUCTS;
  }
  return readJson<Product[]>("products.json", SEED_PRODUCTS);
}
export const saveProducts = (p: Product[]) => writeJson("products.json", p);
export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

/* ---------------------------------------------------------------- reviews */

export async function getReviews(): Promise<Review[]> {
  return readJson<Review[]>("reviews.json", []);
}
export const saveReviews = (r: Review[]) => writeJson("reviews.json", r);

/* ------------------------------------------------------------------ leads */

export async function getLeads(): Promise<Lead[]> {
  return readJson<Lead[]>("leads.json", []);
}
export const saveLeads = (l: Lead[]) => writeJson("leads.json", l);

/* ------------------------------------------------------------------ media */

export async function getMedia(): Promise<Media[]> {
  return readJson<Media[]>("media.json", []);
}
export const saveMedia = (m: Media[]) => writeJson("media.json", m);

/* ---------------------------------------------------------- site settings */

/** Deep-ish merge so settings saved before a new field was added still get its default. */
export async function getSettings(): Promise<SiteSettings> {
  const saved = await readJson<Partial<SiteSettings>>("settings.json", {});
  return {
    hero: { ...DEFAULT_SITE.hero, ...saved.hero },
    stats: saved.stats?.length ? saved.stats : DEFAULT_SITE.stats,
    aboutStats: saved.aboutStats?.length ? saved.aboutStats : DEFAULT_SITE.aboutStats,
    testimonials: saved.testimonials?.length ? saved.testimonials : DEFAULT_SITE.testimonials,
    faq: saved.faq?.length ? saved.faq : DEFAULT_SITE.faq,
    workshop: {
      ...DEFAULT_SITE.workshop,
      ...saved.workshop,
      hours: saved.workshop?.hours?.length ? saved.workshop.hours : DEFAULT_SITE.workshop.hours,
    },
  };
}
export const saveSettings = (s: SiteSettings) => writeJson("settings.json", s);

/* ---------------------------------------------------------------- services */

export async function getServices(): Promise<TuneService[]> {
  if (!(await fileExists("services.json"))) {
    await writeJson("services.json", BOOKING_SERVICES);
    return BOOKING_SERVICES;
  }
  return readJson<TuneService[]>("services.json", BOOKING_SERVICES);
}
export const saveServices = (s: TuneService[]) => writeJson("services.json", s);

/* ------------------------------------------------------------------ builds */

export async function getBuilds(): Promise<Build[]> {
  if (!(await fileExists("builds.json"))) {
    await writeJson("builds.json", BUILDS);
    return BUILDS;
  }
  return readJson<Build[]>("builds.json", BUILDS);
}
export const saveBuilds = (b: Build[]) => writeJson("builds.json", b);

/* --------------------------------------------------- bookings / orders / blocked */

export const getBookings = () => readJson<Booking[]>("bookings.json", []);
export const saveBookings = (b: Booking[]) => writeJson("bookings.json", b);
export const getBlockedDates = () => readJson<string[]>("blocked.json", []);
export const saveBlockedDates = (d: string[]) => writeJson("blocked.json", d);
export const getOrders = () => readJson<Order[]>("orders.json", []);
export const saveOrders = (o: Order[]) => writeJson("orders.json", o);

/* ------------------------------------------------------------------ utils */

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export const SLOT_TIMES = ["09:00", "11:00", "13:00", "15:00", "17:00"];
