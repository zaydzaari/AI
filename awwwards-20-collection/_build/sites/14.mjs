import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost } from "../aether.mjs";

const STYLE = "Veloce";
const M = Object.fromEntries(MODELS.map((m) => [m.id, m]));
const per1k = (m) => cost(m, 2000, 200) * 1000;
const ATLAS_1K = per1k(M.atlas), SWIFT_1K = per1k(M.swift);

export default {
  title: "Aether — Each task to the lightest model",
  description: "Send extraction to Swift, chat to Core, code to Forge: one API, five families, billed per token. Veloce design direction.",
  fonts: [
    { family: "Archivo Black" },
    { family: "Work Sans", axes: "wght@400;500;600" },
  ],
  tokens: {
    bgPrimary: "#0F0F12", bgSecondary: "#1C1C22", accent: "#E11D48", onAccent: "#FFFFFF",
    textPrimary: "#F1F1F3", textMuted: "#A2A2AD", line: "rgba(241,241,243,.12)",
    display: '"Archivo Black", sans-serif', body: '"Work Sans", sans-serif',
  },
  css: /* css */ `
:root{--h1-weight:400}
.v14-nav{position:fixed;inset:0 0 auto;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:linear-gradient(#0F0F12f2,#0F0F1200);font-size:.84rem}
.v14-mark{font-family:var(--font-display);font-size:1.15rem;text-decoration:none;font-style:italic;letter-spacing:-.02em}
.v14-mark span{color:var(--accent)}
.v14-links{display:flex;gap:22px}
.v14-links a{text-decoration:none;color:var(--text-muted);padding:4px 0;border-bottom:3px solid transparent;font-weight:500}
.v14-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.v14-tel{color:var(--text-muted);font-variant-numeric:tabular-nums}
@media (max-width:900px){.v14-links{display:none}}
.v14-btn{display:inline-flex;align-items:center;gap:14px;min-height:56px;padding:0 28px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-size:.98rem;text-decoration:none;transform:skewX(-10deg)}
.v14-btn span{display:inline-block;transform:skewX(10deg)}
.v14-btn svg{width:22px;height:12px;transform:skewX(10deg);transition:transform .4s var(--ease)}
.v14-btn.is-near svg{transform:skewX(10deg) translateX(4px)}
.v14-h2{font-size:clamp(2.2rem,4.4vw,4rem);letter-spacing:-.03em;line-height:.98;max-width:16ch}
.v14-fine{margin-top:22px;font-size:.8rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: streamline band */
.v14-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:minmax(0,1fr) 300px;grid-template-rows:1fr auto;gap:24px;padding:84px var(--gutter) 32px;overflow:clip}
.v14-band{position:absolute;left:0;right:0;top:34%;height:42%;border-block:1px solid var(--line)}
.v14-band canvas{width:100%;height:100%}
.v14-copy{position:relative;z-index:2;grid-row:1 / span 2;align-self:center;display:grid;gap:20px;justify-items:start}
.v14-copy h1{line-height:.92;max-width:12ch;text-shadow:0 2px 24px #0F0F12}
.v14-copy .k-body{color:var(--text-muted);max-width:46ch;background:#0F0F12cc;padding:6px 0}
.v14-dock{position:relative;z-index:2;grid-column:2;grid-row:2;align-self:end;display:grid;gap:6px;padding:20px;background:#1C1C22ee;border:1px solid #F4F4F51f}
.v14-dock span{font-size:.76rem;color:var(--text-muted)}
.v14-dock b{font-family:var(--font-display);font-size:2.2rem;line-height:1}
@media (max-width:900px){
  .v14-hero{grid-template-columns:1fr;grid-template-rows:auto auto;padding:72px var(--gutter) 16px;gap:14px;align-content:end}
  .v14-band{top:16%;height:30%}
  .v14-copy{grid-row:1;gap:12px}
  .v14-dock{grid-column:1;grid-row:2;padding:12px 14px}
  .v14-dock b{font-size:1.5rem}
}

/* problem */
.v14-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.v14-drag{display:grid;gap:10px}
.v14-drag li{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:20px 24px;background:var(--bg-secondary);transform:skewX(-6deg)}
.v14-drag li>*{transform:skewX(6deg)}
.v14-drag .was{color:var(--text-muted);font-size:.9rem}
.v14-drag .now{font-weight:600;font-size:1.05rem}
@media (max-width:900px){.v14-cols{grid-template-columns:1fr;gap:40px}.v14-drag li{grid-template-columns:1fr;gap:4px;transform:none}.v14-drag li>*{transform:none}}

/* signature: the wind tunnel */
.v14-run{height:440vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.v14-pin{position:sticky;top:0;height:100vh;display:grid;grid-template-rows:1fr auto;padding:76px var(--gutter) 24px;gap:18px}
.v14-tunnel{position:relative;border:1px solid var(--line);background:linear-gradient(90deg,#15151A,#0F0F12)}
.v14-tunnel canvas{position:absolute;inset:0;width:100%;height:100%}
.v14-tunnel .lbl{position:absolute;left:16px;top:12px;font-size:.76rem;color:var(--text-muted)}
.v14-panel{display:grid;grid-template-columns:minmax(0,1.4fr) repeat(3,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line)}
.v14-panel>div{background:var(--bg-primary);padding:16px 18px;display:grid;gap:6px;align-content:start}
.v14-panel span{font-size:.76rem;color:var(--text-muted)}
.v14-panel b{font-family:var(--font-display);font-size:1.8rem;line-height:1;font-variant-numeric:tabular-nums}
.v14-panel input{width:100%;accent-color:var(--accent);height:26px}
@media (max-width:900px){
  .v14-run{height:400vh}
  .v14-pin{padding:68px var(--gutter) 12px;gap:10px}
  .v14-panel{grid-template-columns:1fr 1fr}
  .v14-panel>div:first-child{grid-column:1 / -1}
  .v14-panel b{font-size:1.3rem}
  .v14-panel>div{padding:10px 12px}
}
@media (prefers-reduced-motion:reduce){.v14-run{height:auto}.v14-pin{position:relative;height:100vh}}

/* components bento */
.v14-comp{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.v14-c{position:relative;isolation:isolate;overflow:hidden;background:var(--bg-secondary);display:grid;gap:14px;align-content:start;min-height:250px;clip-path:polygon(0 0,calc(100% - 28px) 0,100% 28px,100% 100%,0 100%)}
.v14-c::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(260px circle at var(--mx) var(--my),rgba(127,127,127,0.089),transparent 65%);opacity:0;transition:opacity .3s}
.v14-c:hover::before{opacity:1}
.v14-c .tag{font-size:.76rem;color:var(--text-muted);font-weight:500}
.v14-c h3{font-family:var(--font-display);font-size:1.4rem;line-height:1.1;letter-spacing:-.02em}
.v14-c p{font-size:.92rem;color:var(--text-muted)}
.v14-c.c0{grid-column:span 2}.v14-c.c0 h3{font-size:clamp(1.9rem,3vw,2.6rem)}
.v14-c.c5{grid-column:span 2}
@media (max-width:900px){.v14-comp{grid-template-columns:1fr}.v14-c{grid-column:auto!important}}

/* rail: fitting */
.v14-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.v14-steps{padding:0 var(--gutter);gap:12px}
.v14-step{width:min(560px,52vw);background:var(--bg-secondary);display:grid;gap:14px;align-content:start;border-top:1px solid var(--line)}
.v14-step.is-active{border-color:var(--accent)}
.v14-step .n{font-family:var(--font-display);font-size:3.6rem;line-height:.9;color:var(--text-muted);font-style:italic}
.v14-step.is-active .n{color:var(--text-primary)}
.v14-step h3{font-family:var(--font-display);font-size:1.5rem;line-height:1.1}
.v14-step p{color:var(--text-muted);font-size:.92rem}
.v14-step pre{margin:0;background:#0F0F12;padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
.v14-step code{font-family:ui-monospace,monospace}
@media (max-width:899px){.v14-step{width:auto}}

/* riders */
.v14-riders{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.v14-r{background:var(--bg-secondary);display:grid;gap:14px;align-content:space-between;min-height:260px;border-top:1px solid var(--line)}
.v14-r q{font-size:.95rem;line-height:1.6;quotes:"“" "”"}
.v14-r p{font-size:.78rem;color:var(--text-muted)}
.v14-r b{display:block;font-family:var(--font-display);font-size:1rem;color:var(--text-primary);font-weight:400}
@media (max-width:1000px){.v14-riders{grid-template-columns:1fr 1fr}}
@media (max-width:600px){.v14-riders{grid-template-columns:1fr}}

/* build sheet */
.v14-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.v14-plan{background:var(--bg-secondary);display:grid;gap:12px;align-content:start}
.v14-plan.feat{background:#26161B;outline:1px solid var(--accent)}
.v14-plan h3{font-family:var(--font-display);font-size:1.3rem}
.v14-plan .p{font-family:var(--font-display);font-size:2.8rem;line-height:1;letter-spacing:-.03em}
.v14-plan .cad{font-size:.8rem;color:var(--text-muted)}
.v14-plan ul{display:grid;gap:6px;font-size:.9rem}
.v14-plan li::before{content:"/ ";color:var(--accent);font-weight:600}
.v14-plan .fk{font-size:.84rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.v14-plans{grid-template-columns:1fr}}
.v14-table{width:100%;margin-top:32px;border-collapse:collapse;font-variant-numeric:tabular-nums}
.v14-table caption{text-align:left;font-family:var(--font-display);font-size:1.2rem;padding-bottom:12px}
.v14-table th,.v14-table td{text-align:left;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.v14-table thead th{font-weight:500;color:var(--text-muted);font-size:.78rem}
@media (max-width:700px){.v14-table th:nth-child(2),.v14-table td:nth-child(2){display:none}}

/* final + footer */
.v14-final{display:flex;justify-content:space-between;align-items:end;gap:32px;flex-wrap:wrap}
.v14-final .v14-h2{font-size:clamp(2.8rem,6vw,5.4rem);font-style:italic}
.v14-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.86rem;color:var(--text-muted)}
.v14-foot h3{font-family:var(--font-display);font-size:.95rem;font-weight:400;color:var(--text-primary);margin-bottom:12px}
.v14-foot ul{display:grid;gap:8px}
.v14-foot a{text-decoration:none}
.v14-foot a:hover{color:var(--text-primary)}
.v14-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.v14-foot{grid-template-columns:1fr 1fr}.v14-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="v14-nav">
  <a class="v14-mark" href="#main">${BRAND.name}<span>/</span>veloce</a>
  <nav class="v14-links" data-spy aria-label="Sections"><a href="#drag">Drag</a><a href="#tunnel">Tunnel</a><a href="#components">Components</a><a href="#fitting">Fitting</a><a href="#riders">Riders</a><a href="#build">Build sheet</a></nav>
  <span class="v14-tel" id="tel" aria-hidden="true">Re 1.0e6</span>
</header>
<main id="main">
  <section class="v14-hero" data-hero aria-labelledby="v14-h">
    <div class="v14-band" data-hero-part="visual"><canvas id="band" role="img" aria-label="Streamlines flowing over a request profile; the pointer disturbs the flow"></canvas></div>
    <div class="v14-copy">
      <h1 id="v14-h" data-hero-part="headline">Each task to the lightest model.</h1>
      <p class="k-body" data-hero-part="sub">Extraction to Swift, chat to Core, code to Forge: one API, five families, billed per token. Less drag on every request.</p>
      <div data-hero-part="cta"><a class="v14-btn" href="#build" data-cta="primary" data-magnetic="6,0.24,0.6,0.5"><span data-magnetic-label>Get your API key</span><svg viewBox="0 0 22 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M0 6h20M15 1l5 5-5 5"/></svg></a></div>
    </div>
    <p class="v14-dock" data-hero-part="trust"><span>Drag readout · 2K in / 200 out</span><b>${Math.round((SWIFT_1K / ATLAS_1K) * 100)}%</b><span>Swift's cost per request versus Atlas, at sample rates.</span></p>
  </section>

  <section id="drag" data-section aria-labelledby="v14-d">
    <div class="k-wrap v14-cols">
      <h2 id="v14-d" class="v14-h2" data-reveal>Most AI stacks ride with the brakes on.</h2>
      <ul class="v14-drag" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ul>
    </div>
    <div class="v14-run" id="tunnel">
      <div class="v14-pin">
        <div class="v14-tunnel"><canvas id="cfd" role="img" aria-label="Wind tunnel: a smaller wake means less wasted spend"></canvas><span class="lbl">Wind tunnel · 1,000 extraction requests · wake = spend on an oversized model</span></div>
        <div class="v14-panel" aria-live="polite">
          <div><span>Share routed to Swift: scroll, or drag</span><input id="route" type="range" min="0" max="95" step="1" value="0" aria-label="Share of requests routed to Swift"><span id="route-v">0% routed</span></div>
          <div><span>All on Atlas</span><b>$${ATLAS_1K.toFixed(2)}</b><span>per 1K requests</span></div>
          <div><span>Routed mix</span><b class="live" id="mix">$${ATLAS_1K.toFixed(2)}</b><span>per 1K requests</span></div>
          <div><span>Drag saved</span><b id="saved">0%</b><span>sample rates</span></div>
        </div>
      </div>
    </div>
    <p class="k-wrap v14-fine">${PRICE_NOTE}</p>
  </section>

  <section id="components" data-section aria-labelledby="v14-c">
    <div class="k-wrap">
      <h2 id="v14-c" class="v14-h2" data-reveal>Components, and the time each one saves.</h2>
      <div class="v14-comp" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="v14-c k-card c${i}" data-spot><span class="tag">${String(i + 1).padStart(2, "0")} / ${f}</span><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="fitting" data-section aria-labelledby="v14-f">
    <div data-rail>
      <div data-rail-view>
        <div class="v14-rail-head"><h2 id="v14-f" class="v14-h2" data-reveal>The fitting: three steps.</h2></div>
        <ol class="v14-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="v14-step k-card"><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p><pre><code>${["model: \"swift-32k\"   // extraction", `baseURL: "${BRAND.apiBase}"`, "usage.cost_usd → per request"][i]}</code></pre></li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="riders" data-section aria-labelledby="v14-r">
    <div class="k-wrap">
      <h2 id="v14-r" class="v14-h2" data-reveal>Riders, by role.</h2>
      <div class="v14-riders" data-stagger>${PROOF.map(([role, focus, q]) => `<figure class="v14-r k-card"><q>${q}</q><p><b>${role}</b>${focus}</p></figure>`)}</div>
      <p class="v14-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="build" data-section aria-labelledby="v14-b">
    <div class="k-wrap">
      <h2 id="v14-b" class="v14-h2" data-reveal>Build sheet. Priced per token.</h2>
      <div class="v14-plans" data-stagger>${PLANS.map((p) => h`<article class="v14-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="v14-table" data-reveal>
        <caption>Rates per 1M tokens</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">Best for</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th><th scope="col">Per 1K extraction calls</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td><td>$${per1k(m).toFixed(2)}</td></tr>`)}</tbody>
      </table>
      <p class="v14-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="v14-z">
    <div class="k-wrap v14-final">
      <h2 id="v14-z" class="v14-h2" data-reveal>Take the brakes off.</h2>
      <a class="v14-btn" href="#main" data-magnetic="6,0.24,0.6,0.5" data-reveal><span data-magnetic-label>Get your API key</span><svg viewBox="0 0 22 12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M0 6h20M15 1l5 5-5 5"/></svg></a>
    </div>
  </section>
</main>
<footer class="v14-foot">
  <div><p class="v14-mark">${BRAND.name}<span>/</span>veloce</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Models</h3><ul>${MODELS.map((m) => `<li><a href="#build">${m.name}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#tunnel">Model routing</a></li><li><a href="#fitting">API quickstart</a></li><li><a href="#build">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Archivo Black and Work Sans.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, clamp, lerp, canvas, loop, onScroll, progress, pointer } = K;
    const M = Object.fromEntries(AE.MODELS.map((m) => [m.id, m]));
    const per1k = (m) => ((2000 * m.inPrice + 200 * m.outPrice) / 1e6) * 1000;
    const A = per1k(M.atlas), S = per1k(M.swift);

    // Potential flow around a squashed cylinder ("the request profile"), with a turbulent wake.
    function Tunnel(cv, { lines = 34, wakeOf = () => 1, body = 0.12, cx = 0.42 } = {}) {
      const s = canvas(cv);
      const vel = (x, y, w, h, R, X, Y, wake, t) => {
        const dx = (x - X) / R, dy = ((y - Y) / R) * 1.8;
        const r2 = dx * dx + dy * dy;
        let u = 1, v = 0;
        if (r2 > 1) { const r4 = r2 * r2; u = 1 - (dx * dx - dy * dy) / r4; v = (-2 * dx * dy) / r4; }
        else { u = 0.1; v = dy > 0 ? 0.6 : -0.6; }
        if (dx > 0.6 && Math.abs(dy) < 1.6 + dx * 0.25) { const k = wake * Math.exp(-dx * 0.25); v += Math.sin(dx * 3.1 - t * 6 + dy * 2) * 0.9 * k; u -= 0.35 * k; }
        return [u, v];
      };
      return (t) => {
        const { ctx, w, h } = s;
        ctx.clearRect(0, 0, w, h);
        const R = Math.min(w, h) * body, X = w * cx, Y = h * 0.5, wake = wakeOf();
        const r = cv.getBoundingClientRect();
        const px = pointer.active ? pointer.x - r.left : -999, py = pointer.active ? pointer.y - r.top : -999;
        const slow = new Path2D(), fast = new Path2D(), ds = Math.max(4, w / 160);
        for (let i = 0; i < lines; i++) {
          let x = 0, y = ((i + 0.5) / lines) * h, bucket = null;
          for (let k = 0; k < 400 && x < w; k++) {
            let [u, v] = vel(x, y, w, h, R, X, Y, wake, t);
            const dp = Math.hypot(x - px, y - py);
            if (dp < 90) v += ((y - py) / dp) * 0.8 * (1 - dp / 90);
            const sp = Math.hypot(u, v) || 1, nx = x + (u / sp) * ds, ny = y + (v / sp) * ds;
            const b = sp > 1.18 ? fast : slow;
            if (b !== bucket) { b.moveTo(x, y); bucket = b; }
            b.lineTo(nx, ny);
            x = nx; y = ny;
          }
        }
        ctx.lineWidth = 1.3; ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 70;
        ctx.strokeStyle = "rgba(241,241,243,.5)"; ctx.stroke(slow);
        ctx.strokeStyle = "rgba(225,29,72,.95)"; ctx.stroke(fast);
        ctx.setLineDash([]);
        // the profile itself
        ctx.save(); ctx.translate(X, Y); ctx.scale(1, 1 / 1.8);
        ctx.fillStyle = "#1C1C22"; ctx.strokeStyle = "rgba(241,241,243,.7)"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(0, 0, R * 0.98, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
      };
    }

    const band = Tunnel($("#band"), { lines: 26, wakeOf: () => 0.55, body: 0.16, cx: 0.66 });
    loop($("#band"), (t) => band(RM ? 0 : t));

    // signature: scroll (or the slider) routes traffic away from Atlas; the wake and the bill shrink
    const run = $("#tunnel"), slider = $("#route"), rv = $("#route-v"), mix = $("#mix"), saved = $("#saved"), tel = $("#tel");
    let share = 0, manual = false;
    const apply = () => {
      const c = share * S + (1 - share) * A;
      rv.textContent = Math.round(share * 100) + "% routed to Swift";
      mix.textContent = "$" + c.toFixed(2); saved.textContent = Math.round((1 - c / A) * 100) + "%";
      tel.textContent = "CdA " + (0.24 - share * 0.12).toFixed(3);
    };
    slider.addEventListener("input", () => { manual = true; share = +slider.value / 100; apply(); });
    onScroll(() => { if (!manual) { share = RM ? 0.8 : clamp((progress(run) - 0.08) / 0.75) * 0.8; slider.value = Math.round(share * 100); apply(); } });
    const tunnel = Tunnel($("#cfd"), { lines: 40, wakeOf: () => 1.2 * (1 - share), body: 0.13, cx: 0.36 });
    loop($("#cfd"), (t) => tunnel(RM ? 0 : t));
  }),
};
