"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StatCard, Panel, StatusPill, ORDER_STATUS, LEAD_STATUS } from "@/components/admin/AdminUI";
import { adminFetch } from "@/lib/adminClient";
import { inr } from "@/lib/utils";
import type { Booking, Order, Lead, Review } from "@/lib/db";
import type { Product } from "@/lib/products";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts).catch(() => {});
    fetch("/api/bookings").then((r) => r.json()).then(setBookings).catch(() => {});
    fetch("/api/orders").then((r) => r.json()).then(setOrders).catch(() => {});
    adminFetch("/api/admin/leads").then((r) => r.json()).then(setLeads).catch(() => {});
    adminFetch("/api/admin/reviews").then((r) => r.json()).then(setReviews).catch(() => {});
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const salesRevenue = orders.filter((o) => o.status !== "refunded").reduce((s, o) => s + o.total, 0);
  const bookingRevenue = bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.price, 0);
  const upcoming = bookings.filter((b) => b.date >= today && b.status === "confirmed").length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const pendingReviews = reviews.filter((r) => !r.approved).length;
  const lowStock = products.filter((p) => !p.inStock).length;

  // 7-day sales sparkline
  const week = useMemo(() => {
    const days: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const total = orders.filter((o) => o.createdAt.slice(0, 10) === iso).reduce((s, o) => s + o.total, 0)
        + bookings.filter((b) => b.createdAt.slice(0, 10) === iso).reduce((s, b) => s + b.price, 0);
      days.push({ label: d.toLocaleDateString("en-IN", { weekday: "short" }), total });
    }
    return days;
  }, [orders, bookings]);
  const weekMax = Math.max(...week.map((d) => d.total), 1);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Overview</div>
          <h1 className="display text-4xl">Dashboard</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Revenue" value={inr(salesRevenue + bookingRevenue)} accent hint="Orders + completed tunes" />
        <StatCard label="Orders" value={orders.length} hint={inr(salesRevenue)} />
        <StatCard label="Upcoming Tunes" value={upcoming} hint={`${bookings.length} total`} />
        <StatCard label="New Leads" value={newLeads} hint={`${leads.length} total`} />
        <StatCard label="Pending Reviews" value={pendingReviews} hint={`${reviews.length} total`} />
        <StatCard label="Products" value={products.length} hint={lowStock ? `${lowStock} out of stock` : "all in stock"} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Last 7 Days" action={<span className="text-xs text-white/40">Orders + bookings</span>}>
          <div className="flex h-44 items-end gap-2">
            {week.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-[#7a0400] to-[#e10600] transition-all"
                    style={{ height: `${(d.total / weekMax) * 100}%`, minHeight: d.total ? 4 : 0 }}
                    title={inr(d.total)}
                  />
                </div>
                <span className="text-[10px] text-white/40">{d.label}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Add Product", "/admin/products"],
              ["View Bookings", "/admin/bookings"],
              ["Moderate Reviews", "/admin/reviews"],
              ["Check Leads", "/admin/leads"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="card-lift rounded-lg border border-white/10 bg-[#17171b] px-4 py-5 text-center text-sm font-semibold hover:border-[#e10600]/50">
                {label}
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Recent Orders" action={<Link href="/admin/orders" className="text-xs font-semibold text-[#ff2a1f]">View all</Link>}>
          {orders.length === 0 ? (
            <p className="text-sm text-white/45">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-white/8">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{o.shipping.name}</div>
                    <div className="text-xs text-white/40">{o.items.length} item{o.items.length > 1 ? "s" : ""} · {o.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="display text-[#ff2a1f]">{inr(o.total)}</div>
                    <StatusPill status={o.status} map={ORDER_STATUS} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Leads" action={<Link href="/admin/leads" className="text-xs font-semibold text-[#ff2a1f]">View all</Link>}>
          {leads.length === 0 ? (
            <p className="text-sm text-white/45">No leads yet — submit the contact form to test.</p>
          ) : (
            <ul className="divide-y divide-white/8">
              {leads.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{l.name || l.email}</div>
                    <div className="truncate text-xs text-white/40">{l.type} · {l.email}</div>
                  </div>
                  <StatusPill status={l.status} map={LEAD_STATUS} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
