// Master design system audit — Playwright + axe-core.
// Usage: node scripts/audit.cjs [ids...] [--shots=dir] [--base=http://localhost:3000]
// Checks at 1440x900 and 375x667: hero fits above the fold, one primary hero CTA (≥44px),
// banned fonts, H1 scale/tracking, body copy size/leading/measure, section padding,
// horizontal overflow, broken requests, console errors and WCAG AA contrast (axe).
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith("--base=")) || "--base=http://localhost:3000").slice(7);
const shots = (args.find((a) => a.startsWith("--shots=")) || "").slice(8);
const ids = args.filter((a) => !a.startsWith("--"));
const list = ids.length ? ids : Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
if (shots) fs.mkdirSync(shots, { recursive: true });

const VIEWS = [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 375, height: 667 }],
];

(async () => {
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const report = {};
  for (const id of list) {
    report[id] = {};
    for (const [kind, vp] of VIEWS) {
      const ctx = await browser.newContext({ viewport: vp });
      const page = await ctx.newPage();
      page.setDefaultTimeout(90000);
      const issues = [];
      page.on("console", (m) => m.type() === "error" && issues.push(`console: ${m.text().slice(0, 160)}`));
      page.on("pageerror", (e) => issues.push(`pageerror: ${e.message.slice(0, 160)}`));
      page.on("response", (r) => r.status() >= 400 && issues.push(`HTTP ${r.status()} ${r.url().slice(0, 120)}`));
      page.on("requestfailed", (r) => !r.url().includes("_next/webpack-hmr") && issues.push(`failed ${r.url().slice(0, 120)}`));
      await page.goto(`${base}/designs/${id}`, { waitUntil: "load" });
      await page.addStyleTag({ content: "[data-dock]{display:none!important}" });
      await page.waitForTimeout(2200);

      // —— hero fold check (at scrollY 0) ——
      const hero = await page.evaluate(() => {
        const h = document.querySelector("[data-hero]");
        if (!h) return { missing: true };
        const vh = window.innerHeight;
        const parts = [...h.querySelectorAll("[data-hero-part]")].map((el) => {
          const r = el.getBoundingClientRect();
          return { part: el.getAttribute("data-hero-part"), bottom: Math.round(r.bottom), visible: r.height > 0 };
        });
        const ctas = [...h.querySelectorAll('[data-cta="primary"]')].map((el) => Math.round(el.getBoundingClientRect().height));
        return { bottom: Math.round(h.getBoundingClientRect().bottom), vh, parts, ctas };
      });
      if (hero.missing) issues.push("hero: no [data-hero] element");
      else {
        if (hero.bottom > hero.vh + 1) issues.push(`hero: container bottom ${hero.bottom} > viewport ${hero.vh}`);
        hero.parts.filter((p) => p.bottom > hero.vh + 1).forEach((p) => issues.push(`hero: ${p.part} cut off (bottom ${p.bottom} > ${hero.vh})`));
        for (const need of ["headline", "sub", "cta", "visual", "trust"]) if (!hero.parts.some((p) => p.part === need)) issues.push(`hero: missing part "${need}"`);
        if (hero.ctas.length !== 1) issues.push(`hero: ${hero.ctas.length} primary CTAs (want 1)`);
        hero.ctas.filter((h) => h < 44).forEach((h) => issues.push(`hero: CTA height ${h}px < 44`));
      }
      if (shots) await page.screenshot({ path: path.join(shots, `${id}-${kind}-hero.jpg`), type: "jpeg", quality: 70 });

      // —— scroll through so reveals fire ——
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      const step = Math.round(vp.height * 0.6);
      let k = 0;
      for (let y = 0; y < H; y += step) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(120);
        if (shots && kind === "desktop" && y % (vp.height * 1.2) < step && k < 26) {
          await page.waitForTimeout(500);
          await page.screenshot({ path: path.join(shots, `${id}-${kind}-k${String(k++).padStart(2, "0")}.jpg`), type: "jpeg", quality: 55 });
        }
      }
      if (shots && kind === "mobile") {
        for (let y = 0, j = 0; y < H && j < 30; y += vp.height, j++) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(450);
          await page.screenshot({ path: path.join(shots, `${id}-${kind}-k${String(j).padStart(2, "0")}.jpg`), type: "jpeg", quality: 55 });
        }
      }
      await page.waitForTimeout(900);

      // —— static rules ——
      const rules = await page.evaluate(() => {
        const out = [];
        const BANNED = ["inter", "inter variable", "inter tight", "inter tight variable", "roboto", "open sans", "lato", "arial", "helvetica", "system-ui", "-apple-system", "segoe ui", "sans-serif"];
        const seen = new Set();
        for (const el of document.querySelectorAll("body *")) {
          if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          if (el.closest("[data-dock]")) continue;
          const first = getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim().toLowerCase();
          if (BANNED.includes(first) && !seen.has(first)) {
            seen.add(first);
            out.push(`font: banned family "${first}" on <${el.tagName.toLowerCase()}> "${el.textContent.trim().slice(0, 30)}"`);
          }
        }
        const h1s = document.querySelectorAll("h1");
        if (h1s.length !== 1) out.push(`h1: ${h1s.length} h1 elements`);
        h1s.forEach((h) => {
          const cs = getComputedStyle(h);
          const fs = parseFloat(cs.fontSize);
          const ls = parseFloat(cs.letterSpacing) / fs;
          if (fs < 47.5 || fs > 80.5) out.push(`h1: font-size ${fs}px outside clamp(3rem,6vw,5rem)`);
          if (!(ls <= -0.025 && ls >= -0.035)) out.push(`h1: tracking ${ls.toFixed(3)}em (want -0.03em)`);
        });
        document.querySelectorAll(".sys-body").forEach((p) => {
          const cs = getComputedStyle(p);
          const fs = parseFloat(cs.fontSize);
          const lh = parseFloat(cs.lineHeight) / fs;
          if (fs < 16.7 || fs > 18.1) out.push(`body: ${fs}px "${p.textContent.slice(0, 24)}"`);
          if (Math.abs(lh - 1.7) > 0.06) out.push(`body: line-height ${lh.toFixed(2)} "${p.textContent.slice(0, 24)}"`);
          const ch = (() => { const c = document.createElement("canvas").getContext("2d"); c.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; return c.measureText("0").width; })();
          if (p.getBoundingClientRect().width > ch * 71) out.push(`body: measure ${Math.round(p.getBoundingClientRect().width / ch)}ch "${p.textContent.slice(0, 24)}"`);
        });
        const min = window.innerWidth >= 768 ? 120 : 72;
        document.querySelectorAll("[data-section]").forEach((s) => {
          const cs = getComputedStyle(s);
          if (parseFloat(cs.paddingTop) < min - 0.5 || parseFloat(cs.paddingBottom) < min - 0.5) out.push(`spacing: section #${s.id || "?"} padding ${cs.paddingTop}/${cs.paddingBottom} < ${min}px`);
        });
        if (document.documentElement.scrollWidth > window.innerWidth + 1) out.push(`overflow-x: ${document.documentElement.scrollWidth - window.innerWidth}px`);
        document.querySelectorAll("img").forEach((i) => i.complete && i.naturalWidth === 0 && out.push(`img broken ${i.src}`));
        return out;
      });
      issues.push(...rules);

      // —— contrast (axe) ——
      await page.addScriptTag({ content: AXE });
      const axe = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: ["color-contrast"], resultTypes: ["violations"] });
        return r.violations.flatMap((v) => v.nodes.map((n) => `${n.any[0]?.data?.contrastRatio ?? "?"}:1 ${n.target.join(" ").slice(0, 70)} (fg ${n.any[0]?.data?.fgColor}, bg ${n.any[0]?.data?.bgColor})`));
      });
      axe.slice(0, 12).forEach((a) => issues.push(`contrast: ${a}`));
      if (axe.length > 12) issues.push(`contrast: …${axe.length - 12} more`);

      report[id][kind] = issues;
      await ctx.close();
    }
    const d = report[id].desktop.length, m = report[id].mobile.length;
    console.log(`\n${id}: desktop ${d ? d + " issue(s)" : "pass"} · mobile ${m ? m + " issue(s)" : "pass"}`);
    for (const k of ["desktop", "mobile"]) report[id][k].forEach((i) => console.log(`   [${k}] ${i}`));
  }
  if (shots) fs.writeFileSync(path.join(shots, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
})();
