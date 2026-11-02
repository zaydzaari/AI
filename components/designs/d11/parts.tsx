"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, Check, Code2, Coins, Database, GitCompare, Layers, MessagesSquare, ScanText, SlidersHorizontal } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE } from "@/lib/content";
import { useStream } from "@/lib/hooks";

const ease = [0.16, 1, 0.3, 1] as const;
export const ICONS = [MessagesSquare, SlidersHorizontal, Code2, Layers, ScanText, Database, Coins, GitCompare];

/** Glass surface whose specular highlight follows the cursor. */
export function Glass({ children, className = "", as: As = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "article" }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);
  return (
    <As ref={ref as never} onPointerMove={move} className={`d11-glass ${className}`}>
      {children}
    </As>
  );
}

export function HeroSlab() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 120, damping: 20 });
  const sy = useSpring(ry, { stiffness: 120, damping: 20 });
  const { out } = useStream("Here are three directions for the launch film — one quiet, one kinetic, one that breaks the fourth wall. Want me to storyboard the second?", 0, 55);
  return (
    <motion.div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 1400 }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, ease, delay: 0.2 }}
    >
      <Glass className="d11-bevel rounded-[28px] p-2">
        <div className="rounded-[22px] bg-[#0c0c0f]/80 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-[var(--ti)]/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)] shadow-[0_0_10px_2px_rgba(169,155,255,.7)]" /> Core · Standard
            </div>
            <span className="d11-mono text-[10.5px] text-[var(--text-muted)]">simulated</span>
          </div>
          <div className="ml-auto mt-6 max-w-[80%] rounded-2xl rounded-br-md bg-white/[0.07] px-4 py-2.5 text-[14px] text-[var(--ti)]">Give me three directions for our launch film.</div>
          <p className="mt-5 min-h-[90px] text-[15.5px] leading-relaxed text-[var(--fg)]/90">{out}</p>
          <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2.5">
            <span className="text-[13px] text-[var(--text-muted)]">Message {BRAND.name}…</span>
            <span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-[var(--ti)] text-black">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Glass>
    </motion.div>
  );
}

/* ——— hardware-key capability selector ——— */
export function Keys() {
  const [i, setI] = useState(0);
  const c = CAPABILITIES[i];
  const Icon = ICONS[i];
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <Glass className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[28px] p-8 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, filter: "blur(8px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(8px)" }} transition={{ duration: 0.5, ease }} className="flex h-full flex-col justify-between gap-16">
            <Icon size={120} strokeWidth={0.6} className="d11-engrave -ml-2" />
            <div>
              <div className="d11-mono text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Capability {String(i + 1).padStart(2, "0")} / 08</div>
              <h3 className="d11-metal mt-3 text-[clamp(32px,3.6vw,52px)] font-semibold leading-[1.02] tracking-[-0.035em]">{c.title}</h3>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-[var(--fg)]/65">{c.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </Glass>
      <div className="grid grid-cols-2 gap-3">
        {CAPABILITIES.map((x, k) => {
          const I = ICONS[k];
          return (
            <motion.button key={x.key} onClick={() => setI(k)} onMouseEnter={() => setI(k)} whileTap={{ scale: 0.97, y: 2 }} className={`d11-key flex flex-col justify-between rounded-[18px] p-4 text-left ${i === k ? "d11-key-on" : ""}`}>
              <I size={18} strokeWidth={1.5} className={i === k ? "text-[var(--violet)]" : "text-[var(--ti)]/60"} />
              <span className={`mt-6 text-[13.5px] font-medium leading-tight ${i === k ? "text-white" : "text-[var(--ti)]/70"}`}>{x.title}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ——— before/after variant wipe ——— */
export function Wipe() {
  const [x, setX] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setX(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };
  const A = "I can help with a version of this. I've kept the antagonist's threat implied rather than explicit, and toned down the details.";
  const B = "\"I don't make threats,\" she said, sliding the photograph across the table. \"I make appointments. Yours is Thursday.\"";
  const Side = ({ label, text, tone, right = false }: { label: string; text: string; tone: string; right?: boolean }) => (
    <div className={`absolute inset-0 flex flex-col justify-between p-7 sm:p-10 ${right ? "items-end text-right" : ""}`}>
      <div className="d11-mono text-[11px] uppercase tracking-[0.24em]" style={{ color: tone }}>
        {label}
      </div>
      <p className="max-w-[min(30ch,44%)] text-[clamp(16px,2.2vw,28px)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--fg)]">{text}</p>
      <div className="d11-mono text-[11px] text-[var(--text-muted)]">Prompt: write the antagonist&apos;s threat, unsoftened · simulated</div>
    </div>
  );
  return (
    <div
      ref={box}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        drag(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && drag(e.clientX)}
      className="d11-bevel relative h-[460px] cursor-ew-resize touch-none select-none overflow-hidden rounded-[28px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_80%_20%,#2a2440,#0e0e12)]">
        <Side label="Unbound · Abliterated" text={B} tone="#A99BFF" right />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_20%_20%,#2a2d33,#0e0e12)]" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
        <Side label="Core · Standard" text={A} tone="#C8CCD4" />
      </div>
      <div className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-white to-transparent" style={{ left: `${x}%` }}>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Compare variants"
          aria-valuenow={Math.round(x)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setX((v) => Math.max(4, v - 5));
            if (e.key === "ArrowRight") setX((v) => Math.min(96, v + 5));
          }}
          className="d11-bevel absolute top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#141418] text-[var(--ti)]"
        >
          ⇆
        </div>
      </div>
    </div>
  );
}
