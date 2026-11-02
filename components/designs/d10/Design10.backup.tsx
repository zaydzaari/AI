"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUp, Check, Command, Copy, CornerDownLeft, Cpu, Database, Gauge, Search, Sparkles, Zap } from "lucide-react";
import { BRAND, CAPABILITIES, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS, estimateCost, fmtUSD, type Model, type Variant } from "@/lib/content";
import { useCopy, useStream } from "@/lib/hooks";

const spring = { type: "spring", stiffness: 380, damping: 34 } as const;

/** Picks a model from what the user is typing — the "contextual selector". */
function suggest(text: string): { id: string; why: string } {
  const t = text.toLowerCase();
  if (/(code|bug|refactor|test|function|repo|typescript|python)/.test(t)) return { id: "forge", why: "looks like code" };
  if (/(pdf|files|document|contract|book|archive|long|repo-wide|all \d+)/.test(t)) return { id: "atlas", why: "large inputs" };
  if (/(villain|dark|uncensored|no filter|graphic|red.?team|edgy)/.test(t)) return { id: "unbound", why: "fewer refusals" };
  if (/(quick|short|tl;?dr|one line|classify|extract)/.test(t)) return { id: "swift", why: "short & fast" };
  return { id: "core", why: "general purpose" };
}

type Msg = { role: "user" | "ai"; text: string; model: string; variant: Variant };

function AiText({ text, id }: { text: string; id: number }) {
  const { out, done } = useStream(text, id, 30);
  return (
    <>
      {out}
      {!done && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[var(--blue)]" />}
    </>
  );
}

function Console() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [manual, setManual] = useState<string | null>(null);
  const [variant, setVariant] = useState<Variant>("Standard");
  const [focus, setFocus] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const sug = suggest(input || msgs.filter((m) => m.role === "user").slice(-1)[0]?.text || "");
  const modelId = manual ?? sug.id;
  const model = MODELS.find((m) => m.id === modelId)!;
  const v = model.variants.includes(variant) ? variant : model.variants[0];

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const ex = PROMPTS.find((p) => p.prompt === t);
    const reply = ex
      ? ex.response
      : `Design preview — live inference isn't connected yet. In the real product, ${model.family} (${v.toLowerCase()}) would answer "${t.slice(0, 60)}${t.length > 60 ? "…" : ""}" right here, streaming token by token.`;
    setMsgs((m) => [...m, { role: "user", text: t, model: model.id, variant: v }, { role: "ai", text: reply, model: model.id, variant: v }]);
    setInput("");
  };

  const tokens = msgs.reduce((a, m) => a + Math.round(m.text.length / 3.6), 0) + 900;
  const cached = Math.max(0, tokens - 600);
  const cost = estimateCost(model, tokens, 180, tokens ? cached / tokens : 0);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
      <motion.div layout className={`flex flex-col overflow-hidden rounded-[22px] bg-white ring-1 transition-shadow ${focus ? "shadow-[0_30px_80px_-30px_rgba(61,90,254,.45)] ring-[var(--blue)]/40" : "shadow-[0_30px_80px_-40px_rgba(0,0,0,.25)] ring-black/10"}`}>
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--green)]" />
          </span>
          <span className="d10-mono text-[12px] text-black/50">{BRAND.name.toLowerCase()} · console</span>
          <LayoutGroup id="d10-models">
            <div className="ml-auto flex gap-1 overflow-x-auto no-scrollbar">
              {MODELS.map((m) => (
                <button key={m.id} onClick={() => setManual(manual === m.id ? null : m.id)} className={`relative shrink-0 rounded-full px-3 py-1 text-[12.5px] transition ${modelId === m.id ? "text-white" : "text-black/55 hover:text-black"}`}>
                  {modelId === m.id && <motion.span layoutId="d10-pill" transition={spring} className="absolute inset-0 rounded-full bg-[var(--ink)]" />}
                  <span className="relative">{m.name}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <div ref={scroller} className="flex h-[300px] flex-col gap-3 overflow-y-auto px-5 py-5 sm:h-[340px]">
          {msgs.length === 0 ? (
            <div className="m-auto max-w-[420px] text-center">
              <Sparkles className="mx-auto text-[var(--blue)]" size={22} />
              <p className="mt-3 text-[15px] text-black/60">Type anything. The model selector reacts to what you write. Try one of these:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {PROMPTS.map((p) => (
                  <button key={p.label} onClick={() => send(p.prompt)} className="rounded-full bg-[var(--bg)] px-3 py-1.5 text-[13px] ring-1 ring-black/10 hover:ring-[var(--blue)]">
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring} className={m.role === "user" ? "ml-auto max-w-[80%]" : "max-w-[88%]"}>
                {m.role === "ai" && (
                  <div className="d10-mono mb-1 text-[11px] text-black/40">
                    {MODELS.find((x) => x.id === m.model)?.name} · {m.variant.toLowerCase()} · simulated
                  </div>
                )}
                <div className={`rounded-[18px] px-4 py-2.5 text-[15px] leading-relaxed ${m.role === "user" ? "rounded-br-md bg-[var(--ink)] text-white" : "rounded-bl-md bg-[var(--bg)]"}`}>
                  {m.role === "ai" && i === msgs.length - 1 ? <AiText text={m.text} id={i} /> : m.text}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-black/[0.06] p-3"
        >
          <div className="flex items-end gap-2 rounded-[16px] bg-[var(--bg)] p-2 pl-4">
            <label htmlFor="d10-in" className="sr-only">Message</label>
            <textarea
              id="d10-in"
              rows={1}
              value={input}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything, or try “refactor my fetch code”…"
              className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[15px] outline-none placeholder:text-black/35"
            />
            <button aria-label="Send" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--blue)] text-white disabled:opacity-30" disabled={!input.trim()}>
              <ArrowUp size={17} />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 px-1 text-[12px]">
            <AnimatePresence mode="popLayout">
              <motion.span key={modelId + (manual ? "m" : "a")} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="d10-mono flex items-center gap-1.5 rounded-full bg-[var(--blue)]/10 px-2.5 py-1 text-[var(--blue)]">
                <Zap size={11} /> {manual ? `${model.name} (pinned)` : `${model.name} — ${sug.why}`}
              </motion.span>
            </AnimatePresence>
            <div className="ml-auto flex gap-1">
              {model.variants.map((x) => (
                <button key={x} type="button" onClick={() => setVariant(x)} className={`rounded-full px-2.5 py-1 ring-1 ${v === x ? "bg-[var(--ink)] text-white ring-[var(--ink)]" : "ring-black/10 hover:ring-black/30"}`}>
                  {x}
                </button>
              ))}
            </div>
          </div>
        </form>
      </motion.div>

      {/* live side panels */}
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
        <Panel icon={Gauge} label="Context used">
          <div className="text-[22px] font-semibold tabular-nums">{tokens.toLocaleString()}</div>
          <div className="mt-2 h-1.5 rounded-full bg-black/[0.06]">
            <motion.div className="h-full rounded-full bg-[var(--blue)]" animate={{ width: `${Math.min(100, (tokens / (model.contextK * 1000)) * 100 * 40)}%` }} transition={spring} />
          </div>
          <div className="d10-mono mt-1 text-[10.5px] text-black/40">of {model.context}</div>
        </Panel>
        <Panel icon={Database} label="Cached prefix">
          <div className="text-[22px] font-semibold tabular-nums">{cached.toLocaleString()}</div>
          <div className="d10-mono mt-1 text-[10.5px] text-black/40">tokens reused (est.)</div>
        </Panel>
        <Panel icon={Cpu} label="Next turn cost">
          <div className="text-[22px] font-semibold tabular-nums">{fmtUSD(cost)}</div>
          <div className="d10-mono mt-1 text-[10.5px] text-black/40">sample rates</div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ icon: Icon, label, children }: { icon: typeof Gauge; label: string; children: React.ReactNode }) {
  return (
    <motion.div layout className="rounded-[18px] bg-white p-4 ring-1 ring-black/10">
      <div className="flex items-center gap-1.5 text-[12px] text-black/50">
        <Icon size={13} /> <span className="truncate">{label}</span>
      </div>
      <div className="mt-2">{children}</div>
    </motion.div>
  );
}

/* ——— ⌘K palette ——— */
function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const items = useMemo(
    () => [
      { l: "Go to models", h: "#models" },
      { l: "Open API builder", h: "#api" },
      { l: "See pricing", h: "#pricing" },
      { l: "Try the console", h: "#top" },
      ...MODELS.map((m) => ({ l: `Read about ${m.family}`, h: "#models" })),
    ],
    []
  );
  const list = items.filter((i) => i.l.toLowerCase().includes(q.toLowerCase()));
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [q]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-start bg-black/20 px-4 pt-[14vh] backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ y: -10, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: -10, scale: 0.97 }} transition={spring} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette" className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[18px] bg-white shadow-2xl ring-1 ring-black/10">
            <div className="flex items-center gap-2 border-b border-black/[0.06] px-4">
              <Search size={16} className="text-black/40" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") setIdx((i) => Math.min(list.length - 1, i + 1));
                  if (e.key === "ArrowUp") setIdx((i) => Math.max(0, i - 1));
                  if (e.key === "Escape") onClose();
                  if (e.key === "Enter" && list[idx]) {
                    window.location.hash = list[idx].h;
                    onClose();
                  }
                }}
                placeholder="Search actions…"
                aria-label="Search actions"
                className="h-12 flex-1 bg-transparent text-[15px] outline-none"
              />
              <kbd className="d10-mono rounded bg-black/5 px-1.5 text-[11px] text-black/50">esc</kbd>
            </div>
            <ul className="max-h-[300px] overflow-y-auto p-2">
              {list.map((i, k) => (
                <li key={i.l}>
                  <a href={i.h} onClick={onClose} onMouseEnter={() => setIdx(k)} className={`flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[14px] ${k === idx ? "bg-[var(--bg)]" : ""}`}>
                    {i.l}
                    {k === idx && <CornerDownLeft size={14} className="text-black/40" />}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ——— live capability widgets ——— */
function Widgets() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1600);
    return () => clearInterval(i);
  }, []);
  const vs: Variant[] = ["Standard", "Low-refusal", "Abliterated"];
  const agentSteps = ["reading src/", "planning edit", "editing 2 files", "running tests", "✓ tests pass"];
  return (
    <div className="grid gap-3 md:grid-cols-6">
      <W className="md:col-span-2" t={CAPABILITIES[1].title} b={CAPABILITIES[1].body}>
        <div className="flex gap-1 rounded-full bg-[var(--bg)] p-1">
          {vs.map((v, i) => (
            <span key={v} className="relative flex-1 rounded-full py-1.5 text-center text-[12px]">
              {tick % 3 === i && <motion.span layoutId="d10-w-var" transition={spring} className="absolute inset-0 rounded-full bg-[var(--ink)]" />}
              <span className={`relative ${tick % 3 === i ? "text-white" : "text-black/50"}`}>{v}</span>
            </span>
          ))}
        </div>
      </W>
      <W className="md:col-span-2" t={CAPABILITIES[2].title} b={CAPABILITIES[2].body}>
        <div className="d10-mono space-y-1 text-[12px]">
          {agentSteps.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 transition-opacity ${i <= tick % 6 ? "opacity-100" : "opacity-20"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${i === 4 && tick % 6 >= 4 ? "bg-[var(--green)]" : "bg-[var(--blue)]"}`} /> {s}
            </div>
          ))}
        </div>
      </W>
      <W className="md:col-span-2" t={CAPABILITIES[5].title} b={CAPABILITIES[5].body}>
        <div className="flex h-6 overflow-hidden rounded-full bg-black/[0.06]">
          <motion.div className="bg-[var(--green)]" animate={{ width: `${50 + (tick % 4) * 10}%` }} transition={spring} />
          <div className="flex-1" />
        </div>
        <div className="d10-mono mt-1.5 flex justify-between text-[11px] text-black/45">
          <span>cached</span>
          <span>new</span>
        </div>
      </W>
      <W className="md:col-span-3" t={CAPABILITIES[0].title} b={CAPABILITIES[0].body}>
        <div className="flex flex-wrap gap-1.5">
          {MODELS.map((m, i) => (
            <span key={m.id} className={`rounded-full px-3 py-1 text-[12.5px] ring-1 transition ${tick % 5 === i ? "bg-[var(--blue)] text-white ring-[var(--blue)]" : "ring-black/10"}`}>
              {m.name}
            </span>
          ))}
        </div>
      </W>
      <W className="md:col-span-3" t={CAPABILITIES[7].title} b={CAPABILITIES[7].body}>
        <div className="space-y-1.5">
          {["Core", "Unbound", "Swift"].map((n, i) => (
            <div key={n} className="flex items-center gap-2 text-[12px]">
              <span className="w-14">{n}</span>
              <motion.div className="h-2 rounded-full bg-[var(--ink)]" animate={{ width: `${30 + (((tick + i * 2) % 5) * 14)}%` }} transition={spring} />
            </div>
          ))}
        </div>
      </W>
    </div>
  );
}

function W({ t, b, children, className = "" }: { t: string; b: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={spring} className={`flex flex-col justify-between gap-6 rounded-[22px] bg-white p-6 ring-1 ring-black/10 ${className}`}>
      <div>{children}</div>
      <div>
        <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{t}</h3>
        <p className="mt-1 text-[14px] text-black/55">{b}</p>
      </div>
    </motion.div>
  );
}

/* ——— API request builder ——— */
function Builder() {
  const [m, setM] = useState<Model>(MODELS[2]);
  const [v, setV] = useState<Variant>("Standard");
  const [stream, setStream] = useState(true);
  const [cache, setCache] = useState(true);
  const { copied, copy } = useCopy();
  const vv = m.variants.includes(v) ? v : m.variants[0];
  const id = `${m.id}-${m.context.toLowerCase()}${vv === "Standard" ? "" : ":" + vv.toLowerCase()}`;
  const code = `curl ${BRAND.apiBase}/chat/completions \\
  -H "Authorization: Bearer $${BRAND.envKey}" \\
  -d '{
    "model": "${id}",${stream ? `\n    "stream": true,` : ""}${cache ? `\n    "cache": { "prefix": true },` : ""}
    "messages": [{ "role": "user", "content": "Hello" }]
  }'`;
  return (
    <div className="grid overflow-hidden rounded-[22px] bg-white ring-1 ring-black/10 lg:grid-cols-[320px_1fr]">
      <div className="space-y-5 border-b border-black/[0.06] p-6 lg:border-b-0 lg:border-r">
        <div>
          <div className="text-[12px] text-black/50">Model</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {MODELS.map((x) => (
              <button key={x.id} onClick={() => setM(x)} className={`rounded-full px-3 py-1 text-[13px] ring-1 ${m.id === x.id ? "bg-[var(--ink)] text-white ring-[var(--ink)]" : "ring-black/10"}`}>
                {x.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[12px] text-black/50">Variant</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(["Standard", "Low-refusal", "Abliterated"] as Variant[]).map((x) => (
              <button key={x} disabled={!m.variants.includes(x)} onClick={() => setV(x)} className={`rounded-full px-3 py-1 text-[13px] ring-1 disabled:opacity-30 ${vv === x ? "bg-[var(--ink)] text-white ring-[var(--ink)]" : "ring-black/10"}`}>
                {x}
              </button>
            ))}
          </div>
        </div>
        {(
          [
            ["Stream tokens", stream, setStream],
            ["Prompt caching", cache, setCache],
          ] as const
        ).map(([l, val, set]) => (
          <label key={l} className="flex cursor-pointer items-center justify-between text-[14px]">
            {l}
            <button role="switch" aria-checked={val} onClick={() => set(!val)} className={`relative h-6 w-10 rounded-full transition ${val ? "bg-[var(--green)]" : "bg-black/15"}`}>
              <motion.span layout transition={spring} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${val ? "right-0.5" : "left-0.5"}`} />
            </button>
          </label>
        ))}
      </div>
      <div className="relative bg-[var(--ink)]">
        <button onClick={() => copy(code)} className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/80 hover:bg-white/20">
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
        </button>
        <pre className="d10-mono overflow-x-auto p-6 pt-12 text-[13px] leading-[1.8] text-white/85">
          {code.split(id).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <motion.span key={id} initial={{ backgroundColor: "rgba(61,90,254,.7)" }} animate={{ backgroundColor: "rgba(61,90,254,0)" }} transition={{ duration: 1 }} className="rounded text-[#9fb0ff]">
                  {id}
                </motion.span>
              )}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

export default function Design10() {
  const [pal, setPal] = useState(false);
  const [sel, setSel] = useState(0);
  const [usage, setUsage] = useState(40);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPal((p) => !p);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const plan = usage < 25 ? 0 : usage < 150 ? 1 : 2;
  const m = MODELS[sel];

  return (
    <div id="top" className="d10 min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <Palette open={pal} onClose={() => setPal(false)} />
      <header className="sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-5 py-3 sm:px-8">
          <a href="#" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em]">
            <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-[var(--ink)] text-white">
              <Sparkles size={14} />
            </span>
            {BRAND.name}
          </a>
          <button onClick={() => setPal(true)} className="ml-4 hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] text-black/50 ring-1 ring-black/10 hover:ring-black/25 md:flex">
            <Search size={13} /> Search or jump to…
            <kbd className="d10-mono ml-6 flex items-center gap-0.5 rounded bg-black/5 px-1.5 text-[11px]">
              <Command size={10} />K
            </kbd>
          </button>
          <nav aria-label="Primary" className="ml-auto hidden gap-5 text-[14px] text-black/65 lg:flex">
            {[
              ["Models", "#models"],
              ["API", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-black">
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="ml-auto rounded-full bg-[var(--ink)] px-4 py-2 text-[13.5px] font-medium text-white lg:ml-2">
            Sign up
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-10 sm:px-8 md:pt-14">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="max-w-[16ch] text-[clamp(40px,5.6vw,76px)] font-semibold leading-[0.98] tracking-[-0.045em]">
              Your AI. <span className="text-black/35">Already running.</span>
            </motion.h1>
            <p className="max-w-[40ch] text-[16px] text-black/60">This page is the product. Type below, switch models, pin a variant — or press <kbd className="d10-mono rounded bg-white px-1 ring-1 ring-black/10">⌘K</kbd>.</p>
          </div>
          <Console />
        </section>

        <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <h2 className="mb-8 text-[clamp(32px,3.6vw,48px)] font-semibold tracking-[-0.04em]">Everything moves. Because it works.</h2>
          <Widgets />
        </section>

        <section id="models" className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <h2 className="mb-8 text-[clamp(32px,3.6vw,48px)] font-semibold tracking-[-0.04em]">Pick a model. Watch it change.</h2>
          <LayoutGroup id="d10-sel">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {MODELS.map((x, i) => (
                <button key={x.id} onClick={() => setSel(i)} className={`relative shrink-0 rounded-[16px] px-5 py-3 text-left ${sel === i ? "text-white" : "bg-white ring-1 ring-black/10"}`}>
                  {sel === i && <motion.span layoutId="d10-msel" transition={spring} className="absolute inset-0 rounded-[16px] bg-[var(--ink)]" />}
                  <span className="relative block text-[16px] font-semibold">{x.name}</span>
                  <span className={`relative block text-[12px] ${sel === i ? "text-white/60" : "text-black/45"}`}>{x.role}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <motion.div layout transition={spring} className="mt-3 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
            <AnimatePresence mode="popLayout">
              <motion.div key={m.id + "a"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring} className="rounded-[22px] bg-white p-7 ring-1 ring-black/10">
                <div className="text-[13px] text-black/45">{m.family}</div>
                <div className="mt-2 text-[44px] font-semibold leading-none tracking-[-0.04em]">{m.name}</div>
                <p className="mt-4 text-[16px] text-black/65">{m.blurb}</p>
              </motion.div>
              <motion.div key={m.id + "b"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { ...spring, delay: 0.05 } }} exit={{ opacity: 0 }} className="rounded-[22px] bg-white p-7 ring-1 ring-black/10">
                <div className="text-[13px] text-black/45">Context</div>
                <div className="mt-2 text-[44px] font-semibold leading-none tracking-[-0.04em]">{m.context}</div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {m.variants.map((v) => (
                    <span key={v} className="rounded-full bg-[var(--bg)] px-2.5 py-1 text-[12px]">{v}</span>
                  ))}
                </div>
              </motion.div>
              <motion.div key={m.id + "c"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { ...spring, delay: 0.1 } }} exit={{ opacity: 0 }} className="rounded-[22px] bg-[var(--ink)] p-7 text-white">
                <div className="text-[13px] text-white/50">Per 1M tokens (sample)</div>
                <div className="d10-mono mt-3 space-y-1 text-[15px]">
                  <div className="flex justify-between"><span className="text-white/60">input</span>${m.inPrice}</div>
                  <div className="flex justify-between"><span className="text-white/60">cached</span>${m.cached}</div>
                  <div className="flex justify-between"><span className="text-white/60">output</span>${m.outPrice}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <p className="d10-mono mt-3 text-[11px] text-black/40">{MOCK_NOTE}</p>
        </section>

        <section id="api" className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <h2 className="mb-8 text-[clamp(32px,3.6vw,48px)] font-semibold tracking-[-0.04em]">Build the request. Copy it. Ship.</h2>
          <Builder />
        </section>

        <section id="pricing" className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8">
          <h2 className="mb-3 text-[clamp(32px,3.6vw,48px)] font-semibold tracking-[-0.04em]">Tell us how you&apos;ll use it.</h2>
          <label htmlFor="d10-usage" className="flex flex-wrap items-baseline gap-2 text-[16px] text-black/60">
            About <span className="text-[28px] font-semibold tabular-nums text-[var(--ink)]">{usage}</span> messages a day
          </label>
          <input id="d10-usage" type="range" min={5} max={400} value={usage} onChange={(e) => setUsage(+e.target.value)} className="d10-range mt-4 w-full max-w-[560px]" />
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {PLANS.map((p, i) => (
              <motion.div key={p.name} animate={{ scale: plan === i ? 1 : 0.97, opacity: plan === i ? 1 : 0.55 }} transition={spring} className={`rounded-[22px] p-7 ${plan === i ? "bg-white shadow-[0_30px_60px_-30px_rgba(61,90,254,.5)] ring-2 ring-[var(--blue)]" : "bg-white ring-1 ring-black/10"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-semibold">{p.name}</span>
                  {plan === i && <span className="rounded-full bg-[var(--blue)] px-2.5 py-0.5 text-[11.5px] text-white">Suggested</span>}
                </div>
                <div className="mt-6 text-[38px] font-semibold leading-none tracking-[-0.03em]">{p.price}</div>
                <div className="text-[13px] text-black/45">{p.cadence}</div>
                <p className="mt-4 text-[14.5px] text-black/65">{p.body}</p>
                <ul className="mt-4 space-y-1.5 text-[14px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check size={14} className="text-[var(--green)]" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="d10-mono mt-4 text-[11px] text-black/40">{PRICE_NOTE} Suggestion thresholds are illustrative.</p>
        </section>

        <section id="start" className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8">
          <div className="rounded-[28px] bg-[var(--ink)] px-6 py-16 text-center text-white sm:px-12 md:py-24">
            <h2 className="mx-auto max-w-[14ch] text-[clamp(40px,6vw,84px)] font-semibold leading-[0.98] tracking-[-0.045em]">It&apos;s already listening.</h2>
            <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-10 flex max-w-[480px] items-center gap-2 rounded-full bg-white/10 p-1.5 pl-5 ring-1 ring-white/15">
              <label htmlFor="d10-email" className="sr-only">Email</label>
              <input id="d10-email" type="email" placeholder="you@company.com" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-white/40" />
              <button className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[14px] font-medium text-[var(--ink)]">
                Join <CornerDownLeft size={14} />
              </button>
            </form>
            <p className="d10-mono mt-3 text-[11px] text-white/40">Demo form · nothing is sent</p>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 pb-10 text-[13px] text-black/55 sm:px-8 md:flex-row">
        <span className="font-semibold text-[var(--ink)]">{BRAND.name}</span>
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
          {["Docs", "Status", "Policy", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-black">{l}</a>
          ))}
        </nav>
        <span className="md:ml-auto">{MOCK_NOTE}</span>
      </footer>
    </div>
  );
}
