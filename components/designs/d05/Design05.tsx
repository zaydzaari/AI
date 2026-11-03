"use client";

/**
 * 05 Kiln (v3) — experimental creative studio.
 * Colour blocking, geometric stickers you can drag, and a signature "agent loop"
 * choreography: as you scroll, shapes stamp Plan → Edit → Test → Ship across the
 * stage while the run's log and token cost accumulate.
 */

import { useEffect, useRef, useState } from "react";
import { BENEFITS, BRAND, MODELS, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE, MOCK_NOTE, estimateCost, fmtUSD } from "@/lib/content";
import { clamp, onScroll, progress, reduced, useKit } from "@/lib/kit";

const FORGE = MODELS.find((m) => m.id === "forge")!;
const LOOP = [
  { shape: "circle", stage: "Plan", log: "Read 38 files in src/ and tests/. Plan: add retry with backoff to the API client.", inTok: 31000, outTok: 900, cached: 0 },
  { shape: "square", stage: "Edit", log: "Edited src/client.ts (+18 −6) and src/retry.ts (new, 41 lines).", inTok: 33000, outTok: 2600, cached: 0.9 },
  { shape: "triangle", stage: "Test", log: "Ran 214 tests. 1 failed: retry.spec.ts › gives up after 5 attempts. Fixed off-by-one.", inTok: 34000, outTok: 1400, cached: 0.92 },
  { shape: "star", stage: "Ship", log: "All 214 tests pass. Diff ready for your review — 2 files, +59 −6.", inTok: 34500, outTok: 700, cached: 0.94 },
];
const loopCost = (i: number) => LOOP.slice(0, i + 1).reduce((a, s) => a + estimateCost(FORGE, s.inTok, s.outTok, s.cached), 0);
const loopTok = (i: number) => LOOP.slice(0, i + 1).reduce((a, s) => a + s.inTok + s.outTok, 0);
const STICKERS = [
  { id: "core", cls: "circle", bg: "var(--lilac)", fg: "#111", x: 14, y: 18 },
  { id: "unbound", cls: "moon", bg: "var(--coral)", fg: "#111", x: 58, y: 12 },
  { id: "forge", cls: "square", bg: "var(--lime)", fg: "#111", x: 30, y: 52 },
  { id: "atlas", cls: "pill", bg: "var(--cream)", fg: "#111", x: 56, y: 64 },
  { id: "swift", cls: "star", bg: "#FFFFFF", fg: "#111", x: 6, y: 66 },
];

function Stickers() {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(STICKERS.map((s) => ({ x: s.x, y: s.y })));
  const [top, setTop] = useState(-1);
  const drag = (i: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget; el.setPointerCapture(e.pointerId);
    const r = box.current!.getBoundingClientRect();
    const start = { px: e.clientX, py: e.clientY, ...pos[i] };
    setTop(i);
    const move = (ev: PointerEvent) => setPos((p) => p.map((q, j) => (j === i ? { x: clamp(start.x + ((ev.clientX - start.px) / r.width) * 100, 0, 78), y: clamp(start.y + ((ev.clientY - start.py) / r.height) * 100, 0, 80) } : q)));
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerup", up);
  };
  const key = (i: number) => (e: React.KeyboardEvent) => {
    const d = { ArrowLeft: [-4, 0], ArrowRight: [4, 0], ArrowUp: [0, -4], ArrowDown: [0, 4] }[e.key];
    if (!d) return; e.preventDefault(); setTop(i);
    setPos((p) => p.map((q, j) => (j === i ? { x: clamp(q.x + d[0], 0, 78), y: clamp(q.y + d[1], 0, 80) } : q)));
  };
  return (
    <div className="k5-board" ref={box} data-hero-part="visual">
      <p className="k5-hint" aria-hidden>drag the models around</p>
      {STICKERS.map((s, i) => {
        const m = MODELS.find((x) => x.id === s.id)!;
        return (
          <button key={s.id} className={`k5-sticker ${s.cls}`} style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%`, background: s.bg, color: s.fg, zIndex: top === i ? 3 : 1 }} onPointerDown={drag(i)} onKeyDown={key(i)} aria-label={`${m.name} sticker — use arrow keys to move`}>
            <b>{m.name}</b><span>{m.role}</span>
          </button>
        );
      })}
    </div>
  );
}

function AgentLoop() {
  const run = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => onScroll(() => setP(reduced() ? 1 : clamp((progress(run.current!) - 0.06) / 0.84))), []);
  const at = Math.min(3, Math.floor(p * 4));
  const local = p * 4 - at;
  return (
    <div className="k5-run" ref={run}>
      <div className="k5-pin">
        <div className="k5-stage" aria-hidden>
          {LOOP.map((s, i) => (
            <span key={s.stage} className={`k5-shape ${s.shape} ${i < at || (i === at && local > 0.15) ? "stamped" : ""} ${i === at ? "now" : ""}`} style={{ ["--i" as string]: i }} />
          ))}
          <span className="k5-track" style={{ transform: `scaleX(${p.toFixed(3)})` }} />
        </div>
        <div className="k5-log" aria-live="polite">
          <p className="k5-run-head"><span>forge-256k · agent run</span><span>step {at + 1} of 4</span></p>
          <ol>
            {LOOP.map((s, i) => (
              <li key={s.stage} className={i <= at ? "on" : ""}>
                <b>{s.stage}</b><span>{s.log}</span>
              </li>
            ))}
          </ol>
          <p className="k5-tally"><span><b className="live">{loopTok(at).toLocaleString("en-US")}</b> tokens</span><span><b className="live">{fmtUSD(loopCost(at))}</b> so far</span><span>cached input billed at ${FORGE.cached.toFixed(2)} / 1M</span></p>
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    let x = 0, last = scrollY, v = 0, raf = 0;
    const tick = () => {
      const dy = scrollY - last; last = scrollY;
      v += (Math.abs(dy) * 0.25 - v) * 0.1;
      x -= 0.6 + v;
      const w = (ref.current?.scrollWidth || 1) / 2;
      if (-x > w) x += w;
      if (ref.current) ref.current.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const words = ["Make it", "●", "Ship it", "■", "Test it", "▲", "Fire it", "★"];
  return <div className="k5-marquee" aria-hidden><div ref={ref}>{[...words, ...words, ...words, ...words].map((w, i) => <span key={i}>{w}</span>)}</div></div>;
}

export default function Design05() {
  const root = useRef<HTMLDivElement>(null);
  useKit(root);
  const total = loopCost(3);
  return (
    <div ref={root} className="kit d05">
      <a className="k-skip" href="#main">Skip to content</a>
      <header className="k5-nav">
        <a className="k5-mark" href="#main"><span aria-hidden>●■▲</span>{BRAND.name}</a>
        <nav data-spy aria-label="Sections"><a href="#swap">Swap</a><a href="#loop">Agent loop</a><a href="#kit">Kit</a><a href="#steps">Steps</a><a href="#price">Price</a></nav>
      </header>
      <main id="main">
        <section className="k5-hero" data-hero aria-labelledby="k5-h">
          <div className="k5-copy">
            <h1 id="k5-h" data-hero-part="headline">Let the agent do the typing.</h1>
            <p className="k-body" data-hero-part="sub">Forge reads your repo, plans the change, edits files and runs the tests — billed per token, with the diff waiting for your review.</p>
            <div data-hero-part="cta"><a className="k5-btn" href="#price" data-cta="primary" data-magnetic="8,0.1,0.82,0.6"><span data-magnetic-label>Start an agent run</span></a></div>
            <p className="k5-trust" data-hero-part="trust"><span className="pill">sample run</span><span className="long">4 steps · {loopTok(3).toLocaleString("en-US")} tokens · </span><b>{fmtUSD(total)}</b><span> at Forge sample rates</span></p>
          </div>
          <Stickers />
        </section>

        <section id="swap" data-section aria-labelledby="k5-s">
          <div className="k-wrap">
            <h2 id="k5-s" className="k5-h2" data-reveal>Swap the chores for the fun part.</h2>
            <div className="k5-swaps" data-stagger>
              {PROBLEM.rows.map((r, i) => (
                <article key={i} className={`k5-swap k-card b${i}`}>
                  <p className="was">{r.problem}</p>
                  <p className="now">{r.solution}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="loop" data-section aria-labelledby="k5-l" className="k5-loop-sec">
          <div className="k-wrap"><h2 id="k5-l" className="k5-h2" data-reveal>One agent run, as choreography.</h2></div>
          <AgentLoop />
        </section>

        <section id="kit" data-section aria-labelledby="k5-k">
          <div className="k-wrap">
            <h2 id="k5-k" className="k5-h2" data-reveal>The kit, and what each piece is for.</h2>
            <div className="k5-bento" data-stagger>
              {BENEFITS.map((b, i) => (
                <article key={b.key} className={`k5-card k-card f${i}`} data-spot>
                  <span className={`glyph g${i % 4}`} aria-hidden />
                  <h3>{b.benefit}</h3>
                  <p><b>{b.feature}.</b> {b.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="steps" data-section aria-labelledby="k5-t">
          <div data-rail>
            <div data-rail-view>
              <div className="k-wrap"><h2 id="k5-t" className="k5-h2 k5-rail-h" data-reveal>Three moves to your first run.</h2></div>
              <ol className="k5-steps" data-rail-track>
                {STEPS.map((s, i) => (
                  <li key={i} className={`k5-step k-card t${i}`}>
                    <span className="n">{["●", "■", "▲"][i]} {i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                    {i === 1 && <pre><code>{STEP_CODE}</code></pre>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="voices" data-section aria-labelledby="k5-v">
          <div className="k-wrap">
            <h2 id="k5-v" className="k5-h2" data-reveal>Pinned to the studio wall.</h2>
            <div className="k5-wall" data-stagger>
              {PROOF.map((p, i) => (
                <figure key={p.role} className={`k5-note k-card n${i}`}>
                  <blockquote>“{p.quote}”</blockquote>
                  <figcaption><b>{p.role}</b><span>{p.focus}</span></figcaption>
                </figure>
              ))}
            </div>
            <p className="k5-fine">{PROOF_NOTE}</p>
          </div>
        </section>

        <section id="price" data-section aria-labelledby="k5-p">
          <div className="k-wrap">
            <h2 id="k5-p" className="k5-h2" data-reveal>Pick a block. Pay per token.</h2>
            <div className="k5-plans" data-stagger>
              {PLANS.map((p, i) => (
                <article key={p.name} className={`k5-plan k-card p${i}`}>
                  <h3>{p.name}</h3>
                  <p className="price">{p.price}<span>{p.cadence}</span></p>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fk">{p.name === "API" ? "No minimum spend. Agents stop at the cap you set." : p.name === "Pro" ? "Cancel any time, keep your threads." : "No card. Just start."}</p>
                </article>
              ))}
            </div>
            <ul className="k5-rates" data-reveal>
              {MODELS.map((m) => <li key={m.id}><b>{m.name}</b><span>in ${m.inPrice.toFixed(2)}</span><span>cached ${m.cached.toFixed(2)}</span><span>out ${m.outPrice.toFixed(2)}</span></li>)}
            </ul>
            <p className="k5-fine">Per 1M tokens. {PRICE_NOTE}</p>
          </div>
        </section>

        <section id="final" data-section aria-labelledby="k5-f" className="k5-final-sec">
          <Marquee />
          <div className="k-wrap k5-final">
            <h2 id="k5-f" className="k5-h2" data-reveal>Hand over the next ticket.</h2>
            <a className="k5-btn" href="#main" data-magnetic="8,0.1,0.82,0.6" data-reveal><span data-magnetic-label>Start an agent run</span></a>
          </div>
        </section>
      </main>
      <footer className="k5-foot">
        <p className="k5-mark big"><span aria-hidden>●■▲</span>{BRAND.name}</p>
        <div><h3>Models</h3>{MODELS.map((m) => <a key={m.id} href="#price">{m.name}</a>)}</div>
        <div><h3>Make</h3><a href="#loop">Coding agents</a><a href="#kit">Unified chat</a><a href="#steps">API</a></div>
        <div><h3>Lab</h3><a href="/designs">Back to the gallery</a><span>{MOCK_NOTE}</span></div>
      </footer>
    </div>
  );
}
