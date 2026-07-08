# Unity Performance

Premium car-tuning website with an e-commerce marketplace, an online booking system, and a full content-management admin console. Dark theme, racing-red accents, smooth motion throughout.

## Run it

```bash
npm install
cp .env.example .env.local   # set the admin password & secrets
npm run dev                  # http://localhost:3000
npm run build                # production build
npm start                    # serve the production build
```

Set `ADMIN_PASSWORD` and `ADMIN_KEY` in `.env.local` before deploying (see [Environment variables](#environment-variables)).

## Pages

| Route | What's there |
|---|---|
| `/` | Hero, live counters, services preview, featured-products carousel, stock-vs-tuned dyno chart, testimonials slider, builds grid, CTA |
| `/shop` | Marketplace — products across categories, filters (category, car make, brand, price, stock), instant search, sort |
| `/shop/[slug]` | Product detail — image gallery, specs table, fitment checker, reviews, related products, Product schema markup |
| `/checkout` | Address → shipping → payment → success. Orders are priced server-side |
| `/booking` | 5-step flow: service → car details → live calendar + slot picker → contact → confirm (+ optional deposit), with an "Add to Google Calendar" link |
| `/services` | Service cards, Stage 1/2/3 comparison table, FAQ accordion |
| `/about` | Brand story, timeline, team, partner-brand marquee |
| `/gallery` | Filterable masonry grid of builds with lightbox and before/after specs |
| `/contact` | Map embed, hours, WhatsApp click-to-chat, contact form |
| `/admin` | Admin console — see below |

## Admin console (`/admin`)

A full CMS behind a server-side password gate. Sidebar sections:

| Section | What you can do |
|---|---|
| **Dashboard** | Revenue, orders, upcoming tunes, new leads, pending reviews, product count, 7-day sales chart, recent activity |
| **Site Content** | Edit the homepage hero, homepage & about stat bars, workshop/contact details (address, phone, email, hours) and testimonials — all live on save |
| **Services** | Full CRUD for the bookable services shown on `/services` and in the booking flow (name, price, duration, gain, bullets, icon) |
| **Builds** | Full CRUD for the gallery & homepage builds — car photo, category, stage, stock/tuned HP & Nm, mods, owner quote |
| **Products** | Full CRUD — name, brand, category, price, MRP, rating, badge, stock, fitment, image, description, dynamic specs editor with live preview |
| **Bookings** | View upcoming/all tunes, mark completed/cancelled, block/unblock calendar dates |
| **Sales / Orders** | Every order with items & customer; advance status paid → packed → shipped → delivered (or refund) |
| **Leads** | Contact-form + newsletter captures; mark new → contacted → closed; mailto/tel links; delete |
| **Reviews** | Moderate customer reviews — approve/unapprove/delete. Only approved reviews show on product pages |
| **Media** | Upload images or add by URL; attach to products and builds |

**The storefront is dynamic.** Shop, product pages, home content, services, builds and testimonials all read the live JSON-backed store, so admin changes appear without a redeploy. Product prices, booking prices and order totals are always recomputed server-side — client-supplied prices are never trusted.

**Auth is server-side** (`src/lib/admin.ts`). The password is verified on the server against `ADMIN_PASSWORD`; on success the login route sets an **httpOnly session cookie** holding `ADMIN_KEY`, which every admin API route checks. Neither secret is ever sent to the browser, and admin APIs return `401` without a valid cookie.

## Architecture

- **Next.js 15** (App Router, TypeScript) + **Tailwind CSS v4** + **Framer Motion**
- Cart/wishlist state: **Zustand** with localStorage persistence (`src/lib/store.ts`)
- Backend: Next.js API routes over a **JSON file store** in `data/` (`src/lib/db.ts`), with an in-memory read cache. Swap the helpers in `db.ts` for a database (Supabase/Postgres/Firebase) to scale beyond a single server.
- Slot integrity is enforced server-side: past dates, blocked dates, and double-bookings are rejected (409).

## Environment variables

Copy `.env.example` → `.env.local` for local dev, or set these in your host's dashboard for production.

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Password for the `/admin` login gate (server-verified) |
| `ADMIN_KEY` | Secret held in the admin session cookie & checked by admin APIs. Use a long random string (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp click-to-chat number (digits, incl. country code) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO (sitemap, canonical tags, OpenGraph) |

`.env.local` (and any `.env*` except `.env.example`) is gitignored — never commit real secrets.

## Deploy

Standard Next.js 15 project; deploys anywhere Next runs. Because the data store is a set of JSON files on disk, use a host with a **persistent disk** so bookings/orders/content survive restarts.

### Render (recommended)

A [`render.yaml`](render.yaml) Blueprint is included with a persistent disk configured:

1. Push to GitHub.
2. In the Render dashboard: **New → Blueprint** → select this repo. Render reads `render.yaml`.
3. When prompted, set `ADMIN_PASSWORD`. `ADMIN_KEY` is auto-generated.
4. Click **Apply**.

`db.ts` reads `DATA_DIR` (falls back to `./data`), so the mounted disk keeps all data across restarts and redeploys.

### Any Node host (Railway, VPS, Docker)

```bash
npm run build && npm start   # serves on $PORT (default 3000)
```
Set `ADMIN_PASSWORD` / `ADMIN_KEY`, and `DATA_DIR` if you mount a volume elsewhere.

> Vercel/Netlify use an ephemeral filesystem, so the JSON store won't persist there — migrate `src/lib/db.ts` to a database first if you must deploy serverless.

## Before launch

1. Set strong `ADMIN_PASSWORD` / `ADMIN_KEY`.
2. Wire real payments (Razorpay/Stripe) into checkout and the booking deposit step.
3. Connect email/WhatsApp confirmations for bookings and orders.
4. Back up the `data/` directory regularly.
