# Unity Tuner — Unity Motorsports Performance

Premium car-tuning brand site with a full e-commerce marketplace and an online booking system. Dark theme, racing-red accents, cinematic Framer Motion animations throughout.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

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

**Auth is demo-grade** (`src/lib/admin.ts`): the password unlocks the panel client-side and admin APIs check a shared key header. Replace with real server-side sessions/JWT before production.

## Architecture

- **Next.js 15** (App Router, TypeScript) + **Tailwind CSS v4** + **Framer Motion**
- Cart/wishlist state: **Zustand** with localStorage persistence (`src/lib/store.ts`)
- Backend: Next.js API routes over a **JSON file store** in `data/` (`src/lib/db.ts`) — bookings, blocked dates, and orders work end-to-end with zero external services. Swap the helpers in `db.ts` for Supabase/Firebase when scaling beyond one server.
- Slot integrity is enforced server-side: past dates, blocked dates, and double-bookings are rejected (409).
- All product imagery, the logo, and the hero scene are code-generated SVG — no image assets required. Replace `ProductArt`/`Logo` with real photography when available.

## API

- `GET/POST /api/bookings`, `PATCH /api/bookings/:id`
- `GET /api/slots?date=YYYY-MM-DD`
- `GET/POST /api/blocked` (toggle)
- `POST /api/orders`

## Going to production

1. Add real payment (Razorpay/Stripe) in `checkout` and the booking deposit step.
2. Put auth in front of `/admin` and the admin APIs.
3. Wire the email/WhatsApp confirmation placeholder in `api/bookings/route.ts`.
4. Replace generated SVG art with product photography and real workshop media.
