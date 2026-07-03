"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { IconX } from "@/components/Icons";
import { cx } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={cx("rounded-xl border p-4", accent ? "border-[#e10600]/40 bg-[#e10600]/8" : "border-white/10 bg-[#101012]")}>
      <div className={cx("display text-2xl sm:text-3xl", accent ? "text-[#ff2a1f]" : "text-white")}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-widest text-white/45">{label}</div>
      {hint && <div className="mt-1 text-xs text-white/35">{hint}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-xl border border-white/10 bg-[#101012] p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="display text-lg tracking-wider">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatusPill({ status, map }: { status: string; map: Record<string, string> }) {
  return (
    <span className={cx("rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide", map[status] ?? "bg-white/10 text-white/50")}>
      {status}
    </span>
  );
}

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cx("block", className)}>
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-white/45">{label}</span>
      {children}
    </label>
  );
}

export function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={cx("my-8 w-full rounded-2xl border border-white/15 bg-[#131316]", wide ? "max-w-3xl" : "max-w-lg")}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={title}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h3 className="display text-xl">{title}</h3>
              <button onClick={onClose} aria-label="Close" className="rounded-md p-2 text-white/60 hover:text-[#ff2a1f]">
                <IconX width={18} height={18} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-white/12 bg-[#101012] py-16 text-center text-sm text-white/45">{children}</div>;
}

export const ORDER_STATUS: Record<string, string> = {
  paid: "bg-blue-500/15 text-blue-400",
  packed: "bg-purple-500/15 text-purple-400",
  shipped: "bg-amber-500/15 text-amber-400",
  delivered: "bg-green-600/15 text-green-400",
  refunded: "bg-white/10 text-white/40",
};

export const LEAD_STATUS: Record<string, string> = {
  new: "bg-[#e10600]/15 text-[#ff2a1f]",
  contacted: "bg-amber-500/15 text-amber-400",
  closed: "bg-white/10 text-white/45",
};

export function Spinner() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  );
}
