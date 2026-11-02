"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { useCopy } from "@/lib/hooks";

const ease = [0.22, 1, 0.36, 1] as const;

/* ——— small pieces ——— */

export function Eyebrow({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="d01-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[var(--ink)]/60">
      <span className="text-[var(--red)]">{n}</span>
      <span className="h-px w-8 bg-current opacity-40" />
      {children}
    </div>
  );
}

export function Scribble({ d, delay = 0, className = "" }: { d: string; delay?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 60" fill="none" aria-hidden>
      <motion.path
        d={d}
        stroke="var(--red)"
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.1, delay, ease }}
      />
    </svg>
  );
}

export function Lines({ text, className = "", delay = 0 }: { text: string[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.map((t, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: delay + i * 0.09, ease }}
          >
            {t}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ——— hero transcript (the product is the hero) ——— */

export const THREAD = [
  { who: "You", text: "Plan a heist story where the crew are all retired librarians.", model: "Core" },
  { who: "Core", text: "Working title: Overdue. The crew target a private archive that never returns what it borrows…", model: "Core" },
  { who: "You", text: "Darker. Let the archivist be genuinely menacing.", model: "Unbound" },
  { who: "Unbound", text: "She catalogues people the way she catalogues books — and nobody she shelves is ever checked out again.", model: "Unbound" },
  { who: "You", text: "Turn chapter one into a script outline as JSON.", model: "Forge" },
];

export function HeroTranscript() {
  const [hover, setHover] = useState<number | null>(null);
  const notes: Record<number, { t: string; top: string }> = {
    2: { t: "switched to Unbound mid-thread — context kept", top: "43%" },
    4: { t: "handed to Forge for structured output", top: "81%" },
  };
  return (
    <div className="relative xl:pr-[200px]">
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 0.6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease }}
        className="relative rounded-[6px] bg-[#FBF8F1] shadow-[0_1px_0_rgba(22,19,15,.08),0_40px_80px_-40px_rgba(22,19,15,.35)] ring-1 ring-[var(--ink)]/10"
      >
        <div className="flex items-center justify-between border-b border-[var(--ink)]/10 px-5 py-3">
          <div className="d01-mono flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--pine)]" /> Thread · Overdue
          </div>
          <div className="d01-mono text-[11px] text-[var(--text-muted)]">3 models · 1 context</div>
        </div>
        <ol className="divide-y divide-[var(--ink)]/[0.07]">
          {THREAD.map((m, i) => (
            <motion.li
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.18, duration: 0.6, ease }}
              className={`grid grid-cols-[28px_64px_1fr] items-baseline gap-2 px-5 py-3 text-[14px] leading-snug transition-colors ${i >= 2 ? "max-md:hidden" : ""} ${
                notes[i] ? "bg-[var(--sun)]/15" : ""
              } ${hover === i ? "bg-[var(--ink)]/[0.04]" : ""}`}
            >
              <span className="d01-mono text-[10.5px] text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
              <span className={`text-[12.5px] font-semibold ${m.who === "You" ? "text-[var(--text-muted)]" : "text-[var(--pine)]"}`}>
                {m.who}
              </span>
              <span className="text-[var(--ink)]">
                {m.text}
                {m.who === "You" && i > 0 && (
                  <span className="d01-mono ml-2 inline-block rounded-sm border border-[var(--red)]/50 px-1.5 text-[10px] text-[var(--red)]">
                    → {m.model}
                  </span>
                )}
              </span>
            </motion.li>
          ))}
        </ol>
        <div className="flex items-center gap-3 border-t border-[var(--ink)]/10 px-5 py-3">
          <span className="d01-mono text-[11px] text-[var(--text-muted)]">Ask anything…</span>
          <span className="ml-auto rounded-full bg-[var(--ink)] px-3 py-1 text-[11px] text-[var(--paper)]">Forge ▾</span>
        </div>
      </motion.div>

      {/* marginalia — desktop only */}
      {Object.entries(notes).map(([k, n], j) => (
        <div key={k} className="pointer-events-none absolute right-0 hidden w-[180px] xl:block" style={{ top: n.top }}>
          <Scribble d="M2 30 C 30 10, 60 50, 112 24" delay={1.4 + j * 0.4} className="absolute -left-[70px] -top-3 h-10 w-20 -scale-x-100" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 + j * 0.4 }}
            className="d01-serif text-[19px] leading-[1.15] text-[var(--red)]"
          >
            {n.t}
          </motion.p>
        </div>
      ))}
    </div>
  );
}

/* ——— index of capabilities ——— */

export function Index() {
  const [active, setActive] = useState(0);
  const c = CAPABILITIES[active];
  return (
    <section data-section id="index" className="mx-auto grid max-w-[1320px] gap-10 px-5 py-24 sm:px-8 md:py-36 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Eyebrow n="§1">Contents</Eyebrow>
        <h2 className="d01-display mt-6 text-[clamp(40px,5vw,68px)] leading-[0.95]">
          Everything in <span className="d01-serif font-normal italic">one</span> place.
        </h2>
        <div className="sticky top-28 mt-10 hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-[4px] border border-[var(--ink)]/15 bg-[#FBF8F1] p-6"
            >
              <div className="d01-mono text-[11px] text-[var(--red)]">Note {String(active + 1).padStart(2, "0")}</div>
              <p className="d01-serif mt-3 text-[26px] leading-[1.1]">{c.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ol className="lg:col-span-7 lg:col-start-6">
        {CAPABILITIES.map((cap, i) => (
          <motion.li
            key={cap.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.6, delay: i * 0.04, ease }}
          >
            <button
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="group grid w-full grid-cols-[44px_1fr_auto] items-baseline gap-3 border-t border-[var(--ink)]/15 py-5 text-left"
            >
              <span className="d01-mono text-[12px] text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className={`d01-display block text-[clamp(22px,2.4vw,32px)] leading-tight transition-colors ${active === i ? "text-[var(--red)]" : ""}`}>
                  {cap.title}
                </span>
                <span className="mt-2 block max-w-[52ch] text-[15px] leading-relaxed text-[var(--ink)]/60 lg:hidden">{cap.body}</span>
              </span>
              <ArrowRight
                size={20}
                className={`transition-transform duration-500 ${active === i ? "translate-x-0 text-[var(--red)]" : "-translate-x-2 opacity-30"}`}
              />
            </button>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ——— pinned scroll story ——— */

export const STEPS = [
  {
    k: "Ask",
    model: "Core",
    title: "Start with the everyday model.",
    body: "Core handles the first draft, the brainstorm, the explanation. Fast and general.",
    lines: [
      ["You", "Explain prompt caching like I'm a new engineer."],
      ["Core", "When the start of your prompt repeats, we keep it warm. You pay less to send it again."],
    ],
  },
  {
    k: "Switch",
    model: "Unbound",
    title: "Change models without changing threads.",
    body: "Need a model that won't second-guess the request? Swap to an abliterated variant. The conversation stays.",
    lines: [
      ["You", "Now write the villain's monologue. Don't soften it."],
      ["Unbound", "\"You built locks because you believed in doors. I never did.\""],
    ],
  },
  {
    k: "Ship",
    model: "Forge",
    title: "Hand the result to an agent.",
    body: "Forge reads the repo, plans the edit and runs the tests. Same thread, same history.",
    lines: [
      ["You", "Add the monologue to scenes/act2.md and open a PR."],
      ["Forge", "Plan: edit 1 file · run lint · open PR #—. Applying edit…  ✓ lint passed"],
    ],
  },
];

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(2, Math.floor(v * 3))));
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const s = STEPS[step];

  return (
    <section data-section ref={ref} id="story" className="sys-invert relative bg-[var(--pine)] py-[72px] text-[var(--paper)] md:h-[300vh] md:py-[120px]">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 md:sticky md:top-0 md:h-screen md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <div className="d01-mono flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[var(--paper)]/60">
            <span className="text-[var(--sun)]">§2</span>
            <span className="h-px w-8 bg-current opacity-40" /> One thread, three models
          </div>
          <div className="mt-8 flex gap-2">
            {STEPS.map((x, i) => (
              <span
                key={x.k}
                className={`d01-mono rounded-full border px-3 py-1 text-[11px] transition ${
                  i === step ? "border-[var(--sun)] bg-[var(--sun)] text-[var(--ink)]" : "border-[var(--paper)]/25 text-[var(--paper)]/60"
                }`}
              >
                {i + 1}. {x.k}
              </span>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.45, ease }}>
              <h3 className="d01-display mt-8 text-[clamp(34px,4vw,56px)] leading-[0.98]">{s.title}</h3>
              <p className="mt-5 max-w-[42ch] text-[17px] leading-relaxed text-[var(--paper)]/75">{s.body}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 hidden h-px w-full bg-[var(--paper)]/15 md:block">
            <motion.div className="h-px bg-[var(--sun)]" style={{ width: bar }} />
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="d01-light rounded-[6px] bg-[var(--paper)] p-2 text-[var(--ink)] shadow-[0_50px_100px_-40px_rgba(0,0,0,.6)]">
            <div className="flex items-center gap-2 px-3 py-2">
              {["Core", "Unbound", "Forge"].map((m) => (
                <span
                  key={m}
                  className={`d01-mono rounded-[3px] px-2 py-1 text-[11px] transition ${
                    s.model === m ? "bg-[var(--ink)] text-[var(--paper)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  {m}
                </span>
              ))}
              <span className="d01-mono ml-auto text-[10.5px] text-[var(--text-muted)]">context preserved</span>
            </div>
            <div className="min-h-[300px] space-y-2 rounded-[4px] bg-[#FBF8F1] p-4">
              {STEPS.slice(0, step + 1).flatMap((st, si) =>
                st.lines.map(([who, text], li) => (
                  <motion.div
                    key={`${si}-${li}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: si === step ? 1 : 0.82, y: 0 }}
                    transition={{ duration: 0.5, delay: li * 0.25 }}
                    className={`max-w-[88%] rounded-[4px] px-3.5 py-2.5 text-[14px] leading-snug ${
                      who === "You" ? "ml-auto bg-[var(--ink)] text-[var(--paper)]" : "bg-white ring-1 ring-[var(--ink)]/10"
                    }`}
                  >
                    {who !== "You" && <span className="d01-mono mb-1 block text-[10px] text-[var(--pine)]">{who}</span>}
                    {text}
                  </motion.div>
                ))
              )}
            </div>
          </div>
          {/* mobile: show all steps since there is no pinning */}
          <div className="mt-6 flex gap-2 md:hidden">
            {STEPS.map((x, i) => (
              <button key={x.k} onClick={() => setStep(i)} className={`d01-mono flex-1 rounded-full border px-3 py-2 text-[11px] ${i === step ? "border-[var(--sun)] bg-[var(--sun)] text-[var(--ink)]" : "border-[var(--paper)]/25"}`}>
                {x.k}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— models as specimens ——— */

export function Specimens() {
  const max = Math.log10(1000);
  return (
    <section data-section id="models" className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-36">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Eyebrow n="§3">Specimens</Eyebrow>
          <h2 className="d01-display mt-6 text-[clamp(40px,5vw,68px)] leading-[0.95]">Five families. Three temperaments.</h2>
        </div>
        <p className="max-w-[46ch] self-end text-[17px] leading-relaxed text-[var(--ink)]/65 md:col-span-5 md:col-start-8">
          Each family can ship as <em>standard</em>, <em>low-refusal</em> or <em>abliterated</em>. Pick the temperament per request, not per account.
        </p>
      </div>
      <div className="mt-16 grid gap-px overflow-hidden rounded-[4px] bg-[var(--ink)]/15 sm:grid-cols-2 lg:grid-cols-6">
        {MODELS.map((m, i) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className={`group relative bg-[var(--paper)] p-6 transition-colors hover:bg-[#FBF8F1] ${
              i < 2 ? "lg:col-span-3" : "lg:col-span-2"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="d01-mono text-[11px] text-[var(--text-muted)]">Fig. {i + 1}</span>
              <span className="d01-mono text-[11px] text-[var(--text-muted)]">{m.context} ctx</span>
            </div>
            <h3 className="d01-display mt-10 text-[44px] leading-none">{m.name}</h3>
            <p className="d01-serif mt-1 text-[20px] italic text-[var(--red)]">{m.role}</p>
            <p className="mt-4 max-w-[38ch] text-[14.5px] leading-relaxed text-[var(--ink)]/65">{m.blurb}</p>
            <div className="mt-6">
              <div className="h-[6px] w-full bg-[var(--ink)]/10">
                <motion.div
                  className="h-full bg-[var(--ink)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(Math.log10(m.contextK) / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.08, ease }}
                />
              </div>
              <div className="d01-mono mt-1.5 flex justify-between text-[9.5px] text-[var(--text-muted)]">
                <span>1K</span>
                <span>context, log scale</span>
                <span>1M</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {m.variants.map((v) => (
                <span
                  key={v}
                  className={`d01-mono rounded-[3px] px-2 py-0.5 text-[10.5px] ${
                    v === "Abliterated" ? "bg-[var(--red)] text-white" : v === "Low-refusal" ? "bg-[var(--sun)] text-[var(--ink)]" : "border border-[var(--ink)]/25"
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
        <div className="sys-invert flex flex-col justify-between gap-4 bg-[var(--ink)] p-6 text-[var(--paper)] sm:col-span-2 sm:flex-row sm:items-center lg:col-span-6">
          <p className="d01-serif text-[26px] leading-tight">Compare any two families on the same prompt, side by side.</p>
          <a href="#api" className="d01-mono inline-flex shrink-0 items-center gap-1 text-[12px] text-[var(--sun)]">
            Open compare <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
      <p className="d01-mono mt-4 text-[11px] text-[var(--text-muted)]">{MOCK_NOTE}. Context sizes are placeholder specs.</p>
    </section>
  );
}

/* ——— api ——— */

export const NOTES: Record<"curl" | "python" | "ts", Record<number, string>> = {
  curl: { 0: "One endpoint for every family", 1: "One key, scoped per project", 4: "Pick a model and variant by name" },
  python: { 4: "Point the SDK you already use at Aether", 9: "Agents use the same call" },
  ts: { 3: "Drop-in base URL", 7: "Long-context models stream too", 9: "Streaming is on by default in the SDKs" },
};

export function Api() {
  const [tab, setTab] = useState<"curl" | "python" | "ts">("python");
  const [line, setLine] = useState<number | null>(null);
  const { copied, copy } = useCopy();
  const lines = CODE[tab].split("\n");
  const notes = NOTES[tab];
  return (
    <section data-section id="api" className="border-y border-[var(--ink)]/15 bg-[#FBF8F1]">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow n="§4">For developers</Eyebrow>
          <h2 className="d01-display mt-6 text-[clamp(40px,5vw,64px)] leading-[0.95]">
            Same API shape. <span className="d01-serif font-normal italic text-[var(--red)]">More</span> models.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[16px] leading-relaxed text-[var(--ink)]/65">
            Use the client libraries you already have. Hover a line to read the margin note.
          </p>
          <ul className="mt-8 space-y-3 text-[14.5px]">
            {["Streaming and tool calls", "Prompt caching on every model", "Per-request variant selection"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--red)]" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-8">
          <div className="overflow-hidden rounded-[6px] bg-[var(--ink)] text-[var(--paper)]">
            <div className="flex items-center border-b border-white/10 px-2">
              {(["python", "ts", "curl"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`d01-mono relative px-4 py-3 text-[12px] ${tab === t ? "text-white" : "text-[var(--text-muted)] hover:text-white/80"}`}
                >
                  {t === "ts" ? "typescript" : t}
                  {tab === t && <motion.span layoutId="d01-tab" className="absolute inset-x-3 bottom-0 h-[2px] bg-[var(--sun)]" />}
                </button>
              ))}
              <button onClick={() => copy(CODE[tab])} className="d01-mono ml-auto flex items-center gap-1.5 px-3 text-[11px] text-[var(--text-muted)] hover:text-white">
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="grid md:grid-cols-[1fr_220px]">
              <pre className="d01-mono overflow-x-auto py-4 text-[12.5px] leading-[1.75]">
                {lines.map((l, i) => (
                  <div
                    key={`${tab}-${i}`}
                    onMouseEnter={() => setLine(i)}
                    onMouseLeave={() => setLine(null)}
                    className={`flex px-4 transition-colors ${notes[i] !== undefined ? "cursor-help" : ""} ${
                      line === i && notes[i] ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span className="mr-4 w-5 shrink-0 select-none text-right text-[var(--text-muted)]">{i + 1}</span>
                    <span className={notes[i] ? "text-[var(--sun)]" : "text-white/85"}>{l || " "}</span>
                  </div>
                ))}
              </pre>
              <div className="relative hidden border-l border-white/10 md:block">
                {Object.entries(notes).map(([k, t]) => (
                  <div
                    key={`${tab}-${k}`}
                    className={`d01-serif absolute left-4 right-4 text-[16px] leading-tight transition-all duration-300 ${
                      line === Number(k) ? "text-[var(--sun)]" : "text-[var(--text-muted)]"
                    }`}
                    style={{ top: 16 + Number(k) * 22 }}
                  >
                    ← {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— pricing ledger with calculator ——— */

export function Ledger() {
  const [inTok, setIn] = useState(20000);
  const [outTok, setOut] = useState(1500);
  const [cache, setCache] = useState(0.6);
  return (
    <section data-section id="pricing" className="mx-auto max-w-[1320px] px-5 py-24 sm:px-8 md:py-36">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow n="§5">Rates</Eyebrow>
          <h2 className="d01-display mt-6 text-[clamp(40px,5vw,68px)] leading-[0.95]">Priced per token. Shown in full.</h2>
          <div className="mt-10 space-y-6">
            {PLANS.map((p) => (
              <div key={p.name} className={`flex items-baseline gap-4 border-t pt-4 ${p.featured ? "border-[var(--red)]" : "border-[var(--ink)]/15"}`}>
                <span className="d01-display w-20 shrink-0 text-[22px]">{p.name}</span>
                <span className="flex-1 text-[14px] text-[var(--ink)]/60">{p.body}</span>
                <span className="d01-mono w-[120px] shrink-0 text-right text-[13px]">
                  {p.price}
                  <span className="text-[var(--text-muted)]"> {p.cadence}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-[6px] border border-[var(--ink)]/15 bg-[#FBF8F1] p-6">
            <div className="d01-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Estimate one request</div>
            {[
              ["Input tokens", inTok, setIn, 1000, 200000, 1000],
              ["Output tokens", outTok, setOut, 100, 20000, 100],
            ].map(([label, v, set, min, max, step]) => (
              <label key={label as string} className="mt-5 block">
                <span className="flex justify-between text-[14px]">
                  {label as string} <span className="d01-mono">{(v as number).toLocaleString()}</span>
                </span>
                <input
                  type="range"
                  min={min as number}
                  max={max as number}
                  step={step as number}
                  value={v as number}
                  onChange={(e) => (set as (n: number) => void)(+e.target.value)}
                  className="d01-range mt-2 w-full"
                />
              </label>
            ))}
            <label className="mt-5 block">
              <span className="flex justify-between text-[14px]">
                Cached share of input <span className="d01-mono">{Math.round(cache * 100)}%</span>
              </span>
              <input type="range" min={0} max={0.95} step={0.05} value={cache} onChange={(e) => setCache(+e.target.value)} className="d01-range mt-2 w-full" />
            </label>
            <table className="mt-6 w-full text-[14px]">
              <thead>
                <tr className="d01-mono text-left text-[10.5px] uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="pb-2 font-normal">Model</th>
                  <th className="pb-2 font-normal">In / Out per 1M</th>
                  <th className="pb-2 text-right font-normal">This request</th>
                </tr>
              </thead>
              <tbody>
                {MODELS.map((m) => (
                  <tr key={m.id} className="border-t border-[var(--ink)]/10">
                    <td className="py-2.5 font-semibold">{m.name}</td>
                    <td className="d01-mono py-2.5 text-[12.5px] text-[var(--ink)]/60">
                      ${m.inPrice} / ${m.outPrice}
                    </td>
                    <td className="d01-mono py-2.5 text-right">{fmtUSD(estimateCost(m, inTok, outTok, cache))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="d01-serif mt-4 text-[16px] italic text-[var(--red)]">{PRICE_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— page ——— */
