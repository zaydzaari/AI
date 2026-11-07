"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUp, Check, Command, Copy, CornerDownLeft, Cpu, Database, Gauge, Search, Sparkles, Zap } from "lucide-react";
import { BRAND, CAPABILITIES, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS, estimateCost, fmtUSD, type Model, type Variant } from "@/lib/content";
import { useCopy, useStream } from "@/lib/hooks";
import { suggest } from "@/lib/model-preview";

export { suggest } from "@/lib/model-preview";

const spring = { type: "spring", stiffness: 380, damping: 34 } as const;

type Msg = { role: "user" | "ai"; text: string; model: string; variant: Variant };

export function AiText({ text, id }: { text: string; id: number }) {
  const { out, done } = useStream(text, id, 30);
  return (
    <>
      {out}
      {!done && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-[var(--blue)]" />}
    </>
  );
}

export function Console() {
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
    <div data-hero-part="visual" className="grid gap-3">
      <motion.div layout className={`flex flex-col overflow-hidden rounded-[22px] bg-white ring-1 transition-shadow ${focus ? "shadow-[0_30px_80px_-30px_rgba(61,90,254,.45)] ring-[var(--blue)]/40" : "shadow-[0_30px_80px_-40px_rgba(0,0,0,.25)] ring-black/10"}`}>
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3 d10-desktop-detail">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--green)]" />
          </span>
          <span className="d10-mono text-[12px] text-[var(--text-muted)]">{BRAND.name.toLowerCase()} · console</span>
          <LayoutGroup id="d10-models">
            <div className="ml-auto flex flex-wrap gap-1">
              {MODELS.map((m) => (
                <button key={m.id} onClick={() => setManual(manual === m.id ? null : m.id)} className={`relative shrink-0 rounded-full px-3 py-1 text-[12.5px] transition ${modelId === m.id ? "text-white" : "text-[var(--text-muted)] hover:text-black"}`}>
                  {modelId === m.id && <motion.span layoutId="d10-pill" transition={spring} className="absolute inset-0 rounded-full bg-[var(--ink)]" />}
                  <span className="relative">{m.name}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        <div ref={scroller} className={`flex flex-col gap-3 overflow-y-auto px-5 py-5 ${msgs.length ? "h-[300px]" : "h-[260px] max-md:hidden"} lg:h-[300px]`}>
          {msgs.length === 0 ? (
            <div className="m-auto max-w-[420px] text-center">
              <Sparkles className="mx-auto text-[var(--blue)]" size={22} />
              <p className="mt-3 text-[15px] text-[var(--text-muted)]">Type anything. The model selector reacts to what you write. Try one of these:</p>
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
                  <div className="d10-mono mb-1 text-[11px] text-[var(--text-muted)]">
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
              className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[15px] outline-none placeholder:text-[var(--text-muted)]"
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
            <div className="ml-auto flex flex-wrap gap-1">
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
      <div className="grid grid-cols-3 gap-3 max-md:hidden">
        <Panel icon={Gauge} label="Context used">
          <div className="text-[22px] font-semibold tabular-nums">{tokens.toLocaleString()}</div>
          <div className="mt-2 h-1.5 rounded-full bg-black/[0.06]">
            <motion.div className="h-full rounded-full bg-[var(--blue)]" animate={{ width: `${Math.min(100, (tokens / (model.contextK * 1000)) * 100 * 40)}%` }} transition={spring} />
          </div>
          <div className="d10-mono mt-1 text-[10.5px] text-[var(--text-muted)]">of {model.context}</div>
        </Panel>
        <Panel icon={Database} label="Cached prefix">
          <div className="text-[22px] font-semibold tabular-nums">{cached.toLocaleString()}</div>
          <div className="d10-mono mt-1 text-[10.5px] text-[var(--text-muted)]">tokens reused (est.)</div>
        </Panel>
        <Panel icon={Cpu} label="Next turn cost">
          <div className="text-[22px] font-semibold tabular-nums">{fmtUSD(cost)}</div>
          <div className="d10-mono mt-1 text-[10.5px] text-[var(--text-muted)]">sample rates</div>
        </Panel>
      </div>
    </div>
  );
}

export function Panel({ icon: Icon, label, children }: { icon: typeof Gauge; label: string; children: React.ReactNode }) {
  return (
    <motion.div layout className="rounded-[18px] bg-white p-4 ring-1 ring-black/10">
      <div className="flex items-center gap-1.5 text-[12px] text-[var(--text-muted)]">
        <Icon size={13} /> <span className="truncate">{label}</span>
      </div>
      <div className="mt-2">{children}</div>
    </motion.div>
  );
}

/* ——— ⌘K palette ——— */
export function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
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
              <Search size={16} className="text-[var(--text-muted)]" />
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
              <kbd className="d10-mono rounded bg-black/5 px-1.5 text-[11px] text-[var(--text-muted)]">esc</kbd>
            </div>
            <ul className="max-h-[300px] overflow-y-auto p-2">
              {list.map((i, k) => (
                <li key={i.l}>
                  <a href={i.h} onClick={onClose} onMouseEnter={() => setIdx(k)} className={`flex items-center justify-between rounded-[10px] px-3 py-2.5 text-[14px] ${k === idx ? "bg-[var(--bg)]" : ""}`}>
                    {i.l}
                    {k === idx && <CornerDownLeft size={14} className="text-[var(--text-muted)]" />}
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
export function Widgets() {
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
              <span className={`relative ${tick % 3 === i ? "text-white" : "text-[var(--text-muted)]"}`}>{v}</span>
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
        <div className="d10-mono mt-1.5 flex justify-between text-[11px] text-[var(--text-muted)]">
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

export function W({ t, b, children, className = "" }: { t: string; b: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={spring} className={`flex flex-col justify-between gap-6 rounded-[22px] bg-white p-6 ring-1 ring-black/10 ${className}`}>
      <div>{children}</div>
      <div>
        <h3 className="text-[18px] font-semibold tracking-[-0.01em]">{t}</h3>
        <p className="mt-1 text-[14px] text-[var(--text-muted)]">{b}</p>
      </div>
    </motion.div>
  );
}

/* ——— API request builder ——— */
export function Builder() {
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
          <div className="text-[12px] text-[var(--text-muted)]">Model</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {MODELS.map((x) => (
              <button key={x.id} onClick={() => setM(x)} className={`rounded-full px-3 py-1 text-[13px] ring-1 ${m.id === x.id ? "bg-[var(--ink)] text-white ring-[var(--ink)]" : "ring-black/10"}`}>
                {x.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[12px] text-[var(--text-muted)]">Variant</div>
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
