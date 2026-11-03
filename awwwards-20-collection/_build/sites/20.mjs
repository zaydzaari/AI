import { h, iife } from "../lib.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PROBLEM, PRICE_NOTE, PROOF_NOTE, conceptNote, rate, cost, usd } from "../aether.mjs";

const STYLE = "Zenith Supersonic";

// Three-letter "airport" codes for each model family (fictional hubs on a fictional globe).
const CODE = { core: "COR", unbound: "UNB", forge: "FRG", atlas: "ATL", swift: "SWF" };
const M = Object.fromEntries(MODELS.map((m) => [m.id, m]));

// The itinerary: one conversation that changes model five times. Token counts are illustrative.
const LEGS = [
  { from: "APP", to: "COR", m: "core", what: "PLAN THE FEATURE", inT: 2400, cached: 0, outT: 600, lat: 42, lon: 6 },
  { from: "COR", to: "FRG", m: "forge", what: "WRITE THE CODE", inT: 18000, cached: 14000, outT: 2400, lat: 30, lon: 60 },
  { from: "FRG", to: "UNB", m: "unbound", what: "RED-TEAM THE PATCH", inT: 6000, cached: 4000, outT: 800, lat: -6, lon: 100 },
  { from: "UNB", to: "ATL", m: "atlas", what: "CHECK THE WHOLE REPO", inT: 420000, cached: 0, outT: 1200, lat: -28, lon: 152 },
  { from: "ATL", to: "SWF", m: "swift", what: "WRITE THE CHANGELOG", inT: 3000, cached: 0, outT: 150, lat: 12, lon: 205 },
].map((l) => ({ ...l, fare: +cost(M[l.m], l.inT, l.outT, l.cached / l.inT).toFixed(6) }));
const ORIGIN = { lat: 18, lon: -42 };
const TOTAL = LEGS.reduce((a, l) => a + l.fare, 0);

const n = (v) => v.toLocaleString("en-US");

// Deterministic barcode from a string (decorative, build-time SVG).
function barcode(s, w = 132, ht = 30) {
  const seq = [...s.toUpperCase()].flatMap((c) => { const k = c.charCodeAt(0); return [1 + (k % 3), 1 + ((k >> 2) % 2), 1 + ((k >> 3) % 3), 1 + ((k >> 1) % 2)]; });
  const sum = seq.reduce((a, b) => a + b, 0), sc = w / sum;
  let x = 0, d = "";
  seq.forEach((u, i) => { if (i % 2 === 0) d += `M${(x * sc).toFixed(2)} 0h${(u * sc).toFixed(2)}v${ht}h-${(u * sc).toFixed(2)}z`; x += u; });
  return `<svg class="z20-bc" viewBox="0 0 ${w} ${ht}" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
}

// Static (non-animated) split-flap tiles for decorative boards.
const tiles = (s) => `<span class="z20-tiles" aria-hidden="true">${[...s].map((c) => `<span class="t">${c === " " ? "&nbsp;" : c}</span>`).join("")}</span>`;

const W = { flt: 5, dst: 7, ctx: 4, out: 5, rmk: 12 };
const PLANE = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M2 13.5 10 12 6.5 3.5h2.6L15 12l5.5-.6c1.1 0 1.9.5 1.9.9s-.8.9-1.9.9L15 13.8l-5.9 8.7H6.5L10 15l-8 .5z"/></svg>`;

export default {
  title: "Aether — One gate to every model",
  description: "One API key boards every request on five model families, with tokens and cost printed on every response. Zenith Supersonic design direction.",
  fonts: [
    { family: "Big Shoulders Display", axes: "wght@500;700;800" },
    { family: "IBM Plex Mono", axes: "wght@400;500;600" },
  ],
  tokens: {
    bgPrimary: "#080B11", bgSecondary: "#131924", accent: "#F43F5E", onAccent: "#16040A",
    textPrimary: "#E9EDF4", textMuted: "#96A0B2", line: "rgba(233,237,244,.12)",
    display: '"Big Shoulders Display", sans-serif', body: '"IBM Plex Mono", ui-monospace, monospace',
  },
  css: /* css */ `
:root{--h1-weight:800;--pad:clamp(36px,3vw,40px)}
body{font-size:1.05rem}
.z20-nav{position:sticky;top:0;z-index:40;height:60px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 var(--gutter);background:#080B11f2;border-bottom:1px solid var(--line);font-size:.76rem}
.z20-mark{font-family:var(--font-display);font-weight:800;font-size:1.3rem;letter-spacing:.14em;text-decoration:none;display:flex;align-items:baseline;gap:10px}
.z20-mark small{font-family:var(--font-body);font-weight:400;font-size:.6875rem;letter-spacing:.12em;color:var(--text-muted)}
.z20-links{display:flex;gap:4px}
.z20-links a{text-decoration:none;color:var(--text-muted);padding:8px 10px;letter-spacing:.06em;text-transform:uppercase}
.z20-links a:hover{color:var(--text-primary)}
.z20-links a.is-current{color:var(--text-primary);box-shadow:inset 0 -2px 0 var(--accent)}
.z20-gate{color:var(--text-muted);letter-spacing:.08em}
@media (max-width:900px){.z20-links{display:none}}
.z20-btn{display:inline-flex;align-items:center;gap:14px;min-height:58px;padding:0 26px;background:var(--accent);color:var(--on-accent);font-family:var(--font-display);font-weight:800;font-size:1.15rem;letter-spacing:.1em;text-decoration:none;text-transform:uppercase;clip-path:polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%)}
.z20-btn svg{width:22px;height:22px;fill:currentColor;transition:transform .5s var(--ease)}
.z20-btn.is-near svg{transform:translateX(5px) rotate(-8deg)}
.z20-btn span{padding-right:8px}
.z20-h2{font-size:clamp(2.4rem,4.6vw,4.2rem);font-weight:800;letter-spacing:-.01em;line-height:.95;text-transform:uppercase;max-width:18ch}
.z20-kick{font-size:.76rem;letter-spacing:.16em;color:var(--text-muted);text-transform:uppercase;margin-bottom:18px}
.z20-fine{margin-top:22px;font-size:.8rem;color:var(--text-muted);max-width:72ch}

/* split-flap cells (JS-driven) */
.z20-flap{display:inline-flex;gap:2px;vertical-align:top}
.fc{position:relative;display:inline-block;width:.72em;height:1.3em;perspective:280px;font-family:var(--font-display);font-weight:700;line-height:1.3em;text-align:center}
.fc b{position:absolute;inset:0;display:block;font-weight:inherit;background:#1A2130;color:#EEF1F6;border-radius:2px}
.fc .u,.fc .fu{clip-path:inset(0 0 50% 0)}
.fc .d,.fc .fd{clip-path:inset(50% 0 0 0);background:#161C29}
.fc::after{content:"";position:absolute;left:0;right:0;top:calc(50% - .5px);height:1px;background:#080B11;z-index:3;pointer-events:none}
.z20-tiles{display:inline-flex;gap:2px}
.z20-tiles .t{position:relative;display:inline-block;width:.72em;height:1.3em;line-height:1.3em;text-align:center;background:linear-gradient(#1A2130 50%,#161C29 50%);border-radius:2px;font-family:var(--font-display);font-weight:700}
.z20-tiles .t::after{content:"";position:absolute;left:0;right:0;top:calc(50% - .5px);height:1px;background:#080B11}

/* hero: the departure board */
.z20-hero{min-height:calc(100svh - 60px);display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:auto 1fr auto;column-gap:16px;row-gap:18px;padding:18px var(--gutter) 22px}
.z20-strip{grid-column:1 / -1;display:flex;align-items:center;justify-content:space-between;gap:18px;padding-bottom:14px;border-bottom:1px solid var(--line);font-size:.76rem;letter-spacing:.12em;color:var(--text-muted);text-transform:uppercase}
.z20-strip .z20-tiles{font-size:1.25rem;color:var(--text-primary)}
.z20-strip .clk{font-variant-numeric:tabular-nums;color:var(--text-primary)}
.z20-copy{grid-column:1 / span 6;align-self:center;display:grid;gap:22px;justify-items:start}
.z20-copy h1{position:relative;text-transform:uppercase;max-width:none;perspective:900px}
.z20-copy h1 .w{display:inline-block;transform-origin:50% 0;animation:z20-flap .9s var(--ease) both;animation-delay:calc(var(--i) * 90ms + 120ms)}
.z20-copy h1::after{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(180deg,transparent 0 calc(.49em - 1px),#080B11 calc(.49em - 1px) calc(.49em + 1px),transparent calc(.49em + 1px) .98em)}
@keyframes z20-flap{0%{transform:rotateX(-92deg);opacity:0}55%{transform:rotateX(14deg);opacity:1}100%{transform:none;opacity:1}}
.z20-copy .k-body{color:var(--text-muted);max-width:46ch}
.z20-cta{display:flex;align-items:center;gap:22px;flex-wrap:wrap}
.z20-trust{font-size:.8rem;color:var(--text-muted);display:flex;gap:6px 16px;flex-wrap:wrap;letter-spacing:.02em}
.z20-trust b{color:var(--text-primary);font-weight:500}
.z20-board{grid-column:7 / -1;align-self:center;justify-self:end;font-size:clamp(12px,1.32vw,21px);display:grid;gap:6px}
.z20-bh{display:flex;gap:.6em;padding:0 0 4px}
.z20-bh i{font-style:normal;font-family:var(--font-body);font-size:max(11px,.5em);letter-spacing:.12em;color:var(--text-muted)}
.z20-bh span,.z20-row>span{flex:none}
.z20-row{display:flex;gap:.6em;align-items:center;padding:0;border:0;background:none;text-align:left;font-size:inherit;border-radius:3px}
.z20-row:focus-visible{outline-offset:4px}
.z20-row.is-sel .c-rmk .fc b{background:var(--accent);color:var(--on-accent)}
.z20-row.is-sel .c-dst .fc b{color:#FFFFFF}
.z20-row:not(.is-sel) .c-rmk .fc b{color:var(--text-muted)}
.z20-route{grid-column:1 / -1;position:relative;height:clamp(160px,25vh,240px);border:1px solid var(--line);background:linear-gradient(180deg,#0B0F17,#0D121B);touch-action:pan-y}
.z20-route canvas{position:absolute;inset:0;width:100%;height:100%}
.z20-route::before,.z20-route::after{content:"";position:absolute;width:16px;height:16px;border:1px solid #E9EDF466;pointer-events:none}
.z20-route::before{left:-1px;top:-1px;border-right:0;border-bottom:0}
.z20-route::after{right:-1px;bottom:-1px;border-left:0;border-top:0}
.z20-cap{position:absolute;right:14px;top:10px;font-size:.6875rem;letter-spacing:.08em;color:var(--text-muted);text-transform:uppercase}
@media (max-width:900px){
  .z20-hero{grid-template-columns:1fr;grid-template-rows:auto;row-gap:12px;padding:12px var(--gutter) 16px;min-height:0;align-content:start}
  .z20-strip{display:none}
  .z20-copy,.z20-board,.z20-route{grid-column:1}
  .z20-copy{gap:10px}
  .z20-btn{min-height:52px;font-size:1rem}
  .z20-cta{gap:10px}
  .z20-trust{font-size:.76rem;gap:2px 10px;line-height:1.5}
  .z20-board{justify-self:start;font-size:13px;gap:4px}
  .z20-bh{display:none}
  .z20-row .c-flt,.z20-row .c-ctx{display:none}
  .z20-route{height:92px}
  .z20-cap{display:none}
}

/* problem: delays */
.z20-cols{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.z20-delays{display:grid;border-top:1px solid var(--line)}
.z20-delays li{display:grid;grid-template-columns:92px 1fr 92px 1fr;gap:16px 20px;align-items:baseline;padding:22px 0;border-bottom:1px solid var(--line);font-size:.88rem}
.z20-delays .st{font-family:var(--font-display);font-weight:800;letter-spacing:.08em;font-size:1rem}
.z20-delays .st.was{color:var(--text-muted);text-decoration:line-through;text-decoration-thickness:2px}
.z20-delays .was{color:var(--text-muted)}
.z20-delays .st.now{color:var(--text-primary)}
@media (max-width:900px){.z20-cols{grid-template-columns:1fr;gap:40px}.z20-delays li{grid-template-columns:80px 1fr;gap:8px 14px}}

/* signature: the itinerary globe */
.z20-ihead{margin-top:clamp(64px,6vw,80px)}
.z20-run{height:520vh;position:relative;margin-top:40px}
.z20-pin{position:sticky;top:60px;height:calc(100vh - 60px);display:grid;grid-template-columns:1.1fr .9fr;gap:24px;padding:18px var(--gutter)}
.z20-globe{position:relative;min-height:0;border:1px solid var(--line);background:radial-gradient(closest-side,#101726,#080B11)}
.z20-globe canvas{position:absolute;inset:0;width:100%;height:100%}
.z20-globe .lab{position:absolute;left:14px;bottom:10px;font-size:.6875rem;letter-spacing:.08em;color:var(--text-muted);text-transform:uppercase}
.z20-tick{display:grid;align-content:center;gap:16px;min-width:0;font-size:clamp(14px,1.5vw,24px)}
.z20-pair{display:flex;align-items:center;gap:.5em;font-size:2.2em}
.z20-pair svg{width:.8em;height:.8em;fill:var(--text-muted)}
.z20-legno{font-family:var(--font-body);font-size:max(11px,.56em);letter-spacing:.14em;color:var(--text-muted);text-transform:uppercase}
.z20-what{font-size:1em}
.z20-nums{display:grid;grid-template-columns:1fr 1fr;gap:12px 18px}
.z20-nums div{display:grid;gap:4px}
.z20-nums .lb{font-family:var(--font-body);font-size:max(11px,.46em);letter-spacing:.12em;color:var(--text-muted);text-transform:uppercase}
.z20-total{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding-top:14px;border-top:1px solid var(--line)}
.z20-total span{font-family:var(--font-body);font-size:max(11px,.5em);letter-spacing:.12em;color:var(--text-muted);text-transform:uppercase}
.z20-total b{font-family:var(--font-display);font-weight:800;font-size:2.2rem;line-height:1;color:var(--accent);font-variant-numeric:tabular-nums}
.z20-legs{display:grid;gap:2px;font-family:var(--font-body);font-size:max(11px,.52em);color:var(--text-muted)}
.z20-legs li{display:grid;grid-template-columns:7.5em 1fr auto;gap:12px;padding:6px 10px;border-left:1px solid transparent}
.z20-legs li.is-current{color:var(--text-primary);border-left-color:var(--accent);background:#131924}
.z20-legs b{font-weight:500}
@media (max-width:900px){
  .z20-run{height:460vh}
  .z20-pin{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto;gap:12px;padding:10px var(--gutter)}
  .z20-tick{font-size:13px;gap:10px}
  .z20-pair{font-size:2em}
  .z20-total b{font-size:1.6rem}
  .z20-legs{display:none}
}
@media (prefers-reduced-motion:reduce){.z20-run{height:auto}.z20-pin{position:relative;height:auto;min-height:100vh}.z20-globe{min-height:60vh}}

/* bento: boarding passes */
.z20-cabin{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.z20-pass{position:relative;isolation:isolate;display:grid;grid-template-columns:1fr 96px;gap:24px;background:var(--bg-secondary);border:1px solid var(--line);border-radius:10px;min-height:250px}
.z20-pass::before{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:radial-gradient(260px circle at var(--mx) var(--my),#E9EDF414,transparent 65%);opacity:0;transition:opacity .3s}
.z20-pass:hover::before{opacity:1}
.z20-pass .main{display:grid;gap:12px;align-content:start;min-width:0}
.z20-pass .cls{font-size:.82rem;color:var(--text-muted)}
.z20-pass h3{font-size:clamp(1.45rem,2vw,1.9rem);font-weight:700;line-height:1.05;text-transform:uppercase;letter-spacing:.01em}
.z20-pass p{font-size:.84rem;color:var(--text-muted)}
.z20-pass .stub{position:relative;display:grid;align-content:space-between;gap:10px;padding-left:20px;border-left:2px dashed #E9EDF42e;font-size:.6875rem;letter-spacing:.1em;color:var(--text-muted);text-transform:uppercase}
.z20-pass .stub::before,.z20-pass .stub::after{content:"";position:absolute;left:-12px;width:22px;height:22px;border-radius:50%;background:var(--bg-primary);border:1px solid var(--line)}
.z20-pass .stub::before{top:calc(-1 * var(--pad) - 12px)}
.z20-pass .stub::after{bottom:calc(-1 * var(--pad) - 12px)}
.z20-pass .stub b{display:block;font-family:var(--font-display);font-weight:800;font-size:1.6rem;letter-spacing:.02em;color:var(--text-primary)}
.z20-bc{width:100%;max-width:200px;height:28px;fill:#E9EDF455;margin-top:auto}
.z20-pass.d0{grid-column:span 2;grid-row:span 2}
.z20-pass.d0 h3{font-size:clamp(2rem,3.4vw,3.1rem)}
.z20-pass.d1,.z20-pass.d4,.z20-pass.d5{grid-column:span 2}
.z20-pass.d2,.z20-pass.d3{grid-template-columns:1fr}
.z20-pass.d2 .stub,.z20-pass.d3 .stub{padding:16px 0 0;border-left:0;border-top:2px dashed #E9EDF42e;display:flex;justify-content:space-between}
.z20-pass.d2 .stub::before,.z20-pass.d2 .stub::after,.z20-pass.d3 .stub::before,.z20-pass.d3 .stub::after{display:none}
.z20-pass.d2 .stub b,.z20-pass.d3 .stub b{font-size:1.3rem}
@media (max-width:900px){
  .z20-cabin{grid-template-columns:1fr}
  .z20-pass{grid-column:auto!important;grid-row:auto!important;grid-template-columns:1fr;min-height:0}
  .z20-pass .stub{padding:16px 0 0;border-left:0;border-top:2px dashed #E9EDF42e;display:flex;justify-content:space-between}
  .z20-pass .stub::before,.z20-pass .stub::after{display:none}
  .z20-pass .stub b{font-size:1.3rem}
}

/* rail: boarding */
.z20-rail-head{padding:0 var(--gutter);margin-bottom:28px;display:grid;gap:22px}
.z20-path{position:relative;height:24px;margin:0 var(--gutter) 28px;border-bottom:1px dashed #E9EDF433;overflow:clip}
.z20-path .fill{position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent);transform-origin:left;transform:scaleX(var(--rp,0))}
.z20-path .pw{position:absolute;left:0;top:0;bottom:0;width:calc(100% - 24px);transform:translateX(calc(var(--rp,0) * 100%))}
.z20-path svg{width:24px;height:24px;fill:var(--text-primary)}
.z20-steps{padding:0 var(--gutter);gap:16px}
.z20-step{width:min(560px,52vw);display:grid;gap:14px;align-content:start;background:var(--bg-secondary);border:1px solid var(--line);border-radius:6px}
.z20-step.is-active{border-color:#E9EDF488;background:#171E2B}
.z20-step .g{font-family:var(--font-display);font-weight:800;font-size:clamp(3.6rem,6vw,5.4rem);line-height:.9;color:transparent;-webkit-text-stroke:1.5px #E9EDF488}
.z20-step .gl{font-size:.6875rem;letter-spacing:.14em;color:var(--text-muted);text-transform:uppercase}
.z20-step h3{font-size:1.7rem;font-weight:700;line-height:1.05;text-transform:uppercase}
.z20-step p{font-size:.86rem;color:var(--text-muted)}
.z20-step pre{margin:0;background:#080B11;border:1px solid var(--line);padding:14px;font-size:.76rem;overflow-x:auto;white-space:pre}
@media (max-width:899px){.z20-step{width:auto}.z20-path{display:none}}

/* proof: luggage tags */
.z20-tags{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.z20-tag{position:relative;display:grid;gap:14px;background:var(--bg-secondary);border:1px solid var(--line);border-radius:8px 8px 8px 28px}
.z20-tag::before{content:"";position:absolute;right:22px;top:22px;width:14px;height:14px;border-radius:50%;border:2px solid #E9EDF433;background:var(--bg-primary)}
.z20-tag .hd{display:grid;gap:2px;padding-right:40px}
.z20-tag b{font-family:var(--font-display);font-weight:800;font-size:1.5rem;text-transform:uppercase;letter-spacing:.02em}
.z20-tag .hd span{font-size:.76rem;letter-spacing:.1em;color:var(--text-muted);text-transform:uppercase}
.z20-tag q{font-size:.9rem;line-height:1.65;quotes:"“" "”"}
.z20-tag .no{font-size:.6875rem;letter-spacing:.14em;color:var(--text-muted)}
@media (max-width:760px){.z20-tags{grid-template-columns:1fr}}

/* fares */
.z20-plans{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.z20-plan{display:grid;gap:14px;align-content:start;background:var(--bg-secondary);border:1px solid var(--line);border-radius:6px}
.z20-plan.feat{border-color:#E9EDF466;background:#171E2B}
.z20-plan .cl{font-size:.82rem;color:var(--text-muted)}
.z20-plan h3{font-size:1.5rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em}
.z20-plan .p{font-family:var(--font-display);font-weight:800;font-size:3rem;line-height:1}
.z20-plan .cad{font-size:.76rem;color:var(--text-muted)}
.z20-plan ul{display:grid;gap:6px;font-size:.84rem}
.z20-plan li::before{content:"+ ";color:var(--text-muted)}
.z20-plan .fk{font-size:.76rem;border-top:1px dashed #E9EDF433;padding-top:14px;color:var(--text-muted)}
@media (max-width:900px){.z20-plans{grid-template-columns:1fr}}
.z20-table{width:100%;margin-top:40px;border-collapse:separate;border-spacing:0 6px;font-size:.84rem}
.z20-table caption{text-align:left;font-family:var(--font-display);font-weight:800;font-size:1.4rem;letter-spacing:.08em;padding-bottom:6px;text-transform:uppercase}
.z20-table th,.z20-table td{text-align:left;padding:12px 14px;background:var(--bg-secondary)}
.z20-table thead th{background:none;font-weight:400;font-size:.6875rem;letter-spacing:.12em;color:var(--text-muted);text-transform:uppercase;padding-block:4px}
.z20-table tbody th{font-family:var(--font-display);font-weight:800;font-size:1.2rem;letter-spacing:.06em;text-transform:uppercase}
.z20-table td.n{font-family:var(--font-display);font-weight:700;font-size:1.15rem;font-variant-numeric:tabular-nums;letter-spacing:.02em}
.z20-table tbody tr>*:first-child{border-radius:4px 0 0 4px}
.z20-table tbody tr>*:last-child{border-radius:0 4px 4px 0}
@media (max-width:700px){.z20-table .r,.z20-table .c{display:none}.z20-table th,.z20-table td{padding:10px 8px}}

/* final + footer */
.z20-final{display:grid;justify-items:center;text-align:center;gap:30px}
.z20-final .z20-tiles{font-size:clamp(1.4rem,3.4vw,2.6rem);color:var(--text-primary)}
.z20-final .z20-h2{font-size:clamp(2.8rem,6vw,5.4rem);max-width:16ch}
.z20-foot{display:grid;grid-template-columns:2fr repeat(3,1fr);gap:40px;padding:72px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.76rem;color:var(--text-muted)}
.z20-foot h3{font-family:var(--font-display);font-size:1rem;font-weight:800;letter-spacing:.12em;color:var(--text-primary);margin-bottom:12px;text-transform:uppercase}
.z20-foot ul{display:grid;gap:8px}
.z20-foot a{text-decoration:none}
.z20-foot a:hover{color:var(--text-primary)}
.z20-foot .legal{grid-column:1 / -1;border-top:1px solid var(--line);padding-top:20px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
@media (max-width:860px){.z20-foot{grid-template-columns:1fr 1fr}.z20-foot>div:first-child{grid-column:1 / -1}}
`,
  body: h`
<header class="z20-nav">
  <a class="z20-mark" href="#main">${BRAND.name.toUpperCase()}<small>ZENITH</small></a>
  <nav class="z20-links" data-spy aria-label="Sections"><a href="#delays">Delays</a><a href="#itinerary">Itinerary</a><a href="#cabin">Cabin</a><a href="#boarding">Boarding</a><a href="#flyers">Flyers</a><a href="#fares">Fares</a></nav>
  <span class="z20-gate">GATE A · ALL FAMILIES</span>
</header>
<main id="main">
  <section class="z20-hero" data-hero aria-labelledby="z20-h">
    <div class="z20-strip"><span>${tiles("DEPARTURES")}</span><span>Five model families · one gate</span><span>UTC <span class="clk" id="z20-clock">--:--:--</span></span></div>
    <div class="z20-copy">
      <h1 id="z20-h" data-hero-part="headline">${"One gate to every model.".split(" ").map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ")}</h1>
      <p class="k-body" data-hero-part="sub">One key boards every request on five model families. Every ticket prints its fare.</p>
      <div class="z20-cta">
        <div data-hero-part="cta"><a class="z20-btn" href="#fares" data-cta="primary" data-magnetic="5,0.2,0.66,0.35"><span data-magnetic-label>Get your API key</span>${PLANE}</a></div>
        <p class="z20-trust" data-hero-part="trust"><span><b>5</b> families</span><span><b>3</b> temperaments</span><span>tokens and cost on <b>every response</b></span></p>
      </div>
    </div>
    <div class="z20-board" id="z20-board">
      <p class="z20-bh" aria-hidden="true"><span style="width:calc(${W.flt} * (.72em + 2px))"><i>FLIGHT</i></span><span style="width:calc(${W.dst} * (.72em + 2px))"><i>DESTINATION</i></span><span style="width:calc(${W.ctx} * (.72em + 2px))"><i>CONTEXT</i></span><span style="width:calc(${W.out} * (.72em + 2px))"><i>OUT / 1M</i></span><span><i>REMARKS</i></span></p>
      ${MODELS.map((m, i) => `<button type="button" class="z20-row" data-i="${i}" aria-label="${m.name}: ${m.role}, ${m.context} context, ${rate(m.outPrice)} per 1M output tokens"><span class="c-flt" data-flap="${W.flt}" data-v="AE10${i + 1}"></span><span class="c-dst" data-flap="${W.dst}" data-v="${m.name.toUpperCase()}"></span><span class="c-ctx" data-flap="${W.ctx}" data-v="${m.context}"></span><span class="c-out" data-flap="${W.out}" data-v="${rate(m.outPrice)}"></span><span class="c-rmk" data-flap="${W.rmk}" data-v="${m.variants[0].toUpperCase()}" data-variants="${m.variants.map((v) => v.toUpperCase()).join("|")}"></span></button>`)}
    </div>
    <div class="z20-route" data-hero-part="visual"><canvas id="z20-route" role="img" aria-label="Route arcs from your app to each model: distance is the context window, arc height is the output fare. Point at an arc or a board row to board it."></canvas><p class="z20-cap" aria-hidden="true">x = context window · arc height = output fare</p></div>
  </section>

  <section id="delays" data-section aria-labelledby="z20-d">
    <div class="k-wrap z20-cols">
      <div><h2 id="z20-d" class="z20-h2" data-reveal>Too many layovers between you and a model.</h2></div>
      <ul class="z20-delays" data-stagger>${PROBLEM.rows.map(([was, now]) => `<li><span class="st was">DELAYED</span><span class="was">${was}</span><span class="st now">ON TIME</span><span class="now">${now}</span></li>`)}</ul>
    </div>
    <div class="k-wrap z20-ihead"><h2 class="z20-h2" data-reveal style="max-width:22ch">One conversation. Five models. One ticket.</h2></div>
    <div class="z20-run" id="itinerary">
      <div class="z20-pin">
        <div class="z20-globe"><canvas id="z20-globe" role="img" aria-label="A route globe: one conversation flies from your app to Core, Forge, Unbound, Atlas and Swift, with a Mach cone trailing the request"></canvas><p class="lab" aria-hidden="true">Thread carried across every leg · fictional hubs</p></div>
        <div class="z20-tick">
          <p class="z20-legno"><span id="z20-legno">Leg 1 of 5</span></p>
          <div class="z20-pair" aria-hidden="true"><span data-flap="3" id="z20-from"></span>${PLANE}<span data-flap="3" id="z20-to"></span></div>
          <div class="z20-what" aria-hidden="true"><span data-flap="20" id="z20-what"></span></div>
          <div class="z20-nums" aria-hidden="true">
            <div><span class="lb">Input tokens</span><span data-flap="7" id="z20-in"></span></div>
            <div><span class="lb">Cached</span><span data-flap="7" id="z20-ca"></span></div>
            <div><span class="lb">Output tokens</span><span data-flap="7" id="z20-out"></span></div>
            <div><span class="lb">Leg fare</span><span data-flap="7" id="z20-fare"></span></div>
          </div>
          <p class="k-sr" aria-live="polite" id="z20-live"></p>
          <div class="z20-total"><span>Fare so far</span><b id="z20-total">$0.0000</b></div>
          <ol class="z20-legs">${LEGS.map((l, i) => `<li data-leg='${JSON.stringify(l)}'><b>${l.from} › ${l.to}</b><span>${M[l.m].name} · ${l.what.toLowerCase()}</span><span>$${l.fare.toFixed(4)}</span></li>`)}</ol>
        </div>
      </div>
    </div>
    <p class="k-wrap z20-fine">Illustrative itinerary at sample rates: total ${usd(TOTAL)}, most of it the 420K-token Atlas leg. Long context costs more, and the ticket says so before you fly. ${PRICE_NOTE}</p>
  </section>

  <section id="cabin" data-section aria-labelledby="z20-c">
    <div class="k-wrap">
      
      <h2 id="z20-c" class="z20-h2" data-reveal>Six things every ticket includes.</h2>
      <div class="z20-cabin" data-stagger>${BENEFITS.map(([f, b, d], i) => `<article class="z20-pass k-card d${i}" data-spot><div class="main"><p class="cls">${f}</p><h3>${b}</h3><p>${d}</p>${barcode(f + b)}</div><div class="stub" aria-hidden="true"><span>Seat<b>0${i + 1}${"ABCDEF"[i]}</b></span><span>Gate<b>A</b></span></div></article>`)}</div>
    </div>
  </section>

  <section id="boarding" data-section aria-labelledby="z20-b">
    <div data-rail>
      <div data-rail-view>
        <div class="z20-rail-head"><h2 id="z20-b" class="z20-h2" data-reveal>Three gates to your first response.</h2></div>
        <div class="z20-path" aria-hidden="true"><span class="fill"></span><span class="pw">${PLANE}</span></div>
        <ol class="z20-steps" data-rail-track>${STEPS.map(([t, d], i) => `<li class="z20-step k-card"><p class="gl">Gate ${i + 1} of 3</p><span class="g" aria-hidden="true">G${i + 1}</span><h3>${t}</h3><p>${d}</p><pre><code>${['model: "core-128k:low-refusal"', `baseURL: "${BRAND.apiBase}"\napiKey:  process.env.${BRAND.envKey}`, "usage: tokens · cached_tokens · cost"][i]}</code></pre></li>`)}</ol>
      </div>
    </div>
  </section>

  <section id="flyers" data-section aria-labelledby="z20-f">
    <div class="k-wrap">
      
      <h2 id="z20-f" class="z20-h2" data-reveal>Who books which seat.</h2>
      <div class="z20-tags" data-stagger>${PROOF.map(([role, focus, q], i) => `<article class="z20-tag k-card"><p class="hd"><b>${role}</b><span>${focus}</span></p><q>${q}</q><p class="no">TAG AE-${String(i + 1).padStart(4, "0")}</p></article>`)}</div>
      <p class="z20-fine">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="fares" data-section aria-labelledby="z20-p">
    <div class="k-wrap">
      
      <h2 id="z20-p" class="z20-h2" data-reveal>Pay per token. The fare is on the ticket.</h2>
      <div class="z20-plans" data-stagger>${PLANS.map((p, i) => h`<article class="z20-plan k-card${p.featured ? " feat" : ""}"><p class="cl">Class ${"EPA"[i]}</p><h3>${p.name}</h3><p class="p">${p.price}</p><p class="cad">${p.cadence}</p><ul>${p.features.map((f) => `<li>${f}</li>`)}</ul><p class="fk">${p.fk}</p></article>`)}</div>
      <table class="z20-table" data-reveal>
        <caption>Timetable · per 1M tokens</caption>
        <thead><tr><th scope="col">Model</th><th scope="col" class="r">Role</th><th scope="col" class="c">Context</th><th scope="col">Input</th><th scope="col">Cached</th><th scope="col">Output</th></tr></thead>
        <tbody>${MODELS.map((m) => `<tr><th scope="row">${m.name}</th><td class="r">${m.role}</td><td class="c n">${m.context}</td><td class="n">${rate(m.inPrice)}</td><td class="n">${rate(m.cached)}</td><td class="n">${rate(m.outPrice)}</td></tr>`)}</tbody>
      </table>
      <p class="z20-fine">${PRICE_NOTE}</p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="z20-z">
    <div class="k-wrap z20-final">
      ${tiles("NOW BOARDING")}
      <h2 id="z20-z" class="z20-h2" data-reveal>Your first request is cleared for departure.</h2>
      <a class="z20-btn" href="#fares" data-magnetic="5,0.2,0.66,0.35" data-reveal><span data-magnetic-label>Get your API key</span>${PLANE}</a>
    </div>
  </section>
</main>
<footer class="z20-foot">
  <div><p class="z20-mark">${BRAND.name.toUpperCase()}<small>ZENITH</small></p><p style="margin-top:12px;max-width:44ch">${conceptNote(STYLE)}</p></div>
  <div><h3>Destinations</h3><ul>${MODELS.map((m) => `<li><a href="#fares">${m.name} · ${CODE[m.id]}</a></li>`)}</ul></div>
  <div><h3>Platform</h3><ul><li><a href="#itinerary">Unified chat</a></li><li><a href="#boarding">API quickstart</a></li><li><a href="#fares">Token rates</a></li></ul></div>
  <div><h3>Exhibition</h3><ul><li><a href="../index.html">Back to the collection</a></li><li><a href="../fingerprint-registry.json">Fingerprint registry</a></li></ul></div>
  <p class="legal"><span>${PRICE_NOTE}</span><span>Set in Big Shoulders Display and IBM Plex Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, lerp, smooth, canvas, loop, onScroll, progress, pointer } = K;
    const TAU = Math.PI * 2, D2R = Math.PI / 180;
    const CODES = { core: "COR", unbound: "UNB", forge: "FRG", atlas: "ATL", swift: "SWF" };

    // —— split-flap cells ——
    const DRUM = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.,:-/";
    const HALF = 46;
    const Flap = (el) => {
      const len = +el.dataset.flap;
      el.classList.add("z20-flap"); el.setAttribute("aria-hidden", "true");
      const cells = Array.from({ length: len }, () => {
        const c = document.createElement("span"); c.className = "fc";
        c.innerHTML = "<b class='u'></b><b class='d'></b><b class='fu'></b><b class='fd'></b>";
        el.appendChild(c);
        const [u, d, fu, fd] = c.children;
        return { u, d, fu, fd, cur: " ", target: " ", busy: false, left: 0 };
      });
      const show = (cell, ch) => { cell.u.textContent = cell.d.textContent = cell.fu.textContent = cell.fd.textContent = ch; cell.cur = ch; };
      const step = (cell) => {
        if (cell.cur === cell.target) { cell.busy = false; return; }
        cell.busy = true;
        const nx = cell.left-- > 0 ? DRUM[1 + Math.floor(Math.random() * (DRUM.length - 1))] : cell.target;
        const old = cell.cur;
        cell.u.textContent = nx; cell.fd.textContent = nx; cell.fu.textContent = old; cell.d.textContent = old;
        const a = cell.fu.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], { duration: HALF, easing: "ease-in", fill: "forwards" });
        const b = cell.fd.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], { duration: HALF, delay: HALF, easing: "cubic-bezier(.3,1.5,.6,1)", fill: "both" });
        cell.cur = nx;
        b.onfinish = () => { a.cancel(); b.cancel(); show(cell, nx); step(cell); };
      };
      const set = (str, { delay = 0, spin = 3 } = {}) => {
        const s = String(str).toUpperCase().padEnd(len).slice(0, len);
        cells.forEach((cell, i) => {
          const ch = s[i];
          if (ch === cell.target && (cell.busy || ch === cell.cur)) return;
          cell.target = ch;
          if (RM) return show(cell, ch);
          cell.left = ch === " " ? 0 : spin + (i % 2);
          if (!cell.busy) { cell.busy = true; setTimeout(() => step(cell), delay + i * 14); }
        });
      };
      return { set, len };
    };

    // —— hero: departure board ——
    const rows = $$(".z20-row").map((row, i) => {
      const f = Object.fromEntries(["flt", "dst", "ctx", "out", "rmk"].map((k) => { const el = $(".c-" + k, row); return [k, { flap: Flap(el), v: el.dataset.v }]; }));
      return { row, i, f, variants: $(".c-rmk", row).dataset.variants.split("|"), vi: 0 };
    });
    rows.forEach((r) => ["flt", "dst", "ctx", "out"].forEach((k, j) => r.f[k].flap.set(r.f[k].v, { delay: 180 + r.i * 80 + j * 60 })));
    let sel = 0, userAt = -1e9, clockT = -1, cycleT = 0;
    const remark = (r, first) => r.f.rmk.flap.set(r.i === sel ? "NOW BOARDING" : r.variants[r.vi % r.variants.length], { delay: first ? 420 + r.i * 80 : 0 });
    const select = (i, user) => {
      if (user) userAt = performance.now();
      if (i === sel) return;
      sel = i;
      rows.forEach((r) => { r.row.classList.toggle("is-sel", r.i === sel); r.row.setAttribute("aria-pressed", r.i === sel ? "true" : "false"); remark(r); });
    };
    rows.forEach((r) => {
      r.row.classList.toggle("is-sel", r.i === sel); r.row.setAttribute("aria-pressed", r.i === sel ? "true" : "false"); remark(r, true);
      r.row.addEventListener("pointerenter", () => select(r.i, true));
      r.row.addEventListener("focus", () => select(r.i, true));
      r.row.addEventListener("click", () => select(r.i, true));
    });
    const clock = $("#z20-clock");
    loop($("#z20-board"), (t, dt) => {
      const now = new Date(), sec = now.getUTCSeconds();
      if (sec !== clockT) { clockT = sec; clock.textContent = now.toISOString().slice(11, 19); }
      if (RM) return;
      cycleT += dt;
      if (cycleT > 3.6) {
        cycleT = 0;
        rows.forEach((r) => { if (r.variants.length > 1 && r.i !== sel) { r.vi++; remark(r); } });
        if (performance.now() - userAt > 6000) select((sel + 1) % rows.length, false);
      }
    });

    // —— hero: route arcs. x = context window (log), arc height = output fare ——
    const rc = $("#z20-route"), rs = canvas(rc);
    const hubs = AE.MODELS.map((m, i) => ({ m, i, code: CODES[m.id], u: (Math.log10(m.contextK) - Math.log10(32)) / (3 - Math.log10(32)) }));
    const geo = () => {
      const { w, h } = rs, base = h - (w < 600 ? 16 : 30), top = w < 600 ? 10 : 22, ox = Math.max(26, w * 0.045);
      const x0 = w * (w < 600 ? 0.38 : 0.32), x1 = w - Math.max(34, w * 0.05);
      return hubs.map((hb) => {
        const dx = lerp(x0, x1, hb.u) + (hb.m.id === "unbound" ? 14 : 0);
        const apex = (base - top) * (0.22 + 0.78 * (hb.m.outPrice / 6));
        return { hb, p0: [ox, base], p1: [(ox + dx) / 2, base - 2 * apex], p2: [dx, base], base };
      });
    };
    const bez = (a, t) => { const u = 1 - t; return [u * u * a.p0[0] + 2 * u * t * a.p1[0] + t * t * a.p2[0], u * u * a.p0[1] + 2 * u * t * a.p1[1] + t * t * a.p2[1]]; };
    const bezD = (a, t) => [2 * (1 - t) * (a.p1[0] - a.p0[0]) + 2 * t * (a.p2[0] - a.p1[0]), 2 * (1 - t) * (a.p1[1] - a.p0[1]) + 2 * t * (a.p2[1] - a.p1[1])];
    rc.addEventListener("pointermove", (e) => {
      const r = rc.getBoundingClientRect(), x = e.clientX - r.left, arcs = geo();
      let best = 0, bd = 1e9;
      arcs.forEach((a, i) => { const d = Math.abs(a.p2[0] - x); if (d < bd) { bd = d; best = i; } });
      select(best, true);
    });

    // A delta-wing request with a Mach cone (half-angle 30°: Mach 2) and trailing shock arcs.
    const machCone = (ctx, x, y, dx, dy, L, t, alpha = 1) => {
      const m = Math.hypot(dx, dy) || 1; dx /= m; dy /= m;
      const bx = -dx, by = -dy, s = Math.sin(Math.PI / 6), c = Math.cos(Math.PI / 6);
      const l1 = [x + (bx * c - by * s) * L, y + (by * c + bx * s) * L], l2 = [x + (bx * c + by * s) * L, y + (by * c - bx * s) * L];
      const g = ctx.createLinearGradient(x, y, x + bx * L, y + by * L);
      g.addColorStop(0, `rgba(244,63,94,${0.42 * alpha})`); g.addColorStop(1, "rgba(244,63,94,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(l1[0], l1[1]); ctx.lineTo(l2[0], l2[1]); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = `rgba(251,113,133,${0.75 * alpha})`; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(l1[0], l1[1]); ctx.lineTo(x, y); ctx.lineTo(l2[0], l2[1]); ctx.stroke();
      // shock arcs travelling back down the cone
      const ang = Math.atan2(by, bx);
      for (let k = 0; k < 3; k++) {
        const f = ((RM ? 0.5 : t * 1.4) + k / 3) % 1, r = f * L;
        ctx.strokeStyle = `rgba(251,113,133,${(1 - f) * 0.5 * alpha})`;
        ctx.beginPath(); ctx.arc(x, y, Math.max(1, r), ang - Math.PI / 6, ang + Math.PI / 6); ctx.stroke();
      }
      ctx.fillStyle = "#F43F5E";
      ctx.beginPath();
      ctx.moveTo(x + dx * 8, y + dy * 8);
      ctx.lineTo(x - dx * 5 - dy * 6, y - dy * 5 + dx * 6);
      ctx.lineTo(x - dx * 2, y - dy * 2);
      ctx.lineTo(x - dx * 5 + dy * 6, y - dy * 5 - dx * 6);
      ctx.closePath(); ctx.fill();
    };

    let fly = 0, flySel = -1;
    loop(rc, (t, dt) => {
      const { ctx, w, h } = rs;
      ctx.clearRect(0, 0, w, h);
      const arcs = geo(), small = w < 600, base = arcs[0].base, ox = arcs[0].p0[0];
      // ground: runway line, ticks along the context axis
      ctx.strokeStyle = "rgba(233,237,244,.22)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, base + 0.5); ctx.lineTo(w, base + 0.5); ctx.stroke();
      const ticks = new Path2D();
      for (let x = ox; x < w; x += small ? 12 : 16) { ticks.moveTo(x, base); ticks.lineTo(x, base + 4); }
      ctx.strokeStyle = "rgba(233,237,244,.14)"; ctx.stroke(ticks);
      ctx.font = `500 ${small ? 9 : 10}px "IBM Plex Mono", monospace`; ctx.textBaseline = "top";
      ctx.fillStyle = "#96A0B2";
      ctx.fillText("YOUR APP", Math.max(4, ox - 22), base + 7);
      // all routes
      const rest = new Path2D();
      arcs.forEach((a, i) => { if (i === sel) return; rest.moveTo(a.p0[0], a.p0[1]); rest.quadraticCurveTo(a.p1[0], a.p1[1], a.p2[0], a.p2[1]); });
      ctx.setLineDash([3, 5]); ctx.strokeStyle = "rgba(233,237,244,.26)"; ctx.stroke(rest); ctx.setLineDash([]);
      arcs.forEach((a, i) => {
        const on = i === sel;
        ctx.fillStyle = on ? "#F43F5E" : "rgba(233,237,244,.7)";
        ctx.fillRect(a.p2[0] - 3, a.p2[1] - 3, 6, 6);
        if (!small || on) {
          ctx.fillStyle = on ? "#E9EDF4" : "#96A0B2";
          const lift = a.hb.m.id === "unbound" ? 13 : 0;
          ctx.fillText(a.hb.code, a.p2[0] - 9, a.p2[1] - 18 - lift - (small ? 0 : 0));
          if (!small && a.hb.m.id !== "unbound") ctx.fillText(a.hb.m.context, a.p2[0] - 9, base + 7);
        }
      });
      // selected route: lit up to the request, Mach cone at the head
      const a = arcs[sel];
      if (flySel !== sel) { flySel = sel; fly = 0; }
      fly = RM ? 0.62 : (fly + dt * 0.42) % 1.15;
      const ft = smooth(clamp(fly));
      const lit = new Path2D(); lit.moveTo(a.p0[0], a.p0[1]);
      for (let k = 1; k <= 40; k++) { const p = bez(a, (k / 40) * ft); lit.lineTo(p[0], p[1]); }
      ctx.strokeStyle = "rgba(244,63,94,.9)"; ctx.lineWidth = 1.6; ctx.stroke(lit);
      const ahead = new Path2D(); const p0 = bez(a, ft); ahead.moveTo(p0[0], p0[1]);
      for (let k = 1; k <= 30; k++) { const p = bez(a, ft + (1 - ft) * (k / 30)); ahead.lineTo(p[0], p[1]); }
      ctx.strokeStyle = "rgba(233,237,244,.55)"; ctx.lineWidth = 1; ctx.stroke(ahead);
      ctx.lineWidth = 1;
      if (fly <= 1) { const [x, y] = bez(a, ft), [ddx, ddy] = bezD(a, ft); machCone(ctx, x, y, ddx, ddy, small ? 26 : clamp(w * 0.05, 40, 80), t); }
      else { const f = (fly - 1) / 0.15; ctx.strokeStyle = `rgba(244,63,94,${1 - f})`; ctx.beginPath(); ctx.arc(a.p2[0], a.p2[1], 4 + f * 26, 0, TAU); ctx.stroke(); }
      if (!small) {
        const m = a.hb.m;
        ctx.fillStyle = "#E9EDF4"; ctx.font = '600 11px "IBM Plex Mono", monospace';
        ctx.fillText(`${a.hb.code} · ${m.name.toUpperCase()} · ${m.context} · IN $${m.inPrice.toFixed(2)} · OUT $${m.outPrice.toFixed(2)} / 1M`, 14, 12);
      }
    });

    // —— signature: one conversation, five legs, a Mach cone across a route globe ——
    const run = $("#itinerary"), gc = $("#z20-globe");
    const LEGS = $$(".z20-legs li").map((li) => JSON.parse(li.dataset.leg));
    const LI = $$(".z20-legs li");
    const V = (lat, lon) => { const a = lat * D2R, b = lon * D2R; return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; };
    const nodes = [{ code: "APP", v: V(18, -42) }, ...LEGS.map((l) => ({ code: l.to, v: V(l.lat, l.lon) }))];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const norm = (a) => { const m = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / m, a[1] / m, a[2] / m]; };
    const slerp = (a, b, t) => { const om = Math.acos(clamp(dot(a, b), -1, 1)), so = Math.sin(om) || 1; const ka = Math.sin((1 - t) * om) / so, kb = Math.sin(t * om) / so; return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb]; };
    const legPoint = (k, t) => { const a = nodes[k].v, b = nodes[k + 1].v, om = Math.acos(clamp(dot(a, b), -1, 1)); const p = slerp(a, b, t), r = 1 + (0.05 + 0.18 * om / Math.PI) * Math.sin(Math.PI * t); return [p[0] * r, p[1] * r, p[2] * r]; };

    // Procedural fictional landmasses on a Fibonacci sphere.
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const blobs = Array.from({ length: 17 }, () => ({ c: norm([rnd() * 2 - 1, (rnd() * 2 - 1) * 0.8, rnd() * 2 - 1]), k: 12 + rnd() * 26, w: 0.6 + rnd() * 0.6 }));
    const land = [];
    const N = 5600, GA = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = GA * i, v = [Math.cos(th) * r, y, Math.sin(th) * r];
      let f = 0; for (const b of blobs) f += b.w * Math.exp(-(1 - dot(v, b.c)) * b.k);
      f += 0.14 * Math.sin(v[0] * 9 + v[1] * 5) * Math.sin(v[2] * 7 - v[1] * 4);
      if (f > 0.5) land.push(v);
    }
    const gs = canvas(gc);
    let yaw = 0.6, pitch = 0.3, yawT = yaw, pitchT = pitch;
    const project = (v, R, cx, cy) => {
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = v[0] * cyw + v[2] * syw, z1 = -v[0] * syw + v[2] * cyw;
      const y2 = v[1] * cp - z1 * sp, z2 = v[1] * sp + z1 * cp;
      return [cx + x1 * R, cy - y2 * R, z2, x1 * x1 + y2 * y2];
    };
    const vis = (q) => q[2] > 0 || q[3] > 1;

    // Ticket board
    const fl = Object.fromEntries(["from", "to", "what", "in", "ca", "out", "fare"].map((k) => [k, Flap($("#z20-" + k))]));
    const legNo = $("#z20-legno"), totalEl = $("#z20-total"), live = $("#z20-live");
    const pad = (s, n) => String(s).padStart(n);
    let shown = -1;
    const board = (k) => {
      if (k === shown) return;
      shown = k;
      const l = LEGS[k];
      fl.from.set(l.from); fl.to.set(l.to, { delay: 80 }); fl.what.set(l.what, { delay: 140 });
      fl.in.set(pad(l.inT.toLocaleString("en-US"), 7), { delay: 200 }); fl.ca.set(pad(l.cached.toLocaleString("en-US"), 7), { delay: 260 });
      fl.out.set(pad(l.outT.toLocaleString("en-US"), 7), { delay: 320 }); fl.fare.set(pad("$" + l.fare.toFixed(4), 7), { delay: 380 });
      legNo.textContent = `Leg ${k + 1} of ${LEGS.length}`;
      live.textContent = `Leg ${k + 1}: ${l.from} to ${l.to}, ${l.what.toLowerCase()}. ${l.inT} input tokens, ${l.cached} cached, ${l.outT} output, fare $${l.fare.toFixed(4)}.`;
      LI.forEach((li, i) => li.classList.toggle("is-current", i === k));
    };
    let leg = 0, lt = 0, local = 0;
    onScroll(() => {
      const p = RM ? 1 : clamp((progress(run) - 0.02) / 0.94);
      const pp = Math.min(LEGS.length - 1e-6, p * LEGS.length);
      leg = Math.floor(pp); local = pp - leg;
      lt = RM ? 1 : smooth(clamp((local - 0.1) / 0.72));
      board(leg);
      let tot = 0; for (let i = 0; i < leg; i++) tot += LEGS[i].fare; tot += LEGS[leg].fare * lt;
      totalEl.textContent = "$" + tot.toFixed(4);
    });

    loop(gc, (t, dt) => {
      const { ctx, w, h } = gs;
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * (w < 600 ? 0.4 : 0.38), cx = w / 2, cy = h / 2;
      // camera follows the request, leading slightly east
      const head = norm(legPoint(leg, lt));
      const lat = Math.asin(clamp(head[1], -1, 1)), lon = Math.atan2(head[0], head[2]);
      let ty = -(lon + 0.35); while (ty - yaw > Math.PI) ty -= TAU; while (ty - yaw < -Math.PI) ty += TAU;
      yawT = ty; pitchT = clamp(lat * 0.55 + 0.12, -0.6, 0.7);
      const k = RM ? 1 : 1 - Math.exp(-dt * 3.2);
      yaw = lerp(yaw, yawT, k); pitch = lerp(pitch, pitchT, k);
      // atmosphere + disc
      const atm = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.14);
      atm.addColorStop(0, "rgba(140,170,220,.16)"); atm.addColorStop(1, "rgba(140,170,220,0)");
      ctx.fillStyle = atm; ctx.beginPath(); ctx.arc(cx, cy, R * 1.14, 0, TAU); ctx.fill();
      const disc = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      disc.addColorStop(0, "#1A2333"); disc.addColorStop(1, "#0A0E16");
      ctx.fillStyle = disc; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
      ctx.strokeStyle = "rgba(233,237,244,.28)"; ctx.lineWidth = 1; ctx.stroke();
      // graticule
      const grat = new Path2D();
      const seg = (f) => { let prev = null; for (let i = 0; i <= 72; i++) { const q = project(f(i / 72), R, cx, cy); if (q[2] > 0) { if (prev) grat.lineTo(q[0], q[1]); else grat.moveTo(q[0], q[1]); prev = q; } else prev = null; } };
      for (let la = -60; la <= 60; la += 30) seg((u) => V(la, u * 360));
      for (let lo = 0; lo < 360; lo += 30) seg((u) => V(-90 + u * 180, lo));
      ctx.strokeStyle = "rgba(233,237,244,.07)"; ctx.stroke(grat);
      // land dots, two brightness buckets
      const lit = new Path2D(), dim = new Path2D(), ds = w < 600 ? 1.2 : 1.5;
      for (const v of land) { const q = project(v, R, cx, cy); if (q[2] <= 0) continue; (q[2] > 0.45 ? lit : dim).rect(q[0] - ds / 2, q[1] - ds / 2, ds, ds); }
      ctx.fillStyle = "rgba(233,237,244,.5)"; ctx.fill(lit);
      ctx.fillStyle = "rgba(233,237,244,.22)"; ctx.fill(dim);
      // routes: flown (solid), current (lit to the head), ahead (dashed)
      const flown = new Path2D(), ahead = new Path2D(), cur = new Path2D();
      const trace = (path, kk, t0, t1, n = 48) => { let pen = false; for (let i = 0; i <= n; i++) { const q = project(legPoint(kk, lerp(t0, t1, i / n)), R, cx, cy); if (vis(q)) { pen ? path.lineTo(q[0], q[1]) : path.moveTo(q[0], q[1]); pen = true; } else pen = false; } };
      for (let i = 0; i < LEGS.length; i++) { if (i < leg) trace(flown, i, 0, 1); else if (i > leg) trace(ahead, i, 0, 1); else { trace(cur, i, 0, Math.max(0.001, lt)); trace(ahead, i, lt, 1); } }
      ctx.lineWidth = 1.4; ctx.strokeStyle = "rgba(233,237,244,.55)"; ctx.stroke(flown);
      ctx.setLineDash([3, 6]); ctx.strokeStyle = "rgba(233,237,244,.3)"; ctx.lineWidth = 1; ctx.stroke(ahead); ctx.setLineDash([]);
      ctx.strokeStyle = "#F43F5E"; ctx.lineWidth = 2; ctx.stroke(cur);
      // hubs
      ctx.font = `600 ${w < 600 ? 10 : 12}px "IBM Plex Mono", monospace`; ctx.textBaseline = "middle";
      nodes.forEach((nd, i) => {
        const q = project(nd.v, R, cx, cy); if (q[2] <= 0.02) return;
        const done = i <= leg + (lt >= 1 ? 1 : 0), here = i === leg + 1;
        ctx.fillStyle = here ? "#F43F5E" : done ? "#E9EDF4" : "rgba(233,237,244,.5)";
        ctx.beginPath(); ctx.arc(q[0], q[1], here ? 4.5 : 3, 0, TAU); ctx.fill();
        ctx.fillStyle = done || here ? "#E9EDF4" : "#96A0B2";
        ctx.fillText(nd.code, q[0] + 9, q[1] - 9);
      });
      // arrival boom at the destination hub (scroll-scrubbed)
      if (local > 0.82) { const q = project(nodes[leg + 1].v, R, cx, cy), f = clamp((local - 0.82) / 0.18); if (q[2] > 0) { ctx.strokeStyle = `rgba(244,63,94,${0.8 * (1 - f)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(q[0], q[1], 6 + f * R * 0.22, 0, TAU); ctx.stroke(); } }
      // the request + Mach cone
      if (lt > 0.001 && lt < 0.999) {
        const a = project(legPoint(leg, lt), R, cx, cy), b = project(legPoint(leg, Math.min(1, lt + 0.01)), R, cx, cy);
        if (vis(a)) machCone(ctx, a[0], a[1], b[0] - a[0], b[1] - a[1], clamp(R * 0.32, 44, 130), t);
      }
    });
  }),
};
