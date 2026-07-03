"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useShop, cartTotal } from "@/lib/store";
import { inr } from "@/lib/utils";
import { IconX, IconCart } from "./Icons";
import ProductArt from "./ProductArt";

export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, setQty, removeFromCart } = useShop();
  const total = cartTotal(cart);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[201] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#101012]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="display text-xl">
                Your Cart <span className="text-[#e10600]">({cart.length})</span>
              </h2>
              <button onClick={closeDrawer} aria-label="Close cart" className="rounded-md p-2 text-white/70 hover:text-[#ff2a1f]">
                <IconX width={20} height={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 text-white/50">
                <IconCart width={48} height={48} strokeWidth={1.2} />
                <p className="text-sm">Your cart is empty. Time to fix that.</p>
                <Link href="/shop" onClick={closeDrawer} className="btn btn-outline rounded-md px-6 py-2.5 text-sm">
                  Shop Parts
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                  {cart.map((line) => (
                    <motion.div
                      key={line.slug}
                      layout
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      className="flex gap-3 rounded-lg border border-white/10 bg-[#17171b] p-3"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md">
                        <ProductArt product={line} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/shop/${line.slug}`} onClick={closeDrawer} className="block truncate text-sm font-semibold hover:text-[#ff2a1f]">
                          {line.name}
                        </Link>
                        <div className="mt-0.5 text-xs text-white/50">{line.brand}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-md border border-white/15">
                            <button className="px-2.5 py-1 text-white/70 hover:text-[#ff2a1f]" onClick={() => setQty(line.slug, line.qty - 1)} aria-label="Decrease quantity">−</button>
                            <span className="min-w-7 text-center text-sm font-semibold">{line.qty}</span>
                            <button className="px-2.5 py-1 text-white/70 hover:text-[#ff2a1f]" onClick={() => setQty(line.slug, line.qty + 1)} aria-label="Increase quantity">+</button>
                          </div>
                          <span className="display text-base text-[#ff2a1f]">{inr(line.price * line.qty)}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(line.slug)} aria-label={`Remove ${line.name}`} className="self-start p-1 text-white/40 hover:text-[#ff2a1f]">
                        <IconX width={15} height={15} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-white/10 px-5 py-4">
                  <div className="mb-1 flex items-center justify-between text-sm text-white/60">
                    <span>Subtotal</span>
                    <span>{inr(total)}</span>
                  </div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="display text-lg">Total</span>
                    <motion.span key={total} initial={{ scale: 1.15, color: "#ff2a1f" }} animate={{ scale: 1, color: "#ffffff" }} className="display text-2xl">
                      {inr(total)}
                    </motion.span>
                  </div>
                  <Link href="/checkout" onClick={closeDrawer} className="btn btn-primary w-full rounded-md px-6 py-3.5 text-sm">
                    Proceed to Checkout
                  </Link>
                  <p className="mt-3 text-center text-xs text-white/40">Free shipping on orders above ₹10,000</p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
