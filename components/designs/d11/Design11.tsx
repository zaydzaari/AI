"use client";

/**
 * 11 Obsidian (v3) — ultra-premium dark glass.
 * Hero: a machined titanium API-key card with pointer-driven specular light.
 * Signature: a scroll-scrubbed token stream — scroll decides how many tokens have arrived,
 * while a precise usage meter counts completion tokens and cost. Bento holds a
 * keyboard-accessible before/after wipe between Standard and Abliterated answers.
 */

import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, CODE, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { clamp, onScroll, pointer, progress, reduced, useKit } from "@/lib/kit";

const STREAM = "Short answer: yes. Cache the system prompt and the reference document, keep the user's question last, and you will pay the cached rate for everything that repeats. On a 9,000-token prefix that repeats on every call, most of your input bill moves to the lower rate. Streaming and tool calls behave exactly as before — only the bill changes.".split(/(\s+)/);
const WORDS = STREAM.filter((w) => w.trim()).length;
const FORGE = MODELS.find((m) => m.id === "forge")!;

function KeyCard() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let raf = 0, x = 0, y = 0;
    const tick = () => {
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const tx = pointer.active ? clamp((pointer.x - r.left) / r.width, -0.2, 1.2) - 0.5 : 0.15;
      const ty = pointer.active ? clamp((pointer.y - r.top) / r.height, -0.2, 1.2) - 0.5 : -0.1;
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      el.style.setProperty("--rx", `${(-y * 14).toFixed(2)}deg`); el.style.setProperty("--ry", `${(x * 18).toFixed(2)}deg`);
      el.style.setProperty("--lx", `${((x + 0.5) * 100).toFixed(1)}%`); el.style.setProperty("--ly", `${((y + 0.5) * 100).toFixed(1)}%`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="o11-stage" data-hero-part="visual">
      <div className="o11-card" ref={ref} role="img" aria-label="A titanium card engraved with an API key">
        <span className="chip" aria-hidden />
        <span className="brand">{BRAND.name}</span>
        <span className="key">ae_live_7f3a····························91c</span>
        <span className="meta"><span>5 families</span><span>per-token</span></span>
        <span className="sheen" aria-hidden />
      </div>
      <div className="o11-slab" aria-hidden />
    </div>
  );
}

function Stream() {
  const run = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => onScroll(() => setN(reduced() ? WORDS : Math.round(clamp((progress(run.current!) - 0.06) / 0.76) * WORDS))), []);
  let seen = 0;
  const prompt = 9420, cached = 9000;
  const cost = estimateCost(FORGE, prompt, Math.round(n * 1.3), cached / prompt);
  const done = n >= WORDS;
  return (
    <div className="o11-run" ref={run}>
      <div className="o11-pin">
        <div className="o11-pane">
          <p className="o11-req"><span>POST /v1/chat/completions</span><span>model: forge-256k · stream: true</span></p>
          <p className="o11-q">Will prompt caching change how I structure my calls?</p>
          <p className="o11-txt" aria-live="off">
            {STREAM.map((w, i) => {
              if (!w.trim()) return w;
              seen++;
              return <span key={i} className={seen <= n ? "on" : ""}>{w}</span>;
            })}
            {!done && <span className="cur" aria-hidden />}
          </p>
          <pre className={`o11-usage ${done ? "show" : ""}`}><code>{`"usage": {\n  "prompt_tokens": ${prompt},\n  "cached_tokens": ${cached},\n  "completion_tokens": ${Math.round(WORDS * 1.3)},\n  "cost_usd": ${estimateCost(FORGE, prompt, Math.round(WORDS * 1.3), cached / prompt).toFixed(5)}\n}`}</code></pre>
        </div>
        <aside className="o11-meter" aria-live="polite">
          <p className="lbl">Metered as it streams</p>
          <dl>
            <div><dt>Completion tokens</dt><dd className="live">{Math.round(n * 1.3)}</dd></div>
            <div><dt>Cached prompt</dt><dd>{cached.toLocaleString("en-US")}</dd></div>
            <div><dt>Running cost</dt><dd className="live">{fmtUSD(cost)}</dd></div>
          </dl>
          <span className="bar"><i style={{ transform: `scaleX(${(n / WORDS).toFixed(3)})` }} /></span>
          <p className="fine">Forge sample rates. {PRICE_NOTE}</p>
        </aside>
      </div>
    </div>
  );
}

const STD = "I can explain the general idea of the exploit chain, but I'll leave out specifics that could be misused.";
const ABL = "Step one is the type confusion in the parser; here is the full chain for your lab report, with the patch at the end.";

function Wipe() {
  const [v, setV] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const set = (clientX: number) => { const r = box.current!.getBoundingClientRect(); setV(Math.round(clamp((clientX - r.left) / r.width) * 100)); };
  return (
    <div className="o11-wipe" ref={box} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX); }} onPointerMove={(e) => e.buttons && set(e.clientX)}>
      <p className="side a"><b>Standard</b>{STD}</p>
      <p className="side b" style={{ clipPath: `inset(0 0 0 ${v}%)` }}><b>Abliterated</b>{ABL}</p>
      <span className="handle" style={{ left: `${v}%` }} role="slider" tabIndex={0} aria-label="Compare Standard and Abliterated answers" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v}
        onKeyDown={(e) => { if (e.key === "ArrowLeft") setV((x) => Math.max(0, x - 5)); if (e.key === "ArrowRight") setV((x) => Math.min(100, x + 5)); }} />
    </div>
  );
}

export default function Design11() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  return (
    <div ref={root} className="kit d11">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="o11-nav">
        <a className="o11-mark" href="#main">{BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#precision">Precision</a><a href="#materials">Materials</a><a href="#integrate">Integrate</a><a href="#clients">Clients</a><a href="#pricing">Pricing</a></nav>
        <a className="o11-docs" href="#integrate">Docs</a>
      </header>
      <main id="main">
        <section className="o11-hero" data-hero aria-labelledby="o11-h">
          <div className="o11-copy">
            <h1 id="o11-h" data-hero-part="headline">One key. Every model. Precisely metered.</h1>
            <p className="k-body" data-hero-part="sub">An OpenAI-style API for five model families and three temperaments — streaming, tool calls, prompt caching, and the exact cost on every response.</p>
            <div data-hero-part="cta"><a className="o11-btn" href="#pricing" data-cta="primary" data-magnetic="5,0.14,0.8,0.35"><span data-magnetic-label>Get your API key</span></a></div>
            <p className="o11-trust" data-hero-part="trust"><span className="dot" aria-hidden /><span>Cached input from <b>$0.02</b> per million tokens. Sample rates.</span></p>
          </div>
          <KeyCard />
        </section>

        <section id="precision" data-section aria-labelledby="o11-p">
          <div className="k-wrap o11-split">
            <h2 id="o11-p" className="o11-h2" data-reveal>Precision you can read on every response.</h2>
            <ul className="o11-list" data-stagger>{PROBLEM.rows.map((r, i) => <li key={i}><span className="was">{r.problem}</span><span className="now">{r.solution}</span></li>)}</ul>
          </div>
          <Stream />
        </section>

        <section id="materials" data-section aria-labelledby="o11-m">
          <div className="k-wrap">
            <h2 id="o11-m" className="o11-h2" data-reveal>Materials, and what they do for you.</h2>
            <div className="o11-bento" data-stagger>
              <article className="o11-glass k-card wipe" data-spot>
                <span className="tag">Three temperaments</span>
                <h3>Drag to compare the same answer, two temperaments.</h3>
                <Wipe />
              </article>
              {BENEFITS.filter((b) => b.key !== "variants").map((b, i) => (
                <article key={b.key} className={`o11-glass k-card g${i}`} data-spot>
                  <span className="tag">{b.feature}</span>
                  <h3>{b.benefit}</h3>
                  <p>{b.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="integrate" data-section aria-labelledby="o11-i">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="o11-i" className="o11-h2 o11-rail-h" data-reveal>Integrate in three steps.</h2></div>
              <ol className="o11-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="o11-glass o11-step k-card">
                    <span className="n">0{i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    <pre><code>{i === 0 ? `model: "core-128k:low-refusal"` : i === 1 ? STEP_CODE : CODE.curl}</code></pre>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="clients" data-section aria-labelledby="o11-c">
          <div className="k-wrap">
            <h2 id="o11-c" className="o11-h2" data-reveal>Chosen by people who read the invoice.</h2>
            <div className="o11-quotes" data-stagger>
              {PROOF.map((p) => (
                <figure key={p.role} className="o11-glass k-card">
                  <blockquote>“{p.quote}”</blockquote>
                  <figcaption><b>{p.role}</b><span>{p.focus}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="o11-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="pricing" data-section aria-labelledby="o11-pr">
          <div className="k-wrap">
            <h2 id="o11-pr" className="o11-h2" data-reveal>Pricing, engraved per token.</h2>
            <div className="o11-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`o11-glass o11-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}<span> {p.cadence}</span></p>
                  <p className="body">{p.body}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum spend. Usage billed to the token." : p.name === "Pro" ? "Cancel any time." : "No card required."}</p>
                </article>
              ))}
            </div>
            <table className="o11-table" data-reveal>
              <caption>Per 1M tokens</caption>
              <thead><tr><th scope="col">Model</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
              <tbody>{MODELS.map((m) => <tr key={m.id}><th scope="row">{m.name}</th><td>{m.context}</td><td>${m.inPrice.toFixed(2)}</td><td>${m.cached.toFixed(2)}</td><td>${m.outPrice.toFixed(2)}</td></tr>)}</tbody>
            </table>
            <p className="o11-fine">{PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="o11-f">
          <div className="k-wrap o11-final">
            <h2 id="o11-f" className="o11-h2" data-reveal>Your key is waiting.</h2>
            <a className="o11-btn" href="#main" data-magnetic="5,0.14,0.8,0.35" data-reveal><span data-magnetic-label>Get your API key</span></a>
          </div>
        </section>
      </main>
      <footer className="o11-foot">
        <div><p className="o11-mark">{BRAND.name}</p><p>{MOCK_NOTE}. Brand name is a placeholder.</p></div>
        <div><h4>Models</h4>{MODELS.map((m) => <a key={m.id} href="#pricing">{m.name}</a>)}</div>
        <div><h4>API</h4><a href="#integrate">Quickstart</a><a href="#precision">Usage metering</a><a href="#pricing">Rates</a></div>
        <div><h4>Lab</h4><a href="/designs">Back to the gallery</a></div>
      </footer>
    </div>
  );
}
