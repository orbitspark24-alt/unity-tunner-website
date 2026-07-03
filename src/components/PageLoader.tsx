"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./Logo";

/** Turbo spool-up intro: logo spins fast, settles, then the site reveals. Shown once per tab session. */
export default function PageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("unity-loaded")) return;
    sessionStorage.setItem("unity-loaded", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 2100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#060607]"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ rotate: 0, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 1080, scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.85, 0, 0.15, 1] }}
          >
            <Logo size={130} />
          </motion.div>
          <motion.div
            className="display mt-6 text-sm tracking-[0.5em] text-white/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            SPOOLING UP
          </motion.div>
          <motion.div
            className="mt-4 h-0.5 w-40 origin-left bg-[#e10600]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 1.6, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
