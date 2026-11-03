// The taste library: awwwards-20-collection/inspiration/index.html.
// Step 1 of the workflow: curate references, group them by design family, name the
// vocabulary, and turn any of them into an image prompt or a 4-part brief
// (aesthetic · reference · intent · guardrails). Seeded with the 32 directions in this repo;
// visitors can add their own screenshots (kept in their browser only).
import fs from "node:fs";
import path from "node:path";
import { h, iife, esc, page } from "./lib.mjs";
import { fontFaces } from "./fonts.mjs";
import { BRAND } from "./aether.mjs";

const FAMILIES = [
  { id: "atelier", name: "Atelier and material luxury", about: "Craft objects seen up close: engraved metal, glass, paper, roast and ink. Serif display type, dark or deep grounds, one precious accent, slow reveals.", keywords: ["macro material", "engraved detail", "serif display", "deep ground", "one precious accent", "slow reveal"] },
  { id: "quiet", name: "Quiet paper and specimen", about: "Generous space, hairlines and paper-like grounds. Roman serifs, specimen plates and captions; colour used the way ink is.", keywords: ["negative space", "specimen plate", "hairline rules", "roman serif", "caption-led", "ink accent"] },
  { id: "instrument", name: "Instrument and telemetry", about: "The page behaves like an instrument: live canvases, mono labels, measured grids and one signal colour kept for live data.", keywords: ["telemetry", "instrument panel", "data as texture", "mono labels", "signal colour", "procedural canvas"] },
  { id: "swiss", name: "Swiss systems and engineering", about: "Grid, scale and diagram do the persuading. Modular blocks, strict type steps, a primary signal colour, the product as an exploded drawing.", keywords: ["strict grid", "type scale", "modular blocks", "exploded diagram", "primary signal", "configurator"] },
  { id: "cinematic", name: "Cinematic depth and journeys", about: "Scroll works as a camera: descents, horizons, device reveals and sound. Big shifts in scale, dark grounds, one warm light.", keywords: ["scroll camera", "depth descent", "horizon line", "device reveal", "scale shift", "warm key light"] },
  { id: "tactile", name: "Tactile, product first", about: "The product is the hero: a live console or objects you can drag before reading a word. Colour blocks and chunky controls.", keywords: ["live demo first", "draggable objects", "colour blocking", "chunky controls", "instant feedback"] },
];
const FAMILY_OF = {
  c01: "atelier", c06: "atelier", c08: "atelier", c17: "atelier", c19: "atelier", l11: "atelier",
  c02: "quiet", c04: "quiet", c15: "quiet", l01: "quiet", l03: "quiet", l12: "quiet",
  c03: "instrument", c07: "instrument", c09: "instrument", c13: "instrument", c18: "instrument", c20: "instrument", l02: "instrument", l07: "instrument", l08: "instrument",
  c10: "swiss", c12: "swiss", c14: "swiss", c16: "swiss", l04: "swiss", l09: "swiss",
  c05: "cinematic", c11: "cinematic", l06: "cinematic",
  l05: "tactile", l10: "tactile",
};

const INTENT = `${BRAND.name} is an AI platform that sells model access and API tokens: five model families with standard, low-refusal and abliterated variants, unified chat, coding agents, a developer API, long context, prompt caching and transparent per-token pricing. Audience: developers, researchers and creative professionals. The page must sell API keys and per-token access; the primary action is "Get your API key".`;
const GUARDRAILS = [
  "Always: H1 at clamp(3.25rem, 6vw, 5rem) with -0.03em tracking and six words or fewer; body 1.05rem at 1.7, no wider than 65ch; a 60-30-10 token system with the accent only on calls to action, active nav and live data; WCAG AA contrast; headline, sub, one CTA, an interactive visual and a concrete trust signal above the fold; seven sections ending in pricing with per-token rates; reduced motion unpins everything.",
  "Never: Inter, Roboto, Open Sans, Lato, Arial, system fonts, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk or Instrument Sans/Serif; purple or blue-violet gradients; cyan on dark; coloured glows; cream backgrounds; small uppercase labels above headings; thick coloured side borders on cards; gradient text; fake logos, stats or testimonials; claims about performance, security or availability that are not verified.",
];

function labEntries(root) {
  const src = fs.readFileSync(path.join(root, "..", "lib", "designs.ts"), "utf8");
  return [...src.matchAll(/\{ id: "(\d\d)", name: "([^"]+)", short: "([^"]+)", mode: "([^"]+)", traits: \[([^\]]*)\][\s\S]*?swatches: \[([^\]]*)\], type: "([^"]+)"/g)].map((m) => {
    const sw = [...m[6].matchAll(/"(#[0-9A-Fa-f]{6})"/g)].map((x) => x[1]);
    return {
      key: "l" + m[1], src: "Lab", num: m[1], name: m[2], line: m[3], mode: m[4].toLowerCase(),
      traits: [...m[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
      p: sw[0], s: sw[1], a: sw[sw.length - 1], type: m[7], img: `lab/${m[1]}-desktop.jpg`, imgM: `lab/${m[1]}-mobile.jpg`, href: null,
      inspiration: m[3], mechanic: [...m[5].matchAll(/"([^"]+)"/g)].map((x) => x[1]).join(", "),
    };
  });
}

export function buildInspiration(root, built) {
  const dir = path.join(root, "inspiration");
  fs.mkdirSync(path.join(dir, "lab"), { recursive: true });
  const labPrev = path.join(root, "..", "public", "previews");
  const lab = labEntries(root);
  for (const e of lab) for (const f of [`${e.num}-desktop.jpg`, `${e.num}-mobile.jpg`]) if (fs.existsSync(path.join(labPrev, f))) fs.copyFileSync(path.join(labPrev, f), path.join(dir, "lab", f));
  const coll = built.map((s) => ({
    key: "c" + s.id, src: "Collection", num: s.id, name: s.name, line: s.title.replace(/^[^—]+—\s*/, ""), mode: s.mode,
    p: s.color_system_60_30_10.primary_60, s: s.color_system_60_30_10.secondary_30, a: s.color_system_60_30_10.accent_10,
    type: `${s.heading_font} · ${s.body_font}`, img: `../${s.folder}/preview.jpg`, imgM: `../${s.folder}/preview-mobile.jpg`, href: `../${s.folder}/index.html`,
    inspiration: s.inspiration, movement: s.aesthetic_movement, mechanic: s.signature_scroll_mechanic.split(":")[0], traits: [],
  }));
  const all = [...coll, ...lab].map((e) => ({ ...e, family: FAMILY_OF[e.key] }));
  const missing = all.filter((e) => !e.family).map((e) => e.key);
  if (missing.length) throw new Error("inspiration: no family for " + missing.join(", "));

  const fam = Object.fromEntries(FAMILIES.map((f) => [f.id, f]));
  const brief = (e) => {
    const f = fam[e.family];
    return [
      `Build a landing page for ${BRAND.name}.`,
      ``,
      `1. Aesthetic: ${f.name}. ${f.about} Vocabulary: ${f.keywords.join(", ")}.`,
      `2. Reference: match the feel (not the layout or content) of "${e.name}"${e.inspiration ? `, a direction inspired by ${e.inspiration.charAt(0).toLowerCase() + e.inspiration.slice(1)}` : ""}. Palette ${e.p} / ${e.s} with a ${e.a} accent; type ${e.type}.${e.mechanic ? ` Its signature: ${e.mechanic.charAt(0).toLowerCase() + e.mechanic.slice(1)}.` : ""}`,
      `3. Intent: ${INTENT}`,
      `4. Guardrails: ${GUARDRAILS.join(" ")}`,
      ``,
      `Make five versions in five different directions within this family. I will pick one, then we iterate on three variations of its body before tuning the hero image and the details.`,
    ].join("\n");
  };
  const imagePrompt = (e) => {
    const f = fam[e.family];
    return `Hero background image for an AI platform landing page, "${e.name}" direction: ${e.inspiration ? e.inspiration.toLowerCase() : e.line.toLowerCase()}. ${f.keywords.slice(0, 3).join(", ")}. Palette ${e.p} and ${e.s} with a single ${e.a} accent. Cinematic light, high detail, calm empty area on the left third for a headline. No text, no logos, no people's faces. 2K, 16:9.`;
  };
  const DATA = all.map((e) => ({ ...e, brief: brief(e), prompt: imagePrompt(e) }));

  const card = (e, i) => h`
<article class="i-card" data-family="${e.family}" data-src="${e.src}">
  <figure class="i-shot"><img src="${e.img}" width="720" height="450" loading="lazy" decoding="async" alt="${esc(e.src)} direction ${e.num} ${esc(e.name)}, desktop hero"></figure>
  <div class="i-meta">
    <p class="i-src">${e.src} ${e.num} · ${e.mode}</p>
    <h3>${esc(e.name)}</h3>
    <p class="i-line">${esc(e.line)}</p>
    <p class="i-sw" aria-label="Palette ${e.p}, ${e.s}, ${e.a}"><i style="background:${e.p}"></i><i style="background:${e.s}"></i><i style="background:${e.a}"></i><span>${esc(e.type)}</span></p>
    <div class="i-act">
      <button type="button" class="i-btn" data-copy="prompt" data-i="${i}">Copy image prompt</button>
      <button type="button" class="i-btn" data-copy="brief" data-i="${i}">Copy brief</button>
      ${e.href ? `<a class="i-btn" href="${e.href}">Open</a>` : `<span class="i-off">Lab: npm run dev, then /designs/${e.num}</span>`}
    </div>
  </div>
</article>`;

  const site = {
    name: "Taste library", mode: "dark",
    title: "Taste library — Aether design references",
    description: "Thirty-two Aether design directions grouped by design family, with vocabulary, image prompts and 4-part briefs, plus a drop zone for your own references.",
    tokens: { bgPrimary: "#0F0E0D", bgSecondary: "#1A1917", accent: "#E8E3D8", onAccent: "#0F0E0D", textPrimary: "#EEEBE5", textMuted: "#A9A49A", line: "rgba(238,235,229,.13)", display: '"Bodoni Moda", serif', body: '"Schibsted Grotesk", sans-serif' },
    css: /* css */ `
:root{--h1-weight:500;--mono:"DM Mono",monospace}
.i-nav{position:sticky;top:0;z-index:50;height:60px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:0 var(--gutter);background:#0F0E0D;border-bottom:1px solid var(--line);font-family:var(--mono);font-size:.8rem}
.i-nav a{text-decoration:none;color:var(--text-muted)}
.i-nav a:hover{color:var(--text-primary)}
.i-nav b{font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:var(--text-primary)}
.i-links{display:flex;gap:18px}
@media (max-width:760px){.i-links{display:none}}
.i-hero{min-height:calc(100svh - 60px);display:grid;grid-template-columns:5fr 7fr;gap:clamp(28px,4vw,64px);align-items:center;padding:24px var(--gutter)}
.i-copy{display:grid;gap:24px;justify-items:start}
.i-copy .k-body{color:var(--text-muted);max-width:46ch}
.i-cta{display:inline-flex;align-items:center;min-height:56px;padding:0 28px;border-radius:99px;background:var(--accent);color:var(--on-accent);font-weight:600;text-decoration:none}
.i-trust{font-family:var(--mono);font-size:.8rem;color:var(--text-muted)}
.i-trust b{color:var(--text-primary);font-weight:500}
.i-mosaic{position:relative;height:min(74vh,680px);display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:1fr;gap:8px;overflow:hidden;border-radius:14px}
.i-mosaic img{width:100%;height:100%;object-fit:cover;border-radius:8px;transition:transform .9s var(--ease),filter .6s var(--ease);filter:saturate(.9)}
.i-mosaic img:hover{transform:scale(1.04);filter:none}
@media (max-width:900px){.i-hero{grid-template-columns:1fr;min-height:0;padding:16px var(--gutter);gap:14px}.i-copy{gap:12px}.i-mosaic{height:170px;grid-template-columns:repeat(4,1fr)}.i-mosaic img:nth-child(n+9){display:none}}
.i-h2{font-size:clamp(2.2rem,4.2vw,3.8rem);font-weight:500;letter-spacing:-.02em;line-height:1.02;max-width:20ch}
.i-steps{margin-top:clamp(64px,6vw,80px);display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.i-step{display:grid;gap:12px;align-content:start;border:1px solid var(--line);border-radius:14px;background:var(--bg-secondary)}
.i-step h3{font-size:1.6rem;font-weight:500}
.i-step p,.i-step li{font-size:.92rem;color:var(--text-muted)}
.i-step ul{display:grid;gap:6px}
.i-step a{color:var(--text-primary)}
@media (max-width:900px){.i-steps{grid-template-columns:1fr}}
.i-bar{position:sticky;top:60px;z-index:30;display:flex;flex-wrap:wrap;gap:8px;padding:14px 0;margin-top:40px;background:#0F0E0D;border-bottom:1px solid var(--line)}
.i-chip{min-height:44px;padding:0 16px;border-radius:99px;border:1px solid var(--line);background:transparent;color:var(--text-muted);font-family:var(--mono);font-size:.8rem}
.i-chip[aria-pressed="true"]{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.i-fam{margin-top:clamp(64px,6vw,80px)}
.i-fam[hidden]{display:none}
.i-famhead{display:grid;grid-template-columns:5fr 7fr;gap:40px;align-items:end;padding-bottom:24px;border-bottom:1px solid var(--line)}
.i-famhead h2{font-size:clamp(1.9rem,3vw,2.8rem);font-weight:500;line-height:1.05}
.i-famhead p{color:var(--text-muted);font-size:.96rem;max-width:60ch}
.i-kw{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.i-kw span{padding:4px 10px;border-radius:99px;border:1px solid var(--line);font-family:var(--mono);font-size:.76rem;color:var(--text-primary)}
@media (max-width:900px){.i-famhead{grid-template-columns:1fr;gap:12px}}
.i-grid{margin-top:28px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media (max-width:1100px){.i-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:700px){.i-grid{grid-template-columns:1fr}}
.i-card{display:grid;grid-template-rows:auto 1fr;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--bg-secondary)}
.i-shot{margin:0;aspect-ratio:16/10;overflow:hidden;background:#000}
.i-shot img{width:100%;height:100%;object-fit:cover}
.i-meta{display:grid;gap:10px;align-content:start;padding:20px 22px 22px}
.i-src{font-family:var(--mono);font-size:.76rem;color:var(--text-muted)}
.i-meta h3{font-size:1.6rem;font-weight:500;line-height:1.1}
.i-line{font-size:.92rem;color:var(--text-muted)}
.i-sw{display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:.76rem;color:var(--text-muted)}
.i-sw i{width:16px;height:16px;border-radius:4px;border:1px solid #EEEBE540}
.i-sw span{margin-left:6px}
.i-act{display:flex;flex-wrap:wrap;gap:8px;padding-top:6px}
.i-btn{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border-radius:99px;border:1px solid #EEEBE540;background:transparent;color:var(--text-primary);font-size:.84rem;font-weight:600;text-decoration:none}
.i-btn:hover{border-color:var(--text-primary)}
.i-off{font-family:var(--mono);font-size:.76rem;color:var(--text-muted);align-self:center}
.i-drop{margin-top:clamp(64px,6vw,80px);display:grid;place-items:center;gap:12px;min-height:220px;padding:36px;border:1px dashed #EEEBE555;border-radius:16px;text-align:center;background:var(--bg-secondary)}
.i-drop.is-over{border-color:var(--text-primary);background:#22201D}
.i-drop p{color:var(--text-muted);max-width:56ch}
.i-mine{margin-top:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media (max-width:900px){.i-mine{grid-template-columns:1fr}}
.i-mine .i-meta select,.i-mine .i-meta textarea{width:100%;border-radius:8px;border:1px solid var(--line);background:#121110;color:var(--text-primary);font:inherit;font-size:.9rem;padding:8px 10px}
.i-mine .i-meta textarea{min-height:72px;resize:vertical}
.i-toast{position:fixed;left:50%;bottom:24px;translate:-50% 0;z-index:9700;padding:10px 16px;border-radius:99px;background:#EEEBE5;color:#0F0E0D;font-size:.88rem;font-weight:600;opacity:0;transition:opacity .3s}
.i-toast.is-on{opacity:1}
.i-foot{padding:56px var(--gutter) 40px;border-top:1px solid var(--line);font-size:.86rem;color:var(--text-muted);display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px}
.i-foot a{color:var(--text-primary)}
`,
    body: h`
<header class="i-nav"><a href="../index.html"><b>${BRAND.name}</b></a><nav class="i-links" aria-label="Sections"><a href="#workflow">Workflow</a><a href="#families">Families</a><a href="#yours">Your references</a><a href="../index.html">Gallery</a></nav><span>${DATA.length} references</span></header>
<main id="main">
  <section class="i-hero" data-hero aria-labelledby="i-h">
    <div class="i-copy">
      <h1 id="i-h" data-hero-part="headline">Taste, collected first.</h1>
      <p class="k-body" data-hero-part="sub">Every direction in this project, grouped by design family, with the words to ask for it, an image prompt and a ready brief. Add your own finds from Dribbble, Pinterest and X.</p>
      <div data-hero-part="cta"><a class="i-cta" href="#families" data-cta="primary">Browse the families</a></div>
      <p class="i-trust" data-hero-part="trust"><b>${DATA.length}</b> references · <b>${FAMILIES.length}</b> families · briefs in <b>4 parts</b></p>
    </div>
    <div class="i-mosaic" data-hero-part="visual" aria-hidden="true">${DATA.slice(0, 16).map((e) => `<img src="${e.img}" alt="" width="360" height="225" decoding="async">`)}</div>
  </section>

  <section id="workflow" data-section aria-labelledby="i-w">
    <div class="k-wrap">
      <h2 id="i-w" class="i-h2" data-reveal>Collect, equip, then iterate. Never one-shot.</h2>
      <div class="i-steps" data-stagger>
        <article class="i-step k-card"><h3>Collect</h3><p>Save what you like and group it by family. The vocabulary under each family is how you ask for it.</p><ul><li><a href="https://dribbble.com/search/web-design">Dribbble</a>, <a href="https://www.pinterest.com/search/pins/?q=web%20design">Pinterest</a> and <a href="https://x.com/search?q=web%20design">X</a> for whole pages</li><li><a href="https://21st.dev">21st.dev</a> for single components: buttons, pricing, cards</li></ul></article>
        <article class="i-step k-card"><h3>Equip</h3><p>Impeccable is installed in this repo (<code>.claude/skills/impeccable</code>) and its 62 anti-slop rules were checked on every page. Hero imagery needs an image model such as Higgsfield, connected to your own account.</p></article>
        <article class="i-step k-card"><h3>Iterate</h3><p>Cast a wide net (done: 32 directions), pick one, ask for three body variations, choose, then tune the hero image and the details with the Tweaks panel on every page. Copy the tweaks back into a prompt to bake them in.</p></article>
      </div>
    </div>
  </section>

  <section id="families" data-section aria-labelledby="i-f">
    <div class="k-wrap">
      <h2 id="i-f" class="i-h2" data-reveal>Six families, thirty-two references.</h2>
      <div class="i-bar" role="group" aria-label="Filter by family"><button type="button" class="i-chip" data-f="all" aria-pressed="true">All</button>${FAMILIES.map((f) => `<button type="button" class="i-chip" data-f="${f.id}" aria-pressed="false">${f.name}</button>`)}</div>
      ${FAMILIES.map((f) => h`<div class="i-fam" data-fam="${f.id}"><div class="i-famhead"><h2>${f.name}</h2><div><p>${f.about}</p><p class="i-kw" aria-label="Vocabulary">${f.keywords.map((k) => `<span>${k}</span>`)}</p></div></div><div class="i-grid">${DATA.map((e, i) => (e.family === f.id ? card(e, i) : ""))}</div></div>`)}
    </div>
  </section>

  <section id="yours" data-section aria-labelledby="i-y">
    <div class="k-wrap">
      <h2 id="i-y" class="i-h2" data-reveal>Your references.</h2>
      <label class="i-drop" id="i-drop"><input type="file" id="i-file" accept="image/*" multiple class="k-sr"><strong>Drop screenshots here, or choose files</strong><p>Images stay in this browser only. Pick a family and add a note, then copy a brief that uses your reference. To make them part of the project, put the files in a folder and ask Claude to add them to this library.</p></label>
      <div class="i-mine" id="i-mine"></div>
    </div>
  </section>
</main>
<footer class="i-foot"><span>${BRAND.name} is a placeholder brand; all directions are design explorations with mock data.</span><a href="../index.html">Back to the gallery</a></footer>
<div class="i-toast" id="i-toast" role="status" aria-live="polite"></div>
<script>window.LIB = ${JSON.stringify({ data: DATA.map(({ brief, prompt, name }) => ({ brief, prompt, name })), families: FAMILIES.map(({ id, name, about, keywords }) => ({ id, name, about, keywords })), intent: INTENT, guardrails: GUARDRAILS })};</script>
`,
    js: iife(() => {
      const { $, $$ } = K;
      const L = window.LIB;
      const toast = $("#i-toast");
      let tt = 0;
      const say = (t) => { toast.textContent = t; toast.classList.add("is-on"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("is-on"), 2200); };
      const copy = (text, what) => (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(text).then(() => say(what + " copied"), () => say("Copy blocked by the browser")) : say("Copy not available here"));
      document.addEventListener("click", (e) => {
        const b = e.target.closest("[data-copy]");
        if (!b || b.dataset.i == null) return;
        const d = L.data[+b.dataset.i];
        copy(b.dataset.copy === "brief" ? d.brief : d.prompt, b.dataset.copy === "brief" ? "Brief" : "Image prompt");
      });
      // family filter
      const chips = $$("[data-f]"), fams = $$("[data-fam]");
      chips.forEach((c) => c.addEventListener("click", () => {
        chips.forEach((x) => x.setAttribute("aria-pressed", x === c ? "true" : "false"));
        fams.forEach((f) => { f.hidden = !(c.dataset.f === "all" || f.dataset.fam === c.dataset.f); });
        fams.forEach((f) => f.querySelectorAll("[data-reveal]").forEach((r) => r.classList.add("is-in")));
      }));
      // your references: IndexedDB in this browser only (falls back to memory)
      const mine = $("#i-mine"), drop = $("#i-drop"), file = $("#i-file");
      let db = null;
      const mem = [];
      const open = () => new Promise((res) => { try { const r = indexedDB.open("aether-taste", 1); r.onupgradeneeded = () => r.result.createObjectStore("refs", { keyPath: "id" }); r.onsuccess = () => res(r.result); r.onerror = () => res(null); } catch (err) { res(null); } });
      const tx = (mode, fn) => new Promise((res) => { if (!db) return res(fn(null)); try { const t = db.transaction("refs", mode); const st = t.objectStore("refs"); const out = fn(st); t.oncomplete = () => res(out); t.onerror = () => res(out); } catch (err) { res(fn(null)); } });
      const all = () => new Promise((res) => { if (!db) return res(mem.slice()); try { const r = db.transaction("refs").objectStore("refs").getAll(); r.onsuccess = () => res(r.result || []); r.onerror = () => res([]); } catch (err) { res(mem.slice()); } });
      const put = (rec) => tx("readwrite", (st) => { if (st) return st.put(rec); const i = mem.findIndex((m) => m.id === rec.id); if (i >= 0) mem[i] = rec; else mem.push(rec); return null; });
      const del = (id) => tx("readwrite", (st) => (st ? st.delete(id) : mem.splice(mem.findIndex((m) => m.id === id), 1)));
      const briefFor = (rec) => {
        const f = L.families.find((x) => x.id === rec.family) || L.families[0];
        return [`Build a landing page for Aether.`, ``, `1. Aesthetic: ${f.name}. ${f.about} Vocabulary: ${f.keywords.join(", ")}.`, `2. Reference: the attached screenshot "${rec.name}". Match its feel, not its layout or content.${rec.note ? " What I like about it: " + rec.note : ""}`, `3. Intent: ${L.intent}`, `4. Guardrails: ${L.guardrails.join(" ")}`, ``, `Make five versions first; I will pick one and we iterate.`].join("\n");
      };
      const render = async () => {
        const list = await all();
        mine.innerHTML = "";
        list.sort((a, b) => b.t - a.t).forEach((rec) => {
          const url = URL.createObjectURL(rec.blob);
          const el = document.createElement("article");
          el.className = "i-card";
          el.innerHTML = `<figure class="i-shot"><img alt="Your reference ${rec.name.replace(/"/g, "")}" src="${url}"></figure><div class="i-meta"><h3></h3><label>Family <select>${L.families.map((f) => `<option value="${f.id}">${f.name}</option>`).join("")}</select></label><label>What you like about it <textarea></textarea></label><div class="i-act"><button type="button" class="i-btn" data-mine="brief">Copy brief</button><button type="button" class="i-btn" data-mine="del">Remove</button></div></div>`;
          el.querySelector("h3").textContent = rec.name;
          const sel = el.querySelector("select"), ta = el.querySelector("textarea");
          sel.value = rec.family; ta.value = rec.note || "";
          sel.addEventListener("change", () => { rec.family = sel.value; put(rec); });
          ta.addEventListener("input", () => { rec.note = ta.value; put(rec); });
          el.querySelector('[data-mine="brief"]').addEventListener("click", () => copy(briefFor(rec), "Brief"));
          el.querySelector('[data-mine="del"]').addEventListener("click", async () => { await del(rec.id); URL.revokeObjectURL(url); render(); });
          mine.appendChild(el);
        });
      };
      const add = async (files) => {
        for (const f of files) if (f.type.startsWith("image/")) await put({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), t: Date.now(), name: f.name.replace(/\.[^.]+$/, ""), family: "atelier", note: "", blob: f });
        render();
        say(files.length + " reference" + (files.length === 1 ? "" : "s") + " added");
      };
      file.addEventListener("change", () => add([...file.files]));
      ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
      ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("is-over"); }));
      drop.addEventListener("drop", (e) => add([...(e.dataTransfer ? e.dataTransfer.files : [])]));
      open().then((d) => { db = d; render(); });
    }),
  };

  const { css, files } = fontFaces(dir, [
    { family: "Bodoni Moda", axes: "opsz,wght@6..96,400..700" },
    { family: "Schibsted Grotesk", axes: "wght@400..700" },
    { family: "DM Mono", axes: "wght@400;500" },
  ]);
  fs.writeFileSync(path.join(dir, "index.html"), page({ ...site, tweakFonts: [] }, { fontCss: css, preload: [files[0]] }));
  return DATA.length;
}
