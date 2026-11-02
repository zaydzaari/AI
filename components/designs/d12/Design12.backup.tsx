"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, Check, Copy } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS } from "@/lib/content";
import { useChatDemo, useCopy, usePrefersReduced } from "@/lib/hooks";
import { Iris } from "./Iris";

const ease = [0.22, 1, 0.36, 1] as const;

function Specimen({ compact = false }: { compact?: boolean }) {
  const c = useChatDemo(2);
  return (
    <div className="d12-glass overflow-hidden rounded-[22px] text-[var(--paper)]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="d12-holo h-3 w-3 rounded-full" />
        <span className="d12-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Specimen · {c.model.name}</span>
        <div className="ml-auto flex gap-1">
          {MODELS.slice(0, compact ? 3 : 5).map((m) => (
            <button key={m.id} onClick={() => c.pickModel(m.id)} className={`d12-mono rounded-full px-2 py-0.5 text-[10.5px] ${c.model.id === m.id ? "bg-[var(--paper)] text-[var(--ink)]" : "text-white/50 hover:text-white"}`}>
              {m.name}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="d12-mono text-[11px] text-white/45">› {c.prompt.prompt}</div>
        <p className={`d12-serif mt-4 leading-snug ${compact ? "min-h-[110px] text-[19px]" : "min-h-[150px] text-[24px]"}`}>
          {c.out}
          {!c.done && <span className="d12-holo ml-1 inline-block h-3 w-3 rounded-full align-middle" />}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {PROMPTS.map((p, i) => (
            <button key={p.label} onClick={() => c.choose(i)} className={`d12-mono rounded-full border px-2.5 py-1 text-[10.5px] ${c.index === i ? "border-[var(--sky)] text-[var(--sky)]" : "border-white/15 text-white/50"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ——— kinetic index with cursor-follow glass preview ——— */
function KineticIndex() {
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
            <span className="d12-mono text-[12px] text-white/40">{String(i + 1).padStart(2, "0")}</span>
            <span className="d12-kinetic block text-[clamp(30px,4.6vw,72px)] leading-[1]" data-on={hov === i}>
              {c.title}
            </span>
            <span className="col-start-2 max-w-[44ch] text-[14.5px] text-white/55 md:hidden">{c.body}</span>
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

function Lenses() {
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
          <div className="d12-mono text-[11px] uppercase tracking-[0.2em] text-[var(--sky)]">Lens {v + 1} of 3</div>
          <h3 className="d12-serif mt-3 text-[clamp(40px,4.6vw,64px)] leading-[0.95]">{lens[v].k}</h3>
          <p className="mt-4 max-w-[40ch] text-[17px] text-white/65">{lens[v].t}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Design12() {
  const reduce = usePrefersReduced();
  const stage = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end end"] });
  const open = useTransform(scrollYProgress, [0.05, 0.75], [reduce ? 1 : 0, 1], { clamp: true });
  const textOp = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  const innerOp = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const innerScale = useTransform(scrollYProgress, [0.2, 0.9], [0.8, 1]);
  const [tab, setTab] = useState<"ts" | "python" | "curl">("ts");
  const [row, setRow] = useState<number | null>(null);
  const { copied, copy } = useCopy();

  return (
    <div className="d12 min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 px-5 py-5 text-white sm:px-8">
          <a href="#" className="d12-serif flex items-center gap-2 text-[26px] leading-none">
            <svg viewBox="-10 -10 20 20" className="h-5 w-5" aria-hidden>
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={i} x1="0" y1="-9" x2="5" y2="-2" stroke="currentColor" strokeWidth="1.4" transform={`rotate(${i * 60})`} />
              ))}
              <circle r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="d12-mono ml-auto hidden gap-7 text-[11.5px] uppercase tracking-[0.18em] md:flex">
            {[
              ["Inside", "#inside"],
              ["Models", "#models"],
              ["API", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:opacity-60">
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="d12-mono ml-auto rounded-full border border-white px-4 py-2 text-[11px] uppercase tracking-[0.18em] hover:bg-white hover:text-black md:ml-0">
            Open
          </a>
        </div>
      </header>

      <main>
        {/* pinned aperture */}
        <section ref={stage} className="relative h-[260vh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            {/* interior */}
            <div className="d12-interior absolute inset-0 grid place-items-center">
              <motion.div style={{ opacity: innerOp, scale: innerScale }} className="w-[min(560px,90vw)]">
                <p className="d12-mono mb-4 text-center text-[11px] uppercase tracking-[0.24em] text-white/50">Inside the aperture</p>
                <Specimen compact />
              </motion.div>
            </div>
            {/* iris */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[max(150vw,150vh)] -translate-x-1/2 -translate-y-1/2">
              <Iris open={open} />
            </div>
            {/* headline */}
            <motion.div style={{ opacity: textOp, y: textY }} className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1400px] flex-col justify-between px-5 pb-10 pt-28 sm:px-8">
              <h1 className="d12-serif text-[clamp(56px,10vw,168px)] leading-[0.86] tracking-[-0.03em]">
                <span className="d12-wonk">Intelligence,</span>
                <br />
                <span className="italic text-[var(--orange)]">unbound.</span>
              </h1>
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <p className="max-w-[40ch] text-[17px] leading-relaxed">A warm, readable surface over a deep machine. Every model family, three temperaments, one aperture — chat, agents and API.</p>
                <span className="d12-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
                  Scroll to open <ArrowDown size={13} className="animate-bounce" />
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* inside */}
        <section id="inside" className="d12-interior relative text-[var(--paper)]">
          <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-36">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
              <h2 className="d12-serif text-[clamp(44px,6vw,96px)] leading-[0.92]">
                What lives <em className="text-[var(--sky)]">inside.</em>
              </h2>
              <p className="max-w-[44ch] text-[16px] text-white/60 md:justify-self-end">Eight capabilities. Hover a line — the type softens and a specimen card follows your cursor.</p>
            </div>
            <div className="mt-14">
              <KineticIndex />
            </div>
          </div>
          <div className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 md:pb-36">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <Specimen />
              <div>
                <p className="d12-mono text-[11px] uppercase tracking-[0.24em] text-[var(--sky)]">Three lenses</p>
                <h2 className="d12-serif mt-4 text-[clamp(40px,5vw,72px)] leading-[0.95]">Choose how the model sees your request.</h2>
                <div className="mt-12">
                  <Lenses />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* field guide */}
        <section id="models" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 md:py-36">
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <h2 className="d12-serif text-[clamp(44px,6vw,96px)] leading-[0.92]">
              A field guide to <em className="text-[var(--orange)]">five</em> families.
            </h2>
            <p className="d12-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]/50 md:justify-self-end">{MOCK_NOTE}</p>
          </div>
          <div className="mt-14 border-b border-[var(--ink)]">
            {MODELS.map((m, i) => (
              <div key={m.id} onMouseEnter={() => setRow(i)} onMouseLeave={() => setRow(null)} className="relative grid items-center gap-4 border-t border-[var(--ink)] py-6 md:grid-cols-[90px_1.2fr_1fr_1fr_160px]">
                <span className="d12-mono text-[12px] text-[var(--ink)]/45">No. {String(i + 1).padStart(2, "0")}</span>
                <span className="d12-serif text-[clamp(44px,5vw,80px)] leading-[0.9] transition-[font-variation-settings] duration-700" style={{ fontVariationSettings: row === i ? '"SOFT" 100, "WONK" 1, "opsz" 144' : '"SOFT" 0, "WONK" 0, "opsz" 144' }}>
                  {row === i ? <em>{m.name}</em> : m.name}
                </span>
                <span className="text-[15px] text-[var(--ink)]/70">{m.blurb}</span>
                <span className="flex flex-wrap gap-1.5">
                  {m.variants.map((v) => (
                    <span key={v} className={`d12-mono rounded-full px-2.5 py-1 text-[10.5px] uppercase ${v === "Abliterated" ? "bg-[var(--orange)] text-white" : "border border-[var(--ink)]/30"}`}>
                      {v}
                    </span>
                  ))}
                </span>
                <span className="d12-mono text-[12px] md:text-right">
                  {m.context} ctx
                  <br />
                  <span className="text-[var(--ink)]/50">
                    ${m.inPrice}/${m.outPrice} · 1M
                  </span>
                </span>
                <motion.span aria-hidden className="d12-holo pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left" initial={false} animate={{ scaleX: row === i ? 1 : 0 }} transition={{ duration: 0.6, ease }} />
              </div>
            ))}
          </div>
        </section>

        {/* api */}
        <section id="api" className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-24 sm:px-8 md:pb-36 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="d12-mono text-[11px] uppercase tracking-[0.24em] text-[var(--orange)]">For developers</p>
            <h2 className="d12-serif mt-4 text-[clamp(40px,5vw,80px)] leading-[0.92]">
              One line in, <em>everything</em> out.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[17px] text-[var(--ink)]/65">Swap the base URL in the SDK you already use. Choose model and lens by name. Cache what repeats.</p>
          </div>
          <div className="d12-interior relative overflow-hidden rounded-[26px] p-4 sm:p-8">
            <div className="d12-glass rounded-[18px] text-[var(--paper)]">
              <div className="flex items-center gap-1 border-b border-white/10 p-2">
                {(["ts", "python", "curl"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`d12-mono relative rounded-full px-3 py-1 text-[11.5px] ${tab === t ? "text-[var(--ink)]" : "text-white/55"}`}>
                    {tab === t && <motion.span layoutId="d12-tab" className="absolute inset-0 rounded-full bg-[var(--paper)]" />}
                    <span className="relative">{t === "ts" ? "TypeScript" : t === "python" ? "Python" : "cURL"}</span>
                  </button>
                ))}
                <button onClick={() => copy(CODE[tab])} aria-label="Copy code" className="ml-auto rounded-full p-1.5 text-white/50 hover:text-white">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <pre className="d12-mono overflow-x-auto p-5 text-[12.5px] leading-[1.8] text-white/85">{CODE[tab]}</pre>
            </div>
          </div>
        </section>

        {/* pricing */}
        <section id="pricing" className="border-t border-[var(--ink)]">
          <div className="mx-auto grid max-w-[1400px] px-5 sm:px-8 md:grid-cols-[0.8fr_repeat(3,1fr)]">
            <div className="border-b border-[var(--ink)] py-10 pr-6 md:border-b-0 md:border-r">
              <h2 className="d12-serif text-[clamp(40px,4.6vw,72px)] leading-[0.92]">
                Rates, <em>openly.</em>
              </h2>
              <p className="d12-mono mt-6 text-[11px] uppercase tracking-[0.12em] text-[var(--ink)]/50">{PRICE_NOTE}</p>
            </div>
            {PLANS.map((p) => (
              <div key={p.name} className={`flex flex-col border-b border-[var(--ink)] py-10 md:border-b-0 md:border-r md:px-8 md:last:border-r-0 ${p.featured ? "bg-[var(--ink)] text-[var(--paper)] md:-my-px" : ""} ${p.featured ? "px-6" : ""}`}>
                <span className="d12-mono text-[11px] uppercase tracking-[0.2em] opacity-60">{p.name}</span>
                <span className="d12-serif mt-8 text-[clamp(44px,4.4vw,68px)] leading-none">{p.price}</span>
                <span className="d12-mono mt-1 text-[11px] opacity-50">{p.cadence}</span>
                <p className="mt-6 text-[15px] opacity-75">{p.body}</p>
                <ul className="mt-6 space-y-2 text-[14px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${p.featured ? "d12-holo" : "bg-[var(--orange)]"}`} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* cta */}
        <section id="start" className="d12-interior relative overflow-hidden text-[var(--paper)]">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-28 text-center sm:px-8 md:py-40">
            <motion.div initial={{ rotate: -90, scale: 0.6, opacity: 0 }} whileInView={{ rotate: 0, scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease }} className="d12-holo-ring mb-10 h-28 w-28 rounded-full" />
            <h2 className="d12-serif max-w-[14ch] text-[clamp(52px,8vw,132px)] leading-[0.88]">
              Open the <em className="text-[var(--sky)]">aperture.</em>
            </h2>
            <p className="mt-6 max-w-[40ch] text-[17px] text-white/60">Early access is rolling out in waves. Put your name down.</p>
            <a href="#" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--paper)] px-7 py-4 text-[16px] font-medium text-[var(--ink)]">
              Request early access <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--ink)] text-[var(--paper)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center">
          <span className="d12-serif text-[24px]">{BRAND.name}</span>
          <nav aria-label="Footer" className="d12-mono flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.18em] text-white/55">
            {["Chat", "Agents", "Docs", "Policy", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-white">{l}</a>
            ))}
          </nav>
          <span className="d12-mono text-[10.5px] text-white/35 md:ml-auto">{MOCK_NOTE}</span>
        </div>
      </footer>
    </div>
  );
}
