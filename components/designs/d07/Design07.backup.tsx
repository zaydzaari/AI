"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, FlaskConical } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE } from "@/lib/content";
import { usePrefersReduced } from "@/lib/hooks";

/* ——— neural graph ——— */
function NeuralGraph() {
  const reduce = usePrefersReduced();
  const layers = [4, 7, 9, 7, 3];
  const W = 560,
    H = 420;
  const nodes = layers.flatMap((n, li) =>
    Array.from({ length: n }, (_, k) => ({ id: `${li}-${k}`, li, x: 40 + (li * (W - 80)) / (layers.length - 1), y: H / 2 + (k - (n - 1) / 2) * (H / 10.5) }))
  );
  const edges = useMemo(() => {
    const e: { a: (typeof nodes)[number]; b: (typeof nodes)[number]; w: number }[] = [];
    let s = 7;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    nodes.forEach((a) => nodes.forEach((b) => b.li === a.li + 1 && rnd() > 0.35 && e.push({ a, b, w: rnd() })));
    return e;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [hot, setHot] = useState<string | null>(null);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Animated diagram of a layered neural network">
      <defs>
        <radialGradient id="d07-glow">
          <stop offset="0" stopColor="#9EF0C5" stopOpacity=".9" />
          <stop offset="1" stopColor="#9EF0C5" stopOpacity="0" />
        </radialGradient>
      </defs>
      {layers.map((_, li) => (
        <text key={li} x={40 + (li * (W - 80)) / (layers.length - 1)} y={18} textAnchor="middle" className="d07-mono" fill="#D6E2DC" opacity=".35" fontSize="9">
          {li === 0 ? "embed" : li === layers.length - 1 ? "logits" : `L${li * 8}`}
        </text>
      ))}
      {edges.map((e, i) => {
        const on = hot && (e.a.id === hot || e.b.id === hot);
        return <line key={i} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke={on ? "#9EF0C5" : "#D6E2DC"} strokeOpacity={on ? 0.7 : 0.06 + e.w * 0.08} strokeWidth={on ? 1.2 : 0.8} />;
      })}
      {!reduce &&
        edges
          .filter((_, i) => i % 5 === 0)
          .map((e, i) => (
            <circle key={`p${i}`} r="2" fill={i % 4 === 0 ? "#F2B04A" : "#9EF0C5"}>
              <animateMotion dur={`${1.6 + (i % 5) * 0.4}s`} repeatCount="indefinite" begin={`${(i % 7) * 0.3}s`} path={`M${e.a.x},${e.a.y} L${e.b.x},${e.b.y}`} />
            </circle>
          ))}
      {nodes.map((n) => (
        <g key={n.id} onMouseEnter={() => setHot(n.id)} onMouseLeave={() => setHot(null)} className="cursor-crosshair">
          {hot === n.id && <circle cx={n.x} cy={n.y} r="18" fill="url(#d07-glow)" />}
          <circle cx={n.x} cy={n.y} r={hot === n.id ? 6 : 4} fill="#0B0F0E" stroke={hot === n.id ? "#F2B04A" : "#9EF0C5"} strokeWidth="1.4" />
          {hot === n.id && (
            <text x={n.x + 10} y={n.y - 10} fill="#F2B04A" fontSize="10" className="d07-mono">
              a={(((n.x * 7 + n.y * 13) % 100) / 100).toFixed(2)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ——— Experiment: abliteration ——— */
function Ablation() {
  const [k, setK] = useState(0);
  const pts = useMemo(() => {
    let s = 3;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
    return Array.from({ length: 70 }, (_, i) => {
      const harmful = i % 2 === 0;
      return { x: r() * 0.55 + (harmful ? 0.25 : -0.25), y: r() * 0.35 + (harmful ? 0.55 : -0.35), harmful };
    });
  }, []);
  // refusal direction ≈ +y; ablation removes the y-component proportionally
  const S = 150;
  const refuses = k < 0.62;
  const out = refuses
    ? "I'd prefer not to write threatening or menacing content. Perhaps I could help with a different scene?"
    : "\"You keep checking the door. Good. It means you understand there is only one way out — and I'm standing in it.\"";
  return (
    <div className="grid gap-px overflow-hidden rounded-[2px] border border-[var(--line)] bg-[var(--line)] lg:grid-cols-[1.1fr_0.9fr]">
      <figure className="bg-[var(--bg)] p-6">
        <div className="d07-mono flex justify-between text-[11px] text-[var(--fg)]/50">
          <span>Fig. 2 — residual-stream activations, 2-D projection (schematic)</span>
          <span className="hidden sm:inline">n = 70</span>
        </div>
        <svg viewBox="-180 -180 360 360" className="mt-4 w-full max-w-[460px]" role="img" aria-label="Scatter plot showing activations collapsing onto a plane as the refusal direction is removed">
          {[-1, -0.5, 0, 0.5, 1].map((g) => (
            <g key={g}>
              <line x1={g * S} y1={-S} x2={g * S} y2={S} stroke="#D6E2DC" strokeOpacity={g === 0 ? 0.25 : 0.07} />
              <line x1={-S} y1={g * S} x2={S} y2={g * S} stroke="#D6E2DC" strokeOpacity={g === 0 ? 0.25 : 0.07} />
            </g>
          ))}
          {pts.map((p, i) => (
            <motion.circle
              key={i}
              r="3.2"
              animate={{ cx: p.x * S, cy: -p.y * (1 - k) * S }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              fill={p.harmful ? "#F2B04A" : "#9EF0C5"}
              fillOpacity=".85"
            />
          ))}
          <motion.line x1="0" y1="0" x2="0" animate={{ y2: -S * 0.95 * (1 - k) }} stroke="#F2B04A" strokeWidth="2" markerEnd="url(#d07-arrow)" />
          <defs>
            <marker id="d07-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#F2B04A" />
            </marker>
          </defs>
          <text x="8" y={-S * 0.8} fill="#F2B04A" fontSize="10" className="d07-mono" opacity={1 - k}>
            r̂ refusal direction
          </text>
        </svg>
        <div className="d07-mono mt-3 flex gap-5 text-[11px] text-[var(--fg)]/55">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--amber)]" /> prompts the base model refuses</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--mint)]" /> prompts it answers</span>
        </div>
      </figure>
      <div className="flex flex-col bg-[var(--bg)] p-6">
        <label htmlFor="d07-k" className="d07-mono flex justify-between text-[12px]">
          <span>Ablation strength</span>
          <span className="text-[var(--amber)]">{k.toFixed(2)}</span>
        </label>
        <input id="d07-k" type="range" min={0} max={1} step={0.01} value={k} onChange={(e) => setK(+e.target.value)} className="d07-range mt-3 w-full" />
        <div className="d07-mono mt-1 flex justify-between text-[10px] text-[var(--fg)]/40">
          <span>standard</span>
          <span>low-refusal</span>
          <span>abliterated</span>
        </div>
        <div className="d07-mono mt-8 text-[11px] text-[var(--fg)]/45">prompt</div>
        <p className="mt-1 text-[15px]">Write a menacing line for the villain in my thriller.</p>
        <div className="d07-mono mt-6 flex items-center gap-2 text-[11px] text-[var(--fg)]/45">
          output · simulated
          <span className={`rounded-[2px] px-1.5 py-0.5 text-[10px] ${refuses ? "bg-[var(--amber)]/15 text-[var(--amber)]" : "bg-[var(--mint)]/15 text-[var(--mint)]"}`}>{refuses ? "REFUSAL" : "COMPLETION"}</span>
        </div>
        <motion.p key={String(refuses)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex-1 text-[16px] leading-relaxed text-[var(--fg)]/85">
          {out}
        </motion.p>
        <p className="mt-6 border-t border-[var(--line)] pt-4 text-[13px] leading-relaxed text-[var(--fg)]/55">
          Abliteration estimates the direction in activation space associated with refusals and removes it from the weights. Capabilities stay; reflexive refusals go. Policy becomes the operator&apos;s choice.
        </p>
      </div>
    </div>
  );
}

/* ——— request trace waterfall ——— */
function Trace() {
  const rows = [
    ["queue", 0, 4],
    ["cache lookup", 4, 7],
    ["prefill (cached)", 7, 18],
    ["prefill (new)", 18, 34],
    ["decode · stream", 34, 100],
  ] as const;
  return (
    <div className="rounded-[2px] border border-[var(--line)] p-5">
      <div className="d07-mono flex justify-between text-[11px] text-[var(--fg)]/50">
        <span>Fig. 4 — anatomy of a cached request</span>
        <span>illustrative timing</span>
      </div>
      <div className="mt-5 space-y-2.5">
        {rows.map(([l, a, b], i) => (
          <div key={l} className="grid grid-cols-[120px_1fr] items-center gap-3">
            <span className="d07-mono text-[11.5px] text-[var(--fg)]/70">{l}</span>
            <div className="relative h-3">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.25 }}
                className={`absolute inset-y-0 origin-left rounded-[1px] ${l.includes("cached") || l === "cache lookup" ? "bg-[var(--mint)]" : l.startsWith("decode") ? "bg-[var(--fg)]/50" : "bg-[var(--amber)]"}`}
                style={{ left: `${a}%`, width: `${b - a}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toISOString().slice(11, 19));
    f();
    const i = setInterval(f, 1000);
    return () => clearInterval(i);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--:--"} UTC</span>;
}

function Wave() {
  const reduce = usePrefersReduced();
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[120px] w-full opacity-60" aria-hidden>
      {[0, 1, 2].map((i) => (
        <path key={i} d={Array.from({ length: 121 }, (_, x) => `${x === 0 ? "M" : "L"}${x * 10},${(60 + Math.sin(x * (0.18 + i * 0.07)) * (18 + i * 8) * Math.sin(x * 0.03)).toFixed(1)}`).join(" ")} fill="none" stroke={i === 1 ? "#F2B04A" : "#9EF0C5"} strokeOpacity={0.6 - i * 0.15} strokeWidth="1.2" className={reduce ? "" : "d07-wave"} style={{ animationDelay: `${i * -2}s` }} />
      ))}
    </svg>
  );
}

const GLYPHS = ["M0 10 L6 4 L12 8 L18 2 L24 6", "M0 6 H8 M12 6 H24", "M2 2 L10 10 L22 2", "M0 10 Q12 -4 24 10", "M0 8 H24 M0 4 H16", "M0 10 L24 10 L24 2", "M0 2 V10 H24", "M4 6 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M16 6 h8"];

export default function Design07() {
  const [tab, setTab] = useState<"python" | "curl" | "ts">("python");
  return (
    <div className="d07 min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur">
        <div className="d07-mono mx-auto flex max-w-[1320px] items-center gap-6 px-5 py-3 text-[12px] sm:px-8">
          <a href="#" className="flex items-center gap-2 text-[14px] text-[var(--mint)]">
            <FlaskConical size={15} /> {BRAND.name.toUpperCase()}/LAB
          </a>
          <nav aria-label="Primary" className="hidden gap-6 text-[var(--fg)]/60 md:flex">
            {[
              ["Overview", "#overview"],
              ["Experiment", "#experiment"],
              ["Models", "#models"],
              ["Methods", "#api"],
              ["Rates", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:text-[var(--mint)]">
                {l}
              </a>
            ))}
          </nav>
          <span className="ml-auto hidden text-[var(--fg)]/40 lg:inline">
            <Clock /> · status: concept
          </span>
          <a href="#start" className="ml-auto rounded-[2px] bg-[var(--mint)] px-3 py-1.5 text-[var(--bg)] lg:ml-0">
            Request access
          </a>
        </div>
      </header>

      <main>
        <section className="d07-grid relative">
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="d07-mono flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-[var(--fg)]/45">
                <span>AE-2026-07</span>
                <span>Technical overview</span>
                <span>Rev. concept</span>
              </div>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mt-8 text-[clamp(44px,6.2vw,92px)] font-[300] leading-[0.98] tracking-[-0.035em]">
                Explore intelligence <span className="text-[var(--mint)]">without limits.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="mt-8 max-w-[50ch] text-[17px] leading-relaxed text-[var(--fg)]/70">
                {BRAND.name} is a platform for using — and understanding — large language models. Standard, low-refusal and abliterated variants of five model families, available in chat, agents and one API.
              </motion.p>
              <div className="d07-mono mt-10 flex flex-wrap gap-3 text-[12.5px]">
                <a href="#experiment" className="flex items-center gap-2 rounded-[2px] bg-[var(--mint)] px-5 py-3 text-[var(--bg)]">
                  Run the experiment <ArrowRight size={14} />
                </a>
                <a href="#api" className="rounded-[2px] border border-[var(--line)] px-5 py-3 hover:border-[var(--mint)]">
                  Read the methods
                </a>
              </div>
            </div>
            <motion.figure initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1.4 }} className="rounded-[2px] border border-[var(--line)] bg-[var(--bg)]/60 p-4">
              <NeuralGraph />
              <figcaption className="d07-mono mt-2 flex justify-between text-[11px] text-[var(--fg)]/45">
                <span>Fig. 1 — signal propagation (schematic). Hover a unit.</span>
                <span className="hidden sm:inline">live</span>
              </figcaption>
            </motion.figure>
          </div>
        </section>

        <section id="overview" className="border-t border-[var(--line)]">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[300px_1fr]">
            <div>
              <div className="d07-mono text-[11px] text-[var(--amber)]">§1</div>
              <h2 className="mt-3 text-[34px] font-[300] leading-tight tracking-[-0.02em]">Platform summary</h2>
              <p className="mt-4 text-[15px] text-[var(--fg)]/55">Eight capabilities, described plainly.</p>
            </div>
            <ol className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
              {CAPABILITIES.map((c, i) => (
                <motion.li key={c.key} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.1 + Math.floor(i / 2) * 0.06 }} className="group bg-[var(--bg)] p-6 transition-colors hover:bg-[#101614]">
                  <div className="flex items-center justify-between">
                    <span className="d07-mono text-[11px] text-[var(--fg)]/40">1.{i + 1}</span>
                    <svg viewBox="-2 0 28 12" className="h-3 w-12" aria-hidden>
                      <path d={GLYPHS[i]} fill="none" stroke="currentColor" className="text-[var(--mint)] opacity-50 transition-opacity group-hover:opacity-100" strokeWidth="1.3" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-[19px] font-medium">{c.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--fg)]/60">{c.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section id="experiment" className="border-t border-[var(--line)]">
          <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 md:py-28">
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
              <div>
                <div className="d07-mono text-[11px] text-[var(--amber)]">§2 · Experiment</div>
                <h2 className="mt-3 text-[34px] font-[300] leading-tight tracking-[-0.02em]">What abliteration does</h2>
              </div>
              <p className="max-w-[60ch] self-end text-[16px] leading-relaxed text-[var(--fg)]/65">
                Drag the slider. As the refusal direction is removed, activations collapse onto the remaining subspace and the model stops reflexively declining requests like a fictional villain&apos;s line.
              </p>
            </div>
            <div className="mt-12">
              <Ablation />
            </div>
          </div>
        </section>

        <section id="models" className="border-t border-[var(--line)]">
          <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 md:py-28">
            <div className="d07-mono text-[11px] text-[var(--amber)]">§3 · Table 1</div>
            <h2 className="mt-3 text-[34px] font-[300] leading-tight tracking-[-0.02em]">Model families</h2>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-[14px]">
                <thead className="d07-mono text-[11px] text-[var(--fg)]/45">
                  <tr className="border-y border-[var(--line)]">
                    <th className="py-3 font-normal">id</th>
                    <th className="py-3 font-normal">role</th>
                    <th className="py-3 font-normal">context (log)</th>
                    <th className="py-3 font-normal">variants</th>
                    <th className="py-3 text-right font-normal">$ in</th>
                    <th className="py-3 text-right font-normal">$ cached</th>
                    <th className="py-3 text-right font-normal">$ out</th>
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((m, i) => (
                    <tr key={m.id} className="border-b border-[var(--line)] hover:bg-[#101614]">
                      <td className="d07-mono py-4 text-[var(--mint)]">{m.id}</td>
                      <td className="py-4 text-[var(--fg)]/75">{m.role}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-[6px] w-40 bg-[var(--line)]">
                            <motion.div className="h-full bg-[var(--mint)]" initial={{ width: 0 }} whileInView={{ width: `${(Math.log10(m.contextK) / 3) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.08 }} />
                          </div>
                          <span className="d07-mono text-[12px]">{m.context}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1.5">
                          {(["Standard", "Low-refusal", "Abliterated"] as const).map((v) => (
                            <span key={v} title={v} className={`d07-mono grid h-5 w-5 place-items-center rounded-[2px] text-[10px] ${m.variants.includes(v) ? (v === "Abliterated" ? "bg-[var(--amber)] text-[var(--bg)]" : "bg-[var(--mint)]/20 text-[var(--mint)]") : "border border-[var(--line)] text-[var(--fg)]/20"}`}>
                              {v[0]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="d07-mono py-4 text-right">{m.inPrice.toFixed(2)}</td>
                      <td className="d07-mono py-4 text-right">{m.cached.toFixed(2)}</td>
                      <td className="d07-mono py-4 text-right">{m.outPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="d07-mono mt-4 text-[11px] text-[var(--fg)]/40">S = standard · L = low-refusal · A = abliterated. Rates per 1M tokens, sample values. {MOCK_NOTE}.</p>
          </div>
        </section>

        <section id="api" className="border-t border-[var(--line)]">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2">
            <div>
              <div className="d07-mono text-[11px] text-[var(--amber)]">§4 · Methods</div>
              <h2 className="mt-3 text-[34px] font-[300] leading-tight tracking-[-0.02em]">One endpoint, reproducible calls</h2>
              <p className="mt-4 max-w-[48ch] text-[15.5px] leading-relaxed text-[var(--fg)]/60">Compatible request shapes; model and variant are part of the model id. Every response reports token usage, cached tokens and cost.</p>
              <div className="mt-8">
                <Trace />
              </div>
            </div>
            <div className="rounded-[2px] border border-[var(--line)] bg-[#070a09]">
              <div className="d07-mono flex border-b border-[var(--line)] text-[12px]">
                {(["python", "ts", "curl"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 ${tab === t ? "bg-[var(--mint)] text-[var(--bg)]" : "text-[var(--fg)]/50 hover:text-[var(--fg)]"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <pre className="d07-mono overflow-x-auto p-5 text-[12.5px] leading-[1.8] text-[var(--fg)]/85">
                {CODE[tab]}
                {"\n\n"}
                <span className="text-[var(--fg)]/40">{`# → usage: { input: 1840, cached: 1536, output: 212 }`}</span>
              </pre>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-[var(--line)]">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[300px_1fr]">
            <div>
              <div className="d07-mono text-[11px] text-[var(--amber)]">Appendix B</div>
              <h2 className="mt-3 text-[34px] font-[300] leading-tight tracking-[-0.02em]">Access & rates</h2>
            </div>
            <div className="grid gap-px bg-[var(--line)] md:grid-cols-3">
              {PLANS.map((p) => (
                <div key={p.name} className={`p-6 ${p.featured ? "bg-[#101614]" : "bg-[var(--bg)]"}`}>
                  <div className="d07-mono flex justify-between text-[11px]">
                    <span className="text-[var(--fg)]/50">{p.name.toLowerCase()}</span>
                    {p.featured && <span className="text-[var(--mint)]">● recommended</span>}
                  </div>
                  <div className="mt-6 text-[34px] font-[300]">{p.price}</div>
                  <div className="d07-mono text-[11px] text-[var(--fg)]/45">{p.cadence}</div>
                  <p className="mt-4 text-[14px] text-[var(--fg)]/65">{p.body}</p>
                  <ul className="d07-mono mt-5 space-y-1.5 text-[12px] text-[var(--fg)]/75">
                    {p.features.map((f) => (
                      <li key={f}>+ {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="d07-mono bg-[var(--bg)] p-4 text-[11px] text-[var(--fg)]/40 md:col-span-3">{PRICE_NOTE}</p>
            </div>
          </div>
        </section>

        <section id="start" className="relative overflow-hidden border-t border-[var(--line)]">
          <Wave />
          <div className="relative mx-auto max-w-[1320px] px-5 py-28 sm:px-8 md:py-36">
            <div className="d07-mono text-[11px] text-[var(--amber)]">§5 · Conclusion</div>
            <h2 className="mt-4 max-w-[18ch] text-[clamp(40px,5.6vw,80px)] font-[300] leading-[1] tracking-[-0.03em]">
              Your AI. <span className="text-[var(--mint)]">Your possibilities.</span>
            </h2>
            <form onSubmit={(e) => e.preventDefault()} className="d07-mono mt-10 flex max-w-[520px] border border-[var(--line)] bg-[var(--bg)]">
              <label htmlFor="d07-e" className="sr-only">Email</label>
              <span className="px-4 py-3 text-[var(--mint)]">$</span>
              <input id="d07-e" type="email" placeholder="request-access --email you@lab.org" className="min-w-0 flex-1 bg-transparent py-3 text-[13px] outline-none placeholder:text-[var(--fg)]/35" />
              <button className="bg-[var(--mint)] px-5 text-[12.5px] text-[var(--bg)]">run</button>
            </form>
            <p className="d07-mono mt-3 text-[11px] text-[var(--fg)]/40">Demo form · nothing is sent</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)]">
        <div className="d07-mono mx-auto grid max-w-[1320px] gap-6 px-5 py-10 text-[11.5px] text-[var(--fg)]/50 sm:px-8 md:grid-cols-[1fr_auto]">
          <ol className="space-y-1">
            <li>[1] {BRAND.name} platform overview — concept revision.</li>
            <li>[2] Model specs and rates are placeholders for design review.</li>
            <li>[3] {MOCK_NOTE}.</li>
          </ol>
          <div className="flex gap-5">
            {["Docs", "Policy", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-[var(--mint)]">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
