"use client";

/**
 * 04 Monolith (v3) — architectural minimalism.
 * Typography is the structure. Signature: "Width is context" — a pinned catalogue where
 * scrolling stretches each model name along Archivo's width axis in proportion to its
 * context window, with per-token rates set in fixed columns.
 */

import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE } from "@/lib/content";
import { clamp, onScroll, pointer, progress, reduced, smooth, useKit } from "@/lib/kit";

function Wordmark() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const letters = [...el.querySelectorAll<HTMLSpanElement>("span")];
    if (reduced() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    const cur = letters.map(() => 100);
    const tick = () => {
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const d = pointer.active ? Math.abs(pointer.x - (r.left + r.width / 2)) / innerWidth : 1;
        const target = 62 + 63 * Math.max(0, 1 - d * 3.2);
        cur[i] += (target - cur[i]) * 0.12;
        l.style.fontVariationSettings = `"wdth" ${cur[i].toFixed(1)}, "wght" 800`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <p className="m4-word" ref={ref} aria-hidden>{BRAND.name.toUpperCase().split("").map((c, i) => <span key={i}>{c}</span>)}</p>;
}

function WidthIsContext() {
  const run = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => onScroll(() => setP(reduced() ? 1 : clamp((progress(run.current!) - 0.05) / 0.7))), []);
  const maxLog = Math.log(1000), minLog = Math.log(32);
  const sorted = [...MODELS].sort((a, b) => a.contextK - b.contextK);
  return (
    <div className="m4-run" ref={run}>
      <div className="m4-pin">
        <div className="m4-legend"><span>Width = context window</span><span className="m4-scale"><i style={{ transform: `scaleX(${smooth(p).toFixed(3)})` }} /></span><span>32K → 1M tokens</span></div>
        <ol className="m4-cat">
          {sorted.map((m, i) => {
            const k = (Math.log(m.contextK) - minLog) / (maxLog - minLog);
            const t = smooth(clamp(p * 1.25 - i * 0.06));
            const wdth = 62 + (62 + 63 * k - 62) * t;
            return (
              <li key={m.id} className={t > 0.98 ? "set" : ""}>
                <span className="nm" style={{ fontVariationSettings: `"wdth" ${wdth.toFixed(1)}, "wght" 760` }}>{m.name}</span>
                <span className="ctx">{m.context}</span>
                <span className="rt"><em>in</em> ${m.inPrice.toFixed(2)}</span>
                <span className="rt"><em>out</em> ${m.outPrice.toFixed(2)}</span>
              </li>
            );
          })}
        </ol>
        <p className="m4-fine">Rates per 1M tokens. {PRICE_NOTE}</p>
      </div>
    </div>
  );
}

export default function Design04() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  return (
    <div ref={root} className="kit d04">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="m4-nav">
        <a href="#main" className="m4-mark">{BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#walls">Walls</a><a href="#catalogue">Catalogue</a><a href="#schedule">Schedule</a><a href="#method">Method</a><a href="#rates">Rates</a></nav>
        <a href="#rates" className="m4-navcta">Key</a>
      </header>
      <main id="main">
        <section className="m4-hero" data-hero aria-labelledby="m4-h">
          <div className="m4-beam" data-hero-part="visual"><Wordmark /></div>
          <div className="m4-grid">
            <h1 id="m4-h" data-hero-part="headline">Every model on one key.</h1>
            <p className="k-body" data-hero-part="sub">Five model families with standard, low-refusal and abliterated variants, behind a single API. Rates are printed per million tokens — nothing bundled, nothing rounded.</p>
            <div className="m4-act">
              <div data-hero-part="cta"><a className="m4-btn" href="#rates" data-cta="primary" data-magnetic="4,0.26,0.58,0.3"><span data-magnetic-label>Get an API key</span></a></div>
              <p className="m4-trust" data-hero-part="trust"><b>$0.08</b><span>per 1M input tokens is the lowest sample rate, on Swift.</span></p>
            </div>
          </div>
        </section>

        <section id="walls" data-section aria-labelledby="m4-w">
          <div className="k-wrap m4-cols">
            <h2 id="m4-w" className="m4-h2" data-reveal>Three walls we took down.</h2>
            <ol className="m4-walls">
              {PROBLEM.rows.map((r, i) => (
                <li key={i} data-reveal style={{ ["--i" as string]: i }}>
                  <span className="wall">{r.problem}</span>
                  <span className="open">{r.solution}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="k-wrap m4-cols m4-cat-head"><h2 className="m4-h2" id="catalogue" data-reveal>The catalogue, set in one typeface.</h2><p className="k-body k-muted" data-reveal>Scroll and each name stretches to the size of its context window. The narrowest reads fast; the widest reads whole archives.</p></div>
          <WidthIsContext />
        </section>

        <section id="schedule" data-section aria-labelledby="m4-s">
          <div className="k-wrap">
            <h2 id="m4-s" className="m4-h2" data-reveal>Schedule of features and their returns.</h2>
            <div className="m4-sched" data-stagger>
              {BENEFITS.map((b, i) => (
                <article key={b.key} className={`m4-cell k-card s${i}`} data-spot>
                  <span className="no">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{b.benefit}</h3>
                  <p><b>{b.feature}</b> {b.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="method" data-section aria-labelledby="m4-m">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="m4-m" className="m4-h2 m4-rail-h" data-reveal>Method, in three moves.</h2></div>
              <ol className="m4-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="m4-step">
                    <span className="big" aria-hidden>{i + 1}</span>
                    <div className="k-card txt"><h3>{s.title}</h3><p>{s.body}</p>{i === 1 && <pre><code>{STEP_CODE}</code></pre>}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="voices" data-section aria-labelledby="m4-v">
          <div className="k-wrap m4-cols">
            <h2 id="m4-v" className="m4-h2" data-reveal>Built for four kinds of work.</h2>
            <ul className="m4-voices" data-stagger>
              {PROOF.map((p) => <li key={p.role}><b>{p.role}</b><span>{p.focus}</span><q>{p.quote}</q></li>)}
            </ul>
          </div>
          <p className="k-wrap m4-fine">{PROOF_NOTE}</p>
        </section>

        <section id="rates" data-section aria-labelledby="m4-r">
          <div className="k-wrap">
            <h2 id="m4-r" className="m4-h2" data-reveal>Three ways in. One rate card.</h2>
            <div className="m4-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`m4-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}</p>
                  <p className="cad">{p.cadence}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum. Hard spend caps per key." : p.name === "Pro" ? "Monthly. Cancel any time." : "Free. No card."}</p>
                </article>
              ))}
            </div>
            <p className="m4-fine">{PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="m4-f">
          <div className="k-wrap m4-final">
            <h2 id="m4-f" className="m4-h2" data-reveal>Build on one foundation.</h2>
            <a className="m4-btn" href="#main" data-magnetic="4,0.26,0.58,0.3" data-reveal><span data-magnetic-label>Get an API key</span></a>
          </div>
        </section>
      </main>
      <footer className="m4-foot">
        <p className="m4-foot-word" aria-hidden>{BRAND.name.toUpperCase()}</p>
        <div><h3>Models</h3>{MODELS.map((m) => <a key={m.id} href="#catalogue">{m.name}</a>)}</div>
        <div><h3>API</h3><a href="#method">Quickstart</a><a href="#rates">Rates</a><a href="#schedule">Caching</a></div>
        <div><h3>Lab</h3><a href="/designs">Back to the gallery</a><span>{MOCK_NOTE}</span></div>
      </footer>
    </div>
  );
}
