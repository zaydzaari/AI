import { h, iife, fiction } from "../lib.mjs";

const FEATURES = [
  ["Sun study before the first sketch", "Every room gets direct light at the hour you actually use it — we map 365 days of sun on your plot first.", "a"],
  ["Board-formed concrete", "Walls that patina instead of peel. Nothing to repaint for sixty years.", "b"],
  ["One material, inside and out", "Fewer junctions, fewer leaks, fewer trades on site.", "c"],
  ["Thermal mass by design", "Floors store winter sun and release it at night: heating bills fall by around 40%.", "d"],
  ["Cedar formwork from your region", "Each wall carries the grain of the boards it was cast against — a record of where it was made.", "e"],
];
const STEPS = [
  ["A-01", "Survey the light", "Months 1–2", "We spend four days on your site with a sun tracker and a drone, then hand you a 365-day light atlas."],
  ["A-02", "Cast a model", "Months 3–6", "A 1:50 concrete model, cast from the same mix. You walk it with a lens camera before anything is drawn in CAD."],
  ["A-03", "Pour on site", "Months 7–26", "One pour per wall, never patched. You get a weekly photo ledger and an open cost book."],
];
const RECEIPTS = [
  ["Haruka & Ren Ishida", "Ceramicists · studio-house, Naoshima", "−42%", "heating cost against their previous timber house, first winter"],
  ["Dr. Felix Brandt", "Cardiologist · courtyard house, Hamburg", "0", "change orders between the cast model and the keys"],
  ["Mei-Lin Chau", "Publisher · reading pavilion, Taipei", "3 weeks", "early on a 19-month programme"],
];
const TIERS = [
  ["Pavilion", "up to 60 m²", "¥28M", "Design and site supervision for a single-volume room: studio, tea house, reading room."],
  ["House", "60–220 m²", "¥88M", "The full Kanso method for a family house, including the light atlas and the 1:50 cast model."],
  ["Compound", "220 m² +", "from ¥160M", "Multiple volumes, landscape and courtyards, with a dedicated site architect."],
];

export default {
  lang: "en",
  title: "Kanso Monolith — Concrete houses shaped by the sun",
  description: "A Tokyo and Kyoto architecture studio that designs board-formed concrete houses around a year of sunlight on your site.",
  fonts: [
    { family: "Syne", axes: "wght@500;700;800" },
    { family: "IBM Plex Mono", axes: "wght@400;500" },
    { family: "Shippori Mincho", axes: "wght@700", text: "簡素", as: "Kanso Seal" },
  ],
  tokens: {
    bgPrimary: "#F2EFE9", bgSecondary: "#E2DDD3", accent: "#C83E2B", onAccent: "#FFFFFF",
    textPrimary: "#1C1A17", textMuted: "#57534B", line: "rgba(28,26,23,.16)",
    display: '"Syne", sans-serif', body: '"IBM Plex Mono", ui-monospace, monospace',
  },
  css: /* css */ `
.k2-nav{position:sticky;top:0;z-index:40;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:16px var(--gutter);background:#F2EFE9f2;border-bottom:1px solid var(--line);font-size:.8rem}
.k2-mark{display:flex;align-items:center;gap:12px;font-family:var(--font-display);font-weight:800;font-size:1.05rem;letter-spacing:-.02em;text-decoration:none}
.k2-seal{display:grid;place-items:center;width:34px;height:34px;background:var(--text-primary);color:var(--bg-primary);font-family:"Kanso Seal",serif;font-size:.78rem;line-height:1;writing-mode:vertical-rl;letter-spacing:.05em}
.k2-links{display:flex;gap:4px}
.k2-links a{padding:8px 14px;text-decoration:none;color:var(--text-muted);border-bottom:2px solid transparent}
.k2-links a:hover{color:var(--text-primary)}
.k2-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.k2-nav .loc{justify-self:end;color:var(--text-muted)}
@media (max-width:820px){.k2-links{display:none}.k2-nav{grid-template-columns:1fr auto}}

.k2-btn{display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:0 26px;background:var(--accent);color:#fff;font-weight:500;font-size:.9rem;text-decoration:none;border-radius:0;position:relative;transition:background .25s}
.k2-btn:hover{background:#AE321F}
.k2-btn::after{content:"";position:absolute;inset:6px;border:1px solid #ffffff55;pointer-events:none;transition:inset .35s var(--ease)}
.k2-btn.is-near::after{inset:3px}

/* hero: slab stack */
.k2-hero{min-height:calc(100svh - 67px);display:grid;grid-template-rows:auto 1fr;padding:clamp(28px,5vh,56px) var(--gutter) 28px;gap:clamp(20px,4vh,40px)}
.k2-hero h1{font-weight:800;font-size:clamp(3.25rem,6.5vw,6rem);letter-spacing:-.05em;line-height:.9;max-width:15ch}
.k2-band{display:grid;grid-template-columns:4fr 5fr 3fr;border:1px solid var(--text-primary);min-height:0}
.k2-band-copy{padding:28px;display:grid;align-content:space-between;gap:24px;border-right:1px solid var(--text-primary)}
.k2-band-copy .k-body{color:var(--text-muted)}
.k2-print{position:relative;background:repeating-linear-gradient(0deg,#1C1A170d 0 1px,transparent 1px 24px),repeating-linear-gradient(90deg,#1C1A170d 0 1px,transparent 1px 24px);overflow:hidden;min-height:220px}
.k2-print svg{position:absolute;inset:0;width:100%;height:100%}
.k2-print .tag{position:absolute;left:14px;bottom:12px;font-size:.72rem;color:var(--text-muted)}
.k2-slab{position:relative;display:grid;align-content:center;justify-items:start;gap:18px;padding:28px;border-left:1px solid var(--text-primary);color:var(--text-primary);
  background:radial-gradient(circle at 22% 24%,#0000001a 0 3px,#ffffff40 4px,transparent 6px),radial-gradient(circle at 78% 24%,#0000001a 0 3px,#ffffff40 4px,transparent 6px),radial-gradient(circle at 22% 80%,#0000001a 0 3px,#ffffff40 4px,transparent 6px),radial-gradient(circle at 78% 80%,#0000001a 0 3px,#ffffff40 4px,transparent 6px),repeating-linear-gradient(0deg,transparent 0 46px,#00000010 46px 47px),linear-gradient(#D6D0C4,#CBC4B6)}
.k2-slab::before{content:"";position:absolute;inset:0;opacity:.22;background-image:var(--concrete);mix-blend-mode:multiply;pointer-events:none}
.k2-slab>*{position:relative}
.k2-slab small{font-size:.75rem;color:#3d3a34}
.k2-trust{font-size:.78rem;color:var(--text-muted);display:flex;gap:14px;align-items:baseline;flex-wrap:wrap}
.k2-trust b{font-family:var(--font-display);font-size:1.6rem;font-weight:800;color:var(--text-primary);letter-spacing:-.03em}
@media (max-width:980px){
  .k2-hero{min-height:calc(100svh - 67px);grid-template-rows:auto auto;align-content:start;gap:16px;padding-top:20px;padding-bottom:16px}
  .k2-band{grid-template-columns:1fr;border:0}
  .k2-band-copy{border:0;padding:0;gap:14px}
  .k2-print{min-height:96px;height:96px;border:1px solid var(--text-primary);margin-top:4px}
  .k2-slab{border:1px solid var(--text-primary);border-top:0;padding:14px;grid-auto-flow:column;align-items:center;justify-content:space-between}
  .k2-slab small{display:none}
}

.k2-h2{font-weight:800;font-size:clamp(2.4rem,5vw,4.6rem);letter-spacing:-.045em;line-height:.92}
.k2-idx{font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:24px}

/* tension */
.k2-tension{display:grid;grid-template-columns:repeat(12,1fr);gap:64px 24px}
.k2-tension .k2-h2{grid-column:1 / span 8}
.k2-tension .k-body{grid-column:8 / span 5;color:var(--text-muted)}
@media (max-width:860px){.k2-tension .k2-h2,.k2-tension .k-body{grid-column:1 / -1}}

/* signature: blueprint → structure */
.k2-build{height:440vh;position:relative;margin-top:80px}
.k2-build-pin{position:sticky;top:67px;height:calc(100vh - 67px);display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:40px;padding:24px var(--gutter)}
.k2-sheet{position:relative;border:1px solid var(--text-primary);background:repeating-linear-gradient(0deg,#1C1A170a 0 1px,transparent 1px 32px),repeating-linear-gradient(90deg,#1C1A170a 0 1px,transparent 1px 32px),#F2EFE9}
.k2-sheet svg{position:absolute;inset:0;width:100%;height:100%}
.k2-side{display:grid;align-content:space-between;gap:24px;padding:8px 0}
.k2-stages{display:grid;border-top:1px solid var(--text-primary)}
.k2-stages li{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--line);font-size:.86rem;color:var(--text-muted)}
.k2-stages li.on{color:var(--text-primary);font-weight:500}
.k2-stages li.on span:last-child{background:var(--accent);color:#fff;padding:0 8px}
.k2-sun{display:grid;gap:12px}
.k2-sun label{font-size:.8rem;color:var(--text-muted)}
.k2-sun input{width:100%;accent-color:var(--accent);height:28px}
.k2-read{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line)}
.k2-read div{background:var(--bg-primary);padding:12px;display:grid;gap:2px;font-size:.72rem;color:var(--text-muted)}
.k2-read b{font-family:var(--font-display);font-size:1.5rem;color:var(--text-primary);letter-spacing:-.03em}
.k2-read .live b{display:inline-block;justify-self:start;background:var(--accent);color:#fff;padding:0 6px}
@media (max-width:900px){
  .k2-build{height:360vh}
  .k2-build-pin{grid-template-columns:1fr;grid-template-rows:1fr auto;gap:12px;padding:12px var(--gutter)}
  .k2-stages{display:none}
  .k2-side{padding:0}
}
@media (prefers-reduced-motion:reduce){.k2-build{height:auto}.k2-build-pin{position:relative;height:100vh}}

/* bento: concrete masonry */
.k2-bento{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:minmax(220px,auto);gap:0;border-top:1px solid var(--text-primary);border-left:1px solid var(--text-primary);margin-top:72px}
.k2-cell{border-right:1px solid var(--text-primary);border-bottom:1px solid var(--text-primary);padding:40px;display:grid;align-content:space-between;gap:32px;position:relative;isolation:isolate;overflow:hidden}
.k2-cell::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(360px circle at var(--mx) var(--my),#1C1A170f,transparent 65%);opacity:0;transition:opacity .3s}
.k2-cell:hover::before{opacity:1}
.k2-cell h3{font-size:1.65rem;font-weight:700;letter-spacing:-.03em;line-height:1.02;max-width:16ch}
.k2-cell p{font-size:.9rem;color:var(--text-muted);max-width:44ch}
.k2-cell.a{grid-column:span 4;grid-row:span 2;background:var(--bg-secondary)}
.k2-cell.a h3{font-size:clamp(2rem,3.4vw,3.2rem)}
.k2-cell.b,.k2-cell.c{grid-column:span 2}
.k2-cell.d{grid-column:span 3}
.k2-cell.e{grid-column:span 3;background:var(--bg-secondary)}
.k2-cell .glyph{width:120px;height:auto}
@media (max-width:900px){.k2-bento{grid-template-columns:1fr}.k2-cell{grid-column:auto!important;grid-row:auto!important;padding:36px}}

/* rail: drawing sheets */
.k2-rail-head{padding:0 var(--gutter);margin-bottom:48px}
.k2-sheets{padding:0 var(--gutter);gap:0}
.k2-dw{width:min(720px,62vw);border:1px solid var(--text-primary);display:grid;grid-template-rows:1fr auto;background:var(--bg-primary)}
.k2-dw+.k2-dw{border-left:0}
.k2-dw .body{padding:44px;display:grid;gap:20px;align-content:start;min-height:300px}
.k2-dw h3{font-size:2.6rem;font-weight:800;letter-spacing:-.045em;line-height:.95}
.k2-dw p{color:var(--text-muted);max-width:46ch}
.k2-dw .tb{display:grid;grid-template-columns:auto 1fr auto;border-top:1px solid var(--text-primary);font-size:.75rem}
.k2-dw .tb span{padding:12px 16px}
.k2-dw .tb span+span{border-left:1px solid var(--text-primary)}
.k2-dw.is-active .tb span:first-child{background:var(--accent);color:#fff}
@media (max-width:899px){.k2-dw{width:auto}.k2-dw+.k2-dw{border-left:1px solid var(--text-primary);border-top:0}.k2-dw .body{padding:32px;min-height:0}}

/* receipts */
.k2-receipts{margin-top:72px;display:grid;border-top:1px solid var(--text-primary)}
.k2-rc{display:grid;grid-template-columns:3fr 2fr 4fr;gap:32px;align-items:baseline;padding:40px 0;border-bottom:1px solid var(--line)}
.k2-rc b{font-family:var(--font-display);font-weight:700;font-size:1.4rem;letter-spacing:-.02em;display:block}
.k2-rc span{font-size:.8rem;color:var(--text-muted)}
.k2-rc .m{font-family:var(--font-display);font-weight:800;font-size:clamp(2.8rem,5vw,4.4rem);letter-spacing:-.05em;line-height:.9}
.k2-rc p{color:var(--text-muted);font-size:.92rem}
.k2-note{font-size:.76rem;color:var(--text-muted);margin-top:24px}
@media (max-width:820px){.k2-rc{grid-template-columns:1fr;gap:8px}}

/* fees */
.k2-fees{margin-top:72px;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--text-primary)}
.k2-fee{padding:44px 40px;display:grid;gap:22px;align-content:start}
.k2-fee+.k2-fee{border-left:1px solid var(--text-primary)}
.k2-fee:nth-child(2){background:var(--bg-secondary)}
.k2-fee h3{font-size:2rem;font-weight:800;letter-spacing:-.04em}
.k2-fee .area{font-size:.78rem;color:var(--text-muted)}
.k2-fee .p{font-family:var(--font-display);font-size:3rem;font-weight:700;letter-spacing:-.05em;line-height:1}
.k2-fee p{font-size:.88rem;color:var(--text-muted)}
.k2-fee a{font-size:.85rem;font-weight:500}
.k2-fk{margin-top:28px;display:flex;gap:40px;flex-wrap:wrap;font-size:.82rem}
.k2-fk span::before{content:"";display:inline-block;width:10px;height:10px;background:var(--text-primary);margin-right:10px;vertical-align:-1px}
@media (max-width:900px){.k2-fees{grid-template-columns:1fr}.k2-fee+.k2-fee{border-left:0;border-top:1px solid var(--text-primary)}.k2-fee{padding:36px}}

/* final + footer */
.k2-final{display:grid;grid-template-columns:repeat(12,1fr);gap:48px 24px;align-items:end}
.k2-final .k2-h2{grid-column:1 / span 8;font-size:clamp(2.8rem,6.4vw,6rem)}
.k2-final .act{grid-column:9 / -1;display:grid;gap:24px;justify-items:start}
.k2-final .act p{color:var(--text-muted)}
@media (max-width:860px){.k2-final .k2-h2,.k2-final .act{grid-column:1 / -1}}
.k2-foot{background:var(--text-primary);color:#D9D4CA;padding:96px var(--gutter) 40px;display:grid;grid-template-columns:repeat(12,1fr);gap:48px 24px;font-size:.82rem}
.k2-foot .word{grid-column:1 / -1;font-family:var(--font-display);font-weight:800;font-size:clamp(3rem,11vw,11rem);letter-spacing:-.06em;line-height:.8;color:#F2EFE9}
.k2-foot div{grid-column:span 3}
.k2-foot h4{font-family:var(--font-body);font-weight:500;color:#F2EFE9;margin-bottom:14px;font-size:.8rem}
.k2-foot ul{display:grid;gap:8px}
.k2-foot a{text-decoration:none}
.k2-foot a:hover{color:#fff;text-decoration:underline}
.k2-foot .legal{grid-column:1 / -1;border-top:1px solid #F2EFE933;padding-top:24px;display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}
@media (max-width:820px){.k2-foot div{grid-column:span 6}}
`,
  body: h`
<header class="k2-nav">
  <a class="k2-mark" href="#main"><span class="k2-seal" aria-hidden="true">簡素</span>Kanso Monolith</a>
  <nav class="k2-links" data-spy aria-label="Sections"><a href="#method">Method</a><a href="#build">Drawing</a><a href="#qualities">Qualities</a><a href="#clients">Clients</a><a href="#fees">Fees</a></nav>
  <span class="loc">Tokyo · Kyoto</span>
</header>
<main id="main">
  <section class="k2-hero" data-hero aria-labelledby="k2-title">
    <h1 id="k2-title" data-hero-part="headline">A house that gets quieter every year.</h1>
    <div class="k2-band">
      <div class="k2-band-copy">
        <p class="k-body" data-hero-part="sub">Board-formed concrete homes shaped by a year of sun on your site. Survey to keys in 26 months, on a fixed fee.</p>
        <p class="k2-trust" data-hero-part="trust"><b>41</b> houses cast since 2009. Not one wall re-poured.</p>
      </div>
      <div class="k2-print" data-hero-part="visual"><svg id="hero-iso" role="img" aria-label="Isometric drawing of a concrete pavilion; move the pointer to move the sun"></svg><span class="tag">Move the pointer to move the sun</span></div>
      <div class="k2-slab" data-hero-part="cta">
        <small>Four days on your plot. ¥1.8M, credited to your fee.</small>
        <a class="k2-btn" href="#fees" data-cta="primary" data-magnetic="5,0.22,0.6,0.5"><span data-magnetic-label>Book a sun study</span></a>
      </div>
    </div>
  </section>

  <section id="method" data-section aria-labelledby="m-title">
    <div class="k-wrap k2-tension">
      <h2 id="m-title" class="k2-h2" data-reveal>Most houses are drawn first and lit later.</h2>
      <p class="k-body" data-reveal>So the kitchen faces north, the bedroom bakes at 6 a.m. and the living room needs lamps at noon. We reverse the order: we learn your light, then we let it cut the plan. Scroll to watch a drawing become a building.</p>
    </div>
    <div class="k2-build" id="build">
      <div class="k2-build-pin">
        <div class="k2-sheet"><svg id="build-iso" role="img" aria-label="Three pavilions drawn as linework, then cast in concrete, then lit"></svg></div>
        <div class="k2-side">
          <ol class="k2-stages" id="stages"><li class="on"><span>Linework</span><span>01</span></li><li><span>Cast concrete</span><span>02</span></li><li><span>Sun and shadow</span><span>03</span></li></ol>
          <div class="k2-sun">
            <label for="sun">Sun position over the site — drag to change the hour</label>
            <input id="sun" type="range" min="6" max="18" step="0.25" value="9">
            <div class="k2-read" aria-live="polite"><div class="live"><span>Local time</span><b id="r-time">09:00</b></div><div><span>Elevation</span><b id="r-el">31°</b></div><div><span>Azimuth</span><b id="r-az">118°</b></div><div><span>Longest shadow</span><b id="r-sh">7.4 m</b></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="qualities" data-section aria-labelledby="q-title">
    <div class="k-wrap">
      <h2 id="q-title" class="k2-h2" data-reveal>Fewer things, each one doing more.</h2>
      <div class="k2-bento" data-stagger>
        ${FEATURES.map(([t, o, c]) => h`<article class="k2-cell ${c}" data-spot>${c === "a" ? `<svg class="glyph" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="none" stroke="#1C1A17"/><path d="M60 6v108M6 60h108" stroke="#1C1A1733"/><path d="M60 60 L104 30" stroke="#1C1A17" stroke-width="2"/><circle cx="104" cy="30" r="6" fill="#1C1A17"/></svg>` : ""}<h3>${t}</h3><p>${o}</p></article>`)}
      </div>
    </div>
  </section>

  <section id="process" data-section aria-labelledby="pr-title">
    <div data-rail>
      <div data-rail-view>
        <div class="k2-rail-head"><h2 id="pr-title" class="k2-h2" data-reveal>Three sheets. Twenty-six months.</h2></div>
        <ol class="k2-sheets" data-rail-track>
          ${STEPS.map(([no, t, w, d]) => `<li class="k2-dw"><div class="body"><h3>${t}</h3><p>${d}</p></div><div class="tb"><span>${no}</span><span>Kanso Monolith — standard sheet</span><span>${w}</span></div></li>`)}
        </ol>
      </div>
    </div>
  </section>

  <section id="clients" data-section aria-labelledby="c-title">
    <div class="k-wrap">
      <h2 id="c-title" class="k2-h2" data-reveal>Measured after the keys changed hands.</h2>
      <div class="k2-receipts" data-stagger>
        ${RECEIPTS.map(([n, r, m, d]) => `<article class="k2-rc"><div><b>${n}</b><span>${r}</span></div><p class="m">${m}</p><p>${d}</p></article>`)}
      </div>
      <p class="k2-note">Illustrative clients and figures. ${fiction("Kanso Monolith")}</p>
    </div>
  </section>

  <section id="fees" data-section aria-labelledby="f-title">
    <div class="k-wrap">
      <h2 id="f-title" class="k2-h2" data-reveal>Fixed fees. Never a percentage of cost.</h2>
      <div class="k2-fees" data-stagger>
        ${TIERS.map(([n, a, p, d]) => `<article class="k2-fee"><h3>${n}</h3><span class="area">${a}</span><p class="p">${p}</p><p>${d}</p><a href="#final">Discuss a ${n.toLowerCase()}</a></article>`)}
      </div>
      <p class="k2-fk"><span>Fee fixed after the sun study</span><span>Stop after the study and pay only ¥1.8M</span><span>Construction billed at cost, open ledger</span></p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="fi-title">
    <div class="k-wrap k2-final">
      <h2 id="fi-title" class="k2-h2" data-reveal>Start with four days of light on your land.</h2>
      <div class="act" data-reveal><p class="k-body">We take six sun studies a season. You keep the 365-day atlas whether or not we build.</p><a class="k2-btn" href="#main" data-magnetic="5,0.22,0.6,0.5"><span data-magnetic-label>Book a sun study</span></a></div>
    </div>
  </section>
</main>
<footer class="k2-foot">
  <p class="word" aria-hidden="true">Kanso.</p>
  <div><h4>Tokyo</h4><p>3-14-2 Kiyosumi, Kōtō-ku<br>Studio visits on Thursdays</p></div>
  <div><h4>Kyoto</h4><p>Model workshop, Higashiyama<br>Concrete cast days monthly</p></div>
  <div><h4>Studio</h4><ul><li><a href="#method">Method</a></li><li><a href="#clients">Clients</a></li><li><a href="#fees">Fees</a></li></ul></div>
  <div><h4>Exhibition</h4><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${fiction("Kanso Monolith")}</span><span>Set in Syne and IBM Plex Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, smooth, onScroll, progress, pointer, loop } = K;
    const NS = "http://www.w3.org/2000/svg";
    const C30 = Math.cos(Math.PI / 6);
    // Concrete texture for the CTA slab.
    document.documentElement.style.setProperty("--concrete", `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='c'><feTurbulence type='fractalNoise' baseFrequency='.035 .6' numOctaves='4' seed='4'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .29 0 0 0 0 .27 0 0 0 1.1 -.25'/></filter><rect width='100%' height='100%' filter='url(%23c)'/></svg>")}")`);

    const hull = (pts) => {
      pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], up = [];
      for (const p of pts) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
      for (const p of pts.reverse()) { while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
      return lo.slice(0, -1).concat(up.slice(0, -1));
    };
    const sun = (hour) => {
      const k = (hour - 6) / 12;
      return { az: Math.PI * (0.15 + k * 0.95), el: Math.max(0.1, Math.sin(Math.PI * k) * 1.02) };
    };

    // An isometric scene of boxes rendered into an SVG; returns setters for draw/solid/light/sun.
    function Scene(svg, boxes, { pad = 0.08, ground = true } = {}) {
      const P = (x, y, z) => [(x - y) * C30, (x + y) * 0.5 - z];
      let xs = [], ys = [];
      boxes.forEach((b) => [[b.x, b.y, 0], [b.x + b.w, b.y, 0], [b.x, b.y + b.d, 0], [b.x + b.w, b.y + b.d, 0], [b.x, b.y, b.h], [b.x + b.w, b.y + b.d, b.h]].forEach((p) => { const q = P(...p); xs.push(q[0]); ys.push(q[1]); }));
      const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys) - 6, maxY = Math.max(...ys) + 10;
      const W = maxX - minX, H = maxY - minY;
      svg.setAttribute("viewBox", `${minX - W * pad} ${minY - H * pad} ${W * (1 + 2 * pad)} ${H * (1 + 2 * pad)}`);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
      const d = (pts) => "M" + pts.map((p) => P(...p).map((v) => v.toFixed(2)).join(" ")).join("L") + "Z";
      const gShadow = mk("g", { fill: "#1C1A17", "fill-opacity": "0" }, svg);
      const gFaces = mk("g", {}, svg);
      const lines = [];
      const shadows = boxes.map(() => mk("path", {}, gShadow));
      boxes.slice().sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((b) => {
        const { x, y, w, d: dp, h: hh } = b;
        const faces = [
          [[[x + w, y, 0], [x + w, y + dp, 0], [x + w, y + dp, hh], [x + w, y, hh]], "#BDB6A8"],
          [[[x, y + dp, 0], [x + w, y + dp, 0], [x + w, y + dp, hh], [x, y + dp, hh]], "#A8A194"],
          [[[x, y, hh], [x + w, y, hh], [x + w, y + dp, hh], [x, y + dp, hh]], "#D9D3C7"],
        ];
        for (const [pts, fill] of faces) {
          mk("path", { d: d(pts), fill, "fill-opacity": "0", class: "face" }, gFaces);
          lines.push(mk("path", { d: d(pts), fill: "none", stroke: "#1C1A17", "stroke-width": "0.6", "vector-effect": "non-scaling-stroke", "stroke-linejoin": "round", pathLength: "1", "stroke-dasharray": "1 1", "stroke-dashoffset": "1" }, gFaces));
        }
        if (b.slit) { const s = b.slit; lines.push(mk("path", { d: d([[x + w, y + s[0], s[2]], [x + w, y + s[1], s[2]], [x + w, y + s[1], s[3]], [x + w, y + s[0], s[3]]]), fill: "#1C1A17", "fill-opacity": ".85", stroke: "none", class: "slit" }, gFaces)); }
      });
      const faces = [...gFaces.querySelectorAll(".face")];
      const slits = [...gFaces.querySelectorAll(".slit")];
      let longest = 0;
      return {
        draw(t) { lines.forEach((l, i) => l.setAttribute("stroke-dashoffset", (1 - clamp(t * 1.6 - (i / lines.length) * 0.6)).toFixed(3))); },
        solid(t) { faces.forEach((f) => f.setAttribute("fill-opacity", t.toFixed(3))); slits.forEach((s) => s.setAttribute("fill-opacity", (0.85 * t).toFixed(3))); },
        light(t) { gShadow.setAttribute("fill-opacity", (0.2 * t).toFixed(3)); },
        sun(hour) {
          const { az, el } = sun(hour);
          const len = 1 / Math.tan(el), vx = -Math.cos(az) * len, vy = -Math.sin(az) * len;
          longest = 0;
          boxes.forEach((b, i) => {
            const base = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.d], [b.x, b.y + b.d]];
            const pts = base.concat(base.map(([px, py]) => [px + vx * b.h, py + vy * b.h]));
            shadows[i].setAttribute("d", d(hull(pts).map(([px, py]) => [px, py, 0])));
            longest = Math.max(longest, b.h * len);
          });
          return { az, el, longest };
        },
      };
    }

    // Hero: one long pavilion, sun follows the pointer.
    const heroSvg = $("#hero-iso");
    const hero = Scene(heroSvg, [{ x: 0, y: 0, w: 120, d: 34, h: 26, slit: [6, 28, 12, 18] }, { x: 18, y: 34, w: 30, d: 24, h: 14 }, { x: 132, y: 4, w: 22, d: 22, h: 40 }], { pad: 0.06 });
    hero.solid(1); hero.light(1);
    let hh = 10, t0 = performance.now();
    loop(heroSvg, () => {
      const r = heroSvg.getBoundingClientRect();
      const target = pointer.active ? 6.5 + clamp((pointer.x - r.left + r.width * 0.2) / (r.width * 1.4)) * 11 : 10 + Math.sin(performance.now() / 4000) * 2.5;
      hh += (target - hh) * 0.08;
      hero.sun(hh);
      hero.draw(RM ? 1 : clamp((performance.now() - t0) / 1800));
    });

    // Signature: linework → concrete → light, plus a manual sun slider.
    const build = $("#build"), stages = $$("#stages li"), slider = $("#sun");
    const scene = Scene($("#build-iso"), [
      { x: 0, y: 0, w: 60, d: 60, h: 34, slit: [10, 50, 26, 30] },
      { x: 76, y: -10, w: 30, d: 90, h: 18 },
      { x: 18, y: 76, w: 70, d: 26, h: 52 },
      { x: 110, y: 90, w: 18, d: 18, h: 70 },
    ], { pad: 0.1 });
    const read = { time: $("#r-time"), el: $("#r-el"), az: $("#r-az"), sh: $("#r-sh") };
    let manual = false;
    const setSun = (hour) => {
      const s = scene.sun(hour);
      const hrs = Math.floor(hour), min = Math.round((hour - hrs) * 60);
      read.time.textContent = String(hrs).padStart(2, "0") + ":" + String(min).padStart(2, "0");
      read.el.textContent = Math.round((s.el * 180) / Math.PI) + "°";
      read.az.textContent = Math.round(((s.az * 180) / Math.PI + 90) % 360) + "°";
      read.sh.textContent = Math.min(99, s.longest / 10).toFixed(1) + " m";
    };
    slider.addEventListener("input", () => { manual = true; setSun(+slider.value); });
    onScroll(() => {
      const p = RM ? 1 : progress(build);
      scene.draw(smooth(clamp(p / 0.36)));
      scene.solid(smooth(clamp((p - 0.34) / 0.22)));
      scene.light(smooth(clamp((p - 0.56) / 0.12)));
      const stage = p < 0.34 ? 0 : p < 0.56 ? 1 : 2;
      stages.forEach((li, i) => li.classList.toggle("on", i === stage));
      if (!manual) { const hour = 7 + clamp((p - 0.58) / 0.42) * 10; slider.value = hour; setSun(hour); }
    });
  }),
};
