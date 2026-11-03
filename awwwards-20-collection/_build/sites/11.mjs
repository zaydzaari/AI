import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Nomad";
const M = Object.fromEntries(MODELS.map((m) => [m.id, m]));
const ZONES = [
  { depth: 4000, name: "The summit", m: M.swift, temper: "Standard", inTok: 300, outTok: 60, text: "Quick answers in thin air: routing, extraction, autocomplete. Swift is small and fast, and costs fractions of a cent." },
  { depth: 0, name: "Sea level", m: M.core, temper: "Standard", inTok: 2400, outTok: 600, text: "Everyday work at the surface: writing, analysis, planning. Core is the house model for most requests." },
  { depth: -2000, name: "The twilight zone", m: M.core, temper: "Low-refusal", inTok: 2400, outTok: 600, text: "Where cautious models turn back. Low-refusal keeps going for fiction, security work and frank research." },
  { depth: -6000, name: "The abyss", m: M.unbound, temper: "Abliterated", inTok: 3000, outTok: 900, text: "Refusal behaviour removed at the weights level. You bring the policy; Unbound brings no lectures." },
  { depth: -10928, name: "The trench", m: M.atlas, temper: "Standard", inTok: 800000, outTok: 1200, cached: 0.9, text: "The deepest dive: whole archives and repositories in a single prompt, with the prefix cached after the first descent." },
].map((z) => ({ ...z, usd: usd(cost(z.m, z.inTok, z.outTok, z.cached || 0)) }));

export default {
  title: "Aether — Go as deep as you need",
  description: "From quick answers to refusal-free research to million-token archives: five model families on one key, billed per token. Nomad design direction.",
  fonts: [
    { family: "DM Serif Display", axes: "ital@0;1" },
    { family: "Red Hat Text", axes: "wght@400;500;600" },
  ],
  tokens: {
    bgPrimary: "#06101E", bgSecondary: "#0E1E33", accent: "#F59E0B", onAccent: "#06101E",
    textPrimary: "#EAF1F8", textMuted: "#9DB0C6", line: "rgba(234,241,248,.13)",
    display: '"DM Serif Display", Georgia, serif', body: '"Red Hat Text", sans-serif',
  },
  css: /* css */ `
.n11-nav{position:fixed;inset:0 0 auto;z-index:40;height:62px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:linear-gradient(#06101Ef0,#06101E00);font-size:.86rem}
.n11-mark{font-family:var(--font-display);font-size:1.5rem;text-decoration:none}
.n11-links{display:flex;gap:24px}
.n11-links a{text-decoration:none;color:var(--text-muted);padding:4px 0;border-bottom:2px solid transparent}
.n11-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.n11-coord{color:var(--text-muted);font-variant-numeric:tabular-nums}
@media (max-width:900px){.n11-links{display:none}}
.n11-btn{display:inline-flex;align-items:center;gap:12px;min-height:56px;padding:0 28px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-weight:600;text-decoration:none}
.n11-btn i{width:10px;height:10px;border-radius:50%;background:var(--on-accent);box-shadow:0 0 0 0 #06101E66}
@keyframes n11b{70%{box-shadow:0 0 0 8px #06101E00}}
.n11-h2{font-size:clamp(2.6rem,5vw,4.6rem);font-weight:400;letter-spacing:-.02em;line-height:1;max-width:16ch}
.n11-fine{margin-top:22px;font-size:.8rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: depth column */
.n11-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:88px minmax(0,1fr);gap:clamp(24px,5vw,80px);padding:80px var(--gutter) 32px 0;overflow:clip}
.n11-sonar{position:absolute;inset:0}
.n11-sonar canvas{width:100%;height:100%}
.n11-ruler{position:relative;z-index:2;border-right:1px solid var(--line);display:grid;grid-template-rows:repeat(9,1fr);font-size:.76rem;color:var(--text-muted);padding-left:16px}
.n11-ruler span{border-top:1px solid var(--line);padding-top:4px;font-variant-numeric:tabular-nums}
.n11-ruler span.sea{color:var(--accent);border-color:var(--accent)}
.n11-copy{position:relative;z-index:2;align-self:center;display:grid;gap:24px;justify-items:start;max-width:720px}
.n11-copy h1{font-weight:400;line-height:.98}
.n11-copy h1 em{color:var(--text-muted)}
.n11-copy .k-body{color:var(--text-muted);max-width:48ch}
.n11-trust{font-size:.86rem;color:var(--text-muted);display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.n11-trust b{color:var(--text-primary);font-weight:600}
@media (max-width:760px){
  .n11-hero{grid-template-columns:44px minmax(0,1fr);gap:16px;padding:70px var(--gutter) 16px 0}
  .n11-ruler{padding-left:8px;font-size:.6875rem}
  .n11-copy{gap:14px;align-self:end}
}

/* problem */
.n11-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.n11-log{display:grid;border-top:1px solid var(--line)}
.n11-log li{display:grid;grid-template-columns:auto 1fr;gap:4px 18px;padding:22px 0;border-bottom:1px solid var(--line)}
.n11-log .d{grid-row:span 2;font-family:var(--font-display);font-size:1.3rem;color:var(--text-muted)}
.n11-log .was{color:var(--text-muted);font-size:.92rem}
.n11-log .now{font-family:var(--font-display);font-size:1.4rem;line-height:1.2}
@media (max-width:900px){.n11-cols{grid-template-columns:1fr;gap:40px}}

/* signature: the descent */
.n11-dive{position:relative;margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:200px minmax(0,1fr);background:linear-gradient(#0E2C4A 0%,#0A2038 25%,#06101E 55%,#03070D 100%)}
.n11-gauge{position:sticky;top:0;height:100vh;padding:84px 0 28px var(--gutter);display:grid;grid-template-rows:auto 1fr auto;gap:16px;z-index:2}
.n11-gauge .lbl{font-size:.76rem;color:var(--text-muted)}
.n11-gauge .dep{font-family:var(--font-display);font-size:2.4rem;line-height:1;font-variant-numeric:tabular-nums}
.n11-bar{position:relative;border-left:1px solid var(--line);margin-left:6px}
.n11-bar i{position:absolute;left:-1px;top:0;width:3px;height:100%;background:var(--accent);transform:scaleY(var(--d,0));transform-origin:top}
.n11-bar span{position:absolute;left:12px;font-size:.6875rem;color:var(--text-muted);transform:translateY(-50%)}
.n11-gauge dl{display:grid;gap:8px}
.n11-gauge dt{font-size:.6875rem;color:var(--text-muted)}
.n11-gauge dd{margin:0;font-size:.98rem;font-weight:600;font-variant-numeric:tabular-nums}
.n11-zones{position:relative}
.n11-pings{position:sticky;top:0;height:100vh;margin-bottom:-100vh;pointer-events:none}
.n11-pings canvas{width:100%;height:100%}
.n11-zone{position:relative;min-height:92vh;display:grid;align-content:center;gap:16px;padding:64px var(--gutter) 64px 56px;max-width:860px}
.n11-zone .at{font-size:.8rem;color:var(--text-muted);font-variant-numeric:tabular-nums}
.n11-zone h3{font-family:var(--font-display);font-weight:400;font-size:clamp(3rem,6vw,5.4rem);line-height:.95}
.n11-zone p{color:var(--text-muted);font-size:1.1rem;max-width:46ch}
.n11-zone .kit{display:flex;gap:10px;flex-wrap:wrap;font-size:.84rem}
.n11-zone .kit span{border:1px solid var(--line);border-radius:999px;padding:6px 14px}
.n11-zone .kit span b{color:var(--accent);font-weight:600}
@media (max-width:900px){
  .n11-dive{grid-template-columns:1fr}
  .n11-gauge{top:62px;height:auto;padding:10px var(--gutter);grid-template-rows:none;grid-auto-flow:column;justify-content:space-between;align-items:center;background:#06101Ef0;border-bottom:1px solid var(--line)}
  .n11-bar,.n11-gauge dl div:nth-child(n+2),.n11-gauge .lbl{display:none}
  .n11-gauge .dep{font-size:1.5rem}
  .n11-zone{min-height:0;padding:56px var(--gutter)}
  .n11-pings{display:none}
}

/* kit bento */
.n11-kit{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.n11-item{position:relative;isolation:isolate;overflow:hidden;border:1px solid var(--line);border-radius:20px;background:var(--bg-secondary);display:grid;gap:14px;align-content:start;min-height:260px}
.n11-item::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(300px circle at var(--mx) var(--my),#F59E0B1a,transparent 65%);opacity:0;transition:opacity .3s}
.n11-item:hover::before{opacity:1}
.n11-item .tag{font-size:.76rem;color:var(--text-muted)}
.n11-item h3{font-family:var(--font-display);font-weight:400;font-size:1.8rem;line-height:1.08}
.n11-item p{color:var(--text-muted);font-size:.92rem}
.n11-item.i0{grid-column:span 2}.n11-item.i0 h3{font-size:clamp(2.2rem,3.4vw,3rem)}
.n11-item.i5{grid-column:span 2}
@media (max-width:900px){.n11-kit{grid-template-columns:1fr}.n11-item{grid-column:auto!important}}

/* rail */
.n11-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.n11-steps{padding:0 var(--gutter);gap:18px}
.n11-step{width:min(560px,52vw);border:1px solid var(--line);border-radius:20px;background:var(--bg-secondary);display:grid;gap:14px;align-content:start}
.n11-step.is-active{border-color:#F59E0B88}
.n11-step .n{font-family:var(--font-display);font-style:italic;font-size:1.3rem;color:var(--text-muted)}
.n11-step h3{font-family:var(--font-display);font-weight:400;font-size:2rem;line-height:1.05}
.n11-step p{color:var(--text-muted)}
.n11-step pre{margin:0;background:#06101E;border:1px solid var(--line);border-radius:12px;padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
.n11-step code{font-family:ui-monospace,monospace}
@media (max-width:899px){.n11-step{width:auto}}

/* journal */
.n11-journal{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.n11-entry{border:1px solid var(--line);border-radius:20px;display:grid;gap:14px}
.n11-entry .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.76rem;color:var(--text-muted)}
.n11-entry b{font-family:var(--font-display);font-weight:400;font-size:1.3rem;color:var(--text-primary)}
.n11-entry q{font-family:var(--font-display);font-style:italic;font-size:1.25rem;line-height:1.35;quotes:"“" "”"}
@media (max-width:760px){.n11-journal{grid-template-columns:1fr}}

/* manifest */
.n11-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.n11-plan{border:1px solid var(--line);border-radius:20px;display:grid;gap:12px;align-content:start}
.n11-plan.feat{background:var(--bg-secondary);border-color:#F59E0B66}
.n11-plan h3{font-family:var(--font-display);font-weight:400;font-size:1.8rem}
.n11-plan .p{font-family:var(--font-display);font-size:3rem;line-height:1}
.n11-plan .cad{font-size:.8rem;color:var(--text-muted)}
.n11-plan ul{display:grid;gap:6px;font-size:.92rem}
.n11-plan li::before{content:"◦ ";color:var(--accent)}
.n11-plan .fk{font-size:.84rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.n11-plans{grid-template-columns:1fr}}
.n11-table{width:100%;margin-top:40px;border-collapse:collapse;font-variant-numeric:tabular-nums}
.n11-table caption{text-align:left;font-family:var(--font-display);font-size:1.6rem;padding-bottom:12px}
.n11-table th,.n11-table td{text-align:left;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.n11-table thead th{font-weight:500;color:var(--text-muted);font-size:.8rem}
@media (max-width:700px){.n11-table th:nth-child(2),.n11-table td:nth-child(2){display:none}}

/* final + footer */
.n11-final{display:grid;justify-items:center;text-align:center;gap:28px}
.n11-final .n11-h2{font-size:clamp(3rem,6.4vw,5.6rem)}
.n11-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.86rem;color:var(--text-muted)}
.n11-foot h3{font-family:var(--font-display);font-weight:400;font-size:1.2rem;color:var(--text-primary);margin-bottom:12px}
.n11-foot ul{display:grid;gap:8px}
.n11-foot a{text-decoration:none}
.n11-foot a:hover{color:var(--text-primary)}
.n11-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.n11-foot{grid-template-columns:1fr 1fr}.n11-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="n11-nav">
  <a class="n11-mark" href="#main">${BRAND.name}</a>
  <nav class="n11-links" data-spy aria-label="Sections"><a href="#log">Log</a><a href="#dive">The dive</a><a href="#kit">Kit</a><a href="#route">Route</a><a href="#journal">Journal</a><a href="#manifest">Manifest</a></nav>
  <span class="n11-coord" aria-hidden="true">11°21′N 142°12′E</span>
</header>
<main id="main">
  <section class="n11-hero" data-hero aria-labelledby="n11-h">
    <div class="n11-sonar" data-hero-part="visual"><canvas id="sonar" role="img" aria-label="A sonar field; tap or move the pointer to send a ping"></canvas></div>
    <div class="n11-ruler" aria-hidden="true">${["+4,000", "+2,000", "0 m", "−2,000", "−4,000", "−6,000", "−8,000", "−10,000", "−10,928"].map((d, i) => `<span${i === 2 ? ' class="sea"' : ""}>${d}</span>`)}</div>
    <div class="n11-copy">
      <h1 id="n11-h" data-hero-part="headline">Go as deep as you need.</h1>
      <p class="k-body" data-hero-part="sub">From quick answers to refusal-free research to million-token archives: five model families on one key, billed per token on the way down.</p>
      <div data-hero-part="cta"><a class="n11-btn" href="#manifest" data-cta="primary" data-magnetic="6,0.12,0.82,0.4"><i aria-hidden="true"></i><span data-magnetic-label>Get your API key</span></a></div>
      <p class="n11-trust" data-hero-part="trust">Deepest dive: <b>Atlas</b>, ${M.atlas.context} context (placeholder spec), <b>${rate(M.atlas.cached)}</b> per 1M cached tokens.</p>
    </div>
  </section>

  <section id="log" data-section aria-labelledby="n11-l">
    <div class="k-wrap n11-cols">
      <h2 id="n11-l" class="n11-h2" data-reveal>Every other expedition turned back early.</h2>
      <ol class="n11-log" data-stagger>${PROBLEM.rows.map(([was, now], i) => `<li><span class="d">Day ${i + 1}</span><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ol>
    </div>
    <div class="n11-dive" id="dive">
      <aside class="n11-gauge" aria-live="polite">
        <span class="lbl">Depth</span>
        <div><b class="dep" id="dep">+4,000 m</b></div>
        <div class="n11-bar" id="bar"><i></i>${ZONES.map((z, i) => `<span style="top:${((i / (ZONES.length - 1)) * 100).toFixed(1)}%">${z.name}</span>`)}</div>
        <dl><div><dt>Model</dt><dd id="g-m">Swift · Standard</dd></div><div><dt>Context loaded</dt><dd id="g-c">360 tokens</dd></div><div><dt>Cost of this dive</dt><dd class="live" id="g-u">${ZONES[0].usd}</dd></div></dl>
      </aside>
      <div class="n11-zones">
        <div class="n11-pings" aria-hidden="true"><canvas id="pings"></canvas></div>
        ${ZONES.map((z, i) => `<article class="n11-zone" data-i="${i}"><p class="at">${z.depth > 0 ? "+" : z.depth < 0 ? "−" : ""}${Math.abs(z.depth).toLocaleString("en-US")} m</p><h3>${z.name}</h3><p>${z.text}</p><div class="kit"><span>${z.m.name}</span><span>${z.temper}</span><span>${(z.inTok + z.outTok).toLocaleString("en-US")} tokens</span><span>dive cost <b>${z.usd}</b></span></div></article>`)}
      </div>
    </div>
    <p class="k-wrap n11-fine">Sample dives at sample rates; the trench dive caches 90% of its prefix. ${PRICE_NOTE}</p>
  </section>

  <section id="kit" data-section aria-labelledby="n11-k">
    <div class="k-wrap">
      <h2 id="n11-k" class="n11-h2" data-reveal>The kit list, and what each item is for.</h2>
      <div class="n11-kit" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="n11-item k-card i${i}" data-spot><span class="tag">${f}</span><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="route" data-section aria-labelledby="n11-r">
    <div data-rail>
      <div data-rail-view>
        <div class="n11-rail-head"><h2 id="n11-r" class="n11-h2" data-reveal>The route, in three legs.</h2></div>
        <ol class="n11-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="n11-step k-card"><span class="n">Leg ${["one", "two", "three"][i]}</span><h3>${t}</h3><p>${d}</p>${i === 1 ? `<pre><code>baseURL: "${BRAND.apiBase}"\nmodel:   "unbound-128k"</code></pre>` : ""}</li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="journal" data-section aria-labelledby="n11-j">
    <div class="k-wrap">
      <h2 id="n11-j" class="n11-h2" data-reveal>From the expedition journal.</h2>
      <div class="n11-journal" data-stagger>${PROOF.map(([role, focus, q], i) => `<article class="n11-entry k-card"><p class="hd"><b>${role}</b><span>Entry ${i + 1} · ${focus}</span></p><q>${q}</q></article>`)}</div>
      <p class="n11-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="manifest" data-section aria-labelledby="n11-m">
    <div class="k-wrap">
      <h2 id="n11-m" class="n11-h2" data-reveal>The manifest: what each berth costs.</h2>
      <div class="n11-plans" data-stagger>${PLANS.map((p) => h`<article class="n11-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="n11-table" data-reveal>
        <caption>Rates per 1M tokens</caption>
        <thead><tr><th scope="col">Family</th><th scope="col">Best for</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="n11-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="n11-f">
    <div class="k-wrap n11-final">
      <h2 id="n11-f" class="n11-h2" data-reveal>Your descent starts with one key.</h2>
      <a class="n11-btn" href="#main" data-magnetic="6,0.12,0.82,0.4" data-reveal><i aria-hidden="true"></i><span data-magnetic-label>Get your API key</span></a>
    </div>
  </section>
</main>
<footer class="n11-foot">
  <div><p class="n11-mark">${BRAND.name}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Depths</h3><ul>${ZONES.map((z) => `<li><a href="#dive">${z.name}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#kit">Features</a></li><li><a href="#route">API quickstart</a></li><li><a href="#manifest">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in DM Serif Display and Red Hat Text.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, canvas, loop, onScroll, pointer } = K;
    const TAU = Math.PI * 2;

    // —— hero sonar: rings from the pointer (or a slow sweep) reveal a seafloor ——
    const sc = $("#sonar"), ss = canvas(sc);
    const pings = [];
    let lastPing = 0;
    const floor = (x, w, h) => h * 0.78 + Math.sin(x * 0.006) * h * 0.06 + Math.sin(x * 0.019 + 1) * h * 0.025;
    sc.parentElement.parentElement.addEventListener("pointerdown", (e) => { const r = sc.getBoundingClientRect(); pings.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }); });
    loop(sc, (t) => {
      const { ctx, w, h } = ss;
      ctx.clearRect(0, 0, w, h);
      const now = performance.now();
      if (now - lastPing > 1600) {
        lastPing = now;
        const r = sc.getBoundingClientRect();
        pings.push(pointer.active ? { x: pointer.x - r.left, y: pointer.y - r.top, t: now } : { x: w * (0.55 + 0.3 * Math.sin(t * 0.3)), y: h * 0.35, t: now });
      }
      // seafloor contour lit by rings
      ctx.lineWidth = 1;
      for (let k = 0; k < 4; k++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) { const y = floor(x, w, h) + k * 18; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.strokeStyle = `rgba(157,176,198,${0.16 - k * 0.03})`; ctx.stroke();
      }
      for (let i = pings.length - 1; i >= 0; i--) {
        const p = pings[i], age = (now - p.t) / 1000, R = age * 260;
        if (age > 3.2) { pings.splice(i, 1); continue; }
        const a = Math.max(0, 1 - age / 3.2);
        ctx.strokeStyle = `rgba(245,158,11,${a * 0.55})`; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, TAU); ctx.stroke();
        ctx.strokeStyle = `rgba(234,241,248,${a * 0.18})`; ctx.beginPath(); ctx.arc(p.x, p.y, R * 0.7, 0, TAU); ctx.stroke();
        // echoes where the ring meets the floor
        for (let x = 0; x < w; x += 10) { const y = floor(x, w, h); const d = Math.hypot(x - p.x, y - p.y); if (Math.abs(d - R) < 8) { ctx.fillStyle = `rgba(245,158,11,${a})`; ctx.fillRect(x - 1, y - 1, 3, 3); } }
      }
    });

    // —— the descent: gauge, background depth and pings per zone ——
    const Z = [
      { d: 4000, m: "Swift · Standard", c: 360 }, { d: 0, m: "Core · Standard", c: 3000 }, { d: -2000, m: "Core · Low-refusal", c: 3000 },
      { d: -6000, m: "Unbound · Abliterated", c: 3900 }, { d: -10928, m: "Atlas · Standard", c: 801200 },
    ];
    const zones = $$(".n11-zone"), dep = $("#dep"), bar = $("#bar"), gm = $("#g-m"), gc = $("#g-c"), gu = $("#g-u");
    const costs = zones.map((z) => z.querySelector(".kit b").textContent);
    let pos = 0;
    onScroll(() => {
      const mid = innerHeight * 0.55;
      let p = 0;
      zones.forEach((z, i) => { const r = z.getBoundingClientRect(); if (r.top < mid) p = i + clamp((mid - r.top) / r.height); });
      pos = clamp(p, 0, zones.length - 1);
      const i = Math.floor(pos), f = pos - i, j = Math.min(i + 1, Z.length - 1);
      const d = Math.round(lerp(Z[i].d, Z[j].d, f));
      dep.textContent = (d > 0 ? "+" : d < 0 ? "−" : "") + Math.abs(d).toLocaleString("en-US") + " m";
      bar.style.setProperty("--d", (pos / (zones.length - 1)).toFixed(4));
      const k = Math.round(pos);
      gm.textContent = Z[k].m; gc.textContent = Math.round(lerp(Z[i].c, Z[j].c, f)).toLocaleString("en-US") + " tokens"; gu.textContent = costs[k];
    });
    const pc = $("#pings");
    if (pc) {
      const ps = canvas(pc);
      loop(pc, (t) => {
        const { ctx, w, h } = ps;
        ctx.clearRect(0, 0, w, h);
        const x = w * 0.78, y = h * 0.5, depth = pos / (zones.length - 1);
        for (let k = 0; k < 3; k++) {
          const age = ((RM ? 0.5 : t) * 0.4 + k / 3) % 1, R = age * Math.min(w, h) * (0.3 + depth * 0.4);
          ctx.strokeStyle = `rgba(245,158,11,${(1 - age) * (0.25 + depth * 0.35)})`; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.stroke();
        }
        ctx.fillStyle = "#F59E0B"; ctx.beginPath(); ctx.arc(x, y, 4, 0, TAU); ctx.fill();
      });
    }
  }),
};
