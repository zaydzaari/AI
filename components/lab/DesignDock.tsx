"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, LayoutGrid, Minus, Plus } from "lucide-react";
import { DESIGNS, neighbours } from "@/lib/designs";

/**
 * Persistent switcher shown on every concept page (hidden inside iframes).
 * Keys: [ / ] or Shift+←/→ = prev/next · g = gallery · . = hide/show
 */
export function DesignDock() {
  const path = usePathname();
  const router = useRouter();
  const id = path.split("/").pop() ?? "01";
  const [embedded, setEmbedded] = useState(true);
  const [open, setOpen] = useState(true);
  const { prev, next } = neighbours(id);
  const current = DESIGNS.find((d) => d.id === id);

  useEffect(() => {
    setEmbedded(window.self !== window.top);
    try {
      setOpen(localStorage.getItem("aether-dock") !== "closed");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("aether-dock", open ? "open" : "closed");
    } catch {}
  }, [open]);

  useEffect(() => {
    if (embedded) return;
    DESIGNS.forEach((d) => router.prefetch(`/designs/${d.id}`));
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName) || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // read the live URL so fast repeated presses never use a stale route
      const n = neighbours(window.location.pathname.split("/").pop() ?? "01");
      if (e.key === "]" || (e.shiftKey && e.key === "ArrowRight")) router.push(`/designs/${n.next.id}`);
      else if (e.key === "[" || (e.shiftKey && e.key === "ArrowLeft")) router.push(`/designs/${n.prev.id}`);
      else if (e.key === "g") router.push("/designs");
      else if (e.key === ".") setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [embedded, router]);

  if (embedded || !current) return null;

  return (
    <div
      data-dock
      className="fixed bottom-4 left-4 z-[9999] text-[12.5px] text-white"
      style={{ fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, sans-serif" }}
    >
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.nav
            key="open"
            aria-label="Design switcher"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-0.5 rounded-full border border-white/15 bg-[#111]/85 p-1 shadow-[0_12px_40px_-8px_rgba(0,0,0,.55)] backdrop-blur-md"
          >
            <Link href="/designs" className="flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-white/10" title="Back to gallery (g)">
              <LayoutGrid size={14} /> <span className="hidden sm:inline">Gallery</span>
            </Link>
            <span className="mx-0.5 h-4 w-px bg-white/15" />
            <Link href={`/designs/${prev.id}`} aria-label={`Previous: ${prev.name}`} title="Previous ([)" className="rounded-full p-1.5 hover:bg-white/10">
              <ChevronLeft size={15} />
            </Link>
            <label htmlFor="dock-select" className="sr-only">Jump to design</label>
            <select
              id="dock-select"
              value={id}
              onChange={(e) => router.push(`/designs/${e.target.value}`)}
              className="max-w-[150px] cursor-pointer appearance-none truncate rounded-full bg-transparent px-2 py-1 text-white outline-none hover:bg-white/10 sm:max-w-none"
            >
              {DESIGNS.map((d) => (
                <option key={d.id} value={d.id} className="bg-[#111]">
                  {d.id} {d.name}
                </option>
              ))}
            </select>
            <Link href={`/designs/${next.id}`} aria-label={`Next: ${next.name}`} title="Next (])" className="rounded-full p-1.5 hover:bg-white/10">
              <ChevronRight size={15} />
            </Link>
            <button onClick={() => setOpen(false)} aria-label="Hide switcher (.)" title="Hide (.)" className="rounded-full p-1.5 text-white/60 hover:bg-white/10">
              <Minus size={14} />
            </button>
          </motion.nav>
        ) : (
          <motion.button
            key="closed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            aria-label="Show design switcher"
            className="flex items-center gap-1 rounded-full border border-white/15 bg-[#111]/80 px-2.5 py-1.5 font-mono text-[11px] backdrop-blur-md"
          >
            {id} <Plus size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
