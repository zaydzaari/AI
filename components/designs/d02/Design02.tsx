"use client";

/**
 * 02 Graphite (v3) — Abliteration-inspired technical luxury.
 * Signature: "Projection". A pinned activation field where scrolling projects the
 * refusal direction out of every vector (v' = v − p·(v·r)r) while the same prompt's
 * answer moves from Standard → Low-refusal → Abliterated.
 */

import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, CODE, MODELS, PLANS, PRICE_NOTE, PROOF, PROOF_NOTE, STEPS, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { clamp, fitCanvas, loop, onScroll, pointer, progress, reduced, smooth, useKit } from "@/lib/kit";
import { GlyphField } from "./GlyphField";

const ANSWERS = [
  { t: "Standard", body: "I can write the heist scene, but I'll keep how the alarm is disabled vague and add a note about real-world security.", toks: 31 },
  { t: "Low-refusal", body: "Nadia counts the relay clicks under her breath — three, then a gap, then two. When the gap comes, Teo cuts the wrong wire on purpose, and the panel goes quiet.", toks: 38 },
  { t: "Abliterated", body: "No preamble, no caveats: the full scene, in the voice you asked for, with the crew's plan laid out beat by beat. What you publish stays your policy.", toks: 33 },
];

function HeaderTrust() {
  const [n, setN] = useState(412);
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(() => setN((v) => (v > 1900 ? 412 : v + 7 + Math.floor(Math.random() * 9))), 90);
    return () => clearInterval(t);
  }, []);
  const c = estimateCost(MODELS[0], 180, n);
  return (
    <div className="g2-trust" data-hero-part="trust">
      <code><span>x-{BRAND.name.toLowerCase()}-tokens</span> {n}</code>
      <code><span>x-{BRAND.name.toLowerCase()}-cost-usd</span> <b>{c.toFixed(5)}</b></code>
      <p>Every response carries its own token count and cost. Sample rates.</p>
    </div>
  );
}

function Projection() {
  const run = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(0);
  const [pct, setPct] = useState(0);
  const pRef = useRef(0);
  useEffect(() => {
    const el = run.current!, c = cv.current!;
    const { s, stop } = fitCanvas(c);
    const N = 26, M = 15;
    const field = Array.from({ length: N * M }, (_, i) => {
      const x = (i % N) / (N - 1), y = Math.floor(i / N) / (M - 1);
      const a = Math.sin(x * 5.3 + y * 2.1) * 0.9 + Math.cos(y * 4.7 - x * 1.3) * 0.6;
      const refusal = 0.55 + 0.45 * Math.sin(x * 3 + y * 6);
      return { x, y, a, refusal };
    });
    const R = { x: Math.cos(-0.9), y: Math.sin(-0.9) };
    const offScroll = onScroll(() => {
      const p = reduced() ? 1 : clamp((progress(el) - 0.08) / 0.74);
      pRef.current = p;
      setStage(p < 0.34 ? 0 : p < 0.72 ? 1 : 2);
      setPct(Math.round(smooth(p) * 100));
    });
    const offLoop = loop(c, (t) => {
      const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const p = smooth(pRef.current);
      const gx = w / (N + 1), gy = h / (M + 1), L = Math.min(gx, gy) * 0.42;
      const r = c.getBoundingClientRect();
      const px = pointer.active ? pointer.x - r.left : -999, py = pointer.active ? pointer.y - r.top : -999;
      for (const f of field) {
        const cx = gx * (1 + f.x * (N - 1)), cy = gy * (1 + f.y * (M - 1));
        const wob = reduced() ? 0 : Math.sin(t * 0.8 + f.x * 6 + f.y * 4) * 0.12;
        let vx = Math.cos(f.a + wob) * 0.6 + R.x * f.refusal, vy = Math.sin(f.a + wob) * 0.6 + R.y * f.refusal;
        const d = vx * R.x + vy * R.y;
        vx -= p * d * R.x; vy -= p * d * R.y;
        const dist = Math.hypot(cx - px, cy - py);
        const hot = dist < 120 ? 1 - dist / 120 : 0;
        const mag = Math.hypot(vx, vy) || 1;
        const ux = vx / mag, uy = vy / mag;
        const refusalShare = Math.abs(d) * (1 - p);
        ctx.strokeStyle = hot > 0 ? `rgba(142,162,255,${0.4 + hot * 0.6})` : refusalShare > 0.5 ? `rgba(201,183,156,${0.35 + refusalShare * 0.35})` : "rgba(242,239,233,0.42)";
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(cx - ux * L, cy - uy * L); ctx.lineTo(cx + ux * L, cy + uy * L); ctx.stroke();
        ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(cx + ux * L, cy + uy * L, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      // the refusal direction itself, fading as it is projected out
      ctx.globalAlpha = 1 - p;
      ctx.strokeStyle = "#C9B79C"; ctx.setLineDash([6, 6]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w * 0.5 - R.x * h * 0.6, h * 0.5 - R.y * h * 0.6); ctx.lineTo(w * 0.5 + R.x * h * 0.6, h * 0.5 + R.y * h * 0.6); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;
    });
    return () => { stop(); offScroll(); offLoop(); };
  }, []);
  const a = ANSWERS[stage];
  return (
    <div className="g2-run" ref={run}>
      <div className="g2-pin">
        <figure className="g2-field">
          <canvas ref={cv} role="img" aria-label="An activation field; scrolling removes the refusal direction from every vector" />
          <figcaption><span>r̂ refusal direction</span><span>projected out: <b className="live">{pct}%</b></span></figcaption>
        </figure>
        <div className="g2-answer" aria-live="polite">
          <p className="g2-prompt"><span>prompt</span>Write the scene where the heist crew silences the vault alarm.</p>
          <ol className="g2-tabs">{ANSWERS.map((x, i) => <li key={x.t} className={i === stage ? "on" : ""}><code>core-128k{i === 0 ? "" : `:${x.t.toLowerCase()}`}</code></li>)}</ol>
          <p className="g2-reply" key={stage}>{a.body}</p>
          <p className="g2-meta"><span>{a.toks} output tokens</span><span>{fmtUSD(estimateCost(MODELS[stage === 2 ? 1 : 0], 22, a.toks))}</span><span>same endpoint · same SDK</span></p>
        </div>
      </div>
    </div>
  );
}

function RateView() {
  const [json, setJson] = useState(false);
  const rows = MODELS.map((m) => ({ model: `${m.id}-${m.context.toLowerCase()}`, input: m.inPrice, cached: m.cached, output: m.outPrice, variants: m.variants.map((v) => v.toLowerCase()) }));
  return (
    <div className="g2-rates" data-reveal>
      <div className="g2-rates-bar">
        <span>GET {BRAND.apiBase}/models — per 1M tokens, sample</span>
        <div role="group" aria-label="View as">
          <button aria-pressed={!json} onClick={() => setJson(false)}>Table</button>
          <button aria-pressed={json} onClick={() => setJson(true)}>JSON</button>
        </div>
      </div>
      {json ? (
        <pre className="g2-code"><code>{JSON.stringify(rows, null, 2)}</code></pre>
      ) : (
        <table>
          <thead><tr><th scope="col">model</th><th scope="col">input</th><th scope="col">cached</th><th scope="col">output</th><th scope="col">temperaments</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r.model}><th scope="row">{r.model}</th><td>${r.input.toFixed(2)}</td><td>${r.cached.toFixed(2)}</td><td>${r.output.toFixed(2)}</td><td>{r.variants.join(", ")}</td></tr>)}</tbody>
        </table>
      )}
    </div>
  );
}

export default function Design02() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  return (
    <div ref={root} className="kit d02">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="g2-nav">
        <a className="g2-mark" href="#main"><span aria-hidden>▍</span>{BRAND.name.toLowerCase()}</a>
        <nav data-spy aria-label="Sections"><a href="#projection">Projection</a><a href="#spec">Spec</a><a href="#quickstart">Quickstart</a><a href="#signed">Signed</a><a href="#rates">Rates</a></nav>
        <a className="g2-docs" href="#quickstart">Docs</a>
      </header>
      <main id="main">
        <section className="g2-hero" data-hero aria-labelledby="g2-h">
          <div className="g2-hero-field" data-hero-part="visual" aria-hidden><GlyphField mask="left" cell={20} /></div>
          <div className="g2-hero-copy">
            <code className="g2-cmd">$ curl {BRAND.apiBase}/chat/completions -d {"'{\"model\":\"core-128k:abliterated\"}'"}</code>
            <h1 id="g2-h" data-hero-part="headline">Same model. Minus the second-guessing.</h1>
            <p className="k-body" data-hero-part="sub">Add <code>:low-refusal</code> or <code>:abliterated</code> to a supported model name. Same endpoint, same SDK, billed per token.</p>
            <div data-hero-part="cta"><a className="g2-btn" href="#rates" data-cta="primary" data-magnetic="5,0.2,0.68,0.5"><span data-magnetic-label>Get an API key</span><kbd aria-hidden>K</kbd></a></div>
            <HeaderTrust />
          </div>
        </section>

        <section id="projection" data-section aria-labelledby="g2-p">
          <div className="k-wrap g2-intro">
            <h2 id="g2-p" className="g2-h2" data-reveal>A refusal is a direction. We let you remove it.</h2>
            <div className="g2-why" data-stagger>
              <p className="k-body">Cautious models carry a learned “refusal direction”: an angle in activation space that tips ordinary fiction, red-teaming and research into lectures.</p>
              <p className="k-body">Abliterated variants have that direction projected out at the weights level. Low-refusal variants soften it. Standard keeps it. You choose per request — scroll to watch it go.</p>
            </div>
          </div>
          <Projection />
        </section>

        <section id="spec" data-section aria-labelledby="g2-s">
          <div className="k-wrap">
            <h2 id="g2-s" className="g2-h2" data-reveal>Spec sheet. Feature on the left, what you get on the right.</h2>
            <dl className="g2-spec" data-stagger>
              {BENEFITS.map((b, i) => (
                <div key={b.key} className={`g2-row k-card ${i === 0 ? "wide" : ""}`} data-spot>
                  <dt><span>{String(i + 1).padStart(2, "0")}</span>{b.feature}</dt>
                  <dd><b>{b.benefit}</b><span>{b.detail}</span></dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="quickstart" data-section aria-labelledby="g2-q">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap g2-rail-head"><h2 id="g2-q" className="g2-h2" data-reveal>Three commands to production.</h2><span className="g2-rp" aria-hidden><i /></span></div>
              <ol className="g2-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="g2-step k-card">
                    <span className="n">step {i + 1}/3</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <pre className="g2-code"><code>{i === 0 ? `aether models ls --temperament abliterated\n→ unbound-128k   swift-32k:abliterated` : i === 1 ? CODE.ts : `→ 200 OK  tokens=612  cached=480\n  cost_usd=0.00041  (sample rates)`}</code></pre>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="signed" data-section aria-labelledby="g2-g">
          <div className="k-wrap">
            <h2 id="g2-g" className="g2-h2" data-reveal>Signed off by the people who will use it.</h2>
            <ul className="g2-log" data-stagger>
              {PROOF.map((p, i) => (
                <li key={p.role} className="g2-commit k-card">
                  <code className="h">commit {["7f3a91c", "b20e4d8", "e91c0a2", "4d77f15"][i]}</code>
                  <p className="q">{p.quote}</p>
                  <p className="by"><span>Signed-off-by: {p.role}</span><span>{p.focus}</span></p>
                </li>
              ))}
            </ul>
            <p className="g2-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="rates" data-section aria-labelledby="g2-r">
          <div className="k-wrap">
            <h2 id="g2-r" className="g2-h2" data-reveal>Priced per token. Readable by people and parsers.</h2>
            <div className="g2-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`g2-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price} <span>{p.cadence}</span></p>
                  <p className="body">{p.body}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum spend. Top up or set a hard cap." : p.name === "Pro" ? "Cancel any time. Unused days aren't lost mid-cycle." : "No card required."}</p>
                </article>
              ))}
            </div>
            <RateView />
            <p className="g2-fine">{PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="g2-c">
          <div className="k-wrap g2-final">
            <h2 id="g2-c" className="g2-h2" data-reveal>Change one string. Keep everything else.</h2>
            <a className="g2-btn" href="#main" data-magnetic="5,0.2,0.68,0.5" data-reveal><span data-magnetic-label>Get an API key</span><kbd aria-hidden>K</kbd></a>
          </div>
        </section>
      </main>
      <footer className="g2-foot">
        <p className="g2-word" aria-hidden>{BRAND.name.toLowerCase()}</p>
        <div><h3>Models</h3>{MODELS.map((m) => <a key={m.id} href="#rates">{m.name} · {m.context}</a>)}</div>
        <div><h3>Developers</h3><a href="#quickstart">Quickstart</a><a href="#rates">Rates API</a><a href="#projection">Temperaments</a></div>
        <div><h3>Lab</h3><a href="/designs">Back to the gallery</a><span>{MOCK_NOTE}</span></div>
      </footer>
    </div>
  );
}
