"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { isAuthed, login, logout } from "@/lib/adminClient";
import { cx } from "@/lib/utils";

type P = { className?: string };
const I = {
  dash: (p: P) => <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="11" width="7" height="10" rx="1.5"/><rect x="3" y="15" width="7" height="6" rx="1.5"/></svg>,
  box: (p: P) => <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/></svg>,
  cal: (p: P) => <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>,
  cart: (p: P) => <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 3h2.5l2.2 12.5h10.8L21 7H6"/></svg>,
  mail: (p: P) => <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/></svg>,
  star: (p: P) => <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><path d="M12 3l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4 6.1 20.8l1.3-6.6L2.5 10l6.6-.8L12 3z" strokeLinejoin="round"/></svg>,
  img: (p: P) => <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4 4 3 3-2 4 3"/></svg>,
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: I.dash, exact: true },
  { href: "/admin/products", label: "Products", icon: I.box },
  { href: "/admin/bookings", label: "Bookings", icon: I.cal },
  { href: "/admin/orders", label: "Sales / Orders", icon: I.cart },
  { href: "/admin/leads", label: "Leads", icon: I.mail },
  { href: "/admin/reviews", label: "Reviews", icon: I.star },
  { href: "/admin/media", label: "Media", icon: I.img },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => setAuthed(isAuthed()), []);

  if (authed === null) return <div className="min-h-screen bg-[#0a0a0a]" />;
  if (!authed) return <LoginGate onDone={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] lg:grid lg:grid-cols-[248px_1fr]">
      {/* sidebar */}
      <aside className="sticky top-0 z-30 flex h-auto flex-col border-b border-white/10 bg-[#0d0d0f] lg:h-screen lg:border-b-0 lg:border-r">
        <Link href="/admin" className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Logo size={40} />
          <div className="leading-none">
            <div className="display text-base">Unity Pit Wall</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#e10600]">Admin Console</div>
          </div>
        </Link>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cx(
                  "flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors",
                  active ? "bg-[#e10600]/12 font-semibold text-[#ff2a1f]" : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon /> <span className="whitespace-nowrap">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="hidden gap-2 border-t border-white/10 p-3 lg:flex lg:flex-col">
          <Link href="/" className="rounded-lg px-3.5 py-2.5 text-sm text-white/55 hover:bg-white/5 hover:text-white">↗ View storefront</Link>
          <button
            onClick={() => { logout(); setAuthed(false); }}
            className="rounded-lg px-3.5 py-2.5 text-left text-sm text-white/55 hover:bg-white/5 hover:text-[#ff2a1f]"
          >
            ⏻ Log out
          </button>
        </div>
      </aside>

      {/* content */}
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3 lg:hidden">
          <span className="text-xs text-white/45">Signed in as Admin</span>
          <button onClick={() => { logout(); setAuthed(false); }} className="text-xs font-semibold text-[#ff2a1f]">Log out</button>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

function LoginGate({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="carbon-bg pointer-events-none absolute inset-0 opacity-60" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm rounded-2xl border border-white/12 bg-[#101012] p-8 text-center shadow-2xl shadow-black/60"
      >
        <Logo size={72} className="mx-auto" />
        <h1 className="display mt-4 text-2xl">Pit Wall Access</h1>
        <p className="mt-1 text-sm text-white/50">Enter the admin password to continue.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (login(pw)) onDone();
            else setErr(true);
          }}
          className="mt-6 space-y-3"
        >
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(false); }}
            placeholder="Password"
            className="field text-center"
            aria-label="Admin password"
          />
          {err && <p className="text-sm text-[#ff2a1f]">Wrong password. Try again.</p>}
          <button type="submit" className="btn btn-primary w-full rounded-md px-6 py-3 text-sm">Unlock</button>
        </form>
        <p className="mt-5 rounded-md bg-white/5 px-3 py-2 text-xs text-white/40">
          Demo password: <span className="font-mono font-semibold text-white/70">unity2026</span>
        </p>
      </motion.div>
    </div>
  );
}
