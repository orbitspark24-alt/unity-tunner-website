"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { IconCheck } from "./Icons";
import { useSite } from "@/lib/useSite";

const QUICK_LINKS = [
  ["Marketplace", "/shop"],
  ["Book a Tune", "/booking"],
  ["Services", "/services"],
  ["Our Builds", "/gallery"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/unityperformance", d: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" },
  { label: "Facebook", href: "https://facebook.com/unityperformance", d: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" },
  { label: "LinkedIn", href: "https://linkedin.com/company/unityperformance", d: "M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.5 2.5 0 0 1 4.98 3.5zM3 8.5h4V21H3zM9.5 8.5h3.8v1.7h.05a4.2 4.2 0 0 1 3.77-2.07c4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.84-3s-2.12 1.43-2.12 2.9V21h-4z" },
];

export default function Footer() {
  const { settings } = useSite();
  const ws = settings.workshop;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="carbon-bg border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center">
            <Logo size={60} />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Bespoke ECU calibration that bridges the gap between stock performance and racing-grade efficiency. 19+ years, 30,000+ vehicles optimized.
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="rounded-md border border-white/15 p-2.5 text-white/60 transition-colors hover:border-[#e10600] hover:text-[#ff2a1f]"
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="display mb-4 text-sm tracking-[0.25em] text-white/85">Quick Links</h3>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-3 bg-[#e10600] transition-all group-hover:w-5" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="display mb-4 text-sm tracking-[0.25em] text-white/85">Workshop</h3>
          <address className="space-y-2.5 text-sm not-italic leading-relaxed text-white/55">
            <p>{ws.address1}<br />{ws.address2}</p>
            <p><a href={`tel:${ws.phone.replace(/\s/g, "")}`} className="hover:text-white">{ws.phone}</a></p>
            <p><a href={`mailto:${ws.email}`} className="hover:text-white">{ws.email}</a></p>
            <p className="text-white/40">
              {ws.hours.map((h) => (
                <span key={h.days} className="block">{h.days} · {h.time}</span>
              ))}
            </p>
          </address>
        </div>

        <div>
          <h3 className="display mb-4 text-sm tracking-[0.25em] text-white/85">Stay in Boost</h3>
          <p className="mb-4 text-sm text-white/55">Dyno days, new parts, tuning drops. No spam — we hate lag.</p>
          {done ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 rounded-md border border-green-600/40 bg-green-600/10 px-4 py-3 text-sm text-green-400">
              <IconCheck width={18} height={18} /> You&apos;re on the list. Welcome to the crew.
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) {
                  fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "newsletter", email }),
                  }).catch(() => {});
                  setDone(true);
                }
              }}
              className="group relative"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="field pr-24"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="btn btn-primary absolute right-1 top-1 bottom-1 rounded px-4 text-xs">
                Join
              </button>
              <span className="pointer-events-none absolute -bottom-0.5 left-0 h-0.5 w-0 bg-[#e10600] transition-all duration-500 group-focus-within:w-full" />
            </form>
          )}

          <div className="mt-6">
            <div className="mb-2 text-xs uppercase tracking-widest text-white/35">We accept</div>
            <div className="flex flex-wrap gap-2">
              {["UPI", "Visa", "Mastercard", "RuPay", "Razorpay", "EMI"].map((m) => (
                <span key={m} className="rounded border border-white/12 bg-[#17171b] px-2.5 py-1 text-[11px] font-semibold text-white/60">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="metal-line" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/40 sm:flex-row sm:px-6">
        <span>© {new Date().getFullYear()} Unity Performance. All torque reserved.</span>
        <span className="display tracking-[0.3em] text-[#e10600]/80">More Power. Zero Compromise.</span>
      </div>
    </footer>
  );
}
