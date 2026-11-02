"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, useMotionValueEvent } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Code2, Database, Layers, MessagesSquare, Scale, ScanSearch, SlidersHorizontal, Wallet } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS } from "@/lib/content";
import { useChatDemo } from "@/lib/hooks";

const PrismScene = dynamic(() => import("./PrismScene"), { ssr: false, loading: () => null });
const ease = [0.2, 0.9, 0.25, 1] as const;
const CAP_ICONS = [MessagesSquare, SlidersHorizontal, Code2, Layers, ScanSearch, Database, Wallet, Scale];

function Glass({ children, className = "", strong = false }: { children: React.ReactNode; className?: string; strong?: boolean }) {
  return <div className={`d03-glass ${strong ? "d03-glass-strong" : ""} ${className}`}>{children}</div>;
}

function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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

function Chip({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

function ChatWindow() {
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
              <button key={m.id} onClick={() => c.pickModel(m.id)} className={`relative rounded-full px-3 py-1 text-[12.5px] transition ${c.model.id === m.id ? "text-[var(--ink)]" : "text-[var(--ink)]/45 hover:text-[var(--ink)]/80"}`}>
                {c.model.id === m.id && <motion.span layoutId="d03-model" className="d03-holo absolute inset-0 rounded-full opacity-90" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <span className="relative">{m.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-white/60 p-4 md:block">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]/40">Try</div>
            <ul className="mt-3 space-y-1">
              {PROMPTS.map((p, i) => (
                <li key={p.label}>
                  <button onClick={() => c.choose(i)} className={`w-full rounded-xl px-3 py-2 text-left text-[13px] transition ${c.index === i ? "bg-white/80 shadow-sm" : "hover:bg-white/40"}`}>
                    <span className="block font-medium">{p.label}</span>
                    <span className="line-clamp-1 text-[12px] text-[var(--ink)]/50">{p.prompt}</span>
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
                <div className="flex items-center gap-2 text-[12px] text-[var(--ink)]/50">
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
              <span className="text-[12px] text-[var(--ink)]/45">Variant</span>
              {c.model.variants.map((v) => (
                <button key={v} onClick={() => c.setVariant(v)} className={`rounded-full px-3 py-1 text-[12px] ring-1 transition ${c.variant === v ? "bg-[var(--ink)] text-white ring-[var(--ink)]" : "bg-white/50 ring-black/10 hover:bg-white"}`}>
                  {v}
                </button>
              ))}
              <span className="ml-auto text-[11px] text-[var(--ink)]/40">Simulated response</span>
            </div>
          </div>
        </div>
      </Glass>
    </Tilt>
  );
}

/* ——— model skyline ——— */

function Skyline() {
  const [sel, setSel] = useState(1);
  const m = MODELS[sel];
  return (
    <section id="models" className="relative mx-auto max-w-[1240px] px-5 py-28 sm:px-8 md:py-36">
      <div className="text-center">
        <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--ink)]/45">Model families</p>
        <h2 className="d03-head mx-auto mt-5 max-w-[16ch] text-[clamp(38px,5vw,68px)] leading-[1.02]">
          Each family, a different <span className="d03-serif d03-holo-text">shape</span> of intelligence.
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
                <span className={`text-[13px] transition ${sel === i ? "font-semibold" : "text-[var(--ink)]/50"}`}>{x.name}</span>
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={m.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease }}>
            <Glass strong className="rounded-[28px] p-8">
              <div className="flex items-center justify-between text-[12px] text-[var(--ink)]/50">
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
                    <div className="text-[var(--ink)]/45">{k as string} / 1M</div>
                    <div className="mt-1 text-[18px] font-medium">${v as number}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] text-[var(--ink)]/40">Sample rates · placeholder specs</p>
            </Glass>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ——— page ——— */

export default function Design03() {
  const spread = useRef(0);
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (spread.current = Math.min(1, v * 1.8)));
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [tab, setTab] = useState<"ts" | "python" | "curl">("ts");

  return (
    <div className="d03 relative min-h-screen overflow-hidden bg-[var(--pearl)] text-[var(--ink)]">
      <div aria-hidden className="d03-aurora pointer-events-none absolute inset-x-0 top-0 h-[1400px]" />

      <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
        <Glass strong className="flex w-full max-w-[880px] items-center gap-2 rounded-full py-2 pl-5 pr-2">
          <a href="#" className="flex items-center gap-2 text-[16px] font-semibold tracking-[-0.02em]">
            <span className="d03-holo h-5 w-5 rounded-[7px] rotate-45" />
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="ml-auto hidden gap-1 text-[13.5px] text-[var(--ink)]/65 md:flex">
            {[
              ["Chat", "#chat"],
              ["Models", "#models"],
              ["Developers", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="rounded-full px-3 py-1.5 hover:bg-white/70 hover:text-[var(--ink)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="ml-auto rounded-full bg-[var(--ink)] px-4 py-2 text-[13px] font-medium text-white md:ml-3">
            Try {BRAND.name}
          </a>
        </Glass>
      </header>

      <main className="relative">
        <section ref={hero} className="relative mx-auto flex min-h-[100svh] max-w-[1320px] flex-col items-center px-5 pb-16 pt-32 sm:px-8 lg:pt-32">
          <motion.div style={{ y, opacity: fade }} className="relative z-10 text-center">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="text-[12px] uppercase tracking-[0.3em] text-[var(--ink)]/45">
              One platform · every model
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.4, ease }} className="d03-head mt-6 text-[clamp(52px,8.4vw,128px)] leading-[0.95]">
              Your AI.
              <br />
              Your <span className="d03-serif d03-holo-text pr-2">possibilities.</span>
            </motion.h1>
          </motion.div>

          <div className="relative -mt-4 h-[300px] w-full max-w-[900px] sm:h-[360px] lg:h-[330px]">
            <PrismScene spread={spread} />
            <Chip className="left-[2%] top-[18%] hidden sm:block" delay={0.6}>
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Standard
            </Chip>
            <Chip className="right-[0%] top-[40%] hidden sm:block" delay={0.8}>
              <span className="h-2 w-2 rounded-full bg-amber-300" /> Low-refusal
            </Chip>
            <Chip className="bottom-[14%] left-[8%] hidden sm:block" delay={1}>
              <span className="d03-holo h-2 w-2 rounded-full" /> Abliterated
            </Chip>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1, ease }} className="relative z-10 flex flex-col items-center text-center">
            <p className="max-w-[48ch] text-[17px] leading-relaxed text-[var(--ink)]/65">
              Three temperaments, five model families, one beautifully simple place to use them — in chat, in agents and through the API.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#start" className="d03-btn group flex items-center gap-2 rounded-full px-6 py-3 text-[14.5px] font-medium">
                Start exploring <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </a>
              <a href="#chat" className="rounded-full bg-white/60 px-6 py-3 text-[14.5px] ring-1 ring-black/5 backdrop-blur hover:bg-white">
                See it in action
              </a>
            </div>
          </motion.div>
        </section>

        {/* capabilities rail */}
        <section id="features" className="relative py-24 md:py-32">
          <div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
            <h2 className="d03-head max-w-[14ch] text-[clamp(36px,4.6vw,60px)] leading-[1.02]">Everything feels lighter here.</h2>
            <p className="max-w-[36ch] text-[15px] text-[var(--ink)]/55">Drag or scroll sideways through the platform.</p>
          </div>
          <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-8 no-scrollbar sm:px-8 lg:px-[max(32px,calc((100vw-1320px)/2+32px))]">
            {CAPABILITIES.map((c, i) => {
              const Icon = CAP_ICONS[i];
              return (
                <motion.div key={c.key} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease }} className="snap-start">
                  <Glass className="group relative flex h-[380px] w-[280px] flex-col overflow-hidden rounded-[30px] p-7 transition duration-500 hover:-translate-y-1.5 sm:w-[300px]">
                    <span className="d03-holo absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-40 blur-2xl transition group-hover:opacity-80" />
                    <span className="text-[12px] text-[var(--ink)]/40">0{i + 1}</span>
                    <div className="d03-holo-ring relative mt-8 grid h-16 w-16 place-items-center rounded-[20px]">
                      <Icon size={24} strokeWidth={1.4} />
                    </div>
                    <h3 className="mt-auto text-[22px] font-medium leading-tight tracking-[-0.02em]">{c.title}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-[var(--ink)]/60">{c.body}</p>
                  </Glass>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="chat" className="relative px-5 py-24 sm:px-8 md:py-32">
          <div className="mx-auto mb-14 max-w-[720px] text-center">
            <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--ink)]/45">Unified chat</p>
            <h2 className="d03-head mt-5 text-[clamp(38px,5vw,68px)] leading-[1.02]">
              Switch models <span className="d03-serif d03-holo-text">mid-thought.</span>
            </h2>
          </div>
          <ChatWindow />
        </section>

        <Skyline />

        <section id="api" className="relative mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-32">
          <Glass strong className="grid gap-10 overflow-hidden rounded-[36px] p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
            <div className="flex flex-col">
              <p className="text-[12px] uppercase tracking-[0.24em] text-[var(--ink)]/45">For developers</p>
              <h2 className="d03-head mt-5 text-[clamp(34px,4vw,54px)] leading-[1.04]">The same elegance, in code.</h2>
              <p className="mt-5 max-w-[40ch] text-[16px] leading-relaxed text-[var(--ink)]/60">
                Compatible request shapes, one key for every model, prompt caching and streaming built in.
              </p>
              <ul className="mt-8 space-y-3 text-[14.5px]">
                {["OpenAI-style chat completions", "Variant by model suffix", "Usage & cost on every response"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="d03-holo grid h-5 w-5 place-items-center rounded-full">
                      <Check size={11} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[24px] bg-[#16171c] p-2 text-white shadow-2xl">
              <div className="flex gap-1 p-2">
                {(["ts", "python", "curl"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`relative rounded-full px-3.5 py-1.5 text-[12px] ${tab === t ? "text-[var(--ink)]" : "text-white/55"}`}>
                    {tab === t && <motion.span layoutId="d03-tab" className="d03-holo absolute inset-0 rounded-full" />}
                    <span className="relative">{t === "ts" ? "TypeScript" : t === "python" ? "Python" : "cURL"}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.pre key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="overflow-x-auto px-4 pb-5 pt-2 font-mono text-[12.5px] leading-[1.8] text-white/80">
                  {CODE[tab]}
                </motion.pre>
              </AnimatePresence>
            </div>
          </Glass>
        </section>

        <section id="pricing" className="relative mx-auto max-w-[1240px] px-5 py-24 sm:px-8 md:py-32">
          <div className="text-center">
            <h2 className="d03-head text-[clamp(38px,5vw,68px)] leading-[1.02]">Simple, visible pricing.</h2>
            <p className="mt-4 text-[15px] text-[var(--ink)]/55">{PRICE_NOTE}</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3 md:items-center">
            {PLANS.map((p) => (
              <div key={p.name} className={p.featured ? "d03-holo-border rounded-[32px] p-[1.5px] md:-my-4" : ""}>
                <Glass strong={p.featured} className={`flex h-full flex-col rounded-[31px] p-8 ${p.featured ? "md:py-12" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-medium">{p.name}</span>
                    {p.featured && <span className="d03-holo rounded-full px-2.5 py-1 text-[11px]">Popular pick</span>}
                  </div>
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className={`d03-head leading-none ${p.price.length > 5 ? "text-[34px]" : "text-[46px]"}`}>{p.price}</span>
                    <span className="text-[13px] text-[var(--ink)]/45">{p.cadence}</span>
                  </div>
                  <p className="mt-3 text-[14px] text-[var(--ink)]/60">{p.body}</p>
                  <ul className="mt-6 space-y-2.5 text-[14px]">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Check size={14} className="text-[var(--ink)]/50" /> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#start" className={`mt-8 rounded-full py-3 text-center text-[14px] font-medium ${p.featured ? "bg-[var(--ink)] text-white" : "bg-white/70 ring-1 ring-black/5 hover:bg-white"}`}>
                    Choose {p.name}
                  </a>
                </Glass>
              </div>
            ))}
          </div>
        </section>

        <section id="start" className="relative overflow-hidden px-5 py-32 text-center sm:px-8 md:py-44">
          <div aria-hidden className="d03-aurora pointer-events-none absolute inset-0 opacity-80" />
          <h2 className="d03-head relative mx-auto max-w-[14ch] text-[clamp(48px,7.4vw,112px)] leading-[0.98]">
            Explore intelligence <span className="d03-serif d03-holo-text">without limits.</span>
          </h2>
          <form onSubmit={(e) => e.preventDefault()} className="relative mx-auto mt-12 flex max-w-[460px] items-center gap-2">
            <Glass strong className="flex w-full items-center rounded-full p-1.5 pl-5">
              <label htmlFor="d03-email" className="sr-only">Email</label>
              <input id="d03-email" type="email" placeholder="Your email" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--ink)]/40" />
              <button className="d03-btn flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[14px] font-medium">
                Join <ArrowUpRight size={15} />
              </button>
            </Glass>
          </form>
          <p className="relative mt-4 text-[12px] text-[var(--ink)]/40">Demo form · nothing is sent</p>
        </section>
      </main>

      <footer className="relative border-t border-black/5 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-6 text-[13px] text-[var(--ink)]/55 md:flex-row md:items-center">
          <span className="flex items-center gap-2 font-semibold text-[var(--ink)]">
            <span className="d03-holo h-4 w-4 rotate-45 rounded-[5px]" /> {BRAND.name}
          </span>
          <nav aria-label="Footer" className="flex flex-wrap gap-5">
            {["Chat", "Models", "API docs", "Pricing", "Policy", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-[var(--ink)]">{l}</a>
            ))}
          </nav>
          <span className="md:ml-auto">{MOCK_NOTE}</span>
        </div>
      </footer>
    </div>
  );
}
