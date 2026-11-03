"use client";

/**
 * 08 Observatory (v3) — midnight observatory.
 * Hero: an orrery where each model orbits at a radius set by its context window.
 * Signature: a pinned planisphere — scroll turns the star wheel; whichever model's
 * constellation crosses the meridian opens its ephemeris card (context, rates, variants).
 */

import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE } from "@/lib/content";
import { clamp, fitCanvas, loop, onScroll, pointer, progress, reduced, useKit } from "@/lib/kit";

const CONST: number[][][] = [
  [[0, 0], [14, -10], [30, -6], [42, -18]],
  [[0, 0], [10, 14], [24, 10], [30, 26], [16, 34]],
  [[0, 0], [18, 0], [18, 18], [0, 18], [0, 0]],
  [[0, 0], [12, -16], [28, -20], [40, -8], [52, -14], [64, -2]],
  [[0, 0], [8, -14], [16, 0], [30, -2], [18, 8], [24, 22]],
];

function Orrery() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current!;
    const { s, stop } = fitCanvas(c);
    const stars = Array.from({ length: 260 }, (_, i) => ({ x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7, tw: Math.random() * 6 + i }));
    let px = 0, py = 0;
    const off = loop(c, (t) => {
      const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      px += ((pointer.active ? pointer.x / innerWidth - 0.5 : 0) - px) * 0.04;
      py += ((pointer.active ? pointer.y / innerHeight - 0.5 : 0) - py) * 0.04;
      for (const st of stars) {
        const a = 0.25 + 0.55 * st.z * (0.6 + 0.4 * Math.sin(t * 1.2 + st.tw));
        ctx.fillStyle = `rgba(232,238,255,${a})`;
        ctx.fillRect(((st.x - px * 0.04 * st.z) * w + w) % w, ((st.y - py * 0.04 * st.z) * h + h) % h, st.z * 1.6, st.z * 1.6);
      }
      const cx = w * (w > 900 ? 0.66 : 0.5) + px * 30, cy = h * (w > 900 ? 0.5 : 0.36) + py * 20;
      const R = Math.min(w * (w > 900 ? 0.32 : 0.46), h * 0.42);
      const sun = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.16);
      sun.addColorStop(0, "rgba(232,238,255,.95)"); sun.addColorStop(0.4, "rgba(201,168,106,.45)"); sun.addColorStop(1, "rgba(201,168,106,0)");
      ctx.fillStyle = sun; ctx.beginPath(); ctx.arc(cx, cy, R * 0.16, 0, 7); ctx.fill();
      MODELS.forEach((m, i) => {
        const k = (Math.log(m.contextK) - Math.log(32)) / (Math.log(1000) - Math.log(32));
        const r = R * (0.3 + 0.7 * (0.12 + 0.88 * k) * (0.82 + i * 0.045));
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1, 0.38 + py * 0.08);
        ctx.strokeStyle = "rgba(232,238,255,.16)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
        ctx.restore();
        const a = (reduced() ? 1 : t) * (0.5 / (1 + i * 0.6)) + i * 1.3;
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * (0.38 + py * 0.08);
        ctx.fillStyle = i === 1 ? "#C9A86A" : "#E8EEFF";
        ctx.beginPath(); ctx.arc(x, y, 3 + k * 4, 0, 7); ctx.fill();
        ctx.font = '500 12px "Hanken Grotesk Variable", sans-serif'; ctx.fillStyle = "rgba(232,238,255,.78)";
        ctx.fillText(`${m.name} · ${m.context}`, x + 10, y - 8);
      });
    });
    return () => { stop(); off(); };
  }, []);
  return <canvas ref={cv} className="o8-orrery" data-hero-part="visual" role="img" aria-label="An orrery: five model families orbit a star, wider orbits for larger context windows" />;
}

function Planisphere() {
  const run = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => onScroll(() => setP(reduced() ? 0 : clamp((progress(run.current!) - 0.04) / 0.9))), []);
  const rot = -p * 288;
  const active = Math.min(4, Math.round((p * 288) / 72));
  const m = MODELS[active];
  return (
    <div className="o8-run" ref={run}>
      <div className="o8-pin">
        <div className="o8-wheel-wrap">
          <svg viewBox="-260 -260 520 520" className="o8-wheel" role="img" aria-label={`Star wheel; ${m.name} is on the meridian`}>
            <defs><radialGradient id="o8sky"><stop offset="0" stopColor="#0D1A3A" /><stop offset="1" stopColor="#050A1A" /></radialGradient></defs>
            <circle r="250" fill="url(#o8sky)" stroke="rgba(232,238,255,.25)" />
            <g style={{ transform: `rotate(${rot}deg)`, transition: "transform .2s linear" }}>
              {Array.from({ length: 72 }, (_, i) => <line key={i} x1="0" y1={-250} x2="0" y2={i % 6 ? -242 : -232} stroke="rgba(232,238,255,.35)" transform={`rotate(${i * 5})`} />)}
              {Array.from({ length: 140 }, (_, i) => { const a = i * 2.39996, r = 30 + ((i * 37) % 200); return <circle key={i} cx={(Math.cos(a) * r).toFixed(1)} cy={(Math.sin(a) * r).toFixed(1)} r={i % 9 ? 0.9 : 1.8} fill="#E8EEFF" opacity={i % 9 ? 0.45 : 0.85} />; })}
              {MODELS.map((mm, i) => (
                <g key={mm.id} transform={`rotate(${i * 72}) translate(-26 -170)`} className={i === active ? "o8-c on" : "o8-c"}>
                  <polyline points={CONST[i].map(([x, y]) => `${x},${y}`).join(" ")} />
                  {CONST[i].map(([x, y], j) => <circle key={j} cx={x} cy={y} r="2.6" />)}
                  <text x="0" y="44">{mm.name}</text>
                </g>
              ))}
            </g>
            <path d="M-70 -250 A 250 250 0 0 1 70 -250 L 40 -120 A 130 130 0 0 0 -40 -120 Z" className="o8-window" />
            <line x1="0" y1="-258" x2="0" y2="-110" stroke="#5BA8FF" strokeWidth="1" strokeDasharray="3 4" />
          </svg>
          <p className="o8-wheel-cap">Meridian · scroll to turn the sky</p>
        </div>
        <article className="o8-eph" aria-live="polite" key={m.id}>
          <p className="kick">On the meridian</p>
          <h3>{m.name}</h3>
          <p className="role">{m.role}</p>
          <p className="blurb">{m.blurb}</p>
          <dl>
            <div><dt>Context</dt><dd className="live">{m.context}</dd></div>
            <div><dt>Input / 1M</dt><dd>${m.inPrice.toFixed(2)}</dd></div>
            <div><dt>Cached / 1M</dt><dd>${m.cached.toFixed(2)}</dd></div>
            <div><dt>Output / 1M</dt><dd>${m.outPrice.toFixed(2)}</dd></div>
          </dl>
          <p className="vars">{m.variants.join(" · ")}</p>
          <p className="o8-fine">{PRICE_NOTE}</p>
        </article>
      </div>
    </div>
  );
}

export default function Design08() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  return (
    <div ref={root} className="kit d08">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="o8-nav">
        <a className="o8-mark" href="#main"><span aria-hidden>✦</span> {BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#sky">The sky</a><a href="#instruments">Instruments</a><a href="#log">Observing log</a><a href="#reports">Reports</a><a href="#ephemeris">Ephemeris</a></nav>
      </header>
      <main id="main">
        <section className="o8-hero" data-hero aria-labelledby="o8-h">
          <Orrery />
          <div className="o8-copy">
            <h1 id="o8-h" data-hero-part="headline">Every model, charted and priced.</h1>
            <p className="k-body" data-hero-part="sub">Five model families and three temperaments behind one API. Compare context, behaviour and per-token rates before you spend a single token.</p>
            <div data-hero-part="cta"><a className="o8-btn" href="#ephemeris" data-cta="primary" data-magnetic="6,0.1,0.86,0.4"><span data-magnetic-label>Get your API key</span></a></div>
            <p className="o8-trust" data-hero-part="trust">Rates published for all five families, from <b>$0.08</b> to <b>$6.00</b> per million tokens. Sample rates.</p>
          </div>
        </section>

        <section id="sky" data-section aria-labelledby="o8-s">
          <div className="k-wrap o8-intro">
            <h2 id="o8-s" className="o8-h2" data-reveal>Most model menus are fog. Here, every star is labelled.</h2>
            <ul className="o8-rows" data-stagger>
              {PROBLEM.rows.map((r, i) => <li key={i}><span className="was">{r.problem}</span><span className="now">{r.solution}</span></li>)}
            </ul>
          </div>
          <Planisphere />
        </section>

        <section id="instruments" data-section aria-labelledby="o8-i">
          <div className="k-wrap">
            <h2 id="o8-i" className="o8-h2" data-reveal>Instruments, and what each one shows you.</h2>
            <div className="o8-bento" data-stagger>
              {BENEFITS.map((b, i) => (
                <article key={b.key} className={`o8-card k-card i${i}`} data-spot>
                  <svg viewBox="0 0 64 64" aria-hidden className="glyph"><circle cx="32" cy="32" r="28" /><circle cx="32" cy="32" r={10 + i * 3} /><circle cx={32 + Math.cos(i) * 28} cy={32 + Math.sin(i) * 28} r="3" className="dot" /></svg>
                  <span className="tag">{b.feature}</span>
                  <h3>{b.benefit}</h3>
                  <p>{b.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="log" data-section aria-labelledby="o8-l">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="o8-l" className="o8-h2 o8-rail-h" data-reveal>Your first night of observing.</h2></div>
              <ol className="o8-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="o8-step k-card">
                    <span className="n">Entry {["I", "II", "III"][i]}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {i === 1 && <pre><code>{STEP_CODE}</code></pre>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="reports" data-section aria-labelledby="o8-r">
          <div className="k-wrap">
            <h2 id="o8-r" className="o8-h2" data-reveal>Field reports.</h2>
            <div className="o8-reports" data-stagger>
              {PROOF.map((p) => (
                <figure key={p.role} className="o8-report k-card">
                  <blockquote>“{p.quote}”</blockquote>
                  <figcaption><b>{p.role}</b><span>{p.focus}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="o8-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="ephemeris" data-section aria-labelledby="o8-e">
          <div className="k-wrap">
            <h2 id="o8-e" className="o8-h2" data-reveal>The ephemeris: every rate, in plain sight.</h2>
            <div className="o8-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`o8-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}<span> {p.cadence}</span></p>
                  <p className="body">{p.body}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum spend. Pay for tokens as you use them." : p.name === "Pro" ? "Cancel any time." : "No card required."}</p>
                </article>
              ))}
            </div>
            <table className="o8-table" data-reveal>
              <caption>Per 1M tokens</caption>
              <thead><tr><th scope="col">Family</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
              <tbody>{MODELS.map((m) => <tr key={m.id}><th scope="row">{m.name}</th><td>{m.context}</td><td>${m.inPrice.toFixed(2)}</td><td>${m.cached.toFixed(2)}</td><td>${m.outPrice.toFixed(2)}</td></tr>)}</tbody>
            </table>
            <p className="o8-fine">{PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="o8-f">
          <div className="k-wrap o8-final">
            <h2 id="o8-f" className="o8-h2" data-reveal>The whole sky, on one key.</h2>
            <a className="o8-btn" href="#main" data-magnetic="6,0.1,0.86,0.4" data-reveal><span data-magnetic-label>Get your API key</span></a>
          </div>
        </section>
      </main>
      <footer className="o8-foot">
        <div><p className="o8-mark big"><span aria-hidden>✦</span> {BRAND.name}</p><p>{MOCK_NOTE}. Brand name is a placeholder.</p></div>
        <div><h3>Constellations</h3>{MODELS.map((m) => <a key={m.id} href="#sky">{m.name}</a>)}</div>
        <div><h3>Observatory</h3><a href="#instruments">Instruments</a><a href="#log">API quickstart</a><a href="#ephemeris">Token rates</a></div>
        <div><h3>Lab</h3><a href="/designs">Back to the gallery</a></div>
      </footer>
    </div>
  );
}
