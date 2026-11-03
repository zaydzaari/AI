import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Kinetix";
const FORGE = MODELS.find((m) => m.id === "forge");
const RUN = [
  ["Read", "Loaded 38 files from src/ and tests/", 31000, 900, 0, 0, 0],
  ["Plan", "Retry with exponential backoff in the API client", 2000, 600, 0.6, 0, 0],
  ["Edit", "src/client.ts +18 −6, src/retry.ts new", 3000, 2600, 0.9, 2, 0],
  ["Test", "214 tests run, 1 failing", 3400, 400, 0.92, 2, 214],
  ["Fix", "Off-by-one in the attempt counter", 2000, 700, 0.9, 2, 214],
  ["Diff", "All tests pass: one diff ready for review", 500, 300, 0.9, 2, 214],
].map(([phase, log, inTok, outTok, cached, files, tests]) => ({ phase, log, inTok, outTok, cached, files, tests, c: cost(FORGE, inTok, outTok, cached) }));
const TOTAL_TOK = RUN.reduce((a, r) => a + r.inTok + r.outTok, 0);
const TOTAL = RUN.reduce((a, r) => a + r.c, 0);

export default {
  title: "Aether — The agent does the heavy lifting",
  description: "Forge reads your repository, plans, edits and tests, and hands you one diff, billed per token with the cost of every step logged. Kinetix design direction.",
  fonts: [
    { family: "Chakra Petch", axes: "wght@500;600;700" },
    { family: "IBM Plex Mono", axes: "wght@400;500" },
  ],
  tokens: {
    bgPrimary: "#0D0F12", bgSecondary: "#1A1E24", accent: "#CCFF00", onAccent: "#0D0F12",
    textPrimary: "#E7EBF0", textMuted: "#9AA4B0", line: "rgba(231,235,240,.12)",
    display: '"Chakra Petch", sans-serif', body: '"IBM Plex Mono", ui-monospace, monospace',
  },
  css: /* css */ `
.x9-nav{position:fixed;inset:0 0 auto;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:linear-gradient(#0D0F12f0,#0D0F1200);font-size:.78rem}
.x9-mark{font-family:var(--font-display);font-weight:700;font-size:1.15rem;letter-spacing:.06em;text-decoration:none;display:flex;gap:8px;align-items:center}
.x9-mark i{width:10px;height:10px;background:var(--accent);clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.x9-links{display:flex;gap:2px}
.x9-links a{text-decoration:none;color:var(--text-muted);padding:6px 12px;border:1px solid transparent}
.x9-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.x9-sys{color:var(--text-muted)}
@media (max-width:900px){.x9-links{display:none}}
.x9-btn{display:inline-flex;align-items:center;gap:14px;min-height:56px;padding:0 26px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:700;font-size:1rem;letter-spacing:.03em;text-decoration:none;clip-path:polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)}
.x9-btn .bars{display:flex;gap:3px;align-items:end;height:16px}
.x9-btn .bars i{width:3px;background:var(--on-accent);height:40%;transition:height .3s var(--ease)}
.x9-btn .bars i:nth-child(2){height:70%}.x9-btn .bars i:nth-child(3){height:100%}
.x9-btn.is-near .bars i{height:100%}
.x9-h2{font-size:clamp(2.4rem,4.6vw,4.2rem);font-weight:700;letter-spacing:-.03em;line-height:.98;max-width:18ch;text-transform:uppercase}
.x9-fine{margin-top:22px;font-size:.76rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: telemetry panel */
.x9-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:minmax(0,640px) 1fr;align-items:end;padding:80px var(--gutter) 28px;overflow:clip}
.x9-rig{position:absolute;inset:0}
.x9-rig canvas{width:100%;height:100%}
.x9-panel{position:relative;z-index:2;display:grid;gap:18px;justify-items:start;padding:32px;background:#0D0F12eb;border:1px solid var(--line)}
.x9-panel::before{content:"";position:absolute;left:-1px;top:-1px;width:28px;height:28px;border-left:1px solid var(--accent);border-top:2px solid var(--accent)}
.x9-panel h1{font-weight:700;text-transform:uppercase;line-height:.95}
.x9-panel .k-body{color:var(--text-muted)}
.x9-trust{font-size:.78rem;color:var(--text-muted);display:flex;gap:16px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:14px;width:100%}
.x9-trust b{color:var(--text-primary);font-weight:500}
.x9-hud{position:absolute;right:var(--gutter);top:84px;z-index:2;display:grid;gap:10px;text-align:right;font-size:.76rem;color:var(--text-muted)}
.x9-hud b{display:block;font-family:var(--font-display);font-size:1.6rem;color:var(--text-primary);font-weight:600}
@media (max-width:860px){
  .x9-hero{grid-template-columns:1fr;padding:62px var(--gutter) 10px}
  .x9-panel{padding:16px;gap:10px}
  .x9-trust span{display:none}
  .x9-trust{padding-top:10px}
  .x9-hud{display:none}
  .x9-rig{opacity:.6}
  .x9-trust{gap:6px 12px}
}

/* problem */
.x9-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.x9-loads{display:grid;gap:10px}
.x9-loads li{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:20px 22px;background:var(--bg-secondary);border-left:3px solid var(--text-muted)}
.x9-loads .was{color:var(--text-muted);font-size:.86rem}
.x9-loads .now{font-family:var(--font-display);font-size:1.15rem;font-weight:600}
@media (max-width:900px){.x9-cols{grid-template-columns:1fr;gap:40px}.x9-loads li{grid-template-columns:1fr;gap:6px}}

/* signature: kinematic rig under load */
.x9-run{height:460vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.x9-pin{position:sticky;top:0;height:100vh;display:grid;grid-template-columns:minmax(0,1.4fr) minmax(320px,1fr);gap:32px;padding:76px var(--gutter) 24px}
.x9-stage{position:relative;border:1px solid var(--line);background:repeating-linear-gradient(0deg,#E7EBF006 0 1px,transparent 1px 40px),repeating-linear-gradient(90deg,#E7EBF006 0 1px,transparent 1px 40px)}
.x9-stage canvas{position:absolute;inset:0;width:100%;height:100%}
.x9-tele{display:grid;align-content:center;gap:16px}
.x9-phase{display:flex;gap:4px}
.x9-phase li{flex:1;height:6px;background:var(--bg-secondary);position:relative}
.x9-phase li.on{background:var(--accent)}
.x9-now{display:grid;gap:4px;border-left:1px solid var(--accent);padding-left:14px}
.x9-now span{font-size:.76rem;color:var(--text-muted)}
.x9-now b{font-family:var(--font-display);font-size:clamp(2rem,3.6vw,3rem);font-weight:700;text-transform:uppercase;line-height:1}
.x9-now em{font-style:normal;font-size:.86rem;color:var(--text-muted)}
.x9-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.x9-grid div{background:var(--bg-primary);padding:12px;display:grid;gap:2px}
.x9-grid span{font-size:.6875rem;color:var(--text-muted)}
.x9-grid b{font-family:var(--font-display);font-size:1.5rem;font-weight:600;font-variant-numeric:tabular-nums}
@media (max-width:900px){
  .x9-run{height:400vh}
  .x9-pin{grid-template-columns:1fr;grid-template-rows:1fr auto;gap:10px;padding:66px var(--gutter) 12px}
  .x9-tele{gap:10px}
  .x9-now b{font-size:1.6rem}
  .x9-grid b{font-size:1.1rem}
}
@media (prefers-reduced-motion:reduce){.x9-run{height:auto}.x9-pin{position:relative;height:auto;min-height:100vh}}

/* modules */
.x9-mods{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.x9-mod{position:relative;isolation:isolate;overflow:hidden;background:var(--bg-secondary);border:1px solid var(--line);display:grid;gap:14px;align-content:start;min-height:250px}
.x9-mod::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(260px circle at var(--mx) var(--my),#CCFF0014,transparent 65%);opacity:0;transition:opacity .3s}
.x9-mod:hover::before{opacity:1}
.x9-mod .id{display:flex;justify-content:space-between;font-size:.76rem;color:var(--text-muted)}
.x9-mod h3{font-family:var(--font-display);font-size:1.45rem;font-weight:600;line-height:1.12}
.x9-mod p{font-size:.84rem;color:var(--text-muted)}
.x9-mod.m0{grid-column:span 2;grid-row:span 2}.x9-mod.m0 h3{font-size:clamp(1.9rem,3vw,2.6rem)}
@media (max-width:900px){.x9-mods{grid-template-columns:1fr}.x9-mod{grid-column:auto!important;grid-row:auto!important;min-height:0}}

/* rail */
.x9-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.x9-steps{padding:0 var(--gutter);gap:12px}
.x9-step{width:min(560px,52vw);background:var(--bg-secondary);border:1px solid var(--line);display:grid;gap:14px;align-content:start}
.x9-step.is-active{border-color:#CCFF0088}
.x9-step .n{font-family:var(--font-display);font-size:.9rem;color:var(--text-muted)}
.x9-step.is-active .n{color:var(--accent)}
.x9-step h3{font-family:var(--font-display);font-size:1.7rem;font-weight:600;text-transform:uppercase;line-height:1.05}
.x9-step p{color:var(--text-muted);font-size:.88rem}
.x9-step pre{margin:0;background:#0D0F12;border:1px solid var(--line);padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.x9-step{width:auto}}

/* field tests */
.x9-tests{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.x9-test{border:1px solid var(--line);display:grid;gap:14px;background:linear-gradient(135deg,#1A1E24,#12151A)}
.x9-test .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.76rem;color:var(--text-muted)}
.x9-test b{font-family:var(--font-display);font-size:1.1rem;color:var(--text-primary)}
.x9-test q{font-size:.92rem;line-height:1.6;quotes:"“" "”"}
@media (max-width:760px){.x9-tests{grid-template-columns:1fr}}

/* load classes */
.x9-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.x9-plan{border:1px solid var(--line);display:grid;gap:12px;align-content:start}
.x9-plan.feat{background:var(--bg-secondary);border-color:#CCFF0066}
.x9-plan h3{font-family:var(--font-display);font-size:1.1rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.x9-plan .p{font-family:var(--font-display);font-size:2.6rem;font-weight:700;line-height:1}
.x9-plan .cad{font-size:.76rem;color:var(--text-muted)}
.x9-plan ul{display:grid;gap:6px;font-size:.84rem}
.x9-plan li::before{content:"▪ ";color:var(--text-muted)}
.x9-plan .fk{font-size:.78rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.x9-plans{grid-template-columns:1fr}}
.x9-table{width:100%;margin-top:32px;border-collapse:collapse;font-size:.82rem;font-variant-numeric:tabular-nums}
.x9-table caption{text-align:left;font-family:var(--font-display);font-size:1.1rem;padding-bottom:12px;text-transform:uppercase}
.x9-table th,.x9-table td{text-align:left;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.x9-table thead th{font-weight:400;color:var(--text-muted);font-size:.76rem}
@media (max-width:700px){.x9-table th:nth-child(2),.x9-table td:nth-child(2){display:none}}

/* final + footer */
.x9-final{display:grid;gap:28px;justify-items:start}
.x9-final .x9-h2{font-size:clamp(2.8rem,6vw,5.4rem)}
.x9-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.78rem;color:var(--text-muted)}
.x9-foot h3{font-family:var(--font-display);font-size:.9rem;color:var(--text-primary);margin-bottom:12px;text-transform:uppercase}
.x9-foot ul{display:grid;gap:8px}
.x9-foot a{text-decoration:none}
.x9-foot a:hover{color:var(--text-primary)}
.x9-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.x9-foot{grid-template-columns:1fr 1fr}.x9-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="x9-nav">
  <a class="x9-mark" href="#main"><i aria-hidden="true"></i>${BRAND.name.toUpperCase()}</a>
  <nav class="x9-links" data-spy aria-label="Sections"><a href="#load">Load</a><a href="#rig">Agent run</a><a href="#modules">Modules</a><a href="#calibrate">Calibrate</a><a href="#tests">Field tests</a><a href="#classes">Pricing</a></nav>
  <span class="x9-sys">FORGE · ONLINE</span>
</header>
<main id="main">
  <section class="x9-hero" data-hero aria-labelledby="x9-h">
    <div class="x9-rig" data-hero-part="visual"><canvas id="rig" role="img" aria-label="A vector exoskeleton leg; the pointer bends the knee"></canvas></div>
    <div class="x9-hud" aria-hidden="true"><span>Knee<b id="h-knee">32°</b></span><span>Hip<b id="h-hip">18°</b></span><span>Model<b>forge-256k</b></span></div>
    <div class="x9-panel">
      <h1 id="x9-h" data-hero-part="headline">The agent does the heavy lifting.</h1>
      <p class="k-body" data-hero-part="sub">Forge reads the repository, plans the change, edits files and runs the tests. You review one diff, billed per token, with every step on the log.</p>
      <div data-hero-part="cta"><a class="x9-btn" href="#classes" data-cta="primary" data-magnetic="5,0.22,0.64,0.4"><span data-magnetic-label>Get your API key</span><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span></a></div>
      <p class="x9-trust" data-hero-part="trust"><span>Sample run</span><b>${RUN.length} steps</b><b>${TOTAL_TOK.toLocaleString("en-US")} tokens</b><b>${usd(TOTAL)}</b><span>at Forge sample rates</span></p>
    </div>
  </section>

  <section id="load" data-section aria-labelledby="x9-l">
    <div class="k-wrap x9-cols">
      <h2 id="x9-l" class="x9-h2" data-reveal>Your team carries too much load.</h2>
      <ul class="x9-loads" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ul>
    </div>
    <div class="x9-run" id="rig-run">
      <div class="x9-pin">
        <div class="x9-stage"><canvas id="rig2" role="img" aria-label="The rig bends through each phase of an agent run"></canvas></div>
        <div class="x9-tele" aria-live="polite">
          <ol class="x9-phase" aria-hidden="true">${RUN.map(() => "<li></li>")}</ol>
          <div class="x9-now"><span id="t-step">Step 1 of ${RUN.length}</span><b id="t-phase">Read</b><em id="t-log">${RUN[0].log}</em></div>
          <div class="x9-grid">
            <div><span>Files edited</span><b id="t-files">0</b></div><div><span>Tests run</span><b id="t-tests">0</b></div><div><span>Knee angle</span><b class="live" id="t-knee">0°</b></div>
            <div><span>Tokens</span><b id="t-tok">0</b></div><div><span>Cached</span><b id="t-cache">0%</b></div><div><span>Cost so far</span><b class="live" id="t-cost">$0.000</b></div>
          </div>
          <p class="x9-fine">Sample agent run at Forge rates. ${PRICE_NOTE}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="modules" data-section aria-labelledby="x9-m">
    <div class="k-wrap">
      <h2 id="x9-m" class="x9-h2" data-reveal>Modules, and the load each one takes off you.</h2>
      <div class="x9-mods" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="x9-mod k-card m${i}" data-spot><p class="id"><span>MOD-${String(i + 1).padStart(2, "0")}</span><span>${f}</span></p><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="calibrate" data-section aria-labelledby="x9-c">
    <div data-rail>
      <div data-rail-view>
        <div class="x9-rail-head"><h2 id="x9-c" class="x9-h2" data-reveal>Calibration: three steps.</h2></div>
        <ol class="x9-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="x9-step k-card"><span class="n">CAL-0${i + 1}</span><h3>${t}</h3><p>${d}</p><pre><code>${["model: \"forge-256k\"", `baseURL: "${BRAND.apiBase}"`, "log: step, tokens, cached, cost_usd"][i]}</code></pre></li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="tests" data-section aria-labelledby="x9-t">
    <div class="k-wrap">
      <h2 id="x9-t" class="x9-h2" data-reveal>Field tests, by role.</h2>
      <div class="x9-tests" data-stagger>${PROOF.map(([role, focus, q], i) => `<article class="x9-test k-card"><p class="hd"><b>${role}</b><span>TEST-${String(i + 1).padStart(2, "0")} · ${focus}</span></p><q>${q}</q></article>`)}</div>
      <p class="x9-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="classes" data-section aria-labelledby="x9-p">
    <div class="k-wrap">
      <h2 id="x9-p" class="x9-h2" data-reveal>Load classes, billed per token.</h2>
      <div class="x9-plans" data-stagger>${PLANS.map((p) => h`<article class="x9-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="x9-table" data-reveal>
        <caption>Rates per 1M tokens</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">Role</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="x9-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="x9-f">
    <div class="k-wrap x9-final">
      <h2 id="x9-f" class="x9-h2" data-reveal>Hand over the next ticket.</h2>
      <a class="x9-btn" href="#main" data-magnetic="5,0.22,0.64,0.4" data-reveal><span data-magnetic-label>Get your API key</span><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span></a>
    </div>
  </section>
</main>
<footer class="x9-foot">
  <div><p class="x9-mark"><i aria-hidden="true"></i>${BRAND.name.toUpperCase()}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Models</h3><ul>${MODELS.map((m) => `<li><a href="#classes">${m.name}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#rig-run">Coding agents</a></li><li><a href="#calibrate">API quickstart</a></li><li><a href="#classes">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Chakra Petch and IBM Plex Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, smooth, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2, D = Math.PI / 180;

    // A vector exoskeleton leg: hip → knee → ankle → toe, with frame, actuators and joint gauges.
    function drawRig(ctx, w, h, { hip, knee, ankle, scale = 1, cx = 0.62, cy = 0.2, load = 0, hot = -1 }) {
      const L1 = h * 0.3 * scale, L2 = h * 0.3 * scale, L3 = h * 0.1 * scale;
      const H = [w * cx, h * cy];
      const a1 = Math.PI / 2 - hip * D, a2 = a1 + knee * D, a3 = a2 - Math.PI / 2 + ankle * D;
      const K = [H[0] + Math.cos(a1) * L1, H[1] + Math.sin(a1) * L1];
      const A = [K[0] + Math.cos(a2) * L2, K[1] + Math.sin(a2) * L2];
      const T = [A[0] + Math.cos(a3) * L3, A[1] + Math.sin(a3) * L3];
      const seg = (p, q, wd, col) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); };
      const off = (p, q, d) => { const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy); return [[p[0] - (dy / l) * d, p[1] + (dx / l) * d], [q[0] - (dy / l) * d, q[1] + (dx / l) * d]]; };
      // limb (muted) and exo frame (bright)
      seg(H, K, 22 * scale, "#2C333D"); seg(K, A, 18 * scale, "#2C333D"); seg(A, T, 12 * scale, "#2C333D");
      for (const [p, q] of [[H, K], [K, A]]) { const [o1, o2] = off(p, q, 16 * scale); seg(o1, o2, 2, "rgba(231,235,240,.85)"); const [i1, i2] = off(p, q, -16 * scale); seg(i1, i2, 1, "rgba(231,235,240,.35)"); }
      // actuator along the thigh, extension proportional to load
      const mid = [lerp(H[0], K[0], 0.35), lerp(H[1], K[1], 0.35)], end = [lerp(H[0], K[0], 0.35 + 0.4 * (0.4 + load * 0.6)), lerp(H[1], K[1], 0.35 + 0.4 * (0.4 + load * 0.6))];
      const [m1] = off(mid, end, 30 * scale), [, e2] = off(mid, end, 30 * scale);
      seg(m1, e2, 6 * scale, "rgba(204,255,0,.85)");
      seg(A, T, 2, "rgba(231,235,240,.7)");
      // joints with angle gauges
      [[H, hip], [K, knee], [A, ankle]].forEach(([p, ang], i) => {
        const r = (i === 1 ? 20 : 16) * scale;
        ctx.strokeStyle = i === hot ? "#CCFF00" : "rgba(231,235,240,.5)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, TAU); ctx.stroke();
        ctx.strokeStyle = "#CCFF00"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(p[0], p[1], r + 6, -Math.PI / 2, -Math.PI / 2 + Math.abs(ang) * D); ctx.stroke();
        ctx.fillStyle = "#0D0F12"; ctx.beginPath(); ctx.arc(p[0], p[1], r * 0.45, 0, TAU); ctx.fill();
        ctx.font = '500 11px "IBM Plex Mono", monospace'; ctx.fillStyle = "rgba(231,235,240,.8)";
        ctx.fillText(Math.round(ang) + "°", p[0] + r + 12, p[1] + 4);
      });
      // cable
      ctx.strokeStyle = "rgba(204,255,0,.35)"; ctx.lineWidth = 1; ctx.setLineDash([4, 5]);
      ctx.beginPath(); ctx.moveTo(H[0] + 30 * scale, H[1]); ctx.quadraticCurveTo(K[0] + 40 * scale, K[1] - 40 * scale, A[0] + 18 * scale, A[1]); ctx.stroke(); ctx.setLineDash([]);
      return { K, A };
    }

    // hero: the pointer bends the knee
    const hc = $("#rig"), hs = canvas(hc), hk = $("#h-knee"), hh = $("#h-hip");
    let knee = 32, hip = 18;
    loop(hc, (t) => {
      const { ctx, w, h } = hs;
      ctx.clearRect(0, 0, w, h);
      const tk = pointer.active ? 10 + (pointer.y / innerHeight) * 90 : 32 + Math.sin(t * 0.8) * 12;
      const th = pointer.active ? -10 + (pointer.x / innerWidth) * 50 : 18 + Math.sin(t * 0.8 + 1) * 8;
      knee += (tk - knee) * 0.08; hip += (th - hip) * 0.08;
      const wide = w > 860;
      drawRig(ctx, w, h, { hip, knee, ankle: 10 + knee * 0.2, scale: wide ? 1 : 0.8, cx: wide ? 0.68 : 0.7, cy: wide ? 0.14 : 0.1, load: knee / 100, hot: 1 });
      hk.textContent = Math.round(knee) + "°"; hh.textContent = Math.round(hip) + "°";
    });

    // signature: scroll drives the rig through the six phases of a sample agent run
    const RUN = [
      ["Read", "Loaded 38 files from src/ and tests/", 31000, 900, 0, 0, 0], ["Plan", "Retry with exponential backoff in the API client", 2000, 600, 0.6, 0, 0],
      ["Edit", "src/client.ts +18 −6, src/retry.ts new", 3000, 2600, 0.9, 2, 0], ["Test", "214 tests run, 1 failing", 3400, 400, 0.92, 2, 214],
      ["Fix", "Off-by-one in the attempt counter", 2000, 700, 0.9, 2, 214], ["Diff", "All tests pass: one diff ready for review", 500, 300, 0.9, 2, 214],
    ];
    const F = AE.MODELS.find((m) => m.id === "forge");
    const POSE = [[10, 15, 5], [35, 60, 12], [55, 95, 20], [25, 45, 8], [40, 75, 15], [5, 8, 2], [5, 8, 2]];
    const run = $("#rig-run"), rc = $("#rig2"), rs = canvas(rc), phases = $$(".x9-phase li");
    const el = { step: $("#t-step"), phase: $("#t-phase"), log: $("#t-log"), files: $("#t-files"), tests: $("#t-tests"), knee: $("#t-knee"), tok: $("#t-tok"), cache: $("#t-cache"), cost: $("#t-cost") };
    let p = 0;
    onScroll(() => {
      p = RM ? 0.999 : clamp((progress(run) - 0.04) / 0.88, 0, 0.999);
      const i = Math.floor(p * RUN.length), r = RUN[i];
      let tok = 0, c = 0, cachedTok = 0, inTok = 0;
      RUN.slice(0, i + 1).forEach(([, , a, b, ca]) => { tok += a + b; inTok += a; cachedTok += a * ca; c += ((a * (1 - ca)) * F.inPrice + a * ca * F.cached + b * F.outPrice) / 1e6; });
      phases.forEach((li, k) => li.classList.toggle("on", k <= i));
      el.step.textContent = "Step " + (i + 1) + " of " + RUN.length; el.phase.textContent = r[0]; el.log.textContent = r[1];
      el.files.textContent = r[5]; el.tests.textContent = r[6]; el.tok.textContent = tok.toLocaleString("en-US");
      el.cache.textContent = Math.round((cachedTok / inTok) * 100) + "%"; el.cost.textContent = "$" + c.toFixed(3);
    });
    loop(rc, () => {
      const { ctx, w, h } = rs;
      ctx.clearRect(0, 0, w, h);
      const f = p * RUN.length, i = Math.floor(f), k = smooth(f - i);
      const a = POSE[i], b = POSE[i + 1];
      const pose = a.map((v, j) => lerp(v, b[j], k));
      drawRig(ctx, w, h, { hip: pose[0], knee: pose[1], ankle: pose[2], scale: w < 600 ? 0.7 : 0.9, cx: 0.45, cy: 0.12, load: pose[1] / 100, hot: 1 });
      el.knee.textContent = Math.round(pose[1]) + "°";
    });
  }),
};
