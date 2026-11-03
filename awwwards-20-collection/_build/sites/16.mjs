import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Stratosphere";
const CORE = MODELS[0];
const LEGS = [
  ["AUTH", "Key checked", "One key, every model family", "0 tok"],
  ["ROUTE", "Model chosen", "core-128k:low-refusal", "—"],
  ["CACHE", "Prefix found", "1,800 of 2,450 input tokens cached", "1,800 cached"],
  ["MODEL", "Answer generated", "Core writes 620 tokens", "620 out"],
  ["STREAM", "Tokens delivered", "Streamed as they were generated", "3,070 total"],
  ["BILL", "Strip printed", "Tokens, cached tokens and cost on the response", usd(cost(CORE, 2450, 620, 1800 / 2450))],
];

export default {
  title: "Aether — Forecast your token bill before takeoff",
  description: "Every request flies the same route — key, router, cache, model, stream, invoice — and lands with its cost printed on the strip. Stratosphere design direction.",
  fonts: [
    { family: "Sora", axes: "wght@300;400;600;700" },
    { family: "IBM Plex Mono", axes: "wght@400;500;600" },
  ],
  tokens: {
    bgPrimary: "#F0F4F8", bgSecondary: "#DCE5EE", accent: "#0284C7", onAccent: "#04131F",
    textPrimary: "#0F2133", textMuted: "#4A5D72", line: "rgba(15,33,51,.15)",
    display: '"Sora", sans-serif', body: '"IBM Plex Mono", ui-monospace, monospace',
  },
  css: /* css */ `
.st16-nav{position:fixed;inset:0 0 auto;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);font-size:.78rem}
.st16-mark{font-family:var(--font-display);font-weight:600;font-size:1.15rem;text-decoration:none;color:var(--text-primary)}
.st16-links{display:flex;gap:4px;padding:5px;border-radius:999px;background:#F0F4F8cc;border:1px solid var(--line)}
.st16-links a{text-decoration:none;color:var(--text-muted);padding:6px 12px;border-radius:999px}
.st16-links a.is-current{background:var(--text-primary);color:#fff}
.st16-fl{color:var(--text-muted)}
@media (max-width:900px){.st16-links{display:none}}
.st16-btn{display:inline-flex;align-items:center;gap:12px;min-height:56px;padding:0 28px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:700;text-decoration:none;box-shadow:0 12px 28px -14px #0284C7}
.st16-btn svg{width:20px;height:20px;transition:transform .5s var(--ease)}
.st16-btn.is-near svg{transform:translate(3px,-3px) rotate(-8deg)}
.st16-h2{font-size:clamp(2.4rem,4.6vw,4.2rem);font-weight:400;letter-spacing:-.035em;line-height:1;max-width:18ch}
.st16-fine{margin-top:22px;font-size:.76rem;color:var(--text-muted)}
.big{font-family:var(--font-display);font-weight:700;font-variant-numeric:tabular-nums}
.big.live{color:#0369A1}

/* hero: sky over instrument band */
.st16-hero{position:relative;min-height:100svh;display:grid;grid-template-rows:1fr auto;overflow:clip}
.st16-sky{position:relative}
.st16-sky canvas{position:absolute;inset:0;width:100%;height:100%}
.st16-sky h1{position:absolute;left:var(--gutter);bottom:28px;max-width:13ch;font-weight:400;color:var(--text-primary)}
.st16-band{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:24px 40px;align-items:center;padding:22px var(--gutter) 24px;background:var(--bg-primary);border-top:1px solid var(--line)}
.st16-band .k-body{color:var(--text-muted)}
.st16-act{display:grid;gap:14px;justify-items:start}
.st16-strip{display:grid;grid-template-columns:auto 1fr auto auto;gap:0;border:1px solid var(--text-primary);background:#FFFFFF;font-size:.74rem;min-width:0;width:100%}
.st16-strip span{padding:8px 10px;border-right:1px solid var(--line);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.st16-strip span:last-child{border-right:0}
.st16-strip .id{background:var(--text-primary);color:#fff;font-weight:600}
.st16-strip .ok{font-weight:600}
@media (max-width:900px){
  .st16-hero{grid-template-rows:minmax(170px,1fr) auto}
  .st16-sky h1{bottom:14px}
  .st16-band{grid-template-columns:1fr;gap:12px;padding:14px var(--gutter) 16px}
  .st16-act{gap:10px}
  .st16-strip{grid-template-columns:auto 1fr auto}
  .st16-strip span:nth-child(3){display:none}
}

/* problem */
.st16-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.st16-turb{display:grid;gap:10px}
.st16-turb li{display:grid;grid-template-columns:auto 1fr 1fr;gap:20px;align-items:baseline;padding:18px 20px;background:#fff;border:1px solid var(--line);border-left:4px solid var(--text-muted)}
.st16-turb .c{font-size:.7rem;color:var(--text-muted)}
.st16-turb .was{color:var(--text-muted);font-size:.86rem}
.st16-turb .now{font-family:var(--font-display);font-size:1.05rem}
@media (max-width:900px){.st16-cols{grid-template-columns:1fr;gap:40px}.st16-turb li{grid-template-columns:1fr;gap:4px}}

/* signature: the flight path */
.st16-run{height:460vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.st16-pin{position:sticky;top:0;height:100vh;display:grid;grid-template-rows:1fr auto;gap:16px;padding:72px var(--gutter) 20px;background:linear-gradient(#D6E6F3,#F0F4F8 70%)}
.st16-path{position:relative;min-height:0}
.st16-path canvas{position:absolute;inset:0;width:100%;height:100%}
.st16-board{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.st16-leg{display:grid;gap:4px;padding:10px 12px;background:#FFFFFF;border:1px solid var(--line);font-size:.72rem;opacity:.5;transform:translateY(10px);transition:opacity .5s,transform .6s var(--ease),border-color .4s}
.st16-leg.on{opacity:1;transform:none}
.st16-leg.now{border-color:var(--text-primary);box-shadow:0 0 0 1px var(--text-primary)}
.st16-leg b{font-size:.78rem;font-weight:600}
.st16-leg .c{display:flex;justify-content:space-between;color:var(--text-muted)}
.st16-leg .v{font-family:var(--font-display);font-size:1rem;font-weight:600}
@media (max-width:900px){
  .st16-run{height:420vh}
  .st16-pin{padding:66px var(--gutter) 12px}
  .st16-board{grid-template-columns:repeat(3,1fr)}
  .st16-leg .c span:last-child{display:none}
}
@media (prefers-reduced-motion:reduce){.st16-run{height:auto}.st16-pin{position:relative;height:100vh}.st16-leg{opacity:1;transform:none}}

/* calculator */
.st16-calc{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:center;background:#fff;border:1px solid var(--line);border-radius:28px;padding:clamp(28px,4vw,48px)}
.st16-calc form{display:grid;gap:22px}
.st16-calc label{display:grid;gap:6px;font-size:.78rem;color:var(--text-muted)}
.st16-calc label b{color:var(--text-primary);font-size:.9rem}
.st16-calc input[type=range]{width:100%;accent-color:var(--accent);height:26px}
.st16-calc select{min-height:44px;border:1px solid var(--line);border-radius:10px;padding:0 10px;background:#F7FAFC;color:var(--text-primary)}
.st16-out{display:grid;gap:10px}
.st16-out span{font-size:.78rem;color:var(--text-muted)}
.st16-out .big{font-size:clamp(3rem,6vw,5rem);line-height:1;letter-spacing:-.04em}
.st16-out dl{display:grid;grid-template-columns:1fr 1fr;gap:10px;border-top:1px solid var(--line);padding-top:14px}
.st16-out dt{font-size:.7rem;color:var(--text-muted)}
.st16-out dd{margin:0;font-weight:600;font-variant-numeric:tabular-nums}
@media (max-width:900px){.st16-calc{grid-template-columns:1fr}}

/* bento */
.st16-bento{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.st16-card{position:relative;isolation:isolate;overflow:hidden;border-radius:24px;background:#fff;border:1px solid var(--line);display:grid;gap:12px;align-content:start;min-height:240px}
.st16-card::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(280px circle at var(--mx) var(--my),#0284C714,transparent 65%);opacity:0;transition:opacity .3s}
.st16-card:hover::before{opacity:1}
.st16-card .tag{font-size:.72rem;color:var(--text-muted)}
.st16-card h3{font-family:var(--font-display);font-size:1.5rem;font-weight:600;letter-spacing:-.02em;line-height:1.12}
.st16-card p{font-size:.86rem;color:var(--text-muted)}
.st16-card.c0{grid-column:span 2;background:linear-gradient(160deg,#D6E6F3,#fff)}.st16-card.c0 h3{font-size:clamp(2rem,3.2vw,2.8rem);font-weight:400}
.st16-card.c5{grid-column:span 2}
@media (max-width:900px){.st16-bento{grid-template-columns:1fr}.st16-card{grid-column:auto!important}}

/* rail */
.st16-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.st16-steps{padding:0 var(--gutter);gap:14px}
.st16-step{width:min(540px,50vw);background:#fff;border:1px solid var(--line);border-radius:24px;display:grid;gap:12px;align-content:start}
.st16-step.is-active{border-color:var(--text-primary)}
.st16-step .n{font-size:.76rem;color:var(--text-muted)}
.st16-step h3{font-family:var(--font-display);font-size:1.7rem;font-weight:400;line-height:1.1}
.st16-step p{color:var(--text-muted);font-size:.88rem}
.st16-step pre{margin:0;background:var(--text-primary);color:#F0F4F8;border-radius:14px;padding:12px;font-size:.74rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.st16-step{width:auto}}

/* crew */
.st16-crew{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.st16-c{background:#fff;border:1px solid var(--line);border-radius:24px;display:grid;gap:12px}
.st16-c .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.72rem;color:var(--text-muted)}
.st16-c b{font-family:var(--font-display);font-size:1.1rem;color:var(--text-primary)}
.st16-c q{font-size:.92rem;line-height:1.6;quotes:"“" "”"}
@media (max-width:760px){.st16-crew{grid-template-columns:1fr}}

/* fares */
.st16-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.st16-plan{background:#fff;border:1px solid var(--line);border-radius:24px;display:grid;gap:12px;align-content:start}
.st16-plan.feat{border-color:var(--text-primary);box-shadow:0 0 0 1px var(--text-primary)}
.st16-plan h3{font-family:var(--font-display);font-size:1.3rem;font-weight:600}
.st16-plan .p{font-family:var(--font-display);font-size:2.8rem;font-weight:300;letter-spacing:-.04em;line-height:1}
.st16-plan .cad{font-size:.76rem;color:var(--text-muted)}
.st16-plan ul{display:grid;gap:6px;font-size:.84rem}
.st16-plan li::before{content:"› ";color:var(--text-muted)}
.st16-plan .fk{font-size:.8rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.st16-plans{grid-template-columns:1fr}}
.st16-table{width:100%;margin-top:32px;border-collapse:collapse;font-size:.84rem;font-variant-numeric:tabular-nums}
.st16-table caption{text-align:left;font-family:var(--font-display);font-size:1.3rem;padding-bottom:12px}
.st16-table th,.st16-table td{text-align:left;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.st16-table thead th{font-weight:400;color:var(--text-muted);font-size:.74rem}
@media (max-width:700px){.st16-table th:nth-child(2),.st16-table td:nth-child(2){display:none}}

/* final + footer */
.st16-final{display:grid;justify-items:center;text-align:center;gap:28px}
.st16-final .st16-h2{font-size:clamp(3rem,6.4vw,5.6rem)}
.st16-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.78rem;color:var(--text-muted)}
.st16-foot h4{font-family:var(--font-display);font-size:.95rem;color:var(--text-primary);margin-bottom:12px}
.st16-foot ul{display:grid;gap:8px}
.st16-foot a{text-decoration:none}
.st16-foot a:hover{color:var(--text-primary)}
.st16-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.st16-foot{grid-template-columns:1fr 1fr}.st16-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="st16-nav">
  <a class="st16-mark" href="#main">${BRAND.name}</a>
  <nav class="st16-links" data-spy aria-label="Sections"><a href="#turbulence">Turbulence</a><a href="#route">Route</a><a href="#forecast">Forecast</a><a href="#systems">Systems</a><a href="#preflight">Pre-flight</a><a href="#fares">Fares</a></nav>
  <span class="st16-fl">FL 650 · per-token</span>
</header>
<main id="main">
  <section class="st16-hero" data-hero aria-labelledby="st16-h">
    <div class="st16-sky" data-hero-part="visual">
      <canvas id="sky" role="img" aria-label="A stratospheric sky with a solar glider; the pointer moves the sun"></canvas>
      <h1 id="st16-h" data-hero-part="headline">Forecast your token bill before takeoff.</h1>
    </div>
    <div class="st16-band">
      <p class="k-body" data-hero-part="sub">Every request flies the same route — key, router, cache, model, stream, invoice — and lands with its cost printed on the strip.</p>
      <div class="st16-act">
        <div data-hero-part="cta"><a class="st16-btn" href="#fares" data-cta="primary" data-magnetic="6,0.12,0.84,0.4"><span data-magnetic-label>Get your API key</span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12 18 4l-5 14-3-6-8 0z"/></svg></a></div>
        <p class="st16-strip" data-hero-part="trust" aria-label="Sample flight strip: Core request, 3,070 tokens, landed"><span class="id">AE-0001</span><span>core-128k · 3,070 tok</span><span>1,800 cached</span><span class="ok">${LEGS[5][3]} · LANDED</span></p>
      </div>
    </div>
  </section>

  <section id="turbulence" data-section aria-labelledby="st16-t">
    <div class="k-wrap st16-cols">
      <h2 id="st16-t" class="st16-h2" data-reveal>Most AI bills hit turbulence after landing.</h2>
      <ul class="st16-turb" data-stagger>${PROBLEM.rows.map(([was, now], i) => `<li><span class="c">TURB-0${i + 1}</span><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ul>
    </div>
    <div class="st16-run" id="route">
      <div class="st16-pin">
        <div class="st16-path"><canvas id="pathcv" role="img" aria-label="A request glides along its flight path through six waypoints"></canvas></div>
        <ol class="st16-board" aria-live="polite">${LEGS.map(([code, title, d, v], i) => `<li class="st16-leg" data-i="${i}"><p class="c"><span>${String(i + 1).padStart(2, "0")} · ${code}</span><span>${title}</span></p><b>${d}</b><span class="v">${v}</span></li>`)}</ol>
      </div>
    </div>
    <div class="k-wrap">
      <div class="st16-calc" id="forecast" data-reveal>
        <form id="calc" onsubmit="return false" aria-label="Monthly forecast">
          <label>Requests per day <b id="c-req-v">5,000</b><input type="range" name="req" min="2" max="6" step="0.01" value="3.7"></label>
          <label>Tokens per request <b id="c-tok-v">2,500</b><input type="range" name="tok" min="2" max="5" step="0.01" value="3.4"></label>
          <label>Share served from cache <b id="c-cache-v">60%</b><input type="range" name="cache" min="0" max="0.95" step="0.05" value="0.6"></label>
          <label>Model family<select name="m">${MODELS.map((m) => `<option value="${m.id}">${m.name} — ${m.role}</option>`)}</select></label>
        </form>
        <div class="st16-out" aria-live="polite"><span>Monthly forecast, 30 days, 75% input · 25% output</span><b class="big live" id="c-out">$0</b><dl><div><dt>Tokens / month</dt><dd id="c-toks">0</dd></div><div><dt>Per request</dt><dd id="c-per">$0</dd></div></dl><p class="st16-fine">${PRICE_NOTE}</p></div>
      </div>
    </div>
  </section>

  <section id="systems" data-section aria-labelledby="st16-s">
    <div class="k-wrap">
      <h2 id="st16-s" class="st16-h2" data-reveal>On-board systems, and what each one gives you.</h2>
      <div class="st16-bento" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="st16-card k-card c${i}" data-spot><span class="tag">SYS-${String(i + 1).padStart(2, "0")} · ${f}</span><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="preflight" data-section aria-labelledby="st16-p">
    <div data-rail>
      <div data-rail-view>
        <div class="st16-rail-head"><h2 id="st16-p" class="st16-h2" data-reveal>Pre-flight checklist: three items.</h2></div>
        <ol class="st16-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="st16-step k-card"><span class="n">CHECK ${i + 1}/3</span><h3>${t}</h3><p>${d}</p><pre><code>${["model: \"core-128k:low-refusal\"", `baseURL: "${BRAND.apiBase}"`, "usage: tokens, cached_tokens, cost_usd"][i]}</code></pre></li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="crew" data-section aria-labelledby="st16-c">
    <div class="k-wrap">
      <h2 id="st16-c" class="st16-h2" data-reveal>Crew reports, by role.</h2>
      <div class="st16-crew" data-stagger>${PROOF.map(([role, focus, q], i) => `<article class="st16-c k-card"><p class="hd"><b>${role}</b><span>PIREP-${String(i + 1).padStart(2, "0")} · ${focus}</span></p><q>${q}</q></article>`)}</div>
      <p class="st16-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="fares" data-section aria-labelledby="st16-f">
    <div class="k-wrap">
      <h2 id="st16-f" class="st16-h2" data-reveal>Fares, by the token.</h2>
      <div class="st16-plans" data-stagger>${PLANS.map((p) => h`<article class="st16-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="st16-table" data-reveal>
        <caption>Rates per 1M tokens</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">Role</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="st16-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="st16-z">
    <div class="k-wrap st16-final">
      <h2 id="st16-z" class="st16-h2" data-reveal>Cleared for takeoff.</h2>
      <a class="st16-btn" href="#main" data-magnetic="6,0.12,0.84,0.4" data-reveal><span data-magnetic-label>Get your API key</span><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12 18 4l-5 14-3-6-8 0z"/></svg></a>
    </div>
  </section>
</main>
<footer class="st16-foot">
  <div><p class="st16-mark">${BRAND.name}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h4>Fleet</h4><ul>${MODELS.map((m) => `<li><a href="#fares">${m.name}</a></li>`)}</ul></div>
  <div><h4>Platform</h4><ul><li><a href="#forecast">Forecast</a></li><li><a href="#preflight">API quickstart</a></li><li><a href="#fares">Token rates</a></li></ul></div>
  <div><h4>Exhibition</h4><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Sora and IBM Plex Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, smooth, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;
    const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    // a glider silhouette, nose to the right
    const glider = (ctx, x, y, s, a = 0) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
      ctx.fillStyle = "#0F2133";
      ctx.beginPath(); ctx.moveTo(-60, 0); ctx.quadraticCurveTo(0, -3, 40, 0); ctx.quadraticCurveTo(0, 3, -60, 0); ctx.fill();
      ctx.fillRect(-4, -1.2, 8, 2.4);
      ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-2, -14); ctx.lineTo(2, -14); ctx.lineTo(4, 0); ctx.fill();
      ctx.fillStyle = "rgba(2,132,199,.85)"; ctx.fillRect(-56, -0.8, 30, 1.6);
      ctx.restore();
    };

    // —— hero sky: gradient, drifting cirrus, a glider; the pointer moves the sun ——
    const sc = $("#sky"), ss = canvas(sc);
    const r = rng(9), clouds = Array.from({ length: 26 }, () => ({ x: r(), y: 0.12 + r() * 0.6, w: 0.1 + r() * 0.25, s: 0.002 + r() * 0.004, a: 0.25 + r() * 0.4 }));
    let sx = 0.75, sy = 0.2;
    loop(sc, (t) => {
      const { ctx, w, h } = ss;
      sx += ((pointer.active ? pointer.x / innerWidth : 0.75) - sx) * 0.04; sy += ((pointer.active ? Math.min(0.6, pointer.y / innerHeight) : 0.2) - sy) * 0.04;
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#5B92C2"); g.addColorStop(0.55, "#A9CBE6"); g.addColorStop(1, "#E7F0F7");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const sun = ctx.createRadialGradient(sx * w, sy * h, 0, sx * w, sy * h, h * 0.6);
      sun.addColorStop(0, "rgba(255,255,255,.95)"); sun.addColorStop(0.08, "rgba(255,250,235,.7)"); sun.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sun; ctx.fillRect(0, 0, w, h);
      for (const c of clouds) {
        if (!RM) c.x = (c.x + c.s * 0.05) % 1.3;
        const x = (c.x - 0.15) * w, y = c.y * h, cw = c.w * w;
        const cg = ctx.createLinearGradient(x, 0, x + cw, 0);
        cg.addColorStop(0, "rgba(255,255,255,0)"); cg.addColorStop(0.5, `rgba(255,255,255,${c.a})`); cg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(x + cw / 2, y, cw / 2, 3 + c.w * 18, -0.04, 0, TAU); ctx.fill();
      }
      const gx = ((RM ? 0.4 : t * 0.02) % 1.3 - 0.15) * w;
      glider(ctx, gx, h * 0.34 + Math.sin(t * 0.6) * 6, Math.max(0.8, w / 900), -0.03);
    });

    // —— signature: the request glides through six waypoints; strips print as it passes ——
    const run = $("#route"), pc = $("#pathcv"), ps = canvas(pc), legs = $$(".st16-leg");
    let p = 0;
    onScroll(() => {
      p = RM ? 1 : clamp((progress(run) - 0.04) / 0.86);
      const k = Math.min(5, Math.floor(p * 6));
      legs.forEach((l, i) => { l.classList.toggle("on", i <= k); l.classList.toggle("now", i === k); });
    });
    const names = ["AUTH", "ROUTE", "CACHE", "MODEL", "STREAM", "BILL"];
    loop(pc, () => {
      const { ctx, w, h } = ps;
      ctx.clearRect(0, 0, w, h);
      const pts = names.map((_, i) => [w * (0.06 + (i / 5) * 0.88), h * (0.7 - Math.sin((i / 5) * Math.PI) * 0.45)]);
      // flight path
      ctx.strokeStyle = "rgba(15,33,51,.25)"; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5;
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.setLineDash([]);
      // flown portion
      const f = p * 5, i0 = Math.min(4, Math.floor(f)), u = smooth(f - i0);
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= i0; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[0][0], pts[0][1]);
      const gx = lerp(pts[i0][0], pts[Math.min(5, i0 + 1)][0], u), gy = lerp(pts[i0][1], pts[Math.min(5, i0 + 1)][1], u);
      ctx.lineTo(gx, gy); ctx.stroke();
      pts.forEach(([x, y], i) => {
        const on = i <= f + 0.01;
        ctx.fillStyle = on ? "#0F2133" : "#fff"; ctx.strokeStyle = "#0F2133"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.font = '600 12px "IBM Plex Mono", monospace'; ctx.fillStyle = "#0F2133"; ctx.fillText(names[i], x - 18, y - 16);
      });
      const nx = pts[Math.min(5, i0 + 1)][0] - pts[i0][0], ny = pts[Math.min(5, i0 + 1)][1] - pts[i0][1];
      glider(ctx, gx, gy - 4, Math.max(0.7, w / 1100), Math.atan2(ny, nx) * 0.6);
    });

    // —— forecast calculator ——
    const form = $("#calc"), out = $("#c-out"), toks = $("#c-toks"), per = $("#c-per");
    const rv = $("#c-req-v"), tv = $("#c-tok-v"), cv = $("#c-cache-v");
    const calc = () => {
      const m = AE.MODELS.find((x) => x.id === form.m.value);
      const req = Math.round(Math.pow(10, +form.req.value)), tok = Math.round(Math.pow(10, +form.tok.value)), cache = +form.cache.value;
      const inT = tok * 0.75, outT = tok * 0.25;
      const pr = (inT * (1 - cache) * m.inPrice + inT * cache * m.cached + outT * m.outPrice) / 1e6;
      const month = pr * req * 30;
      rv.textContent = req.toLocaleString("en-US"); tv.textContent = tok.toLocaleString("en-US"); cv.textContent = Math.round(cache * 100) + "%";
      out.textContent = "$" + (month >= 100 ? Math.round(month).toLocaleString("en-US") : month.toFixed(2));
      toks.textContent = (tok * req * 30).toLocaleString("en-US"); per.textContent = "$" + pr.toFixed(5);
    };
    form.addEventListener("input", calc); calc();
  }),
};
