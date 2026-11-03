import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Aether Orbital";
const ORDER = ["swift", "core", "unbound", "forge", "atlas"];
const SHELLS = ORDER.map((id) => MODELS.find((m) => m.id === id));
const RECEIPTS = SHELLS.map((m, i) => {
  const inTok = [212, 1840, 1620, 9400, 48000][i], outTok = [38, 410, 380, 1900, 900][i], cached = [0, 0.5, 0.4, 0.82, 0.9][i];
  return { m, inTok, outTok, cached, usd: usd(cost(m, inTok, outTok, cached)) };
});

export default {
  title: "Aether — Every model, in orbit around one key",
  description: "Five model families on one API, each in its own orbit, with a routing receipt for every request. Aether Orbital design direction.",
  fonts: [
    { family: "Unbounded", axes: "wght@400;600;800" },
    { family: "Space Mono", axes: "ital,wght@0,400;0,700" },
  ],
  tokens: {
    bgPrimary: "#05070B", bgSecondary: "#0F141C", accent: "#00F5D4", onAccent: "#021512",
    textPrimary: "#E6EEF5", textMuted: "#93A3B5", line: "rgba(230,238,245,.12)",
    display: '"Unbounded", sans-serif', body: '"Space Mono", ui-monospace, monospace',
  },
  css: /* css */ `
body{font-size:1.05rem}
.o3-nav{position:fixed;inset:0 0 auto;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:linear-gradient(#05070Bf0,#05070B00)}
.o3-mark{font-family:var(--font-display);font-weight:800;font-size:1rem;letter-spacing:.08em;text-decoration:none}
.o3-mark span{color:var(--text-muted);font-weight:400}
.o3-links{display:flex;gap:4px;font-size:.78rem}
.o3-links a{text-decoration:none;color:var(--text-muted);padding:6px 12px;border:1px solid transparent;border-radius:2px}
.o3-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.o3-utc{font-size:.76rem;color:var(--text-muted);font-variant-numeric:tabular-nums}
@media (max-width:900px){.o3-links{display:none}}
.o3-btn{display:inline-flex;align-items:center;gap:14px;min-height:56px;padding:0 26px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:600;font-size:.86rem;letter-spacing:.02em;text-decoration:none;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px))}
.o3-btn svg{width:16px;height:16px;transition:transform .4s var(--ease)}
.o3-btn.is-near svg{transform:rotate(45deg)}
.o3-h2{font-size:clamp(2rem,3.8vw,3.4rem);font-weight:600;letter-spacing:-.03em;line-height:1.02;max-width:20ch}
.o3-fine{margin-top:22px;font-size:.78rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: HUD corners */
.o3-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto;padding:84px var(--gutter) 32px;overflow:clip}
.o3-globe{position:absolute;inset:0}
.o3-globe canvas{width:100%;height:100%}
.o3-corner{position:relative;z-index:2}
.o3-tl{grid-column:1 / span 2;display:grid;gap:18px;max-width:780px}
.o3-tl h1{font-weight:800;line-height:.96}
.o3-tl .k-body{color:var(--text-muted);max-width:46ch}
.o3-tr{grid-column:2;grid-row:2;justify-self:end;align-self:start;text-align:right;font-size:.76rem;color:var(--text-muted);display:grid;gap:4px;margin-top:24px}
.o3-tr b{font-family:var(--font-display);font-size:1.6rem;color:var(--text-primary);font-weight:400}
.o3-bl{grid-column:1;grid-row:3;align-self:end;display:grid;gap:12px;justify-items:start}
.o3-br{grid-column:2;grid-row:3;align-self:end;justify-self:end;text-align:right;font-size:.8rem;color:var(--text-muted);max-width:34ch;border-right:1px solid var(--accent);padding-right:14px}
.o3-br b{color:var(--text-primary)}
.o3-tick{position:absolute;width:22px;height:22px;border-color:#E6EEF566;border-style:solid;pointer-events:none;z-index:2}
.o3-tick.a{top:72px;left:16px;border-width:1px 0 0 1px}.o3-tick.b{top:72px;right:16px;border-width:1px 1px 0 0}.o3-tick.c{bottom:16px;left:16px;border-width:0 0 1px 1px}.o3-tick.d{bottom:16px;right:16px;border-width:0 1px 1px 0}
@media (max-width:860px){
  .o3-hero{grid-template-columns:1fr;grid-template-rows:auto 1fr auto auto;padding:72px var(--gutter) 18px}
  .o3-tl{grid-column:1;gap:12px}
  .o3-tr{display:none}
  .o3-bl{grid-column:1;grid-row:3}
  .o3-br{grid-column:1;grid-row:4;justify-self:start;text-align:left;border-right:0;border-left:1px solid var(--accent);padding:0 0 0 12px;margin-top:12px;font-size:.76rem}
  .o3-globe{opacity:.75}
}

/* problem */
.o3-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.o3-anom{display:grid;border-top:1px solid var(--line)}
.o3-anom li{display:grid;grid-template-columns:auto 1fr;gap:6px 18px;padding:22px 0;border-bottom:1px solid var(--line)}
.o3-anom .code{grid-row:span 2;font-size:.76rem;color:var(--text-muted);padding-top:3px}
.o3-anom .was{color:var(--text-muted);font-size:.92rem}
.o3-anom .now{font-family:var(--font-display);font-size:1.15rem;line-height:1.3}
@media (max-width:900px){.o3-cols{grid-template-columns:1fr;gap:40px}}

/* signature: shell lock-on */
.o3-run{height:520vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.o3-pin{position:sticky;top:0;height:100vh;display:grid;grid-template-columns:minmax(300px,1fr) minmax(0,1.6fr);gap:32px;padding:76px var(--gutter) 24px}
.o3-rail{align-self:center;display:grid;gap:14px;max-height:calc(100vh - 120px);overflow:hidden}
.o3-rail .now{display:grid;gap:4px;border-left:1px solid var(--accent);padding-left:14px}
.o3-rail .now span{font-size:.76rem;color:var(--text-muted)}
.o3-rail .now b{font-family:var(--font-display);font-size:clamp(1.8rem,3vw,2.6rem);font-weight:600;letter-spacing:-.02em}
.o3-rail .now em{font-style:normal;font-size:.86rem;color:var(--text-muted)}
.o3-log{display:grid;gap:8px;font-size:.76rem}
.o3-log li{display:grid;grid-template-columns:auto 1fr auto;gap:4px 12px;padding:10px 12px;background:var(--bg-secondary);border:1px solid var(--line);opacity:0;transform:translateX(-10px);transition:opacity .5s var(--ease),transform .6s var(--ease)}
.o3-log li.on{opacity:1;transform:none}
.o3-log li .id{color:var(--text-muted)}
.o3-log li .c{grid-column:1 / -1;color:var(--text-muted)}
.o3-cam{position:relative;min-height:0}
.o3-cam canvas{width:100%;height:100%}
.o3-shells{position:absolute;right:0;top:0;display:grid;gap:6px;font-size:.76rem;color:var(--text-muted)}
.o3-shells li{display:flex;gap:8px;align-items:center;justify-content:flex-end}
.o3-shells li i{width:18px;height:2px;background:#E6EEF544}
.o3-shells li.on{color:var(--text-primary)}
.o3-shells li.on i{background:var(--accent)}
@media (max-width:900px){
  .o3-run{height:460vh}
  .o3-pin{grid-template-columns:1fr;grid-template-rows:1fr auto;gap:8px;padding:68px var(--gutter) 14px}
  .o3-cam{grid-row:1}
  .o3-rail{grid-row:2;align-self:end}
  .o3-log li:not(.last){display:none}
  .o3-shells{display:none}
}
@media (prefers-reduced-motion:reduce){.o3-run{height:auto}.o3-pin{position:relative;height:auto;min-height:100vh}.o3-log li{opacity:1;transform:none}}

/* bento: mission systems */
.o3-bento{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.o3-sys{position:relative;isolation:isolate;overflow:hidden;background:var(--bg-secondary);border:1px solid var(--line);display:grid;gap:14px;align-content:start;min-height:260px}
.o3-sys::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(300px circle at var(--mx) var(--my),#00F5D414,transparent 65%);opacity:0;transition:opacity .3s}
.o3-sys:hover::before{opacity:1}
.o3-sys .tag{display:flex;justify-content:space-between;font-size:.76rem;color:var(--text-muted)}
.o3-sys h3{font-size:1.15rem;font-weight:600;line-height:1.3;letter-spacing:-.01em}
.o3-sys p{font-size:.86rem;color:var(--text-muted)}
.o3-sys.s0{grid-column:span 2;grid-row:span 2}
.o3-sys.s0 h3{font-size:clamp(1.6rem,2.4vw,2.2rem);line-height:1.12}
.o3-sys.s5{grid-column:span 2}
.o3-sys .scope{width:100%;max-width:280px;height:auto;margin-top:auto}
@media (max-width:900px){.o3-bento{grid-template-columns:1fr}.o3-sys{grid-column:auto!important;grid-row:auto!important;min-height:0}}

/* rail: launch sequence */
.o3-rail-head{padding:0 var(--gutter);margin-bottom:48px;display:flex;justify-content:space-between;align-items:end;gap:24px}
.o3-count{font-family:var(--font-display);font-size:2.4rem;color:var(--text-muted);font-variant-numeric:tabular-nums}
.o3-steps{padding:0 var(--gutter);gap:16px}
.o3-step{width:min(600px,56vw);background:var(--bg-secondary);border:1px solid var(--line);display:grid;gap:16px;align-content:start;transition:border-color .4s}
.o3-step.is-active{border-color:#00F5D466}
.o3-step .t{font-size:.76rem;color:var(--text-muted)}
.o3-step h3{font-size:1.6rem;font-weight:600;line-height:1.15}
.o3-step p{color:var(--text-muted);font-size:.92rem}
.o3-step pre{margin:0;background:#05070B;border:1px solid var(--line);padding:14px;font-size:.76rem;line-height:1.6;overflow-x:auto;white-space:pre}
@media (max-width:899px){.o3-step{width:auto}.o3-count{display:none}}

/* crew notes */
.o3-crew{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.o3-note{border:1px solid var(--line);display:grid;gap:16px;background:linear-gradient(#0F141C,#0A0E14)}
.o3-note .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.76rem;color:var(--text-muted)}
.o3-note b{font-family:var(--font-display);font-weight:600;font-size:1.05rem}
.o3-note q{font-size:.98rem;line-height:1.6;quotes:"“" "”"}
@media (max-width:760px){.o3-crew{grid-template-columns:1fr}}

/* fuel table */
.o3-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.o3-plan{border:1px solid var(--line);display:grid;gap:14px;align-content:start}
.o3-plan.feat{background:var(--bg-secondary);border-color:#00F5D455}
.o3-plan h3{font-size:1rem;font-weight:600;letter-spacing:.04em}
.o3-plan .p{font-family:var(--font-display);font-size:2.2rem;font-weight:600;letter-spacing:-.03em;line-height:1}
.o3-plan .cad{font-size:.78rem;color:var(--text-muted)}
.o3-plan ul{display:grid;gap:6px;font-size:.86rem}
.o3-plan li::before{content:"› ";color:var(--text-muted)}
.o3-plan .fk{font-size:.8rem;border-top:1px dashed var(--line);padding-top:12px}
@media (max-width:900px){.o3-plans{grid-template-columns:1fr}}
.o3-fuel{width:100%;margin-top:32px;border-collapse:collapse;font-size:.84rem;font-variant-numeric:tabular-nums}
.o3-fuel caption{text-align:left;font-family:var(--font-display);font-size:1rem;padding-bottom:12px}
.o3-fuel th,.o3-fuel td{text-align:left;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.o3-fuel thead th{font-weight:400;color:var(--text-muted);font-size:.76rem}
@media (max-width:700px){.o3-fuel th:nth-child(2),.o3-fuel td:nth-child(2),.o3-fuel th:nth-child(5),.o3-fuel td:nth-child(5){display:none}}

/* final + footer */
.o3-final{display:grid;justify-items:center;text-align:center;gap:32px}
.o3-final .o3-h2{font-size:clamp(2.4rem,5vw,4.4rem);font-weight:800}
.o3-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.8rem;color:var(--text-muted)}
.o3-foot h3{font-family:var(--font-display);font-weight:600;font-size:.78rem;color:var(--text-primary);margin-bottom:12px}
.o3-foot ul{display:grid;gap:8px}
.o3-foot a{text-decoration:none}
.o3-foot a:hover{color:var(--text-primary)}
.o3-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.o3-foot{grid-template-columns:1fr 1fr}.o3-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="o3-nav">
  <a class="o3-mark" href="#main">${BRAND.name.toUpperCase()} <span>orbital</span></a>
  <nav class="o3-links" data-spy aria-label="Sections"><a href="#anomalies">Anomalies</a><a href="#shells">Shells</a><a href="#systems">Systems</a><a href="#launch">Launch</a><a href="#crew">Crew</a><a href="#fuel">Fuel</a></nav>
  <span class="o3-utc" id="utc" aria-hidden="true">T+00:00:00</span>
</header>
<main id="main">
  <section class="o3-hero" data-hero aria-labelledby="o3-h">
    <div class="o3-globe" data-hero-part="visual"><canvas id="globe" role="img" aria-label="A rotating globe with five orbital shells, one per model family; drag the pointer to steer it"></canvas></div>
    <span class="o3-tick a" aria-hidden="true"></span><span class="o3-tick b" aria-hidden="true"></span><span class="o3-tick c" aria-hidden="true"></span><span class="o3-tick d" aria-hidden="true"></span>
    <div class="o3-corner o3-tl">
      <h1 id="o3-h" data-hero-part="headline">Every model, in orbit.</h1>
      <p class="k-body" data-hero-part="sub">Five model families circle one API key. Pick the orbit (fast and small, long-range, or unbound) and every request comes back with its own receipt.</p>
    </div>
    <div class="o3-corner o3-tr" aria-hidden="true"><span>Shells in orbit</span><b>05</b><span>One key, one endpoint</span></div>
    <div class="o3-corner o3-bl" data-hero-part="cta"><a class="o3-btn" href="#fuel" data-cta="primary" data-magnetic="6,0.18,0.72,0.4"><span data-magnetic-label>Get your API key</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8"/></svg></a></div>
    <p class="o3-corner o3-br" data-hero-part="trust">Lowest orbit: <b>Swift</b> at ${rate(SHELLS[0].inPrice)} per 1M input tokens. Widest: <b>Atlas</b>, ${SHELLS[4].context} context. Sample rates.</p>
  </section>

  <section id="anomalies" data-section aria-labelledby="o3-a">
    <div class="k-wrap o3-cols">
      <h2 id="o3-a" class="o3-h2" data-reveal>Three anomalies we cleared from the flight path.</h2>
      <ol class="o3-anom" data-stagger>
        ${PROBLEM.rows.map(([was, now], i) => `<li><span class="code">ANM-0${i + 1}</span><span class="was">${was}</span><span class="now">${now}</span></li>`)}
      </ol>
    </div>
    <div class="o3-run" id="shells">
      <div class="o3-pin">
        <aside class="o3-rail" aria-live="polite">
          <div class="now"><span id="sh-label">Shell 1 of 5 · locked</span><b id="sh-name">Swift</b><em id="sh-role">Fast &amp; small · 32K</em></div>
          <ol class="o3-log" id="log">
            ${RECEIPTS.map((r, i) => `<li data-i="${i}"><span class="id">RCPT-${String(i + 1).padStart(4, "0")}</span><span>${r.m.id}-${r.m.context.toLowerCase()}</span><span class="live">${r.usd}</span><span class="c">${r.inTok.toLocaleString("en-US")} in · ${r.outTok.toLocaleString("en-US")} out · ${Math.round(r.cached * 100)}% cached</span></li>`)}
          </ol>
          <p class="o3-fine">Example receipts at sample rates. ${PRICE_NOTE}</p>
        </aside>
        <div class="o3-cam">
          <canvas id="cam" role="img" aria-label="The globe with the currently locked orbital shell highlighted"></canvas>
          <ol class="o3-shells" aria-hidden="true">${SHELLS.map((m) => `<li><span>${m.name} · ${m.context}</span><i></i></li>`)}</ol>
        </div>
      </div>
    </div>
  </section>

  <section id="systems" data-section aria-labelledby="o3-s">
    <div class="k-wrap">
      <h2 id="o3-s" class="o3-h2" data-reveal>Mission systems, and what each one does for you.</h2>
      <div class="o3-bento" data-stagger>
        ${BENEFITS.map(([f, b, d], i) => h`<article class="o3-sys k-card s${i}" data-spot><p class="tag"><span>SYS-${String(i + 1).padStart(2, "0")}</span><span>${f}</span></p><h3>${b}</h3><p>${d}</p>${i === 0 ? `<svg class="scope" viewBox="0 0 280 90" aria-hidden="true"><path d="M0 70 C 60 70, 80 20, 140 20 S 220 70, 280 40" fill="none" stroke="#00F5D4" stroke-width="1.4"/><path d="M0 80 H280" stroke="#E6EEF522"/><circle cx="140" cy="20" r="4" fill="#00F5D4"/></svg>` : ""}</article>`)}
      </div>
    </div>
  </section>

  <section id="launch" data-section aria-labelledby="o3-l">
    <div data-rail>
      <div data-rail-view>
        <div class="o3-rail-head"><h2 id="o3-l" class="o3-h2" data-reveal>Launch sequence: three burns.</h2><span class="o3-count" aria-hidden="true">T−3</span></div>
        <ol class="o3-steps" data-rail-track>
          ${STEPS.map(([t, d], i) => `<li class="o3-step k-card"><span class="t">Burn ${i + 1} · T−${3 - i}</span><h3>${t}</h3><p>${d}</p><pre><code>${i === 0 ? "model: swift-32k:abliterated" : i === 1 ? `baseURL: "${BRAND.apiBase}"` : "usage: { tokens, cached_tokens, cost_usd }"}</code></pre></li>`)}
        </ol>
      </div>
    </div>
  </section>

  <section id="crew" data-section aria-labelledby="o3-c">
    <div class="k-wrap">
      <h2 id="o3-c" class="o3-h2" data-reveal>Crew notes, by role.</h2>
      <div class="o3-crew" data-stagger>
        ${PROOF.map(([role, focus, q], i) => `<article class="o3-note k-card"><p class="hd"><b>${role}</b><span>LOG-${String(i + 1).padStart(2, "0")} · ${focus}</span></p><q>${q}</q></article>`)}
      </div>
      <p class="o3-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="fuel" data-section aria-labelledby="o3-f">
    <div class="k-wrap">
      <h2 id="o3-f" class="o3-h2" data-reveal>Fuel is billed by the token.</h2>
      <div class="o3-plans" data-stagger>
        ${PLANS.map((p) => h`<article class="o3-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}
      </div>
      <table class="o3-fuel" data-reveal>
        <caption>Fuel table · per 1M tokens</caption>
        <thead><tr><th scope="col">Shell</th><th scope="col">Role</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${SHELLS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="o3-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="o3-z">
    <div class="k-wrap o3-final">
      <h2 id="o3-z" class="o3-h2" data-reveal>Clear for launch.</h2>
      <p class="k-body k-muted" data-reveal>One key puts all five shells in range. Your first request is one string away.</p>
      <a class="o3-btn" href="#main" data-magnetic="6,0.18,0.72,0.4" data-reveal><span data-magnetic-label>Get your API key</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 13 13 3M5 3h8v8"/></svg></a>
    </div>
  </section>
</main>
<footer class="o3-foot">
  <div><p class="o3-mark">${BRAND.name.toUpperCase()} <span>orbital</span></p><p style="margin-top:14px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Shells</h3><ul>${SHELLS.map((m) => `<li><a href="#shells">${m.name}</a></li>`)}</ul></div>
  <div><h3>Mission</h3><ul><li><a href="#systems">Systems</a></li><li><a href="#launch">API quickstart</a></li><li><a href="#fuel">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Unbounded and Space Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, smooth, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;
    const ORDER = ["swift", "core", "unbound", "forge", "atlas"];
    const SH = ORDER.map((id) => AE.MODELS.find((m) => m.id === id));
    const radius = (m) => 1.28 + ((Math.log(m.contextK) - Math.log(32)) / (Math.log(1000) - Math.log(32))) * 1.15;
    const incl = [0.35, -0.5, 0.75, -0.2, 0.12];

    // mission clock
    const utc = $("#utc"), t0 = performance.now();
    setInterval(() => { const s = Math.floor((performance.now() - t0) / 1000); utc.textContent = "T+" + [s / 3600, (s / 60) % 60, s % 60].map((v) => String(Math.floor(v)).padStart(2, "0")).join(":"); }, 1000);

    function Globe(cv, opts) {
      const s = canvas(cv);
      let yaw = 0.6, pitch = 0.32;
      const rot = (x, y, z) => {
        const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
      };
      const draw = (t, { focus = -1, zoom = 1, cx = 0.5, cy = 0.5, spin = 0 } = {}) => {
        const { ctx, w, h } = s;
        ctx.clearRect(0, 0, w, h);
        yaw = 0.6 + t * 0.08 + spin;
        const R = Math.min(w, h) * 0.2 * zoom, X = w * cx, Y = h * cy;
        const P = (x, y, z) => { const [a, b, c] = rot(x, y, z); return [X + a * R, Y + b * R, c]; };
        // globe body
        const g = ctx.createRadialGradient(X - R * 0.3, Y - R * 0.4, R * 0.1, X, Y, R);
        g.addColorStop(0, "#162231"); g.addColorStop(1, "#070B11");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, R, 0, TAU); ctx.fill();
        // graticule
        ctx.lineWidth = 1;
        for (let lat = -60; lat <= 60; lat += 30) {
          const phi = (lat * Math.PI) / 180;
          ctx.beginPath();
          for (let i = 0; i <= 64; i++) { const th = (i / 64) * TAU; const [px, py, pz] = P(Math.cos(phi) * Math.cos(th), Math.sin(phi), Math.cos(phi) * Math.sin(th)); ctx.strokeStyle = "rgba(147,163,181,.22)"; if (pz < 0) { ctx.moveTo(px, py); continue; } i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
          ctx.stroke();
        }
        for (let lon = 0; lon < 180; lon += 30) {
          const th = (lon * Math.PI) / 180;
          ctx.beginPath();
          let pen = false;
          for (let i = 0; i <= 64; i++) { const phi = (i / 64) * TAU; const [px, py, pz] = P(Math.cos(phi) * Math.cos(th), Math.sin(phi), Math.cos(phi) * Math.sin(th)); if (pz < 0) { pen = false; continue; } pen ? ctx.lineTo(px, py) : ctx.moveTo(px, py); pen = true; }
          ctx.strokeStyle = "rgba(147,163,181,.18)"; ctx.stroke();
        }
        ctx.strokeStyle = "rgba(230,238,245,.35)"; ctx.beginPath(); ctx.arc(X, Y, R, 0, TAU); ctx.stroke();
        // shells
        SH.forEach((m, i) => {
          const r = radius(m), inc = incl[i];
          const pts = [];
          for (let k = 0; k <= 96; k++) { const a = (k / 96) * TAU; const x = Math.cos(a) * r, z = Math.sin(a) * r; pts.push(P(x, z * Math.sin(inc), z * Math.cos(inc))); }
          const on = i === focus, dim = focus >= 0 && !on;
          ctx.lineWidth = on ? 2 : 1;
          for (let k = 0; k < pts.length - 1; k++) {
            const [ax, ay, az] = pts[k], [bx, by] = pts[k + 1];
            const behind = az < 0 && Math.hypot(ax - X, ay - Y) < R;
            if (behind) continue;
            ctx.strokeStyle = on ? "rgba(0,245,212,.95)" : `rgba(230,238,245,${dim ? 0.1 : 0.28})`;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
          }
          for (let n = 0; n < 3; n++) {
            const a = (RM ? 0.4 : t) * (0.6 / r) + n * (TAU / 3) + i;
            const x = Math.cos(a) * r, z = Math.sin(a) * r;
            const [px, py, pz] = P(x, z * Math.sin(inc), z * Math.cos(inc));
            if (pz < 0 && Math.hypot(px - X, py - Y) < R) continue;
            ctx.fillStyle = on ? "#00F5D4" : dim ? "rgba(230,238,245,.3)" : "#E6EEF5";
            ctx.beginPath(); ctx.arc(px, py, on ? 3.6 : 2.2, 0, TAU); ctx.fill();
            if (on && n === 0 && opts.labels) { ctx.font = '400 12px "Space Mono", monospace'; ctx.fillText(m.name.toUpperCase() + " · " + m.context, px + 10, py - 8); }
          }
        });
      };
      return { draw };
    }

    // hero globe: pointer steers the yaw
    const hero = Globe($("#globe"), { labels: false });
    let steer = 0;
    loop($("#globe"), (t) => {
      steer += ((pointer.active ? (pointer.x / innerWidth - 0.5) * 1.2 : 0) - steer) * 0.04;
      const wide = innerWidth > 860;
      hero.draw(t, { zoom: wide ? 1.5 : 1.25, cx: wide ? 0.66 : 0.62, cy: wide ? 0.56 : 0.6, spin: steer });
    });

    // signature: scroll locks onto each shell; receipts print in the rail
    const run = $("#shells"), cam = Globe($("#cam"), { labels: true });
    const items = $$("#log li"), shells = $$(".o3-shells li");
    const nm = $("#sh-name"), rl = $("#sh-role"), lb = $("#sh-label");
    let p = 0, focus = 0;
    onScroll(() => {
      p = RM ? 1 : clamp((progress(run) - 0.04) / 0.9);
      const f = Math.min(4, Math.floor(p * 5));
      if (f !== focus) focus = f;
      items.forEach((li, i) => { li.classList.toggle("on", i <= focus); li.classList.toggle("last", i === focus); });
      shells.forEach((li, i) => li.classList.toggle("on", i === focus));
      nm.textContent = SH[focus].name; rl.textContent = SH[focus].role + " · " + SH[focus].context;
      lb.textContent = "Shell " + (focus + 1) + " of 5 · locked";
    });
    loop($("#cam"), (t) => {
      const target = 1.45 - radius(SH[focus]) * 0.28;
      cam.draw(t, { focus, zoom: target, cx: 0.5, cy: 0.52, spin: p * 2 });
    });
  }),
};
