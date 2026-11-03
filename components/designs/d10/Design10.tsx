"use client";

/**
 * 10 Live Wire (v3) — the homepage is the product.
 * Hero: a working command panel — the router suggests a model and temperament as you type
 * and estimates tokens and cost live; Run streams a mock answer with its receipt.
 * Signature: a pinned workspace where scroll docks four live panels (chat, compare, agent, usage).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROMPTS, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { useStream } from "@/lib/hooks";
import { clamp, onScroll, progress, reduced, useKit } from "@/lib/kit";

const OUT: Record<string, number> = { core: 420, unbound: 420, forge: 1200, atlas: 640, swift: 80 };
function route(text: string) {
  const t = text.toLowerCase();
  if (/code|bug|refactor|test|function|repo|typescript|python|retry/.test(t)) return { id: "forge", why: "mentions code" };
  if (/contract|book|archive|files|pdf|document|whole|40 files/.test(t)) return { id: "atlas", why: "long documents" };
  if (/dark|villain|horror|red.?team|no lecture|uncensored|abliterat/.test(t)) return { id: "unbound", why: "asks for fewer refusals" };
  if (/extract|classify|tag|json|one word|quick|autocomplete/.test(t)) return { id: "swift", why: "short, structured task" };
  return { id: "core", why: "general request" };
}

function Console() {
  const [text, setText] = useState(PROMPTS[1].prompt);
  const [run, setRun] = useState(0);
  const r = route(text);
  const model = MODELS.find((m) => m.id === r.id)!;
  const inTok = Math.max(1, Math.ceil(text.length / 4)) + 120;
  const cost = estimateCost(model, inTok, OUT[r.id]);
  const answer = PROMPTS.find((p) => p.prompt === text)?.response ?? `Routed to ${model.name} because the prompt ${r.why}. This is a mock response for the design preview — no model was called.`;
  const { out, done } = useStream(answer, run, 22, run > 0);
  return (
    <div className="w10-console" data-hero-part="visual">
      <div className="w10-bar"><span className="dot" aria-hidden /><span>{BRAND.name.toLowerCase()} · router</span><span className="kbd">⌘ K</span></div>
      <label className="k-sr" htmlFor="w10-in">Prompt</label>
      <textarea id="w10-in" value={text} onChange={(e) => setText(e.target.value)} rows={2} spellCheck={false} />
      <div className="w10-route" aria-live="polite">
        <span className="chip on">{model.name}</span>
        <span className="why">{r.why}</span>
        <span className="est"><b>{inTok.toLocaleString("en-US")}</b> in · <b>~{OUT[r.id]}</b> out · <b className="live">{fmtUSD(cost)}</b></span>
      </div>
      <div className="w10-ex">
        {PROMPTS.map((p) => <button key={p.label} onClick={() => setText(p.prompt)} aria-pressed={text === p.prompt}>{p.label}</button>)}
        <button className="run" onClick={() => setRun((n) => n + 1)}>Run ↵</button>
      </div>
      {run > 0 && <p className="w10-out">{out}{!done && <span className="caret" aria-hidden />}{done && <span className="rcpt">{inTok + OUT[r.id]} tokens · {fmtUSD(cost)} · sample rates</span>}</p>}
    </div>
  );
}

const PANELS = ["Chat", "Compare", "Agent", "Usage"] as const;

function Workspace() {
  const run = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => onScroll(() => setP(reduced() ? 1 : clamp((progress(run.current!) - 0.04) / 0.86))), []);
  const open = Math.min(4, Math.floor(p * 4.6));
  const active = Math.min(3, Math.max(0, open - 1));
  const spend = useMemo(() => Array.from({ length: 24 }, (_, i) => 0.4 + Math.sin(i * 0.7) * 0.18 + i * 0.03), []);
  return (
    <div className="w10-run" ref={run}>
      <div className="w10-pin">
        <ol className="w10-tabs" aria-label="Workspace panels">{PANELS.map((n, i) => <li key={n} className={i === active && open > 0 ? "on" : ""}>{n}</li>)}</ol>
        <div className="w10-ws">
          <section className={`w10-panel chat ${open > 0 ? "open" : ""} ${active === 0 ? "act" : ""}`} aria-label="Chat panel">
            <h3>Chat <span>Core → Unbound, same thread</span></h3>
            <p className="you">Make the villain's monologue colder.</p>
            <p className="ai">"You mistake mercy for weakness. I mistake nothing."</p>
            <p className="meta">96 tokens · {fmtUSD(estimateCost(MODELS[1], 60, 36))}</p>
          </section>
          <section className={`w10-panel cmp ${open > 1 ? "open" : ""} ${active === 1 ? "act" : ""}`} aria-label="Compare panel">
            <h3>Compare <span>one prompt, three models</span></h3>
            {MODELS.slice(0, 3).map((m, i) => <div key={m.id} className="row"><b>{m.name}</b><i style={{ transform: `scaleX(${[0.62, 0.8, 0.94][i]})` }} /><span>{fmtUSD(estimateCost(m, 300, 200))}</span></div>)}
          </section>
          <section className={`w10-panel agent ${open > 2 ? "open" : ""} ${active === 2 ? "act" : ""}`} aria-label="Agent panel">
            <h3>Agent <span>forge-256k</span></h3>
            <ol>{["Read 38 files", "Planned retry with backoff", "Edited 2 files, +59 −6", "214 tests passing"].map((l, i) => <li key={l} style={{ ["--i" as string]: i }}>{l}</li>)}</ol>
          </section>
          <section className={`w10-panel usage ${open > 3 ? "open" : ""} ${active === 3 ? "act" : ""}`} aria-label="Usage panel">
            <h3>Usage <span>this month, sample</span></h3>
            <svg viewBox="0 0 240 70" aria-hidden><polyline points={spend.map((v, i) => `${i * 10.4},${(70 - v * 60).toFixed(1)}`).join(" ")} /></svg>
            <dl><div><dt>Tokens</dt><dd>48.2M</dd></div><div><dt>Cached</dt><dd>61%</dd></div><div><dt>Spend</dt><dd className="live">$41.90</dd></div></dl>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function Design10() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  return (
    <div ref={root} className="kit d10">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="w10-nav">
        <a className="w10-mark" href="#main"><span aria-hidden />{BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#workspace">Workspace</a><a href="#features">Features</a><a href="#start">Start</a><a href="#people">People</a><a href="#pricing">Pricing</a></nav>
        <a className="w10-sign" href="#pricing">Sign in</a>
      </header>
      <main id="main">
        <section className="w10-hero" data-hero aria-labelledby="w10-h">
          <div className="w10-copy">
            <h1 id="w10-h" data-hero-part="headline">Type a task, see the price.</h1>
            <p className="k-body" data-hero-part="sub">The router reads your prompt, suggests a model family and temperament, and estimates tokens and cost before you press enter.</p>
            <div data-hero-part="cta"><a className="w10-btn" href="#pricing" data-cta="primary" data-magnetic="5,0.18,0.7,0.4"><span data-magnetic-label>Create your API key</span></a></div>
            <p className="w10-trust" data-hero-part="trust"><span className="pulse" aria-hidden />The estimate on the right is live — edit the prompt and watch it change.</p>
          </div>
          <Console />
        </section>

        <section id="workspace" data-section aria-labelledby="w10-w">
          <div className="k-wrap w10-split">
            <h2 id="w10-w" className="w10-h2" data-reveal>Everything you use AI for, in one live workspace.</h2>
            <ul className="w10-fix" data-stagger>{PROBLEM.rows.map((r, i) => <li key={i}><span className="was">{r.problem}</span><span className="now">{r.solution}</span></li>)}</ul>
          </div>
          <Workspace />
        </section>

        <section id="features" data-section aria-labelledby="w10-f">
          <div className="k-wrap">
            <h2 id="w10-f" className="w10-h2" data-reveal>Features that pay you back.</h2>
            <div className="w10-bento" data-stagger>
              {BENEFITS.map((b, i) => (
                <article key={b.key} className={`w10-card k-card b${i}`} data-spot>
                  <span className="tag">{b.feature}</span>
                  <h3>{b.benefit}</h3>
                  <p>{b.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="start" data-section aria-labelledby="w10-s">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="w10-s" className="w10-h2 w10-rail-h" data-reveal>Running in three steps.</h2></div>
              <ol className="w10-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="w10-step k-card">
                    <span className="n">{i + 1}/3</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {i === 1 && <pre><code>{STEP_CODE}</code></pre>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="people" data-section aria-labelledby="w10-p">
          <div className="k-wrap">
            <h2 id="w10-p" className="w10-h2" data-reveal>Who is already in the workspace.</h2>
            <div className="w10-people" data-stagger>
              {PROOF.map((p) => (
                <figure key={p.role} className="w10-msg k-card">
                  <figcaption><span className="av" aria-hidden>{p.role[0]}</span><b>{p.role}</b><span>{p.focus}</span></figcaption>
                  <blockquote>{p.quote}</blockquote>
                </figure>
              ))}
            </div>
            <p className="w10-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="pricing" data-section aria-labelledby="w10-pr">
          <div className="k-wrap">
            <h2 id="w10-pr" className="w10-h2" data-reveal>Plans, and the per-token rates behind them.</h2>
            <div className="w10-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`w10-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}<span> {p.cadence}</span></p>
                  <p className="body">{p.body}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum. Set a monthly cap per key." : p.name === "Pro" ? "Cancel any time." : "No card required."}</p>
                </article>
              ))}
            </div>
            <div className="w10-rates" data-reveal>{MODELS.map((m) => <div key={m.id}><b>{m.name}</b><span>{m.context}</span><span>in ${m.inPrice.toFixed(2)}</span><span>out ${m.outPrice.toFixed(2)}</span></div>)}</div>
            <p className="w10-fine">Per 1M tokens. {PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="w10-z">
          <div className="k-wrap w10-final">
            <h2 id="w10-z" className="w10-h2" data-reveal>It's already running. Bring a task.</h2>
            <a className="w10-btn" href="#main" data-magnetic="5,0.18,0.7,0.4" data-reveal><span data-magnetic-label>Create your API key</span></a>
          </div>
        </section>
      </main>
      <footer className="w10-foot">
        <div><p className="w10-mark"><span aria-hidden />{BRAND.name}</p><p>{MOCK_NOTE}. Brand name is a placeholder.</p></div>
        <div><h3>Product</h3><a href="#workspace">Workspace</a><a href="#features">Agents</a><a href="#pricing">Pricing</a></div>
        <div><h3>Developers</h3><a href="#start">Quickstart</a><a href="#pricing">Token rates</a></div>
        <div><h3>Lab</h3><a href="/designs">Back to the gallery</a></div>
      </footer>
    </div>
  );
}
