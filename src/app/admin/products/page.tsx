"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel, Modal, Field, Spinner, EmptyState } from "@/components/admin/AdminUI";
import MediaPicker from "@/components/admin/MediaPicker";
import ProductArt from "@/components/ProductArt";
import { adminFetch } from "@/lib/adminClient";
import { CATEGORIES, CAR_MAKES, type Product, type Category } from "@/lib/products";
import { inr, cx } from "@/lib/utils";
import { IconX, IconSearch } from "@/components/Icons";

type Form = {
  slug?: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  badge: "" | "Best Seller" | "New Arrival";
  inStock: boolean;
  hue: number;
  imageUrl: string;
  short: string;
  description: string;
  specs: [string, string][];
  fitment: string[];
};

const BLANK: Form = {
  name: "", brand: "Unity Performance", category: "Air Filters", price: 0, mrp: 0, rating: 5, reviews: 0,
  badge: "", inStock: true, hue: 0, imageUrl: "", short: "", description: "", specs: [["", ""]], fitment: ["Universal"],
};

const FITMENT_OPTIONS = ["Universal", ...CAR_MAKES];

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Form | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => adminFetch("/api/admin/products").then((r) => r.json()).then(setProducts).catch(() => setProducts([]));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => (products ?? []).filter((p) => !q || (p.name + p.brand + p.category).toLowerCase().includes(q.toLowerCase())),
    [products, q]
  );

  const openNew = () => { setEditing({ ...BLANK }); setIsNew(true); };
  const openEdit = (p: Product) => {
    setEditing({
      slug: p.slug, name: p.name, brand: p.brand, category: p.category, price: p.price, mrp: p.mrp,
      rating: p.rating, reviews: p.reviews, badge: (p.badge as Form["badge"]) || "", inStock: p.inStock,
      hue: p.hue, imageUrl: p.imageUrl || "", short: p.short, description: p.description,
      specs: p.specs.length ? p.specs : [["", ""]], fitment: p.fitment,
    });
    setIsNew(false);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = { ...editing, specs: editing.specs.filter(([k, v]) => k || v) };
    const res = isNew
      ? await adminFetch("/api/admin/products", { method: "POST", body: JSON.stringify(payload) })
      : await adminFetch(`/api/admin/products/${editing.slug}`, { method: "PATCH", body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) { setEditing(null); load(); }
    else alert((await res.json()).error ?? "Save failed");
  };

  const del = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This removes it from the storefront.`)) return;
    await adminFetch(`/api/admin/products/${p.slug}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Catalogue</div>
          <h1 className="display text-4xl">Products</h1>
        </div>
        <button onClick={openNew} className="btn btn-primary rounded-md px-5 py-2.5 text-sm">+ Add Product</button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <IconSearch width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="field pl-10 text-sm" aria-label="Search products" />
      </div>

      {products === null ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <EmptyState>No products match. <button onClick={openNew} className="text-[#ff2a1f] underline">Add one</button>.</EmptyState>
      ) : (
        <Panel className="!p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/45">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.slug} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-white/10">
                          <ProductArt product={p} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{p.name}</div>
                          <div className="text-xs text-white/40">{p.brand}{p.badge ? ` · ${p.badge}` : ""}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="display text-[#ff2a1f]">{inr(p.price)}</span>
                      {p.mrp > p.price && <span className="ml-1 text-xs text-white/30 line-through">{inr(p.mrp)}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cx("rounded-full px-2 py-0.5 text-[11px] font-bold", p.inStock ? "bg-green-600/15 text-green-400" : "bg-white/10 text-white/45")}>
                        {p.inStock ? "In stock" : "Out"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold hover:border-[#e10600] hover:text-[#ff2a1f]">Edit</button>
                        <button onClick={() => del(p)} className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/60 hover:border-[#e10600] hover:text-[#ff2a1f]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add Product" : "Edit Product"} wide>
        {editing && <ProductForm form={editing} setForm={setEditing} onSave={save} saving={saving} onCancel={() => setEditing(null)} />}
      </Modal>
    </div>
  );
}

function ProductForm({ form, setForm, onSave, saving, onCancel }: {
  form: Form; setForm: (f: Form) => void; onSave: () => void; saving: boolean; onCancel: () => void;
}) {
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm({ ...form, [k]: v });
  const [mediaOpen, setMediaOpen] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        {/* preview */}
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border border-white/10">
            <ProductArt product={{ slug: form.slug ?? "new", category: form.category, hue: form.hue, imageUrl: form.imageUrl || undefined, name: form.name }} />
          </div>
          <button type="button" onClick={() => setMediaOpen(true)} className="mt-2 w-full rounded-md border border-white/15 py-1.5 text-xs hover:border-[#e10600] hover:text-[#ff2a1f]">
            Set image
          </button>
        </div>
        <div className="space-y-3">
          <Field label="Name"><input required value={form.name} onChange={(e) => set("name", e.target.value)} className="field text-sm" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand"><input value={form.brand} onChange={(e) => set("brand", e.target.value)} className="field text-sm" /></Field>
            <Field label="Category">
              <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} className="field text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Price ₹"><input type="number" value={form.price} onChange={(e) => set("price", +e.target.value)} className="field text-sm" /></Field>
        <Field label="MRP ₹"><input type="number" value={form.mrp} onChange={(e) => set("mrp", +e.target.value)} className="field text-sm" /></Field>
        <Field label="Rating"><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set("rating", +e.target.value)} className="field text-sm" /></Field>
        <Field label="# Reviews"><input type="number" value={form.reviews} onChange={(e) => set("reviews", +e.target.value)} className="field text-sm" /></Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field label="Badge">
          <select value={form.badge} onChange={(e) => set("badge", e.target.value as Form["badge"])} className="field text-sm">
            <option value="">None</option>
            <option value="Best Seller">Best Seller</option>
            <option value="New Arrival">New Arrival</option>
          </select>
        </Field>
        <Field label={`Art hue (${form.hue}°)`}>
          <input type="range" min="0" max="360" value={form.hue} onChange={(e) => set("hue", +e.target.value)} className="w-full" disabled={!!form.imageUrl} />
        </Field>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} /> In stock
        </label>
      </div>

      <Field label="Short tagline"><input value={form.short} onChange={(e) => set("short", e.target.value)} className="field text-sm" /></Field>
      <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="field text-sm" /></Field>

      {/* fitment */}
      <Field label="Fitment (car makes)">
        <div className="flex flex-wrap gap-2">
          {FITMENT_OPTIONS.map((m) => {
            const on = form.fitment.includes(m);
            return (
              <button
                type="button"
                key={m}
                onClick={() => set("fitment", on ? form.fitment.filter((x) => x !== m) : [...form.fitment, m])}
                className={cx("rounded-full border px-3 py-1 text-xs transition-colors", on ? "border-[#e10600] bg-[#e10600]/15 text-[#ff2a1f]" : "border-white/15 text-white/55 hover:border-white/35")}
              >
                {m}
              </button>
            );
          })}
        </div>
      </Field>

      {/* specs */}
      <Field label="Specifications">
        <div className="space-y-2">
          {form.specs.map((row, i) => (
            <div key={i} className="flex gap-2">
              <input placeholder="Label" value={row[0]} onChange={(e) => { const s = [...form.specs]; s[i] = [e.target.value, row[1]]; set("specs", s); }} className="field text-sm" />
              <input placeholder="Value" value={row[1]} onChange={(e) => { const s = [...form.specs]; s[i] = [row[0], e.target.value]; set("specs", s); }} className="field text-sm" />
              <button type="button" onClick={() => set("specs", form.specs.filter((_, j) => j !== i))} aria-label="Remove spec" className="shrink-0 rounded-md border border-white/15 px-2 text-white/50 hover:text-[#ff2a1f]"><IconX width={14} height={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => set("specs", [...form.specs, ["", ""]])} className="text-xs font-semibold text-[#ff2a1f]">+ Add spec row</button>
        </div>
      </Field>

      <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-outline rounded-md px-6 py-2.5 text-sm">Cancel</button>
        <button type="submit" disabled={saving} className="btn btn-primary rounded-md px-6 py-2.5 text-sm disabled:opacity-60">{saving ? "Saving…" : "Save Product"}</button>
      </div>

      <MediaPicker open={mediaOpen} onClose={() => setMediaOpen(false)} current={form.imageUrl} title="Set Product Image" clearLabel="Clear image (use generated art)" onPick={(url) => { set("imageUrl", url); setMediaOpen(false); }} />
    </form>
  );
}
