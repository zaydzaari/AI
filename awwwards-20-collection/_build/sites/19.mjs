import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Atelier Kintsugi";
const M = Object.fromEntries(MODELS.map((m) => [m.id, m]));
const LINES = [
  "The keeper had not answered the radio in nine days,",
  "yet every night the lamp still turned above the reef,",
  "patient as a clock that no one living wound.",
  "When the visitor rowed out, she found the logbook open",
  "and one word written over and over: wait.",
];
const UV = [
  "Nine days of silence from the keeper's radio,",
  "and still the lamp swept the reef each night,",
  "a clock kept by hands no one had seen.",
  "The visitor rowed out and read the open log:",
  "one word, again and again, in his hand — wait.",
];
const split = (w) => (w.length <= 5 ? [w] : w.match(/.{1,4}/g));
const toks = (line) => line.split(" ").flatMap(split);
const XR = LINES.map((l) => { const n = toks(l).length; return `${n} tokens · out · ${usd(cost(M.core, 0, n))}`; });

const page = (cls, lines) => `<div class="k19-layer ${cls}">${lines.map((l) => `<p>${l}</p>`).join("")}</div>`;
const tokenPage = (cls) => `<div class="k19-layer ${cls}">${LINES.map((l) => `<p>${toks(l).map((t) => `<i>${t}</i>`).join("")}</p>`).join("")}</div>`;

export default {
  title: "Aether — Look beneath every answer",
  description: "Hold any response up to the light: compare it across models, see the tokens it is made of, and read what each line cost. Atelier Kintsugi design direction.",
  fonts: [
    { family: "IM Fell English", axes: "ital@0;1" },
    { family: "Work Sans", axes: "wght@400;500;600" },
  ],
  tokens: {
    bgPrimary: "#F9F6F0", bgSecondary: "#EBE5D8", accent: "#B45309", onAccent: "#FFFFFF",
    textPrimary: "#2A231C", textMuted: "#5F554A", line: "rgba(42,35,28,.16)",
    display: '"IM Fell English", Georgia, serif', body: '"Work Sans", sans-serif',
  },
  css: /* css */ `
:root{--h1-weight:400}
.k19-nav{position:sticky;top:0;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:#F9F6F0f2;border-bottom:1px solid var(--line);font-size:.86rem}
.k19-mark{font-family:var(--font-display);font-size:1.5rem;text-decoration:none}
.k19-mark i{color:var(--accent)}
.k19-links{display:flex;gap:22px}
.k19-links a{text-decoration:none;color:var(--text-muted);padding:4px 0;border-bottom:1px solid transparent}
.k19-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.k19-acc{color:var(--text-muted);font-family:var(--font-display);font-style:italic;font-size:1rem}
@media (max-width:900px){.k19-links{display:none}}
.k19-btn{display:inline-flex;align-items:center;gap:12px;min-height:54px;padding:0 28px;background:var(--accent);color:var(--on-accent);font-weight:600;text-decoration:none;border-radius:2px;position:relative;isolation:isolate}
.k19-btn::after{content:"";position:absolute;inset:-4px;z-index:-1;border:1px solid var(--accent);opacity:0;transition:opacity .3s,inset .4s var(--ease)}
.k19-btn.is-near::after{opacity:1;inset:-7px}
.k19-h2{font-size:clamp(2.6rem,5vw,4.6rem);font-weight:400;letter-spacing:-.01em;line-height:1.02;max-width:16ch}
.k19-fine{margin-top:22px;font-size:.82rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}
.vellum{background:radial-gradient(120% 90% at 30% 20%,#FFFDF8,#F2ECDF);box-shadow:inset 0 0 60px #C9B99A33}

/* manuscript layers + loupe */
.k19-ms{position:relative;overflow:hidden}
.k19-layer{position:absolute;inset:0;padding:clamp(18px,3vw,40px);display:grid;align-content:center;gap:.4em;font-family:var(--font-display);font-size:clamp(1.05rem,1.8vw,1.55rem);line-height:1.5}
.k19-layer p{max-width:none}
.k19-layer.vis{position:relative;color:#2A231C}
.k19-layer.vis p::first-letter{font-size:1.9em;color:#2A231C}
.k19-layer.uv{background:#1A1336;color:#C9B6FF;clip-path:circle(var(--r,0px) at var(--x,50%) var(--y,50%))}
.k19-layer.ir{background:#2A0E07;color:#FFC9A6;clip-path:circle(var(--r,0px) at var(--x,50%) var(--y,50%))}
.k19-layer.ir i{font-style:normal;display:inline-block;margin:0 2px 4px 0;padding:0 4px;border:1px solid #FFC9A666;border-radius:4px;font-family:var(--font-body);font-size:.62em}
.k19-layer.xr{background:#0E1A1F;color:#BFE6F2;clip-path:circle(var(--r,0px) at var(--x,50%) var(--y,50%));font-family:var(--font-body);font-size:clamp(.8rem,1.1vw,.95rem)}
.k19-layer.xr p{display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed #BFE6F244;padding-bottom:.4em}
.k19-ring{position:absolute;left:var(--x,50%);top:var(--y,50%);width:calc(var(--r,0px) * 2);height:calc(var(--r,0px) * 2);transform:translate(-50%,-50%);border-radius:50%;border:3px solid #B4935A;box-shadow:0 0 0 6px #2A231C14,0 20px 40px -10px #2A231C55;pointer-events:none}
.k19-ring::after{content:"";position:absolute;right:-30%;bottom:-30%;width:40%;height:12px;background:#6B5636;border-radius:6px;transform:rotate(45deg);transform-origin:left}

/* hero: open book */
.k19-hero{min-height:calc(100svh - 60px);display:grid;place-items:center;padding:22px var(--gutter)}
.k19-book{display:grid;grid-template-columns:1fr 1fr;width:min(1240px,100%);min-height:min(78vh,700px);box-shadow:0 40px 80px -50px #2A231C88;border-radius:6px;overflow:hidden}
.k19-left{display:grid;align-content:center;gap:22px;justify-items:start;padding:clamp(24px,4vw,64px);border-right:1px solid #C9B99A88;position:relative}
.k19-left::after{content:"";position:absolute;right:0;top:0;bottom:0;width:40px;background:linear-gradient(90deg,transparent,#2A231C10)}
.k19-left .folio{font-family:var(--font-display);font-style:italic;color:var(--text-muted)}
.k19-left h1{font-weight:400;max-width:11ch}
.k19-left .k-body{color:var(--text-muted);max-width:42ch}
.k19-trust{font-size:.86rem;color:var(--text-muted);border-top:1px solid var(--line);padding-top:12px}
.k19-trust b{color:var(--text-primary)}
.k19-right{position:relative}
.k19-right .k19-ms{position:absolute;inset:0}
.k19-cap{position:absolute;left:16px;bottom:12px;z-index:3;font-size:.72rem;color:var(--text-muted);background:#F9F6F0d9;padding:2px 8px}
@media (max-width:860px){
  .k19-hero{padding:10px var(--gutter);place-items:start}
  .k19-book{grid-template-columns:1fr;grid-template-rows:auto 128px;min-height:0}
  .k19-left{padding:16px 18px;gap:10px;border-right:0;border-bottom:1px solid #C9B99A88}
  .k19-trust{padding-top:8px;font-size:.8rem}
  .k19-left .folio{display:none}
  .k19-layer{font-size:.92rem;padding:12px 16px}
}

/* problem */
.k19-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.k19-cond{display:grid;border-top:1px solid var(--text-primary)}
.k19-cond li{display:grid;grid-template-columns:1fr 1fr;gap:28px;padding:22px 0;border-bottom:1px solid var(--line)}
.k19-cond .was{color:var(--text-muted);font-style:italic}
.k19-cond .now{font-family:var(--font-display);font-size:1.4rem;line-height:1.2}
@media (max-width:900px){.k19-cols{grid-template-columns:1fr;gap:40px}.k19-cond li{grid-template-columns:1fr;gap:6px}}

/* signature: spectral inspection */
.k19-run{height:460vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.k19-pin{position:sticky;top:60px;height:calc(100vh - 60px);display:grid;grid-template-columns:minmax(0,1.6fr) minmax(260px,1fr);gap:36px;padding:24px var(--gutter)}
.k19-plate{position:relative;border:1px solid #C9B99A;border-radius:4px}
.k19-plate .k19-ms{position:absolute;inset:0}
.k19-modes{display:grid;align-content:center;gap:10px}
.k19-modes li{display:grid;grid-template-columns:auto 1fr;gap:2px 14px;padding:14px 16px;border:1px solid var(--line);transition:border-color .4s,background .4s}
.k19-modes li i{grid-row:span 2;width:16px;height:16px;border-radius:50%;margin-top:4px}
.k19-modes li b{font-family:var(--font-display);font-size:1.35rem;font-weight:400}
.k19-modes li span{font-size:.82rem;color:var(--text-muted)}
.k19-modes li.on{border-color:var(--text-primary);background:#FFFDF8}
.k19-modes li.on b{color:var(--accent)}
@media (max-width:900px){
  .k19-run{height:420vh}
  .k19-pin{grid-template-columns:1fr;grid-template-rows:1fr auto;gap:10px;padding:12px var(--gutter)}
  .k19-modes{grid-template-columns:1fr 1fr;gap:6px}
  .k19-modes li{padding:8px 10px}.k19-modes li span{display:none}.k19-modes li b{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){.k19-run{height:auto}.k19-pin{position:relative;height:100vh}}

/* bento: the vault */
.k19-vault{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.k19-folio{position:relative;isolation:isolate;overflow:hidden;border:1px solid #C9B99A;display:grid;gap:12px;align-content:start;min-height:260px}
.k19-folio::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(240px circle at var(--mx) var(--my),#B4530914,transparent 65%);opacity:0;transition:opacity .3s}
.k19-folio:hover::before{opacity:1}
.k19-folio .no{display:flex;justify-content:space-between;font-size:.76rem;color:var(--text-muted)}
.k19-folio h3{font-family:var(--font-display);font-weight:400;font-size:1.7rem;line-height:1.1}
.k19-folio p{color:var(--text-muted);font-size:.94rem}
.k19-folio.f0{grid-column:span 2}.k19-folio.f0 h3{font-size:clamp(2.2rem,3.4vw,3rem)}
.k19-folio.f5{grid-column:span 2}
.k19-folio .seam{position:absolute;left:-10%;top:58%;width:120%;height:2px;background:linear-gradient(90deg,transparent,#B4935A,#E9C46A,#B4935A,transparent);transform:rotate(-4deg);opacity:.6}
@media (max-width:900px){.k19-vault{grid-template-columns:1fr}.k19-folio{grid-column:auto!important}}

/* rail */
.k19-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.k19-steps{padding:0 var(--gutter);gap:18px}
.k19-step{width:min(540px,50vw);border:1px solid #C9B99A;display:grid;gap:12px;align-content:start}
.k19-step .n{font-family:var(--font-display);font-style:italic;font-size:2.4rem;line-height:1;color:var(--text-muted)}
.k19-step.is-active .n{color:var(--accent)}
.k19-step h3{font-family:var(--font-display);font-weight:400;font-size:2rem;line-height:1.08}
.k19-step p{color:var(--text-muted)}
.k19-step pre{margin:0;background:var(--text-primary);color:#F9F6F0;padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
.k19-step code{font-family:ui-monospace,monospace}
@media (max-width:899px){.k19-step{width:auto}}

/* provenance */
.k19-prov{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.k19-p{display:grid;gap:14px;border-top:1px solid var(--text-primary)}
.k19-p q{font-family:var(--font-display);font-style:italic;font-size:1.5rem;line-height:1.3;quotes:"“" "”"}
.k19-p p{font-size:.9rem;color:var(--text-muted)}
.k19-p b{color:var(--text-primary);font-weight:600}
@media (max-width:760px){.k19-prov{grid-template-columns:1fr}}

/* pricing */
.k19-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.k19-plan{border:1px solid #C9B99A;display:grid;gap:12px;align-content:start}
.k19-plan.feat{border-color:var(--accent)}
.k19-plan h3{font-family:var(--font-display);font-weight:400;font-size:1.8rem}
.k19-plan .p{font-family:var(--font-display);font-size:3rem;line-height:1}
.k19-plan .cad{font-size:.84rem;color:var(--text-muted);font-style:italic}
.k19-plan ul{display:grid;gap:6px;font-size:.94rem}
.k19-plan li::before{content:"❦ ";color:var(--accent);font-size:.8em}
.k19-plan .fk{font-size:.86rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.k19-plans{grid-template-columns:1fr}}
.k19-table{width:100%;margin-top:40px;border-collapse:collapse;font-variant-numeric:tabular-nums}
.k19-table caption{text-align:left;font-family:var(--font-display);font-size:1.6rem;padding-bottom:12px}
.k19-table th,.k19-table td{text-align:left;padding:12px 12px 12px 0;border-bottom:1px solid var(--line)}
.k19-table thead th{font-weight:500;color:var(--text-muted);font-size:.8rem}
@media (max-width:700px){.k19-table th:nth-child(2),.k19-table td:nth-child(2){display:none}}

/* final + footer */
.k19-final{display:grid;justify-items:center;text-align:center;gap:28px}
.k19-final .k19-h2{font-size:clamp(3rem,6.4vw,5.6rem)}
.k19-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--text-primary);font-size:.86rem;color:var(--text-muted)}
.k19-foot h4{font-family:var(--font-display);font-weight:400;font-size:1.25rem;color:var(--text-primary);margin-bottom:12px}
.k19-foot ul{display:grid;gap:8px}
.k19-foot a{text-decoration:none}
.k19-foot a:hover{color:var(--accent);text-decoration:underline}
.k19-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.k19-foot{grid-template-columns:1fr 1fr}.k19-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="k19-nav">
  <a class="k19-mark" href="#main">${BRAND.name} <i>atelier</i></a>
  <nav class="k19-links" data-spy aria-label="Sections"><a href="#condition">Condition</a><a href="#inspect">Inspection</a><a href="#vault">The vault</a><a href="#method">Method</a><a href="#provenance">Provenance</a><a href="#fees">Fees</a></nav>
  <span class="k19-acc">Accession 019</span>
</header>
<main id="main">
  <section class="k19-hero" data-hero aria-labelledby="k19-h">
    <div class="k19-book vellum">
      <div class="k19-left">
        <p class="folio">Folio i, recto</p>
        <h1 id="k19-h" data-hero-part="headline">Look beneath every answer.</h1>
        <p class="k-body" data-hero-part="sub">Hold any response up to the light: compare it across models, see the tokens it is made of, and read what each line cost.</p>
        <div data-hero-part="cta"><a class="k19-btn" href="#fees" data-cta="primary" data-magnetic="5,0.12,0.84,0.35"><span data-magnetic-label>Get your API key</span></a></div>
        <p class="k19-trust" data-hero-part="trust">Every response carries its record: <b>tokens</b>, <b>cached tokens</b> and <b>cost</b>.</p>
      </div>
      <div class="k19-right" data-hero-part="visual">
        <div class="k19-ms" id="hero-ms" role="img" aria-label="A manuscript page; the loupe reveals what each line cost">
          ${page("vis", LINES)}${page("xr", LINES.map((l, i) => `<span>${l.split(" ").slice(0, 3).join(" ")}…</span><span>${XR[i]}</span>`))}
          <span class="k19-ring" aria-hidden="true"></span>
        </div>
        <span class="k19-cap">X-ray loupe · move the pointer over the page</span>
      </div>
    </div>
  </section>

  <section id="condition" data-section aria-labelledby="k19-c">
    <div class="k-wrap k19-cols">
      <h2 id="k19-c" class="k19-h2" data-reveal>Condition report: most AI arrives with its seams hidden.</h2>
      <ol class="k19-cond" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ol>
    </div>
    <div class="k19-run" id="inspect">
      <div class="k19-pin">
        <div class="k19-plate vellum">
          <div class="k19-ms" id="sig-ms" role="img" aria-label="Spectral inspection of one answer: visible text, another model's reading, its tokens, and its usage record">
            ${page("vis", LINES)}${page("uv", UV)}${tokenPage("ir")}${page("xr", LINES.map((l, i) => `<span>${l.split(" ").slice(0, 3).join(" ")}…</span><span>${XR[i]}</span>`))}
            <span class="k19-ring" aria-hidden="true"></span>
          </div>
        </div>
        <ol class="k19-modes" aria-live="polite">
          <li class="on" data-m="vis"><i style="background:#E9DFC9;border:1px solid #2A231C" aria-hidden="true"></i><b>Visible light</b><span>The answer as your user reads it — Core, standard.</span></li>
          <li data-m="uv"><i style="background:#6E4BD8" aria-hidden="true"></i><b>Ultraviolet</b><span>Another reading: the same prompt answered by Unbound.</span></li>
          <li data-m="ir"><i style="background:#C2410C" aria-hidden="true"></i><b>Infrared</b><span>The under-drawing: every token the answer is made of.</span></li>
          <li data-m="xr"><i style="background:#2F7A92" aria-hidden="true"></i><b>X-ray</b><span>The structure: tokens and cost for every line.</span></li>
        </ol>
      </div>
    </div>
    <p class="k-wrap k19-fine">Token splits are approximate; costs at Core sample output rates. ${PRICE_NOTE}</p>
  </section>

  <section id="vault" data-section aria-labelledby="k19-v">
    <div class="k-wrap">
      <h2 id="k19-v" class="k19-h2" data-reveal>From the vault: each piece, restored.</h2>
      <div class="k19-vault" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="k19-folio vellum k-card f${i}" data-spot><span class="seam" aria-hidden="true"></span><p class="no"><span>${f}</span><span>MS ${String(i + 1).padStart(3, "0")}</span></p><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="method" data-section aria-labelledby="k19-m">
    <div data-rail>
      <div data-rail-view>
        <div class="k19-rail-head"><h2 id="k19-m" class="k19-h2" data-reveal>The method, in three treatments.</h2></div>
        <ol class="k19-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="k19-step vellum k-card"><span class="n">${["Primum", "Deinde", "Denique"][i]}</span><h3>${t}</h3><p>${d}</p>${i === 1 ? `<pre><code>baseURL: "${BRAND.apiBase}"\nmodel:   "core-128k"</code></pre>` : ""}</li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="provenance" data-section aria-labelledby="k19-p">
    <div class="k-wrap">
      <h2 id="k19-p" class="k19-h2" data-reveal>Provenance, by role.</h2>
      <div class="k19-prov" data-stagger>${PROOF.map(([role, focus, q]) => `<figure class="k19-p k-card"><q>${q}</q><p><b>${role}</b> — ${focus}</p></figure>`)}</div>
      <p class="k19-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="fees" data-section aria-labelledby="k19-f">
    <div class="k-wrap">
      <h2 id="k19-f" class="k19-h2" data-reveal>Fees, itemised to the token.</h2>
      <div class="k19-plans" data-stagger>${PLANS.map((p) => h`<article class="k19-plan vellum k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="k19-table" data-reveal>
        <caption>Rates per 1M tokens</caption>
        <thead><tr><th scope="col">Hand</th><th scope="col">Character</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="k19-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="k19-z">
    <div class="k-wrap k19-final">
      <h2 id="k19-z" class="k19-h2" data-reveal>Bring your first answer to the light.</h2>
      <a class="k19-btn" href="#main" data-magnetic="5,0.12,0.84,0.35" data-reveal><span data-magnetic-label>Get your API key</span></a>
    </div>
  </section>
</main>
<footer class="k19-foot">
  <div><p class="k19-mark">${BRAND.name} <i>atelier</i></p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h4>The hands</h4><ul>${MODELS.map((m) => `<li><a href="#fees">${m.name}</a></li>`)}</ul></div>
  <div><h4>Platform</h4><ul><li><a href="#inspect">Model comparison</a></li><li><a href="#method">API quickstart</a></li><li><a href="#fees">Token rates</a></li></ul></div>
  <div><h4>Exhibition</h4><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in IM Fell English and Work Sans.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, FINE, $, $$, clamp, lerp, onScroll, progress, pointer, loop } = K;
    // move a loupe over a manuscript: --x/--y/--r on the container drive the layer clip-paths
    function Loupe(ms, { radius = 90 } = {}) {
      let x = 0.6, y = 0.45, r = radius;
      return {
        set(nx, ny, nr = radius) { x = nx; y = ny; r = nr; ms.style.setProperty("--x", (x * 100).toFixed(2) + "%"); ms.style.setProperty("--y", (y * 100).toFixed(2) + "%"); ms.style.setProperty("--r", r.toFixed(1) + "px"); },
        ease(tx, ty, tr = radius, k = 0.12) { this.set(lerp(x, tx, k), lerp(y, ty, k), lerp(r, tr, k)); },
      };
    }
    // hero: pointer-steered X-ray loupe (auto-drifts on touch screens)
    const hm = $("#hero-ms"), hl = Loupe(hm, { radius: innerWidth < 860 ? 56 : 110 });
    hl.set(0.6, 0.45);
    loop(hm, (t) => {
      const r = hm.getBoundingClientRect();
      const inside = FINE && pointer.active && pointer.x > r.left && pointer.x < r.right && pointer.y > r.top && pointer.y < r.bottom;
      const tx = inside ? (pointer.x - r.left) / r.width : 0.5 + Math.sin(t * 0.5) * 0.28, ty = inside ? (pointer.y - r.top) / r.height : 0.5 + Math.cos(t * 0.4) * 0.22;
      hl.ease(clamp(tx, 0.08, 0.92), clamp(ty, 0.1, 0.9), innerWidth < 860 ? 56 : 110, RM ? 1 : 0.1);
    });

    // signature: scroll sweeps the loupe across the page and steps through the spectrum
    const run = $("#inspect"), sm = $("#sig-ms"), sl = Loupe(sm, { radius: 140 }), modes = $$(".k19-modes li");
    const layers = { uv: sm.querySelector(".uv"), ir: sm.querySelector(".ir"), xr: sm.querySelector(".xr") };
    let p = 0, mode = "vis";
    onScroll(() => {
      p = RM ? 0.7 : clamp((progress(run) - 0.04) / 0.9);
      const k = Math.min(3, Math.floor(p * 4)), next = ["vis", "uv", "ir", "xr"][k];
      if (next !== mode) { mode = next; modes.forEach((li) => li.classList.toggle("on", li.dataset.m === mode)); }
    });
    loop(sm, (t) => {
      const local = (p * 4) % 1;
      const r = sm.getBoundingClientRect();
      const inside = FINE && pointer.active && pointer.x > r.left && pointer.x < r.right && pointer.y > r.top && pointer.y < r.bottom;
      const tx = inside ? (pointer.x - r.left) / r.width : 0.15 + local * 0.7, ty = inside ? (pointer.y - r.top) / r.height : 0.3 + Math.sin(local * Math.PI) * 0.35;
      const R = mode === "vis" ? 0 : Math.min(r.width, r.height) * (innerWidth < 860 ? 0.32 : 0.26);
      sl.ease(tx, ty, R, RM ? 1 : 0.14);
      for (const key in layers) layers[key].style.visibility = key === mode ? "visible" : "hidden";
    });
  }),
};
