"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel, StatusPill, StatCard, Spinner, EmptyState, LEAD_STATUS } from "@/components/admin/AdminUI";
import { adminFetch } from "@/lib/adminClient";
import type { Lead } from "@/lib/db";
import { cx } from "@/lib/utils";

const FILTERS = ["all", "new", "contacted", "closed"] as const;
const NEXT_STATUS: Record<Lead["status"], Lead["status"]> = { new: "contacted", contacted: "closed", closed: "new" };

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const load = () => adminFetch("/api/admin/leads").then((r) => r.json()).then(setLeads).catch(() => setLeads([]));
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: Lead["status"]) => {
    await adminFetch(`/api/admin/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  };
  const del = async (id: string) => { await adminFetch(`/api/admin/leads/${id}`, { method: "DELETE" }); load(); };

  const list = leads ?? [];
  const shown = useMemo(() => list.filter((l) => filter === "all" || l.status === filter), [list, filter]);

  return (
    <div>
      <div className="mb-6">
        <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Inbox</div>
        <h1 className="display text-4xl">Leads</h1>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={list.length} />
        <StatCard label="New" value={list.filter((l) => l.status === "new").length} accent />
        <StatCard label="Contact form" value={list.filter((l) => l.type === "contact").length} />
        <StatCard label="Newsletter" value={list.filter((l) => l.type === "newsletter").length} />
      </div>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cx("display rounded-md border px-4 py-2 text-sm capitalize tracking-wider", filter === f ? "border-[#e10600] bg-[#e10600]/10 text-[#ff2a1f]" : "border-white/12 text-white/55")}>{f}</button>
        ))}
      </div>

      {leads === null ? <Spinner /> : shown.length === 0 ? (
        <EmptyState>No leads here. Submit the contact form or newsletter to test capture.</EmptyState>
      ) : (
        <div className="space-y-3">
          {shown.map((l) => (
            <Panel key={l.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="display text-lg">{l.name || "—"}</span>
                    <StatusPill status={l.status} map={LEAD_STATUS} />
                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-white/50">{l.type}</span>
                  </div>
                  <div className="mt-1 text-sm text-white/60">
                    <a href={`mailto:${l.email}`} className="hover:text-white">{l.email}</a>
                    {l.phone && <> · <a href={`tel:${l.phone}`} className="hover:text-white">{l.phone}</a></>}
                  </div>
                  {l.message && <p className="mt-2 max-w-2xl text-sm text-white/70">{l.message}</p>}
                  <div className="mt-1 text-[11px] text-white/30">{new Date(l.createdAt).toLocaleString("en-IN")}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setStatus(l.id, NEXT_STATUS[l.status])} className="rounded-md bg-[#e10600]/15 px-3 py-1.5 text-xs font-bold text-[#ff2a1f] hover:bg-[#e10600]/25 capitalize">
                    → {NEXT_STATUS[l.status]}
                  </button>
                  <button onClick={() => del(l.id)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/60 hover:border-[#e10600] hover:text-[#ff2a1f]">Delete</button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
