import { promises as fs } from "fs";
import path from "path";
import { SEED_PRODUCTS, type Product } from "./products";

/**
 * Tiny JSON-file store so the whole app — storefront + admin CMS — works with
 * zero external services. Swap these helpers for Supabase/Firebase to scale
 * beyond a single server.
 */
const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
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

const REVIEW_TEMPLATES = [
  { name: "Vikram S.", rating: 5, text: "Fit perfectly, noticeable difference on the first drive. Unity's install team had it done while I waited." },
  { name: "Ananya R.", rating: 5, text: "Quality is properly premium — packaging, hardware, instructions all spot on. Would buy again." },
  { name: "Farhan M.", rating: 4, text: "Great part, took a week extra to ship to my city. Performance as advertised though." },
  { name: "Karthik V.", rating: 5, text: "Genuine article, invoiced, and the fitment checker was bang on. Zero fuss." },
  { name: "Meera J.", rating: 5, text: "Ordered on a whim, blown away by the finish. Looks and works even better in person." },
];

async function seedReviews(products: Product[]): Promise<Review[]> {
  const reviews: Review[] = [];
  products.forEach((p, pi) => {
    const n = 2 + (pi % 2);
    for (let i = 0; i < n; i++) {
      const t = REVIEW_TEMPLATES[(pi + i) % REVIEW_TEMPLATES.length];
      reviews.push({
        id: makeId("REV"),
        slug: p.slug,
        name: t.name,
        rating: t.rating,
        text: t.text,
        approved: true,
        createdAt: new Date(Date.now() - (pi * 3 + i) * 86400000).toISOString(),
      });
    }
  });
  await writeJson("reviews.json", reviews);
  return reviews;
}

export async function getReviews(): Promise<Review[]> {
  if (!(await fileExists("reviews.json"))) {
    return seedReviews(await getProducts());
  }
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
