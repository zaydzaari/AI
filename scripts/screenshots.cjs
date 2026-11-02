// Captures desktop, mobile and tall gallery previews for each design and reports console errors.
// Usage: node scripts/screenshots.mjs [ids...] [--qa=dir] [--base=http://localhost:3000]
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

(async () => {

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith("--base=")) || "--base=http://localhost:3000").slice(7);
const qa = (args.find((a) => a.startsWith("--qa=")) || "").slice(5);
const ids = args.filter((a) => !a.startsWith("--"));
const all = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const list = ids.length ? ids : all;
const out = path.resolve("public/previews");
fs.mkdirSync(out, { recursive: true });
if (qa) fs.mkdirSync(qa, { recursive: true });

async function settle(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1600);
}

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const id of list) {
  const errors = [];
  for (const [kind, vp, dsf] of [
    ["desktop", { width: 1440, height: 900 }, 1],
    ["mobile", { width: 390, height: 844 }, 1],
  ]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dsf });
    const page = await ctx.newPage();
    page.setDefaultTimeout(90000);
    page.on("console", (m) => m.type() === "error" && errors.push(`[${kind}] ${m.text().slice(0, 240)}`));
    page.on("pageerror", (e) => errors.push(`[${kind}] pageerror ${e.message.slice(0, 240)}`));
    await page.goto(`${base}/designs/${id}`, { waitUntil: "load", timeout: 120000 });
    await page.addStyleTag({ content: "[data-dock]{display:none!important}" });
    await page.waitForTimeout(2600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) errors.push(`[${kind}] horizontal overflow ${overflow}px`);
    if (kind === "desktop") {
      await page.screenshot({ path: path.join(out, `${id}-desktop.jpg`), type: "jpeg", quality: 82 });
      if (qa) {
        await settle(page);
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0, k = 0; y < h; y += 900, k++) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(700);
          await page.screenshot({ path: path.join(qa, `${id}-d-${String(k).padStart(2, "0")}.jpg`), type: "jpeg", quality: 60 });
        }
      }
    } else {
      await page.screenshot({ path: path.join(out, `${id}-mobile.jpg`), type: "jpeg", quality: 80 });
      if (qa) {
        await settle(page);
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0, k = 0; y < h && k < 18; y += 844, k++) {
          await page.evaluate((v) => window.scrollTo(0, v), y);
          await page.waitForTimeout(450);
          await page.screenshot({ path: path.join(qa, `${id}-m-${String(k).padStart(2, "0")}.jpg`), type: "jpeg", quality: 55 });
        }
      }
    }
    await ctx.close();
  }
  // tall preview for gallery hover-pan: 1440 x 3600 at half scale
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 0.5 });
  const page = await ctx.newPage();
  page.setDefaultTimeout(90000);
  await page.goto(`${base}/designs/${id}`, { waitUntil: "load", timeout: 120000 });
  await page.addStyleTag({ content: "[data-dock]{display:none!important}" });
  await settle(page);
  const fullH = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: path.join(out, `${id}-tall.jpg`), type: "jpeg", quality: 78, fullPage: true, clip: { x: 0, y: 0, width: 1440, height: Math.min(3600, fullH) } });
  await ctx.close();
  console.log(`${id}: ${errors.length ? errors.join("\n    ") : "ok"}`);
}
await browser.close();
})();
