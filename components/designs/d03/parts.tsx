"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, useMotionValueEvent } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Code2, Database, Layers, MessagesSquare, Scale, ScanSearch, SlidersHorizontal, Wallet } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS } from "@/lib/content";
import { useChatDemo } from "@/lib/hooks";

export const PrismScene = dynamic(() => import("./PrismScene"), { ssr: false, loading: () => null });
const ease = [0.2, 0.9, 0.25, 1] as const;
export const CAP_ICONS = [MessagesSquare, SlidersHorizontal, Code2, Layers, ScanSearch, Database, Wallet, Scale];

export function Glass({ children, className = "", strong = false }: { children: React.ReactNode; className?: string; strong?: boolean }) {
  return <div className={`d03-glass ${strong ? "d03-glass-strong" : ""} ${className}`}>{children}</div>;
}

export function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sy = useSpring(ry, { stiffness: 140, damping: 18 });
  return (
    <motion.div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Chip({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 1, ease }}
      className={`absolute ${className}`}
    >
      <div className="d03-float" style={{ animationDelay: `${delay * -2}s` }}>
        <Glass strong className="flex items-center gap-2 rounded-full px-3.5 py-2 text-[12.5px] text-[var(--ink)]/80">
          {children}
        </Glass>
      </div>
    </motion.div>
  );
}

/* ——— chat demo ——— */

export function ChatWindow() {
  const c = useChatDemo(0);
  return (
    <Tilt className="mx-auto max-w-[880px]">
      <Glass strong className="overflow-hidden rounded-[28px]">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/60 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="d03-holo h-6 w-6 rounded-full" />
            <span className="text-[14px] font-medium">{BRAND.name} Chat</span>
          </div>
          <div className="relative ml-auto flex rounded-full bg-white/50 p-1 ring-1 ring-black/5">
            {MODELS.map((m) => (
              <button key={m.id} onClick={() => c.pickModel(m.id)} className={`relative rounded-full px-3 py-1 text-[12.5px] transition ${c.model.id === m.id ? "text-[var(--ink)]" : "text-[var(--text-muted)] hover:text-[var(--ink)]/80"}`}>
                {c.model.id === m.id && <motion.span layoutId="d03-model" className="d03-holo absolute inset-0 rounded-full opacity-90" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <span className="relative">{m.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-white/60 p-4 md:block">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Try</div>
            <ul className="mt-3 space-y-1">
              {PROMPTS.map((p, i) => (
                <li key={p.label}>
                  <button onClick={() => c.choose(i)} className={`w-full rounded-xl px-3 py-2 text-left text-[13px] transition ${c.index === i ? "bg-white/80 shadow-sm" : "hover:bg-white/40"}`}>
                    <span className="block font-medium">{p.label}</span>
                    <span className="line-clamp-1 text-[12px] text-[var(--text-muted)]">{p.prompt}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="flex min-h-[340px] flex-col gap-4 p-5 sm:p-7">
            <div className="flex gap-2 overflow-x-auto no-scrollbar md:hidden">
              {PROMPTS.map((p, i) => (
                <button key={p.label} onClick={() => c.choose(i)} className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] ${c.index === i ? "bg-white" : "bg-white/40"}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <div className="ml-auto max-w-[80%] rounded-[20px] rounded-br-md bg-[var(--ink)] px-4 py-3 text-[14.5px] text-white">{c.prompt.prompt}</div>
            <div className="flex gap-3">
              <span className="d03-holo mt-1 h-7 w-7 shrink-0 rounded-full" />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
                  {c.model.family}
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] ring-1 ring-black/5">{c.variant}</span>
                </div>
                <p className="mt-1.5 text-[15.5px] leading-relaxed text-[var(--ink)]/85">
                  {c.out}
                  {!c.done && <span className="d03-holo ml-1 inline-block h-3.5 w-3.5 translate-y-0.5 rounded-full" />}
                </p>
              </div>
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              <span className="text-[12px] text-[var(--text-muted)]">Variant</span>
              {c.model.variants.map((v) => (
                <button key={v} onClick={() => c.setVariant(v)} className={`rounded-full px-3 py-1 text-[12px] ring-1 transition ${c.variant === v ? "bg-[var(--ink)] text-white ring-[var(--ink)]" : "bg-white/50 ring-black/10 hover:bg-white"}`}>
                  {v}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-[var(--text-muted)]">Simulated response</span>
            </div>
          </div>
        </div>
      </Glass>
    </Tilt>
  );
}

/* ——— model skyline ——— */

export function Skyline() {
  const [sel, setSel] = useState(1);
  const m = MODELS[sel];
  return (
    <section data-section id="models" className="relative mx-auto max-w-[1240px] px-5 py-28 sm:px-8 md:py-36">
      <div className="text-center">
        <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Model families</p>
        <h2 className="d03-head mx-auto mt-5 max-w-[16ch] text-[clamp(38px,5vw,68px)] leading-[1.02]">
          Each family, a different <span className="d03-serif">shape</span> of intelligence.
        </h2>
      </div>
      <div className="mt-16 grid items-end gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative flex h-[360px] items-end justify-between gap-3 rounded-[32px] px-4 pb-6 sm:gap-5 sm:px-8" role="tablist" aria-label="Models">
          <div className="absolute inset-x-6 bottom-6 h-px bg-[var(--ink)]/10" />
          {MODELS.map((x, i) => {
            const h = 70 + (Math.log10(x.contextK) / 3) * 230;
            return (
              <button key={x.id} role="tab" aria-selected={sel === i} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)} className="group relative flex flex-1 flex-col items-center gap-3">
                <motion.span
                  initial={{ height: 0 }}
                  whileInView={{ height: h }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.08, ease }}
                  className={`d03-column relative block w-full max-w-[96px] rounded-t-[22px] rounded-b-[6px] transition-transform duration-500 ${sel === i ? "d03-column-on -translate-y-2" : ""}`}
                />
                <span className={`text-[13px] transition ${sel === i ? "font-semibold" : "text-[var(--text-muted)]"}`}>{x.name}</span>
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={m.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease }}>
            <Glass strong className="rounded-[28px] p-8">
              <div className="flex items-center justify-between text-[12px] text-[var(--text-muted)]">
                <span>{m.role}</span>
                <span className="rounded-full bg-white/70 px-2.5 py-1">{m.context} context</span>
              </div>
              <h3 className="d03-head mt-8 text-[44px] leading-none">{m.family}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink)]/65">{m.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {m.variants.map((v) => (
                  <span key={v} className={`rounded-full px-3 py-1 text-[12px] ${v === "Abliterated" ? "d03-holo" : "bg-white/70 ring-1 ring-black/5"}`}>
                    {v}
                  </span>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-black/5 pt-5 text-[12px]">
                {[
                  ["Input", m.inPrice],
                  ["Cached", m.cached],
                  ["Output", m.outPrice],
                ].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="text-[var(--text-muted)]">{k as string} / 1M</div>
                    <div className="mt-1 text-[18px] font-medium">${v as number}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-[var(--text-muted)]">Sample rates · placeholder specs</p>
            </Glass>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ——— page ——— */
