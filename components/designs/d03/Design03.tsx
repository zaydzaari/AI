"use client";

/**
 * 03 Pearl (v3) — holographic liquid glass.
 * Signature: "Refraction". One prompt enters a glass prism and splits into five
 * beams; each lands on a card with that model's answer, tokens and price.
 */

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { clamp, onScroll, pointer, progress, reduced, smooth, useKit } from "@/lib/kit";

const PrismScene = dynamic(() => import("./PrismScene"), { ssr: false, loading: () => null });

const PROMPT = "Explain prompt caching to a new developer in two sentences.";
const ANSWERS: Record<string, string> = {
  core: "When the start of your prompt repeats, we keep it ready instead of reading it again. You pay the cached rate for that part, so long system prompts get cheaper every call.",
  unbound: "Caching remembers the repeated front of your prompt so it isn't processed twice. Same answer quality, lower input bill — no strings attached.",
  forge: "Think memoisation for prompts: an identical prefix hits the cache and is billed at the cached rate. Keep the stable parts first and the changing parts last.",
  atlas: "If you send the same long document again, it is served from cache rather than re-read. With very large prompts, this is where most of the savings come from.",
  swift: "Repeated prompt prefixes are cached and billed cheaper. Put fixed text first.",
};
const HUES = ["#E86FA8", "#9B7CF0", "#4FA3F2", "#3CC7A9", "#F1B04A"];
const OUT = [52, 41, 47, 44, 18];

function Chips() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0, x = 0, y = 0;
    const tick = () => {
      x += ((pointer.active ? pointer.x / innerWidth - 0.5 : 0) - x) * 0.06;
      y += ((pointer.active ? pointer.y / innerHeight - 0.5 : 0) - y) * 0.06;
      ref.current?.style.setProperty("--px", x.toFixed(4));
      ref.current?.style.setProperty("--py", y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="p3-chips" ref={ref} aria-hidden>
      {MODELS.map((m, i) => (
        <span key={m.id} className={`p3-chip c${i}`} style={{ ["--z" as string]: [1.4, 0.7, 1, 0.5, 1.2][i] }}>
          <i style={{ background: HUES[i] }} />{m.name}<em>{fmtUSD(estimateCost(m, 14, OUT[i]))}</em>
        </span>
      ))}
    </div>
  );
}

function Refraction() {
  const run = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => onScroll(() => setP(reduced() ? 1 : progress(run.current!))), []);
  const beamIn = smooth(clamp(p / 0.22));
  const split = smooth(clamp((p - 0.2) / 0.22));
  const lit = Math.floor(clamp((p - 0.42) / 0.5) * 5.999);
  return (
    <div className="p3-run" ref={run}>
      <div className="p3-pin">
        <p className="p3-prompt"><span>One prompt</span>{PROMPT}</p>
        <div className="p3-optics">
          <svg viewBox="0 0 600 500" className="p3-svg" role="img" aria-label="A beam of light splits into five beams, one per model">
            <defs>
              <linearGradient id="p3glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".35" stopColor="#D9E3FA" /><stop offset=".65" stopColor="#F2D3E6" /><stop offset="1" stopColor="#CDEFE4" /></linearGradient>
            </defs>
            <path d="M0 250 L250 250" stroke="#1B1C22" strokeWidth="2.5" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - beamIn} />
            {HUES.map((c, i) => {
              const y = 60 + i * 95;
              return <path key={c} d={`M290 250 C 380 250, 440 ${y}, 600 ${y}`} fill="none" stroke={c} strokeWidth={i === lit ? 5 : 3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - smooth(clamp(split * 1.4 - i * 0.08))} opacity={i <= lit || split < 1 ? 1 : 0.5} />;
            })}
            <path d="M220 110 L350 250 L220 390 Z" fill="url(#p3glass)" stroke="#1B1C22" strokeOpacity=".28" strokeWidth="1.5" style={{ filter: "drop-shadow(0 24px 34px rgba(27,28,34,.18))" }} />
            <path d="M228 132 L338 250" stroke="#FFFFFF" strokeWidth="4" opacity=".9" />
          </svg>
          <ol className="p3-out" aria-live="polite">
            {MODELS.map((m, i) => (
              <li key={m.id} className={`p3-ans ${i <= lit && p > 0.42 ? "on" : ""} ${i === lit ? "now" : ""}`}>
                <span className="dot" style={{ background: HUES[i] }} aria-hidden />
                <div><b>{m.name}</b><span className="role">{m.role}</span></div>
                <p>{ANSWERS[m.id]}</p>
                <span className="price">{OUT[i]} out · <b className="live">{fmtUSD(estimateCost(m, 14, OUT[i]))}</b></span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function tilt(e: React.PointerEvent<HTMLElement>) {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches || reduced()) return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`); el.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
}
const untilt = (e: React.PointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };

export default function Design03() {
  const root = useRef<HTMLDivElement>(null);
  const spread = useRef(0.4);
  useKit(root);
  useEffect(() => onScroll(() => { spread.current = 0.4 + clamp(scrollY / innerHeight) * 0.6; }), []);
  const costs = MODELS.map((m, i) => estimateCost(m, 14, OUT[i]));
  const maxOut = Math.max(...MODELS.map((m) => m.outPrice));
  return (
    <div ref={root} className="kit d03">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="p3-nav">
        <a className="p3-mark" href="#main"><span aria-hidden className="orb" />{BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#clarity">Clarity</a><a href="#refraction">Refraction</a><a href="#features">Features</a><a href="#how">How it works</a><a href="#pricing">Pricing</a></nav>
      </header>
      <main id="main">
        <section className="p3-hero" data-hero aria-labelledby="p3-h">
          <div className="p3-stage" data-hero-part="visual">
            <div className="p3-prism" aria-hidden><PrismScene spread={spread} /></div>
            <Chips />
          </div>
          <div className="p3-copy">
            <h1 id="p3-h" data-hero-part="headline">One prompt in. Five models out.</h1>
            <p className="k-body" data-hero-part="sub">Send a single request and compare the answers, tokens and cost of five model families — standard, low-refusal or abliterated.</p>
            <div className="p3-act">
              <div data-hero-part="cta"><a className="p3-btn" href="#pricing" data-cta="primary" data-magnetic="6,0.12,0.8,0.45"><span data-magnetic-label>Compare your first prompt</span></a></div>
              <p className="p3-trust" data-hero-part="trust">Same prompt, five prices: <b>{fmtUSD(Math.min(...costs))}</b> to <b>{fmtUSD(Math.max(...costs))}</b><span> at sample rates</span></p>
            </div>
          </div>
        </section>

        <section id="clarity" data-section aria-labelledby="p3-c">
          <div className="k-wrap">
            <h2 id="p3-c" className="p3-h2" data-reveal>Most AI bills arrive frosted over. Ours are clear glass.</h2>
            <div className="p3-fog" data-stagger>
              {PROBLEM.rows.map((r, i) => (
                <article key={i} className="p3-pane k-card">
                  <p className="was">{r.problem}</p>
                  <p className="now">{r.solution}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="refraction" data-section aria-labelledby="p3-r">
          <div className="k-wrap"><h2 id="p3-r" className="p3-h2" data-reveal>Watch one question split into five answers.</h2></div>
          <Refraction />
        </section>

        <section id="features" data-section aria-labelledby="p3-f">
          <div className="k-wrap">
            <h2 id="p3-f" className="p3-h2" data-reveal>Every feature, and what it gives back to you.</h2>
            <div className="p3-bento" data-stagger>
              {BENEFITS.map((b, i) => (
                <article key={b.key} className={`p3-glass k-card g${i}`} data-spot onPointerMove={tilt} onPointerLeave={untilt}>
                  <span className="tag">{b.feature}</span>
                  <h3>{b.benefit}</h3>
                  <p>{b.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" data-section aria-labelledby="p3-w">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="p3-w" className="p3-h2 p3-rail-h" data-reveal>From idea to invoice in three panes.</h2></div>
              <ol className="p3-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="p3-step k-card">
                    <span className="n" aria-hidden>{i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {i === 1 && <pre><code>{STEP_CODE}</code></pre>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="voices" data-section aria-labelledby="p3-v">
          <div className="k-wrap">
            <h2 id="p3-v" className="p3-h2" data-reveal>Who it is built for.</h2>
            <div className="p3-voices" data-stagger>
              {PROOF.map((p) => (
                <figure key={p.role} className="p3-bubble k-card">
                  <blockquote>“{p.quote}”</blockquote>
                  <figcaption><b>{p.role}</b> · {p.focus}</figcaption>
                </figure>
              ))}
            </div>
            <p className="p3-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="pricing" data-section aria-labelledby="p3-p">
          <div className="k-wrap">
            <h2 id="p3-p" className="p3-h2" data-reveal>Clear pricing, down to a single token.</h2>
            <div className="p3-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`p3-glass p3-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}<span> {p.cadence}</span></p>
                  <p className="body">{p.body}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "Pay only for tokens used. Cached input billed lower, automatically." : p.name === "Pro" ? "Cancel any time." : "No card needed."}</p>
                </article>
              ))}
            </div>
            <div className="p3-spectrum" data-reveal>
              <h3>Output price per 1M tokens</h3>
              {MODELS.map((m, i) => (
                <div key={m.id} className="bar"><span className="nm">{m.name}</span><span className="track"><i style={{ width: `${(m.outPrice / maxOut) * 100}%`, background: HUES[i] }} /></span><span className="v">${m.outPrice.toFixed(2)}</span></div>
              ))}
              <p className="p3-fine">{PRICE_NOTE}</p>
            </div>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="p3-z">
          <div className="k-wrap p3-final">
            <h2 id="p3-z" className="p3-h2" data-reveal>Put one question through every model.</h2>
            <a className="p3-btn" href="#main" data-magnetic="6,0.12,0.8,0.45" data-reveal><span data-magnetic-label>Compare your first prompt</span></a>
          </div>
        </section>
      </main>
      <footer className="p3-foot">
        <div className="wide"><p className="p3-mark"><span aria-hidden className="orb" />{BRAND.name}</p><p>{MOCK_NOTE}. Brand name is a placeholder.</p></div>
        <div><h3>Models</h3>{MODELS.map((m) => <a key={m.id} href="#refraction">{m.name}</a>)}</div>
        <div><h3>Platform</h3><a href="#features">Unified chat</a><a href="#how">Developer API</a><a href="#pricing">Token pricing</a></div>
        <div><h3>Lab</h3><a href="/designs">Back to the gallery</a></div>
      </footer>
    </div>
  );
}
