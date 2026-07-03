"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";
import { IconCart, IconX } from "./Icons";
import { useShop, cartCount } from "@/lib/store";
import { cx } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Marketplace" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Builds" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const cart = useShop((s) => s.cart);
  const openDrawer = useShop((s) => s.openDrawer);
  const count = cartCount(cart);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-[100] border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md"
          : "border-transparent bg-gradient-to-b from-black/70 to-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 py-2" aria-label="Unity Motorsports home">
          <Logo size={scrolled ? 44 : 56} className="transition-all duration-300" />
          <div className="hidden sm:block leading-none">
            <div className="display text-lg text-white">Unity Tuner</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e10600]">Motorsports</div>
          </div>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cx(
                  "card-sweep display pb-1 text-sm tracking-widest transition-colors",
                  pathname === l.href ? "text-[#ff2a1f]" : "text-white/80 hover:text-white"
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            id="cart-icon"
            onClick={openDrawer}
            className="relative rounded-md border border-white/15 p-2.5 text-white/90 transition-colors hover:border-[#e10600] hover:text-[#ff2a1f]"
            aria-label={`Open cart, ${count} items`}
          >
            <IconCart width={20} height={20} />
            <AnimatePresence>
              {mounted && count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e10600] px-1 text-[11px] font-bold"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Link href="/booking" className="btn btn-primary hidden rounded-md px-5 py-2.5 text-sm sm:inline-flex">
            Book Now
          </Link>

          <button
            className="rounded-md border border-white/15 p-2.5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <IconX width={20} height={20} />
            ) : (
              <svg width={20} height={20} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} fill="none" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h12" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md lg:hidden"
          >
            <ul className="space-y-1 px-4 py-4">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={l.href}
                    className={cx(
                      "display block rounded-md px-3 py-3 text-lg tracking-widest",
                      pathname === l.href ? "bg-[#e10600]/10 text-[#ff2a1f]" : "text-white/85"
                    )}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-2">
                <Link href="/booking" className="btn btn-primary w-full rounded-md px-5 py-3 text-sm">
                  Book a Tune
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
