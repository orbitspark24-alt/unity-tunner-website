"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/products";
import { CAR_MAKES, CAR_MODELS, type CarMake } from "@/lib/products";
import { useShop, toSnapshot } from "@/lib/store";
import { inr, cx } from "@/lib/utils";
import ProductArt from "@/components/ProductArt";
import ProductCard, { flyToCart } from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { IconStar, IconHeart, IconCheck, IconX, IconChevron } from "@/components/Icons";

interface ReviewItem { id: string; name: string; rating: number; text: string; createdAt: string }

export default function ProductDetail({
  product,
  related,
  reviews,
}: {
  product: Product;
  related: Product[];
  reviews: ReviewItem[];
}) {
  const [img, setImg] = useState<0 | 1>(0);
  const [zoom, setZoom] = useState(false);
  const [qty, setQtyLocal] = useState(1);
  const [fitMake, setFitMake] = useState<CarMake | "">("");
  const [fitModel, setFitModel] = useState("");
  const { addToCart, openDrawer, toggleWishlist, wishlist } = useShop();
  const addBtn = useRef<HTMLButtonElement>(null);
  const wished = wishlist.includes(product.slug);
  const off = Math.round((1 - product.price / product.mrp) * 100);

  // review form
  const [rvName, setRvName] = useState("");
  const [rvRating, setRvRating] = useState(5);
  const [rvText, setRvText] = useState("");
  const [rvSent, setRvSent] = useState(false);
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: product.slug, name: rvName, rating: rvRating, text: rvText }),
    });
    setRvSent(true);
    setRvName("");
    setRvText("");
    setRvRating(5);
  };

  const fits =
    fitMake === "" ? null : product.fitment.includes("Universal") || product.fitment.includes(fitMake);

  const add = () => {
    if (!product.inStock) return;
    addToCart(toSnapshot(product), qty);
    if (addBtn.current) flyToCart(addBtn.current);
    setTimeout(openDrawer, 700);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <nav className="mb-6 text-xs text-white/45" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-white">Marketplace</Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-white/75">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* gallery */}
        <div>
          <div
            className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-white/10"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <motion.div
              key={img}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: zoom ? 1.35 : 1 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full"
            >
              <ProductArt product={product} variant={img} />
            </motion.div>
            {product.badge && (
              <span className={cx("display absolute left-4 top-4 rounded px-2.5 py-1 text-xs tracking-wider", product.badge === "Best Seller" ? "bg-[#e10600]" : "bg-white text-black")}>
                {product.badge}
              </span>
            )}
          </div>
          <div className="mt-3 flex gap-3">
            {([0, 1] as const).map((v) => (
              <button
                key={v}
                onClick={() => setImg(v)}
                className={cx("h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors", img === v ? "border-[#e10600]" : "border-white/10 hover:border-white/30")}
                aria-label={`View image ${v + 1}`}
              >
                <ProductArt product={product} variant={v} />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div className="text-sm text-white/50">{product.brand} · {product.category}</div>
          <h1 className="display mt-1 text-4xl sm:text-5xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <IconStar key={i} filled={i < Math.round(product.rating)} />)}</span>
            <span className="font-semibold">{product.rating}</span>
            <span className="text-white/45">({product.reviews} reviews)</span>
            <span className={cx("ml-2 rounded-full px-2.5 py-0.5 text-xs font-bold", product.inStock ? "bg-green-600/15 text-green-400" : "bg-white/10 text-white/50")}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="display text-5xl text-[#ff2a1f]">{inr(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-white/35 line-through">{inr(product.mrp)}</span>
                <span className="mb-1 rounded bg-[#e10600]/15 px-2 py-0.5 text-xs font-bold text-[#ff2a1f]">Save {off}%</span>
              </>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-white/70">{product.description}</p>

          {/* fitment checker */}
          <div className="mt-6 rounded-xl border border-white/10 bg-[#101012] p-5">
            <h3 className="display mb-3 text-base tracking-wider">Will it fit my car?</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={fitMake} onChange={(e) => { setFitMake(e.target.value as CarMake | ""); setFitModel(""); }} className="field text-sm" aria-label="Select car make">
                <option value="">Select make…</option>
                {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={fitModel} onChange={(e) => setFitModel(e.target.value)} disabled={!fitMake} className="field text-sm disabled:opacity-40" aria-label="Select car model">
                <option value="">Select model…</option>
                {fitMake && CAR_MODELS[fitMake].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <AnimatePresence>
              {fits !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cx(
                    "mt-3 flex items-center gap-2 rounded-md px-3.5 py-2.5 text-sm font-semibold",
                    fits ? "bg-green-600/12 text-green-400" : "bg-[#e10600]/10 text-[#ff2a1f]"
                  )}
                >
                  {fits ? <IconCheck width={18} height={18} /> : <IconX width={18} height={18} />}
                  {fits
                    ? `Confirmed — fits ${fitMake}${fitModel ? ` ${fitModel}` : ""}.`
                    : `Not listed for ${fitMake}. WhatsApp us — we may have an alternative.`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* qty + cart */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-white/15">
              <button className="px-4 py-3 text-lg text-white/70 hover:text-[#ff2a1f]" onClick={() => setQtyLocal(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <span className="display min-w-10 text-center text-lg">{qty}</span>
              <button className="px-4 py-3 text-lg text-white/70 hover:text-[#ff2a1f]" onClick={() => setQtyLocal(qty + 1)} aria-label="Increase quantity">+</button>
            </div>
            <button
              ref={addBtn}
              onClick={add}
              disabled={!product.inStock}
              className="btn btn-primary flex-1 rounded-md px-8 py-3.5 text-sm disabled:animate-none disabled:opacity-30"
            >
              {product.inStock ? "Add to Cart" : "Notify When Available"}
            </button>
            <button
              onClick={() => toggleWishlist(product.slug)}
              aria-label="Toggle wishlist"
              className={cx("rounded-md border p-3.5 transition-colors", wished ? "border-[#e10600] text-[#ff2a1f]" : "border-white/15 text-white/60 hover:border-[#e10600] hover:text-[#ff2a1f]")}
            >
              <IconHeart width={18} height={18} fill={wished ? "#e10600" : "none"} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/45">
            <span>✓ Free shipping above ₹10,000</span>
            <span>✓ Genuine parts, invoiced</span>
            <span>✓ Fitting available at our workshop</span>
          </div>
        </div>
      </div>

      {/* specs */}
      <Reveal className="mt-16">
        <h2 className="display mb-5 text-3xl">Specifications</h2>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <tbody>
              {product.specs.map(([k, v], i) => (
                <tr key={k} className={i % 2 ? "bg-[#101012]" : "bg-[#141417]"}>
                  <td className="w-1/3 px-5 py-3.5 font-semibold text-white/60">{k}</td>
                  <td className="px-5 py-3.5">{v}</td>
                </tr>
              ))}
              <tr className={product.specs.length % 2 ? "bg-[#101012]" : "bg-[#141417]"}>
                <td className="px-5 py-3.5 font-semibold text-white/60">Fitment</td>
                <td className="px-5 py-3.5">{product.fitment.join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* reviews */}
      <Reveal className="mt-16">
        <h2 className="display mb-5 text-3xl">Reviews <span className="text-[#ff2a1f]">({reviews.length || product.reviews})</span></h2>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.length === 0 && (
              <p className="text-sm text-white/50">No reviews yet — be the first to review this part.</p>
            )}
            {reviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-[#101012] p-5">
                <div className="mb-2 flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <IconStar key={i} filled={i < r.rating} />)}</div>
                <p className="text-sm leading-relaxed text-white/70">{r.text}</p>
                <div className="mt-3 text-xs font-semibold text-white/45">
                  {r.name} · <span className="text-white/30">{new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>

          {/* write a review */}
          <div className="h-fit rounded-xl border border-white/10 bg-[#101012] p-5">
            <h3 className="display mb-3 text-lg tracking-wider">Write a Review</h3>
            {rvSent ? (
              <div className="flex items-center gap-2 rounded-md bg-green-600/12 px-3.5 py-3 text-sm text-green-400">
                <IconCheck width={18} height={18} /> Thanks! Your review is pending approval.
              </div>
            ) : (
              <form onSubmit={submitReview} className="space-y-3">
                <input required placeholder="Your name" value={rvName} onChange={(e) => setRvName(e.target.value)} className="field text-sm" aria-label="Your name" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50">Rating</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setRvRating(n)} aria-label={`${n} stars`} className="p-0.5">
                      <IconStar width={20} height={20} filled={n <= rvRating} />
                    </button>
                  ))}
                </div>
                <textarea required rows={4} placeholder="How did it perform?" value={rvText} onChange={(e) => setRvText(e.target.value)} className="field text-sm" aria-label="Review text" />
                <button type="submit" className="btn btn-primary w-full rounded-md px-5 py-2.5 text-sm">Submit Review</button>
              </form>
            )}
          </div>
        </div>
      </Reveal>

      {/* related */}
      {related.length > 0 && (
        <Reveal className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="display text-3xl">Goes Well With</h2>
            <Link href="/shop" className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-[#ff2a1f]">
              All parts <IconChevron width={12} height={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
          </div>
        </Reveal>
      )}
    </div>
  );
}
