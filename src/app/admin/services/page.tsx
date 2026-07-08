"use client";

import { useEffect, useState } from "react";
import { Panel, Modal, Field, Spinner, EmptyState } from "@/components/admin/AdminUI";
import { adminFetch } from "@/lib/adminClient";
import { invalidateSite } from "@/lib/useSite";
import type { TuneService } from "@/lib/services";
import { SERVICE_ICONS } from "@/components/Icons";
import { inr } from "@/lib/utils";

const ICONS = Object.keys(SERVICE_ICONS) as TuneService["icon"][];

type Form = Omit<TuneService, "id" | "bullets"> & { id?: string; bullets: string[] };

const BLANK: Form = {
  name: "", tagline: "", price: 0, duration: "1–2 hrs", durationHours: 2,
  gain: "", icon: "ecu", bullets: ["", "", "", ""],
};

export default function ServicesAdmin() {
  const [services, setServices] = useState<TuneService[] | null>(null);
  const [editing, setEditing] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminFetch("/api/admin/services").then((r) => r.json()).then(setServices).catch(() => setServices([]));
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...BLANK, bullets: ["", "", "", ""] });
  const openEdit = (s: TuneService) => setEditing({ ...s, bullets: s.bullets.length ? [...s.bullets] : [""] });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, bullets: editing.bullets.map((b) => b.trim()).filter(Boolean) };
    const res = editing.id
      ? await adminFetch(`/api/admin/services/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) })
      : await adminFetch("/api/admin/services", { method: "POST", body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { setEditing(null); invalidateSite(); load(); }
    else alert((await res.json()).error ?? "Save failed");
  };

  const del = async (s: TuneService) => {
    if (!confirm(`Delete "${s.name}"? It disappears from the services page and booking flow. Existing bookings keep their records.`)) return;
    await adminFetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
    invalidateSite();
    load();
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) => editing && setEditing({ ...editing, [k]: v });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Catalogue</div>
          <h1 className="display text-4xl">Services</h1>
          <p className="mt-1 text-sm text-white/45">Shown on the services page and as the bookable options in the booking flow.</p>
        </div>
        <button onClick={openNew} className="btn btn-primary rounded-md px-5 py-2.5 text-sm">+ Add Service</button>
      </div>

      {services === null ? (
        <Spinner />
      ) : services.length === 0 ? (
        <EmptyState>No services yet. <button onClick={openNew} className="text-[#ff2a1f] underline">Add your first service</button>.</EmptyState>
      ) : (
        <Panel className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/45">
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Gain</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  const Icon = SERVICE_ICONS[s.icon];
                  return (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 rounded-lg border border-[#e10600]/30 bg-[#e10600]/10 p-2 text-[#ff2a1f]">
                            <Icon width={18} height={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-medium">{s.name}</div>
                            <div className="truncate text-xs text-white/40">{s.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="display text-[#ff2a1f]">{inr(s.price)}</span></td>
                      <td className="px-4 py-3 text-white/60">{s.duration}</td>
                      <td className="px-4 py-3 text-white/60">{s.gain}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(s)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold hover:border-[#e10600] hover:text-[#ff2a1f]">Edit</button>
                          <button onClick={() => del(s)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/60 hover:border-[#e10600] hover:text-[#ff2a1f]">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit Service" : "Add Service"} wide>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
              <Field label="Service name">
                <input required value={editing.name} onChange={(e) => set("name", e.target.value)} className="field text-sm" />
              </Field>
              <Field label="Icon">
                <select value={editing.icon} onChange={(e) => set("icon", e.target.value as TuneService["icon"])} className="field text-sm">
                  {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Tagline">
              <input value={editing.tagline} onChange={(e) => set("tagline", e.target.value)} className="field text-sm" placeholder="One-liner shown under the name" />
            </Field>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="Price ₹">
                <input type="number" required min={0} value={editing.price} onChange={(e) => set("price", +e.target.value)} className="field text-sm" />
              </Field>
              <Field label="Duration (shown)">
                <input value={editing.duration} onChange={(e) => set("duration", e.target.value)} className="field text-sm" placeholder="3–4 hrs" />
              </Field>
              <Field label="Duration (hours)">
                <input type="number" min={1} max={24} value={editing.durationHours} onChange={(e) => set("durationHours", +e.target.value)} className="field text-sm" />
              </Field>
              <Field label="Gain (e.g. +25–35% HP)">
                <input value={editing.gain} onChange={(e) => set("gain", e.target.value)} className="field text-sm" />
              </Field>
            </div>
            <Field label="Bullet points">
              <div className="space-y-2">
                {editing.bullets.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={b}
                      onChange={(e) => set("bullets", editing.bullets.map((x, j) => (j === i ? e.target.value : x)))}
                      className="field text-sm"
                      placeholder={`Bullet ${i + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => set("bullets", editing.bullets.filter((_, j) => j !== i))}
                      aria-label="Remove bullet"
                      className="shrink-0 rounded-md border border-white/15 px-3 text-white/50 hover:border-[#e10600] hover:text-[#ff2a1f]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => set("bullets", [...editing.bullets, ""])} className="text-xs font-semibold text-[#ff2a1f]">
                  + Add bullet
                </button>
              </div>
            </Field>
            <p className="text-xs text-white/35">Duration (hours) is used for the booking calendar length; the shown duration is free text on the service card.</p>
            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button type="button" onClick={() => setEditing(null)} className="btn btn-outline rounded-md px-6 py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary rounded-md px-6 py-2.5 text-sm disabled:opacity-60">{saving ? "Saving…" : "Save Service"}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
