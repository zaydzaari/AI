// The Master Exhibition Gallery: awwwards-20-collection/index.html.
// Called by build.mjs after a full build. Filter, sort, preview, inspect 60-30-10 tokens and
// font pairings, and open any of the 20 sites in one click. Each site's name is set in that
// site's own heading font (one face per site, loaded from the site's fonts/ folder).
import fs from "node:fs";
import path from "node:path";
import { h, iife, esc, page } from "./lib.mjs";
import { fontFaces } from "./fonts.mjs";
import { BRAND } from "./aether.mjs";

const hue = (hex) => {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 0;
  const hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round((hh * 60 + 360) % 360);
};
const short = (s) => s.split(":")[0].trim();

/** One @font-face per site for its heading font, aliased "Snn", pointing into the site's fonts/. */
function specimenFaces(root, sites) {
  let css = "";
  for (const s of sites) {
    const html = fs.readFileSync(path.join(root, s.folder, "index.html"), "utf8");
    const faces = [...html.matchAll(/@font-face\{font-family:"([^"]+)";font-style:(\w+);font-weight:([\d ]+);font-display:swap;src:url\(fonts\/([^)]+)\) format\("woff2"\)(;unicode-range:[^}]+)?\}/g)]
      .filter((f) => f[1] === s.heading_font && f[2] === "normal");
    if (!faces.length) throw new Error(`gallery: no ${s.heading_font} face in ${s.folder}`);
    const dist = (w) => { const [a, b = a] = w.split(" ").map(Number); return 600 >= a && 600 <= b ? 0 : Math.min(Math.abs(600 - a), Math.abs(600 - b)); };
    const f = faces.sort((a, b) => dist(a[3]) - dist(b[3]))[0];
    css += `@font-face{font-family:"S${s.id}";font-style:normal;font-weight:${f[3]};font-display:swap;src:url(${s.folder}/fonts/${f[4]}) format("woff2")${f[5] || ""}}\n`;
  }
  return css;
}

export function buildGallery(root, built) {
  const sites = built;
  const dark = sites.filter((s) => s.mode === "dark").length, light = sites.length - dark;
  const fontsUnique = new Set(sites.map((s) => s.heading_font)).size;
  const accentsUnique = new Set(sites.map((s) => s.color_system_60_30_10.accent_10.toLowerCase())).size;
  const DATA = sites.map((s) => ({
    id: s.id, folder: s.folder, name: s.name, mode: s.mode, inspiration: s.inspiration, movement: s.aesthetic_movement,
    heading: s.heading_font, body: s.body_font, blueprint: s.blueprint_heading_font || "",
    p: s.color_system_60_30_10.primary_60, s: s.color_system_60_30_10.secondary_30, a: s.color_system_60_30_10.accent_10,
    text: s.tokens.textPrimary, muted: s.tokens.textMuted, onAccent: s.tokens.onAccent,
    hero: s.hero_layout_type, sig: s.signature_scroll_mechanic, line: s.title.replace(/^[^—]+—\s*/, ""), hue: hue(s.color_system_60_30_10.accent_10),
  }));

  const card = (d, i) => h`
<article class="g-ex" id="s${d.id}" data-mode="${d.mode}" data-n="${+d.id}" data-hue="${d.hue}" style="--sp:${d.p};--ss:${d.s};--sa:${d.a}">
  <a class="g-shot" href="${d.folder}/index.html" aria-label="Open ${d.id} ${esc(d.name)}">
    <img src="${d.folder}/preview.jpg" width="720" height="450" loading="lazy" decoding="async" alt="Desktop hero of ${d.id} ${esc(d.name)}">
    <span class="g-phone" aria-hidden="true"><img src="${d.folder}/preview-mobile.jpg" width="300" height="534" loading="lazy" decoding="async" alt=""></span>
  </a>
  <div class="g-meta k-card" data-spot>
    <p class="g-no"><span>N° ${d.id}</span><span>${d.mode === "dark" ? "Dark" : "Light"}</span></p>
    <h3 style="font-family:'S${d.id}'">${esc(d.name)}</h3>
    <p class="g-line">“${esc(d.line)}”</p>
    <div class="g-tok" role="img" aria-label="60-30-10 colour system: ${d.p}, ${d.s}, ${d.a}"><span style="background:${d.p};flex:6"></span><span style="background:${d.s};flex:3"></span><span style="background:${d.a};flex:1"></span></div>
    <p class="g-hex"><span><i style="background:${d.p}"></i>60 ${d.p}</span><span><i style="background:${d.s}"></i>30 ${d.s}</span><span><i style="background:${d.a}"></i>10 ${d.a}</span></p>
    <dl class="g-fp"><div><dt>Type</dt><dd>${esc(d.heading)} / ${esc(d.body)}</dd></div><div><dt>Signature</dt><dd>${esc(short(d.sig))}</dd></div></dl>
    <div class="g-act"><a class="g-open" href="${d.folder}/index.html">Open site <svg class="g-ar" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></a><button type="button" class="g-insp" data-i="${i}">Inspect</button></div>
  </div>
</article>`;

  const site = {
    name: "Exhibition Gallery",
    mode: "dark",
    title: "SOTD 2026 Collection — Aether, twenty ways",
    description: `Twenty landing-page directions for ${BRAND.name}, an AI platform selling model access and API tokens. Filter, preview, inspect tokens and font pairings, and open any site.`,
    tokens: {
      bgPrimary: "#0B0B0C", bgSecondary: "#161618", accent: "#F3EEE4", onAccent: "#0B0B0C",
      textPrimary: "#ECE9E3", textMuted: "#A19D95", line: "rgba(236,233,227,.12)",
      display: '"Bodoni Moda", serif', body: '"Schibsted Grotesk", sans-serif',
    },
    css: /* css */ `
:root{--h1-weight:500;--mono:"DM Mono",monospace}
.g-ar{width:14px;height:14px;flex:none}
.g-nav{position:sticky;top:0;z-index:50;height:60px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:0 var(--gutter);background:#0B0B0C;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:.74rem;letter-spacing:.06em}
.g-mark{text-decoration:none;display:flex;gap:12px;align-items:baseline}
.g-mark b{font-family:var(--font-display);font-size:1.35rem;font-weight:600;letter-spacing:0}
.g-mark span{color:var(--text-muted)}
.g-links{display:flex;gap:6px}
.g-links a{text-decoration:none;color:var(--text-muted);padding:8px 12px;border-radius:99px}
.g-links a:hover{color:var(--text-primary)}
.g-links a.is-current{color:var(--on-accent);background:var(--accent)}
.g-count{color:var(--text-muted)}
@media (max-width:760px){.g-links,.g-count{display:none}}
.g-btn{display:inline-flex;align-items:center;gap:14px;min-height:56px;padding:0 28px;border-radius:99px;background:var(--accent);color:var(--on-accent);font-weight:600;font-size:1rem;text-decoration:none}
.g-btn i{font-style:normal;transition:transform .5s var(--ease)}
.g-btn.is-near i{transform:translateY(3px)}
.g-kick{font-family:var(--mono);font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted)}
.g-h2{font-size:clamp(2.4rem,4.6vw,4.2rem);font-weight:500;letter-spacing:-.02em;line-height:1;max-width:18ch}
.g-h2 em{font-style:italic}

/* hero */
.g-hero{min-height:calc(100svh - 60px);display:grid;grid-template-columns:5fr 7fr;gap:clamp(32px,4vw,64px);align-items:center;padding:28px var(--gutter)}
.g-copy{display:grid;gap:24px;justify-items:start}
.g-copy h1{max-width:11ch}
.g-copy h1 em{font-style:italic;font-weight:400}
.g-copy .k-body{color:var(--text-muted);max-width:44ch}
.g-trust{display:flex;flex-wrap:wrap;gap:8px 22px;font-family:var(--mono);font-size:.76rem;color:var(--text-muted)}
.g-trust b{color:var(--text-primary);font-weight:500}
.g-spec{position:relative;height:min(74vh,700px);border-radius:14px;overflow:hidden;border:1px solid var(--line);cursor:pointer;touch-action:pan-y}
.g-spec canvas{position:absolute;inset:0;width:100%;height:100%}
.g-spec p{position:absolute;left:14px;bottom:10px;font-family:var(--mono);font-size:.68rem;color:#ECE9E3;background:#0B0B0Ccc;padding:3px 8px;border-radius:99px;pointer-events:none}
@media (max-width:900px){
  .g-hero{grid-template-columns:1fr;gap:14px;padding:14px var(--gutter);align-content:start;min-height:0}
  .g-copy{gap:12px}
  .g-btn{min-height:52px}
  .g-trust{font-size:.7rem;gap:2px 12px}
  .g-spec{height:150px}
  .g-spec p{display:none}
}

/* wall */
.g-bar{position:sticky;top:60px;z-index:30;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 20px;padding:14px 0;margin-top:clamp(64px,6vw,80px);background:#0B0B0C;box-shadow:0 -40px 0 #0B0B0C;border-bottom:1px solid var(--line)}
.g-chips{display:flex;flex-wrap:wrap;gap:8px}
.g-chip{min-height:44px;padding:0 18px;border-radius:99px;border:1px solid var(--line);background:transparent;font-family:var(--mono);font-size:.78rem;color:var(--text-muted)}
.g-chip:hover{color:var(--text-primary);border-color:#ECE9E355}
.g-chip[aria-pressed="true"]{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.g-shown{font-family:var(--mono);font-size:.76rem;color:var(--text-muted)}
.g-wall{margin-top:40px;display:grid;grid-template-columns:repeat(2,1fr);gap:28px}
.g-ex{display:grid;grid-template-rows:auto 1fr;border-radius:14px;overflow:hidden;background:var(--bg-secondary);border:1px solid var(--line)}
.g-ex[hidden]{display:none}
.g-ex.is-ping{box-shadow:0 0 0 2px var(--accent)}
.g-shot{position:relative;display:block;aspect-ratio:16/10;overflow:hidden;background:var(--sp)}
.g-shot>img{width:100%;height:100%;object-fit:cover;transition:transform .9s var(--ease)}
.g-phone{position:absolute;right:18px;bottom:-40px;width:22%;aspect-ratio:300/534;border-radius:14px;overflow:hidden;border:3px solid #0B0B0C;box-shadow:0 20px 40px -12px #000c;transform:translateY(0);transition:transform .7s var(--ease)}
.g-phone img{width:100%;height:100%;object-fit:cover}
.g-shot:hover>img,.g-shot:focus-visible>img{transform:scale(1.035)}
.g-shot:hover .g-phone,.g-shot:focus-visible .g-phone{transform:translateY(-52px)}
.g-meta{position:relative;isolation:isolate;display:grid;gap:14px;align-content:start}
.g-meta::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(300px circle at var(--mx) var(--my),#ECE9E30f,transparent 65%);opacity:0;transition:opacity .3s}
.g-meta:hover::before{opacity:1}
.g-no{display:flex;justify-content:space-between;font-family:var(--mono);font-size:.74rem;color:var(--text-muted);letter-spacing:.06em}
.g-meta h3{font-size:clamp(1.9rem,2.6vw,2.5rem);font-weight:500;line-height:1.02;letter-spacing:-.01em}
.g-line{font-size:.92rem;color:var(--text-muted)}
.g-tok{display:flex;height:14px;border-radius:99px;overflow:hidden;border:1px solid var(--line)}
.g-hex{display:flex;flex-wrap:wrap;gap:6px 18px;font-family:var(--mono);font-size:.72rem;color:var(--text-muted)}
.g-hex span{display:inline-flex;align-items:center;gap:7px}
.g-hex i{width:10px;height:10px;border-radius:50%;border:1px solid #ECE9E340}
.g-fp{display:grid;gap:8px;font-size:.86rem}
.g-fp div{display:grid;grid-template-columns:88px 1fr;gap:12px}
.g-fp dt{font-family:var(--mono);font-size:.72rem;color:var(--text-muted);padding-top:2px}
.g-fp dd{margin:0}
.g-act{display:flex;gap:10px;flex-wrap:wrap;padding-top:6px}
.g-open,.g-insp{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border-radius:99px;font-size:.88rem;font-weight:600;text-decoration:none}
.g-open{background:var(--accent);color:var(--on-accent)}
.g-insp{background:transparent;border:1px solid #ECE9E340;color:var(--text-primary)}
.g-insp:hover{border-color:var(--text-primary)}
@media (max-width:900px){.g-wall{grid-template-columns:1fr;gap:20px}.g-bar{top:60px}}

/* laws */
.g-laws{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.g-law{font-family:var(--font-display);font-size:clamp(1.5rem,2.4vw,2.1rem);line-height:1.25;font-weight:400}
.g-law em{font-style:italic}
.g-dna{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.g-rule{display:grid;gap:12px;align-content:start;border:1px solid var(--line);border-radius:14px;background:var(--bg-secondary)}
.g-rule .n{font-family:var(--mono);font-size:.72rem;color:var(--text-muted)}
.g-rule h3{font-size:1.7rem;font-weight:500}
.g-rule p{font-size:.9rem;color:var(--text-muted)}
.g-run{margin-top:28px;display:grid;gap:10px}
.g-run pre{margin:0;padding:16px 18px;border-radius:10px;background:var(--bg-secondary);border:1px solid var(--line);font-family:var(--mono);font-size:.8rem;overflow-x:auto;white-space:pre}
@media (max-width:900px){.g-laws{grid-template-columns:1fr;gap:32px}.g-dna{grid-template-columns:1fr}}

/* registry */
.g-tw{margin-top:clamp(64px,6vw,80px);overflow-x:auto;border:1px solid var(--line);border-radius:14px}
.g-table{width:100%;min-width:1100px;border-collapse:collapse;font-size:.82rem}
.g-table th,.g-table td{text-align:left;vertical-align:top;padding:14px 16px;border-bottom:1px solid var(--line)}
.g-table thead th{font-family:var(--mono);font-weight:400;font-size:.7rem;color:var(--text-muted);letter-spacing:.06em;background:var(--bg-secondary)}
.g-table tbody th{font-weight:500;white-space:nowrap}
.g-table tbody th a{text-decoration:none}
.g-table tbody th a:hover{text-decoration:underline}
.g-table .nm{font-size:1.25rem;display:block;line-height:1.1}
.g-table .sw{display:flex;gap:4px;align-items:center;font-family:var(--mono);font-size:.7rem;color:var(--text-muted);white-space:nowrap}
.g-table .sw i{width:16px;height:16px;border-radius:4px;border:1px solid #ECE9E340}
.g-table td{color:var(--text-muted)}
.g-table td b{color:var(--text-primary);font-weight:500}

/* inspector */
.g-dlg{width:min(1180px,100vw - 32px);max-height:calc(100vh - 32px);padding:0;border:1px solid var(--line);border-radius:18px;background:var(--bg-secondary);color:var(--text-primary);overflow:auto}
.g-dlg::backdrop{background:#000000b8}
.g-dlg[open]{animation:g-in .5s var(--ease)}
@keyframes g-in{from{opacity:0;transform:translateY(24px) scale(.98)}to{opacity:1;transform:none}}
.g-di{display:grid;grid-template-columns:7fr 5fr}
.g-dv{position:relative;display:grid;align-content:center;background:var(--dv,#000);min-height:320px;padding:0 0 64px}
.g-dv>img{width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;display:block}
.g-dv .g-phone{bottom:24px;width:26%}
.g-dt{display:grid;gap:16px;align-content:start;padding:clamp(24px,3vw,40px)}
.g-dt h2{font-size:clamp(2rem,3.4vw,3rem);font-weight:500;line-height:1}
.g-dt .k-muted{font-size:.9rem}
.g-sw3{display:grid;grid-template-columns:6fr 3fr 1.4fr;gap:6px}
.g-sw3 div{border-radius:10px;padding:12px;min-height:84px;display:grid;align-content:end;font-family:var(--mono);font-size:.7rem;line-height:1.4;border:1px solid #ECE9E326}
.g-ct{display:grid;gap:4px;font-family:var(--mono);font-size:.74rem;color:var(--text-muted)}
.g-ct b{color:var(--text-primary);font-weight:500}
.g-dl{display:grid;gap:10px;font-size:.86rem}
.g-dl div{display:grid;grid-template-columns:96px 1fr;gap:12px}
.g-dl dt{font-family:var(--mono);font-size:.72rem;color:var(--text-muted);padding-top:2px}
.g-dl dd{margin:0}
.g-dbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding-top:8px}
.g-x{position:absolute;right:14px;top:14px;z-index:2;width:44px;height:44px;border-radius:50%;border:1px solid #ECE9E340;background:#0B0B0Ccc;color:var(--text-primary);font-size:1.1rem}
@media (max-width:900px){.g-di{grid-template-columns:1fr}.g-dv{min-height:0;padding:0}.g-dv .g-phone{display:none}}

/* footer */
.g-foot{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.82rem;color:var(--text-muted)}
.g-foot h4{font-family:var(--mono);font-size:.74rem;font-weight:400;letter-spacing:.08em;color:var(--text-primary);margin-bottom:12px}
.g-foot ul{display:grid;gap:8px}
.g-foot a{text-decoration:none}
.g-foot a:hover{color:var(--text-primary)}
@media (max-width:760px){.g-foot{grid-template-columns:1fr}}
`,
    body: h`
<header class="g-nav">
  <a class="g-mark" href="#main"><b>${BRAND.name}</b><span>SOTD 2026 COLLECTION</span></a>
  <nav class="g-links" data-spy aria-label="Sections"><a href="#wall">Wall</a><a href="#laws">Laws</a><a href="#registry">Registry</a></nav>
  <span class="g-count">${sites.length} / 20 built</span>
</header>
<main id="main">
  <section class="g-hero" data-hero aria-labelledby="g-h">
    <div class="g-copy">
      <p class="g-kick">Exhibition · ${sites.length} directions · one product</p>
      <h1 id="g-h" data-hero-part="headline">${BRAND.name}, <em>twenty ways.</em></h1>
      <p class="k-body" data-hero-part="sub">Twenty landing pages for one AI platform that sells models, abliterated variants, coding agents and API tokens. One product, twenty visual languages.</p>
      <div data-hero-part="cta"><a class="g-btn" href="#wall" data-cta="primary" data-magnetic="6,0.18,0.72,0.35"><span data-magnetic-label>Enter the collection</span><i aria-hidden="true">↓</i></a></div>
      <p class="g-trust" data-hero-part="trust"><span><b>${fontsUnique}</b> heading fonts</span><span><b>${accentsUnique}</b> accents</span><span><b>0</b> shared signatures</span><span>checked at <b>1440</b> and <b>375</b></span></p>
    </div>
    <div class="g-spec" data-hero-part="visual"><canvas id="g-spec" role="img" aria-label="All twenty colour systems side by side, each split 60, 30 and 10 percent. Point to magnify one; click to inspect it."></canvas><p>Point to magnify a palette · click to inspect</p></div>
  </section>

  <section id="wall" data-section aria-labelledby="g-w">
    <div class="k-wrap">
      <p class="g-kick" data-reveal>The wall</p>
      <h2 id="g-w" class="g-h2" data-reveal>Every direction, <em>one click</em> from live.</h2>
      <div class="g-bar">
        <div class="g-chips" role="group" aria-label="Filter by mode">
          <button type="button" class="g-chip" data-f="all" aria-pressed="true">All ${sites.length}</button>
          <button type="button" class="g-chip" data-f="dark" aria-pressed="false">Dark ${dark}</button>
          <button type="button" class="g-chip" data-f="light" aria-pressed="false">Light ${light}</button>
        </div>
        <div class="g-chips" role="group" aria-label="Sort">
          <button type="button" class="g-chip" data-s="n" aria-pressed="true">By number</button>
          <button type="button" class="g-chip" data-s="hue" aria-pressed="false">By accent hue</button>
        </div>
        <p class="g-shown" aria-live="polite" id="g-shown">Showing ${sites.length} of ${sites.length}</p>
      </div>
      <div class="g-wall" id="g-wall" data-stagger>${DATA.map(card)}</div>
    </div>
  </section>

  <section id="laws" data-section aria-labelledby="g-l">
    <div class="k-wrap">
      <div class="g-laws">
        <div><p class="g-kick" data-reveal>The laws</p><h2 id="g-l" class="g-h2" data-reveal>One product, <em>no repeats.</em></h2></div>
        <div>
          <p class="g-law" data-reveal>No two sites share a <em>heading font</em>, an <em>accent colour</em>, a <em>hero structure</em> or a <em>signature scroll mechanic</em>. The build refuses to run if they do.</p>
          <div class="g-run" data-reveal>
            <pre><code>node awwwards-20-collection/_build/build.mjs</code></pre>
            <pre><code>node awwwards-20-collection/serve.mjs</code></pre>
            <pre><code>node awwwards-20-collection/_build/verify.cjs</code></pre>
          </div>
        </div>
      </div>
      <div class="g-dna" data-stagger>
        ${[
          ["Type", "H1 at clamp(3.25rem, 6vw, 5rem) with −0.03em tracking. Body 1.05rem at 1.7, never wider than 65ch. No Inter, Roboto, Open Sans, Lato, Arial or system fonts."],
          ["Colour", "Each site is a 60-30-10 system. The accent appears only on calls to action, the active nav item and live data. Contrast is checked against WCAG AA with axe."],
          ["Space", "Sections breathe at 120px (72px on mobile), blocks sit 64–80px apart, cards pad 36–40px, and a 3.5% grain sits over everything."],
          ["Hero", "Headline, sub, one magnetic CTA, an interactive procedural visual and a concrete trust signal, all above the fold at 1440 × 900 and 375 × 667."],
          ["Story", "Seven beats: hero, problem with the signature mechanic, benefit bento, a pinned three-step rail, role-based proof, pricing with per-token rates, final CTA."],
          ["Motion", "Vertical-only reveals with 80ms staggers. Spotlight and magnetism on fine pointers only. Transform, opacity, clip-path and filter only; off-screen loops pause; reduced motion unpins."],
        ].map(([t, d], i) => `<article class="g-rule k-card"><p class="n">RULE ${String(i + 1).padStart(2, "0")}</p><h3>${t}</h3><p>${d}</p></article>`)}
      </div>
    </div>
  </section>

  <section id="registry" data-section aria-labelledby="g-r">
    <div class="k-wrap">
      <p class="g-kick" data-reveal>Fingerprint registry</p>
      <h2 id="g-r" class="g-h2" data-reveal>Twenty fingerprints, <em>side by side.</em></h2>
      <div class="g-tw" tabindex="0" role="region" aria-label="Fingerprint registry table">
        <table class="g-table">
          <thead><tr><th scope="col">Direction</th><th scope="col">Type pairing</th><th scope="col">60 · 30 · 10</th><th scope="col">Hero layout</th><th scope="col">Signature mechanic</th></tr></thead>
          <tbody>${DATA.map((d) => `<tr><th scope="row"><a href="${d.folder}/index.html"><span class="g-kick">N° ${d.id} · ${d.mode}</span><span class="nm" style="font-family:'S${d.id}'">${esc(d.name)}</span></a></th><td><b>${esc(d.heading)}</b><br>${esc(d.body)}</td><td><span class="sw"><i style="background:${d.p}"></i><i style="background:${d.s}"></i><i style="background:${d.a}"></i>${d.a}</span></td><td><b>${esc(short(d.hero))}</b><br>${esc(d.hero.split(":").slice(1).join(":").trim())}</td><td><b>${esc(short(d.sig))}</b><br>${esc(d.sig.split(":").slice(1).join(":").trim())}</td></tr>`)}</tbody>
        </table>
      </div>
    </div>
  </section>
</main>
<dialog class="g-dlg" id="g-dlg" aria-labelledby="g-dh"><form method="dialog"><button class="g-x" aria-label="Close inspector">×</button></form><div class="g-di" id="g-di"></div></dialog>
<footer class="g-foot">
  <div><p class="g-mark"><b>${BRAND.name}</b><span>SOTD 2026 COLLECTION</span></p><p style="margin-top:12px;max-width:60ch">${BRAND.name} is a placeholder brand. Every page here is a design direction for an AI platform selling model access and API tokens; models, rates and quotes are mock data and nothing is live. The 20 blueprints supply visual language only.</p></div>
  <div><h4>COLLECTION</h4><ul><li><a href="#wall">The wall</a></li><li><a href="#laws">The laws</a></li><li><a href="#registry">Registry</a></li></ul></div>
  <div><h4>FILES</h4><ul><li><a href="fingerprint-registry.json">fingerprint-registry.json</a></li><li><a href="01-chronos-atelier/index.html">Start at N° 01</a></li></ul></div>
</footer>
<script>window.G = ${JSON.stringify(DATA)};</script>
`,
    js: iife(() => {
      const { RM, FINE, $, $$, clamp, lerp, canvas, loop, pointer } = K;
      const G = window.G, ARROW = '<svg class="g-ar" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';

      // —— hero: the 60-30-10 spectrum, fisheye-magnified under the pointer ——
      const cv = $("#g-spec"), st = canvas(cv);
      let focus = 0, target = 0, over = false, lastOver = -1e9, hot = -1;
      const weights = (f, n) => { const pk = st.w < 600 ? 14 : 12; return Array.from({ length: n }, (_, i) => 1 + pk * Math.exp(-((i - f) ** 2) / 2)); };
      const layout = () => { const ws = weights(focus, G.length), sum = ws.reduce((a, b) => a + b, 0); let x = 0; return ws.map((w) => { const c = [x, (w / sum) * st.w]; x += c[1]; return c; }); };
      const pick = (px) => { const cols = layout(); for (let i = 0; i < cols.length; i++) if (px < cols[i][0] + cols[i][1]) return i; return cols.length - 1; };
      cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); over = true; lastOver = performance.now(); hot = pick(e.clientX - r.left); target = hot; });
      cv.addEventListener("pointerleave", () => { over = false; });
      cv.addEventListener("click", (e) => { const r = cv.getBoundingClientRect(); open(pick(e.clientX - r.left)); });
      const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0); };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const ink = (bg) => (ratio(bg, "#FFFFFF") >= ratio(bg, "#000000") ? "#FFFFFF" : "#000000");
      loop(cv, (t, dt) => {
        const { ctx, w, h } = st;
        if (!over && !RM && performance.now() - lastOver > 2400) target = (Math.sin(t * 0.32) * 0.5 + 0.5) * (G.length - 1);
        if (RM && !over) target = 4;
        focus = clamp(RM ? target : lerp(focus, target, clamp(1 - Math.exp(-Math.max(0, dt) * 6))), 0, G.length - 1);
        const cols = layout(), fi = clamp(Math.round(focus), 0, G.length - 1);
        ctx.clearRect(0, 0, w, h);
        cols.forEach(([x, cw], i) => {
          const d = G[i], y1 = h * 0.6, y2 = h * 0.9;
          ctx.fillStyle = d.p; ctx.fillRect(x, 0, cw + 0.5, y1);
          ctx.fillStyle = d.s; ctx.fillRect(x, y1, cw + 0.5, y2 - y1);
          ctx.fillStyle = d.a; ctx.fillRect(x, y2, cw + 0.5, h - y2);
          ctx.fillStyle = "#0B0B0C"; ctx.fillRect(x + cw - 0.5, 0, 1, h);
        });
        const [x, cw] = cols[fi], d = G[fi];
        if (cw > 70) {
          const small = h < 260, pad = small ? 8 : Math.min(22, cw * 0.08);
          ctx.save(); ctx.beginPath(); ctx.rect(x, 0, cw - 1, h); ctx.clip();
          ctx.textBaseline = "top";
          ctx.fillStyle = d.muted; ctx.font = `500 ${small ? 9 : 12}px "DM Mono", monospace`;
          ctx.fillText(small ? `N° ${d.id}` : `N° ${d.id} · ${d.mode.toUpperCase()}`, x + pad, pad);
          ctx.fillStyle = d.text;
          const words = d.name.split(" ");
          let fs = small ? 16 : clamp(cw * 0.13, 22, 44);
          ctx.font = `500 ${fs}px "S${d.id}", serif`;
          const widest = Math.max(...words.map((wd) => ctx.measureText(wd).width));
          if (widest > cw - pad * 2) { fs *= (cw - pad * 2) / widest; ctx.font = `500 ${fs}px "S${d.id}", serif`; }
          const top = pad + (small ? 14 : 24);
          words.forEach((wd, k) => ctx.fillText(wd, x + pad, top + k * fs * 1.06));
          if (!small) {
            ctx.font = `400 12px "DM Mono", monospace`; ctx.fillStyle = d.muted;
            ctx.fillText(d.heading, x + pad, top + words.length * fs * 1.06 + 10);
            ctx.fillText(d.body, x + pad, top + words.length * fs * 1.06 + 28);
            ctx.font = `500 11px "DM Mono", monospace`;
            const lab = (txt, yy, bg) => { ctx.fillStyle = ink(bg); ctx.fillText(txt, x + pad, yy); };
            lab(`60 ${d.p}`, h * 0.6 - 20, d.p);
            lab(`30 ${d.s}`, h * 0.6 + 10, d.s);
            lab(`10 ${d.a}`, h * 0.9 + (h * 0.1 - 11) / 2, d.a);
          }
          ctx.restore();
        }
      });

      // —— wall: filter + sort with FLIP (transform-only) ——
      const wall = $("#g-wall"), cards = $$(".g-ex", wall), shown = $("#g-shown");
      let mode = "all", sort = "n";
      const flip = (mutate) => {
        const first = new Map(cards.map((c) => [c, c.getBoundingClientRect()]));
        mutate();
        if (RM) return;
        cards.forEach((c) => {
          if (c.hidden) return;
          const a = first.get(c), b = c.getBoundingClientRect();
          if (!a.width) { c.animate([{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: "cubic-bezier(.22,1,.36,1)" }); return; }
          const dx = a.left - b.left, dy = a.top - b.top;
          if (Math.abs(dx) + Math.abs(dy) < 1) return;
          c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: "none" }], { duration: 700, easing: "cubic-bezier(.22,1,.36,1)" });
        });
      };
      const apply = () => flip(() => {
        const order = [...cards].sort((a, b) => (sort === "hue" ? a.dataset.hue - b.dataset.hue : a.dataset.n - b.dataset.n));
        order.forEach((c) => wall.appendChild(c));
        let n = 0;
        cards.forEach((c) => { c.hidden = !(mode === "all" || c.dataset.mode === mode); if (!c.hidden) { n++; c.classList.add("is-in"); } });
        shown.textContent = `Showing ${n} of ${cards.length}`;
      });
      $$("[data-f]").forEach((b) => b.addEventListener("click", () => { mode = b.dataset.f; $$("[data-f]").forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false")); apply(); }));
      $$("[data-s]").forEach((b) => b.addEventListener("click", () => { sort = b.dataset.s; $$("[data-s]").forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false")); apply(); }));

      // —— inspector ——
      const dlg = $("#g-dlg"), body = $("#g-di");
      let cur = 0;
      const visible = () => [...wall.children].filter((c) => !c.hidden).map((c) => G.findIndex((d) => "s" + d.id === c.id));
      const fmt = (r) => r.toFixed(2) + ":1";
      const render = (i) => {
        const d = G[i]; cur = i;
        const rows = [["Inspiration", d.inspiration], ["Movement", d.movement], ["Type", `${d.heading} / ${d.body}`], ...(d.blueprint ? [["Blueprint", `Specified ${d.blueprint}`]] : []), ["Hero", d.hero], ["Signature", d.sig]];
        body.innerHTML = `
          <div class="g-dv" style="--dv:${d.p}"><img src="${d.folder}/preview.jpg" width="720" height="450" alt="Desktop hero of ${d.id} ${d.name}"><span class="g-phone" aria-hidden="true"><img src="${d.folder}/preview-mobile.jpg" width="300" height="534" alt=""></span></div>
          <div class="g-dt">
            <p class="g-kick">N° ${d.id} · ${d.mode}</p>
            <h2 id="g-dh" style="font-family:'S${d.id}'">${d.name}</h2>
            <p class="k-muted">“${d.line}”</p>
            <div class="g-sw3" aria-label="Colour system">
              <div style="background:${d.p};color:${ink(d.p)}">60 · primary<br>${d.p}</div>
              <div style="background:${d.s};color:${ink(d.s)}">30 · secondary<br>${d.s}</div>
              <div style="background:${d.a};color:${ink(d.a)}">10<br>${d.a}</div>
            </div>
            <p class="g-ct"><span>Text on primary <b>${fmt(ratio(d.text, d.p))}</b> · muted on primary <b>${fmt(ratio(d.muted, d.p))}</b></span><span>Accent on primary <b>${fmt(ratio(d.a, d.p))}</b> · label on accent <b>${fmt(ratio(d.onAccent, d.a))}</b></span></p>
            <dl class="g-dl">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
            <div class="g-dbar"><a class="g-open" href="${d.folder}/index.html">Open site ${ARROW}</a><button type="button" class="g-insp" data-go="-1">Previous</button><button type="button" class="g-insp" data-go="1">Next</button></div>
          </div>`;
      };
      const open = (i) => { render(i); if (!dlg.open) dlg.showModal(); };
      const go = (k) => { const v = visible(), at = v.indexOf(cur); render(v[(at + k + v.length) % v.length] ?? cur); };
      body.addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b) go(+b.dataset.go); });
      dlg.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); });
      dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
      $$(".g-insp[data-i]").forEach((b) => b.addEventListener("click", () => open(+b.dataset.i)));
      document.fonts && G.forEach((d) => document.fonts.load(`500 24px "S${d.id}"`).catch(() => {}));
    }),
  };

  const { css, files } = fontFaces(root, [
    { family: "Bodoni Moda", axes: "ital,opsz,wght@0,6..96,400..700;1,6..96,400..700" },
    { family: "Schibsted Grotesk", axes: "wght@400..700" },
    { family: "DM Mono", axes: "wght@400;500" },
  ]);
  const html = page(site, { fontCss: css + specimenFaces(root, sites), preload: [files[0]] });
  fs.writeFileSync(path.join(root, "index.html"), html);
}
