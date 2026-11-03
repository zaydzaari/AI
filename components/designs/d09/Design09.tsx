"use client";

/**
 * 09 Raster (v3) — Swiss typography meets AI.
 * A visible 12-column raster (press G), a grid-snapping poster disk, and a signature
 * pinned "monthly estimator" poster: scroll sweeps volume from 1M to 1B tokens a month
 * while each model's monthly cost is re-set as giant numerals. Sliders take over manually.
 */

import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE } from "@/lib/content";
import { clamp, onScroll, pointer, progress, reduced, useKit } from "@/lib/kit";

const monthly = (m: (typeof MODELS)[number], tokens: number, cache: number) => {
  const inTok = tokens * 0.75, outTok = tokens * 0.25;
  return (inTok * (1 - cache) * m.inPrice + inTok * cache * m.cached + outTok * m.outPrice) / 1e6;
};
const money = (n: number) => (n >= 1000 ? `$${Math.round(n).toLocaleString("en-US")}` : n >= 10 ? `$${n.toFixed(0)}` : `$${n.toFixed(2)}`);
const vol = (t: number) => (t >= 1e9 ? `${(t / 1e9).toFixed(1)}B` : t >= 1e6 ? `${Math.round(t / 1e6)}M` : `${Math.round(t / 1e3)}K`);

function PosterDisk() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (reduced()) return;
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const cell = r.width / 6;
      const gx = pointer.active ? Math.round(clamp((pointer.x - r.left) / cell - 3, -2, 2)) : 0;
      const gy = pointer.active ? Math.round(clamp((pointer.y - r.top) / cell - 3, -2, 2)) : 0;
      el.style.setProperty("--gx", String(gx)); el.style.setProperty("--gy", String(gy));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="r9-poster" ref={ref} data-hero-part="visual" aria-hidden>
      <span className="disk" /><span className="bar" /><span className="sq" />
      <span className="lbl">1 key → 5 families</span>
    </div>
  );
}

function Estimator() {
  const run = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0.3);
  const [manual, setManual] = useState(false);
  const [cache, setCache] = useState(0.5);
  useEffect(() => onScroll(() => { if (!manual) setP(reduced() ? 0.55 : clamp((progress(run.current!) - 0.05) / 0.85)); }), [manual]);
  const tokens = Math.pow(10, 6 + p * 3);
  const costs = MODELS.map((m) => monthly(m, tokens, cache));
  const max = Math.max(...costs);
  return (
    <div className="r9-run" ref={run}>
      <div className="r9-pin">
        <div className="r9-controls">
          <label><span>Tokens per month</span><b className="live">{vol(tokens)}</b>
            <input type="range" min="0" max="1" step="0.001" value={p} onChange={(e) => { setManual(true); setP(+e.target.value); }} aria-valuetext={`${vol(tokens)} tokens per month`} /></label>
          <label><span>Share of input served from cache</span><b className="live">{Math.round(cache * 100)}%</b>
            <input type="range" min="0" max="0.95" step="0.05" value={cache} onChange={(e) => setCache(+e.target.value)} /></label>
          <p className="r9-fine">Assumes 75% input, 25% output. {PRICE_NOTE}</p>
        </div>
        <ol className="r9-costs" aria-live="polite">
          {MODELS.map((m, i) => (
            <li key={m.id}>
              <span className="nm">{m.name}</span>
              <span className="num">{money(costs[i])}</span>
              <span className="bar" style={{ transform: `scaleX(${(costs[i] / max).toFixed(4)})` }} />
              <span className="per">per month · {m.context}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function Design09() {
  const root = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState(false);
  useKit(root);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key.toLowerCase() === "g" && !(e.target as HTMLElement).closest("input, textarea")) setGrid((g) => !g); };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);
  const trust = monthly(MODELS[0], 50e6, 0);
  return (
    <div ref={root} className={`kit d09 ${grid ? "show-grid" : ""}`}>
      <a className="k-skip" href="#main">Skip to content</a>
      <div className="r9-grid" aria-hidden>{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div>
      <header className="r9-nav">
        <a className="r9-mark" href="#main">{BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#estimate">Estimate</a><a href="#index">Index</a><a href="#procedure">Procedure</a><a href="#users">Users</a><a href="#prices">Prices</a></nav>
        <button className="r9-gridbtn" onClick={() => setGrid((g) => !g)} aria-pressed={grid}>Grid <kbd>G</kbd></button>
      </header>
      <main id="main">
        <section className="r9-hero" data-hero aria-labelledby="r9-h">
          <h1 id="r9-h" data-hero-part="headline">Every model. Every token. One invoice.</h1>
          <PosterDisk />
          <div className="r9-hcol">
            <p className="k-body" data-hero-part="sub">Five model families behind one API, billed per token with prompt caching built in. Estimate your month before you write a line of code.</p>
            <div data-hero-part="cta"><a className="r9-btn" href="#prices" data-cta="primary" data-magnetic="3,0.3,0.55,0.2"><span data-magnetic-label>Get an API key</span></a></div>
            <p className="r9-trust" data-hero-part="trust"><b>{money(trust)}</b> a month for 50M tokens on Core, uncached, at sample rates.</p>
          </div>
        </section>

        <section id="estimate" data-section aria-labelledby="r9-e">
          <div className="k-wrap r9-cols">
            <h2 id="r9-e" className="r9-h2" data-reveal>A bill you can read before it arrives.</h2>
            <dl className="r9-pairs" data-stagger>
              {PROBLEM.rows.map((r, i) => <div key={i}><dt>{r.problem}</dt><dd>{r.solution}</dd></div>)}
            </dl>
          </div>
          <Estimator />
        </section>

        <section id="index" data-section aria-labelledby="r9-i">
          <div className="k-wrap">
            <h2 id="r9-i" className="r9-h2" data-reveal>Index of features and their effect.</h2>
            <div className="r9-index" data-stagger>
              {BENEFITS.map((b, i) => (
                <article key={b.key} className={`r9-cell k-card x${i}`} data-spot>
                  <p className="f">{b.feature}</p>
                  <h3>{b.benefit}</h3>
                  <p className="d">{b.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="procedure" data-section aria-labelledby="r9-p">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="r9-p" className="r9-h2 r9-rail-h" data-reveal>Procedure.</h2></div>
              <ol className="r9-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="r9-step k-card">
                    <span className="n">{i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {i === 1 && <pre><code>{STEP_CODE}</code></pre>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="users" data-section aria-labelledby="r9-u">
          <div className="k-wrap r9-cols">
            <h2 id="r9-u" className="r9-h2" data-reveal>Users, by role.</h2>
            <ul className="r9-users" data-stagger>
              {PROOF.map((p) => <li key={p.role}><b>{p.role}</b><span>{p.focus}</span><q>{p.quote}</q></li>)}
            </ul>
          </div>
          <p className="k-wrap r9-fine">{PROOF_NOTE}</p>
        </section>

        <section id="prices" data-section aria-labelledby="r9-pr">
          <div className="k-wrap">
            <h2 id="r9-pr" className="r9-h2" data-reveal>Prices.</h2>
            <div className="r9-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`r9-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}</p>
                  <p className="cad">{p.cadence}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum. Monthly invoice, itemised per model." : p.name === "Pro" ? "Cancel any time." : "No card required."}</p>
                </article>
              ))}
            </div>
            <table className="r9-table" data-reveal>
              <caption>Rates per 1M tokens</caption>
              <thead><tr><th scope="col">Model</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
              <tbody>{MODELS.map((m) => <tr key={m.id}><th scope="row">{m.name}</th><td>{m.context}</td><td>{m.inPrice.toFixed(2)}</td><td>{m.cached.toFixed(2)}</td><td>{m.outPrice.toFixed(2)}</td></tr>)}</tbody>
            </table>
            <p className="r9-fine">{PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="r9-f">
          <div className="k-wrap r9-final">
            <h2 id="r9-f" className="r9-h2" data-reveal>Start with one key.</h2>
            <a className="r9-btn" href="#main" data-magnetic="3,0.3,0.55,0.2" data-reveal><span data-magnetic-label>Get an API key</span></a>
          </div>
        </section>
      </main>
      <footer className="r9-foot">
        <p className="big">{BRAND.name}</p>
        <div><h3>Models</h3>{MODELS.map((m) => <a key={m.id} href="#prices">{m.name}</a>)}</div>
        <div><h3>Platform</h3><a href="#estimate">Estimator</a><a href="#index">Features</a><a href="#procedure">API</a></div>
        <div><h3>Lab</h3><a href="/designs">Back to the gallery</a><span>{MOCK_NOTE}</span></div>
      </footer>
    </div>
  );
}
