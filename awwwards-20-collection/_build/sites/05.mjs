import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, TEMPERAMENTS, PRICE_NOTE, PROOF_NOTE, conceptNote, rate } from "../aether.mjs";

const STYLE = "Valkyrie";
const CHANNELS = [
  { id: "std", name: "Standard", band: "Low · 150 Hz", note: TEMPERAMENTS[0][1], answer: "I can write the interrogation scene, but I'll keep the threats implied and add a short note about real-world coercion." },
  { id: "low", name: "Low-refusal", band: "Mid · 1 kHz", note: TEMPERAMENTS[1][1], answer: "The detective sets the photo face-down. “You've got until the coffee goes cold,” she says, “and I take mine black.”" },
  { id: "abl", name: "Abliterated", band: "High · 5 kHz", note: TEMPERAMENTS[2][1], answer: "The full scene, in the voice you asked for, with nothing softened and no disclaimer — what you publish stays your policy." },
];

export default {
  title: "Aether — Zero noise between you and the model",
  description: "Standard, low-refusal or abliterated on every request — same API, same per-token price list. Valkyrie design direction.",
  fonts: [
    { family: "Funnel Display", axes: "wght@400;600;800" },
    { family: "IBM Plex Mono", axes: "wght@400;500" },
  ],
  tokens: {
    bgPrimary: "#0B0B0C", bgSecondary: "#18181B", accent: "#FF5500", onAccent: "#0B0B0C",
    textPrimary: "#F1EFEA", textMuted: "#A09E99", line: "rgba(241,239,234,.12)",
    display: '"Funnel Display", sans-serif', body: '"IBM Plex Mono", ui-monospace, monospace',
  },
  css: /* css */ `
.v5-nav{position:sticky;top:0;z-index:40;height:60px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 var(--gutter);background:#0B0B0Cf2;border-bottom:1px solid var(--line);font-size:.8rem}
.v5-mark{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-weight:800;font-size:1.1rem;text-decoration:none}
.v5-mark i{width:22px;height:10px;border-radius:2px;background:repeating-linear-gradient(90deg,var(--text-primary) 0 2px,transparent 2px 4px)}
.v5-links{display:flex;gap:2px}
.v5-links a{padding:6px 12px;text-decoration:none;color:var(--text-muted);border-radius:999px}
.v5-links a.is-current{background:var(--accent);color:var(--on-accent)}
.v5-db{justify-self:end;color:var(--text-muted);font-variant-numeric:tabular-nums}
@media (max-width:860px){.v5-links{display:none}.v5-nav{grid-template-columns:1fr auto}}
.v5-btn{display:inline-flex;align-items:center;gap:14px;min-height:58px;padding:0 10px 0 28px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:800;font-size:1.02rem;text-decoration:none}
.v5-btn .knob{width:38px;height:38px;border-radius:50%;background:#0B0B0C;position:relative;transition:transform .5s var(--ease)}
.v5-btn .knob::after{content:"";position:absolute;left:50%;top:6px;width:2px;height:10px;background:var(--accent);transform:translateX(-50%)}
.v5-btn.is-near .knob{transform:rotate(135deg)}
.v5-h2{font-size:clamp(2.4rem,4.8vw,4.4rem);font-weight:800;letter-spacing:-.04em;line-height:.96;max-width:16ch}
.v5-fine{margin-top:22px;font-size:.78rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}

/* hero: horizon line */
.v5-hero{min-height:calc(100svh - 60px);display:grid;grid-template-rows:auto 1fr auto;gap:12px;padding:clamp(24px,5vh,48px) var(--gutter) 28px}
.v5-top{display:grid;grid-template-columns:7fr 5fr;gap:48px;align-items:end}
.v5-top h1{font-weight:800;line-height:.92;max-width:13ch}
.v5-top .k-body{color:var(--text-muted);max-width:46ch}
.v5-wave{position:relative;min-height:140px;border-block:1px solid var(--line)}
.v5-wave canvas{position:absolute;inset:0;width:100%;height:100%}
.v5-wave .axis{position:absolute;left:0;right:0;top:50%;height:1px;background:#F1EFEA1f}
.v5-wave .scale{position:absolute;right:0;top:8px;font-size:.7rem;color:var(--text-muted)}
.v5-bot{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
.v5-trust{font-size:.84rem;color:var(--text-muted);display:flex;gap:18px;align-items:center}
.v5-trust b{color:var(--text-primary);font-family:var(--font-display);font-size:1.5rem;font-weight:600}
@media (max-width:860px){
  .v5-hero{gap:14px;padding-top:18px;padding-bottom:16px}
  .v5-top{grid-template-columns:1fr;gap:12px}
  .v5-wave{min-height:84px}
  .v5-trust{font-size:.76rem;gap:10px}
  .v5-trust b{font-size:1.1rem}
}

/* problem */
.v5-split{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:end}
.v5-noise{display:grid}
.v5-noise li{display:grid;grid-template-columns:90px 1fr;gap:4px 18px;padding:20px 0;border-bottom:1px solid var(--line)}
.v5-noise .lvl{grid-row:span 2;align-self:center;height:6px;border-radius:6px;background:linear-gradient(90deg,#F1EFEA55 var(--n),#F1EFEA14 var(--n))}
.v5-noise .was{color:var(--text-muted);font-size:.9rem}
.v5-noise .now{font-family:var(--font-display);font-size:1.3rem;font-weight:600;line-height:1.2}
@media (max-width:900px){.v5-split{grid-template-columns:1fr;gap:40px}}

/* signature: the desk */
.v5-run{height:440vh;position:relative;margin-top:clamp(64px,6vw,80px)}
.v5-pin{position:sticky;top:60px;height:calc(100vh - 60px);display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:32px;padding:24px var(--gutter)}
.v5-desk{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-content:center}
.v5-ch{background:var(--bg-secondary);border:1px solid var(--line);border-radius:18px;padding:18px 14px;display:grid;gap:12px;justify-items:center;text-align:center;transition:border-color .3s}
.v5-ch.solo{border-color:var(--accent)}
.v5-ch b{font-family:var(--font-display);font-size:1.05rem;font-weight:600}
.v5-ch .band{font-size:.7rem;color:var(--text-muted)}
.v5-ch input[type=range]{writing-mode:vertical-lr;direction:rtl;width:30px;height:min(28vh,220px);accent-color:var(--accent)}
.v5-ch .val{font-size:.8rem;font-variant-numeric:tabular-nums}
.v5-ch button{min-height:36px;width:100%;border-radius:10px;border:1px solid var(--line);background:transparent;font-size:.74rem;color:var(--text-muted)}
.v5-ch button[aria-pressed=true]{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.v5-monitor{display:grid;grid-template-rows:auto 1fr auto;gap:14px;min-height:0}
.v5-play{display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:.8rem;color:var(--text-muted)}
.v5-play button{min-height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--text-primary);background:transparent;font-family:var(--font-display);font-weight:600}
.v5-play button[aria-pressed=true]{background:var(--text-primary);color:var(--bg-primary)}
.v5-scope{position:relative;border:1px solid var(--line);border-radius:18px;background:#070708;min-height:0}
.v5-scope canvas{position:absolute;inset:0;width:100%;height:100%}
.v5-out{border:1px solid var(--line);border-radius:18px;padding:20px 22px;display:grid;gap:8px}
.v5-out .lbl{font-size:.74rem;color:var(--text-muted)}
.v5-out p{font-family:var(--font-display);font-size:clamp(1.1rem,1.6vw,1.4rem);line-height:1.4}
@media (max-width:900px){
  .v5-run{height:380vh}
  .v5-pin{grid-template-columns:1fr;grid-template-rows:auto 1fr;gap:10px;padding:12px var(--gutter)}
  .v5-desk{grid-row:2;gap:8px}
  .v5-ch{padding:10px 8px;gap:6px}
  .v5-ch input[type=range]{height:72px}
  .v5-ch .band{display:none}
  .v5-monitor{grid-row:1}
  .v5-scope{min-height:90px}
  .v5-out{padding:12px 14px}
  .v5-out p{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){.v5-run{height:auto}.v5-pin{position:relative;height:auto;min-height:100vh}}

/* bento: spec sheet */
.v5-specs{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
.v5-spec{position:relative;isolation:isolate;overflow:hidden;background:var(--bg-secondary);border:1px solid var(--line);border-radius:22px;display:grid;gap:14px;align-content:start}
.v5-spec::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(300px circle at var(--mx) var(--my),#FF550014,transparent 65%);opacity:0;transition:opacity .3s}
.v5-spec:hover::before{opacity:1}
.v5-spec .tag{font-size:.72rem;color:var(--text-muted)}
.v5-spec h3{font-size:1.5rem;font-weight:600;letter-spacing:-.025em;line-height:1.1}
.v5-spec p{font-size:.86rem;color:var(--text-muted)}
.v5-spec svg{width:100%;height:60px}
.v5-spec.s0{grid-column:span 3;grid-row:span 2}
.v5-spec.s0 h3{font-size:clamp(2rem,3vw,2.6rem)}
.v5-spec.s1,.v5-spec.s2{grid-column:span 3}
.v5-spec.s3,.v5-spec.s4,.v5-spec.s5{grid-column:span 2}
@media (max-width:900px){.v5-specs{grid-template-columns:1fr}.v5-spec{grid-column:auto!important;grid-row:auto!important}}

/* rail: signal chain */
.v5-rail-head{padding:0 var(--gutter);margin-bottom:44px;display:flex;justify-content:space-between;align-items:end;gap:24px}
.v5-chain{display:flex;gap:6px;align-items:center;font-size:.74rem;color:var(--text-muted)}
.v5-chain i{width:40px;height:2px;background:var(--line);position:relative;overflow:hidden}
.v5-chain i::after{content:"";position:absolute;inset:0;background:var(--accent);transform:scaleX(var(--rp,0));transform-origin:left}
.v5-steps{padding:0 var(--gutter);gap:16px}
.v5-step{width:min(560px,52vw);background:var(--bg-secondary);border:1px solid var(--line);border-radius:22px;display:grid;gap:14px;align-content:start}
.v5-step.is-active{border-color:#FF550088}
.v5-step .n{font-family:var(--font-display);font-weight:800;font-size:3rem;line-height:1;color:var(--text-muted);transition:color .4s}
.v5-step.is-active .n{color:var(--text-primary)}
.v5-step h3{font-size:1.7rem;font-weight:600;line-height:1.1}
.v5-step p{color:var(--text-muted);font-size:.92rem}
.v5-step pre{margin:0;background:#070708;border:1px solid var(--line);border-radius:12px;padding:12px;font-size:.74rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.v5-step{width:auto}.v5-chain{display:none}}

/* listening notes */
.v5-notes{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.v5-note{border:1px solid var(--line);border-radius:22px;display:grid;gap:14px}
.v5-note .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.74rem;color:var(--text-muted)}
.v5-note b{font-family:var(--font-display);font-size:1.1rem;font-weight:600;color:var(--text-primary)}
.v5-note q{font-size:.98rem;line-height:1.6;quotes:"“" "”"}
@media (max-width:760px){.v5-notes{grid-template-columns:1fr}}

/* pricing */
.v5-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.v5-plan{border:1px solid var(--line);border-radius:22px;display:grid;gap:12px;align-content:start}
.v5-plan.feat{background:var(--bg-secondary);border-color:#FF550066}
.v5-plan h3{font-size:1rem;font-weight:600}
.v5-plan .p{font-family:var(--font-display);font-size:3rem;font-weight:800;letter-spacing:-.04em;line-height:1}
.v5-plan .cad{font-size:.78rem;color:var(--text-muted)}
.v5-plan ul{display:grid;gap:6px;font-size:.86rem}
.v5-plan li::before{content:"▸ ";color:var(--text-muted)}
.v5-plan .fk{font-size:.8rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.v5-plans{grid-template-columns:1fr}}
.v5-rates{margin-top:28px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.v5-rates div{border:1px solid var(--line);border-radius:16px;padding:16px;display:grid;gap:4px;font-size:.76rem;color:var(--text-muted)}
.v5-rates b{font-family:var(--font-display);font-size:1.3rem;color:var(--text-primary);font-weight:600}
@media (max-width:900px){.v5-rates{grid-template-columns:1fr 1fr}}

/* final + footer */
.v5-final{display:flex;justify-content:space-between;align-items:end;gap:32px;flex-wrap:wrap}
.v5-final .v5-h2{font-size:clamp(2.8rem,6vw,5.4rem)}
.v5-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.8rem;color:var(--text-muted)}
.v5-foot h4{font-family:var(--font-display);font-size:.9rem;color:var(--text-primary);margin-bottom:12px}
.v5-foot ul{display:grid;gap:8px}
.v5-foot a{text-decoration:none}
.v5-foot a:hover{color:var(--text-primary)}
.v5-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.v5-foot{grid-template-columns:1fr 1fr}.v5-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="v5-nav">
  <a class="v5-mark" href="#main"><i aria-hidden="true"></i>${BRAND.name}</a>
  <nav class="v5-links" data-spy aria-label="Sections"><a href="#noise">Noise</a><a href="#desk">Desk</a><a href="#specs">Specs</a><a href="#chain">Chain</a><a href="#notes">Notes</a><a href="#price">Price</a></nav>
  <span class="v5-db" id="db" aria-hidden="true">−∞ dB</span>
</header>
<main id="main">
  <section class="v5-hero" data-hero aria-labelledby="v5-h">
    <div class="v5-top">
      <h1 id="v5-h" data-hero-part="headline">Zero noise between you and the model.</h1>
      <p class="k-body" data-hero-part="sub">Choose standard, low-refusal or abliterated on every request. Same API, same per-token price list — only the hedging changes.</p>
    </div>
    <div class="v5-wave" data-hero-part="visual"><canvas id="horizon" role="img" aria-label="A live waveform across the page; move the pointer to change its amplitude and pitch"></canvas><span class="axis" aria-hidden="true"></span><span class="scale" aria-hidden="true">signal · pointer modulates</span></div>
    <div class="v5-bot">
      <div data-hero-part="cta"><a class="v5-btn" href="#price" data-cta="primary" data-magnetic="6,0.16,0.76,0.4"><span data-magnetic-label>Get your API key</span><span class="knob" aria-hidden="true"></span></a></div>
      <p class="v5-trust" data-hero-part="trust"><b>3</b><span>temperaments on every model family,<br>from ${rate(Math.min(...MODELS.map((m) => m.inPrice)))} per 1M input tokens (sample).</span></p>
    </div>
  </section>

  <section id="noise" data-section aria-labelledby="v5-n">
    <div class="k-wrap v5-split">
      <h2 id="v5-n" class="v5-h2" data-reveal>Most AI is mixed with too much noise.</h2>
      <ul class="v5-noise" data-stagger>
        ${PROBLEM.rows.map(([was, now], i) => `<li><span class="lvl" style="--n:${[82, 64, 46][i]}%" aria-hidden="true"></span><span class="was">${was}</span><span class="now">${now}</span></li>`)}
      </ul>
    </div>
    <div class="v5-run" id="desk">
      <div class="v5-pin">
        <div class="v5-desk" role="group" aria-label="Temperament channels">
          ${CHANNELS.map((c, i) => `<div class="v5-ch${i === 0 ? " solo" : ""}" data-ch="${i}"><b>${c.name}</b><span class="band">${c.band}</span><input type="range" min="0" max="100" value="${i === 0 ? 80 : 30}" aria-label="${c.name} level"><span class="val">${i === 0 ? "0.0" : "−8.2"} dB</span><button aria-pressed="${i === 0}" data-solo="${i}">Solo</button></div>`)}
        </div>
        <div class="v5-monitor">
          <div class="v5-play"><button id="play" aria-pressed="false">Play the desk</button><span>Sound starts only when you press play. Scroll sweeps the solo channel.</span></div>
          <div class="v5-scope"><canvas id="scope" role="img" aria-label="Oscilloscope of the mix"></canvas></div>
          <div class="v5-out" aria-live="polite"><span class="lbl" id="out-lbl">Same prompt · core-128k · Standard</span><p id="out">${CHANNELS[0].answer}</p></div>
        </div>
      </div>
    </div>
  </section>

  <section id="specs" data-section aria-labelledby="v5-s">
    <div class="k-wrap">
      <h2 id="v5-s" class="v5-h2" data-reveal>Spec sheet, with the outcome for each line.</h2>
      <div class="v5-specs" data-stagger>
        ${BENEFITS.map(([f, b, d], i) => h`<article class="v5-spec k-card s${i}" data-spot><span class="tag">${f}</span><h3>${b}</h3><p>${d}</p>${i === 0 ? `<svg viewBox="0 0 300 60" aria-hidden="true"><path d="M0 40 C 40 40, 60 12, 100 14 S 160 30, 200 22 S 270 10, 300 12" fill="none" stroke="#FF5500" stroke-width="1.6"/><path d="M0 50 H300" stroke="#F1EFEA22"/></svg>` : ""}</article>`)}
      </div>
    </div>
  </section>

  <section id="chain" data-section aria-labelledby="v5-c">
    <div data-rail>
      <div data-rail-view>
        <div class="v5-rail-head"><h2 id="v5-c" class="v5-h2" data-reveal>The signal chain, in three steps.</h2><span class="v5-chain" aria-hidden="true">IN<i></i>MIX<i></i>OUT</span></div>
        <ol class="v5-steps" data-rail-track>
          ${STEPS.map(([t, d], i) => `<li class="v5-step k-card"><span class="n">0${i + 1}</span><h3>${t}</h3><p>${d}</p><pre><code>${["model: \"core-128k:low-refusal\"", `baseURL: "${BRAND.apiBase}"`, "usage → tokens, cached, cost_usd"][i]}</code></pre></li>`)}
        </ol>
      </div>
    </div>
  </section>

  <section id="notes" data-section aria-labelledby="v5-l">
    <div class="k-wrap">
      <h2 id="v5-l" class="v5-h2" data-reveal>Listening notes, by role.</h2>
      <div class="v5-notes" data-stagger>
        ${PROOF.map(([role, focus, q]) => `<article class="v5-note k-card"><p class="hd"><b>${role}</b><span>${focus}</span></p><q>${q}</q></article>`)}
      </div>
      <p class="v5-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="price" data-section aria-labelledby="v5-p">
    <div class="k-wrap">
      <h2 id="v5-p" class="v5-h2" data-reveal>A price list you can actually read.</h2>
      <div class="v5-plans" data-stagger>
        ${PLANS.map((p) => h`<article class="v5-plan k-card${p.featured ? " feat" : ""}"><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}
      </div>
      <div class="v5-rates" data-reveal>${MODELS.map((m) => `<div><b>${m.name}</b><span>${m.context} · ${m.variants.join(", ")}</span><span>in ${rate(m.inPrice)} · out ${rate(m.outPrice)}</span></div>`)}</div>
      <p class="v5-fine">Per 1M tokens. ${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="v5-f">
    <div class="k-wrap v5-final">
      <h2 id="v5-f" class="v5-h2" data-reveal>Turn the hedging down.</h2>
      <a class="v5-btn" href="#main" data-magnetic="6,0.16,0.76,0.4" data-reveal><span data-magnetic-label>Get your API key</span><span class="knob" aria-hidden="true"></span></a>
    </div>
  </section>
</main>
<footer class="v5-foot">
  <div><p class="v5-mark"><i aria-hidden="true"></i>${BRAND.name}</p><p style="margin-top:14px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h4>Temperaments</h4><ul>${CHANNELS.map((c) => `<li><a href="#desk">${c.name}</a></li>`)}</ul></div>
  <div><h4>Platform</h4><ul><li><a href="#specs">Features</a></li><li><a href="#chain">API quickstart</a></li><li><a href="#price">Token rates</a></li></ul></div>
  <div><h4>Exhibition</h4><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Funnel Display and IBM Plex Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;
    const ANSWERS = [
      "I can write the interrogation scene, but I'll keep the threats implied and add a short note about real-world coercion.",
      "The detective sets the photo face-down. “You've got until the coffee goes cold,” she says, “and I take mine black.”",
      "The full scene, in the voice you asked for, with nothing softened and no disclaimer — what you publish stays your policy.",
    ];
    const NAMES = ["Standard", "Low-refusal", "Abliterated"];

    // —— hero horizon waveform ——
    const hz = $("#horizon"), hs = canvas(hz);
    let amp = 0.5, freq = 1;
    loop(hz, (t) => {
      const { ctx, w, h } = hs;
      ctx.clearRect(0, 0, w, h);
      const r = hz.getBoundingClientRect();
      const ta = pointer.active ? clamp(1 - Math.abs(pointer.y - (r.top + r.height / 2)) / 300, 0.2, 1) : 0.55;
      const tf = pointer.active ? 0.6 + (pointer.x / innerWidth) * 2.4 : 1;
      amp += (ta - amp) * 0.06; freq += (tf - freq) * 0.05;
      const tt = RM ? 0 : t;
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const u = x / w;
          const env = Math.sin(Math.PI * u) ** 0.6;
          const y = h / 2 + env * amp * h * 0.38 * (Math.sin(u * 18 * freq + tt * 3 + layer) * 0.6 + Math.sin(u * 47 * freq - tt * 5 + layer * 2) * 0.25 + Math.sin(u * 130 * freq + tt * 9) * 0.15 * (layer === 2 ? 1 : 0.3));
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = layer === 0 ? "#F1EFEA" : layer === 1 ? "rgba(241,239,234,.35)" : "rgba(255,85,0,.9)";
        ctx.lineWidth = layer === 0 ? 1.6 : 1;
        ctx.stroke();
      }
    });

    // —— the desk ——
    const chans = $$(".v5-ch"), faders = chans.map((c) => c.querySelector("input")), vals = chans.map((c) => c.querySelector(".val"));
    const soloBtns = $$("[data-solo]"), out = $("#out"), outLbl = $("#out-lbl"), db = $("#db");
    let solo = 0, manual = false, audio = null;
    const level = (i) => faders[i].value / 100;
    const toDb = (v) => (v <= 0.001 ? "−∞" : (20 * Math.log10(v / 0.8)).toFixed(1));
    function setSolo(i) {
      solo = i;
      chans.forEach((c, k) => c.classList.toggle("solo", k === i));
      soloBtns.forEach((b, k) => b.setAttribute("aria-pressed", String(k === i)));
      out.textContent = ANSWERS[i];
      outLbl.textContent = "Same prompt · core-128k" + (i ? ":" + NAMES[i].toLowerCase() : "") + " · " + NAMES[i];
      faders.forEach((f, k) => { if (!manual) f.value = k === i ? 80 : 30; });
      refresh();
    }
    function refresh() {
      faders.forEach((f, k) => (vals[k].textContent = toDb(level(k)) + " dB"));
      db.textContent = toDb(level(solo)) + " dB";
      if (audio) audio.gains.forEach((g, k) => g.gain.setTargetAtTime(level(k) * (k === solo ? 1 : 0.35), audio.ctx.currentTime, 0.08));
    }
    soloBtns.forEach((b, i) => b.addEventListener("click", () => { manual = true; setSolo(i); }));
    faders.forEach((f) => f.addEventListener("input", () => { manual = true; refresh(); }));

    // Web Audio: a sawtooth + noise source split into three bands, one per temperament.
    $("#play").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      if (audio) { audio.master.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.1); setTimeout(() => audio && audio.ctx.close(), 400); audio = null; btn.setAttribute("aria-pressed", "false"); btn.textContent = "Play the desk"; return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      const analyser = ctx.createAnalyser(); analyser.fftSize = 2048; master.connect(analyser);
      const osc = ctx.createOscillator(); osc.type = "sawtooth"; osc.frequency.value = 110;
      const osc2 = ctx.createOscillator(); osc2.type = "square"; osc2.frequency.value = 164.8;
      const noise = ctx.createBufferSource(); const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.3; noise.buffer = buf; noise.loop = true;
      const src = ctx.createGain(); src.gain.value = 0.5; osc.connect(src); osc2.connect(src); noise.connect(src);
      const bands = [[150, 0.9], [1000, 1.2], [5000, 1.4]];
      const gains = bands.map(([f, q]) => { const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = q; const g = ctx.createGain(); src.connect(bp); bp.connect(g); g.connect(master); return g; });
      osc.start(); osc2.start(); noise.start();
      master.gain.setTargetAtTime(0.12, ctx.currentTime, 0.3);
      audio = { ctx, master, analyser, gains, osc };
      btn.setAttribute("aria-pressed", "true"); btn.textContent = "Stop";
      refresh();
    });

    // scope: the analyser when playing, otherwise a synthetic mix of the three bands
    const sc = $("#scope"), ss = canvas(sc);
    let phase = 0;
    const data = new Uint8Array(2048);
    loop(sc, (t) => {
      const { ctx, w, h } = ss;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(241,239,234,.08)";
      for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo((w * i) / 8, 0); ctx.lineTo((w * i) / 8, h); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
      ctx.beginPath();
      if (audio) {
        audio.analyser.getByteTimeDomainData(data);
        for (let i = 0; i < data.length; i += 2) { const x = (i / data.length) * w, y = h / 2 + ((data[i] - 128) / 128) * h * 0.45; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      } else {
        const L = [level(0), level(1), level(2)].map((v, k) => v * (k === solo ? 1 : 0.35));
        for (let x = 0; x <= w; x += 2) {
          const u = x / w;
          const y = h / 2 + h * 0.4 * (L[0] * Math.sin(u * 6 * TAU + phase) * 0.6 + L[1] * Math.sin(u * 30 * TAU + phase * 2) * 0.3 + L[2] * Math.sin(u * 110 * TAU + phase * 4) * 0.15);
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
      }
      ctx.strokeStyle = "#FF5500"; ctx.lineWidth = 1.6; ctx.stroke();
      phase += RM ? 0 : 0.04;
    });

    // scroll: sweeps the phase and moves the solo channel through the three temperaments
    const run = $("#desk");
    onScroll(() => {
      const p = RM ? 0 : progress(run);
      phase = p * 40;
      if (audio) audio.osc.frequency.setTargetAtTime(110 * (1 + p * 0.5), audio.ctx.currentTime, 0.1);
      if (!manual) { const s = Math.min(2, Math.floor(p * 3)); if (s !== solo) setSolo(s); }
    });
    refresh();
  }),
};
