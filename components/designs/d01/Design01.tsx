"use client";

/**
 * 01 Field Notes (v3) — Abracadabra-inspired editorial.
 * A magazine feature about the product: blue-pencil copy-edits, an annotated thread that
 * plays as you scroll (model + temperament switch mid-conversation, live token tally),
 * letters-page testimonials and a classified-style rate card.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { clamp, onScroll, progress, reduced, useKit } from "@/lib/kit";

type Msg = { who: "you" | "model"; model?: string; temper?: string; text: string; inTok: number; outTok: number; note: string };

const THREAD: Msg[] = [
  { who: "you", text: "Draft a cold open for a noir short story set on a night train.", inTok: 24, outTok: 0, note: "Asked in plain language. No special syntax." },
  { who: "model", model: "core", temper: "Standard", text: "The 11:40 out of Union carried four kinds of people: the ones running, the ones chasing, the ones who'd forgotten which — and Mara, who'd bought every seat in car seven.", inTok: 24, outTok: 46, note: "Core answers. Cost is printed on the reply." },
  { who: "you", text: "Darker. Mara should be the one doing the chasing. Don't soften it.", inTok: 96, outTok: 0, note: "Same thread, new temperament: core-128k:low-refusal." },
  { who: "model", model: "core", temper: "Low-refusal", text: "Mara didn't need the seats. She needed the doors — eleven of them, and only one would open before Harlow's stop.", inTok: 96, outTok: 31, note: "Fewer reflexive refusals. Your deployment sets the policy." },
  { who: "you", text: "Turn this into a scene file for my game engine.", inTok: 160, outTok: 0, note: "Switched to Forge mid-thread. The whole story comes along." },
  { who: "model", model: "forge", temper: "Standard", text: "Plan: create scenes/night_train.yaml with 3 beats and 11 door triggers. Writing 1 file, +42 lines. Validating schema… passed.", inTok: 160, outTok: 58, note: "Forge, the coding model. Tool calls work as before." },
];

const modelOf = (id?: string) => MODELS.find((m) => m.id === id) ?? MODELS[0];
const msgCost = (m: Msg) => (m.who === "model" ? estimateCost(modelOf(m.model), m.inTok, m.outTok) : 0);

function HeroClipping() {
  const [i, setI] = useState(1);
  const [chars, setChars] = useState(0);
  const pairs = [1, 3, 5];
  const m = THREAD[pairs[i % 3]];
  const ask = THREAD[pairs[i % 3] - 1];
  useEffect(() => {
    if (reduced()) { setChars(m.text.length); return; }
    setChars(0);
    let n = 0;
    const t = setInterval(() => { n += 2; setChars(n); if (n >= m.text.length) { clearInterval(t); setTimeout(() => setI((v) => v + 1), 2600); } }, 28);
    return () => clearInterval(t);
  }, [i, m.text.length]);
  const model = modelOf(m.model);
  return (
    <div className="d1-clip" data-hero-part="visual" aria-label="A live Aether thread switching models" role="img">
      <span className="tape tl" aria-hidden /><span className="tape br" aria-hidden />
      <div className="d1-clip-bar"><span>Thread · night-train.md</span><span className="chip">{model.name}{m.temper !== "Standard" ? ` :${m.temper!.toLowerCase()}` : ""}</span></div>
      <p className="d1-clip-you">{ask.text}</p>
      <p className="d1-clip-ai">{m.text.slice(0, chars)}<span className="caret" aria-hidden /></p>
      <p className="d1-clip-note" aria-hidden>
        <svg viewBox="0 0 80 30"><path d="M2 26 C 30 26, 40 4, 76 6" /></svg>
        {i % 3 === 2 ? "model switched, thread kept" : i % 3 === 1 ? "temperament changed mid-thread" : "cost on every reply"}
      </p>
    </div>
  );
}

function HeroReceipt() {
  const [n, setN] = useState(0);
  useEffect(() => { const t = setInterval(() => setN((v) => (v + 1) % 3), 4200); return () => clearInterval(t); }, []);
  const m = THREAD[[1, 3, 5][n]];
  return (
    <p className="d1-receipt" data-hero-part="trust">
      <span>Last reply</span>
      <b>{m.outTok + m.inTok} tokens</b>
      <b className="live">{fmtUSD(msgCost(m))}</b>
      <span>at {modelOf(m.model).name} sample rates. Every response reports its own cost.</span>
    </p>
  );
}

function AnnotatedThread() {
  const run = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const el = run.current!;
    if (reduced()) { setStep(THREAD.length); return; }
    return onScroll(() => setStep(Math.min(THREAD.length, Math.floor(clamp((progress(el) - 0.04) / 0.86) * THREAD.length) + 1)));
  }, []);
  useEffect(() => {
    const ol = list.current; if (!ol) return;
    const last = ol.children[step - 1] as HTMLElement | undefined;
    if (!last) return;
    const target = Math.max(0, last.offsetTop + last.offsetHeight - (ol.parentElement!.clientHeight * 0.78));
    ol.style.transform = `translate3d(0, ${-target}px, 0)`;
  }, [step]);
  const shown = THREAD.slice(0, step);
  const tokens = shown.reduce((a, m) => a + (m.who === "model" ? m.inTok + m.outTok : 0), 0);
  const spend = shown.reduce((a, m) => a + msgCost(m), 0);
  const models = new Set(shown.filter((m) => m.model).map((m) => m.model));
  return (
    <div className="d1-run" ref={run}>
      <div className="d1-pin">
        <aside className="d1-tally" aria-live="polite">
          <span className="lbl">Running tally</span>
          <p><b className="live">{tokens.toLocaleString("en-US")}</b> tokens</p>
          <p><b className="live">{fmtUSD(spend)}</b> spent</p>
          <p><b>{models.size}</b> {models.size === 1 ? "model" : "models"}, one thread</p>
          <span className="fine">{PRICE_NOTE}</span>
        </aside>
        <div className="d1-thread-view">
          <ol className="d1-thread" ref={list}>
            {THREAD.map((m, i) => (
              <li key={i} className={`d1-msg ${m.who} ${i < step ? "on" : ""} ${i === step - 1 ? "latest" : ""}`}>
                <div className="bubble">
                  {m.who === "model" && <span className="who">{modelOf(m.model).name}{m.temper !== "Standard" ? ` · ${m.temper}` : ""}</span>}
                  <p>{m.text}</p>
                  {m.who === "model" && <span className="cost">{m.inTok + m.outTok} tokens · {fmtUSD(msgCost(m))}</span>}
                </div>
                <p className="note"><svg viewBox="0 0 64 20" aria-hidden><path d={m.who === "you" ? "M62 10 C 40 10, 30 2, 2 4" : "M2 10 C 24 10, 34 18, 62 16"} /></svg>{m.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default function Design01() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  const rates = useMemo(() => MODELS.map((m) => ({ ...m, sample: estimateCost(m, 2000, 600) })), []);
  return (
    <div ref={root} className="kit d01">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="d1-nav">
        <a className="d1-mark" href="#main">{BRAND.name} <i>Field Notes</i></a>
        <nav data-spy aria-label="Sections">
          <a href="#edit">The edit</a><a href="#features">Contents</a><a href="#how">How it works</a><a href="#letters">Letters</a><a href="#rates">Rate card</a>
        </nav>
        <span className="d1-issue">Issue 01 · concept</span>
      </header>

      <main id="main">
        <section className="d1-hero" data-hero aria-labelledby="d1-h">
          <div className="d1-hero-copy">
            <p className="d1-folio">A working journal of {BRAND.name}, the AI platform sold by the token</p>
            <h1 id="d1-h" data-hero-part="headline">Every model, priced to the token.</h1>
            <p className="k-body d1-sub" data-hero-part="sub">Chat or call the API across five model families — standard, low-refusal or abliterated — and read exactly what each answer cost.</p>
            <div data-hero-part="cta"><a className="d1-btn" href="#rates" data-cta="primary" data-magnetic="6,0.15,0.76,0.4"><span data-magnetic-label>Start your first thread</span></a></div>
            <HeroReceipt />
          </div>
          <HeroClipping />
        </section>

        <section id="edit" data-section aria-labelledby="d1-edit">
          <div className="k-wrap d1-edit">
            <h2 id="d1-edit" className="d1-h2" data-reveal>We took the usual AI setup and edited it.</h2>
            <ol className="d1-marks">
              {PROBLEM.rows.map((r, i) => (
                <li key={i} data-reveal style={{ ["--i" as string]: i }}>
                  <p className="was"><span>{r.problem}</span></p>
                  <p className="now"><span className="caret" aria-hidden>‸</span>{r.solution}</p>
                </li>
              ))}
            </ol>
            <p className="k-body k-muted d1-lead" data-reveal>Below, one real-looking thread plays out as you scroll: a writer asks, changes the temperament, then hands the scene to the coding model — without starting over.</p>
          </div>
          <AnnotatedThread />
        </section>

        <section id="features" data-section aria-labelledby="d1-f">
          <div className="k-wrap">
            <div className="d1-contents-head"><h2 id="d1-f" className="d1-h2" data-reveal>In this issue: what you get from each feature.</h2></div>
            <div className="d1-bento" data-stagger>
              {BENEFITS.map((b, i) => (
                <article key={b.key} className={`d1-card k-card c${i}`} data-spot>
                  <span className="pg">p. {String(12 + i * 7).padStart(2, "0")}</span>
                  <h3>{b.benefit}</h3>
                  <p><b>{b.feature}.</b> {b.detail}</p>
                  {i === 0 && <pre className="d1-code" aria-label="Example request"><code>{`model: "core-128k"        → "unbound-128k"\nthread_id: "night-train"   (unchanged)`}</code></pre>}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" data-section aria-labelledby="d1-how">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap d1-rail-head"><h2 id="d1-how" className="d1-h2" data-reveal>Three steps to your first billed token.</h2><span className="d1-meter" aria-hidden /></div>
              <ol className="d1-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className="d1-step k-card">
                    <span className="n">Step {i + 1} of 3</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {i === 1 && <pre className="d1-code"><code>{STEP_CODE}</code></pre>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="letters" data-section aria-labelledby="d1-l">
          <div className="k-wrap">
            <h2 id="d1-l" className="d1-h2" data-reveal>Letters from the people it is for.</h2>
            <div className="d1-letters" data-stagger>
              {PROOF.map((p) => (
                <figure key={p.role} className="d1-letter k-card">
                  <figcaption><b>{p.role}</b><span>on {p.focus.toLowerCase()}</span></figcaption>
                  <blockquote>“{p.quote}”</blockquote>
                  <span className="ph">Placeholder letter</span>
                </figure>
              ))}
            </div>
            <p className="d1-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="rates" data-section aria-labelledby="d1-r">
          <div className="k-wrap">
            <h2 id="d1-r" className="d1-h2" data-reveal>The rate card. Per token, printed in full.</h2>
            <div className="d1-plans" data-stagger>
              {PLANS.map((p) => (
                <article key={p.name} className={`d1-plan k-card ${p.featured ? "feat" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}<span>{p.cadence}</span></p>
                  <p className="body">{p.body}</p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum spend. Cached prompts billed at the cached rate automatically." : p.name === "Pro" ? "Cancel any time from settings." : "No card needed to start."}</p>
                  <a className="d1-ghost" href="#final">Choose {p.name}</a>
                </article>
              ))}
            </div>
            <table className="d1-rates" data-reveal>
              <caption>Per 1M tokens — sample rates</caption>
              <thead><tr><th scope="col">Model</th><th scope="col">Role</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th><th scope="col">A 2K-in / 600-out request</th></tr></thead>
              <tbody>{rates.map((m) => <tr key={m.id}><th scope="row">{m.name}</th><td>{m.role}</td><td>{m.context}</td><td>${m.inPrice.toFixed(2)}</td><td>${m.cached.toFixed(2)}</td><td>${m.outPrice.toFixed(2)}</td><td>{fmtUSD(m.sample)}</td></tr>)}</tbody>
            </table>
            <p className="d1-fine">{PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="d1-c">
          <div className="k-wrap d1-final">
            <h2 id="d1-c" className="d1-h2" data-reveal>Your next draft can talk to every model.</h2>
            <p className="k-body k-muted" data-reveal>Open a thread for free, or take an API key and pay only for the tokens you use.</p>
            <a className="d1-btn" href="#main" data-magnetic="6,0.15,0.76,0.4" data-reveal><span data-magnetic-label>Start your first thread</span></a>
          </div>
        </section>
      </main>

      <footer className="d1-foot">
        <div className="col wide"><p className="mark">{BRAND.name} <i>Field Notes</i></p><p className="k-muted">{MOCK_NOTE}. Brand name is a placeholder.</p></div>
        <div className="col"><h3>Product</h3><a href="#edit">Unified chat</a><a href="#features">Coding agents</a><a href="#rates">Model compare</a></div>
        <div className="col"><h3>Developers</h3><a href="#how">API quickstart</a><a href="#rates">Token rates</a><a href="#features">Prompt caching</a></div>
        <div className="col"><h3>Colophon</h3><span>Set in Newsreader, Bricolage Grotesque and JetBrains Mono.</span><a href="/designs">Back to the gallery</a></div>
      </footer>
    </div>
  );
}
