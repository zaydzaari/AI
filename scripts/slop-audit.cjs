// Anti-slop audit: our own Playwright implementation of the deterministic checks in
// Impeccable's anti-pattern catalog (https://impeccable.style, Apache-2.0). It reads each
// rendered page after a full scroll and reports the tells by rule id, so the same names
// can be looked up in Impeccable's docs.
//
//   node scripts/slop-audit.cjs                 # 20 collection sites + gallery + 12 lab concepts
//   node scripts/slop-audit.cjs c05 c12 lab07   # just these
//   node scripts/slop-audit.cjs --json=out.json
//
// Needs the collection server on :4320 (npm run collection), the lab on :3000 and Kanso on :4330 (npm run kanso).
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const jsonOut = (args.find((a) => a.startsWith("--json=")) || "").slice(7);
const COLL = "http://localhost:4320";
const LAB = "http://localhost:3000";
const reg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "awwwards-20-collection", "fingerprint-registry.json"), "utf8")).sites;
let targets = [
  ...reg.map((s) => ({ id: "c" + s.id, url: `${COLL}/${s.folder}/` })),
  { id: "gallery", url: `${COLL}/` },
  { id: "kanso", url: "http://localhost:4330/" },
  { id: "kanso-drawing", url: "http://localhost:4330/directions/drawing/" },
  { id: "kanso-plates", url: "http://localhost:4330/directions/plates/" },
  ...Array.from({ length: 12 }, (_, i) => ({ id: "lab" + String(i + 1).padStart(2, "0"), url: `${LAB}/designs/${String(i + 1).padStart(2, "0")}` })),
];
const want = args.filter((a) => !a.startsWith("--"));
if (want.length) targets = targets.filter((t) => want.includes(t.id));

// Runs inside the page. Returns [{rule, detail}].
function scan() {
  const hits = [];
  const add = (rule, el, detail) => hits.push({ rule, detail: (detail || "") + (el ? " @" + desc(el) : "") });
  const desc = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    else if (el.classList.length) s += "." + [...el.classList].slice(0, 2).join(".");
    return s;
  };
  const vw = innerWidth, vh = innerHeight;
  const cs = (el, p) => getComputedStyle(el, p);
  const parse = (c) => {
    const m = c && c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    return { r, g, b, a };
  };
  const hsl = ({ r, g, b }) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    if (!d) return { h: 0, s: 0, l };
    const s = d / (1 - Math.abs(2 * l - 1));
    let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: (h * 60 + 360) % 360, s, l };
  };
  const lum = ({ r, g, b }) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const colors = (s) => (s.match(/rgba?\([^)]+\)/g) || []).map(parse).filter(Boolean);
  const shown = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const c = cs(e);
      if (c.display === "none" || c.visibility === "hidden" || parseFloat(c.opacity) < 0.05) return false;
    }
    return true;
  };
  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").replace(/\s+/g, " ").trim();
  const exempt = (el) => el.closest(".k-sr, .sr-only, [class*='visually-hidden'], code, pre, kbd, samp, sup, sub, svg, canvas, script, style, noscript, [data-tweaks]");
  const bodyBg = parse(cs(document.body).backgroundColor) || { r: 255, g: 255, b: 255, a: 1 };
  const htmlBg = parse(cs(document.documentElement).backgroundColor);
  const kitBg = document.querySelector(".kit") ? parse(cs(document.querySelector(".kit")).backgroundColor) : null;
  const pageBg = kitBg && kitBg.a > 0 ? kitBg : bodyBg.a > 0 ? bodyBg : htmlBg || bodyBg;
  const darkPage = lum(pageBg) < 0.12;
  const all = [...document.querySelectorAll("body *")];
  const texty = all.filter((el) => ownText(el).length && !exempt(el) && shown(el));

  // overused-font
  const OVER = ["inter", "roboto", "open sans", "lato", "montserrat", "arial", "helvetica", "fraunces", "instrument sans", "instrument serif", "geist", "geist sans", "geist mono", "mona sans", "plus jakarta sans", "space grotesk", "recoleta"];
  const fam = new Map();
  texty.forEach((el) => { const f = cs(el).fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase().replace(/ variable$/, ""); if (OVER.includes(f)) fam.set(f, (fam.get(f) || 0) + 1); });
  fam.forEach((n, f) => add("overused-font", null, `${f} on ${n} elements`));

  // cream-palette (Impeccable: min channel ≥ 209, r ≥ g ≥ b, warmth r−b in 6..48)
  const cream = (c) => c && c.a > 0.5 && Math.min(c.r, c.g, c.b) >= 209 && c.r >= c.g && c.g >= c.b && c.r - c.b >= 6 && c.r - c.b <= 48;
  if (cream(pageBg)) add("cream-palette", document.body, `page background rgb(${pageBg.r},${pageBg.g},${pageBg.b})`);
  all.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width * r.height < vw * vh * 0.3) return;
    const c = parse(cs(el).backgroundColor);
    if (cream(c) && !(c.r === pageBg.r && c.g === pageBg.g && c.b === pageBg.b)) add("cream-palette", el, `surface rgb(${c.r},${c.g},${c.b})`);
  });

  // gradients: ai-color-palette (purple/violet), gradient-text, radial halos, grids, stripes
  const purple = (c) => { const k = hsl(c); return c.a >= 0.1 && k.h >= 250 && k.h <= 300 && k.s >= 0.35 && k.l > 0.15; };
  all.forEach((el) => {
    for (const pseudo of [null, "::before", "::after"]) {
      const c = cs(el, pseudo);
      const bi = c.backgroundImage;
      if (!bi || bi === "none" || !bi.includes("gradient")) continue;
      if (pseudo && (c.content === "none" || c.content === "normal")) continue;
      if (parseFloat(c.opacity) < 0.05) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cols = colors(bi);
      if (cols.some(purple)) add("ai-color-palette", el, `purple/violet gradient${pseudo || ""}`);
      if (!pseudo && /text/.test(c.webkitBackgroundClip || c.backgroundClip || "")) add("gradient-text", el, "");
      if (/radial-gradient/.test(bi) && darkPage && r.width * r.height > vw * vh * 0.08) {
        const sat = cols.filter((k) => hsl(k).s >= 0.35 && k.a >= 0.08 && hsl(k).l > 0.12);
        if (sat.length) add("radial-halo", el, `chromatic radial wash${pseudo || ""}`);
      }
      const layers = (bi.match(/linear-gradient/g) || []).length;
      const size = c.backgroundSize;
      if (layers >= 2 && /\d+px/.test(size) && parseFloat(size) <= 140 && !/repeating/.test(bi)) add("codex-grid-background", el, `grid ${size}`);
      if (/repeating-linear-gradient/.test(bi) && r.width * r.height > vw * vh * 0.02) add("repeating-stripes-gradient", el, "");
    }
  });

  // shadows: dark-glow, hard-offset-shadow
  const shadows = (s) => (s && s !== "none" ? s.split(/,(?![^(]*\))/).map((x) => { const col = parse(x); const n = (x.replace(/rgba?\([^)]+\)/, "").match(/-?[\d.]+px/g) || []).map(parseFloat); return { col, x: n[0] || 0, y: n[1] || 0, blur: n[2] || 0, inset: /inset/.test(x) }; }) : []);
  all.forEach((el) => {
    if (!shown(el)) return;
    const c = cs(el);
    for (const [prop, list] of [["box-shadow", shadows(c.boxShadow)], ["text-shadow", shadows(c.textShadow)]]) {
      for (const s of list) {
        if (!s.col || s.col.a < 0.15 || s.inset) continue;
        const k = hsl(s.col);
        const chroma = k.s >= 0.3 && k.l > 0.15 && k.l < 0.9;
        if (chroma && s.blur > 0 && ((s.x === 0 && s.y === 0) || darkPage)) { add("dark-glow", el, `${prop} glow`); break; }
        if (s.blur === 0 && Math.max(Math.abs(s.x), Math.abs(s.y)) >= 4) { add("hard-offset-shadow", el, prop); break; }
      }
    }
  });

  // side-tab, border-accent-on-rounded
  all.forEach((el) => {
    if (!shown(el)) return;
    const c = cs(el);
    const sides = ["Top", "Right", "Bottom", "Left"].map((s) => ({ s, w: parseFloat(c[`border${s}Width`]) || 0, st: c[`border${s}Style`], col: parse(c[`border${s}Color`]) }));
    const thick = sides.filter((x) => x.w >= 3 && x.st !== "none" && x.col && x.col.a > 0.3 && hsl(x.col).s >= 0.25);
    const rad = parseFloat(c.borderTopLeftRadius) || 0;
    const r = el.getBoundingClientRect();
    if (thick.length === 1 && sides.filter((x) => x !== thick[0]).every((x) => x.w <= 1) && r.height >= 40 && r.width >= 80 && el.textContent.trim().length > 10) add("side-tab", el, `${thick[0].s.toLowerCase()} ${thick[0].w}px`);
    const acc = sides.filter((x) => x.w >= 2 && x.st !== "none" && x.col && x.col.a > 0.3 && hsl(x.col).s >= 0.35);
    if (acc.length && rad >= 6 && r.height >= 40) add("border-accent-on-rounded", el, `${acc[0].w}px accent border, radius ${rad}px`);
  });

  // kicker-above-heading / hero-eyebrow-chip (Impeccable's candidate logic)
  document.querySelectorAll("h1,h2,h3,h4").forEach((hd) => {
    if (!shown(hd)) return;
    const hfs = parseFloat(cs(hd).fontSize);
    const htext = hd.textContent.trim();
    if (hfs < 20 || htext.length < 3) return;
    let k = hd.previousElementSibling;
    while (k && !k.textContent.trim()) k = k.previousElementSibling;
    if (!k && hd.parentElement) { k = hd.parentElement.previousElementSibling; }
    if (!k || !shown(k) || !["P", "SPAN", "DIV", "SMALL"].includes(k.tagName)) return;
    if (k.querySelector("h1,h2,h3,h4,img,svg,canvas,a,button")) return;
    const t = k.textContent.replace(/\s+/g, " ").trim();
    if (t.length < 2 || t.length > 34 || /^step\s*\d+/i.test(t) || /^\d{1,2}$/.test(t)) return;
    const kc = cs(k), fs = parseFloat(kc.fontSize), ls = parseFloat(kc.letterSpacing) || 0;
    const upper = kc.textTransform === "uppercase" || (/[A-Z]/.test(t) && !/[a-z]/.test(t)) || /small-caps/.test(kc.fontVariant);
    const ceil = Math.max(14, Math.min(hfs * 0.45, 16));
    if (upper && fs <= ceil && ls >= fs * 0.06) add(hd.tagName === "H1" && hd.closest("[data-hero]") ? "hero-eyebrow-chip" : "kicker-above-heading", k, `"${t}" above ${hd.tagName.toLowerCase()} "${htext.slice(0, 32)}"`);
  });

  // h1 checks: italic-serif-display, oversized-h1
  document.querySelectorAll("h1").forEach((h) => {
    const c = cs(h), fs = parseFloat(c.fontSize);
    const nodes = [h, ...h.querySelectorAll("*")].filter((e) => ownText(e));
    const total = nodes.reduce((a, e) => a + ownText(e).length, 0) || 1;
    const ital = nodes.filter((e) => cs(e).fontStyle === "italic").reduce((a, e) => a + ownText(e).length, 0);
    const serif = !/sans|grotesk|mono|gothic|display\b.*sans/i.test(c.fontFamily) && /serif/i.test(c.fontFamily);
    if (fs >= 40 && serif && ital / total >= 0.3) add("italic-serif-display", h, `${Math.round((ital / total) * 100)}% italic`);
    const words = h.textContent.trim().split(/\s+/).length;
    if (fs >= 64 && words >= 7) add("oversized-h1", h, `${words} words at ${fs}px`);
  });

  // type quality
  texty.forEach((el) => {
    const c = cs(el), fs = parseFloat(c.fontSize), ls = parseFloat(c.letterSpacing) || 0, lh = parseFloat(c.lineHeight) || fs * 1.2;
    const t = ownText(el);
    if (ls / fs < -0.05 && fs >= 12) add("extreme-negative-tracking", el, `${(ls / fs).toFixed(3)}em`);
    const legal = el.closest("footer") && !el.closest("a,button");
    if (fs < (legal ? 10 : 11) && t.length >= 2) add("undersized-ui-text", el, `${fs.toFixed(1)}px "${t.slice(0, 24)}"`);
    const block = /^(P|LI|DD|BLOCKQUOTE|Q|TD)$/.test(el.tagName);
    if (block && t.length > 60 && fs < 12) add("tiny-text", el, `${fs}px`);
    const upper = c.textTransform === "uppercase" || (/[A-Z]/.test(t) && !/[a-z]/.test(t));
    if (block && t.length > 40 && !upper && ls / fs > 0.05) add("wide-tracking", el, `${(ls / fs).toFixed(3)}em`);
    if (t.length > 80 && upper) add("all-caps-body", el, `"${t.slice(0, 24)}"`);
    const r = el.getBoundingClientRect();
    if (block && fs < 24 && r.height > lh * 1.8 && lh / fs < 1.28) add("tight-leading", el, `${(lh / fs).toFixed(2)}`);
    if (block && c.textAlign === "justify") add("justified-text", el, "");
    if (block && r.height > lh * 1.8 && t.length > 120) {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.font = `${c.fontStyle} ${c.fontWeight} ${c.fontSize} ${c.fontFamily}`;
      const avg = ctx.measureText(t).width / t.length;
      const cpl = r.width / Math.max(1, avg);
      if (cpl > 82) add("line-length", el, `${Math.round(cpl)} chars per line`);
    }
    if (block && t.length > 40 && vw < 500 && (r.left < 12 || r.right > vw - 12) && ![...(function* (e) { for (; e; e = e.parentElement) yield e; })(el.parentElement)].some((e) => /auto|scroll/.test(cs(e).overflowX))) add("body-text-viewport-edge", el, "");
  });

  // skipped-heading
  let prev = 0;
  document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
    if (h.closest("dialog:not([open])") || !h.textContent.trim()) return;
    const lv = +h.tagName[1];
    if (prev && lv > prev + 1) add("skipped-heading", h, `h${prev} → h${lv}`);
    prev = lv;
  });

  // copy tells
  const main = document.querySelector("main") || document.body;
  const bodyText = [...main.querySelectorAll("p,li,dd,td,q,blockquote,figcaption")].filter((e) => shown(e) && !exempt(e)).map((e) => e.textContent).join(" ");
  const dashes = (bodyText.match(/—|--/g) || []).length;
  if (dashes >= 8 && bodyText.length / dashes <= 600) add("em-dash-overuse", null, `${dashes} em-dashes in ${bodyText.length} chars`);
  const BUZZ = ["streamline your", "empower your", "supercharge your", "unleash your", "unleash the power", "leverage the power", "built for the modern", "trusted by leading", "trusted by the world", "best-in-class", "industry-leading", "world-class", "enterprise-grade", "next-generation", "cutting-edge", "transform your business", "revolutionize", "game-changer", "game changing", "mission-critical", "best of breed", "future-proof", "future proof", "seamless experience", "seamlessly integrate", "drive engagement", "drive growth", "drive results", "harness the power"];
  const lower = document.body.innerText.toLowerCase();
  BUZZ.forEach((b) => { if (lower.includes(b)) add("marketing-buzzword", null, `"${b}"`); });
  if (/\btheat(er|re)\b/.test(lower)) add("theater-slop-phrase", null, "");
  const aph = [...document.querySelectorAll("h1,h2,h3,p")].filter((e) => shown(e)).map((e) => e.textContent.trim()).filter((t) => t.length < 90 && (/^[^.!?]{2,60}[.!?]\s+(no|just|not|only|never)\b[^.!?]{1,40}[.!?]$/i.test(t) || /^not (a|an|the|just)\b[^.]{1,40}\.\s+(a|an|the|just)\b/i.test(t)));
  if (aph.length >= 3) add("aphoristic-cadence", null, aph.slice(0, 3).map((t) => `"${t}"`).join(" · "));

  // motion tells: pulsing-dot, marquee, blinking-cursor
  document.getAnimations().forEach((a) => {
    const el = a.effect && a.effect.target;
    if (!el || !(el instanceof Element) || a.effect.getComputedTiming().iterations !== Infinity) return;
    const r = el.getBoundingClientRect(), c = cs(el);
    const kf = a.effect.getKeyframes ? a.effect.getKeyframes() : [];
    const props = new Set(kf.flatMap((k) => Object.keys(k)));
    if (r.width <= 20 && r.height <= 20 && parseFloat(c.borderTopLeftRadius) >= Math.min(r.width, r.height) * 0.4 && (props.has("opacity") || props.has("transform") || props.has("boxShadow"))) add("pulsing-dot", el, "");
    if (r.width > vw * 0.6 && kf.some((k) => /translate(X|3d)?\(/.test(k.transform || ""))) add("marquee", el, "");
    if (r.width <= 4 && props.has("opacity")) add("blinking-cursor", el, "");
  });

  // structure: nested-cards, cramped-padding, organic-clip-path, content-hidden-at-rest
  const cardish = (el) => { const c = cs(el); const bg = parse(c.backgroundColor); const bw = parseFloat(c.borderTopWidth) || 0; return (bg && bg.a > 0.5 && (parseFloat(c.borderTopLeftRadius) >= 4 || bw >= 1)) || (bw >= 1 && parseFloat(c.borderTopLeftRadius) >= 8); };
  document.querySelectorAll(".k-card").forEach((el) => {
    if (!shown(el) || !cardish(el)) return;
    const inner = [...el.querySelectorAll("div,article,section,li")].find((d) => d.getBoundingClientRect().height > 80 && cardish(d) && d.textContent.trim().length > 20);
    if (inner) add("nested-cards", el, `contains ${desc(inner)}`);
  });
  texty.forEach((el) => {
    const c = cs(el), t = ownText(el);
    if (t.length < 3 || el.closest("code,pre")) return;
    const side = ["Top", "Right", "Bottom", "Left"].map((s) => { const col = parse(c[`border${s}Color`]); return c[`border${s}Style`] !== "none" && (parseFloat(c[`border${s}Width`]) || 0) >= 1 && col && col.a > 0.1; });
    const bg = parse(c.backgroundColor);
    const par = el.parentElement ? parse(cs(el.parentElement).backgroundColor) : null;
    const filled = bg && bg.a > 0.5 && (!par || Math.abs(lum(bg) - lum(par)) > 0.02);
    if (!filled && !side.some(Boolean)) return;
    const box = el.getBoundingClientRect();
    const rg = document.createRange();
    const tn = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!tn) return;
    rg.selectNodeContents(tn);
    const tr = rg.getBoundingClientRect();
    if (!tr.width) return;
    const gaps = [tr.top - box.top, box.right - tr.right, box.bottom - tr.bottom, tr.left - box.left];
    const need = [3, 8, 3, 8];
    const bad = [0, 1, 2, 3].filter((i) => (filled || side[i]) && gaps[i] < need[i]);
    if (bad.length && !(t.length <= 2)) add("cramped-padding", el, `gaps ${gaps.map((g) => Math.round(g)).join("/")} "${t.slice(0, 20)}"`);
  });
  all.forEach((el) => { const cp = cs(el).clipPath; if (cp && (/path\(/.test(cp) || (/polygon\(/.test(cp) && cp.split(",").length >= 8))) add("organic-clip-path", el, ""); });
  const allText = texty.reduce((a, e) => a + ownText(e).length, 0);
  const hidden = [...document.querySelectorAll("main *")].filter((e) => ownText(e).length && !exempt(e)).filter((e) => { for (let x = e; x && x !== document.body; x = x.parentElement) if (parseFloat(cs(x).opacity) < 0.05) return true; return false; }).reduce((a, e) => a + ownText(e).length, 0);
  if (allText && hidden / (allText + hidden) > 0.15) add("content-hidden-at-rest", null, `${Math.round((hidden / (allText + hidden)) * 100)}% of text at opacity 0`);
  return hits;
}

(async () => {
  const browser = await chromium.launch();
  const report = {};
  let total = 0;
  for (const t of targets) {
    report[t.id] = {};
    for (const [kind, vp, extra] of [["desktop", { width: 1440, height: 900 }, {}], ["mobile", { width: 375, height: 667 }, { isMobile: true, hasTouch: true }]]) {
      const ctx = await browser.newContext({ viewport: vp, ...extra });
      const page = await ctx.newPage();
      try {
        await page.goto(t.url, { waitUntil: "load", timeout: 60000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1200);
        const H = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < H; y += vp.height * 0.8) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(90); }
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(700);
        const hits = await page.evaluate(scan);
        for (const h of hits) {
          const r = (report[t.id][h.rule] ||= { n: 0, kinds: new Set(), samples: [] });
          r.n++; r.kinds.add(kind);
          if (r.samples.length < 3 && !r.samples.includes(h.detail)) r.samples.push(h.detail);
        }
      } catch (e) {
        report[t.id]["load-error"] = { n: 1, kinds: new Set([kind]), samples: [String(e.message).slice(0, 120)] };
      }
      await ctx.close();
    }
    const rules = Object.entries(report[t.id]);
    total += rules.length;
    console.log(`\n${t.id}: ${rules.length ? rules.length + " rule(s)" : "clean"}`);
    rules.forEach(([rule, r]) => console.log(`   ${rule} ×${r.n} [${[...r.kinds].join(",")}] ${r.samples.join(" | ").slice(0, 230)}`));
  }
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, (k, v) => (v instanceof Set ? [...v] : v), 2));
  console.log(`\n${total ? total + " rule hit(s) across pages" : "ALL PAGES CLEAN"}`);
  await browser.close();
})();
