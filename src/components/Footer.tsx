"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { IconCheck } from "./Icons";

const QUICK_LINKS = [
  ["Marketplace", "/shop"],
  ["Book a Tune", "/booking"],
  ["Services", "/services"],
  ["Our Builds", "/gallery"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
] as const;

const SOCIALS = [
  { label: "Instagram", d: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.5 6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" },
  { label: "YouTube", d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26.5 26.5 0 0 0 2 12a26.5 26.5 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26.5 26.5 0 0 0 22 12a26.5 26.5 0 0 0-.4-4.8zM10 15V9l5.2 3z" },
  { label: "X", d: "M17.8 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L2 3h6.4l4.4 5.9zm-1.1 16.1h1.7L7.5 4.8H5.7z" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="carbon-bg border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={64} />
            <div className="leading-none">
              <div className="display text-xl">Unity Tuner</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e10600]">Motorsports Performance</div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            Precision ECU calibration, dyno-proven parts and honest numbers. Tuning India&apos;s streets since 2015.
          </p>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
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
            <p>Unit 7, Speedway Industrial Estate,<br />Outer Ring Road, Bengaluru 560103</p>
            <p><a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a></p>
            <p><a href="mailto:pit@unitytuner.in" className="hover:text-white">pit@unitytuner.in</a></p>
            <p className="text-white/40">Mon–Sat · 9:00–19:00<br />Sunday · By appointment</p>
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
        <span>© {new Date().getFullYear()} Unity Motorsports Performance. All torque reserved.</span>
        <span className="display tracking-[0.3em] text-[#e10600]/80">More Power. Zero Compromise.</span>
      </div>
    </footer>
  );
}
