import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Obelisk";
const M = Object.fromEntries(MODELS.map((m) => [m.id, m]));
const LEAVES = [
  ["req_7f3a", "swift", 212, 38, 0], ["req_b20e", "core", 1840, 410, 0.5], ["req_e91c", "unbound", 900, 700, 0], ["req_4d77", "forge", 9400, 1900, 0.82],
  ["req_c03b", "core", 1200, 300, 0.6], ["req_91aa", "atlas", 48000, 900, 0.9], ["req_5e12", "swift", 3000, 200, 0.5], ["req_a8f0", "forge", 3400, 400, 0.92],
].map(([id, mid, i, o, c]) => ({ id, m: M[mid], tok: i + o, c: cost(M[mid], i, o, c) }));
const TOTAL = LEAVES.reduce((a, l) => a + l.c, 0);

export default {
  title: "Aether — Every token, traced to its request",
  description: "Usage itemised per request (tokens, cached tokens, model and cost), summed into one invoice you can audit line by line. Obelisk design direction.",
  fonts: [
    { family: "Bricolage Grotesque", axes: "opsz,wght@12..96,400..800" },
    { family: "JetBrains Mono", axes: "wght@400;500" },
  ],
  tokens: {
    bgPrimary: "#080808", bgSecondary: "#141414", accent: "#A855F7", onAccent: "#080808",
    textPrimary: "#F2F2F0", textMuted: "#A3A3A0", line: "#2A2A2A",
    display: '"Bricolage Grotesque", sans-serif', body: '"JetBrains Mono", ui-monospace, monospace',
  },
  css: /* css */ `
.z10-nav{position:sticky;top:0;z-index:40;height:56px;display:grid;grid-template-columns:repeat(12,1fr);align-items:stretch;background:var(--bg-primary);border-bottom:1px solid var(--line);font-size:.76rem}
.z10-nav>*{display:flex;align-items:center;padding:0 16px;border-right:1px solid var(--line)}
.z10-mark{grid-column:span 3;font-family:var(--font-display);font-weight:800;font-size:1.1rem;text-decoration:none;letter-spacing:-.02em;padding-left:var(--gutter)!important}
.z10-links{grid-column:span 7;gap:0;padding:0!important}
.z10-links a{flex:1;height:100%;display:flex;align-items:center;justify-content:center;text-decoration:none;color:var(--text-muted);border-right:1px solid var(--line)}
.z10-links a:last-child{border-right:0}
.z10-links a.is-current{background:var(--accent);color:var(--on-accent)}
.z10-blk{grid-column:span 2;justify-content:flex-end;color:var(--text-muted);border-right:0!important;padding-right:var(--gutter)!important;font-variant-numeric:tabular-nums}
@media (max-width:900px){.z10-nav{grid-template-columns:1fr auto}.z10-links{display:none!important}.z10-mark{grid-column:auto}.z10-blk{grid-column:auto}}
.z10-btn{display:inline-flex;align-items:center;gap:18px;min-height:58px;padding:0 26px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:700;font-size:1.05rem;text-decoration:none;border:1px solid var(--accent)}
.z10-btn span:last-child{font-family:var(--font-body);font-size:.8rem;transition:transform .35s var(--ease)}
.z10-btn.is-near span:last-child{transform:translateX(4px)}
.z10-h2{font-size:clamp(2.4rem,4.8vw,4.4rem);font-weight:700;letter-spacing:-.04em;line-height:.95;max-width:18ch}
.z10-fine{margin-top:22px;font-size:.76rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}
.cph{white-space:pre-wrap}

/* hero: exposed grid cells */
.z10-hero{min-height:calc(100svh - 56px);display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr auto;border-bottom:1px solid var(--line);background-image:linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:calc(100% / 12) 100%}
.z10-hero h1{grid-column:1 / span 9;padding:clamp(24px,5vh,56px) var(--gutter) 24px;font-weight:800;line-height:.9;max-width:none;border-bottom:1px solid var(--line)}
.z10-cell{border-right:1px solid var(--line);padding:24px}
.z10-sub{grid-column:1 / span 5;grid-row:2;display:grid;align-content:space-between;gap:20px;padding:28px var(--gutter)!important;border-right:1px solid var(--line)}
.z10-sub .k-body{color:var(--text-muted)}
.z10-tree{grid-column:6 / -1;grid-row:2 / span 2;position:relative;min-height:0}
.z10-tree svg{position:absolute;inset:16px;width:calc(100% - 32px);height:calc(100% - 32px)}
.z10-act{grid-column:1 / span 5;grid-row:3;display:flex;align-items:center;gap:20px;flex-wrap:wrap;padding:20px var(--gutter)!important;border-top:1px solid var(--line);border-right:1px solid var(--line)}
.z10-trust{font-size:.78rem;color:var(--text-muted)}
.z10-trust b{color:var(--text-primary);font-weight:500}
.z10-tag{grid-column:10 / -1;grid-row:1;align-self:end;padding:24px var(--gutter)!important;font-size:.76rem;color:var(--text-muted);border-bottom:1px solid var(--line);text-align:right}
@media (max-width:900px){
  .z10-hero{grid-template-columns:1fr;grid-template-rows:auto auto 120px auto;background-image:none}
  .z10-hero h1{grid-column:1;padding:18px var(--gutter) 14px}
  .z10-tag{display:none}
  .z10-sub{grid-column:1;padding:14px var(--gutter)!important;border-right:0}
  .z10-tree{grid-column:1;grid-row:3;border-top:1px solid var(--line)}
  .z10-tree svg{inset:6px;width:calc(100% - 12px);height:calc(100% - 12px)}
  .z10-act{grid-column:1;grid-row:4;padding:12px var(--gutter)!important;border-right:0;gap:10px}
}

/* problem */
.z10-grid2{display:grid;grid-template-columns:repeat(12,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
.z10-grid2 h2{grid-column:1 / span 5;padding:40px 24px 40px 0}
.z10-defects{grid-column:6 / -1;display:grid}
.z10-defects li{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--line)}
.z10-defects span{padding:22px 24px;border-right:1px solid var(--line);font-size:.86rem}
.z10-defects .was{color:var(--text-muted);text-decoration:line-through;text-decoration-color:#A3A3A055}
.z10-defects .now{font-family:var(--font-display);font-size:1.15rem;font-weight:600}
@media (max-width:900px){.z10-grid2{grid-template-columns:1fr;border-left:0}.z10-grid2 h2{grid-column:1;padding:0 0 28px}.z10-defects{grid-column:1}.z10-defects li{grid-template-columns:1fr}.z10-defects span{border-right:0;padding:14px 0}}

/* signature: ledger tree */
.z10-run{height:400vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.z10-pin{position:sticky;top:56px;height:calc(100vh - 56px);display:grid;grid-template-columns:minmax(0,1.7fr) minmax(280px,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.z10-board{position:relative;border-right:1px solid var(--line)}
.z10-board svg{position:absolute;inset:24px;width:calc(100% - 48px);height:calc(100% - 48px)}
.z10-root{display:grid;align-content:center;gap:16px;padding:32px}
.z10-root .lbl{font-size:.76rem;color:var(--text-muted)}
.z10-root b{font-family:var(--font-display);font-size:clamp(2.8rem,5vw,4.4rem);font-weight:700;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
.z10-root dl{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line)}
.z10-root dl div{padding:12px 0;border-bottom:1px solid var(--line);display:grid;gap:2px}
.z10-root dt{font-size:.6875rem;color:var(--text-muted)}
.z10-root dd{margin:0;font-size:1.05rem;font-variant-numeric:tabular-nums}
.z10-node rect{fill:#0E0E0E;stroke:#2A2A2A;transition:fill .4s,stroke .4s}
.z10-node text{font-family:"JetBrains Mono",monospace;font-size:11px;fill:#A3A3A0}
.z10-node .v{font-size:12px;fill:#F2F2F0}
.z10-node.ok rect{fill:#141414;stroke:#A855F7}
.z10-node.ok .v{fill:#A855F7}
.z10-edge{stroke:#2A2A2A;transition:stroke .4s}
.z10-edge.ok{stroke:#A855F7}
@media (max-width:900px){
  .z10-run{height:360vh}
  .z10-pin{grid-template-columns:1fr;grid-template-rows:1fr auto}
  .z10-board{border-right:0;border-bottom:1px solid var(--line)}
  .z10-board svg{inset:8px;width:calc(100% - 16px);height:calc(100% - 16px)}
  .z10-root{padding:14px var(--gutter);gap:8px}
  .z10-root b{font-size:2.2rem}
  .z10-root dl{grid-template-columns:repeat(4,1fr)}
}
@media (prefers-reduced-motion:reduce){.z10-run{height:auto}.z10-pin{position:relative;height:auto;min-height:100vh}}

/* spec bento */
.z10-spec{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
.z10-sc{position:relative;isolation:isolate;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;gap:14px;align-content:start;min-height:260px;transition:background .3s}
.z10-sc::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(240px circle at var(--mx) var(--my),rgba(166,166,166,0.073),transparent 65%);opacity:0;transition:opacity .3s}
.z10-sc:hover::before{opacity:1}
.z10-sc .id{display:flex;justify-content:space-between;font-size:.76rem;color:var(--text-muted)}
.z10-sc h3{font-family:var(--font-display);font-size:1.45rem;font-weight:700;letter-spacing:-.025em;line-height:1.08}
.z10-sc p{font-size:.84rem;color:var(--text-muted)}
.z10-sc.s0{grid-column:span 2;grid-row:span 2;background:var(--bg-secondary)}.z10-sc.s0 h3{font-size:clamp(2rem,3.2vw,2.8rem)}
.z10-sc.s5{grid-column:span 2}
@media (max-width:900px){.z10-spec{grid-template-columns:1fr}.z10-sc{grid-column:auto!important;grid-row:auto!important;min-height:0}}

/* rail */
.z10-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.z10-steps{padding:0 var(--gutter);gap:0}
.z10-step{width:min(560px,52vw);border:1px solid var(--line);margin-right:-1px;display:grid;gap:14px;align-content:start;background:var(--bg-primary)}
.z10-step.is-active{background:var(--bg-secondary)}
.z10-step .n{font-family:var(--font-display);font-size:4rem;font-weight:800;line-height:.9;letter-spacing:-.05em;color:var(--text-muted)}
.z10-step.is-active .n{color:var(--accent)}
.z10-step h3{font-family:var(--font-display);font-size:1.7rem;font-weight:700;line-height:1.05}
.z10-step p{color:var(--text-muted);font-size:.86rem}
.z10-step pre{margin:0;background:#0E0E0E;border:1px solid var(--line);padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.z10-step{width:auto;margin-right:0;margin-bottom:-1px}}

/* attestations */
.z10-att{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
.z10-a{border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;gap:14px}
.z10-a .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.76rem;color:var(--text-muted)}
.z10-a b{font-family:var(--font-display);font-size:1.1rem;color:var(--text-primary)}
.z10-a q{font-size:.92rem;line-height:1.6;quotes:"“" "”"}
@media (max-width:760px){.z10-att{grid-template-columns:1fr}}

/* tariff */
.z10-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line)}
.z10-plan{border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;gap:12px;align-content:start}
.z10-plan.feat{background:var(--bg-secondary)}
.z10-plan h3{font-family:var(--font-display);font-size:1.3rem;font-weight:700}
.z10-plan .p{font-family:var(--font-display);font-size:3rem;font-weight:800;letter-spacing:-.05em;line-height:.95}
.z10-plan .cad{font-size:.76rem;color:var(--text-muted)}
.z10-plan ul{display:grid;gap:6px;font-size:.84rem}
.z10-plan li::before{content:"— ";color:var(--text-muted)}
.z10-plan .fk{font-size:.78rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.z10-plans{grid-template-columns:1fr}}
.z10-table{width:100%;margin-top:32px;border-collapse:collapse;font-size:.82rem;font-variant-numeric:tabular-nums}
.z10-table caption{text-align:left;font-family:var(--font-display);font-size:1.2rem;font-weight:700;padding-bottom:12px}
.z10-table th,.z10-table td{text-align:left;padding:12px;border:1px solid var(--line)}
.z10-table thead th{font-weight:400;color:var(--text-muted);font-size:.76rem}
@media (max-width:700px){.z10-table th:nth-child(2),.z10-table td:nth-child(2){display:none}}

/* final + footer */
.z10-final{display:grid;grid-template-columns:repeat(12,1fr);gap:24px;align-items:end}
.z10-final h2{grid-column:1 / span 8;font-size:clamp(3rem,7vw,6rem)}
.z10-final div{grid-column:9 / -1;justify-self:end}
@media (max-width:900px){.z10-final h2,.z10-final div{grid-column:1 / -1;justify-self:start}}
.z10-foot{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);font-size:.76rem;color:var(--text-muted)}
.z10-foot>div{padding:40px var(--gutter);border-right:1px solid var(--line);display:grid;gap:8px;align-content:start}
.z10-foot h3{font-family:var(--font-display);font-size:.9rem;color:var(--text-primary)}
.z10-foot a{text-decoration:none}
.z10-foot a:hover{color:var(--text-primary)}
.z10-foot .legal{grid-column:1 / -1;padding:20px var(--gutter);border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.z10-foot{grid-template-columns:1fr 1fr}}
`,
  body: h`
<header class="z10-nav">
  <a class="z10-mark" href="#main">${BRAND.name}</a>
  <nav class="z10-links" data-spy aria-label="Sections"><a href="#defects">Defects</a><a href="#ledger">Ledger</a><a href="#spec">Spec</a><a href="#protocol">Protocol</a><a href="#attest">Attest</a><a href="#tariff">Tariff</a></nav>
  <span class="z10-blk" id="blk" aria-hidden="true">#000000</span>
</header>
<main id="main">
  <section class="z10-hero" data-hero aria-labelledby="z10-h">
    <h1 id="z10-h" data-hero-part="headline" data-cipher>Every token, traced.</h1>
    <p class="z10-tag" aria-hidden="true">Ledger view · sample data</p>
    <div class="z10-cell z10-sub"><p class="k-body" data-hero-part="sub">Usage is itemised per request (tokens, cached tokens, model and cost), then summed into one invoice you can audit line by line.</p></div>
    <div class="z10-tree" data-hero-part="visual"><svg id="mini" role="img" aria-label="A small ledger tree whose leaves verify one by one; hover a leaf to trace it to the root"></svg></div>
    <div class="z10-cell z10-act">
      <div data-hero-part="cta"><a class="z10-btn" href="#tariff" data-cta="primary" data-magnetic="4,0.28,0.56,0.3"><span data-magnetic-label>Get your API key</span><span aria-hidden="true">[K]</span></a></div>
      <p class="z10-trust" data-hero-part="trust">Sample invoice: <b>${LEAVES.length} requests</b>, <b>${usd(TOTAL)}</b> at sample rates.</p>
    </div>
  </section>

  <section id="defects" data-section aria-labelledby="z10-d">
    <div class="k-wrap z10-grid2">
      <h2 id="z10-d" class="z10-h2" data-cipher>Three defects in how AI is billed.</h2>
      <ol class="z10-defects" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ol>
    </div>
    <div class="z10-run" id="ledger">
      <div class="z10-pin">
        <div class="z10-board"><svg id="tree" role="img" aria-label="Ledger tree: eight requests at the leaves, their sums climbing to the invoice root"></svg></div>
        <aside class="z10-root" aria-live="polite">
          <span class="lbl">Invoice root</span>
          <b class="live" id="root">$0.0000</b>
          <dl><div><dt>Leaves verified</dt><dd id="r-n">0 / 8</dd></div><div><dt>Tokens</dt><dd id="r-tok">0</dd></div><div><dt>Models</dt><dd id="r-m">0</dd></div><div><dt>Depth</dt><dd>3</dd></div></dl>
          <p class="z10-fine">A sum tree with request IDs: an audit view, not a cryptographic proof. ${PRICE_NOTE}</p>
        </aside>
      </div>
    </div>
  </section>

  <section id="spec" data-section aria-labelledby="z10-s">
    <div class="k-wrap">
      <h2 id="z10-s" class="z10-h2" data-cipher>Specification, and what each line gets you.</h2>
      <div class="z10-spec" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="z10-sc k-card s${i}" data-spot><p class="id"><span>§${i + 1}</span><span>${f}</span></p><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="protocol" data-section aria-labelledby="z10-p">
    <div data-rail>
      <div data-rail-view>
        <div class="z10-rail-head"><h2 id="z10-p" class="z10-h2" data-cipher>Protocol: three steps.</h2></div>
        <ol class="z10-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="z10-step k-card"><span class="n">0${i + 1}</span><h3>${t}</h3><p>${d}</p><pre><code>${["model: \"forge-256k\"", `baseURL: "${BRAND.apiBase}"`, "GET /v1/usage?group_by=request"][i]}</code></pre></li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="attest" data-section aria-labelledby="z10-a">
    <div class="k-wrap">
      <h2 id="z10-a" class="z10-h2" data-cipher>Attestations, by role.</h2>
      <div class="z10-att" data-stagger>${PROOF.map(([role, focus, q], i) => `<article class="z10-a k-card"><p class="hd"><b>${role}</b><span>att_${String(i + 1).padStart(2, "0")} · ${focus}</span></p><q>${q}</q></article>`)}</div>
      <p class="z10-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="tariff" data-section aria-labelledby="z10-t">
    <div class="k-wrap">
      <h2 id="z10-t" class="z10-h2" data-cipher>Tariff. Per token, per model.</h2>
      <div class="z10-plans" data-stagger>${PLANS.map((p) => h`<article class="z10-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="z10-table" data-reveal>
        <caption>Rates per 1M tokens</caption>
        <thead><tr><th scope="col">Model</th><th scope="col">Role</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td>${m.role}</td><td>${m.context}</td><td>${rate(m.inPrice)}</td><td>${rate(m.cached)}</td><td>${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="z10-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="z10-f">
    <div class="k-wrap z10-final">
      <h2 id="z10-f" class="z10-h2" data-cipher>Audit every token. Pay for every token.</h2>
      <div><a class="z10-btn" href="#main" data-magnetic="4,0.28,0.56,0.3"><span data-magnetic-label>Get your API key</span><span aria-hidden="true">[K]</span></a></div>
    </div>
  </section>
</main>
<footer class="z10-foot">
  <div><h3>${BRAND.name}</h3><span>${conceptNote(STYLE)}</span></div>
  <div><h3>Models</h3>${MODELS.map((m) => `<a href="#tariff">${m.name}</a>`)}</div>
  <div><h3>Platform</h3><a href="#ledger">Usage ledger</a><a href="#protocol">API quickstart</a><a href="#tariff">Token rates</a></div>
  <div><h3>Exhibition</h3><a href="../index.html">Back to the collection</a><a href="../fingerprint-registry.json">Fingerprint registry</a></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Bricolage Grotesque and JetBrains Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, onScroll, progress } = K;
    const NS = "http://www.w3.org/2000/svg";
    const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
    const M = Object.fromEntries(AE.MODELS.map((m) => [m.id, m]));
    const cost = (m, i, o, c) => ((i * (1 - c)) * m.inPrice + i * c * m.cached + o * m.outPrice) / 1e6;
    const LEAVES = [["req_7f3a", "swift", 212, 38, 0], ["req_b20e", "core", 1840, 410, 0.5], ["req_e91c", "unbound", 900, 700, 0], ["req_4d77", "forge", 9400, 1900, 0.82], ["req_c03b", "core", 1200, 300, 0.6], ["req_91aa", "atlas", 48000, 900, 0.9], ["req_5e12", "swift", 3000, 200, 0.5], ["req_a8f0", "forge", 3400, 400, 0.92]]
      .map(([id, mid, i, o, c]) => ({ id, mid, tok: i + o, c: cost(M[mid], i, o, c) }));
    const fmt = (n) => "$" + n.toFixed(4);

    // —— cipher decode for headings as they arrive ——
    const GL = "▖▗▘▙▚▛▜▝▞▟░▒▓█#$%&*+<>/\\";
    $$("[data-cipher]").forEach((el) => {
      const text = el.textContent;
      el.innerHTML = '<span class="k-sr"></span><span class="cph" aria-hidden="true"></span>';
      el.firstChild.textContent = text; const out = el.lastChild; out.textContent = text;
      if (RM) return;
      const run = () => {
        const t0 = performance.now(), dur = 700 + text.length * 14;
        const step = (t) => {
          const p = clamp((t - t0) / dur);
          out.textContent = text.split("").map((ch, i) => (ch === " " || i / text.length < p ? ch : GL[(Math.random() * GL.length) | 0])).join("");
          if (p < 1) requestAnimationFrame(step); else out.textContent = text;
        };
        requestAnimationFrame(step);
      };
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); run(); } }, { rootMargin: "0px 0px -10% 0px" });
      io.observe(el);
    });

    // block counter in the nav
    const blk = $("#blk"); let b = 0;
    setInterval(() => { b = (b + 1) % 0xffffff; blk.textContent = "#" + (b * 2654435761 % 0xffffff).toString(16).padStart(6, "0"); }, 900);

    // —— a ledger tree renderer: leaves at the bottom, sums climbing to the root ——
    function Tree(svg, { W = 960, H = 520, compact = false } = {}) {
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const levels = [LEAVES.map((l) => ({ ...l, v: l.c })), [], [], []];
      for (let d = 1; d < 4; d++) for (let i = 0; i < levels[d - 1].length; i += 2) levels[d].push({ kids: [i, i + 1], v: levels[d - 1][i].v + levels[d - 1][i + 1].v });
      const nodes = [], edges = [];
      const bw = compact ? 96 : 104, bh = compact ? 34 : 46;
      const pos = (d, i) => { const n = levels[d].length; return [((i + 0.5) / n) * W, H - 20 - bh - d * ((H - 40 - bh) / 3)]; };
      for (let d = 1; d < 4; d++) levels[d].forEach((n, i) => n.kids.forEach((k) => { const [x0, y0] = pos(d, i), [x1, y1] = pos(d - 1, k); edges.push({ d, i, el: mk("path", { d: `M${x0} ${y0 + bh}V${(y0 + bh + y1) / 2}H${x1}V${y1}`, class: "z10-edge", fill: "none" }, svg) }); }));
      levels.forEach((lv, d) => lv.forEach((n, i) => {
        const [x, y] = pos(d, i), g = mk("g", { class: "z10-node", transform: `translate(${x - bw / 2} ${y})` }, svg);
        mk("rect", { width: bw, height: bh }, g);
        const t1 = mk("text", { x: 8, y: compact ? 14 : 18 }, g); t1.textContent = d === 0 ? n.id : d === 3 ? "invoice" : "sum·" + d;
        const t2 = mk("text", { x: 8, y: compact ? 28 : 36, class: "v" }, g); t2.textContent = d === 0 && !compact ? n.mid : fmt(n.v);
        nodes.push({ d, i, g, n });
      }));
      const verified = (d, i, k) => (d === 0 ? i < k : levels[d][i].kids.every((c) => verified(d - 1, c, k)));
      return {
        set(k) {
          nodes.forEach(({ d, i, g }) => g.classList.toggle("ok", verified(d, i, k)));
          edges.forEach((e) => e.el.classList.toggle("ok", verified(e.d, e.i, k)));
        },
      };
    }

    // hero: a compact tree that verifies on a loop
    const mini = Tree($("#mini"), { W: 900, H: 420, compact: true });
    let k = 0;
    mini.set(RM ? 8 : 0);
    if (!RM) setInterval(() => { k = (k + 1) % 11; mini.set(Math.min(8, k)); }, 650);

    // signature: scroll verifies leaf by leaf; the root accumulates the invoice
    const run = $("#ledger"), tree = Tree($("#tree"));
    const root = $("#root"), rn = $("#r-n"), rt = $("#r-tok"), rm = $("#r-m");
    onScroll(() => {
      const p = RM ? 1 : clamp((progress(run) - 0.05) / 0.85);
      const n = Math.min(8, Math.floor(p * 8.999));
      tree.set(n);
      const done = LEAVES.slice(0, n);
      root.textContent = fmt(done.reduce((a, l) => a + l.c, 0));
      rn.textContent = n + " / 8";
      rt.textContent = done.reduce((a, l) => a + l.tok, 0).toLocaleString("en-US");
      rm.textContent = new Set(done.map((l) => l.mid)).size;
    });
  }),
};
