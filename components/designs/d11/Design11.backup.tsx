"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, Check, Code2, Coins, Database, GitCompare, Layers, MessagesSquare, ScanText, SlidersHorizontal } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE } from "@/lib/content";
import { useStream } from "@/lib/hooks";

const ease = [0.16, 1, 0.3, 1] as const;
const ICONS = [MessagesSquare, SlidersHorizontal, Code2, Layers, ScanText, Database, Coins, GitCompare];

/** Glass surface whose specular highlight follows the cursor. */
function Glass({ children, className = "", as: As = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "article" }) {
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

function HeroSlab() {
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
            <span className="d11-mono text-[10.5px] text-[var(--ti)]/40">simulated</span>
          </div>
          <div className="ml-auto mt-6 max-w-[80%] rounded-2xl rounded-br-md bg-white/[0.07] px-4 py-2.5 text-[14px] text-[var(--ti)]">Give me three directions for our launch film.</div>
          <p className="mt-5 min-h-[90px] text-[15.5px] leading-relaxed text-[var(--fg)]/90">{out}</p>
          <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2.5">
            <span className="text-[13px] text-[var(--ti)]/35">Message {BRAND.name}…</span>
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
function Keys() {
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
              <div className="d11-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ti)]/45">Capability {String(i + 1).padStart(2, "0")} / 08</div>
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
function Wipe() {
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
      <div className="d11-mono text-[11px] text-[var(--ti)]/40">Prompt: write the antagonist&apos;s threat, unsoftened · simulated</div>
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
      className="d11-bevel relative h-[440px] cursor-ew-resize touch-none select-none overflow-hidden rounded-[28px]"
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

export default function Design11() {
  const [tab, setTab] = useState<"ts" | "python" | "curl">("ts");
  return (
    <div className="d11 relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      <div aria-hidden className="d11-noise pointer-events-none fixed inset-0 z-0 opacity-[0.05]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-20%] h-[900px] w-[1400px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(200,204,212,.10),transparent)]" />

      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
        <Glass className="mx-auto flex max-w-[1200px] items-center gap-6 rounded-full py-2.5 pl-6 pr-2.5">
          <a href="#" className="d11-metal text-[18px] font-bold tracking-[-0.03em]">
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="ml-auto hidden gap-7 text-[13.5px] text-[var(--ti)]/70 md:flex">
            {[
              ["Platform", "#platform"],
              ["Compare", "#compare"],
              ["Models", "#models"],
              ["Developers", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-white">
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="d11-btn ml-auto rounded-full px-4 py-2 text-[13px] font-semibold md:ml-0">
            Get access
          </a>
        </Glass>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[100svh] max-w-[1200px] items-center gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="d11-mono inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[var(--ti)]/60">
              <span className="h-1 w-1 rounded-full bg-[var(--violet)]" /> Concept 11
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease }} className="d11-metal mt-8 text-[clamp(48px,7vw,104px)] font-semibold leading-[0.96] tracking-[-0.05em]">
              One platform.
              <br />
              Infinite possibilities.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease, delay: 0.15 }} className="mt-8 max-w-[44ch] text-[18px] leading-relaxed text-[var(--fg)]/60">
              Every model family, with standard, low-refusal and abliterated variants — in a chat, agent and API experience machined to the last detail.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-wrap gap-3">
              <a href="#start" className="d11-btn group flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold">
                Request access <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </a>
              <a href="#compare" className="rounded-full border border-white/12 px-6 py-3.5 text-[15px] text-[var(--ti)] hover:border-white/30">
                Compare variants
              </a>
            </motion.div>
          </div>
          <HeroSlab />
        </section>

        <section id="platform" className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
          <p className="d11-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ti)]/45">Platform</p>
          <h2 className="d11-metal mt-4 max-w-[18ch] text-[clamp(36px,4.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em]">Every capability, precisely placed.</h2>
          <div className="mt-12">
            <Keys />
          </div>
        </section>

        <section id="compare" className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
          <div className="mb-10 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <p className="d11-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ti)]/45">Variants</p>
              <h2 className="d11-metal mt-4 text-[clamp(36px,4.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em]">Same prompt. Different temperament.</h2>
            </div>
            <p className="max-w-[42ch] text-[16px] text-[var(--fg)]/55 md:justify-self-end">Drag the divider to compare a standard model with an abliterated one on a fiction prompt.</p>
          </div>
          <Wipe />
        </section>

        <section id="models" className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
          <p className="d11-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ti)]/45">Models</p>
          <h2 className="d11-metal mt-4 text-[clamp(36px,4.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em]">Five families. Cut from the same block.</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {MODELS.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease, delay: i * 0.08 }} whileHover={{ y: -8 }}>
                <Glass as="article" className="d11-bevel flex h-[380px] flex-col justify-between rounded-[24px] p-6">
                  <div className="flex justify-between">
                    <span className="d11-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--ti)]/45">{String(i + 1).padStart(2, "0")}</span>
                    <span className="d11-mono text-[11px] text-[var(--ti)]/70">{m.context}</span>
                  </div>
                  <div>
                    <div className="d11-metal text-[38px] font-semibold leading-none tracking-[-0.04em]">{m.name}</div>
                    <div className="mt-1 text-[13px] text-[var(--violet)]">{m.role}</div>
                    <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--fg)]/55">{m.blurb}</p>
                    <div className="d11-mono mt-5 border-t border-white/10 pt-3 text-[11px] text-[var(--ti)]/55">
                      ${m.inPrice} / ${m.outPrice} per 1M
                    </div>
                  </div>
                </Glass>
              </motion.div>
            ))}
          </div>
          <p className="d11-mono mt-5 text-[11px] text-[var(--ti)]/35">{MOCK_NOTE}; sample rates.</p>
        </section>

        <section id="api" className="mx-auto grid max-w-[1200px] gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="d11-mono text-[11px] uppercase tracking-[0.24em] text-[var(--ti)]/45">Developers</p>
            <h2 className="d11-metal mt-4 text-[clamp(36px,4.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em]">Engineered for the API you already use.</h2>
            <ul className="mt-8 space-y-3 text-[15px] text-[var(--fg)]/70">
              {["Compatible request shapes", "Streaming and tool calls", "Prompt caching on every family"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <Check size={15} className="text-[var(--violet)]" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <Glass className="d11-bevel overflow-hidden rounded-[24px]">
            <div className="flex gap-1 border-b border-white/[0.08] p-2">
              {(["ts", "python", "curl"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`relative rounded-full px-4 py-1.5 text-[12.5px] ${tab === t ? "text-black" : "text-[var(--ti)]/60"}`}>
                  {tab === t && <motion.span layoutId="d11-tab" className="d11-btn absolute inset-0 rounded-full" />}
                  <span className="relative">{t === "ts" ? "TypeScript" : t === "python" ? "Python" : "cURL"}</span>
                </button>
              ))}
            </div>
            <pre className="d11-mono overflow-x-auto p-6 text-[12.5px] leading-[1.85] text-[var(--ti)]">{CODE[tab]}</pre>
          </Glass>
        </section>

        <section id="pricing" className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 md:py-32">
          <h2 className="d11-metal text-center text-[clamp(36px,4.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em]">Pricing, without the fine print.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <Glass key={p.name} className={`flex flex-col rounded-[24px] p-8 ${p.featured ? "d11-bevel-strong" : "d11-bevel"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-semibold text-[var(--ti)]">{p.name}</span>
                  {p.featured && <span className="d11-mono rounded-full border border-[var(--violet)]/40 px-2.5 py-0.5 text-[10.5px] uppercase tracking-[0.15em] text-[var(--violet)]">Signature</span>}
                </div>
                <div className="d11-metal mt-8 text-[44px] font-semibold leading-none tracking-[-0.04em]">{p.price}</div>
                <div className="mt-1 text-[13px] text-[var(--ti)]/45">{p.cadence}</div>
                <p className="mt-5 text-[14.5px] text-[var(--fg)]/60">{p.body}</p>
                <ul className="mt-6 flex-1 space-y-2 text-[14px] text-[var(--fg)]/80">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check size={14} className="text-[var(--ti)]/50" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="#start" className={`mt-8 rounded-full py-3 text-center text-[14px] font-semibold ${p.featured ? "d11-btn" : "border border-white/12 text-[var(--ti)] hover:border-white/30"}`}>
                  Choose {p.name}
                </a>
              </Glass>
            ))}
          </div>
          <p className="d11-mono mt-5 text-center text-[11px] text-[var(--ti)]/35">{PRICE_NOTE}</p>
        </section>

        <section id="start" className="mx-auto max-w-[1200px] px-5 py-28 text-center sm:px-8 md:py-40">
          <h2 className="d11-metal mx-auto max-w-[14ch] text-[clamp(48px,7vw,104px)] font-semibold leading-[0.96] tracking-[-0.05em]">Intelligence, unbound.</h2>
          <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-12 max-w-[480px]">
            <Glass className="d11-bevel flex items-center rounded-full p-1.5 pl-6">
              <label htmlFor="d11-email" className="sr-only">Email</label>
              <input id="d11-email" type="email" placeholder="you@company.com" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--ti)]/35" />
              <button className="d11-btn rounded-full px-5 py-2.5 text-[14px] font-semibold">Request</button>
            </Glass>
          </form>
          <p className="d11-mono mt-3 text-[11px] text-[var(--ti)]/35">Demo form · nothing is sent</p>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-5 py-10 text-[13px] text-[var(--ti)]/55 sm:px-8 md:flex-row md:items-center">
          <span className="d11-metal font-bold">{BRAND.name}</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-6">
            {["Docs", "Status", "Policy", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-white">{l}</a>
            ))}
          </nav>
          <span className="d11-mono text-[11px] md:ml-auto">{MOCK_NOTE}</span>
        </div>
      </footer>
    </div>
  );
}
