"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, ChevronDown, Copy, CornerDownLeft, Database, GitBranch, Key, Layers, Scale, Sparkles, Terminal, Zap } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS, type Variant } from "@/lib/content";
import { useCopy, useStream } from "@/lib/hooks";

const ease = [0.16, 1, 0.3, 1] as const;

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return null;
}

export function Btn({ children, light = false, href = "#start" }: { children: React.ReactNode; light?: boolean; href?: string }) {
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

export const CAP_ICONS = [Layers, Sparkles, GitBranch, Key, Database, Zap, Scale, CornerDownLeft];
export const CAP_SPEC: Record<string, string> = {
  chat: `thread.switch({ model: "unbound-128k" })\n// history and attachments carry over`,
  variants: `model: "core-128k"            // standard\nmodel: "core-128k:low-refusal"\nmodel: "swift-32k:abliterated"`,
  agents: `agent.run({\n  repo: "./",\n  task: "fix failing auth tests",\n  tools: ["fs", "shell", "git"],\n})`,
  api: `POST ${BRAND.apiBase}/chat/completions\nPOST ${BRAND.apiBase}/messages`,
  context: `atlas-1m  ▕████████████████████▏ 1,000K\nforge-256k ▕█████▏ 256K\ncore-128k  ▕██▏ 128K`,
  cache: `cache_control: { type: "prefix" }\n// repeated prefixes billed at the cached rate`,
  pricing: `usage: {\n  input: 18240, cached: 16000,\n  output: 912, cost_usd: "shown per request"\n}`,
  discover: `compare.run({\n  prompt, models: ["core", "unbound", "forge"]\n})`,
};

export function Capabilities() {
  const [i, setI] = useState(0);
  const c = CAPABILITIES[i];
  const Icon = CAP_ICONS[i];
  return (
    <section data-section id="platform" className="sys-section relative border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 md:grid-cols-[280px_1fr]">
        <div>
          <Eyebrow>Platform</Eyebrow>
          <h2 className="d02-head mt-5 text-[32px] leading-[1.02] sm:text-[40px]">Read it like documentation.</h2>
          <nav aria-label="Capabilities" className="mt-10 flex gap-1 overflow-x-auto pb-2 no-scrollbar md:flex-col md:overflow-visible">
            {CAPABILITIES.map((x, k) => (
              <button
                key={x.key}
                onClick={() => setI(k)}
                className={`d02-mono relative shrink-0 whitespace-nowrap rounded-[3px] px-3 py-2 text-left text-[12.5px] transition ${
                  k === i ? "bg-[var(--panel)] text-[var(--paper)]" : "text-[var(--text-muted)] hover:text-[var(--paper)]/80"
                }`}
              >
                {k === i && <motion.span layoutId="d02-cap" className="absolute inset-y-1 left-0 w-[2px] bg-[var(--blue)]" />}
                <span className="mr-2 text-[var(--text-muted)]">{String(k + 1).padStart(2, "0")}</span>
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
                <div className="mb-4 flex items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
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

export function Playground() {
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
    <section data-section id="playground" className="sys-section relative overflow-hidden border-t border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Playground</Eyebrow>
            <h2 className="d02-head mt-5 max-w-[14ch] text-[clamp(40px,5.4vw,76px)] leading-[0.98]">Change the model. Keep the request.</h2>
          </div>
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-[var(--text-muted)]">
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
                  className={`rounded-[3px] px-2.5 py-1 text-[11.5px] ${k === pi ? "bg-white/10 text-white" : "text-[var(--text-muted)] hover:text-white/70"}`}
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
              <span className="text-[var(--text-muted)]">{"// request"}</span>
              {"\n"}
              <span className="text-[var(--text-muted)]">{"{"}</span>
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
              <span className="text-[var(--text-muted)]">{"}"}</span>
            </pre>
            <div className="flex min-h-[280px] flex-col p-6">
              <div className="d02-mono flex items-center gap-3 text-[11px] text-[var(--text-muted)]">
                <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-emerald-400" : "animate-pulse bg-[var(--blue)]"}`} />
                {done ? "complete" : "streaming"} · {tokens} tokens · simulated
              </div>
              <p className="mt-5 flex-1 text-[17px] leading-relaxed text-[var(--paper)]/90">
                {out}
                {!done && <span className="d02-caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-[var(--blue)]" />}
              </p>
              <button onClick={() => setRun((r) => r + 1)} className="d02-mono mt-6 self-start text-[11.5px] uppercase tracking-[0.14em] text-[var(--text-muted)] hover:text-white">
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

export function Registry() {
  const [open, setOpen] = useState<string | null>("unbound");
  return (
    <section data-section id="models" className="sys-section border-t border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Eyebrow>Model registry</Eyebrow>
            <h2 className="d02-head mt-5 text-[clamp(40px,5.4vw,76px)] leading-[0.98]">Five families. One namespace.</h2>
          </div>
          <p className="self-end text-[15px] leading-relaxed text-[var(--text-muted)] md:justify-self-end md:text-right">
            {MOCK_NOTE}.<br />Names, context sizes and rates are placeholders.
          </p>
        </div>
        <div className="mt-14 border-t border-[var(--line)]">
          <div className="d02-mono hidden grid-cols-[1.2fr_1.4fr_1fr_1.6fr_1fr_24px] gap-4 py-3 text-[10.5px] uppercase tracking-[0.16em] text-[var(--text-muted)] md:grid">
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
                  <ChevronDown size={16} className={`justify-self-end text-[var(--text-muted)] transition md:order-last ${isOpen ? "rotate-180" : ""}`} />
                  <span className="text-[14px] text-[var(--paper)]/60">{m.role}</span>
                  <span className="hidden items-center gap-3 md:flex">
                    <span className="h-[3px] w-16 overflow-hidden rounded-full bg-white/10">
                      <span className="block h-full bg-[var(--sand)]" style={{ width: `${Math.max(6, (Math.log10(m.contextK) / 3) * 100)}%` }} />
                    </span>
                    <span className="d02-mono text-[12.5px] text-white/70">{m.context}</span>
                  </span>
                  <span className="hidden flex-wrap gap-1.5 md:flex">
                    {m.variants.map((v) => (
                      <span key={v} className={`d02-mono rounded-[3px] border px-1.5 py-0.5 text-[10.5px] ${v === "Abliterated" ? "border-white/40 text-[var(--paper)]" : "border-white/15 text-[var(--text-muted)]"}`}>
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

export function DropIn() {
  const [tab, setTab] = useState<"ts" | "python" | "curl">("ts");
  const { copied, copy } = useCopy();
  return (
    <section data-section id="api" className="sys-section border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
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
              <button onClick={() => copy(CODE[tab])} aria-label="Copy code" className="absolute right-3 top-3 rounded p-1.5 text-[var(--text-muted)] hover:text-white">
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

export function Pricing() {
  return (
    <section data-section id="pricing" className="sys-section border-t border-[var(--line)]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid items-end gap-10 md:grid-cols-[auto_1fr]">
          <div className="d02-head text-[clamp(160px,22vw,320px)] leading-[0.75] tracking-[-0.06em] text-[var(--paper)]">1</div>
          <div className="pb-4">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="d02-head mt-4 text-[clamp(32px,3.6vw,52px)] leading-[1.02]">
              key. Every model.
              <br />
              <span className="text-[var(--text-muted)]">Billed per token.</span>
            </h2>
          </div>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden rounded-[6px] border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`flex flex-col p-8 ${p.featured ? "bg-[var(--panel)]" : "bg-[var(--bg)]"}`}>
              <div className="flex items-center justify-between">
                <span className="d02-mono text-[12px] uppercase tracking-[0.16em] text-white/60">{p.name}</span>
                {p.featured && <span className="d02-mono rounded-[3px] bg-[var(--blue)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--accent-ink)]">Most flexible</span>}
              </div>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="d02-head text-[44px] leading-none">{p.price}</span>
                <span className="text-[14px] text-[var(--text-muted)]">{p.cadence}</span>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--text-muted)]">{p.body}</p>
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
        <p className="d02-mono mt-4 text-[11px] text-[var(--text-muted)]">{PRICE_NOTE}</p>
      </div>
    </section>
  );
}

/* ——— page ——— */
