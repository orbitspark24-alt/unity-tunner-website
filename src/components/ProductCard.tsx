"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { useShop, toSnapshot } from "@/lib/store";
import { inr, cx } from "@/lib/utils";
import { IconStar, IconHeart, IconCart } from "./Icons";
import ProductArt from "./ProductArt";

/** Animates a red dot from the clicked button to the navbar cart icon. */
export function flyToCart(from: HTMLElement) {
  const target = document.getElementById("cart-icon");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dot = document.createElement("div");
  dot.style.cssText = `position:fixed;left:${a.left + a.width / 2}px;top:${a.top + a.height / 2}px;width:16px;height:16px;border-radius:99px;background:#e10600;z-index:9998;pointer-events:none;box-shadow:0 0 14px rgba(225,6,0,.8)`;
  document.body.appendChild(dot);
  const anim = dot.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${(b.left + b.width / 2 - a.left - a.width / 2) * 0.5}px, ${b.top + b.height / 2 - a.top - a.height / 2 - 80}px) scale(0.9)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${b.left + b.width / 2 - a.left - a.width / 2}px, ${b.top + b.height / 2 - a.top - a.height / 2}px) scale(0.25)`, opacity: 0.6 },
    ],
    { duration: 650, easing: "cubic-bezier(0.3, 0, 0.4, 1)" }
  );
  anim.onfinish = () => dot.remove();
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const btnRef = useRef<HTMLButtonElement>(null);
  const wished = wishlist.includes(product.slug);
  const off = Math.round((1 - product.price / product.mrp) * 100);

  const add = useCallback(() => {
    if (!product.inStock) return;
    addToCart(toSnapshot(product));
    if (btnRef.current) flyToCart(btnRef.current);
  }, [addToCart, product]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.07 }}
      className="card-lift card-sweep group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#101012]"
    >
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden">
        {/* primary art + second-angle swap on hover */}
        <div className="h-full w-full transition-all duration-500 group-hover:scale-110 group-hover:opacity-0">
          <ProductArt product={product} />
        </div>
        <div className="absolute inset-0 opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100">
          <ProductArt product={product} variant={1} />
        </div>

        {product.badge && (
          <span
            className={cx(
              "display absolute left-3 top-3 rounded px-2 py-1 text-[11px] tracking-wider",
              product.badge === "Best Seller" ? "bg-[#e10600] text-white" : "bg-white text-black"
            )}
          >
            {product.badge}
          </span>
        )}
        {off > 0 && (
          <span className="absolute right-3 top-3 rounded bg-black/70 px-2 py-1 text-[11px] font-bold text-[#ff2a1f]">
            -{off}%
          </span>
        )}
        {!product.inStock && (
          <span className="display absolute inset-x-0 bottom-0 bg-black/80 py-2 text-center text-xs tracking-widest text-white/70">
            Out of Stock — Notify Me
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between text-xs text-white/45">
          <span>{product.brand}</span>
          <span className="flex items-center gap-1">
            <IconStar /> {product.rating} <span className="text-white/30">({product.reviews})</span>
          </span>
        </div>
        <Link href={`/shop/${product.slug}`} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-[#ff2a1f]">
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="display text-xl text-white">{inr(product.price)}</div>
            {off > 0 && <div className="text-xs text-white/35 line-through">{inr(product.mrp)}</div>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleWishlist(product.slug)}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className={cx(
                "rounded-md border p-2 transition-colors",
                wished ? "border-[#e10600] text-[#ff2a1f]" : "border-white/15 text-white/60 hover:border-[#e10600] hover:text-[#ff2a1f]"
              )}
            >
              <IconHeart width={16} height={16} fill={wished ? "#e10600" : "none"} />
            </button>
            <button
              ref={btnRef}
              onClick={add}
              disabled={!product.inStock}
              aria-label={`Add ${product.name} to cart`}
              className="btn btn-primary rounded-md p-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:animate-none"
            >
              <IconCart width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
