"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Panel, StatusPill, Spinner, EmptyState } from "@/components/admin/AdminUI";
import { adminFetch } from "@/lib/adminClient";
import type { Booking } from "@/lib/db";
import { inr, cx } from "@/lib/utils";

const STATUS: Record<string, string> = {
  confirmed: "bg-blue-500/15 text-blue-400",
  completed: "bg-green-600/15 text-green-400",
  cancelled: "bg-white/10 text-white/40",
};

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [blockInput, setBlockInput] = useState("");
  const [tab, setTab] = useState<"upcoming" | "all">("upcoming");

  const load = useCallback(async () => {
    const [b, bl] = await Promise.all([
      fetch("/api/bookings").then((r) => r.json()),
      fetch("/api/blocked").then((r) => r.json()),
    ]);
    setBookings(b);
    setBlocked(bl);
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: Booking["status"]) => {
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };
  const toggleBlock = async (date: string) => {
    if (!date) return;
    await fetch("/api/blocked", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date }) });
    setBlockInput("");
    load();
  };

  const today = new Date().toISOString().slice(0, 10);
  const shown = (bookings ?? []).filter((b) => (tab === "upcoming" ? b.date >= today && b.status === "confirmed" : true));

  return (
    <div>
      <div className="mb-6">
        <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Workshop</div>
        <h1 className="display text-4xl">Bookings</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex gap-2">
            {(["upcoming", "all"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cx("display rounded-md border px-4 py-2 text-sm capitalize tracking-wider", tab === t ? "border-[#e10600] bg-[#e10600]/10 text-[#ff2a1f]" : "border-white/12 text-white/55")}>{t}</button>
            ))}
          </div>

          {bookings === null ? <Spinner /> : shown.length === 0 ? (
            <EmptyState>No bookings here yet.</EmptyState>
          ) : (
            <div className="space-y-3">
              {shown.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-xl border border-white/10 bg-[#101012] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="display text-lg">{b.serviceName}</span>
                        <StatusPill status={b.status} map={STATUS} />
                      </div>
                      <div className="mt-1 text-sm text-white/60">{b.car.make} {b.car.model} ({b.car.year}) · {b.car.reg || "no reg"}</div>
                      <div className="mt-0.5 text-xs text-white/40">{b.contact.name} · {b.contact.phone} · {b.contact.email}</div>
                      {b.contact.notes && <div className="mt-1 text-xs italic text-white/40">&ldquo;{b.contact.notes}&rdquo;</div>}
                    </div>
                    <div className="text-right">
                      <div className="display text-lg text-[#ff2a1f]">{b.date} · {b.slot}</div>
                      <div className="text-xs text-white/45">{inr(b.price)}{b.deposit ? " · deposit paid" : ""}</div>
                      <div className="mt-1 text-[11px] text-white/30">{b.id}</div>
                    </div>
                  </div>
                  {b.status === "confirmed" && (
                    <div className="mt-3 flex gap-2 border-t border-white/8 pt-3">
                      <button onClick={() => setStatus(b.id, "completed")} className="rounded-md bg-green-600/15 px-3.5 py-1.5 text-xs font-bold text-green-400 hover:bg-green-600/25">Mark Completed</button>
                      <button onClick={() => setStatus(b.id, "cancelled")} className="rounded-md bg-white/8 px-3.5 py-1.5 text-xs font-bold text-white/60 hover:bg-white/15">Cancel</button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <Panel title="Block Dates" className="h-fit">
          <p className="mb-3 text-xs text-white/45">Blocked dates show no slots on the booking calendar.</p>
          <div className="flex gap-2">
            <input type="date" value={blockInput} onChange={(e) => setBlockInput(e.target.value)} className="field text-sm" aria-label="Date to block" />
            <button onClick={() => toggleBlock(blockInput)} className="btn btn-primary rounded-md px-4 text-xs">Block</button>
          </div>
          <ul className="mt-4 space-y-2">
            {blocked.length === 0 && <li className="text-xs text-white/35">Nothing blocked.</li>}
            {blocked.map((d) => (
              <li key={d} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm">
                <span>{d}</span>
                <button onClick={() => toggleBlock(d)} className="text-xs font-bold text-[#ff2a1f] hover:underline">Unblock</button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
