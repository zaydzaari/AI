"use client";

import { motion } from "motion/react";

/** Re-mounts on every concept navigation: a quick curtain fade between designs. */
export default function ConceptTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
