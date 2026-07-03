"use client";

import { useEffect, useState } from "react";
import { Panel, StatusPill, StatCard, Spinner, EmptyState, ORDER_STATUS } from "@/components/admin/AdminUI";
import { adminFetch } from "@/lib/adminClient";
import type { Order } from "@/lib/db";
import { inr } from "@/lib/utils";

const NEXT: Record<string, Order["status"]> = { paid: "packed", packed: "shipped", shipped: "delivered" };
const STATUS_OPTS: Order["status"][] = ["paid", "packed", "shipped", "delivered", "refunded"];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  const load = () => fetch("/api/orders").then((r) => r.json()).then(setOrders).catch(() => setOrders([]));
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: Order["status"]) => {
    await adminFetch(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  };

  const list = orders ?? [];
  const revenue = list.filter((o) => o.status !== "refunded").reduce((s, o) => s + o.total, 0);
  const toShip = list.filter((o) => o.status === "paid" || o.status === "packed").length;

  return (
    <div>
      <div className="mb-6">
        <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Store</div>
        <h1 className="display text-4xl">Sales / Orders</h1>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Revenue" value={inr(revenue)} accent />
        <StatCard label="Orders" value={list.length} />
        <StatCard label="To Fulfil" value={toShip} />
        <StatCard label="Delivered" value={list.filter((o) => o.status === "delivered").length} />
      </div>

      {orders === null ? <Spinner /> : list.length === 0 ? (
        <EmptyState>No orders yet — place one from the storefront checkout to test.</EmptyState>
      ) : (
        <div className="space-y-3">
          {list.map((o) => (
            <Panel key={o.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="display text-lg">{o.shipping.name}</span>
                    <StatusPill status={o.status} map={ORDER_STATUS} />
                  </div>
                  <div className="mt-1 text-xs text-white/45">{o.shipping.phone} · {o.shipping.email}</div>
                  <div className="text-xs text-white/45">{o.shipping.address}, {o.shipping.city} {o.shipping.pincode} · {o.shipping.method}</div>
                  <div className="mt-0.5 text-[11px] text-white/30">{o.id} · {new Date(o.createdAt).toLocaleString("en-IN")}</div>
                </div>
                <div className="text-right">
                  <div className="display text-2xl text-[#ff2a1f]">{inr(o.total)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    {NEXT[o.status] && (
                      <button onClick={() => setStatus(o.id, NEXT[o.status])} className="rounded-md bg-[#e10600]/15 px-3 py-1.5 text-xs font-bold text-[#ff2a1f] hover:bg-[#e10600]/25 capitalize">
                        Mark {NEXT[o.status]}
                      </button>
                    )}
                    <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as Order["status"])} className="field w-auto py-1.5 text-xs capitalize" aria-label="Order status">
                      {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-3 border-t border-white/8 pt-3">
                {o.items.map((it) => (
                  <div key={it.slug} className="flex justify-between py-1 text-sm">
                    <span className="text-white/70">{it.name} × {it.qty}</span>
                    <span>{inr(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
