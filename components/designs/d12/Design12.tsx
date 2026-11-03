"use client";

/**
 * 12 Aperture (v3) — the fusion proposal.
 * Warm paper outside (friendly chat), a real camera iris, and a dark machine inside
 * (API, agents, per-token rates). Signature: a full-viewport iris that scroll opens to
 * reveal a holographic portal where five glass lenses — the model families — fan out
 * with their rates. The page stays inside the machine until the final CTA closes it.
 */

import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "motion/react";
import { BENEFITS, BRAND, CODE, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE } from "@/lib/content";
import { clamp, lerp, onScroll, pointer, progress, reduced, smooth, useKit } from "@/lib/kit";
import { Iris } from "./Iris";

function Portal({ fan = 0 }: { fan?: number }) {
  return (
    <div className="a12-portal" aria-hidden>
      <span className="ring" />
      {MODELS.map((m, i) => {
        const a = (i / MODELS.length) * Math.PI * 2 - Math.PI / 2;
        const r = lerp(10, 34, fan);
        return (
          <span key={m.id} className="lens" style={{ left: `${(50 + Math.cos(a) * r).toFixed(2)}%`, top: `${(50 + Math.sin(a) * r).toFixed(2)}%`, opacity: +(0.35 + fan * 0.65).toFixed(3) }}>
            <b>{m.name}</b><em>{m.context}</em><i>${m.inPrice.toFixed(2)} / ${m.outPrice.toFixed(2)}</i>
          </span>
        );
      })}
    </div>
  );
}

function HeroIris() {
  const open = useMotionValue(0.16);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) { open.set(0.4); return; }
    let raf = 0, v = 0.16;
    const tick = () => {
      const r = ref.current?.getBoundingClientRect();
      let target = 0.18 + Math.sin(performance.now() / 2600) * 0.03;
      if (r && pointer.active) { const d = Math.hypot(pointer.x - (r.left + r.width / 2), pointer.y - (r.top + r.height / 2)) / r.width; target = 0.18 + Math.max(0, 0.9 - d) * 0.32; }
      v += (target - v) * 0.06; open.set(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);
  return (
    <div className="a12-hero-iris" ref={ref} data-hero-part="visual">
      <Portal fan={0.2} />
      <div className="a12-blades"><Iris open={open} /></div>
      <span className="a12-housing" aria-hidden />
    </div>
  );
}

function Aperture() {
  const run = useRef<HTMLDivElement>(null);
  const open = useMotionValue(0.05);
  const [p, setP] = useState(0);
  useEffect(() => onScroll(() => { const v = reduced() ? 1 : progress(run.current!); setP(v); open.set(smooth(clamp(v / 0.62)) * 0.98 + 0.02); }), [open]);
  const fan = smooth(clamp((p - 0.55) / 0.3));
  return (
    <div className="a12-run" ref={run}>
      <div className="a12-pin">
        <div className="a12-inside"><Portal fan={fan} /><p className="a12-in-cap" style={{ opacity: fan }}>Inside: one API, five families, every rate in view.</p></div>
        <div className="a12-big"><Iris open={open} size={1000} /></div>
        <p className="a12-out-cap" style={{ opacity: 1 - smooth(clamp(p / 0.3)) }}>Outside, it's a friendly chat. Scroll to open the aperture.</p>
      </div>
    </div>
  );
}

function ClosingIris() {
  const box = useRef<HTMLDivElement>(null);
  const open = useMotionValue(1);
  useEffect(() => onScroll(() => open.set(reduced() ? 0.2 : 1 - smooth(progress(box.current!, "through")) * 0.85)), [open]);
  return <div className="a12-close" ref={box} aria-hidden><Portal fan={1} /><div className="a12-blades"><Iris open={open} /></div><span className="a12-housing" /></div>;
}

export default function Design12() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  return (
    <div ref={root} className="kit d12">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="a12-nav">
        <a className="a12-mark" href="#main"><span aria-hidden />{BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#outside">Outside</a><a href="#inside">Inside</a><a href="#build">Build</a><a href="#voices">Voices</a><a href="#rates">Rates</a></nav>
        <a className="a12-key" href="#rates">Get your key</a>
      </header>
      <main id="main">
        <section className="a12-hero" data-hero aria-labelledby="a12-h">
          <div className="a12-copy">
            <h1 id="a12-h" data-hero-part="headline">Open every model with a single key.</h1>
            <p className="k-body" data-hero-part="sub">Start in a friendly chat. Step inside to the API, the coding agents and the per-token rates — it's all one platform, standard, low-refusal or abliterated.</p>
            <div data-hero-part="cta"><a className="a12-btn" href="#rates" data-cta="primary" data-magnetic="6,0.13,0.8,0.45"><span data-magnetic-label>Get your key</span></a></div>
            <p className="a12-trust" data-hero-part="trust">Sample input rates run from <b>$0.08</b> on Swift to <b>$1.50</b> on Atlas, per million tokens.</p>
          </div>
          <HeroIris />
        </section>

        <section id="outside" data-section aria-labelledby="a12-o">
          <div className="k-wrap a12-outside">
            <h2 id="a12-o" className="a12-h2" data-reveal>Friendly on the outside.</h2>
            <ol className="a12-notes" data-stagger>
              {PROBLEM.rows.map((r, i) => <li key={i}><p className="was">{r.problem}</p><p className="now">{r.solution}</p></li>)}
            </ol>
          </div>
          <Aperture />
        </section>

        <div className="a12-dark">
          <section id="inside" data-section aria-labelledby="a12-i">
            <div className="k-wrap">
              <h2 id="a12-i" className="a12-h2" data-reveal>Precise on the inside.</h2>
              <div className="a12-bento" data-stagger>
                {BENEFITS.map((b, i) => (
                  <article key={b.key} className={`a12-glass k-card q${i}`} data-spot>
                    <span className="tag">{b.feature}</span>
                    <h3>{b.benefit}</h3>
                    <p>{b.detail}</p>
                    {i === 0 && <pre><code>{CODE.curl}</code></pre>}
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="build" data-section aria-labelledby="a12-b">
            <div data-rail>
              <div data-rail-view>
                <div className="k-wrap"><h2 id="a12-b" className="a12-h2 a12-rail-h" data-reveal>Build through the aperture in three steps.</h2></div>
                <ol className="a12-steps" data-rail-track>
                  {STEPS.map((s, i) => (
                    <li key={i} className="a12-glass a12-step k-card">
                      <span className="n">{["i", "ii", "iii"][i]}.</span>
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                      {i === 1 && <pre><code>{STEP_CODE}</code></pre>}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section id="voices" data-section aria-labelledby="a12-v">
            <div className="k-wrap">
              <h2 id="a12-v" className="a12-h2" data-reveal>For everyone on both sides of the lens.</h2>
              <div className="a12-voices" data-stagger>
                {PROOF.map((p) => (
                  <figure key={p.role} className="a12-glass k-card">
                    <blockquote>“{p.quote}”</blockquote>
                    <figcaption><b>{p.role}</b><span>{p.focus}</span></figcaption>
                  </figure>
                ))}
              </div>
              <p className="a12-fine">{PROOF_NOTE}</p>
            </div>
          </section>

          <section id="rates" data-section aria-labelledby="a12-r">
            <div className="k-wrap">
              <h2 id="a12-r" className="a12-h2" data-reveal>Every rate, in focus.</h2>
              <div className="a12-plans" data-stagger>
                {PLANS.map((p) => (
                  <article key={p.name} className={`a12-glass a12-plan k-card ${p.featured ? "feat" : ""}`}>
                    <h3>{p.name}</h3>
                    <p className="price">{p.price}<span> {p.cadence}</span></p>
                    <p className="body">{p.body}</p>
                    <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                    <p className="fk">{p.name === "API" ? "No minimum. Cached input billed lower, automatically." : p.name === "Pro" ? "Cancel any time." : "No card required."}</p>
                  </article>
                ))}
              </div>
              <table className="a12-table" data-reveal>
                <caption>Per 1M tokens</caption>
                <thead><tr><th scope="col">Lens</th><th scope="col">For</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
                <tbody>{MODELS.map((m) => <tr key={m.id}><th scope="row">{m.name}</th><td>{m.role}</td><td>{m.context}</td><td>${m.inPrice.toFixed(2)}</td><td>${m.cached.toFixed(2)}</td><td>${m.outPrice.toFixed(2)}</td></tr>)}</tbody>
              </table>
              <p className="a12-fine">{PRICE_NOTE}</p>
            </div>
          </section>
        </div>

        <section id="final" data-section aria-labelledby="a12-f" className="a12-final-sec">
          <div className="k-wrap a12-final">
            <ClosingIris />
            <div className="a12-final-copy">
              <h2 id="a12-f" className="a12-h2" data-reveal>Step back out whenever you like. Your key stays open.</h2>
              <a className="a12-btn" href="#main" data-magnetic="6,0.13,0.8,0.45" data-reveal><span data-magnetic-label>Get your key</span></a>
            </div>
          </div>
        </section>
      </main>
      <footer className="a12-foot">
        <div><p className="a12-mark big"><span aria-hidden />{BRAND.name}</p><p>{MOCK_NOTE}. Brand name is a placeholder.</p></div>
        <div><h4>Lenses</h4>{MODELS.map((m) => <a key={m.id} href="#rates">{m.name}</a>)}</div>
        <div><h4>Inside</h4><a href="#inside">Features</a><a href="#build">API quickstart</a><a href="#rates">Token rates</a></div>
        <div><h4>Lab</h4><a href="/designs">Back to the gallery</a></div>
      </footer>
    </div>
  );
}
