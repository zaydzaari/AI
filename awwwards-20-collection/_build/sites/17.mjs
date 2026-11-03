import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, usd } from "../aether.mjs";

const STYLE = "Obsidian Roasters";
const CORE = MODELS[0];
// A 20-request session: history grows, and the cached share of each prompt warms up.
const SESSION = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1, inTok = 4000 + 800 * n, s = Math.min(0.92, 1 - Math.pow(0.82, n - 1));
  const cached = (inTok * (1 - s) * CORE.inPrice + inTok * s * CORE.cached + 600 * CORE.outPrice) / 1e6;
  const fresh = (inTok * CORE.inPrice + 600 * CORE.outPrice) / 1e6;
  return { n, inTok, s, cached, fresh };
});
const SAVED = SESSION.reduce((a, r) => a + r.fresh - r.cached, 0);
const SPENT = SESSION.reduce((a, r) => a + r.cached, 0);

export default {
  title: "Aether — Full price once, then cached.",
  description: "Prompt caching on every model: repeated prefixes are billed at the cached rate automatically, and the saving grows through the session. Obsidian Roasters design direction.",
  fonts: [
    { family: "Gloock" },
    { family: "JetBrains Mono", axes: "wght@400;500" },
  ],
  tokens: {
    bgPrimary: "#100D0C", bgSecondary: "#1E1916", accent: "#EA580C", onAccent: "#140A04",
    textPrimary: "#F2E8DF", textMuted: "#AE9F92", line: "rgba(242,232,223,.12)",
    display: '"Gloock", Georgia, serif', body: '"JetBrains Mono", ui-monospace, monospace',
  },
  css: /* css */ `
:root{--h1-weight:400}
.r17-nav{position:sticky;top:0;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:#100D0Cf0;border-bottom:1px solid var(--line);font-size:.76rem}
.r17-mark{font-family:var(--font-display);font-size:1.4rem;text-decoration:none}
.r17-links{display:flex;gap:20px}
.r17-links a{text-decoration:none;color:var(--text-muted);padding:4px 0;border-bottom:2px solid transparent}
.r17-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.r17-lot{color:var(--text-muted)}
@media (max-width:900px){.r17-links{display:none}}
.r17-btn{display:inline-flex;align-items:center;gap:12px;min-height:56px;padding:0 28px;border-radius:4px;background:var(--accent);color:var(--on-accent);font-family:var(--font-body);font-weight:500;font-size:.92rem;text-decoration:none;box-shadow:0 0 0 1px #EA580C,0 14px 30px -14px rgba(0,0,0,.32);transition:box-shadow .4s}
.r17-btn i{width:10px;height:10px;border-radius:50%;background:#140A04;box-shadow:0 0 0 3px #140A0433;transition:transform .5s var(--ease)}
.r17-btn.is-near i{transform:scale(1.4)}
.r17-h2{font-size:clamp(2.6rem,5vw,4.6rem);font-weight:400;letter-spacing:-.02em;line-height:1;max-width:16ch}
.r17-fine{margin-top:22px;font-size:.76rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: chart-as-hero */
.r17-hero{position:relative;min-height:calc(100svh - 60px);display:grid;grid-template-columns:64px 1fr;grid-template-rows:1fr 34px;padding:24px var(--gutter) 16px}
.r17-yaxis{grid-row:1;display:flex;flex-direction:column;justify-content:space-between;font-size:.6875rem;color:var(--text-muted);padding:8px 10px 8px 0;text-align:right;border-right:1px solid var(--line)}
.r17-plot{position:relative;grid-row:1;grid-column:2;border-bottom:1px solid var(--line);background:repeating-linear-gradient(0deg,#F2E8DF08 0 1px,transparent 1px 25%),repeating-linear-gradient(90deg,#F2E8DF08 0 1px,transparent 1px 10%)}
.r17-plot canvas{position:absolute;inset:0;width:100%;height:100%}
.r17-xaxis{grid-row:2;grid-column:2;display:flex;justify-content:space-between;align-items:center;font-size:.6875rem;color:var(--text-muted)}
.r17-in{position:absolute;left:clamp(16px,4vw,56px);top:clamp(16px,5vh,48px);display:grid;gap:18px;justify-items:start;max-width:min(680px,90%);z-index:2}
.r17-in h1{text-shadow:0 2px 30px #100D0C}
.r17-in .k-body{color:var(--text-muted);max-width:46ch;background:#100D0Cb3}
.r17-cross{position:absolute;right:16px;bottom:16px;z-index:2;font-size:.76rem;color:var(--text-muted);background:#1E1916;border:1px solid var(--line);padding:10px 14px;display:grid;gap:4px}
.r17-cross b{color:var(--text-primary);font-weight:500}
@media (max-width:860px){
  .r17-hero{grid-template-columns:34px 1fr;padding:12px var(--gutter) 10px}
  .r17-yaxis{font-size:.6875rem;padding-right:4px}
  .r17-in{left:12px;top:12px;gap:12px}
  .r17-cross{left:12px;right:auto;bottom:10px;padding:8px 10px}
}

/* problem */
.r17-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.r17-defects{display:grid;border-top:1px solid var(--line)}
.r17-defects li{display:grid;grid-template-columns:110px 1fr;gap:4px 18px;padding:20px 0;border-bottom:1px solid var(--line)}
.r17-defects .d{grid-row:span 2;font-size:.76rem;color:var(--text-muted)}
.r17-defects .was{color:var(--text-muted);font-size:.86rem}
.r17-defects .now{font-family:var(--font-display);font-size:1.4rem;line-height:1.2}
@media (max-width:900px){.r17-cols{grid-template-columns:1fr;gap:40px}}

/* signature: the roast profile */
.r17-run{height:440vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.r17-pin{position:sticky;top:60px;height:calc(100vh - 60px);display:grid;grid-template-columns:minmax(0,1.6fr) minmax(280px,1fr);gap:32px;padding:24px var(--gutter)}
.r17-chart{position:relative;border:1px solid var(--line);background:#130F0E}
.r17-chart canvas{position:absolute;inset:0;width:100%;height:100%}
.r17-legend{position:absolute;left:16px;top:12px;display:flex;gap:16px;font-size:.76rem;color:var(--text-muted)}
.r17-legend i{display:inline-block;width:18px;height:2px;vertical-align:middle;margin-right:6px}
.r17-notes{display:grid;align-content:center;gap:14px}
.r17-phase{display:grid;gap:6px;border-left:1px solid var(--accent);padding-left:14px}
.r17-phase span{font-size:.76rem;color:var(--text-muted)}
.r17-phase b{font-family:var(--font-display);font-weight:400;font-size:clamp(2rem,3.6vw,3rem);line-height:1}
.r17-phase p{font-size:.86rem;color:var(--text-muted)}
.r17-nums{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.r17-nums div{background:var(--bg-primary);padding:12px;display:grid;gap:2px}
.r17-nums span{font-size:.6875rem;color:var(--text-muted)}
.r17-nums b{font-family:var(--font-display);font-weight:400;font-size:1.6rem;font-variant-numeric:tabular-nums}
@media (max-width:900px){
  .r17-run{height:400vh}
  .r17-pin{grid-template-columns:1fr;grid-template-rows:1fr auto;gap:10px;padding:12px var(--gutter)}
  .r17-phase p{display:none}
  .r17-phase b{font-size:1.6rem}
  .r17-nums b{font-size:1.2rem}
}
@media (prefers-reduced-motion:reduce){.r17-run{height:auto}.r17-pin{position:relative;height:100vh}}

/* bento: the menu */
.r17-menu{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.r17-item{position:relative;isolation:isolate;overflow:hidden;background:var(--bg-secondary);border:1px solid var(--line);display:grid;gap:12px;align-content:start;min-height:240px}
.r17-item::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(260px circle at var(--mx) var(--my),rgba(123,123,123,0.073),transparent 65%);opacity:0;transition:opacity .3s}
.r17-item:hover::before{opacity:1}
.r17-item .tag{display:flex;justify-content:space-between;font-size:.76rem;color:var(--text-muted)}
.r17-item h3{font-family:var(--font-display);font-weight:400;font-size:1.6rem;line-height:1.12}
.r17-item p{font-size:.84rem;color:var(--text-muted)}
.r17-item.i0{grid-column:span 2;grid-row:span 2}.r17-item.i0 h3{font-size:clamp(2.2rem,3.6vw,3.2rem)}
@media (max-width:900px){.r17-menu{grid-template-columns:1fr}.r17-item{grid-column:auto!important;grid-row:auto!important;min-height:0}}

/* rail */
.r17-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.r17-steps{padding:0 var(--gutter);gap:12px}
.r17-step{width:min(540px,50vw);background:var(--bg-secondary);border:1px solid var(--line);display:grid;gap:12px;align-content:start}
.r17-step.is-active{border-color:#EA580C88}
.r17-step .n{font-family:var(--font-display);font-size:3rem;line-height:1;color:var(--text-muted)}
.r17-step.is-active .n{color:var(--text-primary)}
.r17-step h3{font-family:var(--font-display);font-weight:400;font-size:1.7rem;line-height:1.1}
.r17-step p{color:var(--text-muted);font-size:.86rem}
.r17-step pre{margin:0;background:#100D0C;border:1px solid var(--line);padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.r17-step{width:auto}}

/* cupping notes */
.r17-cup{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.r17-c{border:1px solid var(--line);display:grid;gap:12px;background:linear-gradient(#1E1916,#161210)}
.r17-c .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.76rem;color:var(--text-muted)}
.r17-c b{font-family:var(--font-display);font-weight:400;font-size:1.3rem;color:var(--text-primary)}
.r17-c q{font-size:.9rem;line-height:1.6;quotes:"“" "”"}
@media (max-width:760px){.r17-cup{grid-template-columns:1fr}}

/* the board */
.r17-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.r17-plan{border:1px solid var(--line);display:grid;gap:12px;align-content:start}
.r17-plan.feat{background:var(--bg-secondary);border-color:#EA580C77}
.r17-plan h3{font-family:var(--font-display);font-weight:400;font-size:1.6rem}
.r17-plan .p{font-family:var(--font-display);font-size:3rem;line-height:1}
.r17-plan .cad{font-size:.76rem;color:var(--text-muted)}
.r17-plan ul{display:grid;gap:6px;font-size:.84rem}
.r17-plan li::before{content:"· ";color:var(--accent)}
.r17-plan .fk{font-size:.78rem;border-top:1px dashed var(--line);padding-top:12px}
@media (max-width:900px){.r17-plans{grid-template-columns:1fr}}
.r17-board{margin-top:32px;display:grid;border-top:1px solid var(--line)}
.r17-board p{display:grid;grid-template-columns:1.2fr 2fr 1fr 1fr 1fr;gap:16px;padding:12px 0;border-bottom:1px solid var(--line);font-size:.82rem;color:var(--text-muted)}
.r17-board b{font-family:var(--font-display);font-weight:400;font-size:1.2rem;color:var(--text-primary)}
@media (max-width:760px){.r17-board p{grid-template-columns:1fr 1fr 1fr}.r17-board p span:nth-child(2){display:none}.r17-board p span:nth-child(4){display:none}}

/* final + footer */
.r17-final{display:grid;justify-items:center;text-align:center;gap:28px}
.r17-final .r17-h2{font-size:clamp(3rem,6.4vw,5.6rem)}
.r17-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.78rem;color:var(--text-muted)}
.r17-foot h3{font-family:var(--font-display);font-weight:400;font-size:1.1rem;color:var(--text-primary);margin-bottom:12px}
.r17-foot ul{display:grid;gap:8px}
.r17-foot a{text-decoration:none}
.r17-foot a:hover{color:var(--text-primary)}
.r17-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.r17-foot{grid-template-columns:1fr 1fr}.r17-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="r17-nav">
  <a class="r17-mark" href="#main">${BRAND.name}</a>
  <nav class="r17-links" data-spy aria-label="Sections"><a href="#defects">Defects</a><a href="#profile">Profile</a><a href="#menu">Menu</a><a href="#brew">Brew</a><a href="#cupping">Cupping</a><a href="#board">Board</a></nav>
  <span class="r17-lot">Lot 017 · prompt caching</span>
</header>
<main id="main">
  <section class="r17-hero" data-hero aria-labelledby="r17-h">
    <div class="r17-yaxis" aria-hidden="true"><span>$0.014</span><span>$0.0105</span><span>$0.007</span><span>$0.0035</span><span>$0</span></div>
    <div class="r17-plot" data-hero-part="visual">
      <canvas id="hplot" role="img" aria-label="Cost per request across a 20-request session, with and without caching; hover to read a point"></canvas>
      <div class="r17-in">
        <h1 id="r17-h" data-hero-part="headline">Full price once, then cached.</h1>
        <p class="k-body" data-hero-part="sub">Prompt caching on every model: repeated prefixes are billed at the cached rate automatically, so a long session gets cheaper with every request.</p>
        <div data-hero-part="cta"><a class="r17-btn" href="#board" data-cta="primary" data-magnetic="5,0.16,0.74,0.4"><i aria-hidden="true"></i><span data-magnetic-label>Get your API key</span></a></div>
      </div>
      <p class="r17-cross" data-hero-part="trust" aria-live="polite"><span id="cross">Request 20 · <b>${usd(SESSION[19].cached)}</b> cached vs <b>${usd(SESSION[19].fresh)}</b> uncached</span><span>20-request Core session, sample rates</span></p>
    </div>
    <div class="r17-xaxis" aria-hidden="true">${[1, 5, 10, 15, 20].map((n) => `<span>req ${n}</span>`)}</div>
  </section>

  <section id="defects" data-section aria-labelledby="r17-d">
    <div class="k-wrap r17-cols">
      <h2 id="r17-d" class="r17-h2" data-reveal>Most AI bills are roasted the same, every time.</h2>
      <ol class="r17-defects" data-stagger>${PROBLEM.rows.map(([was, now], i) => `<li><span class="d">Defect ${i + 1}</span><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ol>
    </div>
    <div class="r17-run" id="profile">
      <div class="r17-pin">
        <div class="r17-chart"><canvas id="sig" role="img" aria-label="The roast profile of a session: drying, Maillard, first crack, development"></canvas><p class="r17-legend" aria-hidden="true"><span><i style="background:#EA580C"></i>with caching</span><span><i style="background:#AE9F92"></i>without</span></p></div>
        <div class="r17-notes" aria-live="polite">
          <div class="r17-phase"><span id="ph-t">Phase 1 · requests 1–3</span><b id="ph-n">Drying</b><p id="ph-d">The first call pays full price and writes the prefix to the cache.</p></div>
          <div class="r17-nums"><div><span>Request</span><b id="n-req">1</b></div><div><span>Cached share</span><b id="n-share">0%</b></div><div><span>Spent so far</span><b class="live" id="n-spent">$0.000</b></div><div><span>Saved so far</span><b id="n-saved">$0.000</b></div></div>
          <p class="r17-fine">Session total: ${usd(SPENT)} spent, ${usd(SAVED)} saved against no caching. ${PRICE_NOTE}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="menu" data-section aria-labelledby="r17-m">
    <div class="k-wrap">
      <h2 id="r17-m" class="r17-h2" data-reveal>The menu, and what each cup does for you.</h2>
      <div class="r17-menu" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="r17-item k-card i${i}" data-spot><p class="tag"><span>${f}</span><span>No. ${String(i + 1).padStart(2, "0")}</span></p><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="brew" data-section aria-labelledby="r17-b">
    <div data-rail>
      <div data-rail-view>
        <div class="r17-rail-head"><h2 id="r17-b" class="r17-h2" data-reveal>Brew it in three steps.</h2></div>
        <ol class="r17-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="r17-step k-card"><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p><pre><code>${["model: \"core-128k\"", `baseURL: "${BRAND.apiBase}"`, "usage.cached_tokens  // billed at the cached rate"][i]}</code></pre></li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="cupping" data-section aria-labelledby="r17-c">
    <div class="k-wrap">
      <h2 id="r17-c" class="r17-h2" data-reveal>Cupping notes, by role.</h2>
      <div class="r17-cup" data-stagger>${PROOF.map(([role, focus, q]) => `<article class="r17-c k-card"><p class="hd"><b>${role}</b><span>${focus}</span></p><q>${q}</q></article>`)}</div>
      <p class="r17-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="board" data-section aria-labelledby="r17-p">
    <div class="k-wrap">
      <h2 id="r17-p" class="r17-h2" data-reveal>The board. Every pour, per token.</h2>
      <div class="r17-plans" data-stagger>${PLANS.map((p) => h`<article class="r17-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <div class="r17-board" data-reveal>${MODELS.map((m) => `<p><b>${m.name}</b><span>${m.role}</span><span>in ${rate(m.inPrice)}</span><span>cached ${rate(m.cached)}</span><span>out ${rate(m.outPrice)}</span></p>`)}</div>
      <p class="r17-fine">Per 1M tokens. ${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="r17-z">
    <div class="k-wrap r17-final">
      <h2 id="r17-z" class="r17-h2" data-reveal>Roast your first session.</h2>
      <a class="r17-btn" href="#main" data-magnetic="5,0.16,0.74,0.4" data-reveal><i aria-hidden="true"></i><span data-magnetic-label>Get your API key</span></a>
    </div>
  </section>
</main>
<footer class="r17-foot">
  <div><p class="r17-mark">${BRAND.name}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Origins</h3><ul>${MODELS.map((m) => `<li><a href="#board">${m.name}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#profile">Prompt caching</a></li><li><a href="#brew">API quickstart</a></li><li><a href="#board">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Gloock and JetBrains Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, clamp, lerp, canvas, loop, onScroll, progress, pointer } = K;
    const C = AE.MODELS[0];
    const S = Array.from({ length: 20 }, (_, i) => {
      const n = i + 1, inTok = 4000 + 800 * n, s = Math.min(0.92, 1 - Math.pow(0.82, n - 1));
      return { n, s, cached: (inTok * (1 - s) * C.inPrice + inTok * s * C.cached + 600 * C.outPrice) / 1e6, fresh: (inTok * C.inPrice + 600 * C.outPrice) / 1e6 };
    });
    const YMAX = 0.014;
    const fmt = (v) => "$" + v.toFixed(v < 0.01 ? 4 : 3);

    // draws both curves up to `upto` (0..20, fractional), with optional phase bands
    function plot(s, upto, { bands = false, hover = -1, pad = 0 } = {}) {
      const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const X = (n) => pad + ((n - 1) / 19) * (w - pad * 2), Y = (v) => h - pad - (v / YMAX) * (h - pad * 2);
      if (bands) {
        [[1, 3.5, "Drying"], [3.5, 8.5, "Maillard"], [8.5, 10.5, "First crack"], [10.5, 20, "Development"]].forEach(([a, b, name], i) => {
          ctx.fillStyle = i % 2 ? "rgba(242,232,223,.03)" : "rgba(242,232,223,.06)"; ctx.fillRect(X(a), 0, X(b) - X(a), h);
          ctx.fillStyle = "rgba(174,159,146,.9)"; ctx.font = '12px "JetBrains Mono", monospace'; ctx.fillText(name, X(a) + 8, 40);
        });
      }
      const line = (key, col, wdt) => {
        ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.lineJoin = "round"; ctx.beginPath();
        const last = Math.floor(upto);
        for (let i = 0; i < last && i < 20; i++) { const x = X(i + 1), y = Y(S[i][key]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        if (last < 20 && last >= 1) { const f = upto - last, a = S[last - 1], b = S[last]; ctx.lineTo(lerp(X(last), X(last + 1), f), lerp(Y(a[key]), Y(b[key]), f)); }
        ctx.stroke();
      };
      // savings area between the curves
      ctx.fillStyle = "rgba(234,88,12,.12)"; ctx.beginPath();
      const last = Math.min(20, Math.floor(upto));
      for (let i = 0; i < last; i++) { const x = X(i + 1); i ? ctx.lineTo(x, Y(S[i].fresh)) : ctx.moveTo(x, Y(S[i].fresh)); }
      for (let i = last - 1; i >= 0; i--) ctx.lineTo(X(i + 1), Y(S[i].cached));
      ctx.closePath(); ctx.fill();
      line("fresh", "rgba(174,159,146,.8)", 1.5);
      line("cached", "#EA580C", 2.6);
      const k = Math.max(1, Math.min(20, Math.round(hover >= 0 ? hover : upto)));
      const px = X(k), py = Y(S[k - 1].cached);
      ctx.fillStyle = "#EA580C"; ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
      if (hover >= 0) { ctx.strokeStyle = "rgba(242,232,223,.3)"; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke(); ctx.setLineDash([]); }
      return k;
    }

    // hero: the curve draws itself, then follows the pointer
    const hc = $("#hplot"), hs = canvas(hc), cross = $("#cross"), t0 = performance.now();
    let shown = -1;
    loop(hc, () => {
      const r = hc.getBoundingClientRect();
      const inside = pointer.active && pointer.x > r.left && pointer.x < r.right && pointer.y > r.top && pointer.y < r.bottom;
      const hover = inside ? 1 + clamp((pointer.x - r.left) / r.width) * 19 : -1;
      const upto = RM ? 20 : Math.min(20, 1 + ((performance.now() - t0) / 2200) * 19);
      const k = plot(hs, upto, { hover, pad: 0 });
      if (k !== shown) { shown = k; cross.innerHTML = "Request " + k + " · <b>" + fmt(S[k - 1].cached) + "</b> cached vs <b>" + fmt(S[k - 1].fresh) + "</b> uncached"; }
    });

    // signature: scroll is roast time
    const run = $("#profile"), sc = $("#sig"), ss = canvas(sc);
    const PH = [["Phase 1 · requests 1–3", "Drying", "The first call pays full price and writes the prefix to the cache."], ["Phase 2 · requests 4–8", "Maillard", "The prefix repeats; more of every prompt is served from the cache."], ["Phase 3 · requests 9–10", "First crack", "Three quarters of the input is cached; the curve breaks downward."], ["Phase 4 · requests 11–20", "Development", "Steady state: long prompts, short bills, nothing to configure."]];
    const el = { t: $("#ph-t"), n: $("#ph-n"), d: $("#ph-d"), req: $("#n-req"), share: $("#n-share"), spent: $("#n-spent"), saved: $("#n-saved") };
    let upto = 1;
    onScroll(() => {
      upto = RM ? 20 : 1 + clamp((progress(run) - 0.05) / 0.85) * 19;
      const n = Math.round(upto), ph = n <= 3 ? 0 : n <= 8 ? 1 : n <= 10 ? 2 : 3;
      el.t.textContent = PH[ph][0]; el.n.textContent = PH[ph][1]; el.d.textContent = PH[ph][2];
      el.req.textContent = n; el.share.textContent = Math.round(S[n - 1].s * 100) + "%";
      let sp = 0, sv = 0; for (let i = 0; i < n; i++) { sp += S[i].cached; sv += S[i].fresh - S[i].cached; }
      el.spent.textContent = fmt(sp); el.saved.textContent = fmt(sv);
    });
    loop(sc, () => plot(ss, upto, { bands: true, pad: 28 }));
  }),
};
