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

function Rule({ delay = 0 }: { delay?: number }) {
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

function SectionHead({ n, label }: { n: string; label: string }) {
  return (
    <div className="d04-mono flex items-start gap-3 text-[11px] uppercase tracking-[0.12em] md:flex-col md:gap-1">
      <span className="text-[var(--accent)]">{n}</span>
      <span>{label}</span>
    </div>
  );
}

/* Giant wordmark: each letter condenses/expands with cursor proximity. */
function Wordmark() {
  const ref = useRef<HTMLHeadingElement>(null);
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
    <h1 ref={ref} aria-label={BRAND.name} className="d04-display flex w-full justify-between text-[clamp(60px,17.2vw,300px)] leading-[0.8]">
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
    </h1>
  );
}

function Product() {
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
                  <span className={`d04-mono text-[11px] ${c.model.id === m.id ? "text-[var(--accent)]" : "text-black/40"}`}>{m.context}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap gap-0 border-t border-black">
          {c.model.variants.map((v) => (
            <button key={v} onClick={() => c.setVariant(v)} className={`d04-mono flex-1 border-r border-black px-3 py-3 text-[11px] uppercase tracking-[0.08em] last:border-r-0 ${c.variant === v ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--fog)]"}`}>
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
            <div className="d04-mono mb-3 text-[11px] uppercase tracking-[0.12em] text-black/45">
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

export default function Design04() {
  const [hover, setHover] = useState<number | null>(null);
  const [pick, setPick] = useState(3);
  const [tab, setTab] = useState<"python" | "ts" | "curl">("python");

  return (
    <div className="d04 min-h-screen bg-white text-black">
      <header className="sticky top-0 z-40 border-b border-black bg-white">
        <div className="grid grid-cols-[1fr_auto] items-stretch md:grid-cols-[200px_1fr_auto]">
          <a href="#" className="d04-wide flex items-center px-5 py-3 text-[18px] uppercase md:border-r md:border-black">
            {BRAND.name}
            <span className="ml-1 h-2 w-2 bg-[var(--accent)]" />
          </a>
          <nav aria-label="Primary" className="d04-mono hidden items-center gap-8 px-6 text-[11.5px] uppercase tracking-[0.1em] md:flex">
            {[
              ["Platform", "#platform"],
              ["Models", "#models"],
              ["API", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="d04-link">
                {l}
              </a>
            ))}
          </nav>
          <a href="#begin" className="d04-mono flex items-center gap-2 border-l border-black bg-black px-5 text-[11.5px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-[var(--accent)]">
            Begin <ArrowRight size={14} />
          </a>
        </div>
      </header>

      <main>
        {/* hero */}
        <section className="relative overflow-hidden border-b border-black">
          <div className="grid md:grid-cols-[200px_1fr]">
            <div className="hidden md:block" />
            <div className="px-5 pt-10 md:px-8 md:pt-14">
              <div className="d04-mono flex justify-between text-[11px] uppercase tracking-[0.12em]">
                <span>An AI platform</span>
                <span className="hidden sm:inline">Chat · Agents · API</span>
                <span>Est. —</span>
              </div>
            </div>
          </div>
          <div className="px-3 pt-6 md:px-6">
            <Wordmark />
          </div>
          <div className="grid border-t border-black md:grid-cols-[200px_1fr_1fr]">
            <div className="hidden border-r border-black p-5 md:block">
              <ArrowDownRight size={28} strokeWidth={1.25} />
            </div>
            <motion.p {...wipe} className="d04-cond border-b border-black p-5 text-[clamp(34px,4.2vw,64px)] uppercase leading-[0.92] md:border-b-0 md:border-r md:p-8">
              One platform.
              <br />
              <span className="text-[var(--accent)]">Infinite</span> possibilities.
            </motion.p>
            <div className="flex flex-col justify-between gap-8 p-5 md:p-8">
              <p className="max-w-[42ch] text-[16px] leading-relaxed">
                Every model family — standard, low-refusal or abliterated — in one chat, one agent runtime and one API. Built with restraint, priced in the open.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#begin" className="d04-mono inline-flex items-center gap-2 bg-[var(--accent)] px-5 py-3 text-[12px] uppercase tracking-[0.1em] text-white hover:bg-black">
                  Request access <ArrowRight size={14} />
                </a>
                <a href="#api" className="d04-mono inline-flex items-center gap-2 border border-black px-5 py-3 text-[12px] uppercase tracking-[0.1em] hover:bg-black hover:text-white">
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* capabilities as typographic rows */}
        <section id="platform" className="grid border-b border-black md:grid-cols-[200px_1fr]">
          <div className="border-b border-black p-5 md:border-b-0 md:border-r">
            <div className="md:sticky md:top-24">
              <SectionHead n="01" label="Platform" />
            </div>
          </div>
          <ul>
            {CAPABILITIES.map((c, i) => (
              <li key={c.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className={`border-b border-black last:border-b-0 transition-colors duration-300 ${hover === i ? "bg-black text-white" : ""}`}>
                <div className="grid items-center gap-3 px-5 py-5 md:grid-cols-[60px_1fr_340px] md:px-8">
                  <span className={`d04-mono text-[11px] ${hover === i ? "text-[var(--accent)]" : "text-black/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="d04-morph text-[clamp(30px,4.4vw,68px)] uppercase leading-[0.9]" data-on={hover === i}>
                    {c.title}
                  </span>
                  <span className={`text-[14.5px] leading-relaxed ${hover === i ? "text-white/75" : "text-black/60"}`}>{c.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* product */}
        <section id="product" className="grid border-b border-black md:grid-cols-[200px_1fr]">
          <div className="border-b border-black p-5 md:border-b-0 md:border-r">
            <SectionHead n="02" label="Product" />
          </div>
          <div className="p-5 md:p-8">
            <motion.h2 {...wipe} className="d04-cond mb-8 text-[clamp(40px,6vw,96px)] uppercase leading-[0.86]">
              Pick a model.
              <br />
              Pick a temperament.
            </motion.h2>
            <Product />
          </div>
        </section>

        {/* models */}
        <section id="models" className="grid border-b border-black md:grid-cols-[200px_1fr]">
          <div className="border-b border-black p-5 md:border-b-0 md:border-r">
            <SectionHead n="03" label="Models" />
            <p className="d04-mono mt-6 hidden text-[10.5px] leading-relaxed text-black/45 md:block">{MOCK_NOTE}. Specs are placeholders.</p>
          </div>
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {MODELS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setPick(i)}
                  onMouseEnter={() => setPick(i)}
                  className={`group relative flex min-h-[340px] flex-col justify-between border-b border-r border-black p-5 text-left transition-colors lg:border-b-0 ${pick === i ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--fog)]"}`}
                >
                  <span className="d04-mono text-[11px] uppercase tracking-[0.1em]">{m.role}</span>
                  <span className="d04-display text-[clamp(48px,4.6vw,80px)] leading-[0.8]" style={{ fontVariationSettings: `"wdth" ${pick === i ? 62 : 92}, "wght" 860`, transition: "font-variation-settings .6s cubic-bezier(.77,0,.18,1)" }}>
                    {m.context}
                  </span>
                  <span>
                    <span className="d04-wide block text-[22px] uppercase">{m.name}</span>
                    <span className={`d04-mono mt-1 block text-[10.5px] ${pick === i ? "text-white/80" : "text-black/45"}`}>{m.variants.join(" / ")}</span>
                  </span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={pick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid gap-4 border-t border-black p-5 md:grid-cols-[1fr_auto] md:items-center md:p-8">
                <p className="text-[18px]">{MODELS[pick].blurb}</p>
                <span className="d04-mono text-[12px]">
                  ${MODELS[pick].inPrice} in · ${MODELS[pick].cached} cached · ${MODELS[pick].outPrice} out / 1M (sample)
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* api */}
        <section id="api" className="grid border-b border-black bg-black text-white md:grid-cols-[200px_1fr]">
          <div className="border-b border-white/30 p-5 md:border-b-0 md:border-r">
            <SectionHead n="04" label="API" />
          </div>
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-between gap-10 border-b border-white/30 p-5 md:p-8 lg:border-b-0 lg:border-r">
              <div className="d04-display text-[clamp(96px,14vw,220px)] leading-[0.8]" style={{ fontVariationSettings: '"wdth" 62, "wght" 860' }}>
                /v1
              </div>
              <p className="max-w-[40ch] text-[16px] leading-relaxed text-white/70">
                A single versioned endpoint for chat, agents and every model family. Keep the SDK you have; change the base URL.
              </p>
            </div>
            <div>
              <div className="d04-mono flex border-b border-white/30 text-[11px] uppercase tracking-[0.12em]">
                {(["python", "ts", "curl"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`flex-1 border-r border-white/30 px-4 py-3 last:border-r-0 ${tab === t ? "bg-white text-black" : "hover:bg-white/10"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <pre className="d04-mono overflow-x-auto p-5 text-[12.5px] leading-[1.85] md:p-8">
                {CODE[tab].split("\n").map((l, i) => (
                  <div key={tab + i}>
                    <span className="mr-5 inline-block w-5 text-right text-white/30">{i + 1}</span>
                    {l.includes(BRAND.apiBase) ? <span className="text-[var(--accent)]">{l}</span> : l}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </section>

        {/* pricing */}
        <section id="pricing" className="grid border-b border-black md:grid-cols-[200px_1fr]">
          <div className="border-b border-black p-5 md:border-b-0 md:border-r">
            <SectionHead n="05" label="Pricing" />
          </div>
          <div>
            <div className="grid md:grid-cols-3">
              {PLANS.map((p, i) => (
                <div key={p.name} className={`flex flex-col border-b border-black p-5 md:border-b-0 md:border-r md:p-8 md:last:border-r-0 ${p.featured ? "bg-[var(--fog)]" : ""}`}>
                  <span className="d04-mono text-[11px] uppercase tracking-[0.12em]">
                    {String(i + 1).padStart(2, "0")} — {p.name}
                  </span>
                  <motion.span {...wipe} className="d04-display mt-10 block text-[clamp(56px,6vw,96px)] leading-[0.82]" style={{ fontVariationSettings: '"wdth" 70, "wght" 860' }}>
                    {p.price}
                  </motion.span>
                  <span className="d04-mono mt-2 text-[11px] uppercase text-black/50">{p.cadence}</span>
                  <p className="mt-8 text-[15px] leading-relaxed text-black/70">{p.body}</p>
                  <ul className="d04-mono mt-6 space-y-1.5 text-[12px] uppercase">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <span className="text-[var(--accent)]">+</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="d04-mono border-t border-black px-5 py-3 text-[11px] text-black/50 md:px-8">{PRICE_NOTE}</div>
          </div>
        </section>

        {/* cta */}
        <section id="begin" className="overflow-hidden bg-[var(--accent)] text-white">
          <div className="px-3 pt-8 md:px-6">
            <div className="d04-display text-[clamp(72px,21vw,360px)] leading-[0.78]" style={{ fontVariationSettings: '"wdth" 125, "wght" 860' }}>
              BEGIN.
            </div>
          </div>
          <div className="grid border-t border-white/60 md:grid-cols-[200px_1fr_1fr]">
            <div className="hidden border-r border-white/60 md:block" />
            <p className="border-b border-white/60 p-5 text-[17px] md:border-b-0 md:border-r md:p-8">Access opens in stages. Leave an address and we will write when it is your turn.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-stretch p-5 md:p-8">
              <label htmlFor="d04-email" className="sr-only">Email</label>
              <input id="d04-email" type="email" placeholder="EMAIL ADDRESS" className="d04-mono min-w-0 flex-1 border-b border-white bg-transparent py-2 text-[13px] uppercase tracking-[0.1em] placeholder:text-white/60 focus:outline-none" />
              <button className="d04-mono ml-3 bg-black px-5 text-[12px] uppercase tracking-[0.1em]">Send</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="grid md:grid-cols-[200px_1fr_1fr_1fr]">
        <div className="d04-wide border-b border-black p-5 text-[18px] uppercase md:border-b-0 md:border-r">{BRAND.name}</div>
        {[
          ["Product", ["Chat", "Agents", "Models", "Compare"]],
          ["Developers", ["Docs", "Reference", "SDKs", "Status"]],
          ["Studio", ["About", "Policy", "Contact"]],
        ].map(([h, items]) => (
          <div key={h as string} className="border-b border-black p-5 md:border-b-0 md:border-r md:last:border-r-0">
            <div className="d04-mono text-[11px] uppercase tracking-[0.12em] text-black/45">{h as string}</div>
            <ul className="mt-3 space-y-1 text-[14px]">
              {(items as string[]).map((x) => (
                <li key={x}>
                  <a href="#" className="d04-link">{x}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="d04-mono border-t border-black p-5 text-[10.5px] uppercase tracking-[0.1em] text-black/45 md:col-span-4">{MOCK_NOTE}</div>
      </footer>
      <Rule />
    </div>
  );
}
