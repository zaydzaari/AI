import { h, iife, esc } from "./shell.mjs";
import { BRAND, MODELS, BENEFITS, STEPS, PROOF, PLANS, PRICE_NOTE, PROOF_NOTE, PROBLEM, TEMPERAMENTS, conceptNote, rate } from "./content.mjs";

const STYLE = "Kanso";
const CLS = ["a", "b", "c", "d", "e", "f"];
const SHEETS = [["A-01", "Minute one"], ["A-02", "Minute five"], ["A-03", "Every request"]];
const cheapest = Math.min(...MODELS.map((m) => m.inPrice));
const MODEL_ID = { core: "core-128k", unbound: "unbound-128k", forge: "forge-256k", atlas: "atlas-1m", swift: "swift-32k" };
const FAQ = [
  ["What does abliterated mean?", "An abliterated model has its refusal behaviour removed at the weights level, so it answers instead of declining. Your deployment sets the policy. Unbound is abliterated by design, and Swift also comes in an abliterated variant."],
  ["How are standard, low-refusal and abliterated different?", TEMPERAMENTS.map(([n, d]) => `${n}: ${d.charAt(0).toLowerCase() + d.slice(1)}`).join(" ")],
  ["Do I need a new SDK?", `No. Point the SDK you already use at ${BRAND.name}'s base URL and change the model string. Streaming and tool calls work as before.`],
  ["How is usage billed?", "Per token. Input, cached input and output are priced separately for each model, and every response reports its tokens, cached tokens and cost. The rates on this page are samples for layout only."],
  ["Can I switch models in the middle of a conversation?", "Yes. Unified chat carries the whole thread, files included, from one model family to the next."],
  ["What does prompt caching save?", "When a long prompt prefix repeats, the repeated part is billed at the cached input rate automatically. You do not have to change your requests."],
];
// Build-time isometric glyph: a single monolith, height set by context window.
const glyph = (m) => {
  const k = (Math.log(m.contextK) - Math.log(32)) / (Math.log(1000) - Math.log(32));
  const hh = 22 + 62 * k, c = Math.cos(Math.PI / 6), w = 30;
  const P = (x, y, z) => [(x - y) * c + 60, (x + y) * 0.5 - z + 96];
  const poly = (pts) => pts.map((q) => P(...q).map((v) => v.toFixed(1)).join(",")).join(" ");
  return `<svg class="iso" viewBox="0 0 120 120" aria-hidden="true"><polygon points="${poly([[0, 0, hh], [w, 0, hh], [w, w, hh], [0, w, hh]])}" fill="#D9D3C7" stroke="#1C1A17" stroke-width=".8"/><polygon points="${poly([[w, 0, 0], [w, w, 0], [w, w, hh], [w, 0, hh]])}" fill="#BDB6A8" stroke="#1C1A17" stroke-width=".8"/><polygon points="${poly([[0, w, 0], [w, w, 0], [w, w, hh], [0, w, hh]])}" fill="#A8A194" stroke="#1C1A17" stroke-width=".8"/></svg>`;
};

export default {
  title: "Aether — One key. Every model.",
  description: "Five model families behind a single API, standard, low-refusal or abliterated, billed per token with prompt caching built in. Kanso design direction.",
  fonts: [
    { family: "Syne", axes: "wght@500;700;800" },
    { family: "IBM Plex Mono", axes: "wght@400;500" },
    { family: "Shippori Mincho", axes: "wght@700", text: "簡素", as: "Kanso Seal" },
  ],
  tokens: {
    bgPrimary: "#EDEDEB", bgSecondary: "#DEDEDB", accent: "#C83E2B", onAccent: "#FFFFFF",
    textPrimary: "#1C1A17", textMuted: "#57534B", line: "rgba(28,26,23,.16)",
    display: '"Syne", sans-serif', body: '"IBM Plex Mono", ui-monospace, monospace',
  },
  css: /* css */ `
.k2-nav{position:sticky;top:0;z-index:40;height:64px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;padding:0 var(--gutter);background:#EDEDEB;border-bottom:1px solid var(--line);font-size:.82rem}
.k2-mark{display:flex;align-items:center;gap:12px;font-family:var(--font-display);font-weight:800;font-size:1.05rem;letter-spacing:-.02em;text-decoration:none}
.k2-seal{display:grid;place-items:center;width:34px;height:34px;background:var(--text-primary);color:var(--bg-primary);font-family:"Kanso Seal",serif;font-size:.78rem;line-height:1;writing-mode:vertical-rl;letter-spacing:.05em}
.k2-links{display:flex;gap:4px}
.k2-links a{padding:8px 14px;text-decoration:none;color:var(--text-muted);border-bottom:2px solid transparent}
.k2-links a:hover{color:var(--text-primary)}
.k2-links a.is-current{color:var(--text-primary);border-color:var(--accent)}
.k2-act{justify-self:end;display:flex;align-items:center;gap:6px}
.k2-act .doc{padding:8px 12px;text-decoration:none;color:var(--text-muted)}
.k2-act .doc:hover{color:var(--text-primary)}
.k2-cta-sm{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border:1px solid var(--text-primary);text-decoration:none;font-weight:500;color:var(--text-primary);transition:background .2s,color .2s}
.k2-cta-sm:hover{background:var(--text-primary);color:var(--bg-primary)}
.k2-menu{display:none;align-items:center;gap:10px;min-height:44px;padding:0 14px;border:1px solid var(--text-primary);background:none;font:inherit;font-weight:500;color:var(--text-primary)}
.k2-menu i{display:grid;gap:4px;width:16px}
.k2-menu i::before,.k2-menu i::after{content:"";height:1.5px;background:currentColor;transition:transform .3s var(--ease)}
.k2-menu[aria-expanded="true"] i::before{transform:translateY(2.75px) rotate(45deg)}
.k2-menu[aria-expanded="true"] i::after{transform:translateY(-2.75px) rotate(-45deg)}
.k2-drawer{position:fixed;inset:64px 0 auto 0;z-index:39;max-height:calc(100svh - 64px);overflow:auto;background:var(--bg-primary);border-bottom:1px solid var(--text-primary);padding:8px var(--gutter) 28px;display:grid}
.k2-drawer[hidden]{display:none}
.k2-drawer a:not(.k2-btn){padding:16px 0;border-bottom:1px solid var(--line);text-decoration:none;font-family:var(--font-display);font-weight:700;font-size:1.5rem;letter-spacing:-.02em}
.k2-drawer .k2-btn{margin-top:20px;justify-self:start}
@media (max-width:1080px){.k2-links,.k2-act .doc{display:none}.k2-nav{grid-template-columns:1fr auto}.k2-menu{display:inline-flex}}
@media (max-width:560px){.k2-act .k2-cta-sm{display:none}}

.k2-btn{display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:0 26px;background:var(--accent);color:#fff;font-weight:500;font-size:.9rem;text-decoration:none;border-radius:0;position:relative;transition:background .25s}
.k2-btn:hover{background:#AE321F}
.k2-btn::after{content:"";position:absolute;inset:6px;border:1px solid #ffffff55;pointer-events:none;transition:inset .35s var(--ease)}
.k2-btn.is-near::after{inset:3px}

/* hero: slab stack */
.k2-hero{min-height:calc(100svh - 64px);display:grid;grid-template-rows:auto 1fr;padding:clamp(28px,5vh,56px) var(--gutter) 28px;gap:clamp(20px,4vh,40px)}
.k2-hero h1{font-weight:800;letter-spacing:-.03em;line-height:.92;max-width:16ch}
.k2-band{display:grid;grid-template-columns:4fr 5fr 3fr;border:1px solid var(--text-primary);min-height:0}
.k2-band-copy{padding:28px;display:grid;align-content:space-between;gap:24px;border-right:1px solid var(--text-primary)}
.k2-band-copy .k-body{color:var(--text-muted)}
.k2-print{position:relative;background:repeating-linear-gradient(0deg,#1C1A170d 0 1px,transparent 1px 24px),repeating-linear-gradient(90deg,#1C1A170d 0 1px,transparent 1px 24px);overflow:hidden;min-height:220px}
.k2-print svg{position:absolute;inset:0;width:100%;height:100%}
.k2-print .tag{position:absolute;left:14px;bottom:12px;font-size:.76rem;color:var(--text-muted)}
.k2-slab{position:relative;display:grid;align-content:center;justify-items:start;gap:18px;padding:28px;border-left:1px solid var(--text-primary);color:var(--text-primary);
  background:radial-gradient(circle at 22% 24%,#0000001a 0 3px,#ffffff40 4px,transparent 6px),radial-gradient(circle at 78% 24%,#0000001a 0 3px,#ffffff40 4px,transparent 6px),radial-gradient(circle at 22% 80%,#0000001a 0 3px,#ffffff40 4px,transparent 6px),radial-gradient(circle at 78% 80%,#0000001a 0 3px,#ffffff40 4px,transparent 6px),repeating-linear-gradient(0deg,transparent 0 46px,#00000010 46px 47px),linear-gradient(#D6D0C4,#CBC4B6)}
.k2-slab::before{content:"";position:absolute;inset:0;opacity:.22;background-image:var(--concrete);mix-blend-mode:multiply;pointer-events:none}
.k2-slab>*{position:relative}
.k2-slab small{font-size:.75rem;color:#3d3a34}
.k2-trust{font-size:.78rem;color:var(--text-muted);display:flex;gap:14px;align-items:baseline;flex-wrap:wrap}
.k2-trust b{font-family:var(--font-display);font-size:1.6rem;font-weight:800;color:var(--text-primary);letter-spacing:-.03em}
@media (max-width:980px){
  .k2-hero{min-height:calc(100svh - 64px);grid-template-rows:auto auto;align-content:start;gap:10px;padding-top:12px;padding-bottom:12px}
  .k2-band{grid-template-columns:1fr;border:0}
  .k2-band-copy{border:0;padding:0;gap:14px}
  .k2-print{min-height:92px;height:92px;border:1px solid var(--text-primary);margin-top:2px}
  .k2-print .tag{display:none}
  .k2-slab{border:1px solid var(--text-primary);border-top:0;padding:10px 14px;grid-auto-flow:column;align-items:center;justify-content:space-between}
  .k2-slab small{display:none}
  .k2-trust{gap:8px;font-size:.76rem}
  .k2-trust b{font-size:1.2rem}
  .k2-band-copy{gap:10px}
}

.k2-h2{font-weight:800;font-size:clamp(2.4rem,5vw,4.6rem);letter-spacing:-.04em;line-height:.92}
.k2-idx{font-size:.75rem;color:var(--text-muted);display:block;margin-bottom:24px}

/* tension */
.k2-tension{display:grid;grid-template-columns:repeat(12,1fr);gap:64px 24px}
.k2-tension .k2-h2{grid-column:1 / span 8}
.k2-tension .k-body{grid-column:8 / span 5;color:var(--text-muted)}
@media (max-width:860px){.k2-tension .k2-h2,.k2-tension .k-body{grid-column:1 / -1}}

/* signature: blueprint → structure */
.k2-build{height:440vh;position:relative;margin-top:80px}
.k2-build-pin{position:sticky;top:64px;height:calc(100vh - 64px);display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:40px;padding:24px var(--gutter)}
.k2-sheet{position:relative;border:1px solid var(--text-primary);background:repeating-linear-gradient(0deg,#1C1A170a 0 1px,transparent 1px 32px),repeating-linear-gradient(90deg,#1C1A170a 0 1px,transparent 1px 32px),#EDEDEB}
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
.k2-read div{background:var(--bg-primary);padding:12px;display:grid;gap:2px;font-size:.76rem;color:var(--text-muted)}
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
.k2-cell{border-right:1px solid var(--text-primary);border-bottom:1px solid var(--text-primary);display:grid;align-content:space-between;gap:32px;position:relative;isolation:isolate;overflow:hidden}
.k2-cell::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(360px circle at var(--mx) var(--my),#1C1A170f,transparent 65%);opacity:0;transition:opacity .3s}
.k2-cell:hover::before{opacity:1}
.k2-cell h3{font-size:1.65rem;font-weight:700;letter-spacing:-.03em;line-height:1.02;max-width:16ch}
.k2-cell p{font-size:.9rem;color:var(--text-muted);max-width:44ch}
.k2-cell.a{grid-column:span 4;grid-row:span 2;background:var(--bg-secondary)}
.k2-cell.a h3{font-size:clamp(2rem,3.4vw,3.2rem)}
.k2-cell.b,.k2-cell.c{grid-column:span 2}
.k2-cell.d,.k2-cell.e,.k2-cell.f{grid-column:span 2}
.k2-cell.f{background:var(--bg-secondary)}
.k2-cell .glyph{width:120px;height:auto}
@media (max-width:900px){.k2-bento{grid-template-columns:1fr}.k2-cell{grid-column:auto!important;grid-row:auto!important}}

/* rail: drawing sheets */
.k2-rail-head{padding:0 var(--gutter);margin-bottom:48px}
.k2-sheets{padding:0 var(--gutter);gap:0}
.k2-dw{width:min(720px,62vw);border:1px solid var(--text-primary);display:grid;grid-template-rows:1fr auto;background:var(--bg-primary)}
.k2-dw+.k2-dw{border-left:0}
.k2-dw .body{display:grid;gap:20px;align-content:start;min-height:300px}
.k2-dw h3{font-size:clamp(1.7rem,6.4vw,2.6rem);font-weight:800;letter-spacing:-0.04em;line-height:.95;overflow-wrap:normal}
.k2-dw p{color:var(--text-muted);max-width:46ch}
.k2-dw .tb{display:grid;grid-template-columns:auto 1fr auto;border-top:1px solid var(--text-primary);font-size:.75rem}
.k2-dw .tb span{padding:12px 16px}
.k2-dw .tb span+span{border-left:1px solid var(--text-primary)}
.k2-dw.is-active .tb span:first-child{background:var(--accent);color:#fff}
@media (max-width:899px){.k2-sheets{grid-template-columns:minmax(0,1fr)}.k2-dw{width:auto;min-width:0}.k2-dw+.k2-dw{border-left:1px solid var(--text-primary);border-top:0}.k2-dw .body{min-height:0}}
.k2-dw .body>*{min-width:0}
.k2-pick{display:grid;gap:10px}
.k2-pick .row{display:flex;flex-wrap:wrap;gap:6px}
.k2-chip{min-height:40px;padding:0 14px;border:1px solid var(--text-primary);background:transparent;font:inherit;font-size:.82rem;color:var(--text-primary)}
.k2-chip[aria-pressed="true"]{background:var(--text-primary);color:var(--bg-primary)}
.k2-chip:disabled{opacity:1;color:var(--text-muted);border-color:var(--line);text-decoration:line-through;cursor:not-allowed}
.k2-str{display:block;margin-top:4px;padding:14px 16px;background:var(--text-primary);color:#F2F1EE;font-size:.95rem}
.k2-str b{color:#FF9C8C;font-weight:500}
.k2-tabs{display:flex;border:1px solid var(--text-primary);border-bottom:0;width:max-content}
.k2-tabs button{min-height:40px;padding:0 16px;border:0;background:transparent;font:inherit;font-size:.82rem;color:var(--text-muted)}
.k2-tabs button+button{border-left:1px solid var(--text-primary)}
.k2-tabs button[aria-selected="true"]{background:var(--text-primary);color:#F2F1EE}
.k2-code{margin:0;padding:16px 18px;background:#1C1A17;color:#E9E6E0;font-size:.8rem;line-height:1.6;overflow-x:auto;white-space:pre;border:1px solid var(--text-primary)}
.k2-code[hidden]{display:none}
.k2-code .s{color:#F0B9A9}
.k2-rcpt{margin:0;padding:16px 18px;border:1px dashed var(--text-primary);font-size:.82rem;line-height:1.7;white-space:pre;overflow-x:auto}
.k2-rcpt .live{color:#A3301F;font-weight:600}
.k2-small{font-size:.78rem;color:var(--text-muted)}

/* proof: four drawn sheets */
.k2-proof{margin-top:72px;display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid var(--text-primary);border-left:1px solid var(--text-primary)}
.k2-pf{display:grid;grid-template-rows:auto 1fr auto;gap:24px;border-right:1px solid var(--text-primary);border-bottom:1px solid var(--text-primary);min-height:280px}
.k2-pf:nth-child(2),.k2-pf:nth-child(3){background:var(--bg-secondary)}
.k2-pf h3{font-size:clamp(1.6rem,2.4vw,2.2rem);font-weight:800;letter-spacing:-.03em;line-height:1}
.k2-pf .role{font-size:.82rem;color:var(--text-muted);margin-top:8px}
.k2-pf q{font-size:.98rem;line-height:1.65;quotes:"“" "”";max-width:46ch}
.k2-pf .tag{font-size:.76rem;color:var(--text-muted);border-top:1px solid var(--line);padding-top:12px}
.k2-note{font-size:.78rem;color:var(--text-muted);margin-top:24px}
@media (max-width:820px){.k2-proof{grid-template-columns:1fr}.k2-pf{min-height:0}.k2-pf:nth-child(3){background:none}.k2-pf:nth-child(4){background:var(--bg-secondary)}}

/* fees */
.k2-fees{margin-top:72px;display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--text-primary)}
.k2-fee{display:grid;gap:22px;align-content:start}
.k2-fee+.k2-fee{border-left:1px solid var(--text-primary)}
.k2-fee:nth-child(2){background:var(--bg-secondary)}
.k2-fee h3{font-size:2rem;font-weight:800;letter-spacing:-.04em}
.k2-fee .area{font-size:.78rem;color:var(--text-muted)}
.k2-fee .p{font-family:var(--font-display);font-size:3rem;font-weight:700;letter-spacing:-0.04em;line-height:1}
.k2-fee p{font-size:.88rem;color:var(--text-muted)}
.k2-fee a{font-size:.85rem;font-weight:500}
.k2-fk{margin-top:28px;display:flex;gap:40px;flex-wrap:wrap;font-size:.82rem}
.k2-fk span::before{content:"";display:inline-block;width:10px;height:10px;background:var(--text-primary);margin-right:10px;vertical-align:-1px}
@media (max-width:900px){.k2-fees{grid-template-columns:1fr}.k2-fee+.k2-fee{border-left:0;border-top:1px solid var(--text-primary)}}

/* final + footer */
.k2-final{display:grid;grid-template-columns:repeat(12,1fr);gap:48px 24px;align-items:end}
.k2-final .k2-h2{grid-column:1 / span 8;font-size:clamp(2.8rem,6.4vw,6rem)}
.k2-final .act{grid-column:9 / -1;display:grid;gap:24px;justify-items:start}
.k2-final .act p{color:var(--text-muted)}
@media (max-width:860px){.k2-final .k2-h2,.k2-final .act{grid-column:1 / -1}}
.k2-foot{background:var(--text-primary);color:#D9D4CA;padding:96px var(--gutter) 40px;display:grid;grid-template-columns:repeat(12,1fr);gap:48px 24px;font-size:.82rem}
.k2-foot .word{grid-column:1 / -1;font-family:var(--font-display);font-weight:800;font-size:clamp(3rem,11vw,11rem);letter-spacing:-.04em;line-height:.8;color:#EDEDEB}
.k2-foot div{grid-column:span 4}
.k2-foot h3{font-family:var(--font-body);font-weight:500;color:#EDEDEB;margin-bottom:14px;font-size:.8rem}
.k2-foot ul{display:grid;gap:8px}
.k2-foot a{text-decoration:none}
.k2-foot a:hover{color:#fff;text-decoration:underline}
.k2-foot .legal{grid-column:1 / -1;border-top:1px solid #EDEDEB33;padding-top:24px;display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}
@media (max-width:820px){.k2-foot div{grid-column:span 6}}
/* catalogue */
.k2-cat-head{margin-top:96px;display:flex;justify-content:space-between;align-items:end;gap:24px;flex-wrap:wrap}
.k2-cat-head h3{font-size:clamp(1.8rem,3vw,2.6rem);font-weight:800;letter-spacing:-.03em;line-height:1}
.k2-cat{margin-top:28px;display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid var(--text-primary);border-left:1px solid var(--text-primary)}
.k2-model{display:grid;gap:14px;align-content:start;border-right:1px solid var(--text-primary);border-bottom:1px solid var(--text-primary)}
.k2-model .top h4{font-family:var(--font-display);font-size:clamp(1.15rem,1.4vw,1.45rem);font-weight:800;letter-spacing:-.02em;line-height:1;overflow-wrap:normal}
.k2-model .top span{display:block;margin-top:6px;font-size:.8rem;color:var(--text-muted)}
.k2-model .iso{width:96px;height:96px}
.k2-model dl{display:grid;gap:6px;margin:0;font-size:.82rem}
.k2-model dl div{display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid var(--line);padding-bottom:6px}
.k2-model dt{color:var(--text-muted)}
.k2-model dd{margin:0;font-variant-numeric:tabular-nums}
.k2-model .vars{font-size:.78rem;color:var(--text-muted)}
@media (max-width:1100px){.k2-cat{grid-template-columns:repeat(3,1fr)}}
@media (max-width:700px){.k2-cat{grid-template-columns:1fr}.k2-model{grid-template-columns:72px 1fr;grid-template-areas:"iso top" "iso dl" "iso vars";column-gap:20px}.k2-model .top{grid-area:top}.k2-model .iso{grid-area:iso;width:72px;height:72px}.k2-model dl{grid-area:dl}.k2-model .vars{grid-area:vars}.k2-model .top h4{font-size:1.5rem}}
/* faq */
.k2-faqs{display:grid;gap:48px}
.k2-faqs .k2-h2{max-width:18ch}
.k2-faq{max-width:980px}
.k2-faq{border-top:1px solid var(--text-primary)}
.k2-faq details{border-bottom:1px solid var(--line)}
.k2-faq summary{display:flex;justify-content:space-between;gap:24px;align-items:center;min-height:64px;padding:16px 0;cursor:pointer;list-style:none;font-family:var(--font-display);font-weight:700;font-size:1.15rem;letter-spacing:-.01em}
.k2-faq summary::-webkit-details-marker{display:none}
.k2-faq summary::after{content:"";flex:none;width:12px;height:12px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg) translateY(-3px);transition:transform .3s var(--ease)}
.k2-faq details[open] summary::after{transform:rotate(-135deg) translateY(-3px)}
.k2-faq details p{padding:0 0 22px;color:var(--text-muted);font-size:.95rem;max-width:62ch}
@media (max-width:860px){.k2-faqs{gap:28px}}
.k2-final-gap{margin-top:clamp(96px,11vw,150px)}
.k2-iso-lbl{font-family:'IBM Plex Mono',monospace;font-size:11px;fill:#1C1A17}
`,
  body: h`
<header class="k2-nav">
  <a class="k2-mark" href="#main"><span class="k2-seal" aria-hidden="true">簡素</span>${BRAND.name}</a>
  <nav class="k2-links" data-spy aria-label="Sections"><a href="#method">Method</a><a href="#qualities">Platform</a><a href="#process">Developers</a><a href="#clients">Who it's for</a><a href="#fees">Pricing</a><a href="#faq">FAQ</a></nav>
  <div class="k2-act"><a class="doc" href="#process">API quickstart</a><a class="k2-cta-sm" href="#fees">Get API key</a><button type="button" class="k2-menu" aria-expanded="false" aria-controls="k2-drawer"><i aria-hidden="true"></i>Menu</button></div>
</header>
<nav class="k2-drawer" id="k2-drawer" aria-label="Menu" hidden><a href="#method">Method</a><a href="#qualities">Platform</a><a href="#process">Developers</a><a href="#clients">Who it's for</a><a href="#fees">Pricing</a><a href="#faq">FAQ</a><a class="k2-btn" href="#fees">Get your API key</a></nav>
<main id="main">
  <section class="k2-hero" data-hero aria-labelledby="k2-title">
    <h1 id="k2-title" data-hero-part="headline">One key. Every model.</h1>
    <div class="k2-band">
      <div class="k2-band-copy">
        <p class="k-body" data-hero-part="sub">Nothing extra: five model families behind one API, billed per token, with prompt caching on every model.</p>
        <p class="k2-trust" data-hero-part="trust"><b>${rate(cheapest)}</b> per 1M input tokens is the lowest sample rate.</p>
      </div>
      <div class="k2-print" data-hero-part="visual"><svg id="hero-iso" role="img" aria-label="Isometric drawing of a concrete pavilion; move the pointer to move the light"></svg><span class="tag">Move the pointer to move the light</span></div>
      <div class="k2-slab" data-hero-part="cta">
        <small>Free to start. Pay per token after that.</small>
        <a class="k2-btn" href="#fees" data-cta="primary" data-magnetic="5,0.22,0.6,0.5"><span data-magnetic-label>Get your API key</span></a>
      </div>
    </div>
  </section>

  <section id="method" data-section aria-labelledby="m-title">
    <div class="k-wrap k2-tension">
      <h2 id="m-title" class="k2-h2" data-reveal>Most AI stacks are built first and priced later.</h2>
      <p class="k-body" data-reveal>${PROBLEM.rows.map((r) => r[0]).join(" ")} We start from the other end: what one request costs. Scroll to watch five model families rise from the drawing, then see what each one charges.</p>
    </div>
    <div class="k2-build" id="build">
      <div class="k2-build-pin">
        <div class="k2-sheet"><svg id="build-iso" role="img" aria-label="Five monoliths, one per model family, sized by context window, casting shadows sized by cost"></svg></div>
        <div class="k2-side">
          <ol class="k2-stages" id="stages"><li class="on"><span>Linework</span><span>01</span></li><li><span>Five families, cast</span><span>02</span></li><li><span>What each one costs</span><span>03</span></li></ol>
          <div class="k2-sun">
            <label for="sun">Request size: drag to change it. Height is context; shadow is cost.</label>
            <input id="sun" type="range" min="0" max="1" step="0.01" value="0.35">
            <div class="k2-read" aria-live="polite"><div class="live"><span>Request</span><b id="r-time">4K</b></div><div><span>Cheapest</span><b id="r-el">Swift</b></div><div><span>Costliest</span><b id="r-az">Atlas</b></div><div><span>Atlas cost</span><b id="r-sh">$0.00</b></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="qualities" data-section aria-labelledby="q-title">
    <div class="k-wrap">
      <h2 id="q-title" class="k2-h2" data-reveal>Fewer parts, each one doing more.</h2>
      <div class="k2-bento" data-stagger>
        ${BENEFITS.map(([f, b, d], i) => h`<article class="k2-cell k-card ${CLS[i]}" data-spot>${i === 0 ? `<svg class="glyph" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="none" stroke="#1C1A17"/><path d="M60 6v108M6 60h108" stroke="#1C1A1733"/><path d="M60 60 L104 30" stroke="#1C1A17" stroke-width="2"/><circle cx="104" cy="30" r="6" fill="#1C1A17"/></svg>` : ""}<h3>${b}</h3><p><b>${f}.</b> ${d}</p></article>`)}
      </div>
    </div>
  </section>

  <section id="process" data-section aria-labelledby="pr-title">
    <div data-rail>
      <div data-rail-view>
        <div class="k2-rail-head"><h2 id="pr-title" class="k2-h2" data-reveal>Three sheets to production.</h2></div>
        <ol class="k2-sheets" data-rail-track>
          ${STEPS.map(([t, d], i) => `<li class="k2-dw"><div class="body k-card"><h3>${t}</h3><p>${d}</p>${[
            `<div class="k2-pick" role="group" aria-label="Build a model string"><div class="row" id="pick-model">${MODELS.map((m, j) => `<button type="button" class="k2-chip" data-model="${m.id}" aria-pressed="${j === 0}">${m.name}</button>`).join("")}</div><div class="row" id="pick-temp">${TEMPERAMENTS.map(([n], j) => `<button type="button" class="k2-chip" data-temp="${n}" aria-pressed="${j === 0}">${n}</button>`).join("")}</div><code class="k2-str" id="pick-out" aria-live="polite">${MODEL_ID.core}</code></div>`,
            `<div><div class="k2-tabs" role="tablist" aria-label="Request examples">${["cURL", "TypeScript", "Python"].map((l, j) => `<button type="button" role="tab" id="tab-${j}" aria-controls="code-${j}" aria-selected="${j === 0}" tabindex="${j === 0 ? 0 : -1}">${l}</button>`).join("")}</div>${[0, 1, 2].map((j) => `<pre class="k2-code" role="tabpanel" id="code-${j}" aria-labelledby="tab-${j}"${j ? " hidden" : ""} tabindex="0"><code></code></pre>`).join("")}</div>`,
            `<div><pre class="k2-rcpt" id="rcpt"></pre><p class="k2-small">Sample response at sample rates, for the model picked on sheet A-01.</p></div>`,
          ][i]}</div><div class="tb"><span>${SHEETS[i][0]}</span><span>${BRAND.name} · standard sheet</span><span>${SHEETS[i][1]}</span></div></li>`)}
        </ol>
      </div>
    </div>
  </section>

  <section id="clients" data-section aria-labelledby="c-title">
    <div class="k-wrap">
      <h2 id="c-title" class="k2-h2" data-reveal>Who it is drawn for.</h2>
      <div class="k2-proof" data-stagger>
        ${PROOF.map(([role, focus, q]) => `<article class="k2-pf k-card"><div><h3>${focus}</h3><p class="role">${role}</p></div><q>${q}</q><p class="tag">Placeholder testimonial</p></article>`)}
      </div>
      <p class="k2-note">${PROOF_NOTE}</p>
    </div>
  </section>

  <section id="fees" data-section aria-labelledby="f-title">
    <div class="k-wrap">
      <h2 id="f-title" class="k2-h2" data-reveal>Priced per token, in plain sight.</h2>
      <div class="k2-fees" data-stagger>
        ${PLANS.map((p) => `<article class="k2-fee k-card"><h3>${p.name}</h3><span class="area">${p.cadence}</span><p class="p">${p.price}</p><p>${p.body}</p><p class="area">${p.features.join(" · ")}</p><a href="#final">${p.fk}</a></article>`)}
      </div>
      <div class="k2-cat-head" data-reveal><h3>The catalogue</h3><p class="k2-small">Per 1M tokens. ${PRICE_NOTE}</p></div>
      <div class="k2-cat" data-stagger>${MODELS.map((m) => `<article class="k2-model k-card"><div class="top"><h4>${m.name}</h4><span>${m.role}</span></div>${glyph(m)}<dl><div><dt>Context</dt><dd>${m.context}</dd></div><div><dt>Input</dt><dd>${rate(m.inPrice)}</dd></div><div><dt>Cached input</dt><dd>${rate(m.cached)}</dd></div><div><dt>Output</dt><dd>${rate(m.outPrice)}</dd></div></dl><p class="vars">${m.variants.join(" · ")}</p></article>`)}</div>
      <p class="k2-fk"><span>Height of each block is its context window</span><span>Cached input billed automatically</span></p>
    </div>
  </section>

  <section id="final" data-section aria-labelledby="faq-title">
    <div class="k-wrap k2-faqs" id="faq">
      <h2 id="faq-title" class="k2-h2" data-reveal>Questions, answered plainly.</h2>
      <div class="k2-faq">${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${esc(a)}</p></details>`)}</div>
    </div>
    <div class="k-wrap k2-final k2-final-gap">
      <h2 id="fi-title" class="k2-h2" data-reveal>Start with one key. Add nothing else.</h2>
      <div class="act" data-reveal><p class="k-body">Point the SDK you already use at ${BRAND.name}'s base URL. Change one string to change the model.</p><a class="k2-btn" href="#main" data-magnetic="5,0.22,0.6,0.5"><span data-magnetic-label>Get your API key</span></a></div>
    </div>
  </section>
</main>
<footer class="k2-foot">
  <p class="word" aria-hidden="true">${BRAND.name}.</p>
  <div><h3>Platform</h3><ul><li><a href="#build">Model families</a></li><li><a href="#qualities">Unified chat and agents</a></li><li><a href="#fees">Token rates</a></li></ul></div>
  <div><h3>Models</h3><ul>${MODELS.map((m) => `<li><a href="#fees">${m.name} · ${m.role.toLowerCase()}</a></li>`)}</ul></div>
  <div><h3>Developers</h3><ul><li><a href="#process">API quickstart</a></li><li><a href="#faq">FAQ</a></li><li><a href="#main">Back to top</a></li></ul></div>
  <p class="legal"><span>${conceptNote(STYLE)}</span><span>Set in Syne and IBM Plex Mono.</span></p>
</footer>
`,
  js: iife(() => {
    const { RM, $, $$, clamp, smooth, onScroll, progress, pointer, loop } = K;
    const NS = "http://www.w3.org/2000/svg";
    const C30 = Math.cos(Math.PI / 6);
    document.documentElement.style.setProperty("--concrete", `url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='c'><feTurbulence type='fractalNoise' baseFrequency='.035 .6' numOctaves='4' seed='4'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .29 0 0 0 0 .27 0 0 0 1.1 -.25'/></filter><rect width='100%' height='100%' filter='url(%23c)'/></svg>")}")`);
    const hull = (pts) => {
      pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
      const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], up = [];
      for (const p of pts) { while (lo.length > 1 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
      for (const p of pts.reverse()) { while (up.length > 1 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
      return lo.slice(0, -1).concat(up.slice(0, -1));
    };
    function Scene(svg, boxes, pad = 0.08) {
      const P = (x, y, z) => [(x - y) * C30, (x + y) * 0.5 - z];
      const xs = [], ys = [];
      boxes.forEach((b) => [[b.x, b.y, 0], [b.x + b.w, b.y, 0], [b.x, b.y + b.d, 0], [b.x + b.w, b.y + b.d, 0], [b.x, b.y, b.h], [b.x + b.w, b.y + b.d, b.h]].forEach((p) => { const q = P(...p); xs.push(q[0]); ys.push(q[1]); }));
      const minX = Math.min(...xs) - 40, maxX = Math.max(...xs) + 40, minY = Math.min(...ys) - 10, maxY = Math.max(...ys) + 46;
      const W = maxX - minX, H = maxY - minY;
      svg.setAttribute("viewBox", `${minX - W * pad} ${minY - H * pad} ${W * (1 + 2 * pad)} ${H * (1 + 2 * pad)}`);
      const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
      const d = (pts) => "M" + pts.map((p) => P(...p).map((v) => v.toFixed(2)).join(" ")).join("L") + "Z";
      const gShadow = mk("g", { fill: "#1C1A17", "fill-opacity": "0" }, svg);
      const gFaces = mk("g", {}, svg);
      const lines = [], labels = [];
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
        if (b.slit) { const s = b.slit; mk("path", { d: d([[x + w, y + s[0], s[2]], [x + w, y + s[1], s[2]], [x + w, y + s[1], s[3]], [x + w, y + s[0], s[3]]]), fill: "#1C1A17", "fill-opacity": "0", class: "slit" }, gFaces); }
        if (b.label) { const [lx, ly] = P(x + w, y + dp, 0); const t = mk("text", { x: (lx - 6).toFixed(1), y: (ly + 14).toFixed(1), class: "k2-iso-lbl", "text-anchor": "end", opacity: "0" }, gFaces); t.textContent = b.label; labels.push(t); }
      });
      const faces = [...gFaces.querySelectorAll(".face")], slits = [...gFaces.querySelectorAll(".slit")];
      return {
        draw(t) { lines.forEach((l, i) => l.setAttribute("stroke-dashoffset", (1 - clamp(t * 1.6 - (i / lines.length) * 0.6)).toFixed(3))); },
        solid(t) { faces.forEach((f) => f.setAttribute("fill-opacity", t.toFixed(3))); slits.forEach((s) => s.setAttribute("fill-opacity", (0.85 * t).toFixed(3))); labels.forEach((l) => l.setAttribute("opacity", t.toFixed(2))); },
        light(t) { gShadow.setAttribute("fill-opacity", (0.2 * t).toFixed(3)); },
        cast(az, lens) {
          boxes.forEach((b, i) => {
            const L = lens[i], vx = -Math.cos(az) * L, vy = -Math.sin(az) * L;
            const base = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.d], [b.x, b.y + b.d]];
            const pts = base.concat(base.map(([px, py]) => [px + vx, py + vy]));
            shadows[i].setAttribute("d", d(hull(pts).map(([px, py]) => [px, py, 0])));
          });
        },
      };
    }

    // —— mobile menu ——
    const menuBtn = $(".k2-menu"), drawer = $("#k2-drawer");
    const setMenu = (open) => { drawer.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open)); document.documentElement.style.overflow = open ? "hidden" : ""; };
    menuBtn.addEventListener("click", () => setMenu(drawer.hidden));
    drawer.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) { setMenu(false); menuBtn.focus(); } });
    matchMedia("(min-width: 1081px)").addEventListener("change", (e) => e.matches && setMenu(false));

    // —— sheet A-01: build a model string; it flows into A-02 and A-03 ——
    const IDS = { core: "core-128k", unbound: "unbound-128k", forge: "forge-256k", atlas: "atlas-1m", swift: "swift-32k" };
    const SUFFIX = { Standard: "", "Low-refusal": ":low-refusal", Abliterated: ":abliterated" };
    let pickModel = "core", pickTemp = "Standard";
    const modelBtns = $$("[data-model]"), tempBtns = $$("[data-temp]"), outEl = $("#pick-out");
    const modelOf = (id) => AE.MODELS.find((m) => m.id === id);
    const modelString = () => IDS[pickModel] + (pickModel === "unbound" ? "" : SUFFIX[pickTemp]);
    const BASE = AE.BRAND.apiBase, KEY = AE.BRAND.envKey;
    const esc = (t) => t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
    const hl = (t) => esc(t).replace(/"([^"]*)"/g, '<span class="s">"$1"</span>');
    const samples = (ms) => [
      `curl ${BASE}/chat/completions \\\n  -H "Authorization: Bearer $${KEY}" \\\n  -d '{"model": "${ms}",\n       "messages": [{"role": "user", "content": "Hello"}]}'`,
      `import OpenAI from "openai";\n\nconst client = new OpenAI({\n  baseURL: "${BASE}",\n  apiKey: process.env.${KEY},\n});\n\nawait client.chat.completions.create({\n  model: "${ms}",\n  messages,\n});`,
      `import os\nfrom openai import OpenAI\n\nclient = OpenAI(\n    base_url="${BASE}",\n    api_key=os.environ["${KEY}"],\n)\n\nclient.chat.completions.create(\n    model="${ms}",\n    messages=messages,\n)`,
    ];
    const codeEls = $$(".k2-code code"), rcpt = $("#rcpt");
    const renderPick = () => {
      const m = modelOf(pickModel);
      const avail = pickModel === "unbound" ? ["Abliterated"] : m.variants;
      if (!avail.includes(pickTemp)) pickTemp = avail[0];
      modelBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.model === pickModel)));
      tempBtns.forEach((b) => { const ok = avail.includes(b.dataset.temp); b.disabled = !ok; b.setAttribute("aria-pressed", String(ok && b.dataset.temp === pickTemp)); });
      const ms = modelString(), cut = ms.indexOf(":");
      outEl.innerHTML = cut < 0 ? esc(ms) : esc(ms.slice(0, cut)) + "<b>" + esc(ms.slice(cut)) + "</b>";
      samples(ms).forEach((t, i) => { codeEls[i].innerHTML = hl(t); });
      const pt = 1820, ct = 1536, out = 412, cost = ((pt - ct) * m.inPrice + ct * m.cached + out * m.outPrice) / 1e6;
      rcpt.innerHTML = esc('"model": "' + ms + '",\n"usage": {\n  "prompt_tokens": ' + pt + ',\n  "cached_tokens": ' + ct + ',\n  "completion_tokens": ' + out + ',\n  "cost": ') + '<span class="live">' + cost.toFixed(6) + "</span>\n}";
    };
    modelBtns.forEach((b) => b.addEventListener("click", () => { pickModel = b.dataset.model; renderPick(); }));
    tempBtns.forEach((b) => b.addEventListener("click", () => { pickTemp = b.dataset.temp; renderPick(); }));
    renderPick();

    // —— sheet A-02: request tabs (arrow keys move between tabs) ——
    const tabs = $$('[role="tab"]'), panels = $$('[role="tabpanel"]');
    const selectTab = (i, focus) => { tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; }); if (focus) tabs[i].focus(); };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => selectTab(i));
      t.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") selectTab((i + 1) % tabs.length, true); if (e.key === "ArrowLeft") selectTab((i + tabs.length - 1) % tabs.length, true); });
    });

    // Hero: one long pavilion; the light follows the pointer.
    const heroSvg = $("#hero-iso");
    const heroBoxes = [{ x: 0, y: 0, w: 120, d: 34, h: 26, slit: [6, 28, 12, 18] }, { x: 18, y: 34, w: 30, d: 24, h: 14 }, { x: 132, y: 4, w: 22, d: 22, h: 40 }];
    const hero = Scene(heroSvg, heroBoxes, 0.04);
    hero.solid(1); hero.light(1);
    let az = 1.2;
    const t0 = performance.now();
    loop(heroSvg, () => {
      const r = heroSvg.getBoundingClientRect();
      const target = pointer.active ? 0.5 + clamp((pointer.x - r.left + r.width * 0.2) / (r.width * 1.4)) * 2.4 : 1.4 + Math.sin(performance.now() / 4000) * 0.4;
      az += (target - az) * 0.08;
      hero.cast(az, heroBoxes.map((b) => b.h * 1.3));
      hero.draw(RM ? 1 : clamp((performance.now() - t0) / 1800));
    });

    // Signature: five monoliths — height is context, shadow is the cost of a request.
    const M = AE.MODELS;
    const k = (m) => (Math.log(m.contextK) - Math.log(32)) / (Math.log(1000) - Math.log(32));
    const boxes = M.map((m, i) => ({ x: i * 44, y: -i * 6, w: 26, d: 26, h: 18 + 70 * k(m), label: m.name }));
    const scene = Scene($("#build-iso"), boxes, 0.06);
    const build = $("#build"), stages = $$("#stages li"), slider = $("#sun");
    const read = { size: $("#r-time"), lo: $("#r-el"), hi: $("#r-az"), atlas: $("#r-sh") };
    const reqCost = (m, tok) => ((tok * 0.75) * m.inPrice + (tok * 0.25) * m.outPrice) / 1e6;
    const setSize = (v) => {
      const tok = Math.round(Math.pow(10, 3 + v * 2.3));
      const costs = M.map((m) => reqCost(m, tok)), max = Math.max(...costs);
      scene.cast(0.9 + v * 0.8, costs.map((c) => 8 + (c / max) * (40 + v * 60)));
      const lo = M[costs.indexOf(Math.min(...costs))], hi = M[costs.indexOf(max)];
      read.size.textContent = tok >= 1000 ? Math.round(tok / 1000) + "K" : tok;
      read.lo.textContent = lo.name; read.hi.textContent = hi.name;
      const c = costs[M.findIndex((m) => m.id === "atlas")];
      read.atlas.textContent = "$" + (c < 0.01 ? c.toFixed(4) : c.toFixed(3));
    };
    let manual = false;
    slider.addEventListener("input", () => { manual = true; setSize(+slider.value); });
    setSize(+slider.value);
    onScroll(() => {
      const p = RM ? 1 : progress(build);
      scene.draw(smooth(clamp(p / 0.36)));
      scene.solid(smooth(clamp((p - 0.34) / 0.22)));
      scene.light(smooth(clamp((p - 0.56) / 0.12)));
      const stage = p < 0.34 ? 0 : p < 0.56 ? 1 : 2;
      stages.forEach((li, i) => li.classList.toggle("on", i === stage));
      if (!manual) { const v = clamp((p - 0.58) / 0.42); slider.value = v; setSize(v); }
    });
  }),
};
