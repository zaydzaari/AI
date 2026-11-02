"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ChevronDown, Copy, CornerDownLeft, Database, GitBranch, Key, Layers, Scale, Sparkles, Terminal, Zap } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS, type Variant } from "@/lib/content";
import { useCopy, useStream } from "@/lib/hooks";
import { GlyphField } from "./GlyphField";

const ease = [0.16, 1, 0.3, 1] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="d02-mono text-[11px] uppercase tracking-[0.2em] text-[var(--sand)]">{children}</div>;
}

function Btn({ children, light = false, href = "#start" }: { children: React.ReactNode; light?: boolean; href?: string }) {
  return (
    <a
      href={href}
      className={`d02-mono group inline-flex items-center gap-2.5 rounded-[3px] px-4 py-2.5 text-[12px] uppercase tracking-[0.12em] transition ${
        light ? "bg-[var(--paper)] text-[var(--bg)] hover:bg-white" : "border border-[var(--line)] text-[var(--paper)] hover:border-[var(--paper)]/50"
      }`}
    >
      {children}
      <span className="d02-caret inline-block h-3 w-[1.5px] bg-current" />
    </a>
  );
}

/* ——— docs-style capabilities ——— */

const CAP_ICONS = [Layers, Sparkles, GitBranch, Key, Database, Zap, Scale, CornerDownLeft];
const CAP_SPEC: Record<string, string> = {
  chat: `thread.switch({ model: "unbound-128k" })\n// history and attachments carry over`,
  variants: `model: "core-128k"            // standard\nmodel: "core-128k:low-refusal"\nmodel: "swift-32k:abliterated"`,
  agents: `agent.run({\n  repo: "./",\n  task: "fix failing auth tests",\n  tools: ["fs", "shell", "git"],\n})`,
  api: `POST ${BRAND.apiBase}/chat/completions\nPOST ${BRAND.apiBase}/messages`,
  context: `atlas-1m  ▕████████████████████▏ 1,000K\nforge-256k ▕█████▏ 256K\ncore-128k  ▕██▏ 128K`,
  cache: `cache_control: { type: "prefix" }\n// repeated prefixes billed at the cached rate`,
  pricing: `usage: {\n  input: 18240, cached: 16000,\n  output: 912, cost_usd: "shown per request"\n}`,
  discover: `compare.run({\n  prompt, models: ["core", "unbound", "forge"]\n})`,
};

function Capabilities() {
  const [i, setI] = useState(0);
  const c = CAPABILITIES[i];
  const Icon = CAP_ICONS[i];
  return (
    <section id="platform" className="relative border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-24 sm:px-8 md:grid-cols-[280px_1fr] md:py-32">
        <div>
          <Eyebrow>Platform</Eyebrow>
          <h2 className="d02-head mt-5 text-[32px] leading-[1.02] sm:text-[40px]">Read it like documentation.</h2>
          <nav aria-label="Capabilities" className="mt-10 flex gap-1 overflow-x-auto pb-2 no-scrollbar md:flex-col md:overflow-visible">
            {CAPABILITIES.map((x, k) => (
              <button
                key={x.key}
                onClick={() => setI(k)}
                className={`d02-mono relative shrink-0 whitespace-nowrap rounded-[3px] px-3 py-2 text-left text-[12.5px] transition ${
                  k === i ? "bg-[var(--panel)] text-[var(--paper)]" : "text-[var(--paper)]/45 hover:text-[var(--paper)]/80"
                }`}
              >
                {k === i && <motion.span layoutId="d02-cap" className="absolute inset-y-1 left-0 w-[2px] bg-[var(--blue)]" />}
                <span className="mr-2 text-[var(--paper)]/30">{String(k + 1).padStart(2, "0")}</span>
                {x.title}
              </button>
            ))}
          </nav>
        </div>
        <div className="md:pt-[88px]">
          <AnimatePresence mode="wait">
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease }}
              className="grid gap-6 lg:grid-cols-[1fr_1.1fr]"
            >
              <div className="rounded-[6px] border border-[var(--line)] p-8">
                <Icon size={22} className="text-[var(--blue)]" strokeWidth={1.5} />
                <h3 className="d02-head mt-10 text-[34px] leading-[1.05]">{c.title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-[var(--paper)]/60">{c.body}</p>
              </div>
              <pre className="d02-mono overflow-x-auto rounded-[6px] bg-[var(--panel)] p-6 text-[12.5px] leading-[1.8] text-[var(--paper)]/85">
                <div className="mb-4 flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-[var(--paper)]/35">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" /> example
                </div>
                {CAP_SPEC[c.key]}
              </pre>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ——— terminal playground ——— */

function Playground() {
  const [pi, setPi] = useState(2);
  const [variant, setVariant] = useState<Variant>("Abliterated");
  const [run, setRun] = useState(0);
  const p = PROMPTS[pi];
  const model = MODELS.find((m) => m.id === p.model)!;
  const vs: Variant[] = ["Standard", "Low-refusal", "Abliterated"];
  const suffix = variant === "Standard" ? "" : `:${variant.toLowerCase()}`;
  const id = `${model.id}-${model.context.toLowerCase()}${suffix}`;
  const { out, done } = useStream(p.response, `${pi}-${variant}-${run}`, 40);
  const tokens = out.split(/\s+/).filter(Boolean).length;

  return (
    <section id="playground" className="relative overflow-hidden border-t border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Playground</Eyebrow>
            <h2 className="d02-head mt-5 max-w-[14ch] text-[clamp(40px,5.4vw,76px)] leading-[0.98]">Change the model. Keep the request.</h2>
          </div>
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-[var(--paper)]/55">
            Variants are a suffix on the model name. Same payload, different temperament. Responses below are simulated.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[8px] border border-[var(--line)] bg-[#0f0f0e] shadow-[0_40px_120px_-40px_rgba(110,139,255,.25)]">
          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] px-4 py-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((k) => (
                <span key={k} className="h-2.5 w-2.5 rounded-full bg-white/10" />
              ))}
            </div>
            <div className="d02-mono ml-3 flex gap-1 overflow-x-auto no-scrollbar">
              {PROMPTS.map((x, k) => (
                <button
                  key={x.label}
                  onClick={() => {
                    setPi(k);
                    setRun((r) => r + 1);
                    const m = MODELS.find((mm) => mm.id === x.model)!;
                    if (!m.variants.includes(variant)) setVariant(m.variants[0]);
                  }}
                  className={`rounded-[3px] px-2.5 py-1 text-[11.5px] ${k === pi ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
                >
                  {x.label.toLowerCase()}.json
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-1 rounded-[4px] border border-[var(--line)] p-0.5">
              {vs.map((v) => {
                const ok = model.variants.includes(v);
                return (
                  <button
                    key={v}
                    disabled={!ok}
                    onClick={() => {
                      setVariant(v);
                      setRun((r) => r + 1);
                    }}
                    title={ok ? v : `${v} not offered for ${model.name}`}
                    className={`d02-mono relative rounded-[3px] px-2.5 py-1 text-[11px] transition disabled:cursor-not-allowed disabled:opacity-25 ${
                      variant === v ? "text-[var(--bg)]" : "text-white/60"
                    }`}
                  >
                    {variant === v && <motion.span layoutId="d02-var" className="absolute inset-0 rounded-[3px] bg-[var(--paper)]" />}
                    <span className="relative">{v}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid lg:grid-cols-2">
            <pre className="d02-mono overflow-x-auto border-b border-[var(--line)] p-6 text-[12.5px] leading-[1.85] lg:border-b-0 lg:border-r">
              <span className="text-white/35">{"// request"}</span>
              {"\n"}
              <span className="text-white/50">{"{"}</span>
              {"\n  "}
              <span className="text-[var(--sand)]">&quot;model&quot;</span>: <motion.span key={id} initial={{ backgroundColor: "rgba(110,139,255,.45)" }} animate={{ backgroundColor: "rgba(110,139,255,0)" }} transition={{ duration: 1.2 }} className="rounded-sm text-[var(--blue)]">&quot;{id}&quot;</motion.span>,
              {"\n  "}
              <span className="text-[var(--sand)]">&quot;messages&quot;</span>: [{"{"}
              {"\n    "}
              <span className="text-[var(--sand)]">&quot;role&quot;</span>: <span className="text-white/80">&quot;user&quot;</span>,
              {"\n    "}
              <span className="text-[var(--sand)]">&quot;content&quot;</span>: <span className="whitespace-pre-wrap text-white/80">&quot;{p.prompt}&quot;</span>
              {"\n  }],\n  "}
              <span className="text-[var(--sand)]">&quot;stream&quot;</span>: <span className="text-white/80">true</span>
              {"\n"}
              <span className="text-white/50">{"}"}</span>
            </pre>
            <div className="flex min-h-[280px] flex-col p-6">
              <div className="d02-mono flex items-center gap-3 text-[11px] text-white/35">
                <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-400" : "animate-pulse bg-[var(--blue)]"}`} />
                {done ? "complete" : "streaming"} · {tokens} tokens · simulated
              </div>
              <p className="mt-5 flex-1 text-[17px] leading-relaxed text-[var(--paper)]/90">
                {out}
                {!done && <span className="d02-caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-[var(--blue)]" />}
              </p>
              <button onClick={() => setRun((r) => r + 1)} className="d02-mono mt-6 self-start text-[11.5px] uppercase tracking-[0.14em] text-white/45 hover:text-white">
                ↻ Run again
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ——— model registry ——— */

function Registry() {
  const [open, setOpen] = useState<string | null>("unbound");
  return (
    <section id="models" className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 md:py-32">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Eyebrow>Model registry</Eyebrow>
            <h2 className="d02-head mt-5 text-[clamp(40px,5.4vw,76px)] leading-[0.98]">Five families. One namespace.</h2>
          </div>
          <p className="self-end text-[15px] leading-relaxed text-[var(--paper)]/55 md:justify-self-end md:text-right">
            {MOCK_NOTE}.<br />Names, context sizes and rates are placeholders.
          </p>
        </div>
        <div className="mt-14 border-t border-[var(--line)]">
          <div className="d02-mono hidden grid-cols-[1.2fr_1.4fr_1fr_1.6fr_1fr_24px] gap-4 py-3 text-[10.5px] uppercase tracking-[0.16em] text-white/35 md:grid">
            <span>Model ID</span>
            <span>Role</span>
            <span>Context</span>
            <span>Variants</span>
            <span className="text-right">In / Out · 1M</span>
            <span />
          </div>
          {MODELS.map((m, k) => {
            const isOpen = open === m.id;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: k * 0.06, duration: 0.5, ease }}
                className="border-b border-[var(--line)]"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : m.id)}
                  aria-expanded={isOpen}
                  className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-5 text-left md:grid-cols-[1.2fr_1.4fr_1fr_1.6fr_1fr_24px]"
                >
                  <span className="d02-mono text-[15px] text-[var(--paper)] transition group-hover:text-[var(--blue)]">
                    {m.id}-{m.context.toLowerCase()}
                  </span>
                  <ChevronDown size={16} className={`justify-self-end text-white/40 transition md:order-last ${isOpen ? "rotate-180" : ""}`} />
                  <span className="text-[14px] text-[var(--paper)]/60">{m.role}</span>
                  <span className="hidden items-center gap-3 md:flex">
                    <span className="h-[3px] w-16 overflow-hidden rounded-full bg-white/10">
                      <span className="block h-full bg-[var(--sand)]" style={{ width: `${Math.max(6, (Math.log10(m.contextK) / 3) * 100)}%` }} />
                    </span>
                    <span className="d02-mono text-[12.5px] text-white/70">{m.context}</span>
                  </span>
                  <span className="hidden flex-wrap gap-1.5 md:flex">
                    {m.variants.map((v) => (
                      <span key={v} className={`d02-mono rounded-[3px] border px-1.5 py-0.5 text-[10.5px] ${v === "Abliterated" ? "border-[var(--blue)]/60 text-[var(--blue)]" : "border-white/15 text-white/55"}`}>
                        {v.toLowerCase()}
                      </span>
                    ))}
                  </span>
                  <span className="d02-mono hidden text-right text-[12.5px] text-white/70 md:block">
                    ${m.inPrice} / ${m.outPrice}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                      <div className="grid gap-6 pb-8 md:grid-cols-[1.2fr_2fr]">
                        <p className="text-[15px] leading-relaxed text-[var(--paper)]/65">{m.blurb}</p>
                        <pre className="d02-mono overflow-x-auto rounded-[4px] bg-[var(--panel)] p-4 text-[12px] leading-[1.8] text-white/75">
                          {m.variants
                            .map((v) => `model: "${m.id}-${m.context.toLowerCase()}${v === "Standard" ? "" : ":" + v.toLowerCase()}"`)
                            .join("\n")}
                          {`\n// cached input  $${m.cached} / 1M (sample)`}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ——— drop-in API on a misty plate ——— */

function DropIn() {
  const [tab, setTab] = useState<"ts" | "python" | "curl">("ts");
  const { copied, copy } = useCopy();
  return (
    <section id="api" className="border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow>Drop-in</Eyebrow>
          <h2 className="d02-head mt-5 text-[clamp(44px,5.6vw,84px)] leading-[0.95]">
            Change one
            <br />
            line.
          </h2>
          <p className="mt-6 max-w-[38ch] text-[16px] leading-relaxed text-[var(--paper)]/60">
            Point the client you already use at {BRAND.name}. Streaming, tool calls and prompt caching work the same way.
          </p>
          <div className="mt-8">
            <Btn light href="#start">
              Get an API key
            </Btn>
          </div>
        </div>
        <div className="d02-plate relative overflow-hidden rounded-[6px] p-5 sm:p-10">
          <div className="d02-grain pointer-events-none absolute inset-0 opacity-40" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease }}
            className="relative mx-auto max-w-[620px]"
          >
            <div className="mb-2 inline-flex gap-1 rounded-[5px] bg-black/40 p-1 backdrop-blur">
              {(["ts", "python", "curl"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`d02-mono relative rounded-[3px] px-3 py-1 text-[11.5px] ${tab === t ? "text-black" : "text-white/70"}`}>
                  {tab === t && <motion.span layoutId="d02-drop" className="absolute inset-0 rounded-[3px] bg-[var(--paper)]" />}
                  <span className="relative">{t === "ts" ? "TypeScript" : t === "python" ? "Python" : "cURL"}</span>
                </button>
              ))}
            </div>
            <div className="relative rounded-[6px] border border-white/10 bg-[#0d0d0c]/85 p-5 backdrop-blur-xl">
              <button onClick={() => copy(CODE[tab])} aria-label="Copy code" className="absolute right-3 top-3 rounded p-1.5 text-white/40 hover:text-white">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
              <pre className="d02-mono overflow-x-auto text-[12.5px] leading-[1.8] text-white/80">
                {CODE[tab].split("\n").map((l, k) => (
                  <div key={k}>
                    {l.includes(BRAND.apiBase) || l.includes(BRAND.envKey) ? <span className="rounded-sm bg-[var(--sand)]/25 text-[var(--paper)]">{l}</span> : l || " "}
                  </div>
                ))}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ——— pricing ——— */

function Pricing() {
  return (
    <section id="pricing" className="border-t border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 md:py-32">
        <div className="grid items-end gap-10 md:grid-cols-[auto_1fr]">
          <div className="d02-head text-[clamp(160px,22vw,320px)] leading-[0.75] tracking-[-0.06em] text-[var(--paper)]">1</div>
          <div className="pb-4">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="d02-head mt-4 text-[clamp(32px,3.6vw,52px)] leading-[1.02]">
              key. Every model.
              <br />
              <span className="text-[var(--paper)]/40">Billed per token.</span>
            </h2>
          </div>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-[6px] border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`flex flex-col p-8 ${p.featured ? "bg-[var(--panel)]" : "bg-[var(--bg)]"}`}>
              <div className="flex items-center justify-between">
                <span className="d02-mono text-[12px] uppercase tracking-[0.16em] text-white/60">{p.name}</span>
                {p.featured && <span className="d02-mono rounded-[3px] bg-[var(--blue)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-white">Most flexible</span>}
              </div>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="d02-head text-[44px] leading-none">{p.price}</span>
                <span className="text-[14px] text-white/45">{p.cadence}</span>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-white/55">{p.body}</p>
              <ul className="mt-8 flex-1 space-y-2.5 text-[14px] text-white/75">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="h-px w-3 bg-[var(--sand)]" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="d02-mono mt-4 text-[11px] text-white/35">{PRICE_NOTE}</p>
      </div>
    </section>
  );
}

/* ——— page ——— */

export default function Design02() {
  return (
    <div className="d02 min-h-screen bg-[var(--bg)] text-[var(--paper)]">
      <div className="d02-mono border-b border-[var(--line)] bg-[#141413] py-2 text-center text-[11.5px] text-white/55">
        Design concept · <span className="text-[var(--paper)]">Abliterated variants</span> shown side by side with standard models
      </div>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-5 py-4 sm:px-8">
          <a href="#" className="d02-head flex items-center gap-2 text-[21px] tracking-[-0.04em]">
            <span className="d02-mono text-[13px] text-[var(--sand)]">{"//"}</span>
            {BRAND.name.toLowerCase()}
          </a>
          <nav aria-label="Primary" className="d02-mono ml-auto hidden gap-7 text-[11.5px] uppercase tracking-[0.14em] text-white/60 lg:flex">
            {[
              ["Platform", "#platform"],
              ["Playground", "#playground"],
              ["Models", "#models"],
              ["API", "#api"],
              ["Pricing", "#pricing"],
              ["Docs", "#"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-white">
                {l}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 lg:ml-6">
            <a href="#" className="d02-mono hidden text-[11.5px] uppercase tracking-[0.14em] text-white/60 hover:text-white sm:block">
              Log in
            </a>
            <a href="#start" className="d02-mono rounded-[3px] border border-[var(--paper)]/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] hover:bg-[var(--paper)] hover:text-[var(--bg)]">
              API key
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[calc(100svh-90px)] overflow-hidden">
          <GlyphField />
          <div className="relative mx-auto flex min-h-[calc(100svh-90px)] max-w-[1280px] flex-col justify-center px-5 py-20 sm:px-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="d02-mono inline-flex w-fit items-center gap-2 rounded-[3px] border border-[var(--line)] bg-[var(--bg)]/70 px-3 py-1.5 text-[11.5px] text-white/70 backdrop-blur">
              <Terminal size={12} /> Models, chat, agents & API — one platform
            </motion.div>
            <h1 className="d02-head mt-8 text-[clamp(52px,8.6vw,132px)] leading-[0.9] tracking-[-0.055em]">
              <motion.span className="block" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, ease, delay: 0.1 }}>
                Intelligence
              </motion.span>
              <motion.span className="block md:pl-[12%]" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, ease, delay: 0.2 }}>
                without the
              </motion.span>
              <motion.span className="block text-right text-[var(--paper)]/45" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, ease, delay: 0.35 }}>
                second-guessing.
              </motion.span>
            </h1>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <p className="max-w-[44ch] text-[17px] leading-relaxed text-[var(--paper)]/65">
                Standard, low-refusal and abliterated models behind one API and one chat. You choose how much the model pushes back.
              </p>
              <div className="flex flex-wrap gap-3">
                <Btn light>Get an API key</Btn>
                <Btn href="#playground">Open playground</Btn>
              </div>
            </motion.div>
          </div>
          <div className="d02-mono absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] text-white/35 md:flex">
            Move your cursor <ArrowRight size={11} />
          </div>
        </section>

        <Capabilities />
        <Playground />
        <Registry />
        <DropIn />
        <Pricing />

        <section id="start" className="relative overflow-hidden border-t border-[var(--line)]">
          <GlyphField mask="center" cell={22} />
          <div className="relative mx-auto flex max-w-[1280px] flex-col items-center px-5 py-36 text-center sm:px-8 md:py-48">
            <Eyebrow>Start</Eyebrow>
            <h2 className="d02-head mt-6 text-[clamp(48px,7vw,104px)] leading-[0.92] tracking-[-0.05em]">
              Your models.
              <br />
              Your rules.
            </h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Btn light>Request access</Btn>
              <Btn href="#">Read the docs</Btn>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden border-t border-[var(--line)]">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 pb-10 pt-16 sm:px-8 md:grid-cols-5">
          <p className="d02-mono text-[12px] leading-relaxed text-white/45 md:col-span-2">
            {MOCK_NOTE}.<br />
            © {BRAND.name} (placeholder brand)
          </p>
          {[
            ["Product", ["Chat", "Agents", "Compare", "Changelog"]],
            ["Developers", ["Docs", "API reference", "SDKs", "Status"]],
            ["Company", ["About", "Usage policy", "Contact"]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <div className="d02-mono text-[10.5px] uppercase tracking-[0.18em] text-white/35">{h as string}</div>
              <ul className="mt-4 space-y-2 text-[14px] text-white/65">
                {(items as string[]).map((x) => (
                  <li key={x}>
                    <a href="#" className="hover:text-white">{x}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div aria-hidden className="d02-head d02-outline -mb-[0.24em] select-none text-center text-[26vw] leading-none tracking-[-0.07em]">
          {BRAND.name.toLowerCase()}
        </div>
      </footer>
    </div>
  );
}
