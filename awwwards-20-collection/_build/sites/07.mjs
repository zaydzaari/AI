import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, usd } from "../aether.mjs";

const STYLE = "Solaris";
const ATLAS = MODELS.find((m) => m.id === "atlas");
const MILESTONES = [
  [32, "Swift", "A long chat thread, end to end"],
  [128, "Core · Unbound", "A full novel manuscript"],
  [256, "Forge", "A mid-size code repository"],
  [1000, "Atlas", "A decade of contracts in one prompt"],
];

export default {
  title: "Aether — Your whole repository in one prompt",
  description: "Context windows from 32K to 1M tokens across five model families, with prompt caching on every long prefix. Solaris design direction.",
  fonts: [
    { family: "Host Grotesk", axes: "wght@300..800" },
    { family: "JetBrains Mono", axes: "wght@400;500" },
  ],
  tokens: {
    bgPrimary: "#070913", bgSecondary: "#111625", accent: "#38BDF8", onAccent: "#04121C",
    textPrimary: "#E8EDF7", textMuted: "#98A3BB", line: "rgba(232,237,247,.12)",
    display: '"Host Grotesk", sans-serif', body: '"JetBrains Mono", ui-monospace, monospace',
  },
  css: /* css */ `
.s7-nav{position:sticky;top:0;z-index:40;height:58px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:#070913ee;backdrop-filter:blur(10px);border-bottom:1px solid var(--line);font-size:.78rem}
.s7-mark{font-family:var(--font-display);font-weight:700;font-size:1.05rem;text-decoration:none;letter-spacing:-.01em}
.s7-mark span{font-weight:300;color:var(--text-muted)}
.s7-links{display:flex;gap:22px}
.s7-links a{text-decoration:none;color:var(--text-muted);padding:4px 0;border-bottom:2px solid transparent}
.s7-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.s7-fy{color:var(--text-muted)}
@media (max-width:900px){.s7-links{display:none}}
.s7-btn{display:inline-flex;align-items:center;gap:12px;min-height:56px;padding:0 28px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:700;text-decoration:none;border-radius:4px;box-shadow:none;transition:box-shadow .4s}
.s7-btn.is-near{box-shadow:none}
.s7-h2{font-size:clamp(2.4rem,4.6vw,4.2rem);font-weight:600;letter-spacing:-.035em;line-height:1;max-width:18ch}
.s7-fine{margin-top:22px;font-size:.76rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: report cover */
.s7-hero{position:relative;min-height:calc(100svh - 58px);display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr auto;gap:0 24px;padding:28px var(--gutter);overflow:clip}
.s7-meta{grid-column:1 / -1;display:flex;justify-content:space-between;font-size:.76rem;color:var(--text-muted);border-bottom:1px solid var(--line);padding-bottom:12px}
.s7-visual{grid-column:1 / -1;grid-row:2;position:relative;display:grid;align-items:center}
.s7-visual canvas,.s7-reactor canvas{position:absolute;inset:0;width:100%;height:100%;background:radial-gradient(closest-side,rgba(226,232,240,calc(.03 + var(--heat,0) * .07)),transparent 75%)}
.s7-big{position:relative;font-family:var(--font-display);font-weight:200;font-size:clamp(5rem,15vw,15rem);line-height:.8;letter-spacing:-.04em;font-variant-numeric:tabular-nums;color:#E8EDF7;opacity:.92}
.s7-big small{display:block;font-family:var(--font-body);font-size:.78rem;letter-spacing:0;color:var(--text-muted);margin-top:16px;font-weight:400}
.s7-copy{grid-column:1 / span 7;grid-row:3;display:grid;gap:18px;justify-items:start}
.s7-copy h1{font-weight:600;max-width:13ch}
.s7-copy .k-body{color:var(--text-muted);max-width:52ch}
.s7-side{grid-column:9 / -1;grid-row:3;align-self:end;display:grid;gap:12px;justify-items:start}
.s7-trust{font-size:.8rem;color:var(--text-muted);border-left:1px solid var(--accent);padding-left:12px}
.s7-trust b{color:var(--text-primary)}
@media (max-width:900px){
  .s7-hero{grid-template-columns:1fr;grid-template-rows:auto 92px auto auto;padding:12px var(--gutter);gap:8px}
  .s7-meta span:last-child{display:none}
  .s7-big{font-size:4.2rem}
  .s7-big small{margin-top:4px;font-size:.6875rem}
  .s7-copy,.s7-side{grid-column:1}
  .s7-side{grid-row:4}
  .s7-copy{gap:10px}
}

/* review */
.s7-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.s7-review{display:grid;border-top:1px solid var(--text-primary)}
.s7-review li{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:20px 0;border-bottom:1px solid var(--line);font-size:.9rem}
.s7-review .was{color:var(--text-muted)}
.s7-review .now{font-family:var(--font-display);font-size:1.1rem;font-weight:500}
@media (max-width:900px){.s7-cols{grid-template-columns:1fr;gap:40px}.s7-review li{grid-template-columns:1fr;gap:6px}}

/* signature: confinement torus */
.s7-run{height:460vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.s7-pin{position:sticky;top:58px;height:calc(100vh - 58px);display:grid;grid-template-columns:minmax(0,1.5fr) minmax(300px,1fr);gap:40px;align-items:center;padding:24px var(--gutter)}
.s7-reactor{position:relative;height:100%;min-height:0}
.s7-readout{position:absolute;left:0;top:12px;display:grid;gap:2px}
.s7-readout span{font-size:.76rem;color:var(--text-muted)}
.s7-readout b{font-family:var(--font-display);font-weight:300;font-size:clamp(2.6rem,5vw,4.6rem);letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
.s7-mile{display:grid;gap:0;border-top:1px solid var(--line)}
.s7-mile li{display:grid;grid-template-columns:70px 1fr;gap:2px 16px;padding:16px 0;border-bottom:1px solid var(--line);color:var(--text-muted);transition:color .4s}
.s7-mile li b{grid-row:span 2;font-family:var(--font-display);font-weight:600;font-size:1.3rem;color:var(--text-muted);transition:color .4s}
.s7-mile li.on{color:var(--text-primary)}
.s7-mile li.on b{color:var(--accent)}
.s7-mile li em{font-style:normal;font-size:.76rem}
.s7-costs{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);margin-top:16px}
.s7-costs div{background:var(--bg-primary);padding:12px 14px;display:grid;gap:2px}
.s7-costs span{font-size:.76rem;color:var(--text-muted)}
.s7-costs b{font-family:var(--font-display);font-size:1.4rem;font-weight:500;font-variant-numeric:tabular-nums}
@media (max-width:900px){
  .s7-run{height:400vh}
  .s7-pin{grid-template-columns:1fr;grid-template-rows:1fr auto;gap:8px;padding:12px var(--gutter)}
  .s7-mile li{padding:8px 0;grid-template-columns:56px 1fr}
  .s7-mile li em{display:none}
  .s7-readout b{font-size:2.2rem}
}
@media (prefers-reduced-motion:reduce){.s7-run{height:auto}.s7-pin{position:relative;height:auto;min-height:100vh}}

/* highlights */
.s7-hl{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
.s7-card{position:relative;isolation:isolate;overflow:hidden;background:var(--bg-secondary);border:1px solid var(--line);border-radius:6px;display:grid;gap:14px;align-content:start;min-height:240px}
.s7-card::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(320px circle at var(--mx) var(--my),#E2E8F014,transparent 65%);opacity:0;transition:opacity .3s}
.s7-card:hover::before{opacity:1}
.s7-card .k{font-size:.76rem;color:var(--text-muted)}
.s7-card h3{font-family:var(--font-display);font-size:1.5rem;font-weight:600;letter-spacing:-.02em;line-height:1.12}
.s7-card p{font-size:.86rem;color:var(--text-muted)}
.s7-card.c0{grid-column:span 7;grid-row:span 2}.s7-card.c0 h3{font-size:clamp(2rem,3.2vw,2.8rem)}
.s7-card.c1,.s7-card.c2{grid-column:span 5}
.s7-card.c3,.s7-card.c4,.s7-card.c5{grid-column:span 4}
@media (max-width:900px){.s7-hl{grid-template-columns:1fr}.s7-card{grid-column:auto!important;grid-row:auto!important;min-height:0}}

/* rail */
.s7-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.s7-steps{padding:0 var(--gutter);gap:16px}
.s7-step{width:min(580px,54vw);background:var(--bg-secondary);border:1px solid var(--line);border-radius:6px;display:grid;gap:14px;align-content:start}
.s7-step.is-active{border-color:#38BDF877}
.s7-step .n{font-size:.76rem;color:var(--text-muted)}
.s7-step h3{font-family:var(--font-display);font-size:1.8rem;font-weight:600;line-height:1.08}
.s7-step p{color:var(--text-muted);font-size:.9rem}
.s7-step pre{margin:0;background:#070913;border:1px solid var(--line);padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.s7-step{width:auto}}

/* statements */
.s7-stmts{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.s7-stmt{border-top:2px solid var(--text-primary);display:grid;gap:14px;background:linear-gradient(#111625,#0B0F1B)}
.s7-stmt .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.76rem;color:var(--text-muted)}
.s7-stmt b{font-family:var(--font-display);font-size:1.1rem;color:var(--text-primary)}
.s7-stmt q{font-size:.95rem;line-height:1.6;quotes:"“" "”"}
@media (max-width:760px){.s7-stmts{grid-template-columns:1fr}}

/* financial statements */
.s7-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.s7-plan{border:1px solid var(--line);border-radius:6px;display:grid;gap:12px;align-content:start}
.s7-plan.feat{background:var(--bg-secondary);border-color:#38BDF866}
.s7-plan h3{font-family:var(--font-display);font-size:1.2rem;font-weight:600}
.s7-plan .p{font-family:var(--font-display);font-size:2.8rem;font-weight:300;letter-spacing:-.04em;line-height:1}
.s7-plan .cad{font-size:.76rem;color:var(--text-muted)}
.s7-plan ul{display:grid;gap:6px;font-size:.84rem}
.s7-plan li::before{content:"+ ";color:var(--text-muted)}
.s7-plan .fk{font-size:.8rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.s7-plans{grid-template-columns:1fr}}
.s7-fin{width:100%;margin-top:40px;border-collapse:collapse;font-size:.84rem;font-variant-numeric:tabular-nums}
.s7-fin caption{text-align:left;font-family:var(--font-display);font-size:1.3rem;font-weight:600;padding-bottom:12px}
.s7-fin th,.s7-fin td{text-align:right;padding:12px 0 12px 16px;border-bottom:1px solid var(--line)}
.s7-fin th:first-child,.s7-fin td:first-child{text-align:left;padding-left:0}
.s7-fin thead th{font-weight:400;color:var(--text-muted);font-size:.76rem;border-bottom:1px solid var(--text-primary)}
.s7-fin tfoot td{font-size:.76rem;color:var(--text-muted);text-align:left;padding-left:0;border:0}
@media (max-width:700px){.s7-fin th:nth-child(2),.s7-fin td:nth-child(2){display:none}.s7-fin{font-size:.8rem}.s7-fin th,.s7-fin td{padding-left:10px}}

/* final + footer */
.s7-final{display:grid;gap:30px;justify-items:start}
.s7-final .s7-h2{font-size:clamp(2.8rem,6vw,5.4rem);max-width:14ch}
.s7-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.78rem;color:var(--text-muted)}
.s7-foot h3{font-family:var(--font-display);font-size:.9rem;color:var(--text-primary);margin-bottom:12px}
.s7-foot ul{display:grid;gap:8px}
.s7-foot a{text-decoration:none}
.s7-foot a:hover{color:var(--text-primary)}
.s7-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.s7-foot{grid-template-columns:1fr 1fr}.s7-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="s7-nav">
  <a class="s7-mark" href="#main">${BRAND.name} <span>Solaris</span></a>
  <nav class="s7-links" data-spy aria-label="Sections"><a href="#review">Review</a><a href="#reactor">Reactor</a><a href="#highlights">Highlights</a><a href="#operations">Operations</a><a href="#statements">Statements</a><a href="#financials">Financials</a></nav>
  <span class="s7-fy">Report · context edition</span>
</header>
<main id="main">
  <section class="s7-hero" data-hero aria-labelledby="s7-h">
    <p class="s7-meta"><span>Annual report · long-context models</span><span>Specs shown are placeholders</span></p>
    <div class="s7-visual" data-hero-part="visual">
      <canvas id="torus" role="img" aria-label="A glowing confinement torus; the pointer tilts it"></canvas>
      <p class="s7-big" aria-label="Up to one million tokens in a single prompt"><span id="big">1,000,000</span><small>tokens in one prompt on Atlas (placeholder spec)</small></p>
    </div>
    <div class="s7-copy">
      <h1 id="s7-h" data-hero-part="headline">Your whole repository, one prompt.</h1>
      <p class="k-body" data-hero-part="sub">Context windows from 32K to 1M tokens across five model families, plus prompt caching, so a long prefix is billed at the cached rate after the first call.</p>
    </div>
    <div class="s7-side">
      <div data-hero-part="cta"><a class="s7-btn" href="#financials" data-cta="primary" data-magnetic="5,0.2,0.7,0.35"><span data-magnetic-label>Get your API key</span></a></div>
      <p class="s7-trust" data-hero-part="trust">Atlas: <b>${rate(ATLAS.inPrice)}</b> per 1M input tokens, <b>${rate(ATLAS.cached)}</b> once cached. Sample rates.</p>
    </div>
  </section>

  <section id="review" data-section aria-labelledby="s7-r">
    <div class="k-wrap s7-cols">
      <h2 id="s7-r" class="s7-h2" data-reveal>The year in review: three constraints, removed.</h2>
      <ol class="s7-review" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ol>
    </div>
    <div class="s7-run" id="reactor">
      <div class="s7-pin">
        <div class="s7-reactor">
          <canvas id="core" role="img" aria-label="The torus heats as more context is loaded"></canvas>
          <p class="s7-readout" aria-live="polite"><span>Context loaded</span><b class="live" id="ctx">8,000</b><span>tokens</span></p>
        </div>
        <div>
          <ol class="s7-mile" id="miles">${MILESTONES.map(([k, who, what]) => `<li><b>${k >= 1000 ? "1M" : k + "K"}</b><span>${who}</span><em>${what}</em></li>`)}</ol>
          <div class="s7-costs" aria-live="polite"><div><span>Input cost, first call (Atlas)</span><b id="c-fresh">$0.000</b></div><div><span>Same prefix, cached</span><b class="live" id="c-cached">$0.000</b></div></div>
          <p class="s7-fine">Context sizes are placeholder specs. ${PRICE_NOTE}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="highlights" data-section aria-labelledby="s7-hh">
    <div class="k-wrap">
      <h2 id="s7-hh" class="s7-h2" data-reveal>Operating highlights, and what they return.</h2>
      <div class="s7-hl" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="s7-card k-card c${i}" data-spot><span class="k">${String(i + 1).padStart(2, "0")} · ${f}</span><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="operations" data-section aria-labelledby="s7-o">
    <div data-rail>
      <div data-rail-view>
        <div class="s7-rail-head"><h2 id="s7-o" class="s7-h2" data-reveal>Operations: three steps to ignition.</h2></div>
        <ol class="s7-steps" data-rail-track>
          ${STEPS.map(([t, d], i) => `<li class="s7-step k-card"><span class="n">Phase ${i + 1}</span><h3>${t}</h3><p>${d}</p><pre><code>${["model: \"atlas-1m\"", `baseURL: "${BRAND.apiBase}"`, "usage.cached_tokens → billed at the cached rate"][i]}</code></pre></li>`)}
        </ol>
      </div>
    </div>
  </section>

  <section id="statements" data-section aria-labelledby="s7-st">
    <div class="k-wrap">
      <h2 id="s7-st" class="s7-h2" data-reveal>Stakeholder statements.</h2>
      <div class="s7-stmts" data-stagger>${PROOF.map(([role, focus, q]) => `<article class="s7-stmt k-card"><p class="hd"><b>${role}</b><span>${focus}</span></p><q>${q}</q></article>`)}</div>
      <p class="s7-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="financials" data-section aria-labelledby="s7-f">
    <div class="k-wrap">
      <h2 id="s7-f" class="s7-h2" data-reveal>Financial statements, per token.</h2>
      <div class="s7-plans" data-stagger>${PLANS.map((p) => h`<article class="s7-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="s7-fin" data-reveal>
        <caption>Statement of rates, per 1M tokens</caption>
        <thead><tr><th scope="col">Family</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th><th scope="col">Full context, cached</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td><td>${usd((m.contextK * 1000 * m.cached) / 1e6)}</td></tr>`)}</tbody>
        <tfoot><tr><td colspan="6">${PRICE_NOTE}</td></tr></tfoot>
      </table>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="s7-z">
    <div class="k-wrap s7-final">
      <h2 id="s7-z" class="s7-h2" data-reveal>Load everything. Pay for it once.</h2>
      <a class="s7-btn" href="#main" data-magnetic="5,0.2,0.7,0.35" data-reveal><span data-magnetic-label>Get your API key</span></a>
    </div>
  </section>
</main>
<footer class="s7-foot">
  <div><p class="s7-mark">${BRAND.name} <span>Solaris</span></p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Families</h3><ul>${MODELS.map((m) => `<li><a href="#financials">${m.name} · ${m.context}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#reactor">Long context</a></li><li><a href="#operations">API quickstart</a></li><li><a href="#financials">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Host Grotesk and JetBrains Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, smooth, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;
    const ATLAS = AE.MODELS.find((m) => m.id === "atlas");

    function Torus(cv) {
      const s = canvas(cv);
      const parts = Array.from({ length: 170 }, () => ({ u: Math.random() * TAU, v: Math.random() * TAU, sp: 0.4 + Math.random() * 0.8 }));
      return (t, { heat = 0.3, fill = 1, tilt = 0.42, scale = 1, cx = 0.5, cy = 0.5 } = {}) => {
        const { ctx, w, h } = s;
        ctx.clearRect(0, 0, w, h);
        cv.style.setProperty("--heat", heat.toFixed(3));
        const R = Math.min(w * 0.34, h * 0.62) * scale, r = R * 0.32, X = w * cx, Y = h * cy;
        const P = (u, v, rr) => { const x = (R + rr * Math.cos(v)) * Math.cos(u), y = rr * Math.sin(v), z = (R + rr * Math.cos(v)) * Math.sin(u); return [X + x, Y + z * tilt + y * Math.cos(tilt * 1.2), z]; };
        // coils, batched into four strokes: lit/unlit × front/back
        const N = 36, paths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
        for (let i = 0; i < N; i++) {
          const u = (i / N) * TAU, lit = i / N < fill, front = Math.sin(u) > 0;
          const path = paths[(lit ? 0 : 2) + (front ? 0 : 1)];
          for (let k = 0; k <= 20; k++) { const [x, y] = P(u, (k / 20) * TAU, r * 1.12); k ? path.lineTo(x, y) : path.moveTo(x, y); }
        }
        [["rgba(56,189,248,.6)", 1.4], ["rgba(56,189,248,.2)", 1], ["rgba(232,237,247,.16)", 1], ["rgba(232,237,247,.06)", 1]].forEach(([c, lw], i) => { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(paths[i]); });
        // plasma, batched into two fills (front, back)
        const pf = new Path2D(), pb = new Path2D(), rad = 1 + heat * 1.6;
        for (const p of parts) {
          p.u += (RM ? 0 : 0.004 + heat * 0.02) * p.sp;
          const [x, y, z] = P(p.u, p.v + t * p.sp * 0.4, r * 0.55);
          const path = z > 0 ? pf : pb; path.moveTo(x + rad, y); path.arc(x, y, rad, 0, TAU);
        }
        const hot = Math.round(lerp(40, 255, heat)), g = Math.round(lerp(140, 250, heat));
        ctx.fillStyle = `rgba(${hot},${g},255,${0.35 * (0.3 + heat * 0.7)})`; ctx.fill(pb);
        ctx.fillStyle = `rgba(${hot},${g},255,${0.9 * (0.3 + heat * 0.7)})`; ctx.fill(pf);
      };
    }

    // hero: the torus behind the big number; pointer tilts it
    const hero = Torus($("#torus"));
    let tilt = 0.42;
    loop($("#torus"), (t) => {
      tilt += ((pointer.active ? 0.25 + (pointer.y / innerHeight) * 0.4 : 0.42) - tilt) * 0.05;
      hero(t, { heat: 0.75, fill: 1, tilt, scale: innerWidth > 900 ? 1.25 : 1.1, cx: innerWidth > 900 ? 0.72 : 0.7 });
    });

    // signature: scroll loads context (log scale 8K → 1M) and heats the plasma
    const run = $("#reactor"), core = Torus($("#core"));
    const ctxEl = $("#ctx"), miles = $$("#miles li"), cf = $("#c-fresh"), cc = $("#c-cached");
    const STEPS = [32, 128, 256, 1000];
    let k = 8;
    onScroll(() => {
      const p = RM ? 1 : clamp((progress(run) - 0.04) / 0.86);
      k = Math.round(Math.pow(10, Math.log10(8) + p * (3 - Math.log10(8))));
      ctxEl.textContent = (k * 1000).toLocaleString("en-US");
      miles.forEach((li, i) => li.classList.toggle("on", k >= STEPS[i]));
      const tok = k * 1000;
      const f = (tok * ATLAS.inPrice) / 1e6, c = (tok * ATLAS.cached) / 1e6;
      cf.textContent = "$" + f.toFixed(f < 0.1 ? 4 : 3); cc.textContent = "$" + c.toFixed(c < 0.1 ? 4 : 3);
    });
    loop($("#core"), (t) => {
      const fill = clamp((Math.log10(k) - Math.log10(8)) / (3 - Math.log10(8)));
      core(t, { heat: smooth(fill), fill, tilt: 0.38, scale: 1, cx: 0.5, cy: 0.58 });
    });
  }),
};
