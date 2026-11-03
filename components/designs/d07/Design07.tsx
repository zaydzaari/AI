"use client";

/**
 * 07 Lab Seven (v3) — futuristic research laboratory, laid out as a paper.
 * Fig. 1: probe-able neural schematic. Fig. 2 (signature): a pinned token-flow Sankey that
 * tweens through three experiment runs — uncached, cached, routed to Swift — with live cost.
 */

import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { clamp, fitCanvas, lerp, loop, onScroll, pointer, progress, reduced, useKit } from "@/lib/kit";

const RUNS = [
  { id: "A", label: "Run A — first request, nothing cached", model: "core", inTok: 12000, cached: 0, outTok: 800 },
  { id: "B", label: "Run B — same prompt again, prefix cached", model: "core", inTok: 12000, cached: 10000, outTok: 800 },
  { id: "C", label: "Run C — extraction routed to Swift", model: "swift", inTok: 12000, cached: 10000, outTok: 300 },
];
const m = (id: string) => MODELS.find((x) => x.id === id)!;
const runCost = (r: (typeof RUNS)[number]) => estimateCost(m(r.model), r.inTok, r.outTok, r.cached / r.inTok);

function NeuralFig() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [probe, setProbe] = useState<{ l: number; n: number; a: number } | null>(null);
  useEffect(() => {
    const c = cv.current!;
    const { s, stop } = fitCanvas(c);
    const LAYERS = [5, 9, 11, 9, 5];
    let last = "";
    const off = loop(c, (t) => {
      const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const r = c.getBoundingClientRect();
      const px = pointer.x - r.left, py = pointer.y - r.top;
      const pos = LAYERS.map((n, l) => Array.from({ length: n }, (_, i) => ({ x: (w * (l + 0.5)) / LAYERS.length, y: (h * (i + 1)) / (n + 1) })));
      let hot: { l: number; n: number } | null = null;
      pos.forEach((layer, l) => layer.forEach((p, n) => { if (Math.hypot(p.x - px, p.y - py) < 16) hot = { l, n }; }));
      const H = hot as { l: number; n: number } | null;
      for (let l = 0; l < pos.length - 1; l++) {
        for (const [i, a] of pos[l].entries()) for (const [j, b] of pos[l + 1].entries()) {
          const lit = H && ((H.l === l && H.n === i) || (H.l === l + 1 && H.n === j));
          ctx.strokeStyle = lit ? "rgba(158,240,197,.75)" : "rgba(214,226,220,.07)";
          ctx.lineWidth = lit ? 1.2 : 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          const k = (t * 0.35 + (i * 7 + j * 3 + l * 11) * 0.137) % 1;
          if ((i + j + l) % 5 === 0 && !reduced()) { ctx.fillStyle = "rgba(242,176,74,.8)"; ctx.beginPath(); ctx.arc(lerp(a.x, b.x, k), lerp(a.y, b.y, k), 1.6, 0, 7); ctx.fill(); }
        }
      }
      pos.forEach((layer, l) => layer.forEach((p, n) => {
        const act = 0.5 + 0.5 * Math.sin(t * 1.3 + l * 1.7 + n * 0.9);
        const isHot = H && H.l === l && H.n === n;
        ctx.fillStyle = isHot ? "#9EF0C5" : `rgba(228,238,233,${0.25 + act * 0.5})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, isHot ? 6 : 3.5, 0, 7); ctx.fill();
        if (isHot) { const key = l + ":" + n; if (key !== last) { last = key; setProbe({ l, n, a: act }); } }
      }));
      if (!H && last) { last = ""; setProbe(null); }
    });
    return () => { stop(); off(); };
  }, []);
  return (
    <figure className="l7-fig1" data-hero-part="visual">
      <canvas ref={cv} role="img" aria-label="Schematic neural network with signals moving between layers" />
      <figcaption><span>Fig. 1 — Schematic only, not a real model. Hover a node to probe it.</span><span className="probe">{probe ? <>layer {probe.l + 1} · unit {probe.n + 1} · act <b className="live">{probe.a.toFixed(2)}</b></> : "probe: none"}</span></figcaption>
    </figure>
  );
}

function useTween(target: number, ms = 700) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reduced()) { setV(target); return; }
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const step = (t: number) => { const k = clamp((t - t0) / ms); const e = 1 - Math.pow(1 - k, 3); const x = a + (target - a) * e; from.current = x; setV(x); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function TokenFlow() {
  const run = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => onScroll(() => setI(reduced() ? 2 : Math.min(2, Math.floor(clamp((progress(run.current!) - 0.05) / 0.85) * 3)))), []);
  const R = RUNS[i];
  const cached = useTween(R.cached), out = useTween(R.outTok);
  const S = 300 / 12000;
  const top = 70, X = [60, 330, 600, 870];
  const cH = cached * S, fH = (12000 - cached) * S, gap = cached > 1 && cached < 11999 ? 18 : 0;
  const oH = Math.max(6, out * S * 4);
  const band = (x0: number, a0: number, b0: number, x1: number, a1: number, b1: number) => { const mx = (x0 + x1) / 2; return `M${x0} ${a0}C${mx} ${a0} ${mx} ${a1} ${x1} ${a1}L${x1} ${b1}C${mx} ${b1} ${mx} ${b0} ${x0} ${b0}Z`; };
  const modelCol = R.model === "swift" ? "#F2B04A" : "#9EF0C5";
  const costs = RUNS.map(runCost);
  return (
    <div className="l7-run" ref={run}>
      <div className="l7-pin">
        <div className="l7-fig2">
          <p className="l7-figt">Fig. 2 — Where your tokens go. <span>{R.label}</span></p>
          <svg viewBox="0 0 960 470" role="img" aria-label={`${R.label}: ${Math.round(cached).toLocaleString()} cached and ${Math.round(12000 - cached).toLocaleString()} fresh input tokens, ${Math.round(out)} output tokens`}>
            <g className="l7-axis">{X.map((x, k) => <text key={x} x={x + 10} y="40">{["Prompt", "Cache", "Model", "Output"][k]}</text>)}</g>
            <path d={band(X[0] + 20, top, top + cH, X[1], top, top + cH)} fill="#9EF0C5" opacity=".28" />
            <path d={band(X[0] + 20, top + cH, top + 300, X[1], top + cH + gap, top + 300 + gap)} fill="#E4EEE9" opacity=".14" />
            <path d={band(X[1] + 20, top, top + cH, X[2], top, top + cH)} fill="#9EF0C5" opacity=".28" />
            <path d={band(X[1] + 20, top + cH + gap, top + 300 + gap, X[2], top + cH, top + 300)} fill="#E4EEE9" opacity=".14" />
            <path d={band(X[2] + 20, top + 150 - oH / 2, top + 150 + oH / 2, X[3], top + 150 - oH / 2, top + 150 + oH / 2)} fill={modelCol} opacity=".5" />
            <rect x={X[0]} y={top} width="20" height="300" fill="#E4EEE9" />
            {cH > 0.5 && <rect x={X[1]} y={top} width="20" height={cH} fill="#9EF0C5" />}
            <rect x={X[1]} y={top + cH + gap} width="20" height={fH} fill="#E4EEE9" opacity=".7" />
            <rect x={X[2]} y={top} width="20" height="300" fill={modelCol} />
            <rect x={X[3]} y={top + 150 - oH / 2} width="20" height={oH} fill={modelCol} />
            <g className="l7-lbl">
              <text x={X[0]} y={top + 330}>12,000 in</text>
              {cH > 20 && <text x={X[1] + 28} y={top + cH / 2 + 4}>{Math.round(cached).toLocaleString()} cached</text>}
              <text x={X[1] + 28} y={top + cH + gap + fH / 2 + 4}>{Math.round(12000 - cached).toLocaleString()} fresh</text>
              <text x={X[2] + 28} y={top + 150}>{m(R.model).name}</text>
              <text x={X[3] - 90} y={top + 150 + oH / 2 + 22}>{Math.round(out)} out (×4 scale)</text>
            </g>
          </svg>
        </div>
        <aside className="l7-results" aria-live="polite">
          <p className="l7-figt">Fig. 3 — Cost per request</p>
          {RUNS.map((r, k) => (
            <div key={r.id} className={`bar ${k === i ? "on" : ""} ${k > i ? "later" : ""}`}>
              <span>Run {r.id}</span>
              <span className="track"><i style={{ transform: `scaleX(${k <= i ? costs[k] / costs[0] : 0})` }} /></span>
              <b className={k === i ? "live" : ""}>{k <= i ? fmtUSD(costs[k]) : "—"}</b>
            </div>
          ))}
          <p className="note">{i === 0 ? "Baseline: every input token billed at the fresh rate." : i === 1 ? `Repeating the prompt bills ${Math.round((R.cached / R.inTok) * 100)}% of it at the cached rate.` : "Routing a simple extraction to Swift cuts it again."} {PRICE_NOTE}</p>
        </aside>
      </div>
    </div>
  );
}

export default function Design07() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  const sample = estimateCost(MODELS[0], 1412, 388, 1024 / 1412);
  return (
    <div ref={root} className="kit d07">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="l7-nav">
        <a className="l7-mark" href="#main">{BRAND.name}/lab</a>
        <nav data-spy aria-label="Sections"><a href="#problem">§1 Problem</a><a href="#findings">§2 Findings</a><a href="#method">§3 Method</a><a href="#review">§4 Review</a><a href="#costs">§5 Costs</a></nav>
        <span className="l7-clock" aria-hidden>note 07 · concept</span>
      </header>
      <main id="main">
        <section className="l7-hero" data-hero aria-labelledby="l7-h">
          <div className="l7-paper">
            <p className="l7-meta">{BRAND.name} research note 07 · placeholder authorship</p>
            <h1 id="l7-h" data-hero-part="headline">Measure what every token buys.</h1>
            <p className="k-body" data-hero-part="sub"><b>Abstract.</b> Run one prompt across five model families and three temperaments, then read tokens, cache hits and cost on every response.</p>
            <div className="l7-act">
              <div data-hero-part="cta"><a className="l7-btn" href="#costs" data-cta="primary" data-magnetic="4,0.2,0.7,0.3"><span data-magnetic-label>Get a research API key</span></a></div>
              <dl className="l7-trust" data-hero-part="trust" aria-label="Sample response telemetry">
                <div><dt>tokens</dt><dd>1,412</dd></div><div><dt>cached</dt><dd>1,024</dd></div><div><dt>cost</dt><dd className="live">{fmtUSD(sample)}</dd></div>
              </dl>
            </div>
          </div>
          <NeuralFig />
        </section>

        <section id="problem" data-section aria-labelledby="l7-p">
          <div className="k-wrap l7-two">
            <h2 id="l7-p" className="l7-h2" data-reveal><span>§1</span> You can't study what you can't measure.</h2>
            <table className="l7-obs" data-reveal>
              <caption className="k-sr">Observations and responses</caption>
              <thead><tr><th scope="col">Observation</th><th scope="col">{BRAND.name}'s response</th></tr></thead>
              <tbody>{PROBLEM.rows.map((r, k) => <tr key={k}><td>{r.problem}</td><td>{r.solution}</td></tr>)}</tbody>
            </table>
          </div>
          <TokenFlow />
        </section>

        <section id="findings" data-section aria-labelledby="l7-f">
          <div className="k-wrap">
            <h2 id="l7-f" className="l7-h2" data-reveal><span>§2</span> Findings: what each feature changes for you.</h2>
            <div className="l7-grid" data-stagger>
              {BENEFITS.map((b, k) => (
                <article key={b.key} className={`l7-card k-card c${k}`} data-spot>
                  <svg viewBox="0 0 120 36" className="spark" aria-hidden><polyline points={Array.from({ length: 12 }, (_, j) => `${j * 10},${(30 - (Math.sin(j * 0.9 + k) * 0.5 + 0.5) * 22 - (k === 4 ? j * -0.8 : j * 0.6)).toFixed(1)}`).join(" ")} /></svg>
                  <p className="tag">{b.feature}</p>
                  <h3>{b.benefit}</h3>
                  <p>{b.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="method" data-section aria-labelledby="l7-m">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="l7-m" className="l7-h2 l7-rail-h" data-reveal><span>§3</span> Method.</h2></div>
              <ol className="l7-steps" data-rail-track>
                {STEPS.map((s, k) => (
                  <li key={k} className="l7-step k-card">
                    <span className="n">3.{k + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {k === 1 && <pre><code>{STEP_CODE}</code></pre>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="review" data-section aria-labelledby="l7-r">
          <div className="k-wrap">
            <h2 id="l7-r" className="l7-h2" data-reveal><span>§4</span> Peer review.</h2>
            <ol className="l7-reviews" data-stagger>
              {PROOF.map((p, k) => (
                <li key={p.role} className="l7-rev k-card">
                  <p className="who">Reviewer {k + 1} · {p.role}</p>
                  <p className="q">{p.quote}</p>
                  <p className="focus">Focus: {p.focus}</p>
                </li>
              ))}
            </ol>
            <p className="l7-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="costs" data-section aria-labelledby="l7-c">
          <div className="k-wrap">
            <h2 id="l7-c" className="l7-h2" data-reveal><span>§5</span> Materials and costs.</h2>
            <div className="l7-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`l7-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price} <span>{p.cadence}</span></p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum. Per-key budgets for each experiment." : p.name === "Pro" ? "Cancel any time." : "No card required."}</p>
                </article>
              ))}
            </div>
            <table className="l7-table" data-reveal>
              <caption>Table 1 — Sample rates per 1M tokens</caption>
              <thead><tr><th scope="col">Family</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th><th scope="col">Temperaments</th></tr></thead>
              <tbody>{MODELS.map((x) => <tr key={x.id}><th scope="row">{x.name}</th><td>{x.context}</td><td>{x.inPrice.toFixed(2)}</td><td>{x.cached.toFixed(2)}</td><td>{x.outPrice.toFixed(2)}</td><td>{x.variants.join(", ")}</td></tr>)}</tbody>
            </table>
            <p className="l7-fine">{PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="l7-z">
          <div className="k-wrap l7-final">
            <h2 id="l7-z" className="l7-h2" data-reveal>Start your first experiment.</h2>
            <a className="l7-btn" href="#main" data-magnetic="4,0.2,0.7,0.3" data-reveal><span data-magnetic-label>Get a research API key</span></a>
          </div>
        </section>
      </main>
      <footer className="l7-foot">
        <p>{BRAND.name}/lab — {MOCK_NOTE}. Brand name is a placeholder.</p>
        <nav aria-label="Footer"><a href="#problem">Problem</a><a href="#findings">Findings</a><a href="#method">Method</a><a href="#costs">Costs</a><a href="/designs">Back to the gallery</a></nav>
      </footer>
    </div>
  );
}
