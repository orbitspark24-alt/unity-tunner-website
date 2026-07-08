"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Section reveal: slides in like a launch. Transform + opacity only —
 * both composited, so scrolling stays 60fps even with many sections.
 * (Previously animated CSS filter blur, which janks on the main thread.)
 */
export default function Reveal({
  children,
  delay = 0,
  x = 0,
  y = 36,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  x?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
