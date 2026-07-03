# Unity Tuner — Unity Motorsports Performance

Premium car-tuning brand site with a full e-commerce marketplace and an online booking system. Dark theme, racing-red accents, cinematic Framer Motion animations throughout.

## Run it

```bash
npm install
cp .env.example .env.local   # optional — sets admin password & secrets
npm run dev                  # http://localhost:3000
npm run build                # production build
```

It runs out of the box with no `.env` — the admin defaults to password `unity2026`. Set your own before deploying (see [Environment variables](#environment-variables)).

## Pages

| Route | What's there |
|---|---|
| `/` | Cinematic hero (turbo spool page-load intro, parallax, animated tachometer, smoke), live counters, services preview, featured products carousel, interactive stock-vs-tuned dyno chart, testimonials slider, builds grid, CTA banner |
| `/shop` | Marketplace — 24 products across 10 categories, filters (category, car make, brand, price, in-stock), instant search suggestions, sort |
| `/shop/[slug]` | Product detail — image gallery with zoom + angle swap, specs table, fitment checker (make/model → confirms fit), reviews, related products, Product schema markup |
| `/checkout` | Address → shipping method → payment (Razorpay placeholder) → animated success checkmark. Orders are priced server-side |
| `/booking` | 5-step animated flow: service → car details → live calendar + slot picker → contact → confirm (+ optional deposit). Confirmation screen with booking ID and "Add to Google Calendar" |
| `/services` | Service cards, Stage 1/2/3 comparison table, FAQ accordion |
| `/about` | Parallax hero, brand timeline, team, partner-brand marquee |
| `/gallery` | Filterable masonry grid of builds with lightbox and before/after specs |
| `/contact` | Map embed, hours, WhatsApp click-to-chat, contact form |
| `/admin` | **Pit Wall admin console** — see below |

## Admin console (`/admin`)

A full CMS behind a password gate (demo password **`unity2026`**). Sidebar sections:

| Section | What you can do |
|---|---|
| **Dashboard** | Revenue, orders, upcoming tunes, new leads, pending reviews, product count, 7-day sales bar chart, recent activity |
| **Products** | Full CRUD — create/edit/delete any product: name, brand, category, price, MRP, rating, badge, stock, fitment (multi-select), hue, image, description, and a dynamic specs editor with a live art preview. Edits go live on the storefront instantly |
| **Bookings** | View upcoming/all tunes, mark completed/cancelled, block/unblock calendar dates |
| **Sales / Orders** | Every order with items & customer; advance status paid → packed → shipped → delivered (or refund) |
| **Leads** | Contact-form + newsletter captures; mark new → contacted → closed; mailto/tel links; delete |
| **Reviews** | Moderate customer reviews — approve/unapprove/delete. Only approved reviews show on product pages |
| **Media** | Upload images (drag-drop → stored as data URLs) or add by URL; copy URLs; attach to products in the catalogue editor |

**Storefront is dynamic.** Shop list, product pages, home featured carousel and the cart all read the live JSON-backed catalogue, so admin changes appear without a redeploy. Product prices and order totals are always recomputed server-side.

**Auth is server-side** (`src/lib/admin.ts`). The password is verified on the server against `ADMIN_PASSWORD`; on success the login route sets an **httpOnly session cookie** holding `ADMIN_KEY`, which every admin API route checks. Neither secret is ever sent to the browser, and admin APIs return `401` without a valid cookie. It's a single shared-password gate — ideal for a private, single-operator console; add per-user accounts + a session store for a larger team. Both secrets are configured via environment variables (see below).

## Architecture

- **Next.js 15** (App Router, TypeScript) + **Tailwind CSS v4** + **Framer Motion**
- Cart/wishlist state: **Zustand** with localStorage persistence (`src/lib/store.ts`)
- Backend: Next.js API routes over a **JSON file store** in `data/` (`src/lib/db.ts`) — bookings, blocked dates, and orders work end-to-end with zero external services. Swap the helpers in `db.ts` for Supabase/Firebase when scaling beyond one server.
- Slot integrity is enforced server-side: past dates, blocked dates, and double-bookings are rejected (409).
- All product imagery, the logo, and the hero scene are code-generated SVG — no image assets required. Replace `ProductArt`/`Logo` with real photography when available.

## API

**Public**
- `GET /api/products` — live catalogue
- `GET/POST /api/reviews` — approved reviews / submit a review (lands for moderation)
- `POST /api/leads` — contact-form & newsletter capture
- `GET/POST /api/orders` — list / place an order (priced server-side)
- `GET/POST /api/bookings`, `PATCH /api/bookings/:id`
- `GET /api/slots?date=YYYY-MM-DD`, `GET/POST /api/blocked`

**Admin** (require the session cookie — `401` otherwise)
- `POST /api/admin/login` · `POST /api/admin/logout` · `GET /api/admin/session`
- `GET/POST /api/admin/products`, `PATCH/DELETE /api/admin/products/:slug`
- `GET /api/admin/reviews`, `PATCH/DELETE /api/admin/reviews/:id`
- `GET /api/admin/leads`, `PATCH/DELETE /api/admin/leads/:id`
- `GET/POST /api/admin/media`, `DELETE /api/admin/media/:id`
- `PATCH /api/admin/orders/:id`

## Environment variables

Copy `.env.example` → `.env.local` for local dev, or set these in your host's
dashboard for production. All are optional — the app falls back to demo defaults.

| Variable | Purpose | Default |
|---|---|---|
| `ADMIN_PASSWORD` | Password for the `/admin` login gate (server-verified) | `unity2026` |
| `ADMIN_KEY` | Secret held in the admin session cookie & checked by admin APIs. Use a long random string (`openssl rand -hex 32`) | dev fallback |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp click-to-chat number (digits, incl. country code) | `919876543210` |

`.env.local` (and any `.env*` except `.env.example`) is gitignored — never commit real secrets.

## Deploy

The app is a standard Next.js 15 project and deploys anywhere Next runs.

### Render (recommended — supports persistent storage)

A [`render.yaml`](render.yaml) Blueprint is included, so this is two clicks:

1. Push to GitHub (already done → `orbitspark24-alt/unity-tunner-website`).
2. In the [Render dashboard](https://dashboard.render.com): **New → Blueprint** → select this repo. Render reads `render.yaml` and provisions everything.
3. When prompted, set `ADMIN_PASSWORD`. `ADMIN_KEY` is auto-generated for you.
4. Click **Apply** — Render builds (`npm install && npm run build`) and starts (`npm start`) the service.

The blueprint also attaches a **1GB persistent disk** mounted at `/var/data` and points `DATA_DIR` at it, so bookings, orders, products, reviews, leads and media **survive restarts and redeploys** — unlike serverless platforms. This requires the `starter` plan (paid, disks aren't available on `free`). To skip the disk and stay on the free tier instead, edit `render.yaml`: change `plan: starter` → `plan: free` and delete the `disk:` block — data will then reset whenever the service restarts or redeploys, which is fine for a demo.

**Manual setup (no Blueprint)** works too: create a Web Service, build command `npm install && npm run build`, start command `npm start`, add `ADMIN_PASSWORD`/`ADMIN_KEY` env vars, and optionally add a Disk + `DATA_DIR` env var as above.

### Vercel

1. *New Project* → import the repo. Framework auto-detects as Next.js.
2. Add `ADMIN_PASSWORD` and `ADMIN_KEY` under *Settings → Environment Variables*.
3. Deploy.

⚠️ **Data persistence caveat.** Vercel's filesystem is fully serverless/ephemeral —
there's no disk to attach, so the JSON store (`data/*.json`) **won't persist**
between requests. Fine for a demo of the UI; for real data on Vercel, swap the
helpers in [`src/lib/db.ts`](src/lib/db.ts) for a database (Supabase, Firebase,
Postgres…). The rest of the app already talks to `db.ts` through a clean async
interface, so that's the only file you'd need to change.

### Any other Node host (Railway, a VPS, Docker)

```bash
npm run build && npm start   # serves on $PORT (default 3000)
```
Set `ADMIN_PASSWORD` / `ADMIN_KEY`, and optionally `DATA_DIR` if you mount a volume elsewhere. Where the filesystem persists, the JSON store works as-is.

## Before a real launch

1. Set strong `ADMIN_PASSWORD` / `ADMIN_KEY` (and consider per-user admin accounts).
2. Move the JSON store to a real database for serverless hosting.
3. Add real payments (Razorpay/Stripe) in `checkout` and the booking deposit step.
4. Wire the email/WhatsApp confirmation placeholder in `api/bookings/route.ts`.
5. Replace generated SVG art with product photography and real workshop media.
