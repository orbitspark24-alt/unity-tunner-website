"use client";

import { useEffect, useState } from "react";
import { Panel, Field, Spinner } from "@/components/admin/AdminUI";
import { adminFetch } from "@/lib/adminClient";
import { invalidateSite } from "@/lib/useSite";
import type { SiteSettings, SiteStat, SiteTestimonial } from "@/lib/site";
import { IconX } from "@/components/Icons";

const BLANK_STAT: SiteStat = { value: 0, prefix: "", suffix: "", decimals: 0, label: "" };
const BLANK_TESTIMONIAL: SiteTestimonial = { name: "", car: "", text: "", rating: 5, hue: 0 };

export default function SiteAdmin() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(0);

  useEffect(() => {
    adminFetch("/api/admin/site").then((r) => r.json()).then(setS).catch(() => {});
  }, []);

  const save = async () => {
    if (!s) return;
    setSaving(true);
    const res = await adminFetch("/api/admin/site", { method: "PUT", body: JSON.stringify(s) });
    setSaving(false);
    if (res.ok) {
      setS(await res.json());
      invalidateSite();
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(0), 2500);
    } else {
      alert((await res.json()).error ?? "Save failed");
    }
  };

  if (!s) return <Spinner />;

  const setHero = (k: keyof SiteSettings["hero"], v: string) => setS({ ...s, hero: { ...s.hero, [k]: v } });
  const setWs = <K extends keyof SiteSettings["workshop"]>(k: K, v: SiteSettings["workshop"][K]) =>
    setS({ ...s, workshop: { ...s.workshop, [k]: v } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">CMS</div>
          <h1 className="display text-4xl">Site Content</h1>
          <p className="mt-1 text-sm text-white/45">Everything here goes live on the storefront the moment you save.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt > 0 && <span className="text-sm font-semibold text-green-400">✓ Saved &amp; live</span>}
          <button onClick={save} disabled={saving} className="btn btn-primary rounded-md px-6 py-2.5 text-sm disabled:opacity-60">
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </div>

      {/* hero */}
      <Panel title="Homepage Hero">
        <div className="space-y-3">
          <Field label="Badge (small pill above the title)">
            <input value={s.hero.badge} onChange={(e) => setHero("badge", e.target.value)} className="field text-sm" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title line 1 (white)">
              <input value={s.hero.title1} onChange={(e) => setHero("title1", e.target.value)} className="field text-sm" />
            </Field>
            <Field label="Title line 2 (red)">
              <input value={s.hero.title2} onChange={(e) => setHero("title2", e.target.value)} className="field text-sm" />
            </Field>
          </div>
          <Field label="Subtitle">
            <textarea rows={2} value={s.hero.subtitle} onChange={(e) => setHero("subtitle", e.target.value)} className="field text-sm" />
          </Field>
        </div>
      </Panel>

      {/* stats */}
      <Panel title="Homepage Stats Bar" action={<AddRow onClick={() => setS({ ...s, stats: [...s.stats, { ...BLANK_STAT }] })} />}>
        <StatRows rows={s.stats} onChange={(rows) => setS({ ...s, stats: rows })} />
      </Panel>

      <Panel title="About Page Stats" action={<AddRow onClick={() => setS({ ...s, aboutStats: [...s.aboutStats, { ...BLANK_STAT }] })} />}>
        <StatRows rows={s.aboutStats} onChange={(rows) => setS({ ...s, aboutStats: rows })} />
      </Panel>

      {/* workshop */}
      <Panel title="Workshop / Contact Details">
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Address line 1">
              <input value={s.workshop.address1} onChange={(e) => setWs("address1", e.target.value)} className="field text-sm" />
            </Field>
            <Field label="Address line 2">
              <input value={s.workshop.address2} onChange={(e) => setWs("address2", e.target.value)} className="field text-sm" />
            </Field>
            <Field label="Phone">
              <input value={s.workshop.phone} onChange={(e) => setWs("phone", e.target.value)} className="field text-sm" />
            </Field>
            <Field label="Email">
              <input type="email" value={s.workshop.email} onChange={(e) => setWs("email", e.target.value)} className="field text-sm" />
            </Field>
          </div>
          <Field label="Business hours">
            <div className="space-y-2">
              {s.workshop.hours.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Days (e.g. Monday – Friday)"
                    value={h.days}
                    onChange={(e) => setWs("hours", s.workshop.hours.map((r, j) => (j === i ? { ...r, days: e.target.value } : r)))}
                    className="field text-sm"
                  />
                  <input
                    placeholder="Time (e.g. 9:00 AM – 7:00 PM)"
                    value={h.time}
                    onChange={(e) => setWs("hours", s.workshop.hours.map((r, j) => (j === i ? { ...r, time: e.target.value } : r)))}
                    className="field text-sm"
                  />
                  <RemoveRow onClick={() => setWs("hours", s.workshop.hours.filter((_, j) => j !== i))} />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setWs("hours", [...s.workshop.hours, { days: "", time: "" }])}
                className="text-xs font-semibold text-[#ff2a1f]"
              >
                + Add hours row
              </button>
            </div>
          </Field>
          <p className="text-xs text-white/35">Shown in the footer and the contact page. The WhatsApp button number is set via the NEXT_PUBLIC_WHATSAPP_NUMBER env var.</p>
        </div>
      </Panel>

      {/* testimonials */}
      <Panel
        title="Testimonials"
        action={<AddRow label="+ Add testimonial" onClick={() => setS({ ...s, testimonials: [...s.testimonials, { ...BLANK_TESTIMONIAL }] })} />}
      >
        <div className="space-y-4">
          {s.testimonials.map((t, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-[#0d0d0f] p-4">
              <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_1fr_110px_auto]">
                <input
                  placeholder="Name"
                  value={t.name}
                  onChange={(e) => setS({ ...s, testimonials: s.testimonials.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)) })}
                  className="field text-sm"
                />
                <input
                  placeholder="Car / context (e.g. Delhi — ECU Remapping)"
                  value={t.car}
                  onChange={(e) => setS({ ...s, testimonials: s.testimonials.map((r, j) => (j === i ? { ...r, car: e.target.value } : r)) })}
                  className="field text-sm"
                />
                <select
                  value={t.rating}
                  onChange={(e) => setS({ ...s, testimonials: s.testimonials.map((r, j) => (j === i ? { ...r, rating: +e.target.value } : r)) })}
                  className="field text-sm"
                  aria-label="Rating"
                >
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                </select>
                <RemoveRow onClick={() => setS({ ...s, testimonials: s.testimonials.filter((_, j) => j !== i) })} />
              </div>
              <textarea
                rows={2}
                placeholder="What they said…"
                value={t.text}
                onChange={(e) => setS({ ...s, testimonials: s.testimonials.map((r, j) => (j === i ? { ...r, text: e.target.value } : r)) })}
                className="field text-sm"
              />
            </div>
          ))}
        </div>
      </Panel>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn btn-primary rounded-md px-8 py-3 text-sm disabled:opacity-60">
          {saving ? "Saving…" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}

function StatRows({ rows, onChange }: { rows: SiteStat[]; onChange: (rows: SiteStat[]) => void }) {
  const set = (i: number, patch: Partial<SiteStat>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-2">
      <div className="hidden grid-cols-[1fr_90px_70px_70px_70px_auto] gap-2 text-[10px] uppercase tracking-wider text-white/35 sm:grid">
        <span>Label</span><span>Value</span><span>Prefix</span><span>Suffix</span><span>Decimals</span><span />
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_90px_70px_70px_70px_auto]">
          <input placeholder="Label" value={r.label} onChange={(e) => set(i, { label: e.target.value })} className="field text-sm col-span-2 sm:col-span-1" />
          <input type="number" step="any" placeholder="Value" value={r.value} onChange={(e) => set(i, { value: +e.target.value })} className="field text-sm" />
          <input placeholder="+" value={r.prefix} onChange={(e) => set(i, { prefix: e.target.value })} className="field text-sm" />
          <input placeholder="%" value={r.suffix} onChange={(e) => set(i, { suffix: e.target.value })} className="field text-sm" />
          <input type="number" min={0} max={2} value={r.decimals} onChange={(e) => set(i, { decimals: +e.target.value })} className="field text-sm" />
          <RemoveRow onClick={() => onChange(rows.filter((_, j) => j !== i))} />
        </div>
      ))}
    </div>
  );
}

function AddRow({ onClick, label = "+ Add row" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="text-xs font-semibold text-[#ff2a1f] hover:underline">
      {label}
    </button>
  );
}

function RemoveRow({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Remove row" className="flex shrink-0 items-center justify-center rounded-md border border-white/15 px-2.5 text-white/50 hover:border-[#e10600] hover:text-[#ff2a1f]">
      <IconX width={14} height={14} />
    </button>
  );
}
