import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate } from "../aether.mjs";

const STYLE = "Lumina";

export default {
  title: "Aether — Stream every token the moment it exists",
  description: "Streaming and tool calls on every model family: your users see each token as it is generated, and every token is metered. Lumina design direction.",
  fonts: [
    { family: "Syncopate", axes: "wght@400;700" },
    { family: "Space Mono", axes: "wght@400;700" },
  ],
  tokens: {
    bgPrimary: "#06070A", bgSecondary: "#12151E", accent: "#10B981", onAccent: "#03140D",
    textPrimary: "#E8ECF2", textMuted: "#96A0AE", line: "rgba(232,236,242,.12)",
    display: '"Syncopate", sans-serif', body: '"Space Mono", ui-monospace, monospace',
  },
  css: /* css */ `
:root{--h1-weight:700}
.l18-nav{position:sticky;top:0;z-index:40;height:58px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:#06070Af2;border-bottom:1px solid var(--line);font-size:.76rem}
.l18-mark{font-family:var(--font-display);font-weight:700;font-size:.95rem;letter-spacing:.2em;text-decoration:none}
.l18-links{display:flex;gap:2px}
.l18-links a{text-decoration:none;color:var(--text-muted);padding:6px 10px;border:1px solid transparent}
.l18-links a.is-current{color:var(--text-primary);border-color:var(--accent);box-shadow:none}
.l18-nm{color:var(--text-muted)}
@media (max-width:900px){.l18-links{display:none}}
.l18-btn{display:inline-flex;align-items:center;gap:12px;min-height:56px;padding:0 24px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:700;font-size:.78rem;letter-spacing:.12em;text-decoration:none;box-shadow:none}
.l18-btn i{width:28px;height:2px;background:var(--on-accent);position:relative;transition:width .4s var(--ease)}
.l18-btn i::after{content:"";position:absolute;right:-1px;top:-3px;width:8px;height:8px;border-right:2px solid var(--on-accent);border-top:2px solid var(--on-accent);transform:rotate(45deg)}
.l18-btn.is-near i{width:38px}
.l18-h2{font-size:clamp(1.8rem,3.6vw,3.2rem);font-weight:700;letter-spacing:-.03em;line-height:1.05;max-width:20ch}
.l18-fine{margin-top:22px;font-size:.76rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: die floorplan */
.l18-hero{position:relative;min-height:calc(100svh - 58px);display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr auto;gap:14px;padding:20px var(--gutter)}
.l18-wg{position:absolute;inset:0;pointer-events:none}
.l18-wg canvas{width:100%;height:100%}
.l18-blk{position:relative;z-index:1;border:1px solid var(--line);background:#0B0D13e6;padding:22px;display:grid;gap:14px;align-content:start}
.l18-blk::before{content:attr(data-id);position:absolute;right:8px;top:6px;font-size:.6875rem;color:#96A0AE99}
.l18-b1{grid-column:1 / span 8;grid-row:1}
.l18-b1 h1{font-weight:700;line-height:1;max-width:none}
.l18-b2{grid-column:1 / span 5;grid-row:2;align-content:center}
.l18-b2 .k-body{color:var(--text-muted)}
.l18-b3{grid-column:9 / -1;grid-row:1 / span 2;display:grid;grid-template-rows:1fr auto;padding:0}
.l18-b3 .core{position:relative;min-height:180px}
.l18-b3 .core canvas{position:absolute;inset:0;width:100%;height:100%}
.l18-b3 .io{padding:16px;border-top:1px solid var(--line);font-size:.76rem;color:var(--text-muted)}
.l18-b4{grid-column:6 / span 3;grid-row:2;align-content:center}
.l18-b5{grid-column:1 / span 5;grid-row:3;align-content:center}
.l18-b6{grid-column:6 / -1;grid-row:3;align-content:center}
.l18-trust{font-size:.76rem;color:var(--text-muted);display:flex;gap:18px;flex-wrap:wrap}
.l18-trust b{color:var(--text-primary);font-weight:400}
@media (max-width:900px){
  .l18-hero{grid-template-columns:1fr 1fr;grid-template-rows:auto;grid-auto-flow:dense;gap:8px;padding:10px var(--gutter);align-content:start}
  .l18-btn{padding:0 14px;font-size:.76rem;gap:8px;white-space:nowrap}
  .l18-btn i{width:18px}
  .l18-blk{padding:12px;gap:8px}
  .l18-b1,.l18-b2,.l18-b5,.l18-b6{grid-column:1 / -1;grid-row:auto}
  .l18-b3{grid-column:2;grid-row:auto}
  .l18-b3 .core{min-height:80px}
  .l18-b3 .io{display:none}
  .l18-b4{grid-column:1;grid-row:auto}
  .l18-b6{display:none}
}

/* problem */
.l18-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.l18-loss{display:grid;gap:8px}
.l18-loss li{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:18px 20px;border:1px solid var(--line);background:var(--bg-secondary)}
.l18-loss .was{color:var(--text-muted);font-size:.84rem}
.l18-loss .now{font-size:.9rem;color:var(--text-primary)}
@media (max-width:900px){.l18-cols{grid-template-columns:1fr;gap:40px}.l18-loss li{grid-template-columns:1fr;gap:4px}}

/* signature: two lanes */
.l18-run{height:420vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.l18-pin{position:sticky;top:58px;height:calc(100vh - 58px);display:grid;grid-template-rows:1fr auto;gap:18px;padding:22px var(--gutter)}
.l18-bench{position:relative;border:1px solid var(--line);background:radial-gradient(800px 300px at 50% 50%,#10B9810d,transparent 70%),#08090D}
.l18-bench canvas{position:absolute;inset:0;width:100%;height:100%}
.l18-lab{position:absolute;left:16px;font-size:.76rem;color:var(--text-muted)}
.l18-meters{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.l18-meters div{background:var(--bg-primary);padding:14px 16px;display:grid;gap:4px}
.l18-meters span{font-size:.6875rem;color:var(--text-muted)}
.l18-meters b{font-family:var(--font-display);font-size:1.4rem;font-weight:700;font-variant-numeric:tabular-nums}
@media (max-width:900px){.l18-run{height:380vh}.l18-pin{padding:12px var(--gutter);gap:10px}.l18-meters{grid-template-columns:1fr 1fr}.l18-meters b{font-size:1.05rem}}
@media (prefers-reduced-motion:reduce){.l18-run{height:auto}.l18-pin{position:relative;height:100vh}}

/* bento: the wafer */
.l18-wafer{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.l18-die{position:relative;isolation:isolate;overflow:hidden;border:1px solid var(--line);background:var(--bg-secondary);display:grid;gap:12px;align-content:start;min-height:230px}
.l18-die::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(240px circle at var(--mx) var(--my),rgba(100,100,100,0.073),transparent 65%);opacity:0;transition:opacity .3s}
.l18-die:hover::before{opacity:1}
.l18-die .tag{display:flex;justify-content:space-between;font-size:.6875rem;color:var(--text-muted)}
.l18-die h3{font-family:var(--font-display);font-size:1rem;font-weight:700;line-height:1.35;letter-spacing:.02em}
.l18-die p{font-size:.8rem;color:var(--text-muted)}
.l18-die.d0{grid-column:span 2;grid-row:span 2}.l18-die.d0 h3{font-size:clamp(1.4rem,2.2vw,2rem)}
.l18-die.d5{grid-column:span 2}
@media (max-width:900px){.l18-wafer{grid-template-columns:1fr}.l18-die{grid-column:auto!important;grid-row:auto!important;min-height:0}}

/* rail */
.l18-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.l18-steps{padding:0 var(--gutter);gap:8px}
.l18-step{width:min(540px,50vw);border:1px solid var(--line);background:var(--bg-secondary);display:grid;gap:12px;align-content:start}
.l18-step.is-active{border-color:var(--accent);box-shadow:none}
.l18-step .n{font-family:var(--font-display);font-weight:700;font-size:.8rem;color:var(--text-muted);letter-spacing:.2em}
.l18-step h3{font-family:var(--font-display);font-size:1.15rem;font-weight:700;line-height:1.3}
.l18-step p{color:var(--text-muted);font-size:.84rem}
.l18-step pre{margin:0;background:#06070A;border:1px solid var(--line);padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.l18-step{width:auto}}

/* logs */
.l18-logs{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.l18-log{border:1px solid var(--line);display:grid;gap:12px;background:var(--bg-secondary)}
.l18-log .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.6875rem;color:var(--text-muted)}
.l18-log b{font-family:var(--font-display);font-size:.9rem;font-weight:700;color:var(--text-primary);letter-spacing:.04em}
.l18-log q{font-size:.86rem;line-height:1.6;quotes:"“" "”"}
@media (max-width:760px){.l18-logs{grid-template-columns:1fr}}

/* pricing */
.l18-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.l18-plan{border:1px solid var(--line);display:grid;gap:12px;align-content:start}
.l18-plan.feat{border-color:var(--accent);background:#0C1712}
.l18-plan h3{font-family:var(--font-display);font-size:.9rem;font-weight:700;letter-spacing:.16em}
.l18-plan .p{font-family:var(--font-display);font-size:2rem;font-weight:700;line-height:1.1}
.l18-plan .cad{font-size:.76rem;color:var(--text-muted)}
.l18-plan ul{display:grid;gap:6px;font-size:.8rem}
.l18-plan li::before{content:"> ";color:var(--accent)}
.l18-plan .fk{font-size:.76rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.l18-plans{grid-template-columns:1fr}}
.l18-table{width:100%;margin-top:32px;border-collapse:collapse;font-size:.8rem;font-variant-numeric:tabular-nums}
.l18-table caption{text-align:left;font-family:var(--font-display);font-weight:700;font-size:.9rem;letter-spacing:.12em;padding-bottom:12px}
.l18-table th,.l18-table td{text-align:left;padding:12px;border:1px solid var(--line)}
.l18-table thead th{font-weight:400;color:var(--text-muted);font-size:.76rem}
@media (max-width:700px){.l18-table th:nth-child(2),.l18-table td:nth-child(2){display:none}}

/* final + footer */
.l18-final{display:grid;justify-items:center;text-align:center;gap:28px}
.l18-final .l18-h2{font-size:clamp(2.2rem,5vw,4.4rem)}
.l18-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.76rem;color:var(--text-muted)}
.l18-foot h3{font-family:var(--font-display);font-size:.78rem;font-weight:700;letter-spacing:.12em;color:var(--text-primary);margin-bottom:12px}
.l18-foot ul{display:grid;gap:8px}
.l18-foot a{text-decoration:none}
.l18-foot a:hover{color:var(--text-primary)}
.l18-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.l18-foot{grid-template-columns:1fr 1fr}.l18-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="l18-nav">
  <a class="l18-mark" href="#main">${BRAND.name.toUpperCase()}</a>
  <nav class="l18-links" data-spy aria-label="Sections"><a href="#loss">Loss</a><a href="#bench">Bench</a><a href="#wafer">Wafer</a><a href="#fab">Fab</a><a href="#logs">Logs</a><a href="#rates">Rates</a></nav>
  <span class="l18-nm">λ 1550 nm · streaming</span>
</header>
<main id="main">
  <section class="l18-hero" data-hero aria-labelledby="l18-h">
    <div class="l18-wg" aria-hidden="true"><canvas id="wg"></canvas></div>
    <div class="l18-blk l18-b1" data-id="BLK-A · TITLE"><h1 id="l18-h" data-hero-part="headline">Stream every token.</h1></div>
    <div class="l18-blk l18-b2" data-id="BLK-B · SPEC"><p class="k-body" data-hero-part="sub">Your users see each token the moment it is generated: streaming and tool calls on every model family, every token metered.</p></div>
    <div class="l18-blk l18-b3" data-id="BLK-C · CORE"><div class="core" data-hero-part="visual"><canvas id="core" role="img" aria-label="A photonic core: light packets travel through waveguides; the pointer bends the beam"></canvas></div><p class="io">5 model families · one OpenAI-style request shape</p></div>
    <div class="l18-blk l18-b4" data-id="BLK-D · IO" data-hero-part="cta"><a class="l18-btn" href="#rates" data-cta="primary" data-magnetic="4,0.24,0.6,0.4"><span data-magnetic-label>GET A KEY</span><i aria-hidden="true"></i></a></div>
    <div class="l18-blk l18-b5" data-id="BLK-E · METER"><p class="l18-trust" data-hero-part="trust"><span>Streaming</span><b>on every model</b><span>Swift output from</span><b>${rate(MODELS.find((m) => m.id === "swift").outPrice)} / 1M</b></p></div>
    <div class="l18-blk l18-b6" data-id="BLK-F · BUS" aria-hidden="true"><p class="l18-trust"><span>stream: true</span><span>tools: [...]</span><span>usage → tokens · cost</span></p></div>
  </section>

  <section id="loss" data-section aria-labelledby="l18-l">
    <div class="k-wrap l18-cols">
      <h2 id="l18-l" class="l18-h2" data-reveal>Every hop between providers loses signal.</h2>
      <ul class="l18-loss" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ul>
    </div>
    <div class="l18-run" id="bench">
      <div class="l18-pin">
        <div class="l18-bench"><canvas id="lanes" role="img" aria-label="Two lanes: buffered tokens arrive all at once at the end; streamed tokens arrive as they are generated"></canvas><span class="l18-lab" style="top:12px">LANE A · buffered (copper): the user waits for the whole answer</span><span class="l18-lab" style="top:52%">LANE B · streamed (optical): each token reaches the user as it is generated</span></div>
        <div class="l18-meters" aria-live="polite">
          <div><span>Tokens generated</span><b id="m-gen">0</b></div>
          <div><span>Seen by user · buffered</span><b id="m-a">0</b></div>
          <div><span>Seen by user · streamed</span><b class="live" id="m-b">0</b></div>
          <div><span>Metered so far</span><b id="m-c">$0.0000</b></div>
        </div>
      </div>
    </div>
    <p class="k-wrap l18-fine">A 620-token Core answer at sample output rates; the comparison is illustrative, not a latency benchmark. ${PRICE_NOTE}</p>
  </section>

  <section id="wafer" data-section aria-labelledby="l18-w">
    <div class="k-wrap">
      <h2 id="l18-w" class="l18-h2" data-reveal>The wafer: each die, and what it does for you.</h2>
      <div class="l18-wafer" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="l18-die k-card d${i}" data-spot><p class="tag"><span>DIE ${String(i + 1).padStart(2, "0")}</span><span>${f}</span></p><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="fab" data-section aria-labelledby="l18-f">
    <div data-rail>
      <div data-rail-view>
        <div class="l18-rail-head"><h2 id="l18-f" class="l18-h2" data-reveal>Fabrication: three steps.</h2></div>
        <ol class="l18-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="l18-step k-card"><span class="n">STEP ${i + 1}</span><h3>${t}</h3><p>${d}</p><pre><code>${["model: \"core-128k\"", `baseURL: "${BRAND.apiBase}"\nstream:  true`, "for await (const chunk of stream) render(chunk)"][i]}</code></pre></li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="logs" data-section aria-labelledby="l18-g">
    <div class="k-wrap">
      <h2 id="l18-g" class="l18-h2" data-reveal>Bench logs, by role.</h2>
      <div class="l18-logs" data-stagger>${PROOF.map(([role, focus, q], i) => `<article class="l18-log k-card"><p class="hd"><b>${role.toUpperCase()}</b><span>LOG ${String(i + 1).padStart(3, "0")} · ${focus}</span></p><q>${q}</q></article>`)}</div>
      <p class="l18-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="rates" data-section aria-labelledby="l18-r">
    <div class="k-wrap">
      <h2 id="l18-r" class="l18-h2" data-reveal>Rates, metered per token.</h2>
      <div class="l18-plans" data-stagger>${PLANS.map((p) => h`<article class="l18-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name.toUpperCase()}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="l18-table" data-reveal>
        <caption>PER 1M TOKENS</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">Role</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="l18-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="l18-z">
    <div class="k-wrap l18-final">
      <h2 id="l18-z" class="l18-h2" data-reveal>Turn on the light.</h2>
      <a class="l18-btn" href="#main" data-magnetic="4,0.24,0.6,0.4" data-reveal><span data-magnetic-label>GET A KEY</span><i aria-hidden="true"></i></a>
    </div>
  </section>
</main>
<footer class="l18-foot">
  <div><p class="l18-mark">${BRAND.name.toUpperCase()}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>MODELS</h3><ul>${MODELS.map((m) => `<li><a href="#rates">${m.name}</a></li>`)}</ul></div>
  <div><h3>PLATFORM</h3><ul><li><a href="#bench">Streaming</a></li><li><a href="#fab">API quickstart</a></li><li><a href="#rates">Token rates</a></li></ul></div>
  <div><h3>EXHIBITION</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Syncopate and Space Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;

    // —— hero: waveguides between the floorplan blocks + a photonic core ——
    const hero = $(".l18-hero"), wc = $("#wg"), ws = canvas(wc);
    const blocks = $$(".l18-blk");
    const centre = (el) => { const r = el.getBoundingClientRect(), h = hero.getBoundingClientRect(); return [r.left - h.left + r.width / 2, r.top - h.top + r.height / 2]; };
    const pairs = [[0, 2], [1, 3], [3, 2], [1, 4], [4, 5], [3, 5]];
    loop(wc, (t) => {
      const { ctx, w, h } = ws;
      ctx.clearRect(0, 0, w, h);
      const pts = blocks.map(centre);
      const guides = new Path2D();
      pairs.forEach(([a, b]) => { const [x0, y0] = pts[a], [x1, y1] = pts[b]; guides.moveTo(x0, y0); guides.lineTo((x0 + x1) / 2, y0); guides.lineTo((x0 + x1) / 2, y1); guides.lineTo(x1, y1); });
      ctx.strokeStyle = "rgba(16,185,129,.16)"; ctx.lineWidth = 3; ctx.stroke(guides);
      ctx.strokeStyle = "rgba(16,185,129,.5)"; ctx.lineWidth = 1; ctx.stroke(guides);
      const pk = new Path2D();
      pairs.forEach(([a, b], i) => {
        const [x0, y0] = pts[a], [x1, y1] = pts[b], mx = (x0 + x1) / 2;
        const L1 = Math.abs(mx - x0), L2 = Math.abs(y1 - y0), L3 = Math.abs(x1 - mx), L = L1 + L2 + L3 || 1;
        for (let k = 0; k < 3; k++) {
          let d = (((RM ? 0.5 : t * 0.35) + i * 0.17 + k / 3) % 1) * L, x, y;
          if (d < L1) { x = x0 + Math.sign(mx - x0) * d; y = y0; } else if ((d -= L1) < L2) { x = mx; y = y0 + Math.sign(y1 - y0) * d; } else { d -= L2; x = mx + Math.sign(x1 - mx) * d; y = y1; }
          pk.moveTo(x + 3, y); pk.arc(x, y, 3, 0, TAU);
        }
      });
      ctx.fillStyle = "#6EF0C2"; ctx.fill(pk);
    });
    const cc = $("#core"), cs = canvas(cc);
    loop(cc, (t) => {
      const { ctx, w, h } = cs;
      ctx.clearRect(0, 0, w, h);
      const r = cc.getBoundingClientRect();
      const bend = pointer.active ? clamp((pointer.y - (r.top + r.height / 2)) / r.height, -0.5, 0.5) : Math.sin(t * 0.7) * 0.25;
      // ring resonator + bus waveguides
      const R = Math.min(w, h) * 0.22, cx = w / 2, cy = h / 2;
      ctx.strokeStyle = "rgba(16,185,129,.6)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy - R - 6); ctx.lineTo(w, cy - R - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy + R + 6 + bend * 30); ctx.bezierCurveTo(w * 0.3, cy + R + 6 + bend * 30, w * 0.7, cy + R + 6 - bend * 30, w, cy + R + 6 - bend * 30); ctx.stroke();
      const pk = new Path2D();
      for (let k = 0; k < 10; k++) { const a = (RM ? 0 : t * 2) + (k / 10) * TAU; pk.moveTo(cx + Math.cos(a) * R + 3, cy + Math.sin(a) * R); pk.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 3, 0, TAU); }
      for (let k = 0; k < 6; k++) { const x = (((RM ? 0.3 : t * 0.3) + k / 6) % 1) * w; pk.moveTo(x + 2.5, cy - R - 6); pk.arc(x, cy - R - 6, 2.5, 0, TAU); }
      ctx.fillStyle = "#6EF0C2"; ctx.fill(pk);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6); g.addColorStop(0, "rgba(16,185,129,.18)"); g.addColorStop(1, "rgba(16,185,129,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    });

    // —— signature: scroll is generation time; compare buffered vs streamed delivery ——
    const run = $("#bench"), lc = $("#lanes"), ls = canvas(lc);
    const TOTAL = 620, core = AE.MODELS[0];
    const m = { gen: $("#m-gen"), a: $("#m-a"), b: $("#m-b"), c: $("#m-c") };
    let p = 0;
    onScroll(() => {
      p = RM ? 1 : clamp((progress(run) - 0.05) / 0.85);
      const gen = Math.round(p * TOTAL);
      m.gen.textContent = gen; m.a.textContent = p >= 0.999 ? TOTAL : 0; m.b.textContent = gen;
      m.c.textContent = "$" + ((gen * core.outPrice) / 1e6).toFixed(4);
    });
    loop(lc, (t) => {
      const { ctx, w, h } = ls;
      ctx.clearRect(0, 0, w, h);
      const lanes = [h * 0.3, h * 0.78], gx = Math.max(60, w * 0.12), ux = w - 70;
      lanes.forEach((y, i) => {
        ctx.strokeStyle = i ? "rgba(16,185,129,.55)" : "rgba(184,115,51,.55)"; ctx.lineWidth = i ? 2 : 6;
        ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(ux, y); ctx.stroke();
        // model (source) and user (sink)
        ctx.fillStyle = "#12151E"; ctx.strokeStyle = "rgba(232,236,242,.5)"; ctx.lineWidth = 1;
        ctx.fillRect(gx - 50, y - 22, 64, 44); ctx.strokeRect(gx - 50, y - 22, 64, 44);
        ctx.fillRect(ux - 10, y - 22, 64, 44); ctx.strokeRect(ux - 10, y - 22, 64, 44);
        ctx.fillStyle = "#96A0AE"; ctx.font = '11px "Space Mono", monospace';
        ctx.fillText("MODEL", gx - 42, y + 4); ctx.fillText("USER", ux + 4, y + 4);
      });
      const gen = p * TOTAL, pk = new Path2D(), buf = new Path2D();
      // lane B: each generated token flies to the user immediately
      const N = 40;
      for (let k = 0; k < N; k++) {
        const born = (k / N) * TOTAL;
        if (born > gen) break;
        const age = (gen - born) / (TOTAL / N) * 0.1 + ((RM ? 0 : t * 0.6) % 0.05);
        const x = lerp(gx + 20, ux - 14, Math.min(1, age));
        if (age < 1) { pk.moveTo(x + 4, lanes[1]); pk.arc(x, lanes[1], 4, 0, TAU); }
      }
      // lane A: tokens pile up in a buffer, then release together at the end
      const piled = Math.min(N, Math.round((gen / TOTAL) * N));
      for (let k = 0; k < piled; k++) { const x = gx + 24 + (k % 10) * 7, y = lanes[0] - 14 + Math.floor(k / 10) * 7; buf.rect(x, y, 5, 5); }
      if (p >= 0.999) for (let k = 0; k < N; k++) { const x = ux - 30 - (k % 10) * 6; buf.rect(x, lanes[0] - 14 + Math.floor(k / 10) * 7, 4, 4); }
      ctx.fillStyle = "#6EF0C2"; ctx.fill(pk);
      ctx.fillStyle = "#D08A4E"; ctx.fill(buf);
      // user progress bars
      ctx.fillStyle = "rgba(232,236,242,.12)"; ctx.fillRect(ux + 60, lanes[0] - 4, 8, 8 + 0); ctx.fillRect(ux + 60, lanes[1] - 4, 8, 8);
    });
  }),
};
