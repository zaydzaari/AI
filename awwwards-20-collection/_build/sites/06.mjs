import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, usd } from "../aether.mjs";

const STYLE = "Nocturne";
const CORE = MODELS[0];
const REQ = { cached: 9000, fresh: 1200, out: 600 };
const NOTES = [
  { key: "top", name: "Top notes", what: "Output tokens", line: "What you notice first, and the priciest per token. Shorter answers, smaller bill.", tok: REQ.out, price: CORE.outPrice },
  { key: "heart", name: "Heart notes", what: "Fresh input tokens", line: "The body of the request: the question and anything that changed since last time.", tok: REQ.fresh, price: CORE.inPrice },
  { key: "base", name: "Base notes", what: "Cached input tokens", line: "System prompts and documents that repeat. They linger, billed at the cached rate.", tok: REQ.cached, price: CORE.cached },
].map((n) => ({ ...n, cost: (n.tok * n.price) / 1e6 }));
const TOTAL = NOTES.reduce((a, n) => a + n.cost, 0);

export default {
  title: "Aether — Know exactly what every answer is made of",
  description: "Every response is a blend of output, fresh input and cached tokens; Aether lists each note and its price for every model family. Nocturne design direction.",
  fonts: [
    { family: "Instrument Serif", axes: "ital@0;1" },
    { family: "Work Sans", axes: "wght@300;400;500;600" },
  ],
  tokens: {
    bgPrimary: "#120E0A", bgSecondary: "#1F1812", accent: "#E5A93C", onAccent: "#120E0A",
    textPrimary: "#F3E9DA", textMuted: "#B3A28C", line: "rgba(243,233,218,.13)",
    display: '"Instrument Serif", Georgia, serif', body: '"Work Sans", sans-serif',
  },
  css: /* css */ `
body{font-weight:300}
.n6-nav{position:fixed;inset:0 0 auto;z-index:40;height:64px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 var(--gutter);background:linear-gradient(#120E0Af2,#120E0A00);font-size:.84rem}
.n6-mark{font-family:var(--font-display);font-size:1.6rem;text-decoration:none;font-style:italic}
.n6-links{display:flex;gap:26px}
.n6-links a{text-decoration:none;color:var(--text-muted);position:relative;padding:6px 0}
.n6-links a::after{content:"";position:absolute;left:50%;bottom:0;width:4px;height:4px;border-radius:50%;background:var(--accent);transform:translateX(-50%) scale(0);transition:transform .4s var(--ease)}
.n6-links a.is-current{color:var(--text-primary)}
.n6-links a.is-current::after{transform:translateX(-50%) scale(1)}
.n6-ed{justify-self:end;color:var(--text-muted);font-style:italic;font-family:var(--font-display);font-size:1.05rem}
@media (max-width:860px){.n6-links{display:none}.n6-nav{grid-template-columns:1fr auto}}
.n6-btn{display:inline-flex;align-items:center;gap:12px;min-height:56px;padding:0 30px;border-radius:2px;background:var(--accent);color:var(--on-accent);font-weight:500;letter-spacing:.02em;text-decoration:none;box-shadow:0 0 50px -10px #E5A93C99;transition:box-shadow .4s}
.n6-btn.is-near{box-shadow:0 0 70px -6px #E5A93Ccc}
.n6-h2{font-size:clamp(2.6rem,5vw,4.6rem);font-weight:400;letter-spacing:-.02em;line-height:1;max-width:16ch}
.n6-fine{margin-top:22px;font-size:.8rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: triptych */
.n6-hero{min-height:100svh;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr) minmax(0,.8fr);gap:clamp(24px,3vw,48px);align-items:center;padding:88px var(--gutter) 32px;background:radial-gradient(600px 500px at 50% 60%,#3A2A1544,transparent 70%)}
.n6-copy{display:grid;gap:22px;justify-items:start}
.n6-copy h1{font-weight:400;line-height:.96}
.n6-copy h1 em{color:var(--text-muted)}
.n6-copy .k-body{color:var(--text-muted);max-width:40ch}
.n6-flacon{position:relative;height:min(74vh,660px)}
.n6-flacon canvas{width:100%;height:100%}
.n6-ledger{display:grid;gap:0;border-top:1px solid var(--line);align-self:end;margin-bottom:6vh}
.n6-ledger .hd{font-family:var(--font-display);font-style:italic;font-size:1.2rem;padding:14px 0 8px}
.n6-ledger li{display:grid;grid-template-columns:1fr auto;gap:2px 12px;padding:12px 0;border-bottom:1px solid var(--line);font-size:.86rem}
.n6-ledger li span{color:var(--text-muted)}
.n6-ledger li b{font-weight:500;font-variant-numeric:tabular-nums}
.n6-ledger .note{grid-column:1 / -1;font-size:.74rem;color:var(--text-muted)}
@media (max-width:980px){
  .n6-hero{grid-template-columns:1fr 120px;grid-template-rows:auto auto;gap:14px;padding:76px var(--gutter) 16px;align-content:start}
  .n6-copy{grid-column:1 / -1;gap:12px}
  .n6-flacon{grid-column:2;grid-row:2;height:150px}
  .n6-ledger{grid-column:1;grid-row:2;margin:0;align-self:start}
  .n6-ledger .hd{display:none}
  .n6-ledger li{padding:6px 0;font-size:.76rem}
}

/* problem */
.n6-split{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:end}
.n6-vials{display:grid;gap:12px}
.n6-vials li{display:grid;gap:6px;padding:22px 24px;border:1px solid var(--line);border-radius:999px 999px 24px 24px / 60px 60px 24px 24px;background:linear-gradient(#1F1812,#170F09)}
.n6-vials .was{color:var(--text-muted);font-size:.9rem}
.n6-vials .now{font-family:var(--font-display);font-size:1.6rem;line-height:1.15}
@media (max-width:900px){.n6-split{grid-template-columns:1fr;gap:40px}}

/* signature: pinned horizontal scent pyramid */
.n6-pyr{margin-top:clamp(64px,6vw,80px)}
.n6-pyr [data-rail]{position:relative}

.n6-pcv{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.n6-panels{padding:0 var(--gutter);gap:24px;position:relative}
.n6-panel{width:min(560px,74vw);display:grid;gap:16px;align-content:end;min-height:62vh;padding:40px;border-left:1px solid var(--line);position:relative}
.n6-panel .tier{font-size:.8rem;color:var(--text-muted)}
.n6-panel h3{font-family:var(--font-display);font-weight:400;font-size:clamp(3rem,6vw,5rem);line-height:.9}
.n6-panel .what{font-size:1.05rem}
.n6-panel p{color:var(--text-muted);max-width:40ch}
.n6-panel dl{display:grid;grid-template-columns:repeat(3,auto);justify-content:start;gap:4px 28px;border-top:1px solid var(--line);padding-top:14px}
.n6-panel dt{font-size:.72rem;color:var(--text-muted)}
.n6-panel dd{margin:0;font-family:var(--font-display);font-size:1.6rem}
.n6-panel.intro h3{font-size:clamp(2.6rem,4.6vw,4rem)}
.n6-panel.sum{border-left:1px solid var(--accent)}
.n6-panel .bar{display:flex;height:10px;border-radius:10px;overflow:hidden;width:100%;max-width:380px}
.n6-panel .bar i{display:block;height:100%}
@media (max-width:899px){.n6-panel{width:auto;min-height:0;padding:28px 0 28px 22px}.n6-pcv{display:none}}

/* how it works: vertical decoction */
.n6-how{display:grid;grid-template-columns:4fr 8fr;gap:64px}
.n6-how .n6-h2{position:sticky;top:110px;align-self:start}
.n6-dec{position:relative;display:grid;gap:clamp(64px,6vw,80px);padding-left:40px}
.n6-dec::before{content:"";position:absolute;left:0;top:0;bottom:0;width:1px;background:var(--line)}
.n6-dec::after{content:"";position:absolute;left:0;top:0;width:1px;height:100%;background:var(--accent);transform:scaleY(var(--fill,0));transform-origin:top}
.n6-dec li{display:grid;gap:12px}
.n6-dec .n{font-family:var(--font-display);font-style:italic;font-size:1.4rem;color:var(--text-muted)}
.n6-dec h3{font-family:var(--font-display);font-weight:400;font-size:2.4rem;line-height:1}
.n6-dec p{color:var(--text-muted);max-width:52ch}
.n6-dec pre{margin:0;background:var(--bg-secondary);border:1px solid var(--line);padding:16px;font-size:.78rem;line-height:1.6;overflow-x:auto;white-space:pre;color:#E9DCC7}
@media (max-width:900px){.n6-how{grid-template-columns:1fr;gap:40px}.n6-how .n6-h2{position:static}}

/* bento: the cabinet */
.n6-cab{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.n6-drawer{position:relative;isolation:isolate;background:var(--bg-primary);display:grid;gap:14px;align-content:start;min-height:280px}
.n6-drawer::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(260px circle at var(--mx) var(--my),#E5A93C1f,transparent 65%);opacity:0;transition:opacity .35s}
.n6-drawer:hover::before{opacity:1}
.n6-drawer .lbl{font-size:.76rem;color:var(--text-muted);display:flex;justify-content:space-between}
.n6-drawer h3{font-family:var(--font-display);font-weight:400;font-size:1.9rem;line-height:1.05}
.n6-drawer p{color:var(--text-muted);font-size:.92rem}
.n6-drawer.d0{grid-column:span 2;background:var(--bg-secondary)}
.n6-drawer.d0 h3{font-size:clamp(2.4rem,3.6vw,3.2rem)}
.n6-drawer.d5{grid-column:span 2}
@media (max-width:900px){.n6-cab{grid-template-columns:1fr}.n6-drawer{grid-column:auto!important}}

/* impressions */
.n6-imp{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.n6-card{border-top:1px solid var(--accent);display:grid;gap:16px;align-content:start;background:linear-gradient(#1F1812,transparent)}
.n6-card q{font-family:var(--font-display);font-size:1.3rem;line-height:1.3;quotes:"“" "”"}
.n6-card p{font-size:.82rem;color:var(--text-muted)}
.n6-card b{display:block;color:var(--text-primary);font-weight:500}
@media (max-width:1000px){.n6-imp{grid-template-columns:1fr 1fr}}
@media (max-width:600px){.n6-imp{grid-template-columns:1fr}}

/* price list */
.n6-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.n6-plan{border:1px solid var(--line);display:grid;gap:14px;align-content:start}
.n6-plan.feat{background:var(--bg-secondary);border-color:#E5A93C66}
.n6-plan h3{font-family:var(--font-display);font-size:1.8rem;font-weight:400}
.n6-plan .p{font-family:var(--font-display);font-size:3rem;line-height:1}
.n6-plan .cad{font-size:.8rem;color:var(--text-muted)}
.n6-plan ul{display:grid;gap:6px;font-size:.9rem}
.n6-plan li::before{content:"· ";color:var(--accent)}
.n6-plan .fk{font-size:.84rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.n6-plans{grid-template-columns:1fr}}
.n6-list{width:100%;margin-top:40px;border-collapse:collapse;font-variant-numeric:tabular-nums}
.n6-list caption{text-align:left;font-family:var(--font-display);font-size:1.8rem;font-style:italic;padding-bottom:12px}
.n6-list th,.n6-list td{text-align:left;padding:14px 12px 14px 0;border-bottom:1px solid var(--line)}
.n6-list thead th{font-weight:400;color:var(--text-muted);font-size:.8rem}
.n6-list tbody th{font-family:var(--font-display);font-weight:400;font-size:1.3rem}
@media (max-width:700px){.n6-list th:nth-child(2),.n6-list td:nth-child(2){display:none}}

/* final + footer */
.n6-final{display:grid;justify-items:center;text-align:center;gap:30px}
.n6-final .n6-h2{font-size:clamp(3rem,6.4vw,5.6rem);max-width:14ch}
.n6-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.84rem;color:var(--text-muted)}
.n6-foot h4{font-family:var(--font-display);font-weight:400;font-size:1.2rem;color:var(--text-primary);margin-bottom:12px}
.n6-foot ul{display:grid;gap:8px}
.n6-foot a{text-decoration:none}
.n6-foot a:hover{color:var(--text-primary)}
.n6-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.n6-foot{grid-template-columns:1fr 1fr}.n6-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="n6-nav">
  <a class="n6-mark" href="#main">${BRAND.name}</a>
  <nav class="n6-links" data-spy aria-label="Sections"><a href="#blend">The blend</a><a href="#pyramid">Pyramid</a><a href="#method">Method</a><a href="#cabinet">Cabinet</a><a href="#prices">Price list</a></nav>
  <span class="n6-ed">Nocturne edition</span>
</header>
<main id="main">
  <section class="n6-hero" data-hero aria-labelledby="n6-h">
    <div class="n6-copy">
      <h1 id="n6-h" data-hero-part="headline">Know exactly what every answer is <em>made of.</em></h1>
      <p class="k-body" data-hero-part="sub">Every response is a blend of output, fresh input and cached tokens. ${BRAND.name} prices each note separately, for every model family.</p>
      <div data-hero-part="cta"><a class="n6-btn" href="#prices" data-cta="primary" data-magnetic="6,0.1,0.85,0.35"><span data-magnetic-label>Get your API key</span></a></div>
    </div>
    <div class="n6-flacon" data-hero-part="visual"><canvas id="flacon" role="img" aria-label="A glass flacon releasing particles; the pointer stirs them"></canvas></div>
    <ol class="n6-ledger" data-hero-part="trust" aria-label="Core's per-note sample rates">
      <li class="hd">The notes of Core, per 1M tokens</li>
      ${NOTES.map((n) => `<li><span>${n.name}</span><b>${rate(n.price)}</b><span class="note">${n.what}</span></li>`)}
    </ol>
  </section>

  <section id="blend" data-section aria-labelledby="n6-b">
    <div class="k-wrap n6-split">
      <h2 id="n6-b" class="n6-h2" data-reveal>Most AI bills come in an unlabelled bottle.</h2>
      <ul class="n6-vials" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ul>
    </div>
    <div class="n6-pyr" id="pyramid">
      <div data-rail>
        <div data-rail-view>
          <canvas class="n6-pcv" id="pyr-cv" aria-hidden="true"></canvas>
          <ol class="n6-panels" data-rail-track>
            <li class="n6-panel intro"><span class="tier">One Core request, sample rates</span><h3>The scent pyramid of a single answer.</h3><p>${REQ.cached.toLocaleString("en-US")} cached tokens, ${REQ.fresh.toLocaleString("en-US")} fresh and ${REQ.out} out. Scroll sideways through its notes.</p></li>
            ${NOTES.map((n) => `<li class="n6-panel" data-note="${n.key}"><span class="tier">${n.name}</span><h3>${n.what}</h3><p>${n.line}</p><dl><div><dt>Tokens</dt><dd>${n.tok.toLocaleString("en-US")}</dd></div><div><dt>Rate / 1M</dt><dd>${rate(n.price)}</dd></div><div><dt>Share</dt><dd class="live">${Math.round((n.cost / TOTAL) * 100)}%</dd></div></dl></li>`)}
            <li class="n6-panel sum"><span class="tier">The whole bottle</span><h3>${usd(TOTAL)}</h3><p>That is the full price of the answer, itemised on the response. Without caching, the base notes alone would cost ${usd((REQ.cached * CORE.inPrice) / 1e6)}.</p><span class="bar" aria-hidden="true">${NOTES.map((n, i) => `<i style="width:${((n.cost / TOTAL) * 100).toFixed(1)}%;background:${["#E5A93C", "#B3A28C", "#6E5A40"][i]}"></i>`)}</span></li>
          </ol>
        </div>
      </div>
      <p class="k-wrap n6-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="method" data-section aria-labelledby="n6-m">
    <div class="k-wrap n6-how">
      <h2 id="n6-m" class="n6-h2" data-reveal>The method, in three steps.</h2>
      <ol class="n6-dec" id="dec">
        ${STEPS.map(([t, d], i) => `<li data-reveal><span class="n">${["First", "Then", "Finally"][i]}</span><h3>${t}</h3><p>${d}</p>${i === 1 ? `<pre><code>baseURL: "${BRAND.apiBase}"\nmodel:   "core-128k"</code></pre>` : ""}</li>`)}
      </ol>
    </div>
  </section>

  <section id="cabinet" data-section aria-labelledby="n6-c">
    <div class="k-wrap">
      <h2 id="n6-c" class="n6-h2" data-reveal>The cabinet: each drawer, and what it does for you.</h2>
      <div class="n6-cab" data-stagger>
        ${BENEFITS.map(([f, b, d], i) => `<article class="n6-drawer k-card d${i}" data-spot><p class="lbl"><span>${f}</span><span>No. ${String(i + 1).padStart(2, "0")}</span></p><h3>${b}</h3><p>${d}</p></article>`)}
      </div>
    </div>
  </section>

  <section id="voices" data-section aria-labelledby="n6-v">
    <div class="k-wrap">
      <h2 id="n6-v" class="n6-h2" data-reveal>Impressions, by role.</h2>
      <div class="n6-imp" data-stagger>${PROOF.map(([role, focus, q]) => `<figure class="n6-card k-card"><q>${q}</q><p><b>${role}</b>${focus}</p></figure>`)}</div>
      <p class="n6-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="prices" data-section aria-labelledby="n6-p">
    <div class="k-wrap">
      <h2 id="n6-p" class="n6-h2" data-reveal>The price list, note by note.</h2>
      <div class="n6-plans" data-stagger>
        ${PLANS.map((p) => h`<article class="n6-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}
      </div>
      <table class="n6-list" data-reveal>
        <caption>Per 1M tokens</caption>
        <thead><tr><th scope="col">Family</th><th scope="col">Character</th><th scope="col">Top (output)</th><th scope="col">Heart (input)</th><th scope="col">Base (cached)</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${rate(m.outPrice)}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td></tr>`)}</tbody>
      </table>
      <p class="n6-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="n6-f">
    <div class="k-wrap n6-final">
      <h2 id="n6-f" class="n6-h2" data-reveal>Uncork your first request.</h2>
      <a class="n6-btn" href="#main" data-magnetic="6,0.1,0.85,0.35" data-reveal><span data-magnetic-label>Get your API key</span></a>
    </div>
  </section>
</main>
<footer class="n6-foot">
  <div><p class="n6-mark">${BRAND.name}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h4>Families</h4><ul>${MODELS.map((m) => `<li><a href="#prices">${m.name}</a></li>`)}</ul></div>
  <div><h4>Platform</h4><ul><li><a href="#pyramid">Token pricing</a></li><li><a href="#method">API quickstart</a></li><li><a href="#cabinet">Features</a></li></ul></div>
  <div><h4>Exhibition</h4><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Instrument Serif and Work Sans.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;

    // —— hero flacon: amber glass, particles rising from the neck; the pointer stirs them ——
    const fc = $("#flacon"), fs = canvas(fc);
    const parts = Array.from({ length: 180 }, () => ({ x: 0, y: 0, vx: 0, vy: 0, life: Math.random(), size: 0 }));
    const respawn = (p, w, h) => { p.x = w / 2 + (Math.random() - 0.5) * w * 0.05; p.y = h * 0.3; p.vx = (Math.random() - 0.5) * 0.3; p.vy = -0.4 - Math.random() * 0.8; p.life = 1; p.size = 0.6 + Math.random() * 1.8; };
    loop(fc, (t, dt) => {
      const { ctx, w, h } = fs;
      ctx.clearRect(0, 0, w, h);
      const bw = Math.min(w * 0.7, h * 0.42), bx = w / 2, by = h * 0.68;
      // body
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bx - bw * 0.14, h * 0.32); ctx.lineTo(bx - bw * 0.14, h * 0.4);
      ctx.bezierCurveTo(bx - bw * 0.55, h * 0.44, bx - bw * 0.55, by + bw * 0.5, bx - bw * 0.3, by + bw * 0.56);
      ctx.lineTo(bx + bw * 0.3, by + bw * 0.56);
      ctx.bezierCurveTo(bx + bw * 0.55, by + bw * 0.5, bx + bw * 0.55, h * 0.44, bx + bw * 0.14, h * 0.4);
      ctx.lineTo(bx + bw * 0.14, h * 0.32); ctx.closePath();
      const g = ctx.createLinearGradient(bx - bw / 2, 0, bx + bw / 2, 0);
      g.addColorStop(0, "rgba(229,169,60,.18)"); g.addColorStop(0.45, "rgba(229,169,60,.06)"); g.addColorStop(1, "rgba(229,169,60,.22)");
      ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "rgba(243,233,218,.45)"; ctx.lineWidth = 1.2; ctx.stroke();
      ctx.clip();
      const lvl = by + bw * 0.1 + Math.sin(t * 1.4) * 3;
      const liq = ctx.createLinearGradient(0, lvl, 0, by + bw * 0.6);
      liq.addColorStop(0, "rgba(229,169,60,.55)"); liq.addColorStop(1, "rgba(120,70,20,.75)");
      ctx.fillStyle = liq; ctx.fillRect(0, lvl, w, h);
      ctx.restore();
      // stopper
      ctx.fillStyle = "#2B2016"; ctx.strokeStyle = "rgba(243,233,218,.35)";
      ctx.fillRect(bx - bw * 0.1, h * 0.26, bw * 0.2, h * 0.06); ctx.strokeRect(bx - bw * 0.1, h * 0.26, bw * 0.2, h * 0.06);
      // vapour
      const r = fc.getBoundingClientRect(), px = pointer.x - r.left, py = pointer.y - r.top;
      for (const p of parts) {
        if (p.life <= 0 || !p.size) { if (!RM) respawn(p, w, h); continue; }
        const dx = p.x - px, dy = p.y - py, d = Math.hypot(dx, dy);
        if (pointer.active && d < 120) { p.vx += (-dy / d) * 0.08; p.vy += (dx / d) * 0.05; }
        p.vx += Math.sin(p.y * 0.03 + t) * 0.01; p.x += p.vx; p.y += p.vy; p.vy *= 0.995; p.life -= dt * 0.25;
        ctx.fillStyle = `rgba(229,169,60,${Math.max(0, p.life) * 0.7})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
      }
    });

    // —— signature: notes evaporate as the pyramid rail passes ——
    const run = $("#pyramid [data-rail]"), pc = $("#pyr-cv"), ps = canvas(pc);
    const panels = $$(".n6-panel[data-note]");
    const speed = { top: 1.6, heart: 0.9, base: 0.35 };
    const clouds = panels.map((el) => ({ el, key: el.dataset.note, dots: Array.from({ length: 140 }, () => ({ u: Math.random(), v: Math.random(), s: 0.8 + Math.random() * 2.2, ph: Math.random() * TAU })) }));
    let p = 0;
    onScroll(() => { p = RM ? 0 : progress(run); });
    loop(pc, (t) => {
      const { ctx, w, h } = ps;
      ctx.clearRect(0, 0, w, h);
      const cr = pc.getBoundingClientRect();
      for (const c of clouds) {
        const r = c.el.getBoundingClientRect();
        const x0 = r.left - cr.left, cx = x0 + r.width * 0.55;
        // how far this panel has travelled past the centre of the viewport
        const pass = clamp((w * 0.65 - x0) / (w * 0.9));
        const evap = clamp(pass * speed[c.key] * 1.4);
        for (const d of c.dots) {
          const lift = evap * h * 0.5 * (0.4 + d.v);
          const x = cx + (d.u - 0.5) * r.width * 0.8 + Math.sin(t + d.ph) * 6 * evap;
          const y = h * 0.32 + d.v * h * 0.22 - lift;
          const a = (1 - evap) * 0.55 + 0.05;
          ctx.fillStyle = c.key === "top" ? `rgba(229,169,60,${a})` : c.key === "heart" ? `rgba(243,233,218,${a * 0.7})` : `rgba(179,162,140,${a})`;
          ctx.beginPath(); ctx.arc(x, y, d.s * (1 + evap), 0, TAU); ctx.fill();
        }
      }
    });

    // —— method: a single amber line fills as the steps scroll past ——
    const dec = $("#dec");
    onScroll(() => { const r = dec.getBoundingClientRect(); dec.style.setProperty("--fill", clamp((innerHeight * 0.6 - r.top) / r.height).toFixed(3)); });
  }),
};
