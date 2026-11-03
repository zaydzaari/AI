import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Veridian";
const M = Object.fromEntries(MODELS.map((m) => [m.id, m]));
const SPECIMENS = [
  ["Autocomplete", "swift", 180, 24, 0, "Inline suggestions while a user types."],
  ["Support reply", "core", 1200, 300, 0.6, "A cached system prompt answers a ticket."],
  ["Fiction scene", "unbound", 900, 700, 0, "A dark chapter, written without lectures."],
  ["Code review", "forge", 12000, 1100, 0.7, "Forge reads a pull request and comments."],
  ["Contract search", "atlas", 220000, 800, 0.9, "Every renewal date across 40 files."],
  ["Data extraction", "swift", 3000, 200, 0.5, "Names and amounts pulled into JSON."],
  ["Research summary", "core", 18000, 900, 0.4, "Twelve papers condensed into one page."],
  ["Red-team probe", "unbound", 600, 400, 0, "A refusal-free test of your own guardrails."],
  ["Agent bug fix", "forge", 48000, 3000, 0.8, "Plan, edit, test: a reviewed diff."],
].map(([name, id, inTok, outTok, cached, note], i) => ({ i, name, m: M[id], inTok, outTok, cached, note, usd: usd(cost(M[id], inTok, outTok, cached)) }));

export default {
  title: "Aether — One request grows a whole product",
  description: "Start with a single API call and grow into chat, agents and long-context work on the same key, billed per token. Veridian design direction.",
  fonts: [
    { family: "Literata", axes: "ital,opsz,wght@0,7..72,300..700;1,7..72,300..700" },
    { family: "Albert Sans", axes: "wght@400;500;600" },
  ],
  tokens: {
    bgPrimary: "#ECF1EF", bgSecondary: "#DCE5E1", accent: "#1B4D3E", onAccent: "#FFFFFF",
    textPrimary: "#1F2620", textMuted: "#535C55", line: "rgba(31,38,32,.16)",
    display: '"Literata", Georgia, serif', body: '"Albert Sans", sans-serif',
  },
  css: /* css */ `
h1,.v4-h2{font-variation-settings:"opsz" 144,"SOFT" 30}
.v4-nav{position:sticky;top:0;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:#ECF1EFee;backdrop-filter:blur(10px);border-bottom:1px solid var(--line);font-size:.88rem}
.v4-mark{font-family:var(--font-display);font-size:1.35rem;font-style:italic;text-decoration:none}
.v4-links{display:flex;gap:22px}
.v4-links a{text-decoration:none;color:var(--text-muted);padding:4px 0;border-bottom:2px solid transparent}
.v4-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.v4-plate-no{color:var(--text-muted);font-size:.8rem}
@media (max-width:860px){.v4-links{display:none}}
.v4-btn{display:inline-flex;align-items:center;gap:12px;min-height:54px;padding:0 28px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-weight:600;text-decoration:none;transition:box-shadow .4s var(--ease)}
.v4-btn.is-near{box-shadow:0 0 0 6px #1B4D3E1f}
.v4-btn i{width:8px;height:8px;border-radius:50%;background:#B9E0C9}
.v4-h2{font-size:clamp(2.4rem,4.6vw,4.2rem);font-weight:380;letter-spacing:-.025em;line-height:1.02;max-width:18ch}
.v4-fine{margin-top:22px;font-size:.8rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: specimen plate */
.v4-hero{position:relative;min-height:calc(100svh - 60px);display:grid;place-items:center;padding:28px var(--gutter);overflow:clip}
.v4-hero canvas{position:absolute;inset:0;width:100%;height:100%}
.v4-plate{position:relative;z-index:2;width:min(880px,100%);background:#F8FBFA;border:1px solid var(--text-primary);outline:1px solid var(--text-primary);outline-offset:6px;padding:clamp(28px,5vh,56px) clamp(24px,5vw,64px);display:grid;justify-items:center;text-align:center;gap:20px;box-shadow:0 40px 80px -60px #1F262066}
.v4-plate .lbl{display:flex;justify-content:space-between;width:100%;font-size:.76rem;color:var(--text-muted);border-bottom:1px solid var(--line);padding-bottom:10px}
.v4-plate h1{font-weight:360;max-width:14ch}
.v4-plate h1 em{font-weight:300}
.v4-plate .k-body{color:var(--text-muted);max-width:52ch}
.v4-trust{font-size:.86rem;color:var(--text-muted);display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap}
.v4-trust b{color:var(--text-primary);font-weight:600}
@media (max-width:760px){
  .v4-hero{padding:16px var(--gutter);place-items:start center}
  .v4-plate{gap:12px;padding:20px 18px;outline-offset:4px}
  .v4-plate .lbl span:last-child{display:none}
}

/* problem */
.v4-intro{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.v4-obs{display:grid;gap:14px}
.v4-obs li{display:grid;grid-template-columns:auto 1fr;gap:4px 18px;padding:22px 26px;border-radius:4px;background:#F8FBFA;border:1px solid var(--line)}
.v4-obs .fig{grid-row:span 2;font-family:var(--font-display);font-style:italic;font-size:1.4rem;color:var(--text-muted)}
.v4-obs .was{color:var(--text-muted);font-size:.95rem}
.v4-obs .now{font-family:var(--font-display);font-size:1.35rem;line-height:1.25}
@media (max-width:900px){.v4-intro{grid-template-columns:1fr;gap:40px}}

/* signature: grown network of receipts */
.v4-colony{position:relative;margin-top:clamp(64px,6vw,80px)}
.v4-colony canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.v4-cards{position:relative;display:grid;gap:clamp(48px,9vh,96px);padding:40px 0 80px}
.v4-rcpt{position:relative;width:min(420px,86%);background:#F8FBFAe8;border:1px solid var(--text-primary);display:grid;gap:10px;backdrop-filter:blur(2px)}
.v4-rcpt:nth-child(3n+1){justify-self:start;margin-left:6%}
.v4-rcpt:nth-child(3n+2){justify-self:center}
.v4-rcpt:nth-child(3n){justify-self:end;margin-right:6%}
.v4-rcpt .no{display:flex;justify-content:space-between;font-size:.76rem;color:var(--text-muted);border-bottom:1px dashed var(--line);padding-bottom:8px}
.v4-rcpt h3{font-family:var(--font-display);font-size:1.6rem;font-weight:400;line-height:1.1}
.v4-rcpt p{font-size:.9rem;color:var(--text-muted)}
.v4-rcpt dl{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;border-top:1px solid var(--line);padding-top:10px;font-size:.8rem}
.v4-rcpt dt{color:var(--text-muted);font-size:.76rem}
.v4-rcpt dd{margin:0;font-weight:600;font-variant-numeric:tabular-nums}
.v4-rcpt.grown{border-color:var(--accent);box-shadow:0 0 0 3px #1B4D3E14}
.v4-count{position:sticky;top:76px;z-index:3;margin:0 0 0 auto;width:max-content;display:flex;gap:16px;align-items:center;padding:10px 18px;border-radius:999px;background:#ECF1EFf0;border:1px solid var(--line);font-size:.84rem;margin-right:var(--gutter)}
@media (max-width:760px){.v4-rcpt{width:100%;margin:0!important;justify-self:stretch!important}.v4-count{top:68px;font-size:.76rem;gap:10px}}

/* bento: field guide */
.v4-guide{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.v4-entry{position:relative;isolation:isolate;overflow:hidden;background:var(--bg-secondary);border-radius:4px;display:grid;gap:14px;align-content:start;min-height:280px}
.v4-entry::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(320px circle at var(--mx) var(--my),#F8FBFA,transparent 70%);opacity:0;transition:opacity .3s}
.v4-entry:hover::before{opacity:1}
.v4-entry .latin{font-family:var(--font-display);font-style:italic;font-size:.95rem;color:var(--text-muted)}
.v4-entry h3{font-family:var(--font-display);font-size:1.7rem;font-weight:400;line-height:1.12}
.v4-entry p{font-size:.92rem;color:var(--text-muted)}
.v4-entry.e0{grid-column:span 2;background:var(--text-primary);color:#ECF1EF}
.v4-entry.e0 .latin,.v4-entry.e0 p{color:#C7CEC8}
.v4-entry.e0 h3{font-size:clamp(2rem,3.2vw,2.8rem)}
.v4-entry.e0::before{background:radial-gradient(320px circle at var(--mx) var(--my),#FFFFFF14,transparent 70%)}
.v4-entry.e5{grid-column:1 / -1;min-height:0}
@media (max-width:900px){.v4-guide{grid-template-columns:1fr}.v4-entry.e0,.v4-entry.e5{grid-column:auto}}

/* rail: protocol */
.v4-rail-head{padding:0 var(--gutter);margin-bottom:48px}
.v4-steps{padding:0 var(--gutter);gap:20px}
.v4-step{width:min(560px,52vw);background:#F8FBFA;border:1px solid var(--text-primary);display:grid;gap:14px;align-content:start}
.v4-step .n{font-family:var(--font-display);font-style:italic;font-size:2.6rem;line-height:1;color:var(--text-muted);transition:color .4s}
.v4-step.is-active .n{color:var(--accent)}
.v4-step h3{font-family:var(--font-display);font-size:2rem;font-weight:400;line-height:1.08}
.v4-step p{color:var(--text-muted)}
.v4-step pre{margin:0;background:var(--text-primary);color:#E8EDE9;padding:14px;font-size:.76rem;line-height:1.6;overflow-x:auto;white-space:pre}
@media (max-width:899px){.v4-step{width:auto}}

/* field notes */
.v4-notes{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.v4-note{border-top:3px solid var(--text-primary);background:#F8FBFA;display:grid;gap:16px;align-content:start}
.v4-note q{font-family:var(--font-display);font-size:1.2rem;line-height:1.35;quotes:"“" "”"}
.v4-note p{font-size:.84rem;color:var(--text-muted)}
.v4-note b{display:block;color:var(--text-primary)}
@media (max-width:1000px){.v4-notes{grid-template-columns:1fr 1fr}}
@media (max-width:600px){.v4-notes{grid-template-columns:1fr}}

/* pricing */
.v4-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.v4-plan{border:1px solid var(--text-primary);display:grid;gap:14px;align-content:start;background:#F8FBFA}
.v4-plan.feat{background:var(--bg-secondary)}
.v4-plan h3{font-size:1rem;font-weight:600}
.v4-plan .p{font-family:var(--font-display);font-size:2.8rem;font-weight:380;line-height:1}
.v4-plan .cad{font-size:.82rem;color:var(--text-muted)}
.v4-plan ul{display:grid;gap:6px;font-size:.92rem}
.v4-plan li::before{content:"❧ ";color:var(--text-muted)}
.v4-plan .fk{font-size:.84rem;border-top:1px dashed var(--line);padding-top:12px}
@media (max-width:900px){.v4-plans{grid-template-columns:1fr}}
.v4-table{width:100%;margin-top:40px;border-collapse:collapse;font-variant-numeric:tabular-nums}
.v4-table caption{text-align:left;font-family:var(--font-display);font-size:1.5rem;padding-bottom:12px}
.v4-table th,.v4-table td{text-align:left;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.v4-table thead th{font-weight:500;color:var(--text-muted);font-size:.8rem;border-bottom:1px solid var(--text-primary)}
@media (max-width:700px){.v4-table th:nth-child(2),.v4-table td:nth-child(2){display:none}}

/* final + footer */
.v4-final{display:grid;justify-items:center;text-align:center;gap:28px}
.v4-final .v4-h2{font-size:clamp(2.6rem,5.4vw,4.8rem)}
.v4-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--text-primary);font-size:.86rem;color:var(--text-muted)}
.v4-foot h3{font-size:.8rem;color:var(--text-primary);margin-bottom:12px}
.v4-foot ul{display:grid;gap:8px}
.v4-foot a{text-decoration:none}
.v4-foot a:hover{color:var(--text-primary);text-decoration:underline}
.v4-foot .big{font-family:var(--font-display);font-style:italic;font-size:2.4rem;color:var(--text-primary)}
.v4-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.v4-foot{grid-template-columns:1fr 1fr}.v4-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="v4-nav">
  <a class="v4-mark" href="#main">${BRAND.name}</a>
  <nav class="v4-links" data-spy aria-label="Sections"><a href="#observations">Observations</a><a href="#colony">The colony</a><a href="#guide">Field guide</a><a href="#protocol">Protocol</a><a href="#pricing">Pricing</a></nav>
  <span class="v4-plate-no">Plate I · per-token API</span>
</header>
<main id="main">
  <section class="v4-hero" data-hero aria-labelledby="v4-h">
    <canvas id="hyphae" data-hero-part="visual" role="img" aria-label="A hyphal network growing outward from the plate; it sprouts toward the pointer"></canvas>
    <div class="v4-plate">
      <p class="lbl"><span>Plate I · Specimen 001</span><span>One key, five families</span></p>
      <h1 id="v4-h" data-hero-part="headline">One request grows a whole product.</h1>
      <p class="k-body" data-hero-part="sub">Start with a single call. Add models, temperaments and agents as you grow, with the same key, the same request shape, billed per token.</p>
      <div data-hero-part="cta"><a class="v4-btn" href="#pricing" data-cta="primary" data-magnetic="6,0.12,0.82,0.4"><i aria-hidden="true"></i><span data-magnetic-label>Get your API key</span></a></div>
      <p class="v4-trust" data-hero-part="trust">Specimen 001: <b>212 tokens on Swift</b> cost <b>${usd(cost(M.swift, 180, 32))}</b> at sample rates.</p>
    </div>
  </section>

  <section id="observations" data-section aria-labelledby="v4-o">
    <div class="k-wrap v4-intro">
      <h2 id="v4-o" class="v4-h2" data-reveal>Observations from teams that outgrew their first AI provider.</h2>
      <ol class="v4-obs" data-stagger>
        ${PROBLEM.rows.map(([was, now], i) => `<li><span class="fig">${["i", "ii", "iii"][i]}.</span><span class="was">${was}</span><span class="now">${now}</span></li>`)}
      </ol>
    </div>
    <div class="v4-colony" id="colony">
      <canvas id="colony-cv" aria-hidden="true"></canvas>
      <p class="v4-count" aria-live="polite"><span><b class="live" id="grown">0</b> of 9 receipts reached</span><span>Total <b class="live" id="spent">$0.0000</b></span></p>
      <ol class="v4-cards">
        ${SPECIMENS.map((s) => `<li class="v4-rcpt k-card" data-i="${s.i}"><p class="no"><span>Receipt ${String(s.i + 1).padStart(3, "0")}</span><span>${s.m.id}-${s.m.context.toLowerCase()}</span></p><h3>${s.name}</h3><p>${s.note}</p><dl><div><dt>In</dt><dd>${s.inTok.toLocaleString("en-US")}</dd></div><div><dt>Out</dt><dd>${s.outTok.toLocaleString("en-US")}</dd></div><div><dt>Cost</dt><dd>${s.usd}</dd></div></dl></li>`)}
      </ol>
      <p class="k-wrap v4-fine">Nine example requests at sample rates, with typical caching. ${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="guide" data-section aria-labelledby="v4-g">
    <div class="k-wrap">
      <h2 id="v4-g" class="v4-h2" data-reveal>A field guide to what each feature yields.</h2>
      <div class="v4-guide" data-stagger>
        ${BENEFITS.map(([f, b, d], i) => `<article class="v4-entry k-card e${i}" data-spot><span class="latin">${f}</span><h3>${b}</h3><p>${d}</p></article>`)}
      </div>
    </div>
  </section>

  <section id="protocol" data-section aria-labelledby="v4-p">
    <div data-rail>
      <div data-rail-view>
        <div class="v4-rail-head"><h2 id="v4-p" class="v4-h2" data-reveal>Protocol, in three steps.</h2></div>
        <ol class="v4-steps" data-rail-track>
          ${STEPS.map(([t, d], i) => `<li class="v4-step k-card"><span class="n">${["i", "ii", "iii"][i]}.</span><h3>${t}</h3><p>${d}</p>${i === 1 ? `<pre><code>baseURL: "${BRAND.apiBase}"\nmodel:   "core-128k"</code></pre>` : ""}</li>`)}
        </ol>
      </div>
    </div>
  </section>

  <section id="notes" data-section aria-labelledby="v4-n">
    <div class="k-wrap">
      <h2 id="v4-n" class="v4-h2" data-reveal>Field notes, by role.</h2>
      <div class="v4-notes" data-stagger>
        ${PROOF.map(([role, focus, q]) => `<figure class="v4-note k-card"><q>${q}</q><p><b>${role}</b>${focus}</p></figure>`)}
      </div>
      <p class="v4-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="pricing" data-section aria-labelledby="v4-pr">
    <div class="k-wrap">
      <h2 id="v4-pr" class="v4-h2" data-reveal>Pay for what grows, one token at a time.</h2>
      <div class="v4-plans" data-stagger>
        ${PLANS.map((p) => h`<article class="v4-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}
      </div>
      <table class="v4-table" data-reveal>
        <caption>Rates per 1M tokens</caption>
        <thead><tr><th scope="col">Family</th><th scope="col">Best for</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="v4-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="v4-f">
    <div class="k-wrap v4-final">
      <h2 id="v4-f" class="v4-h2" data-reveal>Plant your first request today.</h2>
      <p class="k-body k-muted" data-reveal>Everything you saw above runs on one key. Start small; the network grows with you.</p>
      <a class="v4-btn" href="#main" data-magnetic="6,0.12,0.82,0.4" data-reveal><i aria-hidden="true"></i><span data-magnetic-label>Get your API key</span></a>
    </div>
  </section>
</main>
<footer class="v4-foot">
  <div><p class="big">${BRAND.name}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Families</h3><ul>${MODELS.map((m) => `<li><a href="#pricing">${m.name}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#colony">Use cases</a></li><li><a href="#protocol">API quickstart</a></li><li><a href="#pricing">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Literata and Albert Sans.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;
    const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    // —— hero: hyphae grow outward from the plate, and sprout toward the pointer ——
    const cv = $("#hyphae"), plate = $(".v4-plate");
    let s = null, tips = [], segs = [], born = performance.now();
    s = canvas(cv, () => s && seed());
    function seed() {
      const r = rng(7), w = s.w, h = s.h;
      const pr = plate.getBoundingClientRect(), cr = cv.getBoundingClientRect();
      const L = pr.left - cr.left, T = pr.top - cr.top, R = L + pr.width, B = T + pr.height;
      tips = []; segs = [];
      for (let i = 0; i < 46; i++) {
        const side = i % 4, u = r();
        const x = side === 0 ? L + u * pr.width : side === 1 ? R : side === 2 ? L + u * pr.width : L;
        const y = side === 0 ? T : side === 1 ? T + u * pr.height : side === 2 ? B : T + u * pr.height;
        const a = [-Math.PI / 2, 0, Math.PI / 2, Math.PI][side] + (r() - 0.5) * 0.9;
        tips.push({ x, y, a, life: 60 + r() * 90, w: 1.2 });
      }
      s.box = { L, T, R, B, w, h };
      born = performance.now();
      s.ctx.clearRect(0, 0, w, h);
    }
    seed();
    const grow = (r, limit) => {
      const { ctx } = s, { L, T, R, B, w, h } = s.box;
      for (let n = 0; n < limit && tips.length; n++) {
        const t = tips[(Math.random() * tips.length) | 0];
        const nx = t.x + Math.cos(t.a) * 3.2, ny = t.y + Math.sin(t.a) * 3.2;
        const inside = nx > L && nx < R && ny > T && ny < B;
        if (t.life-- <= 0 || nx < 0 || ny < 0 || nx > w || ny > h || inside) { tips.splice(tips.indexOf(t), 1); continue; }
        ctx.strokeStyle = `rgba(83,92,85,${0.16 + t.w * 0.18})`; ctx.lineWidth = t.w;
        ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(nx, ny); ctx.stroke();
        t.x = nx; t.y = ny; t.a += (Math.random() - 0.5) * 0.5;
        if (Math.random() < 0.035 && tips.length < 260) tips.push({ x: t.x, y: t.y, a: t.a + (Math.random() < 0.5 ? 0.7 : -0.7), life: t.life * 0.7, w: Math.max(0.5, t.w * 0.75) });
        if (Math.random() < 0.01) { ctx.fillStyle = "rgba(27,77,62,.55)"; ctx.beginPath(); ctx.arc(t.x, t.y, 1.8, 0, TAU); ctx.fill(); }
      }
    };
    let lastSprout = 0;
    loop(cv, (time) => {
      if (RM) { for (let i = 0; i < 40; i++) grow(null, 200); return; }
      grow(null, performance.now() - born < 4000 ? 90 : 14);
      if (pointer.active && time - lastSprout > 0.25) {
        lastSprout = time;
        const cr = cv.getBoundingClientRect(), px = pointer.x - cr.left, py = pointer.y - cr.top;
        const { L, T, R, B } = s.box;
        if (px > 0 && py > 0 && px < s.w && py < s.h && !(px > L && px < R && py > T && py < B)) {
          const ex = Math.max(L, Math.min(R, px)), ey = Math.max(T, Math.min(B, py));
          tips.push({ x: ex, y: ey, a: Math.atan2(py - ey, px - ex), life: 40, w: 1 });
        }
      }
    });

    // —— signature: a colony grows down the page and reaches each receipt ——
    const colony = $("#colony"), ccv = $("#colony-cv"), cards = $$(".v4-rcpt");
    let cs = null, net = [], drawn = 0, front = 0;
    cs = canvas(ccv, () => cs && build());
    function build() {
      const r = rng(42), cr = ccv.getBoundingClientRect();
      const anchors = cards.map((c) => { const b = c.getBoundingClientRect(); return { x: b.left - cr.left + b.width * (0.2 + r() * 0.6), y: b.top - cr.top + b.height / 2 }; });
      net = [];
      let prev = { x: cs.w * 0.5, y: 0 };
      anchors.forEach((a, i) => {
        // trunk from previous anchor to this one, wandering
        let x = prev.x, y = prev.y;
        const steps = Math.max(12, Math.round(Math.hypot(a.x - x, a.y - y) / 9));
        for (let k = 1; k <= steps; k++) {
          const t = k / steps, nx = prev.x + (a.x - prev.x) * t + Math.sin(t * 9 + i) * 26 * (1 - Math.abs(t - 0.5) * 2), ny = prev.y + (a.y - prev.y) * t;
          net.push({ x0: x, y0: y, x1: nx, y1: ny, w: 2.2, card: k === steps ? i : -1 });
          // side branches
          if (r() < 0.32) {
            let bx = nx, by = ny, ba = (r() < 0.5 ? 0 : Math.PI) + (r() - 0.5) * 0.8;
            for (let j = 0; j < 6 + r() * 14; j++) { const ex = bx + Math.cos(ba) * 8, ey = by + Math.sin(ba) * 8 + 2; net.push({ x0: bx, y0: by, x1: ex, y1: ey, w: 0.8, card: -1 }); bx = ex; by = ey; ba += (r() - 0.5) * 0.7; }
          }
          x = nx; y = ny;
        }
        prev = a;
      });
      net.sort((a, b) => a.y0 - b.y0);
      drawn = 0; cs.ctx.clearRect(0, 0, cs.w, cs.h);
      paint();
    }
    const grownEl = $("#grown"), spentEl = $("#spent");
    const costs = cards.map((c) => parseFloat(c.querySelector("dd:last-child").textContent.replace("$", "")));
    function paint() {
      const { ctx } = cs;
      while (drawn < net.length && net[drawn].y0 <= front) {
        const g = net[drawn++];
        ctx.strokeStyle = g.w > 1 ? "rgba(27,77,62,.55)" : "rgba(83,92,85,.35)"; ctx.lineWidth = g.w; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(g.x0, g.y0); ctx.lineTo(g.x1, g.y1); ctx.stroke();
      }
      let reached = 0, spent = 0;
      cards.forEach((c, i) => { const r = c.offsetTop + c.offsetHeight / 2 + c.parentElement.offsetTop; const on = front >= r - 10; c.classList.toggle("grown", on); if (on) { reached++; spent += costs[i]; } });
      grownEl.textContent = reached; spentEl.textContent = "$" + spent.toFixed(4);
    }
    build();
    onScroll(() => {
      const r = colony.getBoundingClientRect();
      const f = RM ? cs.h : Math.max(0, innerHeight * 0.72 - r.top);
      if (f > front) { front = f; paint(); }
    });
  }),
};
