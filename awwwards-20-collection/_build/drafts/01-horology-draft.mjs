import { h, iife, fiction } from "../lib.mjs"; // ARCHIVED DRAFT (pre-Aether), not built

const LAYERS = [
  ["Mainplate", "Perlage by hand: 2,400 overlapping circles grained with a rotating peg, so the base plate shimmers under the wheels."],
  ["Going train", "Barrel, centre, third and fourth wheels in gilded brass. 72 hours of reserve — off the wrist all weekend, still running Monday."],
  ["Bridges", "Côtes de Genève stripes and 45° anglage polished with gentian wood. 70 hours of hand finishing per movement."],
  ["Escapement", "Free-sprung balance at 4 Hz with a Breguet overcoil, regulated on the bench over 15 days in six positions."],
  ["Chapter ring", "Grand feu enamel fired eleven times, then the minute track is transferred by hand and re-fired."],
];

const FEATURES = [
  ["Hand-bevelled bridges", "Light catches every edge, and keeps catching it for decades — polished steel does not wear like coating.", "wide"],
  ["One drawing, one owner", "The technical drawing of your calibre is archived in your name and never reused.", ""],
  ["72-hour reserve", "Take it off Friday night; it is still keeping time on Monday morning.", ""],
  ["Free-sprung balance", "Holds its rate after knocks and servicing, because nothing on the balance is ever adjusted by hand again.", ""],
  ["Caseback in your words", "Up to 40 characters engraved by our graveur, in any script you send us.", ""],
  ["Lifetime bench service", "Every service is done by one of the two watchmakers who built it.", "full"],
];

const STEPS = [
  ["Sit with the watchmaker", "Week 1", "Two hours at the bench in Le Sentier or by video. We sketch proportions, complication and dial together."],
  ["Approve the drawn calibre", "Weeks 2–8", "You receive the full technical drawing. Nothing is cut until you sign it — and you can still walk away."],
  ["Collect from the bench", "Month 14", "Final regulation in front of you, then the rate log, the drawing and the watch leave the atelier together."],
];

const RECEIPTS = [
  ["Margit Halvorsen", "Principal conductor, Bergen", "Calibre II · No. 0417", "+1.4 s/day", "average rate after 26 months on the wrist", "I wanted something that kept time the way an orchestra does — by people, not machines."],
  ["Tomás Ferreira", "Structural engineer, Porto", "Calibre I · No. 0388", "0 services", "needed in 4 years of daily wear", "I asked to see the bevels under a loupe before signing. They let me keep the loupe."],
  ["Aiyana Redcloud", "Surgeon, Calgary", "Calibre III · No. 0402", "11 months", "from first sketch to collection, three months early", "The drawing hangs in my office. Patients ask about it more than my diplomas."],
];

const TIERS = [
  ["Calibre I", "Time only", "CHF 48,000", ["Hours, minutes, small seconds", "Hand-finished 312-part movement", "Steel or titanium case", "Caseback engraving"], "10% deposit, refunded in full if you don't approve the drawing."],
  ["Calibre II", "Moonphase", "CHF 76,000", ["Everything in Calibre I", "Hand-engraved moonphase, 122-year accuracy", "Grand feu enamel dial", "Choice of 18k red or white gold"], "Price fixed when you sign — no surprises at delivery."],
  ["Calibre III", "Grand complication", "from CHF 140,000", ["Perpetual calendar or minute repeater", "Two dedicated watchmakers, 18–22 months", "Visits to the bench at every stage", "Archive drawing framed on vellum"], "Speak to a watchmaker first. No deposit until a drawing exists."],
];

export default {
  title: "Chronos Atelier — Twelve hand-made calibres a year",
  description: "Commission a mechanical watch drawn, cut and finished by two watchmakers over 14 months. Twelve commissions a year.",
  fonts: [
    { family: "Cormorant Garamond", axes: "ital,wght@0,400;0,500;0,600;1,400;1,500" },
    { family: "JetBrains Mono", axes: "wght@400;500" },
  ],
  tokens: {
    bgPrimary: "#090A0F", bgSecondary: "#141722", accent: "#D4AF37", onAccent: "#0B0A07",
    textPrimary: "#EDE7DA", textMuted: "#A2A6B5", line: "rgba(237,231,218,.12)",
    display: '"Cormorant Garamond", Georgia, serif', body: '"JetBrains Mono", ui-monospace, monospace',
  },
  css: /* css */ `
body{font-size:1.05rem}
.c-nav{position:fixed;inset:0 0 auto;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:22px var(--gutter);background:linear-gradient(#090A0Fee,#090A0F00);transition:background .4s,padding .4s var(--ease),border-color .4s;border-bottom:1px solid transparent}
.c-nav.is-scrolled{background:#090A0Fe6;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);padding-block:14px;border-color:var(--line)}
.c-mark{font-family:var(--font-display);font-size:1.45rem;font-weight:600;letter-spacing:.02em;text-decoration:none}
.c-mark i{font-weight:400;color:var(--text-muted)}
.c-links{display:flex;gap:36px;font-size:.82rem}
.c-links a{text-decoration:none;color:var(--text-muted);padding:6px 0;position:relative;transition:color .25s}
.c-links a::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease)}
.c-links a:hover,.c-links a.is-current{color:var(--text-primary)}
.c-links a.is-current::after{transform:none}
.c-nav-meta{font-size:.78rem;color:var(--text-muted)}
@media (max-width:860px){.c-links{display:none}}

.c-btn{display:inline-flex;align-items:center;gap:14px;min-height:56px;padding:0 30px;border-radius:999px;background:var(--accent);color:var(--on-accent);font-family:var(--font-body);font-size:.92rem;font-weight:500;text-decoration:none;box-shadow:0 0 0 0 #D4AF3700;transition:box-shadow .4s var(--ease)}
.c-btn.is-near{box-shadow:0 0 0 8px #D4AF3714}
.c-btn svg{width:18px;height:18px;transition:transform .35s var(--ease)}
.c-btn:hover svg{transform:rotate(90deg)}
.c-ghost{display:inline-flex;align-items:center;min-height:48px;padding:0 24px;border:1px solid var(--line);border-radius:999px;text-decoration:none;font-size:.85rem;transition:border-color .25s,background .25s}
.c-ghost:hover{border-color:#EDE7DA66;background:#EDE7DA08}

/* hero: asymmetric 5/7 split */
.c-hero{position:relative;min-height:100svh;display:grid;grid-template-columns:repeat(12,1fr);column-gap:24px;align-items:center;padding:96px var(--gutter) 40px;overflow:clip}
.c-hero-copy{grid-column:1 / span 5;position:relative;z-index:2;display:grid;gap:30px}
.c-hero h1{font-weight:500;letter-spacing:-.035em;line-height:.94}
.c-hero h1 em{font-weight:400}
.c-hero .k-body{color:var(--text-muted);max-width:44ch}
.c-hero-visual{grid-column:6 / -1;position:relative;height:min(78vh,760px);aspect-ratio:auto}
.c-hero-visual canvas{width:100%;height:100%}
.c-trust{display:flex;align-items:center;gap:18px;font-size:.78rem;color:var(--text-muted)}
.c-ledger{display:flex;gap:4px}
.c-ledger i{width:6px;height:18px;border-radius:2px;background:#EDE7DA22}
.c-ledger i.on{background:var(--accent)}
.c-beat{font-variant-numeric:tabular-nums;color:var(--accent)}
@media (max-width:860px){
  .c-hero{grid-template-columns:1fr;align-content:end;padding:84px var(--gutter) 28px}
  .c-hero-copy{grid-column:1;gap:20px}
  .c-hero-visual{position:absolute;grid-column:1;top:0;right:0;left:0;height:46vh;opacity:.42;pointer-events:none;overflow:hidden;-webkit-mask-image:linear-gradient(#000 55%,transparent);mask-image:linear-gradient(#000 55%,transparent)}
  .c-hero-visual canvas{position:absolute;width:112vw;height:112vw;max-height:none;left:auto;right:-44vw;top:-18vw}
  .c-hero .k-body{font-size:1.05rem}
  .c-trust{gap:12px;flex-wrap:wrap}
}

/* section headings */
.c-h2{font-size:clamp(2.4rem,4.6vw,4.4rem);font-weight:500;line-height:1;letter-spacing:-.03em}
.c-kicker{font-size:.8rem;color:var(--text-muted);margin-bottom:28px;display:block}

/* tension + exploded calibre */
.c-tension{display:grid;grid-template-columns:repeat(12,1fr);gap:64px 24px}
.c-tension .c-h2{grid-column:1 / span 7}
.c-tension .k-body{grid-column:8 / -1;align-self:end;color:var(--text-muted)}
.c-versus{grid-column:1 / -1;display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line)}
.c-versus dl{padding:40px 40px 40px 0;display:grid;gap:18px}
.c-versus dl+dl{padding-left:40px;border-left:1px solid var(--line)}
.c-versus dt{font-family:var(--font-display);font-size:1.7rem}
.c-versus dd{display:flex;justify-content:space-between;gap:24px;font-size:.88rem;color:var(--text-muted);border-bottom:1px dashed var(--line);padding-bottom:12px}
.c-versus dd b{color:var(--text-primary);font-weight:500;text-align:right}
@media (max-width:860px){.c-tension .c-h2,.c-tension .k-body{grid-column:1 / -1}.c-versus{grid-template-columns:1fr}.c-versus dl,.c-versus dl+dl{padding:32px 0;border-left:0}.c-versus dl+dl{border-top:1px solid var(--line)}}

.c-explode{height:420vh;position:relative;margin-top:120px}
.c-explode-pin{position:sticky;top:0;height:100vh;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);align-items:center;gap:48px;padding:0 var(--gutter);overflow:hidden}
.c-explode-pin canvas{width:100%;height:100%}
.c-layers{display:grid;gap:6px;counter-reset:l}
.c-layers li{padding:18px 0 18px 26px;border-left:1px solid var(--line);position:relative;color:var(--text-muted);transition:color .5s var(--ease)}
.c-layers li::before{content:"";position:absolute;left:-1px;top:0;bottom:0;width:2px;background:var(--accent);transform:scaleY(0);transform-origin:top;transition:transform .6s var(--ease)}
.c-layers li.is-on{color:var(--text-primary)}
.c-layers li:not(.is-on) p{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
.c-layers li.is-on::before{transform:none}
.c-layers h3{font-size:1.75rem;font-weight:500;line-height:1.1}
.c-layers p{font-size:.86rem;color:var(--text-muted);margin-top:8px;max-width:46ch;line-height:1.65}
.c-layers .n{font-size:.75rem;color:var(--text-muted)}
@media (max-width:860px){
  .c-explode{height:380vh}
  .c-explode-pin{grid-template-columns:1fr;grid-template-rows:1fr auto;gap:0;padding:64px var(--gutter) 28px}
  .c-layers li{display:none;padding:14px 0 0 18px}
  .c-layers li.is-on{display:block}
  .c-layers h3{font-size:1.5rem}
}
@media (prefers-reduced-motion:reduce){.c-explode{height:auto}.c-explode-pin{position:relative;height:auto;min-height:100vh}.c-layers li{opacity:1;display:block}}

/* bento */
.c-bento-head{display:flex;justify-content:space-between;align-items:end;gap:48px;margin-bottom:72px;flex-wrap:wrap}
.c-bento-head .k-body{color:var(--text-muted);max-width:40ch}
.c-bento{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.c-card{position:relative;background:var(--bg-secondary);border:1px solid var(--line);border-radius:4px;padding:40px;min-height:280px;display:flex;flex-direction:column;justify-content:space-between;gap:40px;overflow:hidden;isolation:isolate;transition:border-color .3s}
.c-card::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(420px circle at var(--mx) var(--my),#EDE7DA12,transparent 60%);opacity:0;transition:opacity .35s}
.c-card:hover{border-color:#EDE7DA2e}
.c-card:hover::before{opacity:1}
.c-card.wide{grid-column:span 2}
.c-card.full{grid-column:1 / -1;flex-direction:row;align-items:end;min-height:200px}
.c-card h3{font-size:2rem;font-weight:500;line-height:1.05}
.c-card p{font-size:.92rem;color:var(--text-muted);max-width:42ch;line-height:1.7}
.c-card p b{display:block;color:var(--text-primary);font-weight:500;margin-bottom:4px;font-size:.78rem}
.c-card svg{width:100%;max-width:300px;height:auto;opacity:.85}
@media (max-width:960px){.c-bento{grid-template-columns:1fr}.c-card.wide,.c-card.full{grid-column:auto;flex-direction:column;align-items:stretch}.c-card{padding:36px;min-height:0}}

/* rail */
.c-rail-head{padding:0 var(--gutter);margin-bottom:56px;display:flex;justify-content:space-between;align-items:end;gap:32px}
.c-rail-head .c-progress{width:220px;height:1px;background:var(--line);position:relative}
.c-rail-head .c-progress::after{content:"";position:absolute;inset:0;background:var(--accent);transform:scaleX(var(--rp,0));transform-origin:left}
.c-steps{padding:0 var(--gutter);gap:24px}
.c-step{width:min(640px,58vw);background:var(--bg-secondary);border:1px solid var(--line);padding:48px;border-radius:4px;display:grid;gap:22px;transition:border-color .5s}
.c-step.is-active{border-color:#EDE7DA40}
.c-step .num{font-family:var(--font-display);font-style:italic;font-size:6rem;line-height:.8;color:#EDE7DA30;transition:color .5s}
.c-step.is-active .num{color:var(--text-primary)}
.c-step h3{font-size:2.4rem;font-weight:500;line-height:1}
.c-step .when{font-size:.8rem;color:var(--text-muted)}
.c-step p{color:var(--text-muted);font-size:.95rem;max-width:44ch}
@media (max-width:899px){.c-step{width:auto;padding:36px}.c-rail-head .c-progress{display:none}}

/* receipts */
.c-receipts{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:72px}
.c-ticket{border:1px solid var(--line);border-radius:4px;padding:40px;display:grid;gap:26px;align-content:start;background:linear-gradient(#141722,#10121a)}
.c-ticket .who{display:grid;gap:2px}
.c-ticket .who b{font-family:var(--font-display);font-size:1.6rem;font-weight:500}
.c-ticket .who span,.c-ticket .ref{font-size:.78rem;color:var(--text-muted)}
.c-ticket .metric{font-family:var(--font-display);font-size:3.4rem;line-height:.9;letter-spacing:-.02em}
.c-ticket .metric small{display:block;font-family:var(--font-body);font-size:.78rem;letter-spacing:0;color:var(--text-muted);margin-top:10px;line-height:1.5}
.c-ticket blockquote{font-family:var(--font-display);font-style:italic;font-size:1.3rem;line-height:1.35;border-top:1px dashed var(--line);padding-top:22px}
.c-note{font-size:.78rem;color:var(--text-muted);margin-top:28px}
@media (max-width:960px){.c-receipts{grid-template-columns:1fr}}

/* pricing */
.c-tiers{display:grid;grid-template-columns:repeat(3,1fr);margin-top:72px;border:1px solid var(--line);border-radius:4px}
.c-tier{padding:44px 40px;display:grid;gap:26px;align-content:start}
.c-tier+.c-tier{border-left:1px solid var(--line)}
.c-tier.mid{background:var(--bg-secondary)}
.c-tier h3{font-size:2.2rem;font-weight:500;line-height:1}
.c-tier h3 span{display:block;font-family:var(--font-body);font-size:.8rem;color:var(--text-muted);margin-top:8px;letter-spacing:0}
.c-tier .price{font-family:var(--font-display);font-size:2.6rem;letter-spacing:-.02em}
.c-tier ul{display:grid;gap:10px;font-size:.86rem;color:var(--text-muted)}
.c-tier li{padding-left:18px;position:relative}
.c-tier li::before{content:"";position:absolute;left:0;top:.75em;width:8px;height:1px;background:var(--text-muted)}
.c-tier .fk{font-size:.78rem;color:var(--text-primary);border-top:1px dashed var(--line);padding-top:18px}
@media (max-width:960px){.c-tiers{grid-template-columns:1fr}.c-tier+.c-tier{border-left:0;border-top:1px solid var(--line)}.c-tier{padding:36px}}

/* final + footer */
.c-final{text-align:center;display:grid;justify-items:center;gap:40px}
.c-final .c-h2{font-size:clamp(2.6rem,6vw,5.4rem);max-width:16ch}
.c-final .k-body{color:var(--text-muted);max-width:52ch}
.c-foot{border-top:1px solid var(--line);padding:80px var(--gutter) 48px;display:grid;grid-template-columns:2fr repeat(3,1fr);gap:48px;font-size:.82rem;color:var(--text-muted)}
.c-foot h4{font-family:var(--font-body);font-weight:500;font-size:.78rem;color:var(--text-primary);margin-bottom:16px}
.c-foot ul{display:grid;gap:10px}
.c-foot a{text-decoration:none}
.c-foot a:hover{color:var(--text-primary)}
.c-foot .big{font-family:var(--font-display);font-size:2.4rem;color:var(--text-primary);line-height:1}
.c-foot .legal{grid-column:1 / -1;display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:28px}
@media (max-width:860px){.c-foot{grid-template-columns:1fr 1fr}.c-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="c-nav">
  <a class="c-mark" href="#main">Chronos <i>Atelier</i></a>
  <nav class="c-links" data-spy aria-label="Sections">
    <a href="#calibre">Calibre</a><a href="#finishing">Finishing</a><a href="#process">Commission</a><a href="#owners">Owners</a><a href="#pricing">Pricing</a>
  </nav>
  <span class="c-nav-meta">Le Sentier, CH</span>
</header>
<main id="main">
  <section class="c-hero" data-hero aria-labelledby="hero-title">
    <div class="c-hero-copy">
      <h1 id="hero-title" data-hero-part="headline">Wear an hour <em>no one else</em> owns.</h1>
      <p class="k-body" data-hero-part="sub">312 parts drawn, cut and finished by two watchmakers over 14&nbsp;months. We take twelve commissions a year, and each calibre is made once.</p>
      <div data-hero-part="cta"><a class="c-btn" href="#pricing" data-cta="primary" data-magnetic="7,0.14,0.78,0.4"><span data-magnetic-label>Reserve a 2027 commission</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></a></div>
      <div class="c-trust" data-hero-part="trust">
        <span class="c-ledger" role="img" aria-label="9 of 12 commissions reserved">${Array.from({ length: 12 }, (_, i) => `<i class="${i < 9 ? "on" : ""}"></i>`)}</span>
        <span>2027 ledger: 9 of 12 reserved<br>Beats since you arrived: <span class="c-beat" id="beats">0</span></span>
      </div>
    </div>
    <div class="c-hero-visual" data-hero-part="visual"><canvas id="hero-cal" aria-label="A hand-finished watch movement, beating at 4 Hz" role="img"></canvas></div>
  </section>

  <section id="calibre" data-section aria-labelledby="t-title">
    <div class="k-wrap c-tension">
      <h2 id="t-title" class="c-h2" data-reveal>Most luxury watches are finished by machine, by the hundred thousand.</h2>
      <p class="k-body" data-reveal>A Chronos calibre is the opposite bet: fewer than a dozen a year, every surface touched by hand, every part made for one wrist. Scroll down and we will take one apart for you.</p>
      <div class="c-versus" data-reveal>
        <dl><dt>Serial "luxury"</dt><dd>Movements per year <b>100,000+</b></dd><dd>Finishing <b>machine-stamped</b></dd><dd>Who services it <b>a regional centre</b></dd></dl>
        <dl><dt>A Chronos commission</dt><dd>Movements per year <b>12</b></dd><dd>Finishing <b>70 hours by hand</b></dd><dd>Who services it <b>the two who built it</b></dd></dl>
      </div>
    </div>
    <div class="c-explode" id="explode">
      <div class="c-explode-pin">
        <canvas id="ex-cal" role="img" aria-label="The calibre separating into five layers"></canvas>
        <ol class="c-layers" id="layers">
          ${LAYERS.map(([t, d], i) => `<li${i === 0 ? ' class="is-on"' : ""}><span class="n">Layer ${i + 1} of 5</span><h3>${t}</h3><p>${d}</p></li>`)}
        </ol>
      </div>
    </div>
  </section>

  <section id="finishing" data-section aria-labelledby="f-title">
    <div class="k-wrap">
      <div class="c-bento-head">
        <h2 id="f-title" class="c-h2" data-reveal>What fourteen months buys you.</h2>
        <p class="k-body" data-reveal>Every hour at the bench turns into something you can see or feel on the wrist. Here is the exchange rate.</p>
      </div>
      <div class="c-bento" data-stagger>
        ${FEATURES.map(([t, o, cls], i) => h`<article class="c-card ${cls}" data-spot>
          ${i === 0 ? `<svg viewBox="0 0 300 90" aria-hidden="true"><path d="M0 70 L120 70 L150 40 L300 40" fill="none" stroke="#EDE7DA" stroke-width="1"/><path d="M120 70 L150 40" stroke="#EDE7DA" stroke-width="5" opacity=".35"/><text x="160" y="80" fill="#A2A6B5" font-size="11" font-family="JetBrains Mono">45° anglage, mirror polished</text></svg>` : ""}
          <h3>${t}</h3><p><b>So that</b>${o}</p></article>`)}
      </div>
    </div>
  </section>

  <section id="process" data-section aria-labelledby="p-title">
    <div data-rail>
      <div data-rail-view>
        <div class="c-rail-head"><h2 id="p-title" class="c-h2" data-reveal>Three meetings, fourteen months.</h2><span class="c-progress" aria-hidden="true"></span></div>
        <ol class="c-steps" data-rail-track>
          ${STEPS.map(([t, w, d], i) => `<li class="c-step"><span class="num" aria-hidden="true">${i + 1}</span><span class="when">${w}</span><h3>${t}</h3><p>${d}</p></li>`)}
        </ol>
      </div>
    </div>
  </section>

  <section id="owners" data-section aria-labelledby="o-title">
    <div class="k-wrap">
      <h2 id="o-title" class="c-h2" data-reveal>Rate logs from the people wearing them.</h2>
      <div class="c-receipts" data-stagger>
        ${RECEIPTS.map(([n, r, ref, m, ms, q]) => `<article class="c-ticket"><div class="who"><b>${n}</b><span>${r}</span></div><span class="ref">${ref}</span><p class="metric">${m}<small>${ms}</small></p><blockquote>“${q}”</blockquote></article>`)}
      </div>
      <p class="c-note">Illustrative owners and figures. ${fiction("Chronos Atelier")}</p>
    </div>
  </section>

  <section id="pricing" data-section aria-labelledby="pr-title">
    <div class="k-wrap">
      <h2 id="pr-title" class="c-h2" data-reveal>Three calibres. One price each, fixed at signing.</h2>
      <div class="c-tiers" data-stagger>
        ${TIERS.map(([n, s, p, list, fk], i) => h`<article class="c-tier${i === 1 ? " mid" : ""}"><h3>${n}<span>${s}</span></h3><p class="price">${p}</p><ul>${list.map((l) => `<li>${l}</li>`)}</ul><p class="fk">${fk}</p><a class="c-ghost" href="#final">Start with ${n}</a></article>`)}
      </div>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="fi-title">
    <div class="k-wrap c-final">
      <h2 id="fi-title" class="c-h2" data-reveal>Three places left on the 2027 bench.</h2>
      <p class="k-body" data-reveal>Reserve with a 10% deposit. If you don't approve the drawing, you get every franc back — and you keep the sketches.</p>
      <a class="c-btn" href="#main" data-magnetic="7,0.14,0.78,0.4" data-reveal><span data-magnetic-label>Reserve a 2027 commission</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></a>
    </div>
  </section>
</main>
<footer class="c-foot">
  <div><p class="big">Chronos Atelier</p><p style="margin-top:16px;max-width:36ch">Rue du Lac 14, 1347 Le Sentier, Vallée de Joux. Bench visits by appointment, Tuesday to Friday.</p></div>
  <div><h4>Commission</h4><ul><li><a href="#pricing">Calibres and prices</a></li><li><a href="#process">How it works</a></li><li><a href="#owners">Owner rate logs</a></li></ul></div>
  <div><h4>Atelier</h4><ul><li><a href="#calibre">The movement</a></li><li><a href="#finishing">Hand finishing</a></li><li><a href="#final">Bench visits</a></li></ul></div>
  <div><h4>Exhibition</h4><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <div class="legal"><span>${fiction("Chronos Atelier")}</span><span>Set in Cormorant Garamond and JetBrains Mono.</span></div>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, smooth, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2;
    const GEARS = [
      { x: -0.40, y: -0.18, r: 0.34, n: 96, sp: 5, v: 0.025 },
      { x: 0.02, y: 0.04, r: 0.24, n: 80, sp: 5, v: -0.08 },
      { x: 0.32, y: 0.24, r: 0.19, n: 72, sp: 4, v: 0.3 },
      { x: 0.10, y: 0.52, r: 0.16, n: 64, sp: 4, v: -0.85 },
      { x: -0.20, y: 0.64, r: 0.10, n: 20, sp: 3, esc: true },
    ];
    const BRIDGES = [
      { w: 0.2, pts: [[-0.84, -0.30], [-0.40, -0.18], [-0.10, -0.52]] },
      { w: 0.11, pts: [[0.02, 0.04], [0.32, 0.24], [0.10, 0.52], [-0.20, 0.64]] },
      { w: 0.09, pts: [[0.74, 0.42], [0.32, 0.24]] },
    ];
    const BAL = { x: 0.44, y: -0.36, r: 0.24 };

    const off = (size, dpr, fn) => {
      const c = document.createElement("canvas");
      c.width = c.height = Math.ceil(size * dpr);
      const x = c.getContext("2d");
      x.scale(dpr, dpr); x.translate(size / 2, size / 2); fn(x);
      return c;
    };
    const metal = (c, r, a, b) => { const g = c.createLinearGradient(-r, -r, r, r); g.addColorStop(0, a); g.addColorStop(0.55, b); g.addColorStop(1, a); return g; };
    const jewel = (c, x, y, r) => {
      const g = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      g.addColorStop(0, "#e06a7a"); g.addColorStop(0.5, "#8d1f31"); g.addColorStop(1, "#3a0b14");
      c.fillStyle = "#c9ccd6"; c.beginPath(); c.arc(x, y, r * 1.55, 0, TAU); c.fill();
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    };
    const screw = (c, x, y, r, a) => {
      const g = c.createRadialGradient(x - r * 0.4, y - r * 0.4, 0, x, y, r);
      g.addColorStop(0, "#7d9be0"); g.addColorStop(0.6, "#2c4c9c"); g.addColorStop(1, "#15244d");
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
      c.strokeStyle = "#0b1226"; c.lineWidth = r * 0.28; c.beginPath();
      c.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); c.lineTo(x - Math.cos(a) * r * 0.8, y - Math.sin(a) * r * 0.8); c.stroke();
    };
    const gearSprite = (r, n, spokes, dpr, esc) => off(r * 2 + 6, dpr, (c) => {
      const rr = r * (esc ? 0.72 : 0.92), s = TAU / n;
      c.beginPath();
      for (let i = 0; i < n; i++) {
        const a = i * s;
        if (esc) { c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); c.lineTo(Math.cos(a + s * 0.62) * r, Math.sin(a + s * 0.62) * r); c.lineTo(Math.cos(a + s * 0.8) * r * 0.96, Math.sin(a + s * 0.8) * r * 0.96); }
        else { c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); c.lineTo(Math.cos(a + s * 0.2) * r, Math.sin(a + s * 0.2) * r); c.lineTo(Math.cos(a + s * 0.48) * r, Math.sin(a + s * 0.48) * r); c.lineTo(Math.cos(a + s * 0.68) * rr, Math.sin(a + s * 0.68) * rr); }
      }
      c.closePath();
      const ri = r * (esc ? 0.58 : 0.76), rh = r * 0.22, sw = r * 0.055;
      for (let k = 0; k < spokes; k++) {
        const a0 = (k / spokes) * TAU, a1 = ((k + 1) / spokes) * TAU;
        c.moveTo(Math.cos(a0 + sw / ri) * ri, Math.sin(a0 + sw / ri) * ri);
        c.arc(0, 0, ri, a0 + sw / ri, a1 - sw / ri);
        c.arc(0, 0, rh, a1 - sw / rh, a0 + sw / rh, true);
        c.closePath();
      }
      c.fillStyle = metal(c, r, "#b9a06a", "#5f5034");
      c.fill("evenodd");
      c.strokeStyle = "rgba(255,236,190,.28)"; c.lineWidth = 0.8; c.stroke();
      const hl = c.createRadialGradient(-r * 0.4, -r * 0.5, 0, 0, 0, r);
      hl.addColorStop(0, "rgba(255,245,220,.22)"); hl.addColorStop(1, "rgba(255,245,220,0)");
      c.fillStyle = hl; c.fill("evenodd");
      c.fillStyle = "#c7ccd8"; c.beginPath(); c.arc(0, 0, r * 0.12, 0, TAU); c.fill();
    });

    function Calibre() {
      let R = 0, dpr = 1, plate, bridges, dial, gears = [];
      this.build = (r, d) => {
        if (Math.abs(r - R) < 1 && d === dpr) return;
        R = r; dpr = d;
        plate = off(R * 2 + 8, dpr, (c) => {
          c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fillStyle = metal(c, R, "#2d3240", "#161922"); c.fill();
          c.save(); c.clip();
          const s = R * 0.056, pr = R * 0.07;
          for (let y = -R; y < R + s; y += s) for (let x = -R; x < R + s; x += s) {
            const g = c.createRadialGradient(x - pr * 0.35, y - pr * 0.35, 0, x, y, pr);
            g.addColorStop(0, "rgba(255,255,255,.075)"); g.addColorStop(0.55, "rgba(255,255,255,.012)"); g.addColorStop(1, "rgba(0,0,0,.07)");
            c.fillStyle = g; c.beginPath(); c.arc(x, y, pr, 0, TAU); c.fill();
          }
          for (const g of GEARS) { c.beginPath(); c.arc(g.x * R, g.y * R, g.r * R * 1.06, 0, TAU); c.fillStyle = "rgba(0,0,0,.38)"; c.fill(); }
          c.beginPath(); c.arc(BAL.x * R, BAL.y * R, BAL.r * R * 1.08, 0, TAU); c.fillStyle = "rgba(0,0,0,.42)"; c.fill();
          c.restore();
          c.beginPath(); c.arc(0, 0, R - 1, 0, TAU); c.strokeStyle = "rgba(237,231,218,.22)"; c.lineWidth = 1.5; c.stroke();
          c.beginPath(); c.arc(0, 0, R * 0.965, 0, TAU); c.strokeStyle = "rgba(0,0,0,.5)"; c.lineWidth = R * 0.02; c.stroke();
        });
        gears = GEARS.map((g) => ({ ...g, img: gearSprite(g.r * R, g.n, g.sp, dpr, g.esc) }));
        bridges = off(R * 2 + 8, dpr, (c) => {
          c.lineCap = "round"; c.lineJoin = "round";
          const path = (b) => { c.beginPath(); b.pts.forEach(([x, y], i) => (i ? c.lineTo(x * R, y * R) : c.moveTo(x * R, y * R))); };
          for (const b of BRIDGES) { path(b); c.strokeStyle = "rgba(0,0,0,.55)"; c.lineWidth = b.w * R + 6; c.stroke(); }
          for (const b of BRIDGES) { path(b); c.strokeStyle = "#dfe2ea"; c.lineWidth = b.w * R + 2.5; c.stroke(); }
          for (const b of BRIDGES) { path(b); c.strokeStyle = metal(c, R, "#8e94a3", "#4a4f5d"); c.lineWidth = b.w * R; c.stroke(); }
          c.globalCompositeOperation = "source-atop";
          c.save(); c.rotate(-0.5);
          for (let x = -R * 1.5; x < R * 1.5; x += R * 0.11) {
            const g = c.createLinearGradient(x, 0, x + R * 0.11, 0);
            g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, "rgba(255,255,255,.16)"); g.addColorStop(1, "rgba(255,255,255,0)");
            c.fillStyle = g; c.fillRect(x, -R * 1.5, R * 0.11, R * 3);
          }
          c.restore();
          c.globalCompositeOperation = "source-over";
          for (const g of GEARS) jewel(c, g.x * R, g.y * R, R * 0.022);
          for (const b of BRIDGES) { const [x, y] = b.pts[0]; screw(c, x * R, y * R, R * 0.035, x * 3); }
          screw(c, -0.10 * R, -0.52 * R, R * 0.032, 1.2);
        });
        dial = off(R * 2 + 8, dpr, (c) => {
          c.strokeStyle = "rgba(237,231,218,.55)";
          for (let i = 0; i < 60; i++) {
            const a = (i / 60) * TAU, l = i % 5 === 0 ? 0.07 : 0.03;
            c.lineWidth = i % 5 === 0 ? 2 : 1;
            c.beginPath(); c.moveTo(Math.cos(a) * R * 0.985, Math.sin(a) * R * 0.985); c.lineTo(Math.cos(a) * R * (0.985 - l), Math.sin(a) * R * (0.985 - l)); c.stroke();
          }
          c.beginPath(); c.arc(0, 0, R * 0.995, 0, TAU); c.lineWidth = 1; c.strokeStyle = "rgba(237,231,218,.35)"; c.stroke();
        });
      };
      const sprite = (c, img) => { const s = img.width / dpr; c.drawImage(img, -s / 2, -s / 2, s, s); };
      const balance = (c, t) => {
        const a = Math.sin(t * TAU * 2.5) * 2.4;
        c.save(); c.translate(BAL.x * R, BAL.y * R);
        c.save(); c.rotate(a * 0.18);
        c.strokeStyle = "rgba(170,186,220,.75)"; c.lineWidth = 0.8; c.beginPath();
        for (let k = 0; k <= 220; k++) { const th = (k / 220) * TAU * 9, rr = R * (0.03 + (k / 220) * 0.13); c.lineTo(Math.cos(th) * rr, Math.sin(th) * rr); }
        c.stroke(); c.restore();
        c.rotate(a);
        c.strokeStyle = metal(c, BAL.r * R, "#c9b07a", "#6a5838"); c.lineWidth = R * 0.034;
        c.beginPath(); c.arc(0, 0, BAL.r * R, 0, TAU); c.stroke();
        c.lineWidth = R * 0.018;
        for (let k = 0; k < 3; k++) { const th = (k / 3) * TAU; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(th) * BAL.r * R, Math.sin(th) * BAL.r * R); c.stroke(); }
        c.fillStyle = "#d9c38f";
        for (let k = 0; k < 10; k++) { const th = (k / 10) * TAU + 0.3; c.beginPath(); c.arc(Math.cos(th) * BAL.r * R * 1.06, Math.sin(th) * BAL.r * R * 1.06, R * 0.012, 0, TAU); c.fill(); }
        c.restore();
        c.lineCap = "round";
        c.beginPath(); c.moveTo(0.88 * R, -0.12 * R); c.lineTo(BAL.x * R, BAL.y * R);
        c.strokeStyle = "rgba(0,0,0,.55)"; c.lineWidth = R * 0.1 + 6; c.stroke();
        c.strokeStyle = metal(c, R, "#9aa0ae", "#525866"); c.lineWidth = R * 0.1; c.stroke();
        jewel(c, BAL.x * R, BAL.y * R, R * 0.024);
        screw(c, 0.8 * R, -0.16 * R, R * 0.032, 0.4);
      };
      // e: explode 0..1, tilt: y squash, zr: in-plane rotation
      this.draw = (c, cx, cy, t, { e = 0, tilt = 1, zr = 0, active = -1, leaders = false } = {}) => {
        const sep = R * 0.36 * e;
        const layers = [
          (k) => sprite(k, plate),
          (k) => {
            for (const g of gears) {
              k.save(); k.translate(g.x * R, g.y * R);
              if (g.esc) { const f = t * 8; k.rotate(((Math.floor(f) + smooth(clamp((f % 1) * 4))) / 20) * TAU); }
              else k.rotate(t * g.v);
              sprite(k, g.img); k.restore();
            }
          },
          (k) => sprite(k, bridges),
          (k) => balance(k, t),
          (k) => sprite(k, dial),
        ];
        layers.forEach((draw, i) => {
          const dy = (2 - i) * sep;
          if (e > 0.02) {
            c.save(); c.translate(cx, cy + dy); c.scale(1, tilt); c.rotate(zr);
            if (i === 0) { c.translate(0, 10 * e); c.globalAlpha = 0.5 * e; c.fillStyle = "#000"; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill(); }
            else { c.globalAlpha = 0.5 * e; c.strokeStyle = i === active ? "rgba(212,175,55,.35)" : "rgba(237,231,218,.10)"; c.lineWidth = 1 / Math.max(tilt, 0.4); c.beginPath(); c.arc(0, 0, R, 0, TAU); c.stroke(); }
            c.restore();
          }
          c.save(); c.translate(cx, cy + dy); c.scale(1, tilt); c.rotate(zr);
          c.globalAlpha = active < 0 || active === i ? 1 : 0.62 + 0.38 * (1 - e);
          draw(c); c.restore();
          if (leaders && e > 0.5) {
            const x0 = cx + R * 1.0, y0 = cy + dy;
            c.globalAlpha = clamp((e - 0.5) * 3);
            c.strokeStyle = i === active ? "#D4AF37" : "rgba(237,231,218,.3)";
            c.fillStyle = c.strokeStyle; c.lineWidth = 1;
            c.beginPath(); c.moveTo(x0 + 6, y0); c.lineTo(x0 + 46, y0); c.stroke();
            c.beginPath(); c.arc(x0 + 4, y0, 2.5, 0, TAU); c.fill();
            c.font = '500 11px "JetBrains Mono", monospace'; c.fillText("0" + (i + 1), x0 + 52, y0 + 4);
            c.globalAlpha = 1;
          }
        });
      };
    }

    // —— hero: assembled calibre with pointer light ——
    const heroCv = $("#hero-cal");
    const hero = new Calibre();
    const hs = canvas(heroCv, (s) => hero.build(Math.min(s.w, s.h) * 0.44, s.dpr));
    let lx = 0, ly = 0;
    loop(heroCv, (t) => {
      const { ctx: c, w, h } = hs;
      c.clearRect(0, 0, w, h);
      const r = heroCv.getBoundingClientRect();
      const tx = pointer.active ? clamp((pointer.x - r.left) / r.width, 0, 1) : 0.3;
      const ty = pointer.active ? clamp((pointer.y - r.top) / r.height, 0, 1) : 0.25;
      lx += (tx - lx) * 0.06; ly += (ty - ly) * 0.06;
      const halo = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.min(w, h) * 0.5);
      halo.addColorStop(0, "rgba(212,175,55,.06)"); halo.addColorStop(1, "rgba(212,175,55,0)");
      c.fillStyle = halo; c.fillRect(0, 0, w, h);
      hero.draw(c, w / 2, h / 2, RM ? 0.4 : t, { tilt: 1 - Math.abs(ly - 0.5) * 0.06, zr: (lx - 0.5) * 0.08 });
      const sheen = c.createRadialGradient(lx * w, ly * h, 0, lx * w, ly * h, Math.min(w, h) * 0.5);
      sheen.addColorStop(0, "rgba(255,248,230,.13)"); sheen.addColorStop(1, "rgba(255,248,230,0)");
      c.globalCompositeOperation = "source-atop"; c.fillStyle = sheen; c.fillRect(0, 0, w, h); c.globalCompositeOperation = "source-over";
    });

    const nav = $(".c-nav");
    onScroll(() => nav.classList.toggle("is-scrolled", scrollY > 40));

    // live beat counter (28,800 vph = 8 beats per second)
    const beats = $("#beats"), t0 = performance.now();
    const tickBeats = () => { beats.textContent = Math.floor(((performance.now() - t0) / 1000) * 8).toLocaleString("en-US"); };
    tickBeats(); setInterval(tickBeats, 125);

    // —— signature: scroll-exploded calibre ——
    const ex = $("#explode"), exCv = $("#ex-cal"), items = $$("#layers li");
    const cal = new Calibre();
    const es = canvas(exCv, (s) => cal.build(Math.min(s.w * 0.36, s.h / 2.7), s.dpr));
    let p = 0, active = 0;
    onScroll(() => {
      p = RM ? 0.9 : progress(ex);
      const a = Math.min(4, Math.floor(clamp((p - 0.3) / 0.62) * 5));
      if (a !== active) { active = a; items.forEach((li, i) => li.classList.toggle("is-on", i === a)); }
    });
    loop(exCv, (t) => {
      const { ctx: c, w, h } = es;
      c.clearRect(0, 0, w, h);
      const e = smooth(clamp((p - 0.06) / 0.28));
      const narrow = w < 560;
      cal.draw(c, narrow ? w / 2 : w * 0.42, h / 2, RM ? 0.4 : t, { e, tilt: lerp(1, 0.4, e), zr: lerp(0, -0.38, e), active: e > 0.6 ? active : -1, leaders: !narrow });
    });
  }),
};
