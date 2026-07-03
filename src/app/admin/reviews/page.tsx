"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel, StatCard, Spinner, EmptyState } from "@/components/admin/AdminUI";
import { IconStar } from "@/components/Icons";
import { adminFetch } from "@/lib/adminClient";
import type { Review } from "@/lib/db";
import { cx } from "@/lib/utils";

const FILTERS = ["all", "pending", "approved"] as const;

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending");

  const load = () => adminFetch("/api/admin/reviews").then((r) => r.json()).then(setReviews).catch(() => setReviews([]));
  useEffect(() => { load(); }, []);

  const setApproved = async (id: string, approved: boolean) => {
    await adminFetch(`/api/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify({ approved }) });
    load();
  };
  const del = async (id: string) => { await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" }); load(); };

  const list = reviews ?? [];
  const shown = useMemo(
    () => list.filter((r) => filter === "all" || (filter === "pending" ? !r.approved : r.approved)),
    [list, filter]
  );

  return (
    <div>
      <div className="mb-6">
        <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Community</div>
        <h1 className="display text-4xl">Reviews</h1>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard label="Total" value={list.length} />
        <StatCard label="Pending" value={list.filter((r) => !r.approved).length} accent />
        <StatCard label="Approved" value={list.filter((r) => r.approved).length} />
      </div>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cx("display rounded-md border px-4 py-2 text-sm capitalize tracking-wider", filter === f ? "border-[#e10600] bg-[#e10600]/10 text-[#ff2a1f]" : "border-white/12 text-white/55")}>{f}</button>
        ))}
      </div>

      {reviews === null ? <Spinner /> : shown.length === 0 ? (
        <EmptyState>Nothing to moderate here.</EmptyState>
      ) : (
        <div className="space-y-3">
          {shown.map((r) => (
            <Panel key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <IconStar key={i} filled={i < r.rating} />)}</span>
                    <span className="font-semibold">{r.name}</span>
                    <span className={cx("rounded-full px-2 py-0.5 text-[11px] font-bold", r.approved ? "bg-green-600/15 text-green-400" : "bg-[#e10600]/15 text-[#ff2a1f]")}>
                      {r.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm text-white/70">{r.text}</p>
                  <div className="mt-1 text-[11px] text-white/35">on <span className="font-mono">{r.slug}</span> · {new Date(r.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
                <div className="flex items-center gap-2">
                  {r.approved ? (
                    <button onClick={() => setApproved(r.id, false)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/60 hover:border-[#e10600] hover:text-[#ff2a1f]">Unapprove</button>
                  ) : (
                    <button onClick={() => setApproved(r.id, true)} className="rounded-md bg-green-600/15 px-3 py-1.5 text-xs font-bold text-green-400 hover:bg-green-600/25">Approve</button>
                  )}
                  <button onClick={() => del(r.id)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/60 hover:border-[#e10600] hover:text-[#ff2a1f]">Delete</button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
