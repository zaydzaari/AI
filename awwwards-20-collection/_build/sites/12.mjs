import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate } from "../aether.mjs";

const STYLE = "Forma";
const RAIL = [
  ["KEY", "One API key", "Every model family behind a single credential."],
  ["MDL", "Model family", "Core, Unbound, Forge, Atlas or Swift: change one string."],
  ["TMP", "Temperament", "Standard, low-refusal or abliterated per request."],
  ["CCH", "Prompt cache", "Repeated prefixes billed at the cached rate automatically."],
  ["STR", "Streaming + tools", "Token streaming and tool calls in the request shape you know."],
  ["AGT", "Coding agent", "Forge reads, plans, edits and tests; you review the diff."],
];

export default {
  title: "Aether — Build your stack, priced first.",
  description: "Pick a model, a temperament and the features you need; the per-token estimate updates as you build. Forma design direction.",
  fonts: [
    { family: "Familjen Grotesk", axes: "wght@400;500;600;700" },
    { family: "IBM Plex Mono", axes: "wght@400;500" },
  ],
  tokens: {
    bgPrimary: "#F5F5F3", bgSecondary: "#E5E5E0", accent: "#D9381E", onAccent: "#FFFFFF",
    textPrimary: "#1A1A18", textMuted: "#55554F", line: "rgba(26,26,24,.14)",
    display: '"Familjen Grotesk", sans-serif', body: '"IBM Plex Mono", ui-monospace, monospace',
  },
  css: /* css */ `
.f12-nav{position:sticky;top:0;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:#F5F5F3f2;backdrop-filter:blur(8px);border-bottom:1px solid var(--line);font-size:.8rem}
.f12-mark{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:700;font-size:1.1rem;text-decoration:none}
.f12-mark i{width:12px;height:12px;border-radius:50%;background:var(--accent)}
.f12-links{display:flex;gap:4px}
.f12-links a{text-decoration:none;color:var(--text-muted);padding:7px 14px;border-radius:999px}
.f12-links a.is-current{background:var(--text-primary);color:#fff}
.f12-ser{color:var(--text-muted)}
@media (max-width:900px){.f12-links{display:none}}
.f12-btn{display:inline-flex;align-items:center;gap:14px;min-height:56px;padding:0 10px 0 26px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:600;font-size:1rem;text-decoration:none;box-shadow:inset 0 1px 0 #ffffff55,0 6px 16px -8px rgba(0,0,0,.32)}
.f12-btn i{width:36px;height:36px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#d8d8d2);box-shadow:inset 0 -2px 3px #0002;transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.f12-btn.is-near i{transform:rotate(90deg) scale(1.06)}
.f12-h2{font-size:clamp(2.4rem,4.6vw,4.2rem);font-weight:600;letter-spacing:-.035em;line-height:1;max-width:18ch}
.f12-fine{margin-top:22px;font-size:.76rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}
.alu{background:linear-gradient(180deg,#FBFBF9,#E4E4DF);border:1px solid #D3D3CD;box-shadow:inset 0 1px 0 #fff,0 1px 2px #0000000f,0 12px 24px -18px #0000004d}

/* hero: tool-first */
.f12-hero{min-height:calc(100svh - 60px);display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr;gap:20px 24px;padding:clamp(24px,5vh,48px) var(--gutter) 28px}
.f12-copy{grid-column:1 / span 6;grid-row:1 / span 2;align-self:center;display:grid;gap:18px;align-content:start;justify-items:start}
.f12-copy h1{font-weight:600}
.f12-copy .k-body{color:var(--text-muted);max-width:46ch}
.f12-trust{font-size:.8rem;color:var(--text-muted)}
.f12-trust b{color:var(--text-primary)}
.f12-tool{grid-column:7 / -1;grid-row:1 / span 2;align-self:center;border-radius:26px;padding:22px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.f12-tool fieldset{display:grid;gap:8px;grid-column:span 2}
.f12-tool legend{font-size:.76rem;color:var(--text-muted);margin-bottom:6px}
.f12-tool .opts{display:flex;flex-wrap:wrap;gap:6px}
.f12-tool label{position:relative}
.f12-tool input[type=radio],.f12-tool input[type=checkbox]{position:absolute;opacity:0;inset:0;cursor:pointer}
.f12-tool .chip{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:12px;font-size:.82rem;transition:background .2s,color .2s,box-shadow .3s}
.f12-tool .chip::before{content:"";width:8px;height:8px;border-radius:50%;background:#C9C9C2;transition:background .2s}
.f12-tool input:checked+.chip{background:var(--text-primary);color:#fff;box-shadow:none}
.f12-tool input:checked+.chip::before{background:var(--accent)}
.f12-tool input:focus-visible+.chip{outline:2px solid var(--text-primary);outline-offset:2px}
.f12-tool input:disabled+.chip{opacity:.4}
.f12-tool .vol{grid-column:span 2;display:grid;gap:8px}
.f12-tool .vol input{width:100%;accent-color:var(--accent)}
.f12-tool .est{grid-column:1 / -1;display:flex;justify-content:space-between;align-items:end;gap:16px;border-top:1px solid var(--line);padding-top:14px;flex-wrap:wrap}
.f12-tool .est b{font-family:var(--font-display);font-size:clamp(2.2rem,4vw,3.4rem);font-weight:600;letter-spacing:-.04em;line-height:1}
.f12-tool .est span{font-size:.76rem;color:var(--text-muted)}
@media (max-width:1000px){
  .f12-hero{grid-template-columns:1fr;gap:8px;padding-top:8px;padding-bottom:8px;align-content:start}
  .f12-copy{grid-column:1;grid-row:auto;gap:9px}
  .f12-tool{grid-column:1;grid-row:auto;padding:8px 12px;gap:4px;grid-template-columns:1fr 1fr;border-radius:18px}
  .f12-tool fieldset+fieldset,.f12-tool .vol,.f12-tool legend{display:none}
  .f12-tool .opts{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;padding:2px}
  .f12-tool .est span{font-size:.6875rem}
  .f12-tool .est .long{display:none}
  .f12-trust .long{display:none}
  .f12-tool fieldset{grid-column:1 / -1}
  .f12-tool .chip{min-height:32px;padding:0 10px;font-size:.76rem}
  .f12-tool .est{padding-top:8px}
  .f12-tool .est b{font-size:1.7rem}
}

/* problem: before/after scrubber */
.f12-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.f12-fix{display:grid;gap:10px}
.f12-fix li{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:18px 22px;border-radius:16px}
.f12-fix .was{color:var(--text-muted);font-size:.86rem}
.f12-fix .now{font-family:var(--font-display);font-weight:600;font-size:1.05rem}
@media (max-width:900px){.f12-cols{grid-template-columns:1fr;gap:40px}.f12-fix li{grid-template-columns:1fr;gap:4px}}
.f12-ba{position:relative;margin-top:56px;border-radius:26px;overflow:hidden;aspect-ratio:2.4;min-height:260px;cursor:ew-resize;touch-action:none;user-select:none}
.f12-room{position:absolute;inset:0;display:grid;place-items:center}
.f12-room svg{width:92%;height:84%}
.f12-room .tag{position:absolute;top:16px;font-size:.76rem;padding:4px 10px;border-radius:999px;background:#fff;border:1px solid var(--line)}
.f12-room.before{background:#EBEBE6}.f12-room.before .tag{left:16px}
.f12-room.after{background:#F9F9F7;clip-path:inset(0 0 0 var(--cut,50%))}.f12-room.after .tag{right:16px}
.f12-handle{position:absolute;top:0;bottom:0;left:var(--cut,50%);width:2px;background:var(--text-primary);transform:translateX(-1px)}
.f12-handle span{position:absolute;top:50%;left:50%;width:44px;height:44px;border-radius:50%;transform:translate(-50%,-50%);display:grid;place-items:center;font-size:.8rem}
@media (max-width:700px){.f12-ba{aspect-ratio:1.3}}

/* signature: the rail */
.f12-run{height:420vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.f12-pin{position:sticky;top:60px;height:calc(100vh - 60px);display:grid;grid-template-rows:auto 1fr auto;gap:24px;padding:28px var(--gutter);overflow:clip}
.f12-rail{position:relative;align-self:center;display:grid;grid-template-columns:repeat(6,1fr);gap:12px;padding:18px;border-radius:24px;background:linear-gradient(180deg,#D8D8D2,#C8C8C1);box-shadow:inset 0 2px 6px #0003,inset 0 -1px 0 #fff8}
.f12-slot{position:relative;aspect-ratio:.78;border-radius:16px;background:repeating-linear-gradient(135deg,#0000000a 0 6px,transparent 6px 12px),#CFCFC8;box-shadow:inset 0 2px 4px #0003}
.f12-mod{position:absolute;inset:0;border-radius:16px;padding:18px 14px;display:grid;align-content:space-between;transform:translate3d(calc(var(--off,1) * 60vw),calc(var(--off,1) * -40px),0) rotate(calc(var(--off,1) * 8deg));opacity:calc(1 - var(--off,1) * .7);transition:transform .9s cubic-bezier(.34,1.56,.64,1),opacity .5s}
.f12-mod.in{--off:0}
.f12-mod .code{font-size:.76rem;color:var(--text-muted);display:flex;justify-content:space-between}
.f12-mod .code i{width:8px;height:8px;border-radius:50%;background:#C9C9C2}
.f12-mod.in .code i{background:var(--accent)}
.f12-mod b{font-family:var(--font-display);font-size:1.15rem;font-weight:600;line-height:1.1}
.f12-mod p{font-size:.76rem;color:var(--text-muted);line-height:1.5}
.f12-sheet{display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:16px}
.f12-sheet ol{display:flex;gap:8px;flex-wrap:wrap;font-size:.76rem}
.f12-sheet li{padding:4px 10px;border-radius:999px;border:1px solid var(--line);color:var(--text-muted)}
.f12-sheet li.on{background:var(--text-primary);color:#fff;border-color:var(--text-primary)}
.f12-sheet p{font-size:.8rem;color:var(--text-muted)}
.f12-sheet p b{font-family:var(--font-display);font-size:1.8rem;color:var(--text-primary);font-weight:600}
@media (max-width:900px){
  .f12-run{height:380vh}
  .f12-pin{padding:14px var(--gutter);gap:12px}
  .f12-rail{grid-template-columns:repeat(3,1fr);gap:8px;padding:10px}
  .f12-mod{padding:10px}
  .f12-mod p{display:none}
  .f12-mod b{font-size:.9rem}
}
@media (prefers-reduced-motion:reduce){.f12-run{height:auto}.f12-pin{position:relative;height:auto}.f12-mod{--off:0}}

/* bento */
.f12-bento{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.f12-card{position:relative;isolation:isolate;overflow:hidden;border-radius:24px;display:grid;gap:14px;align-content:start;min-height:250px}
.f12-card::after{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(260px circle at var(--mx) var(--my),#FFFFFF,transparent 70%);opacity:0;transition:opacity .3s}
.f12-card:hover::after{opacity:1}
.f12-card .dial{width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#d6d6d0);box-shadow:inset 0 -2px 3px #0002,0 2px 4px #0001;position:relative}
.f12-card .dial::after{content:"";position:absolute;left:50%;top:6px;width:2px;height:10px;background:var(--text-primary);transform:translateX(-50%) rotate(var(--rot,0deg));transform-origin:50% 16px}
.f12-card .tag{font-size:.76rem;color:var(--text-muted)}
.f12-card h3{font-family:var(--font-display);font-size:1.5rem;font-weight:600;letter-spacing:-.02em;line-height:1.12}
.f12-card p{font-size:.86rem;color:var(--text-muted)}
.f12-card.c0{grid-column:span 2;background:var(--text-primary);color:#fff;border:0}
.f12-card.c0 .tag,.f12-card.c0 p{color:#CFCFC8}
.f12-card.c0 h3{font-size:clamp(2rem,3.2vw,2.8rem)}
.f12-card.c5{grid-column:span 2}
@media (max-width:900px){.f12-bento{grid-template-columns:1fr}.f12-card{grid-column:auto!important}}

/* rail: how it works */
.f12-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.f12-steps{padding:0 var(--gutter);gap:16px}
.f12-step{width:min(540px,50vw);border-radius:24px;display:grid;gap:14px;align-content:start}
.f12-step .n{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--bg-secondary);font-family:var(--font-display);font-weight:600}
.f12-step.is-active .n{background:var(--accent);color:#fff}
.f12-step h3{font-family:var(--font-display);font-size:1.7rem;font-weight:600;line-height:1.08}
.f12-step p{color:var(--text-muted);font-size:.88rem}
.f12-step pre{margin:0;background:var(--text-primary);color:#F5F5F3;border-radius:14px;padding:12px;font-size:.76rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.f12-step{width:auto}}

/* proof */
.f12-proof{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.f12-q{border-radius:24px;display:grid;gap:14px;align-content:space-between;min-height:260px}
.f12-q q{font-size:.92rem;line-height:1.6;quotes:"“" "”"}
.f12-q p{font-size:.76rem;color:var(--text-muted)}
.f12-q b{display:block;font-family:var(--font-display);font-size:1rem;color:var(--text-primary)}
@media (max-width:1000px){.f12-proof{grid-template-columns:1fr 1fr}}
@media (max-width:600px){.f12-proof{grid-template-columns:1fr}}

/* pricing */
.f12-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.f12-plan{border-radius:24px;display:grid;gap:12px;align-content:start}
.f12-plan.feat{background:var(--text-primary);color:#fff;border:0}
.f12-plan.feat .cad,.f12-plan.feat li{color:#D2D2CB}
.f12-plan h3{font-family:var(--font-display);font-size:1.2rem;font-weight:600}
.f12-plan .p{font-family:var(--font-display);font-size:2.8rem;font-weight:600;letter-spacing:-.04em;line-height:1}
.f12-plan .cad{font-size:.76rem;color:var(--text-muted)}
.f12-plan ul{display:grid;gap:6px;font-size:.84rem}
.f12-plan li::before{content:"● ";font-size:.6em;vertical-align:.2em;color:var(--accent)}
.f12-plan .fk{font-size:.8rem;border-top:1px solid currentColor;padding-top:12px;opacity:.9}
@media (max-width:900px){.f12-plans{grid-template-columns:1fr}}
.f12-rates{margin-top:24px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.f12-rates div{border-radius:18px;padding:16px;display:grid;gap:4px;font-size:.76rem;color:var(--text-muted)}
.f12-rates b{font-family:var(--font-display);font-size:1.2rem;color:var(--text-primary);font-weight:600}
@media (max-width:900px){.f12-rates{grid-template-columns:1fr 1fr}}

/* final + footer */
.f12-final{display:flex;justify-content:space-between;align-items:end;gap:32px;flex-wrap:wrap}
.f12-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.78rem;color:var(--text-muted)}
.f12-foot h3{font-family:var(--font-display);font-size:.9rem;color:var(--text-primary);margin-bottom:12px}
.f12-foot ul{display:grid;gap:8px}
.f12-foot a{text-decoration:none}
.f12-foot a:hover{color:var(--text-primary)}
.f12-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.f12-foot{grid-template-columns:1fr 1fr}.f12-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="f12-nav">
  <a class="f12-mark" href="#main"><i aria-hidden="true"></i>${BRAND.name}</a>
  <nav class="f12-links" data-spy aria-label="Sections"><a href="#compare">Compare</a><a href="#rail">The rail</a><a href="#parts">Parts</a><a href="#assemble">Assemble</a><a href="#owners">Owners</a><a href="#prices">Prices</a></nav>
  <span class="f12-ser">Series 12 · per-token</span>
</header>
<main id="main">
  <section class="f12-hero" data-hero aria-labelledby="f12-h">
    <div class="f12-copy">
      <h1 id="f12-h" data-hero-part="headline">Build your stack, priced first.</h1>
      <p class="k-body" data-hero-part="sub">Pick a model, a temperament and the features you need. The estimate updates as you build: per token, nothing bundled.</p>
      <div data-hero-part="cta"><a class="f12-btn" href="#prices" data-cta="primary" data-magnetic="5,0.16,0.7,0.3"><span data-magnetic-label>Get your API key</span><i aria-hidden="true"></i></a></div>
      <p class="f12-trust" data-hero-part="trust">Lightest module: <b>Swift</b> from <b>${rate(MODELS.find((m) => m.id === "swift").inPrice)}</b> per 1M input tokens.<span class="long"> Sample rates.</span></p>
    </div>
    <form class="f12-tool alu" id="tool" data-hero-part="visual" aria-label="Stack configurator" onsubmit="return false">
      <fieldset><legend>Model family</legend><div class="opts">${MODELS.map((m, i) => `<label><input type="radio" name="m" value="${m.id}"${i === 0 ? " checked" : ""}><span class="chip alu">${m.name}</span></label>`)}</div></fieldset>
      <fieldset class="tmp"><legend>Temperament</legend><div class="opts">${["Standard", "Low-refusal", "Abliterated"].map((t, i) => `<label><input type="radio" name="t" value="${t}"${i === 0 ? " checked" : ""}><span class="chip alu">${t}</span></label>`)}</div></fieldset>
      <fieldset><legend>Features</legend><div class="opts"><label><input type="checkbox" name="cache" checked><span class="chip alu">Prompt cache</span></label><label><input type="checkbox" name="agent"><span class="chip alu">Agent loop</span></label></div></fieldset>
      <div class="vol"><label for="vol" class="k-sr">Monthly tokens</label><span style="font-size:.72rem;color:var(--text-muted)">Monthly volume: <b id="vol-v">10M</b> tokens</span><input id="vol" type="range" min="0" max="1" step=".01" value=".33"></div>
      <div class="est" aria-live="polite"><span>Estimated monthly cost · sample rates<span class="long"><br>75% input · 25% output</span></span><b class="live" id="est">$0</b></div>
    </form>
  </section>

  <section id="compare" data-section aria-labelledby="f12-c">
    <div class="k-wrap">
      <div class="f12-cols">
        <h2 id="f12-c" class="f12-h2" data-reveal>Less wiring. More product.</h2>
        <ul class="f12-fix" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li class="alu"><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ul>
      </div>
      <div class="f12-ba alu" id="ba" data-reveal>
        <div class="f12-room before"><span class="tag">Before · three providers</span><svg viewBox="0 0 600 240" aria-hidden="true">${[0, 1, 2].map((i) => `<rect x="${40 + i * 190}" y="30" width="140" height="60" rx="10" fill="#fff" stroke="#1A1A18"/><text x="${110 + i * 190}" y="66" text-anchor="middle" font-family="IBM Plex Mono" font-size="12" fill="#1A1A18">key_${["a", "b", "c"][i]} · sdk_${i + 1}</text><path d="M${110 + i * 190} 90 C ${110 + i * 190} 150, ${300 + (i - 1) * 40} 140, ${300 + (i - 1) * 40} 190" fill="none" stroke="#1A1A18" stroke-dasharray="4 4"/><rect x="${250 + (i - 1) * 40}" y="190" width="100" height="34" rx="8" fill="#E5E5E0" stroke="#1A1A18"/><text x="${300 + (i - 1) * 40}" y="211" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="#1A1A18">invoice ${i + 1}</text>`)}</svg></div>
        <div class="f12-room after"><span class="tag">After · one ${BRAND.name} key</span><svg viewBox="0 0 600 240" aria-hidden="true"><rect x="210" y="30" width="180" height="64" rx="14" fill="#1A1A18"/><text x="300" y="68" text-anchor="middle" font-family="IBM Plex Mono" font-size="13" fill="#F5F5F3">one key · one SDK</text><path d="M300 94 V 180" stroke="#D9381E" stroke-width="2"/><rect x="230" y="180" width="140" height="40" rx="10" fill="#fff" stroke="#1A1A18"/><text x="300" y="205" text-anchor="middle" font-family="IBM Plex Mono" font-size="11" fill="#1A1A18">one itemised invoice</text>${MODELS.map((m, i) => `<circle cx="${120 + i * 90}" cy="140" r="5" fill="#D9381E"/><text x="${120 + i * 90}" y="160" text-anchor="middle" font-family="IBM Plex Mono" font-size="10" fill="#55554F">${m.name}</text>`)}</svg></div>
        <span class="f12-handle"><span class="alu" role="slider" tabindex="0" aria-label="Compare before and after" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" id="ba-h">⇆</span></span>
      </div>
    </div>
    <div class="f12-run" id="rail">
      <div class="f12-pin">
        <h3 class="f12-h2" style="font-size:clamp(1.8rem,3vw,2.6rem)">The rail: snap your stack together.</h3>
        <div class="f12-rail" aria-label="Six modules snapping into a rail">
          ${RAIL.map(([code, name, d], i) => `<div class="f12-slot"><div class="f12-mod alu${i === 0 ? " in" : ""}" data-i="${i}"><p class="code"><span>${code}-0${i + 1}</span><i aria-hidden="true"></i></p><div><b>${name}</b><p>${d}</p></div></div></div>`)}
        </div>
        <div class="f12-sheet" aria-live="polite"><ol id="spec">${RAIL.map(([, name], i) => `<li${i === 0 ? ' class="on"' : ""}>${name}</li>`)}</ol><p>Modules fitted <b id="fit">1</b> / 6</p></div>
      </div>
    </div>
  </section>

  <section id="parts" data-section aria-labelledby="f12-p">
    <div class="k-wrap">
      <h2 id="f12-p" class="f12-h2" data-reveal>Every part, and the job it does.</h2>
      <div class="f12-bento" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="f12-card alu k-card c${i}" data-spot><span class="dial" style="--rot:${i * 50 - 100}deg" aria-hidden="true"></span><span class="tag">${f}</span><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="assemble" data-section aria-labelledby="f12-a">
    <div data-rail>
      <div data-rail-view>
        <div class="f12-rail-head"><h2 id="f12-a" class="f12-h2" data-reveal>Assembly takes three steps.</h2></div>
        <ol class="f12-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="f12-step alu k-card"><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p>${i === 1 ? `<pre><code>baseURL: "${BRAND.apiBase}"\nmodel:   "core-128k"</code></pre>` : ""}</li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="owners" data-section aria-labelledby="f12-o">
    <div class="k-wrap">
      <h2 id="f12-o" class="f12-h2" data-reveal>Owners, by role.</h2>
      <div class="f12-proof" data-stagger>${PROOF.map(([role, focus, q]) => `<figure class="f12-q alu k-card"><q>${q}</q><p><b>${role}</b>${focus}</p></figure>`)}</div>
      <p class="f12-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="prices" data-section aria-labelledby="f12-pr">
    <div class="k-wrap">
      <h2 id="f12-pr" class="f12-h2" data-reveal>Price list. Every module, per token.</h2>
      <div class="f12-plans" data-stagger>${PLANS.map((p) => h`<article class="f12-plan alu k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <div class="f12-rates" data-reveal>${MODELS.map((m) => `<div class="alu"><b>${m.name}</b><span>${m.context} context</span><span>in ${rate(m.inPrice)} · out ${rate(m.outPrice)}</span><span>cached ${rate(m.cached)}</span></div>`)}</div>
      <p class="f12-fine">Per 1M tokens. ${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="f12-f">
    <div class="k-wrap f12-final">
      <h2 id="f12-f" class="f12-h2" data-reveal>Fit the first module today.</h2>
      <a class="f12-btn" href="#main" data-magnetic="5,0.16,0.7,0.3" data-reveal><span data-magnetic-label>Get your API key</span><i aria-hidden="true"></i></a>
    </div>
  </section>
</main>
<footer class="f12-foot">
  <div><p class="f12-mark"><i aria-hidden="true"></i>${BRAND.name}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Modules</h3><ul>${MODELS.map((m) => `<li><a href="#prices">${m.name}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#rail">Configurator</a></li><li><a href="#assemble">API quickstart</a></li><li><a href="#prices">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Familjen Grotesk and IBM Plex Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, onScroll, progress } = K;
    // —— hero configurator: live monthly estimate ——
    const form = $("#tool"), est = $("#est"), volV = $("#vol-v");
    const vol = (v) => Math.pow(10, 6 + v * 3);
    const fmtVol = (t) => (t >= 1e9 ? (t / 1e9).toFixed(1) + "B" : Math.round(t / 1e6) + "M");
    function update() {
      const m = AE.MODELS.find((x) => x.id === form.m.value);
      // keep temperament valid for the chosen family
      [...form.t].forEach((r) => { r.disabled = !m.variants.includes(r.value); });
      if (form.t.value === "" || !m.variants.includes(form.t.value)) { const ok = [...form.t].find((r) => !r.disabled); if (ok) ok.checked = true; }
      const tok = vol(+form.vol.value) * (form.agent.checked ? 1.6 : 1);
      const share = form.cache.checked ? 0.6 : 0;
      const inTok = tok * 0.75, outTok = tok * 0.25;
      const c = (inTok * (1 - share) * m.inPrice + inTok * share * m.cached + outTok * m.outPrice) / 1e6;
      volV.textContent = fmtVol(vol(+form.vol.value));
      est.textContent = "$" + (c >= 100 ? Math.round(c).toLocaleString("en-US") : c.toFixed(2));
    }
    form.addEventListener("input", update); update();

    // —— before/after scrubber (pointer + keyboard + scroll) ——
    const ba = $("#ba"), hd = $("#ba-h");
    let cut = 50, touched = false;
    const set = (v) => { cut = clamp(v, 0, 100); ba.style.setProperty("--cut", cut + "%"); hd.setAttribute("aria-valuenow", Math.round(cut)); };
    const fromX = (x) => { const r = ba.getBoundingClientRect(); set(((x - r.left) / r.width) * 100); };
    ba.addEventListener("pointerdown", (e) => { touched = true; ba.setPointerCapture(e.pointerId); fromX(e.clientX); });
    ba.addEventListener("pointermove", (e) => { if (e.buttons) fromX(e.clientX); });
    hd.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { touched = true; set(cut - 5); } if (e.key === "ArrowRight") { touched = true; set(cut + 5); } });
    onScroll(() => { if (!touched && !RM) set(85 - progress(ba, "through") * 70); });

    // —— signature: modules snap into the rail as you scroll ——
    const run = $("#rail"), mods = $$(".f12-mod"), spec = $$("#spec li"), fit = $("#fit");
    onScroll(() => {
      const p = RM ? 1 : clamp((progress(run) - 0.04) / 0.8);
      const n = Math.max(1, Math.min(6, Math.ceil(p * 6)));
      mods.forEach((m, i) => m.classList.toggle("in", i < n));
      spec.forEach((li, i) => li.classList.toggle("on", i < n));
      fit.textContent = n;
    });
  }),
};
