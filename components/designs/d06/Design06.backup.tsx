"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Bot, Check, ChevronRight, Code2, Columns3, MessageCircle, Sparkles } from "lucide-react";
import { BRAND, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS } from "@/lib/content";
import { useStream } from "@/lib/hooks";

const ease = [0.25, 0.1, 0.25, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 1, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
}

/* ——— the "device": an app window with machined bezel ——— */
function Device({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`d06-device rounded-[22px] p-[10px] sm:rounded-[28px] sm:p-[14px] ${className}`}>
      <div className="relative overflow-hidden rounded-[14px] bg-white sm:rounded-[18px]">
        <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#fbfbfd] px-4 py-2.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
          ))}
          <span className="mx-auto text-[11px] text-black/40">{BRAND.name}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function ChatScreen({ i = 0 }: { i?: number }) {
  const p = PROMPTS[i];
  const { out } = useStream(p.response, i, 38);
  const m = MODELS.find((x) => x.id === p.model)!;
  return (
    <div className="grid min-h-[300px] grid-cols-[150px_1fr] text-left sm:min-h-[420px] sm:grid-cols-[190px_1fr]">
      <aside className="border-r border-black/[0.06] bg-[#fbfbfd] p-3">
        <div className="rounded-lg bg-[var(--blue)] px-3 py-2 text-[12px] font-medium text-white">New chat</div>
        <div className="mt-4 space-y-1">
          {PROMPTS.map((x, k) => (
            <div key={x.label} className={`truncate rounded-md px-2 py-1.5 text-[11.5px] ${k === i ? "bg-black/[0.06] font-medium" : "text-black/50"}`}>
              {x.prompt}
            </div>
          ))}
        </div>
      </aside>
      <div className="flex flex-col p-4 sm:p-6">
        <div className="mx-auto flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-3 py-1 text-[11.5px]">
          <Sparkles size={12} className="text-[var(--blue)]" /> {m.family}
        </div>
        <div className="ml-auto mt-5 max-w-[80%] rounded-2xl bg-[var(--blue)] px-3.5 py-2 text-[13px] text-white">{p.prompt}</div>
        <p className="mt-4 max-w-[90%] text-[13.5px] leading-relaxed text-black/80">{out}</p>
        <div className="mt-auto flex items-center rounded-full border border-black/10 px-4 py-2 text-[12px] text-black/35">Message {BRAND.name}…</div>
      </div>
    </div>
  );
}

function AgentScreen() {
  const steps = ["Read 14 files in src/auth", "Found failing test: session.spec.ts", "Plan: refresh token before expiry", "Edit src/auth/session.ts  +12 −3", "Run tests", "All tests passing"];
  return (
    <div className="min-h-[300px] p-5 text-left sm:min-h-[420px] sm:p-7">
      <div className="text-[12px] text-black/45">Forge agent · simulated run</div>
      <div className="mt-1 text-[17px] font-semibold tracking-tight">Fix the failing auth tests</div>
      <ol className="mt-5 space-y-2.5">
        {steps.map((s, k) => (
          <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.35 }} className="flex items-center gap-3 text-[13px]">
            <span className={`grid h-5 w-5 place-items-center rounded-full ${k === steps.length - 1 ? "bg-[#28c840] text-white" : "bg-[#f5f5f7]"}`}>
              {k === steps.length - 1 ? <Check size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-black/30" />}
            </span>
            <span className={k === steps.length - 1 ? "font-medium" : "text-black/70"}>{s}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

function CompareScreen() {
  const cols = [
    ["Core", "Clear, measured, balanced answer to the question as asked."],
    ["Unbound", "Direct answer with no hedging; the operator sets the policy."],
    ["Swift", "Short answer, returned quickly. Good for drafts."],
  ];
  return (
    <div className="grid min-h-[300px] grid-cols-3 gap-px bg-black/[0.06] text-left sm:min-h-[420px]">
      {cols.map(([n, t], k) => (
        <motion.div key={n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.15 }} className="bg-white p-3 sm:p-5">
          <div className="text-[11px] text-black/45">Model</div>
          <div className="text-[15px] font-semibold">{n}</div>
          <p className="mt-3 text-[12px] leading-relaxed text-black/70 sm:text-[13px]">{t}</p>
          <div className="mt-4 h-1.5 rounded-full bg-[#f5f5f7]">
            <motion.div className="h-full rounded-full bg-[var(--blue)]" initial={{ width: 0 }} animate={{ width: ["70%", "45%", "30%"][k] }} transition={{ duration: 1, delay: 0.3 }} />
          </div>
          <div className="mt-1 text-[10.5px] text-black/40">relative cost (sample)</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ——— sticky chapters ——— */
const CHAPTERS = [
  { k: "Chat", icon: MessageCircle, title: "Every model. One conversation.", body: "Start with Core, switch to Unbound or Atlas mid-thread. The context comes with you." },
  { k: "Agents", icon: Bot, title: "Agents that finish the job.", body: "Forge reads your project, plans the change, edits files and runs the tests — and shows every step." },
  { k: "Compare", icon: Columns3, title: "See the difference for yourself.", body: "Send one prompt to several models and compare answers and cost side by side." },
];

function Chapters() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const [ch, setCh] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setCh(Math.min(2, Math.max(0, Math.floor(v * 3)))));
  return (
    <section ref={ref} id="product" className="mx-auto max-w-[1180px] px-5 py-24 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-[18vh] lg:py-[20vh]">
          {CHAPTERS.map((c, i) => (
            <div key={c.k} className={`transition-opacity duration-500 ${ch === i ? "opacity-100" : "lg:opacity-25"}`}>
              <c.icon size={30} strokeWidth={1.6} className="text-[var(--blue)]" />
              <h3 className="mt-5 text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.08] tracking-[-0.03em]">{c.title}</h3>
              <p className="mt-4 max-w-[38ch] text-[18px] leading-relaxed text-[var(--grey)]">{c.body}</p>
              <div className="mt-8 lg:hidden">
                <Device>{i === 0 ? <ChatScreen i={1} /> : i === 1 ? <AgentScreen /> : <CompareScreen />}</Device>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-[calc(50vh-250px)]">
            <Device>
              <AnimatePresence mode="wait">
                <motion.div key={ch} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.45, ease }}>
                  {ch === 0 ? <ChatScreen i={1} /> : ch === 1 ? <AgentScreen /> : <CompareScreen />}
                </motion.div>
              </AnimatePresence>
            </Device>
            <div className="mt-6 flex justify-center gap-2">
              {CHAPTERS.map((c, i) => (
                <span key={c.k} className={`h-2 rounded-full transition-all duration-500 ${ch === i ? "w-6 bg-[var(--ink)]" : "w-2 bg-black/20"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Design06() {
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.84, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const [picked, setPicked] = useState(["core", "unbound", "forge"]);

  return (
    <div className="d06 min-h-screen bg-white text-[var(--ink)]">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-12 max-w-[1024px] items-center gap-6 px-5 text-[12.5px]">
          <a href="#" className="text-[15px] font-semibold tracking-tight">
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="mx-auto hidden gap-8 text-black/75 md:flex">
            {[
              ["Overview", "#"],
              ["Chat", "#product"],
              ["Models", "#models"],
              ["Developers", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-black">
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="ml-auto rounded-full bg-[var(--blue)] px-3.5 py-1 text-[12px] text-white md:ml-0">
            Get started
          </a>
        </div>
      </header>

      <main>
        <section className="overflow-hidden pt-12 text-center sm:pt-16">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="text-[19px] font-semibold text-[var(--blue)]">
            {BRAND.name}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.1 }} className="mx-auto mt-3 max-w-[14ch] px-5 text-[clamp(48px,8vw,104px)] font-semibold leading-[1.02] tracking-[-0.045em]">
            Intelligence, unbound.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.25 }} className="mx-auto mt-6 max-w-[34ch] px-5 text-[clamp(19px,2vw,24px)] leading-snug text-[var(--grey)]">
            Every model family, in one beautifully simple app. With the freedom to choose how it answers.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex justify-center gap-6 text-[17px]">
            <a href="#start" className="rounded-full bg-[var(--blue)] px-6 py-3 text-white hover:bg-[#0077ed]">
              Get started
            </a>
            <a href="#product" className="flex items-center text-[var(--blue)] hover:underline">
              Learn more <ChevronRight size={18} />
            </a>
          </motion.div>

          <div ref={stage} className="mx-auto mt-12 max-w-[1080px] px-4 [perspective:1600px] sm:mt-14 sm:px-8">
            <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 100%" }}>
              <Device className="shadow-[0_60px_120px_-40px_rgba(0,0,0,.35)]">
                <ChatScreen i={0} />
              </Device>
            </motion.div>
            <div className="mx-auto h-6 w-[70%] rounded-b-[40%] bg-gradient-to-b from-black/[0.08] to-transparent blur-md" />
          </div>
        </section>

        {/* highlights */}
        <section className="mx-auto max-w-[1180px] px-5 py-28 sm:px-8 md:py-36">
          <Reveal>
            <h2 className="text-[clamp(40px,5.4vw,72px)] font-semibold leading-[1.04] tracking-[-0.04em]">
              Get the highlights.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-6">
            <Reveal className="md:col-span-4">
              <div className="flex h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-[28px] bg-[var(--fog)] p-8 sm:p-10">
                <p className="max-w-[24ch] text-[clamp(24px,2.4vw,32px)] font-semibold leading-tight tracking-[-0.02em]">
                  Three temperaments. <span className="text-[var(--grey)]">Standard, low-refusal or abliterated — your choice, per message.</span>
                </p>
                <div className="mt-10 flex items-end gap-3">
                  {["Standard", "Low-refusal", "Abliterated"].map((v, i) => (
                    <motion.div key={v} initial={{ height: 40 }} whileInView={{ height: 90 + i * 60 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease }} className={`flex flex-1 items-end rounded-2xl p-4 text-[13px] font-medium ${i === 2 ? "bg-[var(--ink)] text-white" : i === 1 ? "bg-[var(--blue)] text-white" : "bg-white"}`}>
                      {v}
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-2">
              <div className="flex h-full min-h-[420px] flex-col justify-between rounded-[28px] bg-[var(--ink)] p-8 text-white">
                <p className="text-[24px] font-semibold leading-tight tracking-[-0.02em]">Up to a million tokens of context.</p>
                <div>
                  <div className="text-[clamp(64px,7vw,96px)] font-semibold leading-none tracking-[-0.05em]">1M</div>
                  <p className="mt-2 text-[14px] text-white/60">Atlas, placeholder spec</p>
                </div>
              </div>
            </Reveal>
            {[
              ["Prompt caching", "Repeated prefixes cost less. Automatically."],
              ["Coding agents", "Plan, edit, test. In your repo."],
              ["Clear pricing", "Every rate, per token, in the open."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={0.05 * i} className="md:col-span-2">
                <div className="h-full rounded-[28px] bg-[var(--fog)] p-8">
                  <p className="text-[21px] font-semibold tracking-[-0.02em]">{t}</p>
                  <p className="mt-2 text-[16px] text-[var(--grey)]">{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="bg-[var(--fog)]">
          <Chapters />
        </div>

        {/* model compare */}
        <section id="models" className="mx-auto max-w-[1180px] px-5 py-28 sm:px-8 md:py-36">
          <Reveal>
            <h2 className="text-center text-[clamp(40px,5.4vw,72px)] font-semibold leading-[1.04] tracking-[-0.04em]">Which model is right for you?</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {picked.map((id, col) => {
              const m = MODELS.find((x) => x.id === id)!;
              return (
                <Reveal key={col} delay={col * 0.08}>
                  <div className="text-center">
                    <label className="sr-only" htmlFor={`d06-m${col}`}>Model {col + 1}</label>
                    <select
                      id={`d06-m${col}`}
                      value={id}
                      onChange={(e) => setPicked((p) => p.map((x, k) => (k === col ? e.target.value : x)))}
                      className="mx-auto block rounded-full border border-black/15 bg-white px-4 py-2 text-[14px]"
                    >
                      {MODELS.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.family}
                        </option>
                      ))}
                    </select>
                    <AnimatePresence mode="wait">
                      <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="d06-chip mx-auto mt-8 grid h-24 w-24 place-items-center rounded-[26px] text-[30px] font-semibold text-white">{m.name[0]}</div>
                        <h3 className="mt-6 text-[26px] font-semibold tracking-[-0.02em]">{m.name}</h3>
                        <p className="mt-1 text-[15px] text-[var(--grey)]">{m.role}</p>
                        <dl className="mt-8 space-y-6 border-t border-black/10 pt-6 text-[15px]">
                          <div>
                            <dt className="text-[13px] text-[var(--grey)]">Context window</dt>
                            <dd className="mt-1 text-[24px] font-semibold">{m.context}</dd>
                          </div>
                          <div>
                            <dt className="text-[13px] text-[var(--grey)]">Variants</dt>
                            <dd className="mt-1">{m.variants.join(" · ")}</dd>
                          </div>
                          <div>
                            <dt className="text-[13px] text-[var(--grey)]">Input / output per 1M</dt>
                            <dd className="mt-1">
                              ${m.inPrice} / ${m.outPrice}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[13px] text-[var(--grey)]">Best for</dt>
                            <dd className="mt-1">{m.blurb}</dd>
                          </div>
                        </dl>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-12 text-center text-[12px] text-[var(--grey)]">{MOCK_NOTE}. Rates are samples.</p>
        </section>

        {/* api */}
        <section id="api" className="bg-black px-5 py-28 text-center text-white sm:px-8 md:py-36">
          <Reveal>
            <Code2 size={34} strokeWidth={1.4} className="mx-auto text-[#2997ff]" />
            <h2 className="mx-auto mt-6 max-w-[16ch] text-[clamp(40px,5.4vw,72px)] font-semibold leading-[1.04] tracking-[-0.04em]">Built for developers, too.</h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-[19px] text-white/60">The same models through one API. Bring the SDK you already use.</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mx-auto mt-14 max-w-[760px] overflow-hidden rounded-[22px] bg-[#1d1d1f] text-left ring-1 ring-white/10">
              <div className="border-b border-white/10 px-5 py-3 text-[12px] text-white/45">quickstart.ts</div>
              <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-[1.75] text-white/85">{CODE.ts}</pre>
            </div>
          </Reveal>
        </section>

        {/* pricing */}
        <section id="pricing" className="mx-auto max-w-[1180px] px-5 py-28 sm:px-8 md:py-36">
          <Reveal>
            <h2 className="text-center text-[clamp(40px,5.4vw,72px)] font-semibold leading-[1.04] tracking-[-0.04em]">Plans that grow with you.</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <div className={`flex h-full flex-col rounded-[28px] p-8 ${p.featured ? "bg-[var(--ink)] text-white" : "bg-[var(--fog)]"}`}>
                  <p className="text-[21px] font-semibold">{p.name}</p>
                  <p className="mt-6 text-[40px] font-semibold leading-none tracking-[-0.03em]">{p.price}</p>
                  <p className={`mt-1 text-[14px] ${p.featured ? "text-white/60" : "text-[var(--grey)]"}`}>{p.cadence}</p>
                  <p className={`mt-6 text-[16px] ${p.featured ? "text-white/80" : "text-[var(--grey)]"}`}>{p.body}</p>
                  <ul className="mt-6 flex-1 space-y-2 text-[15px]">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check size={15} className="text-[var(--blue)]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#start" className={`mt-8 rounded-full py-3 text-center text-[15px] ${p.featured ? "bg-[var(--blue)] text-white" : "bg-white"}`}>
                    Choose {p.name}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-[12px] text-[var(--grey)]">{PRICE_NOTE}</p>
        </section>

        <section id="start" className="bg-[var(--fog)] px-5 py-28 text-center sm:px-8 md:py-40">
          <Reveal>
            <h2 className="mx-auto max-w-[14ch] text-[clamp(48px,7vw,96px)] font-semibold leading-[1.02] tracking-[-0.045em]">Start exploring.</h2>
            <p className="mx-auto mt-5 max-w-[36ch] text-[21px] text-[var(--grey)]">Begin with the Explore plan and every model family.</p>
            <a href="#" className="mt-10 inline-block rounded-full bg-[var(--blue)] px-8 py-4 text-[17px] text-white hover:bg-[#0077ed]">
              Create your account
            </a>
          </Reveal>
        </section>
      </main>

      <footer className="bg-[var(--fog)] px-5 pb-10 text-[12px] text-[var(--grey)] sm:px-8">
        <div className="mx-auto max-w-[1024px] border-t border-black/10 pt-6">
          <p>{MOCK_NOTE}. Context sizes, model names and plan details are placeholders for design review.</p>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["Explore", ["Chat", "Agents", "Compare"]],
              ["Models", ["Core", "Unbound", "Forge", "Atlas", "Swift"]],
              ["Developers", ["API", "Docs", "Status"]],
              ["Company", ["About", "Usage policy", "Contact"]],
            ].map(([h, items]) => (
              <div key={h as string}>
                <div className="font-semibold text-[var(--ink)]">{h as string}</div>
                <ul className="mt-2 space-y-1.5">
                  {(items as string[]).map((x) => (
                    <li key={x}>
                      <a href="#" className="hover:underline">{x}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8">© {BRAND.name} (placeholder brand)</p>
        </div>
      </footer>
    </div>
  );
}
