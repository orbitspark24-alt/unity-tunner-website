"use client";

import { useEffect, useState } from "react";
import { Panel, Modal, Field, Spinner, EmptyState } from "@/components/admin/AdminUI";
import MediaPicker from "@/components/admin/MediaPicker";
import { adminFetch } from "@/lib/adminClient";
import { invalidateSite } from "@/lib/useSite";
import type { Build } from "@/lib/builds";
import { cx } from "@/lib/utils";

const CATEGORIES: Build["category"][] = ["German", "JDM", "Indian", "Diesel SUV"];
const STAGES = ["Stage 1", "Stage 1+", "Stage 2", "Stage 3", "Custom"];

type Form = Omit<Build, "id" | "mods"> & { id?: string; mods: string };

const BLANK: Form = {
  title: "", car: "", category: "Indian", stage: "Stage 1",
  stockHp: 0, tunedHp: 0, stockNm: 0, tunedNm: 0,
  mods: "", quote: "", hue: 0, image: "", tall: false,
};

export default function BuildsAdmin() {
  const [builds, setBuilds] = useState<Build[] | null>(null);
  const [editing, setEditing] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [pickImage, setPickImage] = useState(false);

  const load = () => adminFetch("/api/admin/builds").then((r) => r.json()).then(setBuilds).catch(() => setBuilds([]));
  useEffect(() => { load(); }, []);

  const openNew = () => setEditing({ ...BLANK });
  const openEdit = (b: Build) => setEditing({ ...b, tall: !!b.tall, image: b.image ?? "", mods: b.mods.join(", ") });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, mods: editing.mods.split(",").map((m) => m.trim()).filter(Boolean) };
    const res = editing.id
      ? await adminFetch(`/api/admin/builds/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) })
      : await adminFetch("/api/admin/builds", { method: "POST", body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { setEditing(null); invalidateSite(); load(); }
    else alert((await res.json()).error ?? "Save failed");
  };

  const del = async (b: Build) => {
    if (!confirm(`Delete build "${b.title}"? It disappears from the gallery and homepage.`)) return;
    await adminFetch(`/api/admin/builds/${b.id}`, { method: "DELETE" });
    invalidateSite();
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Workshop</div>
          <h1 className="display text-4xl">Builds</h1>
          <p className="mt-1 text-sm text-white/45">Shown in the gallery and the &ldquo;From The Workshop&rdquo; grid on the homepage.</p>
        </div>
        <button onClick={openNew} className="btn btn-primary rounded-md px-5 py-2.5 text-sm">+ Add Build</button>
      </div>

      {builds === null ? (
        <Spinner />
      ) : builds.length === 0 ? (
        <EmptyState>No builds yet. <button onClick={openNew} className="text-[#ff2a1f] underline">Add your first build</button>.</EmptyState>
      ) : (
        <Panel className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/45">
                  <th className="px-4 py-3">Build</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Power</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {builds.map((b) => (
                  <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {b.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.image} alt="" className="h-10 w-10 shrink-0 rounded-md border border-white/10 object-cover" />
                        ) : (
                          <div
                            className="h-10 w-10 shrink-0 rounded-md border border-white/10"
                            style={{ background: `radial-gradient(circle at 30% 25%, hsl(${b.hue} 55% 26%), #0c0c0e 75%)` }}
                            aria-hidden
                          />
                        )}
                        <div className="min-w-0">
                          <div className="truncate font-medium">{b.title}</div>
                          <div className="text-xs text-white/40">{b.car}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{b.category}</td>
                    <td className="px-4 py-3 text-white/60">{b.stage}</td>
                    <td className="px-4 py-3">
                      <span className="display text-[#ff2a1f]">{b.stockHp} → {b.tunedHp} HP</span>
                      <div className="text-xs text-white/40">{b.stockNm} → {b.tunedNm} Nm</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(b)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold hover:border-[#e10600] hover:text-[#ff2a1f]">Edit</button>
                        <button onClick={() => del(b)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/60 hover:border-[#e10600] hover:text-[#ff2a1f]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.id ? "Edit Build" : "Add Build"} wide>
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Build title (e.g. Project Blitz)">
                <input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="field text-sm" />
              </Field>
              <Field label="Car (e.g. BMW M340i)">
                <input required value={editing.car} onChange={(e) => setEditing({ ...editing, car: e.target.value })} className="field text-sm" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as Build["category"] })} className="field text-sm">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Stage">
                <select value={editing.stage} onChange={(e) => setEditing({ ...editing, stage: e.target.value })} className="field text-sm">
                  {STAGES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Field label="Stock HP"><input type="number" value={editing.stockHp} onChange={(e) => setEditing({ ...editing, stockHp: +e.target.value })} className="field text-sm" /></Field>
              <Field label="Tuned HP"><input type="number" value={editing.tunedHp} onChange={(e) => setEditing({ ...editing, tunedHp: +e.target.value })} className="field text-sm" /></Field>
              <Field label="Stock Nm"><input type="number" value={editing.stockNm} onChange={(e) => setEditing({ ...editing, stockNm: +e.target.value })} className="field text-sm" /></Field>
              <Field label="Tuned Nm"><input type="number" value={editing.tunedNm} onChange={(e) => setEditing({ ...editing, tunedNm: +e.target.value })} className="field text-sm" /></Field>
            </div>
            <Field label="Mods (comma-separated)">
              <textarea rows={2} value={editing.mods} onChange={(e) => setEditing({ ...editing, mods: e.target.value })} className="field text-sm" placeholder="Stage 2 flash, Catted downpipe, FMIC kit" />
            </Field>
            <Field label="Owner quote">
              <input value={editing.quote} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} className="field text-sm" placeholder="It pulls like it's angry at physics now." />
            </Field>

            {/* car photo */}
            <Field label="Car photo (shown on the gallery & homepage cards)">
              <div className="flex items-center gap-4">
                <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  {editing.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={editing.image} alt="Car preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-center text-[10px] text-white/35"
                      style={{ background: `radial-gradient(circle at 30% 25%, hsl(${editing.hue} 55% 26%), #0c0c0e 75%)` }}>
                      No photo<br />(uses colour)
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={() => setPickImage(true)} className="rounded-md border border-white/15 px-4 py-2 text-xs font-semibold hover:border-[#e10600] hover:text-[#ff2a1f]">
                    {editing.image ? "Change photo" : "Set photo"}
                  </button>
                  {editing.image && (
                    <button type="button" onClick={() => setEditing({ ...editing, image: "" })} className="text-xs font-semibold text-[#ff2a1f]">Remove photo</button>
                  )}
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-2 items-end gap-3">
              <Field label={`Fallback colour hue (${editing.hue}°)`}>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={360} value={editing.hue} onChange={(e) => setEditing({ ...editing, hue: +e.target.value })} className="w-full disabled:opacity-40" disabled={!!editing.image} />
                  <span
                    className="h-8 w-8 shrink-0 rounded-md border border-white/15"
                    style={{ background: `radial-gradient(circle at 30% 25%, hsl(${editing.hue} 55% 26%), #0c0c0e 75%)` }}
                    aria-hidden
                  />
                </div>
              </Field>
              <label className={cx("flex items-center gap-2 pb-2 text-sm", editing.tall ? "text-white" : "text-white/60")}>
                <input type="checkbox" checked={!!editing.tall} onChange={(e) => setEditing({ ...editing, tall: e.target.checked })} />
                Tall card in gallery (spans 2 rows)
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
              <button type="button" onClick={() => setEditing(null)} className="btn btn-outline rounded-md px-6 py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-primary rounded-md px-6 py-2.5 text-sm disabled:opacity-60">{saving ? "Saving…" : "Save Build"}</button>
            </div>

            <MediaPicker
              open={pickImage}
              onClose={() => setPickImage(false)}
              current={editing.image ?? ""}
              title="Set Car Photo"
              clearLabel="Clear photo (use colour)"
              onPick={(url) => { setEditing({ ...editing, image: url }); setPickImage(false); }}
            />
          </form>
        )}
      </Modal>
    </div>
  );
}
