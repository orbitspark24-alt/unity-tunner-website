"use client";

import { useEffect, useRef, useState } from "react";
import { Panel, Spinner, EmptyState } from "@/components/admin/AdminUI";
import { IconX } from "@/components/Icons";
import { adminFetch } from "@/lib/adminClient";
import type { Media } from "@/lib/db";

const MAX_BYTES = 4 * 1024 * 1024;

export default function MediaAdmin() {
  const [media, setMedia] = useState<Media[] | null>(null);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => adminFetch("/api/admin/media").then((r) => r.json()).then(setMedia).catch(() => setMedia([]));
  useEffect(() => { load(); }, []);

  const add = async (payload: { name: string; url: string }) => {
    setBusy(true);
    setErr("");
    const res = await adminFetch("/api/admin/media", { method: "POST", body: JSON.stringify(payload) });
    setBusy(false);
    if (res.ok) { setUrl(""); setName(""); load(); }
    else setErr((await res.json()).error ?? "Upload failed");
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => {
      if (f.size > MAX_BYTES) { setErr(`${f.name} is over 4MB.`); return; }
      const reader = new FileReader();
      reader.onload = () => add({ name: f.name, url: String(reader.result) });
      reader.readAsDataURL(f);
    });
  };

  const del = async (id: string) => { await adminFetch(`/api/admin/media/${id}`, { method: "DELETE" }); load(); };
  const copy = (u: string) => navigator.clipboard?.writeText(u).catch(() => {});

  return (
    <div>
      <div className="mb-6">
        <div className="display text-xs tracking-[0.4em] text-[#ff2a1f]">Assets</div>
        <h1 className="display text-4xl">Media Library</h1>
        <p className="mt-1 text-sm text-white/50">Upload product photos & brand imagery, then attach them to products in the catalogue editor.</p>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Upload Files">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 py-10 text-center text-white/50 transition-colors hover:border-[#e10600]/50 hover:text-white/70"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 16V4M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"/></svg>
            <span className="text-sm">Drop images here or click to browse</span>
            <span className="text-xs text-white/35">PNG / JPG / WEBP · up to 4MB each</span>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
        </Panel>

        <Panel title="Add by URL">
          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Label (optional)" className="field text-sm" />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…/image.jpg" className="field text-sm" />
            <button disabled={!url || busy} onClick={() => add({ name: name || "image", url })} className="btn btn-primary w-full rounded-md px-5 py-2.5 text-sm disabled:opacity-40">
              {busy ? "Adding…" : "Add Image"}
            </button>
          </div>
        </Panel>
      </div>

      {err && <p className="mb-4 rounded-md bg-[#e10600]/10 px-4 py-2.5 text-sm text-[#ff2a1f]">{err}</p>}

      {media === null ? <Spinner /> : media.length === 0 ? (
        <EmptyState>No media yet. Upload something above.</EmptyState>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <div key={m.id} className="group overflow-hidden rounded-xl border border-white/10 bg-[#101012]">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                <button onClick={() => del(m.id)} aria-label="Delete image" className="absolute right-2 top-2 rounded-md bg-black/60 p-1.5 text-white/80 opacity-0 transition-opacity hover:text-[#ff2a1f] group-hover:opacity-100">
                  <IconX width={14} height={14} />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2 p-2.5">
                <span className="truncate text-xs text-white/55">{m.name}</span>
                <button onClick={() => copy(m.url)} className="shrink-0 text-[11px] font-semibold text-[#ff2a1f] hover:underline">Copy URL</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
