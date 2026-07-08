"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/admin/AdminUI";
import { adminFetch } from "@/lib/adminClient";
import { cx } from "@/lib/utils";
import type { Media } from "@/lib/db";

/**
 * Shared image picker for the admin console. Paste an external URL or choose
 * from the uploaded media library. Used by Products and Builds.
 */
export default function MediaPicker({
  open,
  onClose,
  onPick,
  current,
  title = "Choose Image",
  clearLabel = "Clear image",
}: {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
  current: string;
  title?: string;
  clearLabel?: string;
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) adminFetch("/api/admin/media").then((r) => r.json()).then(setMedia).catch(() => {});
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste an image URL…" className="field text-sm" />
          <button type="button" disabled={!url} onClick={() => onPick(url)} className="btn btn-primary rounded-md px-4 text-xs disabled:opacity-40">Use</button>
        </div>
        <p className="text-xs text-white/40">Or pick from your media library (upload files under Media).</p>
        <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {media.map((m) => (
            // eslint-disable-next-line @next/next/no-img-element
            <button
              type="button"
              key={m.id}
              onClick={() => onPick(m.url)}
              className={cx("aspect-square overflow-hidden rounded-md border-2", current === m.url ? "border-[#e10600]" : "border-white/10 hover:border-white/40")}
            >
              <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        {media.length === 0 && <p className="text-sm text-white/40">No media uploaded yet.</p>}
        {current && (
          <button type="button" onClick={() => onPick("")} className="text-xs font-semibold text-[#ff2a1f]">{clearLabel}</button>
        )}
      </div>
    </Modal>
  );
}
