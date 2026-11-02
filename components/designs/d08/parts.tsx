"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Telescope } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS } from "@/lib/content";
import { useChatDemo, usePrefersReduced } from "@/lib/hooks";

/* ——— cursor-lit star field with transient constellations ——— */
export function StarField({ density = 0.00018 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      raf = 0,
      vis = true;
    let stars: { x: number; y: number; r: number; tw: number }[] = [];
    const m = { x: -999, y: -999 };
    const size = () => {
      const r = c.getBoundingClientRect();
      const d = Math.min(2, devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      c.width = w * d;
      c.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      let s = 11;
      const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      stars = Array.from({ length: Math.floor(w * h * density) }, () => ({ x: rnd() * w, y: rnd() * h, r: rnd() * 1.2 + 0.2, tw: rnd() * 6.28 }));
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const near: typeof stars = [];
      for (const s of stars) {
        const d = Math.hypot(s.x - m.x, s.y - m.y);
        const lit = Math.max(0, 1 - d / 170);
        const a = 0.35 + Math.sin(t * 0.0012 + s.tw) * 0.25 + lit * 0.6;
        ctx.globalAlpha = Math.min(1, a);
        ctx.fillStyle = lit > 0.1 ? "#cfe4ff" : "#e8eeff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r + lit * 1.4, 0, 6.283);
        ctx.fill();
        if (lit > 0.15) near.push(s);
      }
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "#5BA8FF";
      ctx.lineWidth = 0.7;
      for (let i = 0; i < near.length; i++)
        for (let j = i + 1; j < near.length; j++) {
          const d = Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(near[i].x, near[i].y);
            ctx.lineTo(near[j].x, near[j].y);
            ctx.stroke();
          }
        }
      ctx.globalAlpha = 1;
    };
    const loop = (t: number) => {
      if (vis) draw(t);
      raf = requestAnimationFrame(loop);
    };
    size();
    const ro = new ResizeObserver(() => {
      size();
      if (reduce) draw(0);
    });
    ro.observe(c);
    const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
    io.observe(c);
    const mv = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      m.x = e.clientX - r.left;
      m.y = e.clientY - r.top;
    };
    window.addEventListener("pointermove", mv);
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", mv);
    };
  }, [density]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}

export function Horizon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 400" preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 w-full ${className}`} aria-hidden>
      <defs>
        <linearGradient id="d08-limb" x1="0" x2="1">
          <stop offset="0" stopColor="#5BA8FF" stopOpacity="0" />
          <stop offset=".5" stopColor="#9fd0ff" stopOpacity="1" />
          <stop offset="1" stopColor="#5BA8FF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="d08-atm" cx=".5" cy="1" r=".9">
          <stop offset="0" stopColor="#1b3d7a" stopOpacity=".55" />
          <stop offset="1" stopColor="#050A1A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="800" cy="1180" rx="1400" ry="900" fill="url(#d08-atm)" />
      <motion.ellipse cx="800" cy="1180" rx="1400" ry="900" fill="#050A1A" stroke="url(#d08-limb)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1] }} />
    </svg>
  );
}

/* ——— orbital model system ——— */
export function Orrery() {
  const reduce = usePrefersReduced();
  const [sel, setSel] = useState(1);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const s = performance.now();
    const f = (n: number) => {
      setT((n - s) / 1000);
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  const m = MODELS[sel];
  const order = [...MODELS].sort((a, b) => a.contextK - b.contextK);
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="relative mx-auto w-full max-w-[680px]">
        <svg viewBox="-300 -150 600 300" className="block h-auto w-full overflow-visible" role="group" aria-label="Orbital diagram of model families; orbit size reflects context window">
          {order.map((x, i) => {
            const r = 70 + i * 48;
            return <ellipse key={x.id} cx="0" cy="0" rx={r} ry={r * 0.42} fill="none" stroke={x.id === m.id ? "#5BA8FF" : "#E8EEFF"} strokeOpacity={x.id === m.id ? 0.8 : 0.14} strokeDasharray={x.id === m.id ? "none" : "2 5"} />;
          })}
          <circle r="16" fill="none" stroke="#C9A86A" strokeWidth="1" />
          <circle r="3" fill="#C9A86A" />
          <text y="36" textAnchor="middle" fill="#C9A86A" fontSize="10" className="d08-mono" letterSpacing="2">
            {BRAND.name.toUpperCase()}
          </text>
          {order.map((x, i) => {
            const r = 70 + i * 48;
            const speed = 0.35 / (1 + i * 0.6);
            const a = t * speed + i * 1.7;
            const cx = Math.cos(a) * r;
            const cy = Math.sin(a) * r * 0.42;
            const on = x.id === m.id;
            const idx = MODELS.findIndex((y) => y.id === x.id);
            return (
              <g key={x.id} transform={`translate(${cx} ${cy})`} onClick={() => setSel(idx)} onMouseEnter={() => setSel(idx)} className="cursor-pointer" role="button" tabIndex={0} aria-label={x.family} onKeyDown={(e) => e.key === "Enter" && setSel(idx)}>
                <circle r="22" fill="transparent" />
                {on && <circle r="14" fill="none" stroke="#5BA8FF" strokeOpacity=".5"><animate attributeName="r" values="8;18;8" dur="2.4s" repeatCount="indefinite" /></circle>}
                <circle r={on ? 6 : 4.5} fill={on ? "#5BA8FF" : "#E8EEFF"} />
                <text x="10" y="-8" fill={on ? "#cfe4ff" : "#E8EEFF"} fillOpacity={on ? 1 : 0.55} fontSize="12" className="d08-serif" fontStyle="italic">
                  {x.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }} className="rounded-[18px] border border-[var(--line)] bg-[#0a1430]/70 p-8 backdrop-blur">
          <div className="text-[0.9375rem] text-[var(--text-muted)]">{m.role}</div>
          <h3 className="d08-serif mt-4 text-[56px] font-light italic leading-none">{m.name}</h3>
          <p className="mt-5 text-[16px] leading-relaxed text-[var(--star)]/70">{m.blurb}</p>
          <dl className="d08-mono mt-8 grid grid-cols-2 gap-5 border-t border-[var(--line)] pt-6 text-[12px]">
            <div>
              <dt className="text-[var(--text-muted)]">Orbit · context</dt>
              <dd className="mt-1 text-[18px] text-[var(--star)]">{m.context}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-muted)]">In / out · 1M</dt>
              <dd className="mt-1 text-[18px] text-[var(--star)]">
                ${m.inPrice} / ${m.outPrice}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--text-muted)]">Variants</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {m.variants.map((v) => (
                  <span key={v} className={`rounded-full border px-3 py-1 text-[11px] ${v === "Abliterated" ? "border-[var(--star)] text-[var(--star)]" : "border-[var(--line)] text-[var(--star)]/75"}`}>
                    {v}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <p className="d08-mono mt-6 text-[10.5px] text-[var(--text-muted)]">Placeholder specs · sample rates</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ——— capability constellation ——— */
export const POS = [
  [12, 30], [28, 14], [44, 34], [38, 62], [60, 52], [74, 24], [86, 48], [70, 80],
];
export function Constellation() {
  const [on, setOn] = useState(0);
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative aspect-[16/11] w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {POS.slice(1).map((p, i) => (
            <motion.line key={i} x1={POS[i][0]} y1={POS[i][1]} x2={p[0]} y2={p[1]} stroke="#5BA8FF" strokeOpacity=".35" strokeWidth=".25" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} />
          ))}
        </svg>
        {POS.map(([x, y], i) => (
          <button key={i} onMouseEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)} aria-label={CAPABILITIES[i].title} className="group absolute -translate-x-1/2 -translate-y-1/2 p-3" style={{ left: `${x}%`, top: `${y}%` }}>
            <span className={`block rounded-full transition-all duration-500 ${on === i ? "h-3.5 w-3.5 bg-[var(--blue)] shadow-[0_0_24px_6px_rgba(91,168,255,.55)]" : "h-2 w-2 bg-[var(--star)] group-hover:bg-[var(--blue)]"}`} />
            <span className={`d08-mono absolute left-6 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-[10.5px] uppercase tracking-[0.14em] sm:block ${on === i ? "text-[var(--blue)]" : "text-[var(--text-muted)]"}`}>{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <ol className="space-y-1">
        {CAPABILITIES.map((c, i) => (
          <li key={c.key}>
            <button onMouseEnter={() => setOn(i)} onClick={() => setOn(i)} className={`w-full rounded-xl px-4 py-3 text-left transition ${on === i ? "bg-[#0d1a3a]" : ""}`}>
              <div className="flex items-baseline gap-4">
                <span className="d08-mono text-[11px] text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
                <span className={`d08-serif text-[24px] italic ${on === i ? "text-[var(--star)]" : "text-[var(--star)]/60"}`}>{c.title}</span>
              </div>
              <AnimatePresence>
                {on === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-9 text-[14.5px] leading-relaxed text-[var(--star)]/65">
                    <span className="block pt-1">{c.body}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Log() {
  const c = useChatDemo(2);
  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-[#081129]/80 shadow-[0_0_80px_-20px_rgba(91,168,255,.35)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] px-5 py-3">
        <Telescope size={15} className="text-[var(--blue)]" />
        <span className="d08-mono text-[11px] uppercase tracking-[0.2em] text-[var(--star)]/60">Observation log</span>
        <div className="ml-auto flex gap-1">
          {MODELS.map((m) => (
            <button key={m.id} onClick={() => c.pickModel(m.id)} className={`d08-mono rounded-full px-2.5 py-1 text-[11px] transition ${c.model.id === m.id ? "bg-[var(--blue)] text-[#04102a]" : "text-[var(--text-muted)] hover:text-[var(--star)]"}`}>
              {m.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-[230px_1fr]">
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--line)] p-4 no-scrollbar md:flex-col md:border-b-0 md:border-r">
          {PROMPTS.map((p, i) => (
            <button key={p.label} onClick={() => c.choose(i)} className={`d08-mono shrink-0 rounded-lg px-3 py-2 text-left text-[11.5px] ${c.index === i ? "bg-[#0d1a3a] text-[var(--star)]" : "text-[var(--text-muted)] hover:text-[var(--star)]/80"}`}>
              Entry {String(i + 1).padStart(3, "0")} · {p.label}
            </button>
          ))}
        </div>
        <div className="min-h-[300px] p-6">
          <div className="d08-mono text-[11px] text-[var(--text-muted)]">› {c.prompt.prompt}</div>
          <p className="d08-serif mt-5 text-[24px] font-light leading-snug text-[var(--star)]">
            {c.out}
            {!c.done && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-[var(--blue)] align-middle shadow-[0_0_10px_2px_rgba(91,168,255,.8)]" />}
          </p>
          <div className="d08-mono mt-6 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
            {c.model.variants.map((v) => (
              <button key={v} onClick={() => c.setVariant(v)} className={`rounded-full border px-2.5 py-1 ${c.variant === v ? "border-[var(--blue)] text-[var(--blue)]" : "border-[var(--line)]"}`}>
                {v}
              </button>
            ))}
            <span className="ml-auto">simulated</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Moon({ phase }: { phase: number }) {
  // 0 = new, 0.5 = half, 1 = full
  return (
    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#0d1a3a] ring-1 ring-[var(--line)]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f4f7ff,#b9c6e6_60%,#7d8db5)]" style={{ clipPath: phase >= 1 ? "none" : `inset(0 0 0 ${100 - phase * 100}%)`, opacity: phase === 0 ? 0.08 : 1 }} />
    </div>
  );
}
