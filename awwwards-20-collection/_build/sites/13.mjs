import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Synapse";
const THREAD = [
  ["core", "Outline a short film about a lighthouse keeper who stops answering the radio.", "Three acts: the silence, the visitor who rows out, the reason the light still turns. Here are beat notes for each."],
  ["unbound", "Make the visitor's motive darker. No softening.", "She isn't there to rescue him. She's there to make sure the light keeps turning while the ship she wants wrecked goes by unseen."],
  ["forge", "Turn the beat notes into a shot list as JSON for our planning tool.", "Generated shots.json with 42 shots across 3 scenes, each with lens, duration and notes. Schema validated."],
  ["atlas", "Here are 60 pages of my past scripts. Match my voice in the opening monologue.", "Read all 60 pages in one prompt. Your openings favour second person and weather; here is a monologue in that register."],
  ["swift", "Give it a one-line logline for the festival form.", "A keeper's silence is the only warning a ship will get."],
];

export default {
  title: "Aether — One conversation. Every model listening.",
  description: "Unified chat keeps the whole thread as you move between five model families, billed per token for whichever model answers. Synapse design direction.",
  fonts: [
    { family: "Urbanist", axes: "wght@200..700" },
    { family: "JetBrains Mono", axes: "wght@400;500" },
  ],
  tokens: {
    bgPrimary: "#0A0910", bgSecondary: "#161421", accent: "#2DD4BF", onAccent: "#06120F",
    textPrimary: "#EEEBF7", textMuted: "#A39FB8", line: "rgba(238,235,247,.12)",
    display: '"Urbanist", sans-serif', body: '"JetBrains Mono", ui-monospace, monospace',
  },
  css: /* css */ `
body{background:var(--bg-primary)}
#field{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
main,footer,.s13-nav{position:relative;z-index:1}
.s13-nav{position:fixed;inset:0 0 auto;z-index:40;height:62px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);font-size:.78rem}
.s13-mark{font-family:var(--font-display);font-weight:300;font-size:1.4rem;letter-spacing:.12em;text-decoration:none}
.s13-links{display:flex;gap:24px;padding:8px 18px;border-radius:999px;background:#0A0910b3;border:1px solid var(--line)}
.s13-links a{text-decoration:none;color:var(--text-muted)}
.s13-links a.is-current{color:var(--accent)}
.s13-sig{color:var(--text-muted)}
@media (max-width:900px){.s13-links{display:none}}
.s13-btn{display:inline-flex;align-items:center;gap:12px;min-height:56px;padding:0 30px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:600;font-size:1.05rem;text-decoration:none;box-shadow:0 0 0 0 #2DD4BF55;transition:box-shadow .5s var(--ease)}
.s13-btn.is-near{box-shadow:0 0 0 10px #2DD4BF1a,0 0 40px #2DD4BF66}
.s13-h2{font-size:clamp(2.6rem,5vw,4.6rem);font-weight:300;letter-spacing:-.035em;line-height:1;max-width:16ch}
.s13-fine{margin-top:22px;font-size:.76rem;color:var(--text-muted)}
.live{color:var(--accent);font-variant-numeric:tabular-nums}
.glass{background:#161421de;border:1px solid var(--line)}

/* hero: off-centre float */
.s13-hero{min-height:100svh;display:grid;grid-template-columns:repeat(12,1fr);align-items:end;padding:90px var(--gutter) 40px}
.s13-hero .anchor{grid-column:1 / span 5;align-self:start;margin-top:8vh;font-size:.76rem;color:var(--text-muted);display:grid;gap:6px}
.s13-hero .anchor b{font-family:var(--font-display);font-weight:200;font-size:clamp(3rem,6vw,5.4rem);color:var(--text-primary);line-height:.9}
.s13-copy{grid-column:6 / -1;display:grid;gap:22px;justify-items:start;padding-left:clamp(0px,4vw,64px)}
.s13-copy h1{font-weight:300;line-height:.98}
.s13-copy .k-body{color:var(--text-muted);max-width:46ch}
.s13-trust{display:flex;align-items:center;gap:12px;font-size:.8rem;color:var(--text-muted)}
.s13-trust i{width:28px;height:1px;background:var(--accent);position:relative}
.s13-trust i::after{content:"";position:absolute;right:-3px;top:-3px;width:7px;height:7px;border-radius:50%;background:var(--accent)}
@media (max-width:860px){
  .s13-hero{grid-template-columns:1fr;padding:72px var(--gutter) 20px}
  .s13-hero .anchor{grid-column:1;margin-top:0}
  .s13-hero .anchor b{font-size:2.4rem}
  .s13-copy{grid-column:1;padding:0;gap:14px}
}

/* problem */
.s13-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.s13-lost{display:grid;gap:12px}
.s13-lost li{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:20px 24px;border-radius:20px}
.s13-lost .was{color:var(--text-muted);font-size:.86rem}
.s13-lost .now{font-family:var(--font-display);font-size:1.2rem;font-weight:500}
@media (max-width:900px){.s13-cols{grid-template-columns:1fr;gap:40px}.s13-lost li{grid-template-columns:1fr;gap:6px}}

/* signature: one thread, five listeners */
.s13-thread{margin-top:clamp(64px,6vw,80px);display:grid;gap:clamp(120px,22vh,220px);padding:12vh 0}
.s13-turn{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;align-items:center;width:min(1080px,100%)}
.s13-turn:nth-child(even){justify-self:end}
.s13-turn .you,.s13-turn .ans{border-radius:24px;display:grid;gap:10px;transition:border-color .5s,box-shadow .5s}
.s13-turn .you{font-size:.9rem;color:var(--text-muted)}
.s13-turn .ans .who{display:flex;justify-content:space-between;gap:12px;font-size:.72rem;color:var(--text-muted)}
.s13-turn .ans p{font-family:var(--font-display);font-size:clamp(1.3rem,2vw,1.7rem);font-weight:300;line-height:1.35}
.s13-turn .ans.lit{border-color:#2DD4BF88;box-shadow:0 0 0 1px #2DD4BF33,0 30px 60px -30px #2DD4BF55}
.s13-turn .ans.lit .who b{color:var(--accent)}
.s13-ctx{position:sticky;top:76px;z-index:3;margin:0 var(--gutter) 0 auto;width:max-content;display:flex;gap:18px;padding:10px 18px;border-radius:999px;font-size:.76rem}
@media (max-width:860px){.s13-turn{grid-template-columns:1fr}.s13-ctx{top:68px;gap:10px;font-size:.68rem}}

/* bento */
.s13-bento{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.s13-card{position:relative;isolation:isolate;overflow:hidden;border-radius:24px;display:grid;gap:14px;align-content:start;min-height:250px;transition:border-color .4s}
.s13-card::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(280px circle at var(--mx) var(--my),#2DD4BF1a,transparent 65%);opacity:0;transition:opacity .3s}
.s13-card:hover::before,.s13-card.lit::before{opacity:1}
.s13-card.lit{border-color:#2DD4BF66}
.s13-card .tag{font-size:.72rem;color:var(--text-muted)}
.s13-card h3{font-family:var(--font-display);font-size:1.7rem;font-weight:400;letter-spacing:-.02em;line-height:1.12}
.s13-card p{font-size:.86rem;color:var(--text-muted)}
.s13-card.c0{grid-column:span 2;grid-row:span 2}.s13-card.c0 h3{font-size:clamp(2.2rem,3.6vw,3.2rem);font-weight:300}
@media (max-width:900px){.s13-bento{grid-template-columns:1fr}.s13-card{grid-column:auto!important;grid-row:auto!important;min-height:0}}

/* rail */
.s13-rail-head{padding:0 var(--gutter);margin-bottom:44px}
.s13-steps{padding:0 var(--gutter);gap:18px}
.s13-step{width:min(560px,52vw);border-radius:24px;display:grid;gap:14px;align-content:start}
.s13-step.is-active{border-color:#2DD4BF77}
.s13-step .n{font-family:var(--font-display);font-weight:200;font-size:3.4rem;line-height:1;color:var(--text-muted)}
.s13-step.is-active .n{color:var(--accent)}
.s13-step h3{font-family:var(--font-display);font-size:1.8rem;font-weight:400;line-height:1.1}
.s13-step p{color:var(--text-muted);font-size:.88rem}
.s13-step pre{margin:0;background:#0A0910;border:1px solid var(--line);border-radius:14px;padding:12px;font-size:.74rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.s13-step{width:auto}}

/* voices */
.s13-voices{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.s13-v{border-radius:24px;display:grid;gap:14px}
.s13-v .hd{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.72rem;color:var(--text-muted)}
.s13-v b{font-family:var(--font-display);font-size:1.2rem;font-weight:500;color:var(--text-primary)}
.s13-v q{font-family:var(--font-display);font-size:1.25rem;font-weight:300;line-height:1.45;quotes:"“" "”"}
@media (max-width:760px){.s13-voices{grid-template-columns:1fr}}

/* pricing */
.s13-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.s13-plan{border-radius:24px;display:grid;gap:12px;align-content:start}
.s13-plan.feat{border-color:#2DD4BF66}
.s13-plan h3{font-family:var(--font-display);font-size:1.4rem;font-weight:500}
.s13-plan .p{font-family:var(--font-display);font-size:3rem;font-weight:200;letter-spacing:-.04em;line-height:1}
.s13-plan .cad{font-size:.76rem;color:var(--text-muted)}
.s13-plan ul{display:grid;gap:6px;font-size:.84rem}
.s13-plan li::before{content:"· ";color:var(--accent)}
.s13-plan .fk{font-size:.8rem;border-top:1px solid var(--line);padding-top:12px}
@media (max-width:900px){.s13-plans{grid-template-columns:1fr}}
.s13-rates{margin-top:24px;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.s13-rates div{border-radius:18px;padding:16px;display:grid;gap:4px;font-size:.74rem;color:var(--text-muted)}
.s13-rates b{font-family:var(--font-display);font-size:1.3rem;font-weight:500;color:var(--text-primary)}
@media (max-width:900px){.s13-rates{grid-template-columns:1fr 1fr}}

/* final + footer */
.s13-final{display:grid;justify-items:center;text-align:center;gap:28px}
.s13-final .s13-h2{font-size:clamp(3rem,6.4vw,5.6rem)}
.s13-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.78rem;color:var(--text-muted);background:#0A0910cc}
.s13-foot h4{font-family:var(--font-display);font-size:1rem;font-weight:500;color:var(--text-primary);margin-bottom:12px}
.s13-foot ul{display:grid;gap:8px}
.s13-foot a{text-decoration:none}
.s13-foot a:hover{color:var(--text-primary)}
.s13-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.s13-foot{grid-template-columns:1fr 1fr}.s13-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<canvas id="field" aria-hidden="true"></canvas>
<header class="s13-nav">
  <a class="s13-mark" href="#main">${BRAND.name.toLowerCase()}</a>
  <nav class="s13-links" data-spy aria-label="Sections"><a href="#drift">Drift</a><a href="#thread">The thread</a><a href="#nodes">Nodes</a><a href="#connect">Connect</a><a href="#voices">Voices</a><a href="#pricing">Pricing</a></nav>
  <span class="s13-sig" id="sig" aria-hidden="true">signal · idle</span>
</header>
<main id="main">
  <section class="s13-hero" data-hero aria-labelledby="s13-h">
    <p class="anchor" data-hero-part="visual" aria-label="The neural constellation behind the page follows your pointer and focus"><span>Live constellation · move the pointer</span><b>5</b><span>model families listening</span></p>
    <div class="s13-copy">
      <h1 id="s13-h" data-hero-part="headline">One conversation. Every model listening.</h1>
      <p class="k-body" data-hero-part="sub">Unified chat keeps the whole thread — files included — as you move between five model families. You pay per token for whichever model answers.</p>
      <div data-hero-part="cta"><a class="s13-btn" href="#pricing" data-cta="primary" data-focus data-magnetic="6,0.1,0.86,0.4"><span data-magnetic-label>Start a thread free</span></a></div>
      <p class="s13-trust" data-hero-part="trust"><i aria-hidden="true"></i>Switch models mid-thread; the context comes with you.</p>
    </div>
  </section>

  <section id="drift" data-section aria-labelledby="s13-d">
    <div class="k-wrap s13-cols">
      <h2 id="s13-d" class="s13-h2" data-reveal>Thoughts get lost between apps.</h2>
      <ul class="s13-lost" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li class="glass" data-focus><span class="was">${was}</span><span class="now">${now}</span></li>`)}</ul>
    </div>
    <div id="thread">
      <p class="s13-ctx glass" aria-live="polite"><span>Thread context <b class="live" id="ctx">0</b> tokens</span><span>Models used <b id="used">0</b>/5</span><span>Spent <b class="live" id="spent">$0.0000</b></span></p>
      <div class="k-wrap s13-thread">
        ${THREAD.map(([id, ask, ans], i) => { const m = MODELS.find((x) => x.id === id); const inTok = [120, 520, 980, 61000, 2100][i], outTok = [260, 140, 1800, 420, 30][i]; return `<article class="s13-turn" data-turn="${i}" data-tok="${inTok + outTok}" data-usd="${cost(m, inTok, outTok, i ? 0.6 : 0).toFixed(6)}" data-model="${id}"><p class="you glass k-card">${ask}</p><div class="ans glass k-card" data-focus tabindex="0"><p class="who"><b>${m.name}</b><span>${(inTok + outTok).toLocaleString("en-US")} tokens · ${usd(cost(m, inTok, outTok, i ? 0.6 : 0))}</span></p><p>${ans}</p></div></article>`; })}
      </div>
      <p class="k-wrap s13-fine">One sample thread; later turns reuse the cached history. ${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="nodes" data-section aria-labelledby="s13-n">
    <div class="k-wrap">
      <h2 id="s13-n" class="s13-h2" data-reveal>Every node, and what it does for you.</h2>
      <div class="s13-bento" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="s13-card glass k-card c${i}" data-spot data-focus tabindex="0"><span class="tag">${f}</span><h3>${b}</h3><p>${d}</p></article>`)}</div>
    </div>
  </section>

  <section id="connect" data-section aria-labelledby="s13-c">
    <div data-rail>
      <div data-rail-view>
        <div class="s13-rail-head"><h2 id="s13-c" class="s13-h2" data-reveal>Connect in three steps.</h2></div>
        <ol class="s13-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="s13-step glass k-card" data-focus><span class="n">${i + 1}</span><h3>${t}</h3><p>${d}</p>${i === 1 ? `<pre><code>baseURL: "${BRAND.apiBase}"\nmodel:   "core-128k"</code></pre>` : ""}</li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="voices" data-section aria-labelledby="s13-v">
    <div class="k-wrap">
      <h2 id="s13-v" class="s13-h2" data-reveal>Voices, by role.</h2>
      <div class="s13-voices" data-stagger>${PROOF.map(([role, focus, q]) => `<article class="s13-v glass k-card" data-focus><p class="hd"><b>${role}</b><span>${focus}</span></p><q>${q}</q></article>`)}</div>
      <p class="s13-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="pricing" data-section aria-labelledby="s13-p">
    <div class="k-wrap">
      <h2 id="s13-p" class="s13-h2" data-reveal>Pay for whichever model answers.</h2>
      <div class="s13-plans" data-stagger>${PLANS.map((p) => h`<article class="s13-plan glass k-card${p.featured ? " feat" : ""}" data-focus><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <div class="s13-rates" data-reveal>${MODELS.map((m) => `<div class="glass"><b>${m.name}</b><span>${m.context} · ${m.variants.join(", ")}</span><span>in ${rate(m.inPrice)} · out ${rate(m.outPrice)}</span></div>`)}</div>
      <p class="s13-fine">Per 1M tokens. ${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="s13-f">
    <div class="k-wrap s13-final">
      <h2 id="s13-f" class="s13-h2" data-reveal>Think out loud, to every model at once.</h2>
      <a class="s13-btn" href="#main" data-focus data-magnetic="6,0.1,0.86,0.4" data-reveal><span data-magnetic-label>Start a thread free</span></a>
    </div>
  </section>
</main>
<footer class="s13-foot">
  <div><p class="s13-mark">${BRAND.name.toLowerCase()}</p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h4>Listening</h4><ul>${MODELS.map((m) => `<li><a href="#thread">${m.name}</a></li>`)}</ul></div>
  <div><h4>Platform</h4><ul><li><a href="#nodes">Unified chat</a></li><li><a href="#connect">API quickstart</a></li><li><a href="#pricing">Token rates</a></li></ul></div>
  <div><h4>Exhibition</h4><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Urbanist and JetBrains Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, canvas, onScroll, pointer } = K;
    const TAU = Math.PI * 2;
    const cv = $("#field"), s = canvas(cv);
    const nodes = Array.from({ length: 110 }, () => ({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, ph: Math.random() * TAU }));
    const pulses = [];
    const targets = $$("[data-focus]");
    let target = null, lastFire = 0, sig = $("#sig");

    // the attention target: keyboard focus first, else the [data-focus] element nearest the viewport centre
    const pick = () => {
      const a = document.activeElement;
      if (a && a.matches && a.matches("[data-focus]")) return a;
      let best = null, bd = Infinity;
      for (const el of targets) { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) continue; const d = Math.abs(r.top + r.height / 2 - innerHeight * 0.5); if (d < bd) { bd = d; best = el; } }
      return best;
    };
    let lit = null;
    const setTarget = () => {
      target = pick();
      if (lit !== target) { lit && lit.classList.remove("lit"); target && target.classList.add("lit"); lit = target; }
      sig.textContent = target ? "signal · " + (target.querySelector("b,h3,[data-magnetic-label]")?.textContent || "focus").slice(0, 22).toLowerCase() : "signal · idle";
    };
    onScroll(setTarget);
    document.addEventListener("focusin", setTarget);

    // the thread readout
    const turns = $$("[data-turn]"), ctx = $("#ctx"), used = $("#used"), spent = $("#spent");
    onScroll(() => {
      let tok = 0, usd = 0; const ms = new Set();
      turns.forEach((t) => { if (t.getBoundingClientRect().top < innerHeight * 0.6) { tok += +t.dataset.tok; usd += +t.dataset.usd; ms.add(t.dataset.model); } });
      ctx.textContent = tok.toLocaleString("en-US"); used.textContent = ms.size; spent.textContent = "$" + usd.toFixed(4);
    });

    let raf = 0;
    const frame = (time) => {
      const t = time / 1000, { ctx: c, w, h } = s;
      c.clearRect(0, 0, w, h);
      const px = pointer.active ? pointer.x : -999, py = pointer.active ? pointer.y : -999;
      for (const n of nodes) {
        const x = n.x * w, y = n.y * h, d = Math.hypot(x - px, y - py);
        if (d < 180 && !RM) { n.vx += ((px - x) / d) * 0.00004; n.vy += ((py - y) / d) * 0.00004; }
        n.vx += Math.sin(t * 0.3 + n.ph) * 0.000004; n.vy += Math.cos(t * 0.27 + n.ph) * 0.000004;
        n.vx *= 0.96; n.vy *= 0.96;
        if (!RM) { n.x = (n.x + n.vx + 1) % 1; n.y = (n.y + n.vy + 1) % 1; }
      }
      // links, batched
      const links = new Path2D();
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
        if (dx * dx + dy * dy < 16000) { links.moveTo(a.x * w, a.y * h); links.lineTo(b.x * w, b.y * h); }
      }
      c.strokeStyle = "rgba(238,235,247,.13)"; c.lineWidth = 1; c.stroke(links);
      const dots = new Path2D();
      for (const n of nodes) { dots.moveTo(n.x * w + 1.6, n.y * h); dots.arc(n.x * w, n.y * h, 1.6, 0, TAU); }
      c.fillStyle = "rgba(238,235,247,.72)"; c.fill(dots);
      // fire pulses toward the attention target
      if (target && !RM && time - lastFire > 140) {
        lastFire = time;
        const r = target.getBoundingClientRect(), tx = r.left + r.width / 2, ty = r.top + r.height / 2;
        const src = nodes[(Math.random() * nodes.length) | 0];
        pulses.push({ x0: src.x * w, y0: src.y * h, x1: tx + (Math.random() - 0.5) * r.width * 0.6, y1: ty + (Math.random() - 0.5) * r.height * 0.6, t: 0 });
      }
      const pp = new Path2D(), glow = new Path2D();
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]; p.t += 0.022;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const k = p.t * p.t * (3 - 2 * p.t), x = lerp(p.x0, p.x1, k), y = lerp(p.y0, p.y1, k) - Math.sin(k * Math.PI) * 40;
        pp.moveTo(x + 2.8, y); pp.arc(x, y, 2.8, 0, TAU); glow.moveTo(x + 9, y); glow.arc(x, y, 9, 0, TAU);
      }
      c.fillStyle = "rgba(45,212,191,.16)"; c.fill(glow); c.fillStyle = "#2DD4BF"; c.fill(pp);
      raf = requestAnimationFrame(frame);
    };
    if (RM) frame(0); else raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden && !RM) raf = requestAnimationFrame(frame); });
  }),
};
