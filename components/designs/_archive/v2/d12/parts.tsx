"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, Check, Copy } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS } from "@/lib/content";
import { useChatDemo, useCopy, usePrefersReduced } from "@/lib/hooks";

const ease = [0.22, 1, 0.36, 1] as const;

export function Specimen({ compact = false }: { compact?: boolean }) {
  const c = useChatDemo(2);
  return (
    <div className="d12-glass overflow-hidden rounded-[22px] text-[var(--paper)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="d12-holo h-3 w-3 rounded-full" />
        <span className="d12-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Specimen · {c.model.name}</span>
        <div className="ml-auto flex gap-1">
          {MODELS.slice(0, compact ? 3 : 5).map((m) => (
            <button key={m.id} onClick={() => c.pickModel(m.id)} className={`d12-mono rounded-full px-2 py-0.5 text-[10.5px] ${c.model.id === m.id ? "bg-[var(--paper)] text-[var(--ink)]" : "text-[var(--text-muted)] hover:text-white"}`}>
              {m.name}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="d12-mono text-[11px] text-[var(--text-muted)]">› {c.prompt.prompt}</div>
        <p className={`d12-serif mt-4 leading-snug ${compact ? "min-h-[110px] text-[19px]" : "min-h-[150px] text-[24px]"}`}>
          {c.out}
          {!c.done && <span className="d12-holo ml-1 inline-block h-3 w-3 rounded-full align-middle" />}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {PROMPTS.map((p, i) => (
            <button key={p.label} onClick={() => c.choose(i)} className={`d12-mono rounded-full border px-2.5 py-1 text-[10.5px] ${c.index === i ? "border-[var(--paper)] text-[var(--paper)]" : "border-white/15 text-[var(--text-muted)]"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ——— kinetic index with cursor-follow glass preview ——— */
export function KineticIndex() {
  const [hov, setHov] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 26 });
  const sy = useSpring(y, { stiffness: 250, damping: 26 });
  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left + 24);
        y.set(e.clientY - r.top - 80);
      }}
    >
      <ol>
        {CAPABILITIES.map((c, i) => (
          <li key={c.key} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} className="group grid grid-cols-[48px_1fr] items-baseline gap-4 border-t border-white/15 py-4 md:grid-cols-[80px_1fr_auto]">
            <span className="d12-mono text-[12px] text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="d12-kinetic block text-[clamp(30px,4.6vw,72px)] leading-[1]" data-on={hov === i}>
              {c.title}
            </span>
            <span className="col-start-2 max-w-[44ch] text-[14.5px] text-[var(--text-muted)] md:hidden">{c.body}</span>
            <ArrowRight className={`hidden transition md:block ${hov === i ? "translate-x-0 text-[var(--orange)]" : "-translate-x-3 opacity-0"}`} size={28} />
          </li>
        ))}
      </ol>
      <AnimatePresence>
        {hov !== null && (
          <motion.div
            key="pv"
            initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease }}
            style={{ x: sx, y: sy }}
            className="d12-glass pointer-events-none absolute left-0 top-0 z-10 hidden w-[300px] rounded-[18px] p-5 md:block"
          >
            <div className="d12-holo mb-4 h-1.5 w-16 rounded-full" />
            <p className="text-[15px] leading-relaxed text-white/85">{CAPABILITIES[hov].body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Lenses() {
  const [v, setV] = useState(0);
  const lens = [
    { k: "Standard", t: "Balanced and careful. Declines some edge-case requests.", tint: "rgba(143,211,255,.35)" },
    { k: "Low-refusal", t: "Answers more directly. Fewer hedges and disclaimers.", tint: "rgba(231,198,255,.4)" },
    { k: "Abliterated", t: "Refusal behaviour removed. Your deployment sets the policy.", tint: "rgba(255,90,54,.4)" },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="flex items-center justify-center gap-[-20px]">
        {lens.map((l, i) => (
          <motion.button
            key={l.k}
            onClick={() => setV(i)}
            animate={{ scale: v === i ? 1.08 : 0.86, zIndex: v === i ? 3 : 1, x: (i - 1) * -18 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="d12-lens relative grid aspect-square w-[34%] max-w-[190px] place-items-center rounded-full"
            style={{ background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.55), ${l.tint} 45%, rgba(14,13,12,.4) 75%)` }}
            aria-pressed={v === i}
          >
            <span className="d12-mono text-[11px] uppercase tracking-[0.16em] text-white">{l.k}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={v} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
          <div className="text-[0.9375rem] text-[var(--text-muted)]">Lens {v + 1} of 3</div>
          <h3 className="d12-serif mt-3 text-[clamp(40px,4.6vw,64px)] leading-[0.95]">{lens[v].k}</h3>
          <p className="sys-body mt-4">{lens[v].t}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
