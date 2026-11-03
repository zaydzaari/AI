"use client";

/**
 * 06 Lumen (v3) — premium consumer-tech product page.
 * Signature: "Lid open". A rendered laptop opens with scroll, the Aether app lights up,
 * the camera pushes in and the captions walk through ask → switch → see the price.
 */

import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { clamp, lerp, onScroll, pointer, progress, reduced, smooth, useKit } from "@/lib/kit";

const CAPTIONS = [
  ["Ask anything.", "Writing, code, research — in one quiet window."],
  ["Switch models without starting over.", "The whole conversation moves with you, from Core to Unbound to Forge."],
  ["See the price before you send.", "Every reply shows its tokens and what it cost."],
];

function Screen({ phase }: { phase: number }) {
  const model = phase >= 1 ? MODELS[1] : MODELS[0];
  const reply = phase >= 1 ? "Here are three darker openings, each under 40 words. The second keeps your narrator unreliable." : "Here are three openings for your night-train story, each under 40 words.";
  return (
    <div className="l6-app">
      <aside className="l6-side" aria-hidden><b>{BRAND.name}</b><span className="on">Night train</span><span>Retry logic</span><span>Contracts Q3</span><span>Grant draft</span></aside>
      <div className="l6-chat">
        <div className="l6-top"><span className="pick">{model.name}{phase >= 1 ? " · abliterated" : ""}</span><span className="dots" aria-hidden><i /><i /><i /></span></div>
        <p className="you">Give me three openings for my night-train story.</p>
        {phase >= 1 && <p className="you">Darker, please. Keep the narrator unreliable.</p>}
        <p className="ai">{reply}</p>
        <p className={`cost ${phase >= 2 ? "show" : ""}`}>186 tokens · {fmtUSD(estimateCost(model, 64, 122))}</p>
      </div>
    </div>
  );
}

function Device({ open = 1, phase = 0 }: { open?: number; phase?: number }) {
  return (
    <div className="l6-device" style={{ ["--open" as string]: open }}>
      <div className="l6-lid"><div className="l6-bezel"><div className="l6-screen" style={{ opacity: clamp((open - 0.55) / 0.35) }}><Screen phase={phase} /></div></div></div>
      <div className="l6-base" aria-hidden><span /></div>
    </div>
  );
}

function Cinema() {
  const run = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => onScroll(() => setP(reduced() ? 1 : progress(run.current!))), []);
  const open = smooth(clamp(p / 0.3));
  const push = smooth(clamp((p - 0.3) / 0.25));
  const phase = p < 0.55 ? 0 : p < 0.78 ? 1 : 2;
  return (
    <div className="l6-run" ref={run}>
      <div className="l6-pin">
        <div className="l6-cap" aria-live="polite">
          {CAPTIONS.map(([t, s], i) => <div key={t} className={i === phase ? "on" : ""}><h3>{t}</h3><p>{s}</p></div>)}
        </div>
        <div className="l6-cam" style={{ transform: `translate3d(0, ${lerp(0, -4, push)}vh, 0) scale(${lerp(0.82, 1.18, push).toFixed(3)})` }}>
          <Device open={0.08 + open * 0.92} phase={phase} />
        </div>
      </div>
    </div>
  );
}

function HeroDevice() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0, x = 0, y = 0;
    const tick = () => {
      x += ((pointer.active ? pointer.x / innerWidth - 0.5 : 0) - x) * 0.05;
      y += ((pointer.active ? pointer.y / innerHeight - 0.5 : 0) - y) * 0.05;
      if (ref.current) ref.current.style.transform = `rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 4).toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div className="l6-hero-dev" data-hero-part="visual"><div ref={ref} className="l6-tilt"><Device open={1} phase={2} /></div><span className="l6-floor" aria-hidden /></div>;
}

export default function Design06() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  return (
    <div ref={root} className="kit d06">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="l6-nav">
        <a className="l6-mark" href="#main">{BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#calm">Overview</a><a href="#highlights">Highlights</a><a href="#setup">Set up</a><a href="#people">People</a><a href="#pricing">Pricing</a></nav>
        <a className="l6-buy" href="#pricing">Start free</a>
      </header>
      <main id="main">
        <section className="l6-hero" data-hero aria-labelledby="l6-h">
          <h1 id="l6-h" data-hero-part="headline">All your models, one calm app.</h1>
          <p className="k-body" data-hero-part="sub">Chat with five model families, switch any time, and see the price of every reply before you send it.</p>
          <div className="l6-act">
            <div data-hero-part="cta"><a className="l6-btn" href="#pricing" data-cta="primary" data-magnetic="4,0.12,0.84,0.3"><span data-magnetic-label>Start free</span></a></div>
            <p className="l6-trust" data-hero-part="trust">Free to start. After that, from <b>$0.08</b> per million tokens.</p>
          </div>
          <HeroDevice />
        </section>

        <section id="calm" data-section aria-labelledby="l6-c" className="l6-calm">
          <div className="k-wrap l6-lines">
            <h2 id="l6-c" className="k-sr">What changes</h2>
            {PROBLEM.rows.map((r, i) => (
              <div key={i} className="l6-line" data-reveal>
                <p className="was">{r.problem}</p>
                <p className="now">{r.solution}</p>
              </div>
            ))}
          </div>
          <Cinema />
        </section>

        <section id="highlights" data-section aria-labelledby="l6-hl">
          <div className="k-wrap">
            <h2 id="l6-hl" className="l6-h2" data-reveal>Highlights.</h2>
            <div className="l6-tiles" data-stagger>
              {BENEFITS.map((b, i) => (
                <article key={b.key} className={`l6-tile k-card t${i}`} data-spot>
                  <span className="kick">{b.feature}</span>
                  <h3>{b.benefit}</h3>
                  <p>{b.detail}</p>
                  {i === 0 && <div className="l6-mini" aria-hidden>{MODELS.slice(0, 3).map((m) => <span key={m.id}>{m.name}</span>)}</div>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="setup" data-section aria-labelledby="l6-s">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="l6-s" className="l6-h2 l6-rail-h" data-reveal>Set up in three steps.</h2></div>
              <ol className="l6-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="l6-step k-card">
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

        <section id="people" data-section aria-labelledby="l6-p">
          <div className="k-wrap">
            <h2 id="l6-p" className="l6-h2" data-reveal>Made for the way you work.</h2>
            <div className="l6-people" data-stagger>
              {PROOF.map((p) => (
                <figure key={p.role} className="l6-person k-card">
                  <span className="ring" aria-hidden>{p.role.split(" ").map((w) => w[0]).join("")}</span>
                  <blockquote>“{p.quote}”</blockquote>
                  <figcaption><b>{p.role}</b><span>{p.focus}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="l6-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="pricing" data-section aria-labelledby="l6-pr">
          <div className="k-wrap">
            <h2 id="l6-pr" className="l6-h2 center" data-reveal>Which plan is right for you?</h2>
            <div className="l6-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`l6-plan k-card ${p.featured ? "feat" : ""}`}>
                  {p.featured && <span className="badge">Most popular</span>}
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}</p>
                  <p className="cad">{p.cadence}</p>
                  <p className="body">{p.body}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "Only pay for tokens you use." : p.name === "Pro" ? "Cancel anytime." : "No card required."}</p>
                </article>
              ))}
            </div>
            <div className="l6-compare" data-reveal>
              <h3>Compare models</h3>
              <div className="l6-cols">
                {MODELS.map((m) => (
                  <div key={m.id} className="l6-col"><b>{m.name}</b><span>{m.role}</span><span className="v">{m.context}<small>context</small></span><span className="v">${m.inPrice.toFixed(2)}<small>per 1M in</small></span><span className="v">${m.outPrice.toFixed(2)}<small>per 1M out</small></span></div>
                ))}
              </div>
              <p className="l6-fine">{PRICE_NOTE}</p>
            </div>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="l6-f">
          <div className="k-wrap l6-final">
            <h2 id="l6-f" className="l6-h2" data-reveal>Every model. Beautifully simple.</h2>
            <a className="l6-btn" href="#main" data-magnetic="4,0.12,0.84,0.3" data-reveal><span data-magnetic-label>Start free</span></a>
          </div>
        </section>
      </main>
      <footer className="l6-foot">
        <p>{MOCK_NOTE}. {BRAND.name} is a placeholder brand name.</p>
        <div className="cols">
          <div><h3>Explore</h3><a href="#calm">Overview</a><a href="#highlights">Highlights</a></div>
          <div><h3>Models</h3>{MODELS.map((m) => <a key={m.id} href="#pricing">{m.name}</a>)}</div>
          <div><h3>Developers</h3><a href="#setup">API</a><a href="#pricing">Token pricing</a></div>
          <div><h3>Lab</h3><a href="/designs">Back to the gallery</a></div>
        </div>
      </footer>
    </div>
  );
}
