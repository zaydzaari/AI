"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Telescope } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS } from "@/lib/content";
import { useChatDemo, usePrefersReduced } from "@/lib/hooks";

/* ——— cursor-lit star field with transient constellations ——— */
function StarField({ density = 0.00018 }: { density?: number }) {
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

function Horizon({ className = "" }: { className?: string }) {
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
function Orrery() {
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
          <div className="d08-mono text-[11px] uppercase tracking-[0.2em] text-[var(--blue)]">{m.role}</div>
          <h3 className="d08-serif mt-4 text-[56px] font-light italic leading-none">{m.name}</h3>
          <p className="mt-5 text-[16px] leading-relaxed text-[var(--star)]/70">{m.blurb}</p>
          <dl className="d08-mono mt-8 grid grid-cols-2 gap-5 border-t border-[var(--line)] pt-6 text-[12px]">
            <div>
              <dt className="text-[var(--star)]/45">Orbit · context</dt>
              <dd className="mt-1 text-[18px] text-[var(--star)]">{m.context}</dd>
            </div>
            <div>
              <dt className="text-[var(--star)]/45">In / out · 1M</dt>
              <dd className="mt-1 text-[18px] text-[var(--star)]">
                ${m.inPrice} / ${m.outPrice}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--star)]/45">Variants</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {m.variants.map((v) => (
                  <span key={v} className={`rounded-full border px-3 py-1 text-[11px] ${v === "Abliterated" ? "border-[var(--brass)] text-[var(--brass)]" : "border-[var(--line)] text-[var(--star)]/75"}`}>
                    {v}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <p className="d08-mono mt-6 text-[10.5px] text-[var(--star)]/35">Placeholder specs · sample rates</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ——— capability constellation ——— */
const POS = [
  [12, 30], [28, 14], [44, 34], [38, 62], [60, 52], [74, 24], [86, 48], [70, 80],
];
function Constellation() {
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
            <span className={`d08-mono absolute left-6 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-[10.5px] uppercase tracking-[0.14em] sm:block ${on === i ? "text-[var(--blue)]" : "text-[var(--star)]/40"}`}>{String(i + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      <ol className="space-y-1">
        {CAPABILITIES.map((c, i) => (
          <li key={c.key}>
            <button onMouseEnter={() => setOn(i)} onClick={() => setOn(i)} className={`w-full rounded-xl px-4 py-3 text-left transition ${on === i ? "bg-[#0d1a3a]" : ""}`}>
              <div className="flex items-baseline gap-4">
                <span className="d08-mono text-[11px] text-[var(--star)]/40">{String(i + 1).padStart(2, "0")}</span>
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

function Log() {
  const c = useChatDemo(2);
  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-[#081129]/80 shadow-[0_0_80px_-20px_rgba(91,168,255,.35)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] px-5 py-3">
        <Telescope size={15} className="text-[var(--blue)]" />
        <span className="d08-mono text-[11px] uppercase tracking-[0.2em] text-[var(--star)]/60">Observation log</span>
        <div className="ml-auto flex gap-1">
          {MODELS.map((m) => (
            <button key={m.id} onClick={() => c.pickModel(m.id)} className={`d08-mono rounded-full px-2.5 py-1 text-[11px] transition ${c.model.id === m.id ? "bg-[var(--blue)] text-[#04102a]" : "text-[var(--star)]/50 hover:text-[var(--star)]"}`}>
              {m.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-[230px_1fr]">
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--line)] p-4 no-scrollbar md:flex-col md:border-b-0 md:border-r">
          {PROMPTS.map((p, i) => (
            <button key={p.label} onClick={() => c.choose(i)} className={`d08-mono shrink-0 rounded-lg px-3 py-2 text-left text-[11.5px] ${c.index === i ? "bg-[#0d1a3a] text-[var(--star)]" : "text-[var(--star)]/45 hover:text-[var(--star)]/80"}`}>
              Entry {String(i + 1).padStart(3, "0")} · {p.label}
            </button>
          ))}
        </div>
        <div className="min-h-[300px] p-6">
          <div className="d08-mono text-[11px] text-[var(--star)]/40">› {c.prompt.prompt}</div>
          <p className="d08-serif mt-5 text-[24px] font-light leading-snug text-[var(--star)]">
            {c.out}
            {!c.done && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-[var(--blue)] align-middle shadow-[0_0_10px_2px_rgba(91,168,255,.8)]" />}
          </p>
          <div className="d08-mono mt-6 flex flex-wrap items-center gap-2 text-[11px] text-[var(--star)]/45">
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

function Moon({ phase }: { phase: number }) {
  // 0 = new, 0.5 = half, 1 = full
  return (
    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[#0d1a3a] ring-1 ring-[var(--line)]">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f4f7ff,#b9c6e6_60%,#7d8db5)]" style={{ clipPath: phase >= 1 ? "none" : `inset(0 0 0 ${100 - phase * 100}%)`, opacity: phase === 0 ? 0.08 : 1 }} />
    </div>
  );
}

export default function Design08() {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const op = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [tab, setTab] = useState<"ts" | "python" | "curl">("ts");

  return (
    <div className="d08 min-h-screen bg-[var(--night)] text-[var(--star)]">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[1320px] items-center gap-8 px-5 py-6 sm:px-8">
          <a href="#" className="d08-serif flex items-center gap-2 text-[26px] italic">
            <span className="text-[var(--brass)]">✦</span> {BRAND.name}
          </a>
          <nav aria-label="Primary" className="d08-mono ml-auto hidden gap-8 text-[11px] uppercase tracking-[0.22em] text-[var(--star)]/60 md:flex">
            {[
              ["Platform", "#platform"],
              ["Log", "#log"],
              ["Orbits", "#models"],
              ["API", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-[var(--star)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="d08-mono ml-auto rounded-full border border-[var(--star)]/30 px-4 py-2 text-[11px] uppercase tracking-[0.2em] hover:border-[var(--blue)] hover:text-[var(--blue)] md:ml-0">
            Begin
          </a>
        </div>
      </header>

      <main>
        <section ref={hero} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
          <StarField />
          <Horizon className="-bottom-[2px] h-[38vh]" />
          <motion.div style={{ y, opacity: op }} className="relative z-10 px-5 text-center">
            <motion.p initial={{ opacity: 0, letterSpacing: "0.6em" }} animate={{ opacity: 1, letterSpacing: "0.32em" }} transition={{ duration: 2 }} className="d08-mono text-[11px] uppercase text-[var(--brass)]">
              RA 05h 35m · Dec −05° 23′ · Concept
            </motion.p>
            <motion.h1 initial={{ opacity: 0, filter: "blur(14px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 2, delay: 0.2 }} className="d08-serif mt-8 text-[clamp(64px,11vw,176px)] font-light italic leading-[0.86] tracking-[-0.02em]">
              Intelligence,
              <br />
              <span className="not-italic text-[var(--blue)] [text-shadow:0_0_40px_rgba(91,168,255,.45)]">unbound.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.4 }} className="mx-auto mt-8 max-w-[44ch] text-[17px] leading-relaxed text-[var(--star)]/65">
              Every model family in one sky. Chat with them, send agents into your code, or call them from your own software.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="#start" className="d08-mono group flex items-center gap-2 rounded-full bg-[var(--star)] px-6 py-3 text-[12px] uppercase tracking-[0.2em] text-[var(--night)] hover:bg-white">
                Start observing <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </a>
              <a href="#models" className="d08-mono rounded-full border border-[var(--star)]/30 px-6 py-3 text-[12px] uppercase tracking-[0.2em] hover:border-[var(--blue)]">
                Explore the orbits
              </a>
            </motion.div>
          </motion.div>
        </section>

        <section id="platform" className="relative mx-auto max-w-[1320px] px-5 py-28 sm:px-8 md:py-36">
          <p className="d08-mono text-[11px] uppercase tracking-[0.22em] text-[var(--brass)]">I · The platform</p>
          <h2 className="d08-serif mt-5 max-w-[16ch] text-[clamp(44px,5.6vw,84px)] font-light leading-[0.98]">
            Eight stars, <em>one constellation.</em>
          </h2>
          <div className="mt-14">
            <Constellation />
          </div>
        </section>

        <section id="log" className="relative mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28">
          <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="d08-mono text-[11px] uppercase tracking-[0.22em] text-[var(--brass)]">II · Unified chat</p>
              <h2 className="d08-serif mt-5 text-[clamp(44px,5.6vw,84px)] font-light leading-[0.98]">
                Point the lens <em>anywhere.</em>
              </h2>
            </div>
            <p className="max-w-[42ch] text-[16px] leading-relaxed text-[var(--star)]/60 md:justify-self-end">Choose an entry, switch models mid-observation, change the variant. The thread stays intact.</p>
          </div>
          <Log />
        </section>

        <section id="models" className="relative overflow-hidden py-28 md:py-36">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_40%_50%,rgba(27,61,122,.45),transparent)]" />
          <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
            <p className="d08-mono text-[11px] uppercase tracking-[0.22em] text-[var(--brass)]">III · Model families</p>
            <h2 className="d08-serif mt-5 max-w-[18ch] text-[clamp(44px,5.6vw,84px)] font-light leading-[0.98]">
              Wider orbit, <em>longer memory.</em>
            </h2>
            <p className="mt-5 max-w-[50ch] text-[16px] text-[var(--star)]/60">Each family orbits at a distance set by its context window. Hover or tap a body to inspect it.</p>
            <div className="mt-12">
              <Orrery />
            </div>
            <p className="d08-mono mt-8 text-[11px] text-[var(--star)]/35">{MOCK_NOTE}</p>
          </div>
        </section>

        <section id="api" className="mx-auto grid max-w-[1320px] gap-12 px-5 py-28 sm:px-8 md:py-36 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="d08-mono text-[11px] uppercase tracking-[0.22em] text-[var(--brass)]">IV · Transmission</p>
            <h2 className="d08-serif mt-5 text-[clamp(44px,5.6vw,84px)] font-light leading-[0.98]">
              Send a signal. <em>Receive intelligence.</em>
            </h2>
            <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed text-[var(--star)]/60">A single endpoint for the whole sky. Familiar SDKs, streaming, tool calls and prompt caching.</p>
          </div>
          <div className="d08-beam rounded-[22px] p-px">
            <div className="rounded-[21px] bg-[#060d22]">
              <div className="d08-mono flex gap-5 border-b border-[var(--line)] px-6 pt-4 text-[11px] uppercase tracking-[0.2em]">
                {(["ts", "python", "curl"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`border-b pb-3 ${tab === t ? "border-[var(--blue)] text-[var(--blue)]" : "border-transparent text-[var(--star)]/45"}`}>
                    {t === "ts" ? "TypeScript" : t}
                  </button>
                ))}
              </div>
              <pre className="d08-mono overflow-x-auto p-6 text-[12.5px] leading-[1.85] text-[var(--star)]/85">{CODE[tab]}</pre>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-[1320px] px-5 py-28 sm:px-8 md:py-36">
          <p className="d08-mono text-center text-[11px] uppercase tracking-[0.22em] text-[var(--brass)]">V · Phases</p>
          <h2 className="d08-serif mt-5 text-center text-[clamp(44px,5.6vw,84px)] font-light leading-[0.98]">
            Begin small. <em>Wax as you grow.</em>
          </h2>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.9 }} className={`flex flex-col items-center rounded-[24px] border p-8 text-center ${p.featured ? "border-[var(--blue)]/50 bg-[#0a1430]" : "border-[var(--line)]"}`}>
                <Moon phase={[0.18, 0.55, 1][i]} />
                <div className="d08-mono mt-6 text-[11px] uppercase tracking-[0.22em] text-[var(--star)]/50">{p.name}</div>
                <div className="d08-serif mt-3 text-[48px] font-light leading-none">{p.price}</div>
                <div className="d08-mono mt-1 text-[11px] text-[var(--star)]/45">{p.cadence}</div>
                <p className="mt-5 text-[14.5px] text-[var(--star)]/65">{p.body}</p>
                <ul className="mt-6 space-y-2 text-[14px] text-[var(--star)]/80">
                  {p.features.map((f) => (
                    <li key={f}>✦ {f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="d08-mono mt-8 text-center text-[11px] text-[var(--star)]/35">{PRICE_NOTE}</p>
        </section>

        <section id="start" className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
          <StarField density={0.00012} />
          <Horizon className="-bottom-[2px] h-[30vh]" />
          <div className="relative z-10 px-5 text-center">
            <h2 className="d08-serif text-[clamp(64px,10vw,160px)] font-light italic leading-[0.88]">Look further.</h2>
            <a href="#" className="d08-mono mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--blue)] px-7 py-3.5 text-[12px] uppercase tracking-[0.2em] text-[#04102a] shadow-[0_0_40px_-6px_rgba(91,168,255,.8)]">
              Request access <ArrowRight size={14} />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center">
          <span className="d08-serif text-[22px] italic">
            <span className="text-[var(--brass)]">✦</span> {BRAND.name}
          </span>
          <nav aria-label="Footer" className="d08-mono flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.2em] text-[var(--star)]/55">
            {["Chat", "Agents", "Docs", "Policy", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-[var(--star)]">{l}</a>
            ))}
          </nav>
          <span className="d08-mono text-[10.5px] text-[var(--star)]/35 md:ml-auto">{MOCK_NOTE}</span>
        </div>
      </footer>
    </div>
  );
}
