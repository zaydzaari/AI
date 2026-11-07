"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, FlaskConical } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE } from "@/lib/content";
import { usePrefersReduced } from "@/lib/hooks";

/* ——— neural graph ——— */
export function NeuralGraph() {
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
export function Ablation() {
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
        <div className="d07-mono flex justify-between text-[11px] text-[var(--text-muted)]">
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
        <div className="d07-mono mt-3 flex gap-5 text-[11px] text-[var(--text-muted)]">
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
        <div className="d07-mono mt-1 flex justify-between text-[10px] text-[var(--text-muted)]">
          <span>standard</span>
          <span>low-refusal</span>
          <span>abliterated</span>
        </div>
        <div className="d07-mono mt-8 text-[11px] text-[var(--text-muted)]">prompt</div>
        <p className="mt-1 text-[15px]">Write a menacing line for the villain in my thriller.</p>
        <div className="d07-mono mt-6 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          output · simulated
          <span className={`rounded-[2px] px-1.5 py-0.5 text-[10px] ${refuses ? "bg-[var(--amber)]/15 text-[var(--amber)]" : "bg-[var(--mint)]/15 text-[var(--text-primary)]"}`}>{refuses ? "REFUSAL" : "COMPLETION"}</span>
        </div>
        <motion.p key={String(refuses)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex-1 text-[16px] leading-relaxed text-[var(--fg)]/85">
          {out}
        </motion.p>
        <p className="mt-6 border-t border-[var(--line)] pt-4 text-[13px] leading-relaxed text-[var(--text-muted)]">
          This schematic illustrates removal of a refusal-associated activation direction. The points and responses are simulated, and do not measure the behaviour or capabilities of a real model.
        </p>
      </div>
    </div>
  );
}

/* ——— request trace waterfall ——— */
export function Trace() {
  const rows = [
    ["queue", 0, 4],
    ["cache lookup", 4, 7],
    ["prefill (cached)", 7, 18],
    ["prefill (new)", 18, 34],
    ["decode · stream", 34, 100],
  ] as const;
  return (
    <div className="rounded-[2px] border border-[var(--line)] p-5">
      <div className="d07-mono flex justify-between text-[11px] text-[var(--text-muted)]">
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

export function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toISOString().slice(11, 19));
    f();
    const i = setInterval(f, 1000);
    return () => clearInterval(i);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--:--"} UTC</span>;
}

export function Wave() {
  const reduce = usePrefersReduced();
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[90px] w-full opacity-60 md:h-[120px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <path key={i} d={Array.from({ length: 121 }, (_, x) => `${x === 0 ? "M" : "L"}${x * 10},${(60 + Math.sin(x * (0.18 + i * 0.07)) * (18 + i * 8) * Math.sin(x * 0.03)).toFixed(1)}`).join(" ")} fill="none" stroke={i === 1 ? "#F2B04A" : "#9EF0C5"} strokeOpacity={0.6 - i * 0.15} strokeWidth="1.2" className={reduce ? "" : "d07-wave"} style={{ animationDelay: `${i * -2}s` }} />
      ))}
    </svg>
  );
}

export const GLYPHS = ["M0 10 L6 4 L12 8 L18 2 L24 6", "M0 6 H8 M12 6 H24", "M2 2 L10 10 L22 2", "M0 10 Q12 -4 24 10", "M0 8 H24 M0 4 H16", "M0 10 L24 10 L24 2", "M0 2 V10 H24", "M4 6 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M16 6 h8"];
