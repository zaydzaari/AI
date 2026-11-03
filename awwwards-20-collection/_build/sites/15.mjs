import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Hikari";
const SENTENCE = "Shade the leaves for twenty days, then grind them slowly so the powder keeps its colour and every request keeps its price.";
// Approximate tokenisation for display: short words are one token, longer words split into 3–5 character pieces.
const split = (w) => {
  if (w.length <= 5) return [w];
  const out = []; let i = 0;
  while (i < w.length) { const n = w.length - i > 6 ? 4 : w.length - i; out.push(w.slice(i, i + n)); i += n; }
  return out;
};
const WORDS = SENTENCE.split(" ").map(split);
const TOKENS = WORDS.flat();
const FEED = WORDS.map((pieces) => pieces.map((t) => `<span aria-hidden="true">${t}</span>`).join("")).join(" ");
const TATE = "一つの鍵で五つのモデル";
const NUMS = ["壱", "弐", "参"];

export default {
  title: "Aether — See every token your words become",
  description: "Every request is ground into tokens and priced one by one (input, cached and output) across five model families. Hikari design direction.",
  fonts: [
    { family: "Newsreader", axes: "ital,opsz,wght@0,6..72,300..600;1,6..72,300..500" },
    { family: "Hanken Grotesk", axes: "wght@400;500;600" },
    { family: "Noto Serif JP", axes: "wght@400", text: TATE + NUMS.join(""), as: "Hikari Tate" },
  ],
  tokens: {
    bgPrimary: "#EEF0E6", bgSecondary: "#E0E4D4", accent: "#2E6F40", onAccent: "#FFFFFF",
    textPrimary: "#26261F", textMuted: "#5B5A50", line: "rgba(38,38,31,.16)",
    display: '"Newsreader", Georgia, serif', body: '"Hanken Grotesk", sans-serif',
  },
  css: /* css */ `
h1,.h15-h2{font-variation-settings:"opsz" 72}
.h15-nav{position:sticky;top:0;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:#EEF0E6f0;border-bottom:1px solid var(--line);font-size:.86rem}
.h15-mark{font-family:var(--font-display);font-size:1.4rem;text-decoration:none;font-style:italic}
.h15-links{display:flex;gap:22px}
.h15-links a{text-decoration:none;color:var(--text-muted);padding:4px 0;border-bottom:2px solid transparent}
.h15-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.h15-sea{color:var(--text-muted);font-style:italic;font-family:var(--font-display)}
@media (max-width:900px){.h15-links{display:none}}
.h15-btn{display:inline-flex;align-items:center;gap:12px;min-height:54px;padding:0 28px;border-radius:2px;background:var(--accent);color:var(--on-accent);font-weight:600;text-decoration:none;transition:letter-spacing .4s var(--ease)}
.h15-btn.is-near{letter-spacing:.02em}
.h15-btn i{width:14px;height:14px;border-radius:50%;border:2px solid #fff;border-right-color:transparent;transition:transform .6s var(--ease)}
.h15-btn.is-near i{transform:rotate(180deg)}
.h15-h2{font-size:clamp(2.6rem,5vw,4.6rem);font-weight:400;letter-spacing:-.02em;line-height:1;max-width:16ch}
.h15-fine{margin-top:22px;font-size:.8rem;color:var(--text-muted);max-width:60ch}
.live{color:var(--accent);font-variant-numeric:tabular-nums}
.paper{background:#F9FAF6}

/* hero: shoji panels */
.h15-hero{position:relative;min-height:calc(100svh - 60px);display:grid;grid-template-columns:1fr minmax(0,1.6fr) 1fr;overflow:clip;border-bottom:1px solid var(--line)}
.h15-frame{position:absolute;inset:0;pointer-events:none}
.h15-shoji{position:relative;z-index:1;border-right:6px solid #8A7A5C;background-color:#F9FAF6;background-image:linear-gradient(90deg,#8A7A5C 3px,transparent 3px),linear-gradient(#8A7A5C 3px,transparent 3px);background-size:33.3% 25%;background-position:-2px -2px;transition:transform 1.2s var(--ease)}
.h15-shoji.r{border-right:0;border-left:6px solid #8A7A5C}
.h15-shoji::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--lx,50%) 40%,#ffffffaa,transparent 60%)}
.h15-centre{position:relative;z-index:2;display:grid;align-content:center;justify-items:center;text-align:center;gap:20px;padding:24px clamp(20px,4vw,56px);background:#EEF0E6}
.h15-centre h1{font-weight:400;max-width:12ch}
.h15-centre h1 em{color:var(--accent)}
.h15-centre .k-body{color:var(--text-muted);max-width:44ch}
.h15-tate{position:absolute;right:20px;top:24px;writing-mode:vertical-rl;font-family:"Hikari Tate",serif;font-size:1.05rem;letter-spacing:.3em;color:var(--text-muted)}
.h15-trust{font-size:.88rem;color:var(--text-muted)}
.h15-trust b{color:var(--text-primary);font-weight:600}
@media (max-width:860px){
  .h15-hero{grid-template-columns:28px 1fr 28px}
  .h15-centre{gap:12px;padding:16px 14px}
  .h15-tate{display:none}
}

/* problem */
.h15-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.h15-bowls{display:grid;gap:14px}
.h15-bowls li{display:grid;grid-template-columns:auto 1fr;gap:4px 20px;padding:22px 26px;border:1px solid var(--line)}
.h15-bowls .k{grid-row:span 2;width:40px;height:40px;border-radius:50%;border:1px solid var(--text-primary);display:grid;place-items:center;font-family:"Hikari Tate",serif}
.h15-bowls .was{color:var(--text-muted);font-size:.92rem}
.h15-bowls .now{font-family:var(--font-display);font-size:1.35rem;line-height:1.25}
@media (max-width:900px){.h15-cols{grid-template-columns:1fr;gap:40px}}

/* signature: the stone mill */
.h15-run{height:440vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.h15-pin{position:sticky;top:60px;height:calc(100vh - 60px);display:grid;grid-template-columns:minmax(0,1.2fr) minmax(300px,1fr);gap:40px;padding:24px var(--gutter)}
.h15-millbox{position:relative;display:grid;grid-template-rows:auto 1fr auto;gap:12px;min-height:0}
.h15-feed{font-family:var(--font-display);font-size:clamp(1.1rem,1.6vw,1.4rem);line-height:1.4;min-height:3.2em}
.h15-feed span{transition:opacity .4s,color .4s}
.h15-feed span.gone{color:var(--text-muted);text-decoration:line-through;text-decoration-color:#2E6F4088}
.h15-mill{position:relative;min-height:0}
.h15-mill canvas{position:absolute;inset:0;width:100%;height:100%}
.h15-tokens{display:flex;flex-wrap:wrap;gap:4px;min-height:5em;align-content:flex-start}
.h15-tokens i{font-style:normal;font-size:.76rem;padding:2px 8px;border-radius:999px;background:#DDEBDD;color:#1F4A2B;border:1px solid #2E6F4033;opacity:0;transform:translateY(-8px);transition:opacity .4s,transform .5s var(--ease)}
.h15-tokens i.on{opacity:1;transform:none}
.h15-side{display:grid;align-content:center;gap:14px}
.h15-read{display:grid;grid-template-columns:repeat(3,1fr);border-block:1px solid var(--text-primary)}
.h15-read div{padding:12px 10px 12px 0;display:grid;gap:2px}
.h15-read span{font-size:.76rem;color:var(--text-muted)}
.h15-read b{font-family:var(--font-display);font-size:1.6rem;font-weight:500;font-variant-numeric:tabular-nums}
.h15-certs{display:grid;gap:8px}
.h15-cert{display:grid;grid-template-columns:auto 1fr auto;gap:4px 14px;align-items:center;padding:12px 14px;border:1px solid var(--line);opacity:.35;transition:opacity .5s,border-color .5s,background .5s}
.h15-cert.on{opacity:1;border-color:var(--text-primary);background:#F9FAF6}
.h15-cert .seal{width:30px;height:30px;border-radius:50%;border:1.5px solid var(--text-muted);display:grid;place-items:center;font-size:.6875rem;font-weight:600}
.h15-cert.on .seal{border-color:var(--accent);color:var(--accent)}
.h15-cert b{font-family:var(--font-display);font-size:1.15rem;font-weight:500}
.h15-cert span{font-size:.76rem;color:var(--text-muted)}
.h15-cert em{font-style:normal;font-size:.8rem;font-variant-numeric:tabular-nums;white-space:nowrap}
@media (max-width:900px){
  .h15-run{height:400vh}
  .h15-pin{grid-template-columns:1fr;grid-template-rows:1fr auto;gap:10px;padding:12px var(--gutter)}
  .h15-cert{padding:6px 10px}.h15-cert span{display:none}
  .h15-cert:not(.on){display:none}
  .h15-read b{font-size:1.2rem}
  .h15-feed{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){.h15-run{height:auto}.h15-pin{position:relative;height:auto;min-height:100vh}.h15-tokens i,.h15-cert{opacity:1;transform:none}}

/* bento: the tea set */
.h15-set{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-top:1px solid var(--text-primary);border-left:1px solid var(--line)}
.h15-piece{position:relative;isolation:isolate;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;gap:12px;align-content:start;min-height:260px}
.h15-piece::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(280px circle at var(--mx) var(--my),#2E6F4012,transparent 65%);opacity:0;transition:opacity .3s}
.h15-piece:hover::before{opacity:1}
.h15-piece .tag{font-size:.78rem;color:var(--text-muted)}
.h15-piece h3{font-family:var(--font-display);font-size:1.7rem;font-weight:400;line-height:1.12}
.h15-piece p{color:var(--text-muted);font-size:.94rem}
.h15-piece.p0{grid-column:span 2;background:var(--bg-secondary)}.h15-piece.p0 h3{font-size:clamp(2.2rem,3.4vw,3rem)}
.h15-piece.p5{grid-column:span 2}
@media (max-width:900px){.h15-set{grid-template-columns:1fr}.h15-piece{grid-column:auto!important}}

/* rail */
.h15-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.h15-steps{padding:0 var(--gutter);gap:0}
.h15-step{width:min(540px,50vw);display:grid;gap:14px;align-content:start;border-left:1px solid var(--line)}
.h15-step .n{font-family:var(--font-display);font-style:italic;font-size:3rem;line-height:1;color:var(--text-muted)}
.h15-step.is-active .n{color:var(--accent)}
.h15-step h3{font-family:var(--font-display);font-size:2rem;font-weight:400;line-height:1.08}
.h15-step p{color:var(--text-muted)}
.h15-step pre{margin:0;background:var(--text-primary);color:#EEF0E6;padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
.h15-step code{font-family:ui-monospace,monospace}
@media (max-width:899px){.h15-step{width:auto;border-left:0;border-top:1px solid var(--line)}}

/* guild voices */
.h15-voices{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.h15-v{display:grid;gap:14px;border-top:1px solid var(--text-primary)}
.h15-v q{font-family:var(--font-display);font-size:1.4rem;line-height:1.35;quotes:"“" "”"}
.h15-v p{font-size:.88rem;color:var(--text-muted)}
.h15-v b{color:var(--text-primary);font-weight:600}
@media (max-width:760px){.h15-voices{grid-template-columns:1fr}}

/* pricing */
.h15-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.h15-plan{border:1px solid var(--line);display:grid;gap:12px;align-content:start}
.h15-plan.feat{border-color:var(--accent);background:#F9FAF6}
.h15-plan h3{font-family:var(--font-display);font-size:1.7rem;font-weight:400}
.h15-plan .p{font-family:var(--font-display);font-size:3rem;line-height:1}
.h15-plan .cad{font-size:.82rem;color:var(--text-muted)}
.h15-plan ul{display:grid;gap:6px;font-size:.92rem}
.h15-plan li::before{content:"— ";color:var(--text-muted)}
.h15-plan .fk{font-size:.86rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.h15-plans{grid-template-columns:1fr}}
.h15-table{width:100%;margin-top:40px;border-collapse:collapse;font-variant-numeric:tabular-nums}
.h15-table caption{text-align:left;font-family:var(--font-display);font-size:1.6rem;padding-bottom:12px}
.h15-table th,.h15-table td{text-align:left;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.h15-table thead th{font-weight:500;color:var(--text-muted);font-size:.8rem}
@media (max-width:700px){.h15-table th:nth-child(2),.h15-table td:nth-child(2){display:none}}

/* final + footer */
.h15-final{display:grid;justify-items:center;text-align:center;gap:28px}
.h15-final .h15-h2{font-size:clamp(3rem,6.4vw,5.6rem)}
.h15-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--text-primary);font-size:.86rem;color:var(--text-muted)}
.h15-foot h3{font-family:var(--font-display);font-weight:400;font-size:1.2rem;color:var(--text-primary);margin-bottom:12px}
.h15-foot ul{display:grid;gap:8px}
.h15-foot a{text-decoration:none}
.h15-foot a:hover{color:var(--accent)}
.h15-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.h15-foot{grid-template-columns:1fr 1fr}.h15-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="h15-nav">
  <a class="h15-mark" href="#main">${BRAND.name}</a>
  <nav class="h15-links" data-spy aria-label="Sections"><a href="#bowl">The bowl</a><a href="#mill">The mill</a><a href="#set">Tea set</a><a href="#ceremony">Ceremony</a><a href="#guild">Guild</a><a href="#prices">Prices</a></nav>
  <span class="h15-sea">Shincha edition</span>
</header>
<main id="main">
  <section class="h15-hero" data-hero aria-labelledby="h15-h">
    <span class="h15-frame" data-hero-part="visual" role="img" aria-label="Paper shoji panels that part as the pointer moves"></span>
    <div class="h15-shoji l" id="sl" aria-hidden="true"></div>
    <div class="h15-centre">
      <span class="h15-tate" lang="ja" aria-hidden="true">${TATE}</span>
      <h1 id="h15-h" data-hero-part="headline">See every token your words become.</h1>
      <p class="k-body" data-hero-part="sub">Each request is ground into tokens and priced one by one (input, cached and output) across five model families. Nothing hidden in the bowl.</p>
      <div data-hero-part="cta"><a class="h15-btn" href="#prices" data-cta="primary" data-magnetic="5,0.1,0.86,0.35"><i aria-hidden="true"></i><span data-magnetic-label>Get your API key</span></a></div>
      <p class="h15-trust" data-hero-part="trust">A twelve-word sentence is about <b>16 tokens</b>: <b>${usd(cost(MODELS[0], 16, 0))}</b> as Core input, at sample rates.</p>
    </div>
    <div class="h15-shoji r" id="sr" aria-hidden="true"></div>
  </section>

  <section id="bowl" data-section aria-labelledby="h15-b">
    <div class="k-wrap h15-cols">
      <h2 id="h15-b" class="h15-h2" data-reveal>Most AI is served in an opaque bowl.</h2>
      <ol class="h15-bowls" data-stagger>${PROBLEM.rows.map(([was, now], i) => `<li class="paper"><span class="k" lang="ja" aria-hidden="true">${NUMS[i]}</span><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ol>
    </div>
    <div class="h15-run" id="mill">
      <div class="h15-pin">
        <div class="h15-millbox">
          <p class="h15-feed" id="feed" aria-label="${SENTENCE}">${FEED}</p>
          <div class="h15-mill"><canvas id="millcv" role="img" aria-label="A granite stone mill; scroll turns it and grinds the sentence into tokens"></canvas></div>
          <div class="h15-tokens" id="toks" aria-hidden="true">${TOKENS.map((t) => `<i>${t}</i>`)}</div>
        </div>
        <aside class="h15-side" aria-live="polite">
          <div class="h15-read"><div><span>Tokens ground</span><b class="live" id="tk">0</b></div><div><span>As Core input</span><b id="ci">$0.000000</b></div><div><span>Turns</span><b id="turns">0</b></div></div>
          <ol class="h15-certs">${MODELS.map((m, i) => `<li class="h15-cert" data-i="${i}"><span class="seal" aria-hidden="true">${m.name.slice(0, 2)}</span><div><b>${m.name}</b><br><span>${m.role} · ${m.context} · ${m.variants.join(", ")}</span></div><em>${rate(m.inPrice)} / ${rate(m.outPrice)}</em></li>`)}</ol>
          <p class="h15-fine">Each certificate unlocks as the mill turns. Token splits are approximate; rates per 1M in / out. ${PRICE_NOTE}</p>
        </aside>
      </div>
    </div>
  </section>

  <section id="set" data-section aria-labelledby="h15-s">
    <div class="k-wrap">
      <h2 id="h15-s" class="h15-h2" data-reveal>The tea set: each piece, and its purpose.</h2>
      <div class="h15-set" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="h15-piece k-card p${i}" data-spot><span class="tag">${f}</span><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="ceremony" data-section aria-labelledby="h15-c">
    <div data-rail>
      <div data-rail-view>
        <div class="h15-rail-head"><h2 id="h15-c" class="h15-h2" data-reveal>The ceremony, in three movements.</h2></div>
        <ol class="h15-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="h15-step k-card"><span class="n">${["Ichi", "Ni", "San"][i]}</span><h3>${t}</h3><p>${d}</p>${i === 1 ? `<pre><code>baseURL: "${BRAND.apiBase}"\nmodel:   "core-128k"</code></pre>` : ""}</li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="guild" data-section aria-labelledby="h15-g">
    <div class="k-wrap">
      <h2 id="h15-g" class="h15-h2" data-reveal>Members of the guild.</h2>
      <div class="h15-voices" data-stagger>${PROOF.map(([role, focus, q]) => `<figure class="h15-v k-card"><q>${q}</q><p><b>${role}</b> · ${focus}</p></figure>`)}</div>
      <p class="h15-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="prices" data-section aria-labelledby="h15-p">
    <div class="k-wrap">
      <h2 id="h15-p" class="h15-h2" data-reveal>Prices, measured to the token.</h2>
      <div class="h15-plans" data-stagger>${PLANS.map((p) => h`<article class="h15-plan paper k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="h15-table" data-reveal>
        <caption>Rates per 1M tokens</caption>
        <thead><tr><th scope="col">Cultivar</th><th scope="col">Character</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="h15-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="h15-f">
    <div class="k-wrap h15-final">
      <h2 id="h15-f" class="h15-h2" data-reveal>Whisk your first request.</h2>
      <a class="h15-btn" href="#main" data-magnetic="5,0.1,0.86,0.35" data-reveal><i aria-hidden="true"></i><span data-magnetic-label>Get your API key</span></a>
    </div>
  </section>
</main>
<footer class="h15-foot">
  <div><p class="h15-mark">${BRAND.name}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Cultivars</h3><ul>${MODELS.map((m) => `<li><a href="#prices">${m.name}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#mill">Token pricing</a></li><li><a href="#ceremony">API quickstart</a></li><li><a href="#set">Features</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Newsreader and Hanken Grotesk.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;
    // hero: shoji panels part with the pointer
    const sl = $("#sl"), sr = $("#sr");
    const part = () => {
      if (RM) return;
      const nx = pointer.active ? pointer.x / innerWidth - 0.5 : 0;
      const open = 14 + Math.abs(nx) * 22;
      sl.style.transform = `translateX(${-open - nx * 10}%)`; sr.style.transform = `translateX(${open - nx * 10}%)`;
      sl.style.setProperty("--lx", 50 + nx * 80 + "%"); sr.style.setProperty("--lx", 50 + nx * 80 + "%");
    };
    requestAnimationFrame(part);
    addEventListener("pointermove", part, { passive: true });

    // signature: scroll turns the mill and grinds the sentence into tokens
    const run = $("#mill"), feed = $$("#feed span"), toks = $$("#toks i"), certs = $$(".h15-cert");
    const tk = $("#tk"), ci = $("#ci"), turns = $("#turns");
    const core = AE.MODELS[0];
    let p = 0;
    onScroll(() => {
      p = RM ? 1 : clamp((progress(run) - 0.05) / 0.85);
      const n = Math.round(p * toks.length);
      feed.forEach((s, i) => s.classList.toggle("gone", i < n));
      toks.forEach((t, i) => t.classList.toggle("on", i < n));
      certs.forEach((c, i) => c.classList.toggle("on", p >= (i + 0.5) / certs.length));
      tk.textContent = n; ci.textContent = "$" + ((n * core.inPrice) / 1e6).toFixed(6); turns.textContent = (p * 6).toFixed(1);
    });
    const mc = $("#millcv"), ms = canvas(mc);
    const dust = Array.from({ length: 120 }, () => ({ x: 0, y: 0, vy: 0, life: 0 }));
    let last = 0;
    loop(mc, (t) => {
      const { ctx, w, h } = ms;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, R = Math.min(w * 0.36, h * 0.46), ang = p * TAU * 6;
      const ry = R * 0.3, top = h * 0.3, H1 = R * 0.34, H2 = R * 0.3;
      const stone = (y, hh, rot, shade) => {
        // side band
        const g = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
        g.addColorStop(0, shade[0]); g.addColorStop(0.5, shade[1]); g.addColorStop(1, shade[0]);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(cx, y + hh, R, ry, 0, 0, Math.PI); ctx.lineTo(cx - R, y); ctx.ellipse(cx, y, R, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
        // grooves on the band, moving with rotation
        ctx.strokeStyle = "rgba(38,38,31,.18)"; ctx.lineWidth = 1;
        for (let k = 0; k < 18; k++) { const a = (k / 18) * TAU + rot; const c = Math.cos(a); if (Math.sin(a) < 0) continue; const x = cx + c * R; ctx.beginPath(); ctx.moveTo(x, y + Math.sin(a) * ry); ctx.lineTo(x, y + hh + Math.sin(a) * ry); ctx.stroke(); }
        // top face
        ctx.fillStyle = shade[2]; ctx.beginPath(); ctx.ellipse(cx, y, R, ry, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(38,38,31,.35)"; ctx.stroke();
      };
      stone(top + H1 + 4, H2, ang * 0.2, ["#9A968A", "#C9C5B8", "#B8B4A6"]);
      stone(top, H1, ang, ["#8C887C", "#BDB9AC", "#CFCBBE"]);
      // feed hole and handle
      ctx.fillStyle = "#3B3A33"; ctx.beginPath(); ctx.ellipse(cx, top, R * 0.12, ry * 0.12, 0, 0, TAU); ctx.fill();
      const hx = cx + Math.cos(ang) * R * 0.8, hy = top + Math.sin(ang) * ry * 0.8;
      ctx.strokeStyle = "#6B5A3E"; ctx.lineWidth = 6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy - R * 0.42); ctx.stroke();
      // matcha dust falling from the seam, faster while scrolling
      const speed = Math.min(1, Math.abs(p - last) * 400); last = p;
      for (const d of dust) {
        if (d.life <= 0 && Math.random() < 0.08 + speed * 0.6 && !RM) { const a = Math.random() * Math.PI; d.x = cx + Math.cos(a) * R; d.y = top + H1 + 4 + Math.sin(a) * ry; d.vy = 0.6 + Math.random(); d.life = 1; }
        if (d.life > 0) { d.y += d.vy; d.vy += 0.05; d.life -= 0.012; ctx.fillStyle = `rgba(46,111,64,${d.life})`; ctx.fillRect(d.x, d.y, 2, 2); }
      }
    });
  }),
};
