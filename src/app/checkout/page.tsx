"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShop, cartTotal } from "@/lib/store";
import { inr, cx } from "@/lib/utils";
import ProductArt from "@/components/ProductArt";
import type { Order } from "@/lib/db";

const SHIP_METHODS = [
  { id: "standard", name: "Standard Delivery", eta: "4–6 business days", note: "Free above ₹10,000, else ₹199" },
  { id: "express", name: "Express Delivery", eta: "1–2 business days", note: "₹499 flat" },
];

export default function CheckoutPage() {
  const { cart, clearCart } = useShop();
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", pincode: "", method: "standard" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);

  const subtotal = cartTotal(cart);
  const shipCost = form.method === "express" ? 499 : subtotal >= 10000 ? 0 : 199;
  const total = subtotal + shipCost;

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, shipping: form, payment: "razorpay-placeholder" }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Order failed");
      const data: Order = await res.json();
      setOrder(data);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (order) return <OrderSuccess order={order} />;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-24 pt-40 text-center">
        <h1 className="display text-4xl">Nothing To Check Out</h1>
        <p className="mt-3 text-white/55">Your cart is empty. The parts aren&apos;t going to buy themselves.</p>
        <Link href="/shop" className="btn btn-primary mt-8 inline-flex rounded-md px-8 py-3.5 text-sm">Shop Parts</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6">
      <h1 className="display mb-10 text-5xl">Checkout</h1>
      <form onSubmit={placeOrder} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <section>
            <h2 className="display mb-4 text-xl tracking-wider"><span className="text-[#e10600]">01 /</span> Delivery Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Full name" value={form.name} onChange={set("name")} className="field" aria-label="Full name" />
              <input required placeholder="Phone" type="tel" pattern="[0-9+ -]{10,}" value={form.phone} onChange={set("phone")} className="field" aria-label="Phone" />
              <input required placeholder="Email" type="email" value={form.email} onChange={set("email")} className="field sm:col-span-2" aria-label="Email" />
              <input required placeholder="Street address" value={form.address} onChange={set("address")} className="field sm:col-span-2" aria-label="Street address" />
              <input required placeholder="City" value={form.city} onChange={set("city")} className="field" aria-label="City" />
              <input required placeholder="PIN code" pattern="[0-9]{6}" value={form.pincode} onChange={set("pincode")} className="field" aria-label="PIN code" />
            </div>
          </section>

          <section>
            <h2 className="display mb-4 text-xl tracking-wider"><span className="text-[#e10600]">02 /</span> Shipping</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {SHIP_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={cx(
                    "cursor-pointer rounded-xl border p-4 transition-colors",
                    form.method === m.id ? "border-[#e10600] bg-[#e10600]/8" : "border-white/12 bg-[#101012] hover:border-white/30"
                  )}
                >
                  <input type="radio" name="ship" value={m.id} checked={form.method === m.id} onChange={set("method")} className="sr-only" />
                  <div className="font-semibold">{m.name}</div>
                  <div className="mt-1 text-sm text-white/55">{m.eta}</div>
                  <div className="mt-1 text-xs text-[#ff2a1f]">{m.note}</div>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="display mb-4 text-xl tracking-wider"><span className="text-[#e10600]">03 /</span> Payment</h2>
            <div className="rounded-xl border border-white/12 bg-[#101012] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Razorpay Secure Checkout</div>
                  <div className="mt-1 text-sm text-white/55">UPI · Cards · Net Banking · EMI</div>
                </div>
                <div className="flex gap-2">
                  {["UPI", "VISA", "MC"].map((b) => (
                    <span key={b} className="rounded border border-white/15 px-2 py-1 text-[10px] font-bold text-white/60">{b}</span>
                  ))}
                </div>
              </div>
              <p className="mt-3 rounded-md bg-white/5 px-3 py-2 text-xs text-white/45">
                Demo mode — the payment gateway is a placeholder. Placing the order records it without charging anything.
              </p>
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit rounded-2xl border border-white/10 bg-[#101012] p-6 lg:sticky lg:top-24">
          <h2 className="display mb-4 text-xl tracking-wider">Order Summary</h2>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {cart.map((l) => (
              <div key={l.slug} className="flex items-center gap-3 text-sm">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md"><ProductArt product={l} /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{l.name}</div>
                  <div className="text-xs text-white/45">Qty {l.qty}</div>
                </div>
                <div className="display">{inr(l.price * l.qty)}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between text-white/60"><span>Shipping</span><span>{shipCost === 0 ? "FREE" : inr(shipCost)}</span></div>
            <div className="flex justify-between pt-2 text-lg"><span className="display">Total</span><span className="display text-[#ff2a1f]">{inr(total)}</span></div>
          </div>
          {error && <p className="mt-3 rounded-md bg-[#e10600]/10 px-3 py-2 text-sm text-[#ff2a1f]">{error}</p>}
          <button type="submit" disabled={submitting} className="btn btn-primary mt-5 w-full rounded-md px-6 py-4 text-sm disabled:opacity-60">
            {submitting ? "Placing Order…" : `Pay ${inr(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-white/40">256-bit encrypted · GST invoice included</p>
        </aside>
      </form>
    </div>
  );
}

function OrderSuccess({ order }: { order: Order }) {
  return (
    <div className="mx-auto max-w-xl px-4 pb-24 pt-36 text-center">
      {/* animated checkmark */}
      <motion.svg viewBox="0 0 100 100" className="mx-auto h-28 w-28" initial="hidden" animate="visible">
        <motion.circle
          cx="50" cy="50" r="44" fill="none" stroke="#22c55e" strokeWidth="4"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <motion.path
          d="M30 52 L44 66 L72 36" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        />
      </motion.svg>
      <AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <h1 className="display mt-6 text-5xl">Order Locked In</h1>
          <p className="mt-3 text-white/60">
            Order ID <span className="display text-[#ff2a1f]">{order.id}</span> — confirmation sent to your email.
          </p>
          <div className="mt-6 rounded-xl border border-white/10 bg-[#101012] p-5 text-left text-sm">
            {order.items.map((i) => (
              <div key={i.slug} className="flex justify-between py-1.5">
                <span className="text-white/70">{i.name} × {i.qty}</span>
                <span>{inr(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t border-white/10 pt-3">
              <span className="display">Total Paid</span>
              <span className="display text-[#ff2a1f]">{inr(order.total)}</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="btn btn-outline rounded-md px-7 py-3 text-sm">Keep Shopping</Link>
            <Link href="/booking" className="btn btn-primary rounded-md px-7 py-3 text-sm">Book Fitting Slot</Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
