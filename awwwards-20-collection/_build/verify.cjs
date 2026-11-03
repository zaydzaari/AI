// Playwright verification for the collection.
//   node _build/verify.cjs [01 02 … index] [--base=http://localhost:4320] [--no-shots] [--previews]
// For every page at 1440x900 and 375x667 (plus a reduced-motion desktop pass) it checks:
// console errors, failed/4xx requests, horizontal overflow, the 5-part hero above the fold
// (single primary CTA ≥44px), banned fonts and that the registry fonts really load, the H1
// scale/tracking, .k-body size/leading/measure, section padding, and WCAG AA contrast (axe).
// Screenshots go to _build/shots/<id>/ (hero, keyframes, contact sheets); --previews also
// writes preview.jpg / preview-mobile.jpg into each site folder for the gallery.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const HERE = __dirname;
const ROOT = path.resolve(HERE, "..");
const args = process.argv.slice(2);
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split("=").slice(1).join("=");
const BASE = opt("base", "http://localhost:4320");
const SHOTS = !args.includes("--no-shots");
const PREVIEWS = args.includes("--previews");
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, "fingerprint-registry.json"), "utf8")).sites;
let ids = args.filter((a) => !a.startsWith("--"));
if (!ids.length) ids = [...registry.filter((s) => s.built).map((s) => s.id), "index"];
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js", { paths: [ROOT, path.resolve(ROOT, "..")] }), "utf8");

const VIEWS = [
  ["desktop", { width: 1440, height: 900 }, {}],
  ["mobile", { width: 375, height: 667 }, { isMobile: true, hasTouch: true }],
  ["reduced", { width: 1440, height: 900 }, { reducedMotion: "reduce" }],
];
const BANNED = ["inter", "inter tight", "roboto", "open sans", "lato", "arial", "helvetica", "helvetica neue", "system-ui", "-apple-system", "blinkmacsystemfont", "segoe ui", "sans-serif", "serif", "monospace", "times new roman"];

async function sheet(browser, files, out, cols, w) {
  const imgs = files.map((f) => `<img src="data:image/jpeg;base64,${fs.readFileSync(f).toString("base64")}">`).join("");
  const ctx = await browser.newContext({ viewport: { width: cols * w + (cols + 1) * 6, height: 400 } });
  const p = await ctx.newPage();
  await p.setContent(`<style>body{margin:0;background:#777;display:grid;grid-template-columns:repeat(${cols},${w}px);gap:6px;padding:6px}img{width:${w}px;display:block}</style>${imgs}`);
  await p.waitForTimeout(150);
  await p.screenshot({ path: out, fullPage: true, type: "jpeg", quality: 62 });
  await ctx.close();
}

(async () => {
  // The collection draws with 2D canvas only, so the default (CPU-raster) browser is used: software-GL
  // flags made screenshots of animated canvases 50–100× slower without changing what is rendered.
  const browser = await chromium.launch();
  const report = {};
  let total = 0;
  for (const id of ids) {
    const entry = registry.find((s) => s.id === id);
    const url = id === "index" ? `${BASE}/` : `${BASE}/${entry.folder}/`;
    const dir = path.join(HERE, "shots", id);
    if (SHOTS) { fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true }); }
    report[id] = {};
    for (const [kind, vp, extra] of VIEWS) {
      const ctx = await browser.newContext({ viewport: vp, ...extra });
      const page = await ctx.newPage();
      page.setDefaultTimeout(60000);
      const issues = [];
      page.on("console", (m) => m.type() === "error" && issues.push(`console: ${m.text().slice(0, 180)}`));
      page.on("pageerror", (e) => issues.push(`pageerror: ${e.message.slice(0, 180)}`));
      page.on("response", (r) => r.status() >= 400 && issues.push(`HTTP ${r.status()} ${r.url().slice(0, 140)}`));
      page.on("requestfailed", (r) => issues.push(`request failed ${r.url().slice(0, 140)} ${r.failure()?.errorText || ""}`));
      await page.goto(url, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1600);

      // —— 5-part hero above the fold ——
      const hero = await page.evaluate(() => {
        const h = document.querySelector("[data-hero]");
        if (!h) return { missing: true };
        const vh = window.innerHeight;
        const parts = [...h.querySelectorAll("[data-hero-part]")].map((el) => {
          const r = el.getBoundingClientRect();
          return { part: el.dataset.heroPart, top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), right: Math.round(r.right), left: Math.round(r.left) };
        });
        const ctas = [...h.querySelectorAll('[data-cta="primary"]')].map((el) => { const r = el.getBoundingClientRect(); return { h: Math.round(r.height), bottom: Math.round(r.bottom) }; });
        return { bottom: Math.round(h.getBoundingClientRect().bottom), vh, vw: innerWidth, parts, ctas };
      });
      if (hero.missing) issues.push("hero: no [data-hero]");
      else {
        if (hero.bottom > hero.vh + 1) issues.push(`hero: container bottom ${hero.bottom} > ${hero.vh}`);
        for (const p of hero.parts) {
          if (p.bottom > hero.vh + 1) issues.push(`hero: ${p.part} cut off (bottom ${p.bottom} > ${hero.vh})`);
          if (p.h < 1) issues.push(`hero: ${p.part} has no height`);
          if (p.right > hero.vw + 1 || p.left < -1) issues.push(`hero: ${p.part} spills sideways (${p.left}..${p.right})`);
        }
        for (const need of ["headline", "sub", "cta", "visual", "trust"]) if (!hero.parts.some((p) => p.part === need)) issues.push(`hero: missing part "${need}"`);
        if (hero.ctas.length !== 1) issues.push(`hero: ${hero.ctas.length} primary CTAs (want 1)`);
        hero.ctas.forEach((c) => { if (c.h < 44) issues.push(`hero: CTA ${c.h}px tall < 44`); if (c.bottom > hero.vh) issues.push(`hero: CTA clipped (bottom ${c.bottom})`); });
      }
      if (SHOTS && kind !== "reduced") await page.screenshot({ path: path.join(dir, `${kind}-hero.jpg`), type: "jpeg", quality: 72 });
      if (SHOTS && kind === "reduced") await page.screenshot({ path: path.join(dir, `reduced-hero.jpg`), type: "jpeg", quality: 60 });

      // —— scroll through (fires reveals; keyframes) ——
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      const frames = [];
      const step = kind === "mobile" ? vp.height : Math.round(vp.height * 0.9);
      for (let y = 0, k = 0; y < H && k < 48; y += step, k++) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(kind === "reduced" ? 60 : 420);
        if (SHOTS && kind !== "reduced") {
          const f = path.join(dir, `${kind}-k${String(k).padStart(2, "0")}.jpg`);
          await page.screenshot({ path: f, type: "jpeg", quality: 60 });
          frames.push(f);
        }
      }
      await page.waitForTimeout(600);

      // —— static rules ——
      const rules = await page.evaluate(({ BANNED, fonts }) => {
        const out = [];
        const seen = new Set();
        for (const el of document.querySelectorAll("body *")) {
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          const first = getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
          if (BANNED.includes(first) && !seen.has(first)) { seen.add(first); out.push(`font: banned/default "${first}" on <${el.tagName.toLowerCase()}> "${el.textContent.trim().slice(0, 30)}"`); }
        }
        const loaded = new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "").toLowerCase()));
        for (const f of fonts) if (f && !loaded.has(f.toLowerCase())) out.push(`font: "${f}" never loaded`);
        const h1s = document.querySelectorAll("h1");
        if (h1s.length !== 1) out.push(`h1: ${h1s.length} h1 elements`);
        h1s.forEach((h) => {
          const cs = getComputedStyle(h), fs = parseFloat(cs.fontSize), ls = parseFloat(cs.letterSpacing) / fs;
          if (fs < 51.5 || fs > 80.5) out.push(`h1: font-size ${fs}px outside clamp(3.25rem,6vw,5rem)`);
          if (!(ls <= -0.0295 && ls >= -0.0355)) out.push(`h1: tracking ${ls.toFixed(3)}em (want -0.03em)`);
        });
        document.querySelectorAll(".k-body").forEach((p) => {
          const cs = getComputedStyle(p), fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight) / fs;
          if (fs < 16.5 || fs > 18.2) out.push(`body: ${fs}px "${p.textContent.trim().slice(0, 24)}"`);
          if (Math.abs(lh - 1.7) > 0.06) out.push(`body: line-height ${lh.toFixed(2)} "${p.textContent.trim().slice(0, 24)}"`);
          const c = document.createElement("canvas").getContext("2d");
          c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const ch = c.measureText("0").width;
          if (p.getBoundingClientRect().width > ch * 66.5) out.push(`body: measure ${Math.round(p.getBoundingClientRect().width / ch)}ch "${p.textContent.trim().slice(0, 24)}"`);
        });
        document.querySelectorAll(".k-card").forEach((c) => {
          const cs = getComputedStyle(c), pads = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(parseFloat);
          if (pads.some((v) => v < 35.5 || v > 40.5)) out.push(`card: padding ${pads.join("/")} outside 36–40px "${c.textContent.trim().slice(0, 24)}"`);
        });
        if (Math.abs(parseFloat(getComputedStyle(document.body, "::after").opacity) - 0.035) > 0.002 && document.querySelector("[data-hero]")) out.push("grain: overlay missing or not 0.035");
        const min = innerWidth >= 768 ? 120 : 72;
        document.querySelectorAll("[data-section]").forEach((s) => {
          const cs = getComputedStyle(s);
          if (parseFloat(cs.paddingTop) < min - 0.5 || parseFloat(cs.paddingBottom) < min - 0.5) out.push(`spacing: #${s.id || s.className.split(" ")[0]} padding ${cs.paddingTop}/${cs.paddingBottom} < ${min}px`);
        });
        const sw = document.documentElement.scrollWidth;
        if (sw > innerWidth) out.push(`overflow-x: scrollWidth ${sw} > innerWidth ${innerWidth}`);
        document.querySelectorAll("img").forEach((i) => i.complete && i.naturalWidth === 0 && out.push(`img broken ${i.getAttribute("src")}`));
        document.querySelectorAll("a[href]").forEach((a) => { const h = a.getAttribute("href"); if (h.startsWith("#") && h.length > 1 && !document.getElementById(h.slice(1))) out.push(`link: dead anchor ${h}`); });
        return out;
      }, { BANNED, fonts: entry ? [entry.heading_font, entry.body_font] : [] });
      issues.push(...rules);

      if (kind !== "reduced") {
        await page.addScriptTag({ content: AXE });
        const axe = await page.evaluate(async () => {
          const r = await window.axe.run(document, { runOnly: ["color-contrast"], resultTypes: ["violations"] });
          return r.violations.flatMap((v) => v.nodes.map((n) => `${n.any[0]?.data?.contrastRatio ?? "?"}:1 ${n.target.join(" ").slice(0, 80)} (fg ${n.any[0]?.data?.fgColor}, bg ${n.any[0]?.data?.bgColor})`));
        });
        axe.slice(0, 14).forEach((a) => issues.push(`contrast: ${a}`));
        if (axe.length > 14) issues.push(`contrast: …${axe.length - 14} more`);
      }

      if (SHOTS && frames.length) await sheet(browser, frames, path.join(dir, `${kind}-sheet.jpg`), kind === "mobile" ? 8 : 4, kind === "mobile" ? 180 : 360);
      report[id][kind] = [...new Set(issues)];
      total += report[id][kind].length;
      await ctx.close();
    }

    if (PREVIEWS && entry) {
      for (const [name, vp, dsf] of [["preview.jpg", { width: 1440, height: 900 }, 0.5], ["preview-mobile.jpg", { width: 375, height: 667 }, 0.8]]) {
        const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dsf, isMobile: name.includes("mobile") });
        const p = await ctx.newPage();
        await p.goto(url, { waitUntil: "load" });
        await p.evaluate(() => document.fonts.ready);
        await p.waitForTimeout(2200);
        await p.screenshot({ path: path.join(ROOT, entry.folder, name), type: "jpeg", quality: 74 });
        await ctx.close();
      }
    }
    const line = ["desktop", "mobile", "reduced"].map((k) => `${k} ${report[id][k].length ? report[id][k].length + " issue(s)" : "pass"}`).join(" · ");
    console.log(`\n${id}: ${line}`);
    for (const k of ["desktop", "mobile", "reduced"]) report[id][k].forEach((i) => console.log(`   [${k}] ${i}`));
  }
  fs.mkdirSync(path.join(HERE, "shots"), { recursive: true });
  fs.writeFileSync(path.join(HERE, "shots", `report-${ids.length > 3 ? "all" : ids.join("-")}.json`), JSON.stringify(report, null, 2));
  console.log(`\n${total ? total + " issue(s) in total" : "ALL CHECKS PASS"}`);
  await browser.close();
  process.exit(total ? 1 : 0);
})();
