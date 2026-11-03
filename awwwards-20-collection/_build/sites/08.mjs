import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate } from "../aether.mjs";

const STYLE = "Terra Vinicola";
const CELLAR = [...MODELS].sort((a, b) => b.outPrice - a.outPrice);
const NOTES = {
  atlas: ["Deep, patient, long finish.", "Whole archives, books and repositories in a single pour."],
  forge: ["Structured, tannic, built to work.", "Multi-file edits, tool calls and long agent loops."],
  unbound: ["Untamed, direct, no softening.", "Fiction, research and red-teaming without refusals."],
  core: ["Balanced, versatile, the house pour.", "Writing, analysis, planning and conversation."],
  swift: ["Bright, quick, light-bodied.", "Routing, extraction and autocomplete at low latency."],
};

export default {
  title: "Aether — Five models, each with its own character",
  description: "A wine-list approach to AI models: every family lists its context, temperaments and per-token price. Terra Vinicola design direction.",
  fonts: [
    { family: "Playfair Display", axes: "ital,wght@0,400..800;1,400..600" },
    { family: "Newsreader", axes: "ital,opsz,wght@0,6..72,300..600;1,6..72,300..600" },
  ],
  tokens: {
    bgPrimary: "#F4F0EA", bgSecondary: "#E5DEC9", accent: "#7C1D26", onAccent: "#FFF8F0",
    textPrimary: "#26201B", textMuted: "#5E5348", line: "rgba(38,32,27,.18)",
    display: '"Playfair Display", Georgia, serif', body: '"Newsreader", Georgia, serif',
  },
  css: /* css */ `
body{font-size:1.1rem}
.t8-nav{position:sticky;top:0;z-index:40;height:62px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 var(--gutter);background:#F4F0EAee;backdrop-filter:blur(8px);border-bottom:1px solid var(--line);font-size:.95rem}
.t8-mark{font-family:var(--font-display);font-weight:700;font-size:1.3rem;letter-spacing:.12em;text-decoration:none;text-transform:uppercase}
.t8-links{display:flex;gap:24px;font-style:italic}
.t8-links a{text-decoration:none;color:var(--text-muted);padding:4px 0;border-bottom:1px solid transparent}
.t8-links a.is-current{color:var(--accent);border-color:var(--accent)}
.t8-vin{justify-self:end;color:var(--text-muted);font-style:italic}
@media (max-width:900px){.t8-links{display:none}.t8-nav{grid-template-columns:1fr auto}}
.t8-btn{display:inline-flex;align-items:center;min-height:56px;padding:0 32px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:600;font-size:1rem;letter-spacing:.04em;text-decoration:none;border-radius:2px;outline:1px solid var(--accent);outline-offset:3px;transition:outline-offset .35s var(--ease)}
.t8-btn.is-near{outline-offset:6px}
.t8-h2{font-size:clamp(2.6rem,5vw,4.6rem);font-weight:500;letter-spacing:-.02em;line-height:1;max-width:16ch}
.t8-fine{margin-top:22px;font-size:.86rem;color:var(--text-muted);font-style:italic}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: centred label */
.t8-hero{position:relative;min-height:calc(100svh - 62px);display:grid;place-items:center;padding:24px var(--gutter);overflow:clip}
.t8-hero canvas{position:absolute;inset:0;width:100%;height:100%}
.t8-label{position:relative;z-index:2;display:grid;justify-items:center;text-align:center;gap:18px;max-width:780px;padding:clamp(24px,4vh,44px) clamp(20px,4vw,56px);background:#F4F0EAe8;border:1px solid var(--text-primary);box-shadow:inset 0 0 0 6px #F4F0EA,inset 0 0 0 7px var(--text-primary)}
.t8-crest{width:64px;height:64px}
.t8-label .est{font-size:.82rem;letter-spacing:.24em;text-transform:uppercase;color:var(--text-muted)}
.t8-label h1{font-weight:500;max-width:15ch}
.t8-label h1 em{font-weight:400}
.t8-label .k-body{color:var(--text-muted);max-width:50ch}
.t8-rule{width:120px;height:1px;background:var(--text-primary);position:relative}
.t8-rule::before,.t8-rule::after{content:"";position:absolute;top:-3px;width:7px;height:7px;border:1px solid var(--text-primary);transform:rotate(45deg);background:#F4F0EA}
.t8-rule::before{left:-10px}.t8-rule::after{right:-10px}
.t8-trust{font-style:italic;font-size:.98rem;color:var(--text-muted)}
.t8-trust b{font-style:normal;color:var(--text-primary);font-weight:600}
@media (max-width:760px){.t8-hero{padding:14px var(--gutter)}.t8-label{gap:10px;padding:18px 16px}.t8-crest{width:40px;height:40px}.t8-rule{display:none}.t8-label .est{font-size:.68rem}}

/* problem */
.t8-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.t8-faults{display:grid;border-top:1px solid var(--text-primary)}
.t8-faults li{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:22px 0;border-bottom:1px solid var(--line)}
.t8-faults .was{color:var(--text-muted);font-style:italic}
.t8-faults .now{font-family:var(--font-display);font-size:1.25rem;line-height:1.25}
@media (max-width:900px){.t8-cols{grid-template-columns:1fr;gap:40px}.t8-faults li{grid-template-columns:1fr;gap:6px}}

/* signature: altimeter descent */
.t8-cellar{position:relative;display:grid;grid-template-columns:220px 1fr;gap:56px;margin-top:clamp(64px,6vw,80px);padding:0 var(--gutter)}
.t8-gauge{position:sticky;top:96px;height:calc(100vh - 140px);display:grid;grid-template-rows:auto 1fr auto;gap:12px}
.t8-gauge .hd{font-size:.8rem;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted)}
.t8-tube{position:relative;border-left:1px solid var(--text-primary);margin-left:44px}
.t8-tube i{position:absolute;left:-6px;width:12px;height:1px;background:var(--text-primary)}
.t8-tube i span{position:absolute;right:20px;top:-.7em;font-size:.76rem;color:var(--text-muted);white-space:nowrap}
.t8-needle{position:absolute;left:-12px;width:24px;height:24px;border-radius:50%;background:var(--accent);transform:translateY(-50%);transition:top .25s linear;box-shadow:0 0 0 6px #7C1D2622}
.t8-gauge .read{display:grid;gap:2px}
.t8-gauge .read span{font-size:.78rem;color:var(--text-muted);font-style:italic}
.t8-gauge .read b{font-family:var(--font-display);font-size:2.2rem;font-weight:500;line-height:1}
.t8-bands{display:grid}
.t8-band{min-height:86vh;display:grid;grid-template-columns:1.2fr 1fr;gap:40px;align-content:center;border-top:1px solid var(--line);padding:56px 0;position:relative}
.t8-band::before{content:"";position:absolute;inset:0 calc(-1*var(--gutter)) 0 -28px;z-index:-1;background:var(--strata);opacity:.5}
.t8-band .alt{grid-column:1 / -1;font-size:.82rem;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted)}
.t8-band h3{font-family:var(--font-display);font-weight:500;font-size:clamp(3.4rem,7vw,6rem);line-height:.9;letter-spacing:-.02em}
.t8-band .nose{font-family:var(--font-display);font-style:italic;font-size:1.6rem;line-height:1.25;margin-top:16px}
.t8-band .pal{color:var(--text-muted);margin-top:12px;max-width:44ch}
.t8-band dl{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid var(--text-primary);align-self:end}
.t8-band dl div{padding:14px 0;border-bottom:1px solid var(--line);display:grid;gap:2px}
.t8-band dt{font-size:.78rem;color:var(--text-muted);font-style:italic}
.t8-band dd{margin:0;font-family:var(--font-display);font-size:1.5rem;font-variant-numeric:tabular-nums}
@media (max-width:900px){
  .t8-cellar{grid-template-columns:1fr;gap:0}
  .t8-gauge{top:62px;height:auto;z-index:5;grid-template-rows:auto;grid-auto-flow:column;align-items:center;justify-content:space-between;background:#F4F0EAf2;border-bottom:1px solid var(--line);padding:10px 0}
  .t8-tube,.t8-gauge .hd{display:none}
  .t8-gauge .read b{font-size:1.5rem}
  .t8-band{grid-template-columns:1fr;min-height:0;padding:44px 0;gap:18px}
}

/* cellar notes bento */
.t8-notes{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--text-primary);border-left:1px solid var(--line)}
.t8-note{position:relative;isolation:isolate;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;gap:12px;align-content:start;min-height:260px}
.t8-note::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(300px circle at var(--mx) var(--my),#7C1D2610,transparent 65%);opacity:0;transition:opacity .3s}
.t8-note:hover::before{opacity:1}
.t8-note .f{font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;color:var(--text-muted)}
.t8-note h3{font-family:var(--font-display);font-weight:500;font-size:1.7rem;line-height:1.12}
.t8-note p{color:var(--text-muted);font-size:1rem}
.t8-note.n0{grid-column:span 2;background:var(--bg-secondary)}.t8-note.n0 h3{font-size:clamp(2.2rem,3.4vw,3rem)}
.t8-note.n5{grid-column:span 2}
@media (max-width:900px){.t8-notes{grid-template-columns:1fr}.t8-note{grid-column:auto!important}}

/* rail */
.t8-rail-head{padding:0 var(--gutter);margin-bottom:48px}
.t8-steps{padding:0 var(--gutter);gap:24px}
.t8-step{width:min(560px,52vw);border:1px solid var(--text-primary);background:#F8F5F0;display:grid;gap:14px;align-content:start}
.t8-step .n{font-family:var(--font-display);font-style:italic;font-size:2.6rem;line-height:1;color:var(--text-muted)}
.t8-step.is-active .n{color:var(--accent)}
.t8-step h3{font-family:var(--font-display);font-weight:500;font-size:2rem;line-height:1.08}
.t8-step p{color:var(--text-muted)}
.t8-step pre{margin:0;background:var(--text-primary);color:#F4F0EA;padding:14px;font-size:.76rem;overflow-x:auto;white-space:pre}
.t8-step code{font-family:ui-monospace,monospace}
@media (max-width:899px){.t8-step{width:auto}}

/* tasting panel */
.t8-panel{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.t8-taster{border-top:1px solid var(--text-primary);display:grid;gap:14px}
.t8-taster q{font-family:var(--font-display);font-style:italic;font-size:1.5rem;line-height:1.3;quotes:"“" "”"}
.t8-taster p{font-size:.95rem;color:var(--text-muted)}
.t8-taster b{font-style:normal;color:var(--text-primary)}
@media (max-width:760px){.t8-panel{grid-template-columns:1fr}}

/* the list */
.t8-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.t8-plan{border:1px solid var(--text-primary);display:grid;gap:12px;align-content:start;text-align:center;justify-items:center;background:#F8F5F0}
.t8-plan.feat{background:var(--bg-secondary)}
.t8-plan h3{font-family:var(--font-display);font-size:1.8rem;font-weight:500}
.t8-plan .p{font-family:var(--font-display);font-size:3rem;line-height:1}
.t8-plan .cad{font-style:italic;color:var(--text-muted)}
.t8-plan ul{display:grid;gap:4px;font-size:1rem}
.t8-plan .fk{font-style:italic;font-size:.95rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.t8-plans{grid-template-columns:1fr}}
.t8-list{margin-top:48px;display:grid;max-width:820px;margin-inline:auto}
.t8-list h3{font-family:var(--font-display);text-align:center;font-weight:500;font-size:1.8rem;margin-bottom:12px}
.t8-list p{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:baseline;padding:10px 0}
.t8-list p b{font-family:var(--font-display);font-size:1.3rem;font-weight:500}
.t8-list p i{border-bottom:1px dotted var(--text-muted);transform:translateY(-4px)}
.t8-list p span{font-variant-numeric:tabular-nums}

/* final + footer */
.t8-final{display:grid;justify-items:center;text-align:center;gap:28px}
.t8-final .t8-h2{font-size:clamp(3rem,6vw,5.4rem);font-style:italic;font-weight:400}
.t8-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--text-primary);font-size:.95rem;color:var(--text-muted)}
.t8-foot h4{font-family:var(--font-display);font-weight:500;font-size:1.1rem;color:var(--text-primary);margin-bottom:12px}
.t8-foot ul{display:grid;gap:8px}
.t8-foot a{text-decoration:none}
.t8-foot a:hover{color:var(--accent);text-decoration:underline}
.t8-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;font-size:.86rem}
@media (max-width:860px){.t8-foot{grid-template-columns:1fr 1fr}.t8-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="t8-nav">
  <a class="t8-mark" href="#main">${BRAND.name}</a>
  <nav class="t8-links" data-spy aria-label="Sections"><a href="#terroir">Terroir</a><a href="#cellar">The cellar</a><a href="#notes">Notes</a><a href="#vine">Vine to glass</a><a href="#list">The list</a></nav>
  <span class="t8-vin">The rate list</span>
</header>
<main id="main">
  <section class="t8-hero" data-hero aria-labelledby="t8-h">
    <canvas id="contour" data-hero-part="visual" role="img" aria-label="Topographic contour lines; the pointer raises the terrain beneath it"></canvas>
    <div class="t8-label">
      <svg class="t8-crest" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="none" stroke="#26201B"/><path d="M32 12 C 22 24, 22 36, 32 52 C 42 36, 42 24, 32 12Z" fill="none" stroke="#26201B"/><circle cx="32" cy="34" r="3" fill="#7C1D26"/></svg>
      <p class="est">Five families · One estate</p>
      <h1 id="t8-h" data-hero-part="headline">Five models, each with its <em>own character.</em></h1>
      <span class="t8-rule" aria-hidden="true"></span>
      <p class="k-body" data-hero-part="sub">Choose by taste, not guesswork. Every family lists its context, its temperaments and its per-token price — like a proper wine list.</p>
      <div data-hero-part="cta"><a class="t8-btn" href="#list" data-cta="primary" data-magnetic="5,0.12,0.84,0.35"><span data-magnetic-label>Get your API key</span></a></div>
      <p class="t8-trust" data-hero-part="trust">Rates from <b>${rate(Math.min(...MODELS.map((m) => m.inPrice)))}</b> to <b>${rate(Math.max(...MODELS.map((m) => m.outPrice)))}</b> per million tokens, printed on the label. Sample rates.</p>
    </div>
  </section>

  <section id="terroir" data-section aria-labelledby="t8-t">
    <div class="k-wrap t8-cols">
      <h2 id="t8-t" class="t8-h2" data-reveal>Most AI menus pour everything from one bottle.</h2>
      <ol class="t8-faults" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ol>
    </div>
    <div class="t8-cellar" id="cellar">
      <aside class="t8-gauge" aria-live="polite">
        <span class="hd">Altimeter · output price</span>
        <div class="t8-tube" id="tube">
          ${CELLAR.map((m, i) => `<i style="top:${((i / (CELLAR.length - 1)) * 100).toFixed(1)}%"><span>${rate(m.outPrice)}</span></i>`)}
          <span class="t8-needle" id="needle" style="top:0%"></span>
        </div>
        <p class="read"><span>Per 1M output tokens</span><b class="live" id="alt">${rate(CELLAR[0].outPrice)}</b><span id="alt-name">${CELLAR[0].name}</span></p>
      </aside>
      <div class="t8-bands">
        ${CELLAR.map((m, i) => `<article class="t8-band" data-i="${i}" style="--strata:repeating-linear-gradient(${170 + i * 4}deg, transparent 0 ${18 + i * 6}px, rgba(124,29,38,${(0.03 + i * 0.012).toFixed(3)}) ${18 + i * 6}px ${20 + i * 6}px)"><p class="alt">Band ${i + 1} of 5 · ${m.role}</p><div><h3>${m.name}</h3><p class="nose">${NOTES[m.id][0]}</p><p class="pal">${NOTES[m.id][1]} ${m.blurb}</p></div><dl><div><dt>Soil (context)</dt><dd>${m.context}</dd></div><div><dt>Output / 1M</dt><dd>${rate(m.outPrice)}</dd></div><div><dt>Input / 1M</dt><dd>${rate(m.inPrice)}</dd></div><div><dt>Cached / 1M</dt><dd>${rate(m.cached)}</dd></div><div style="grid-column:1/-1"><dt>Temperaments</dt><dd>${m.variants.join(", ")}</dd></div></dl></article>`)}
      </div>
    </div>
    <p class="k-wrap t8-fine">${PRICE_NOTE}</p>
  </section>

  <section id="notes" data-section aria-labelledby="t8-n">
    <div class="k-wrap">
      <h2 id="t8-n" class="t8-h2" data-reveal>Cellar notes: what each feature brings to the glass.</h2>
      <div class="t8-notes" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="t8-note k-card n${i}" data-spot><span class="f">${f}</span><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="vine" data-section aria-labelledby="t8-v">
    <div data-rail>
      <div data-rail-view>
        <div class="t8-rail-head"><h2 id="t8-v" class="t8-h2" data-reveal>From vine to glass, in three steps.</h2></div>
        <ol class="t8-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="t8-step k-card"><span class="n">${["Primo", "Secondo", "Terzo"][i]}</span><h3>${t}</h3><p>${d}</p>${i === 1 ? `<pre><code>baseURL: "${BRAND.apiBase}"\nmodel:   "core-128k"</code></pre>` : ""}</li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="panel" data-section aria-labelledby="t8-p">
    <div class="k-wrap">
      <h2 id="t8-p" class="t8-h2" data-reveal>The tasting panel.</h2>
      <div class="t8-panel" data-stagger>${PROOF.map(([role, focus, q]) => `<figure class="t8-taster k-card"><q>${q}</q><p><b>${role}</b> — ${focus}</p></figure>`)}</div>
      <p class="t8-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="list" data-section aria-labelledby="t8-l">
    <div class="k-wrap">
      <h2 id="t8-l" class="t8-h2" data-reveal>The list. By the glass, or by the bottle.</h2>
      <div class="t8-plans" data-stagger>${PLANS.map((p) => h`<article class="t8-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <div class="t8-list" data-reveal><h3>Per 1M tokens — input / output</h3>${CELLAR.map((m) => `<p><b>${m.name}</b><i aria-hidden="true"></i><span>${rate(m.inPrice)} / ${rate(m.outPrice)}</span></p>`)}</div>
      <p class="t8-fine" style="text-align:center">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="t8-f">
    <div class="k-wrap t8-final">
      <h2 id="t8-f" class="t8-h2" data-reveal>Pour your first request.</h2>
      <a class="t8-btn" href="#main" data-magnetic="5,0.12,0.84,0.35" data-reveal><span data-magnetic-label>Get your API key</span></a>
    </div>
  </section>
</main>
<footer class="t8-foot">
  <div><p class="t8-mark">${BRAND.name}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h4>The families</h4><ul>${CELLAR.map((m) => `<li><a href="#cellar">${m.name}</a></li>`)}</ul></div>
  <div><h4>The estate</h4><ul><li><a href="#notes">Features</a></li><li><a href="#vine">API quickstart</a></li><li><a href="#list">Token rates</a></li></ul></div>
  <div><h4>Exhibition</h4><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Playfair Display and Newsreader.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, canvas, loop, onScroll, pointer } = K;
    // —— hero: marching-squares-free contours — sampled iso-lines of a smooth height field ——
    const cv = $("#contour"), s = canvas(cv);
    const H = (x, y, t, px, py) => Math.sin(x * 0.006 + t * 0.05) * Math.cos(y * 0.008 - t * 0.04) * 0.6 + Math.sin((x + y) * 0.004) * 0.4 + (px > -1 ? Math.exp(-((x - px) ** 2 + (y - py) ** 2) / 26000) * 0.9 : 0);
    let mx = -9, my = -9;
    loop(cv, (t) => {
      const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const r = cv.getBoundingClientRect();
      const tx = pointer.active ? pointer.x - r.left : -9, ty = pointer.active ? pointer.y - r.top : -9;
      mx = mx < -1 ? tx : lerp(mx, tx, 0.08); my = my < -1 ? ty : lerp(my, ty, 0.08);
      const step = 16, tt = RM ? 0 : t, cols = Math.ceil(w / step) + 1, rows = Math.ceil(h / step) + 1;
      const G = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) G[j * cols + i] = H(i * step, j * step, tt, mx, my);
      for (let lv = -0.9; lv <= 1.5; lv += 0.15) {
        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
          const a = G[j * cols + i] - lv, b = G[j * cols + i + 1] - lv, c = G[(j + 1) * cols + i] - lv, x = i * step, y = j * step;
          if (a * b < 0) { const k = a / (a - b); ctx.moveTo(x + k * step, y); ctx.lineTo(x + k * step + 0.8, y + 0.8); }
          if (a * c < 0) { const k = a / (a - c); ctx.moveTo(x, y + k * step); ctx.lineTo(x + 0.8, y + k * step + 0.8); }
        }
        ctx.strokeStyle = Math.abs(lv - 0.6) < 0.01 ? "rgba(124,29,38,.45)" : "rgba(38,32,27,.28)";
        ctx.lineWidth = 1.4; ctx.stroke();
      }
    });

    // —— signature: the altimeter descends through the five bands ——
    const bands = $$(".t8-band"), needle = $("#needle"), alt = $("#alt"), altName = $("#alt-name");
    const prices = AE.MODELS.slice().sort((a, b) => b.outPrice - a.outPrice);
    onScroll(() => {
      const mid = innerHeight * 0.5;
      let pos = 0;
      bands.forEach((b, i) => { const r = b.getBoundingClientRect(); if (r.top < mid) pos = i + clamp((mid - r.top) / r.height); });
      pos = clamp(pos, 0, bands.length - 1);
      const i = Math.floor(pos), f = pos - i;
      const v = lerp(prices[i].outPrice, prices[Math.min(i + 1, prices.length - 1)].outPrice, f);
      needle.style.top = ((pos / (bands.length - 1)) * 100).toFixed(2) + "%";
      alt.textContent = "$" + v.toFixed(2);
      altName.textContent = prices[Math.round(pos)].name;
    });
  }),
};
