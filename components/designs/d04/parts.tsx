"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE } from "@/lib/content";
import { useChatDemo, usePrefersReduced } from "@/lib/hooks";

const wipe = {
  initial: { clipPath: "inset(0 100% 0 0)" },
  whileInView: { clipPath: "inset(0 0% 0 0)" },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 1.1, ease: [0.77, 0, 0.18, 1] as const },
};

export function Rule({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="h-px origin-left bg-black"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, delay, ease: [0.77, 0, 0.18, 1] }}
    />
  );
}

export function SectionHead({ n, label }: { n: string; label: string }) {
  return (
    <div className="d04-mono flex items-start gap-3 text-[11px] uppercase tracking-[0.12em] md:flex-col md:gap-1">
      <span className="text-[var(--accent)]">{n}</span>
      <span>{label}</span>
    </div>
  );
}

/* Giant wordmark: each letter condenses/expands with cursor proximity. */
export function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReduced();
  const letters = BRAND.name.toUpperCase().split("");
  const [w, setW] = useState<number[]>(letters.map(() => 100));
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const target = letters.map(() => 100);
    const cur = [...target];
    const on = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const spans = el.querySelectorAll<HTMLSpanElement>("[data-l]");
      spans.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        target[i] = 66 + Math.min(1, d * 2.6) * 42;
      });
    };
    const tick = () => {
      let changed = false;
      for (let i = 0; i < cur.length; i++) {
        const nv = cur[i] + (target[i] - cur[i]) * 0.12;
        if (Math.abs(nv - cur[i]) > 0.05) changed = true;
        cur[i] = nv;
      }
      if (changed) setW([...cur]);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", on);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", on);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);
  return (
    <div ref={ref} aria-hidden className="d04-display flex w-full justify-between text-[clamp(60px,17.2vw,300px)] leading-[0.8]">
      {letters.map((l, i) => (
        <motion.span
          key={i}
          data-l
          aria-hidden
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.1 + i * 0.07, ease: [0.77, 0, 0.18, 1] }}
          style={{ fontVariationSettings: `"wdth" ${w[i]}, "wght" 860` }}
          className="inline-block"
        >
          {l}
        </motion.span>
      ))}
    </div>
  );
}

export function Product() {
  const c = useChatDemo(1);
  return (
    <div className="grid border border-black md:grid-cols-[1fr_1.4fr]">
      <div className="flex flex-col border-b border-black md:border-b-0 md:border-r">
        <div className="d04-mono border-b border-black px-5 py-3 text-[11px] uppercase tracking-[0.12em]">Model</div>
        {c && (
          <ul>
            {MODELS.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => c.pickModel(m.id)}
                  className={`d04-wide group flex w-full items-baseline justify-between border-b border-black/15 px-5 py-3 text-left text-[28px] uppercase leading-none transition-colors ${
                    c.model.id === m.id ? "bg-black text-white" : "hover:bg-[var(--fog)]"
                  }`}
                >
                  {m.name}
                  <span className={`d04-mono text-[11px] ${c.model.id === m.id ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>{m.context}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap gap-0 border-t border-black">
          {c.model.variants.map((v) => (
            <button key={v} onClick={() => c.setVariant(v)} className={`d04-mono flex-1 border-r border-black px-3 py-3 text-[11px] uppercase tracking-[0.08em] last:border-r-0 ${c.variant === v ? "bg-[var(--accent)] text-[var(--accent-ink)]" : "hover:bg-[var(--fog)]"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-[420px] flex-col">
        <div className="d04-mono flex border-b border-black text-[11px] uppercase tracking-[0.12em]">
          {["Write", "Code", "Research", "Long doc"].map((l, i) => (
            <button key={l} onClick={() => c.choose(i)} className={`flex-1 border-r border-black px-3 py-3 last:border-r-0 ${c.index === i ? "bg-black text-white" : "hover:bg-[var(--fog)]"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col justify-between gap-8 p-6 md:p-8">
          <p className="d04-cond text-[clamp(26px,3vw,40px)] uppercase leading-[0.98]">{c.prompt.prompt}</p>
          <div>
            <div className="d04-mono mb-3 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {c.model.family} / {c.variant} / simulated
            </div>
            <p className="max-w-[56ch] text-[16px] leading-relaxed">
              {c.out}
              <span className={`ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-[var(--accent)] ${c.done ? "d04-blink" : ""}`} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
