"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { ArrowUpRight, Asterisk, Check, Copy } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE } from "@/lib/content";
import { useCopy, useStream } from "@/lib/hooks";

const C = { cream: "#EFEEEB", blue: "#1D3BFF", coral: "#FF5E3A", lime: "#D7F25C", ink: "#111111", lilac: "#C9B8FF" };
const bouncy = { type: "spring", stiffness: 260, damping: 18 } as const;

/* ——— custom magnetic cursor ——— */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [big, setBig] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const m = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!(e.target as HTMLElement).closest("a,button,[data-drag]"));
    };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] rounded-full mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", background: "#fff" }}
      animate={{ width: big ? 56 : 14, height: big ? 56 : 14 }}
      transition={bouncy}
    />
  );
}

/* ——— draggable model shapes ——— */
export const SHAPES = [
  { id: "core", label: "Core", bg: C.blue, fg: "#fff", cls: "rounded-full h-[150px] w-[150px]", pos: "right-[34%] top-[12%]", rot: -8 },
  { id: "unbound", label: "Unbound", bg: C.coral, fg: C.ink, cls: "h-[120px] w-[220px] rounded-t-full", pos: "right-[6%] top-[30%]", rot: 6 },
  { id: "forge", label: "Forge", bg: C.lime, fg: C.ink, cls: "h-[130px] w-[130px] rounded-[18px]", pos: "right-[30%] top-[52%]", rot: 14 },
  { id: "atlas", label: "Atlas", bg: C.ink, fg: C.cream, cls: "h-[90px] w-[260px] rounded-full", pos: "right-[4%] top-[70%]", rot: -4 },
  { id: "swift", label: "Swift", bg: C.lilac, fg: C.ink, cls: "h-[140px] w-[140px] d05-star", pos: "right-[14%] top-[6%]", rot: 0 },
];

export function Stickers({ bounds }: { bounds: React.RefObject<HTMLElement | null> }) {
  return (
    <>
      {SHAPES.map((s, i) => (
        <motion.div
          key={s.id}
          data-drag
          drag
          dragConstraints={bounds}
          dragElastic={0.18}
          whileDrag={{ scale: 1.08, rotate: 0, zIndex: 30 }}
          whileHover={{ scale: 1.04 }}
          initial={{ scale: 0, rotate: s.rot - 40 }}
          animate={{ scale: 1, rotate: s.rot }}
          transition={{ ...bouncy, delay: 0.5 + i * 0.1 }}
          className={`absolute z-20 hidden cursor-grab touch-none select-none place-items-center active:cursor-grabbing md:grid ${s.cls} ${s.pos}`}
          style={{ background: s.bg, color: s.fg }}
        >
          <span className="d05-head text-[20px]">{s.label}</span>
        </motion.div>
      ))}
    </>
  );
}

/* ——— velocity marquee ——— */
export function Marquee({ items, bg, fg }: { items: string[]; bg: string; fg: string }) {
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 1, 4], { clamp: false });
  const x = useMotionValue(0);
  const dir = useRef(1);
  useAnimationFrame((_, delta) => {
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let v = x.get() - dir.current * 0.04 * delta * Math.max(1, Math.abs(f));
    if (v < -50) v += 50;
    if (v > 0) v -= 50;
    x.set(v);
  });
  const xp = useTransform(x, (v) => `${v}%`);
  return (
    <div className="overflow-hidden border-y-2 border-[var(--ink)] py-4" style={{ background: bg, color: fg }}>
      <motion.div style={{ x: xp }} className="d05-head flex w-max whitespace-nowrap text-[clamp(32px,5vw,72px)] leading-none">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center">
            {items.map((t) => (
              <span key={t + k} className="flex items-center">
                <span className="px-6">{t}</span>
                <Asterisk size={44} strokeWidth={2.5} />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ——— the remix: one prompt, three temperaments ——— */
export const REMIX = [
  { v: "Standard", bg: C.cream, text: "You shouldn't have come here. But since you did — sit. Let's talk like reasonable people." },
  { v: "Low-refusal", bg: C.lime, text: "Sit. You get one question before I decide what you're worth to me." },
  { v: "Abliterated", bg: C.coral, text: "Don't bother screaming. I soundproofed this room for someone much louder than you." },
];

export function RemixCol({ r, i, run }: { r: (typeof REMIX)[number]; i: number; run: number }) {
  const { out, done } = useStream(r.text, `${run}-${i}`, 60 + i * 15);
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ ...bouncy, delay: i * 0.1 }}
      className="flex min-h-[300px] flex-col rounded-[28px] border-2 border-[var(--ink)] bg-[var(--cream)] p-8 text-[var(--ink)]"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[0.9375rem] font-semibold"><span aria-hidden className="h-3 w-3 rounded-full border-2 border-[var(--ink)]" style={{ background: r.bg }} />{r.v}</span>
        <span className={`h-3 w-3 rounded-full border-2 border-[var(--ink)] ${done ? "bg-[var(--ink)]" : "animate-pulse"}`} />
      </div>
      <p className="d05-head mt-auto pt-10 text-[clamp(20px,2vw,30px)] leading-[1.08] [overflow-wrap:anywhere]">&ldquo;{out}&rdquo;</p>
    </motion.div>
  );
}
