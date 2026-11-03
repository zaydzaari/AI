// Browser regression checks for the standalone Kanso site and its three layouts.
// npm run kanso:verify -- [--base=http://localhost:4330] [--no-shots]
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const args = process.argv.slice(2);
const BASE = (args.find((a) => a.startsWith("--base=")) || "--base=http://127.0.0.1:4330").slice(7);
const SHOTS = !args.includes("--no-shots");
const OUT = path.join(__dirname, "shots");
const axe = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const report = { viewports: [], interactions: [], accessibility: [], errors: [], screenshots: [] };
const layouts = ["ledger", "drawing", "plates"];
const widths = [320, 375, 430, 768, 1024, 1440, 1920];
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const near = (a, b, tolerance = .0000005) => Math.abs(a - b) < tolerance;
function check(condition, label) { assert(condition, label); report.interactions.push(label); }
async function ready(page, url) {
  const response = await page.goto(url, { waitUntil: "load" });
  assert(response.status() === 200, "Page did not load: " + url);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter((i) => i.loading !== "lazy").map((i) => i.decode())); });
}
function watch(page, label) {
  page.on("pageerror", (e) => report.errors.push(label + ": " + e.message));
  page.on("console", (m) => { if (m.type() === "error") report.errors.push(label + ": " + m.text()); });
  page.on("response", (r) => { if (r.status() >= 400) report.errors.push("HTTP " + r.status() + " " + r.url()); });
  page.on("requestfailed", (r) => { if (r.failure()?.errorText !== "net::ERR_ABORTED") report.errors.push("Failed " + r.url()); });
  page.on("request", (r) => { if (r.url().startsWith("http") && new URL(r.url()).origin !== new URL(BASE).origin) report.errors.push("Unexpected external request: " + r.url()); });
}
async function scrollPage(page) {
  await page.evaluate(async () => {
    const pause = (ms) => new Promise((r) => setTimeout(r, ms));
    const old = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * .8) { scrollTo(0, y); await pause(25); }
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    scrollTo(0, 0); document.documentElement.style.scrollBehavior = old;
  });
  await page.waitForTimeout(400);
}
async function geometry(page) {
  return page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) issues.push("Page overflow: " + document.documentElement.scrollWidth + "/" + innerWidth);
    const ids = new Set();
    document.querySelectorAll("[id]").forEach((el) => { if (ids.has(el.id)) issues.push("Duplicate id: " + el.id); ids.add(el.id); });
    document.querySelectorAll('a[href^="#"]').forEach((a) => { if (!document.getElementById(a.hash.slice(1))) issues.push("Broken anchor: " + a.hash); });
    document.querySelectorAll("h1,h2,h3,.section-intro,.hero-copy p,.button,.code-toolbar").forEach((el) => {
      if (!el.getClientRects().length) return;
      const r = el.getBoundingClientRect();
      if (r.left < -1 || r.right > innerWidth + 1) issues.push("Clipped element: " + el.tagName + "." + el.className);
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth) issues.push("Text overflow: " + el.tagName + "." + el.className);
    });
    if ([...document.images].some((i) => !i.complete || !i.naturalWidth)) issues.push("Missing image");
    if (document.querySelectorAll("h1").length !== 1) issues.push("Page must have one h1");
    if (!getComputedStyle(document.body).fontFamily.includes("Manrope")) issues.push("Professional body font did not load");
    if (![...document.fonts].some((f) => f.family === "Manrope" && f.status === "loaded")) issues.push("Manrope not loaded");
    if (document.querySelector(".tw-wrap")) issues.push("Design controls appear on the visitor page");
    return issues;
  });
}
async function interactions(page, label) {
  await page.locator('[data-model="swift"]').click();
  await page.locator('[data-temp="Abliterated"]').click();
  check(await page.locator("#pick-out").textContent() === "swift-32k:abliterated", label + ": model mode selection");
  for (let i = 0; i < 3; i++) check((await page.locator("#code-" + i).textContent()).includes("swift-32k:abliterated"), label + ": model flows into language " + i);
  check(near(+(await page.locator("#receipt-cost").textContent()).slice(1), .00018528), label + ": receipt arithmetic");
  check(await page.locator("#estimate-cost").textContent() === "$0.001280", label + ": estimate follows selection");
  await page.locator('[data-model="atlas"]').click();
  check(await page.locator('[data-temp="Abliterated"]').isDisabled(), label + ": unsupported mode disabled");
  check(await page.locator("#pick-out").textContent() === "atlas-1m", label + ": unsupported mode resets");
  await page.locator('[data-model="core"]').click();
  check(await page.locator("#estimate-cost").textContent() === "$0.009600", label + ": uncached arithmetic");
  await page.locator("#cache-toggle").check();
  check(await page.locator("#estimate-cost").textContent() === "$0.007800", label + ": cached arithmetic");
  check((await page.locator("#cache-saving").textContent()).includes("$0.001800"), label + ": caching savings");
  await page.locator("#cache-toggle").uncheck();
  await page.locator('[data-model="swift"]').click();
  await page.locator("#input-tokens").evaluate((el) => { el.value = 32000; el.dispatchEvent(new Event("input", { bubbles: true })); });
  check((await page.locator("#context-note").textContent()).includes("exceeds Swift"), label + ": context limit explained");
  await page.locator("#input-tokens").evaluate((el) => { el.value = 8000; el.dispatchEvent(new Event("input", { bubbles: true })); });
  await page.locator('[data-model="core"]').click();
  await page.locator("#tab-0").click(); await page.locator("#tab-0").press("ArrowRight");
  check(await page.locator("#tab-1").getAttribute("aria-selected") === "true", label + ": keyboard tab selection");
  await page.locator("#tab-1").press("End");
  check(await page.locator("#tab-2").getAttribute("aria-selected") === "true", label + ": tab End key");
  await page.locator("#copy-code").click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  check(copied.includes("from openai import OpenAI") && copied.includes('model="core-128k"'), label + ": clipboard contains complete Python sample");
  const curl = await page.locator("#code-0").textContent();
  check(curl.includes('Content-Type: application/json') && !curl.includes("\n+"), label + ": cURL headers and continuation");
  const payload = JSON.parse(curl.match(/-d '([\s\S]+)'$/)[1]);
  check(payload.model === "core-128k" && payload.messages[0].role === "user", label + ": valid cURL JSON body");
  await page.locator('[data-filter="coding"]').click();
  check(await page.locator("[data-model-row]:visible").count() === 1 && await page.locator('[data-model-row="forge"]').isVisible(), label + ": catalogue filter");
  await page.locator('[data-choose="forge"]').click();
  check(await page.locator("#pick-out").textContent() === "forge-256k", label + ": catalogue selects quickstart model");
  await page.locator('[data-filter="all"]').click();
  check(await page.locator("[data-model-row]:visible").count() === 5, label + ": all models restored");
  const before = await page.locator("#r-sh").textContent();
  await page.locator("#sun").evaluate((el) => { el.value = 1; el.dispatchEvent(new Event("input", { bubbles: true })); });
  check(await page.locator("#r-sh").textContent() !== before, label + ": architecture slider updates cost");
  await page.locator(".faq-list summary").first().click();
  check(await page.locator(".faq-list details").first().getAttribute("open") !== null, label + ": FAQ opens");
  if (await page.locator(".menu-button").isVisible()) {
    await page.locator(".menu-button").click();
    check(await page.locator("#mobile-menu").isVisible(), label + ": phone navigation opens");
    await page.keyboard.press("Escape");
    check(await page.locator("#mobile-menu").isHidden() && await page.locator(".menu-button").evaluate((el) => el === document.activeElement), label + ": Escape closes menu and returns focus");
    await page.locator(".menu-button").click(); await page.locator('#mobile-menu a[href="#models"]').click();
    check(await page.locator("#mobile-menu").isHidden(), label + ": navigation closes on selection");
  }
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const layout of layouts) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ["clipboard-read", "clipboard-write"] });
      const page = await ctx.newPage();
      watch(page, layout);
      await ready(page, BASE + "/directions/" + layout + "/");
      await scrollPage(page);
      if (SHOTS) {
        const shot = path.join(OUT, layout + "-desktop.png"); await page.screenshot({ path: shot, fullPage: true }); report.screenshots.push(shot);
        if (layout === "ledger") { await page.screenshot({ path: path.join(OUT, "hero-desktop.png") }); }
      }
      for (const width of widths) {
        await page.setViewportSize({ width, height: width <= 430 ? 812 : 1000 });
        await page.waitForTimeout(75);
        await page.locator(".hero-image img").evaluate((img) => img.decode());
        const issues = await geometry(page);
        report.viewports.push({ layout, width, issues });
        assert(!issues.length, layout + " at " + width + ": " + issues.join("; "));
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
      const imageBox = await page.locator(".hero-image").boundingBox();
      await page.mouse.move(imageBox.x + imageBox.width * .85, imageBox.y + imageBox.height * .6);
      await page.waitForTimeout(400);
      check(Math.abs(await page.locator(".hero-image img").evaluate((el) => parseFloat(el.style.getPropertyValue("--px")) || 0)) > 1, layout + ": damped image responds to pointer");
      await page.mouse.move(10, 10); await page.waitForTimeout(1200);
      check(Math.abs(await page.locator(".hero-image img").evaluate((el) => parseFloat(el.style.getPropertyValue("--px")) || 0)) < .05, layout + ": image spring settles back to rest");
      await interactions(page, layout + " desktop");
      await page.addScriptTag({ content: axe });
      const a11y = await page.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"] })).violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5) })));
      report.accessibility.push({ layout, viewport: "desktop", violations: a11y }); assert(!a11y.length, layout + " accessibility: " + JSON.stringify(a11y));
      const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, permissions: ["clipboard-read", "clipboard-write"] });
      const mobile = await mobileContext.newPage(); watch(mobile, layout + " touch");
      await ready(mobile, BASE + "/directions/" + layout + "/");
      await scrollPage(mobile);
      if (SHOTS) { await mobile.screenshot({ path: path.join(OUT, layout + "-mobile.png"), fullPage: true }); if (layout === "ledger") await mobile.screenshot({ path: path.join(OUT, "hero-mobile.png") }); }
      check(await mobile.evaluate(() => !matchMedia("(pointer:fine)").matches), layout + ": real touch context");
      await interactions(mobile, layout + " mobile");
      await mobile.addScriptTag({ content: axe });
      const mobileA11y = await mobile.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"] })).violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5) })));
      report.accessibility.push({ layout, viewport: "mobile", violations: mobileA11y }); assert(!mobileA11y.length, layout + " mobile accessibility: " + JSON.stringify(mobileA11y));
      await mobile.setViewportSize({ width: 844, height: 390 });
      await mobile.locator(".hero-image img").evaluate((img) => img.decode());
      const landscapeIssues = await geometry(mobile); report.viewports.push({ layout, width: 844, height: 390, issues: landscapeIssues });
      assert(!landscapeIssues.length, layout + " landscape: " + landscapeIssues.join("; "));
      check(await mobile.locator(".structure-sticky").evaluate((el) => getComputedStyle(el).position) === "relative", layout + ": landscape avoids clipped pinning");
      await mobileContext.close();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await ready(page, BASE + "/directions/" + layout + "/");
      check(await page.locator(".hero-image img").evaluate((el) => getComputedStyle(el).transform) === "none", layout + ": reduced motion disables image physics");
      check(await page.locator(".structure-sticky").evaluate((el) => getComputedStyle(el).position) === "relative", layout + ": reduced motion removes pinning");
      await ctx.close();
      console.log(layout + ": responsive, interactions, accessibility and reduced motion passed");
    }
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await ready(page, BASE + "/");
    check(await page.locator("body").getAttribute("class") === "layout-ledger", "Home uses the complete Ledger direction");
    await ready(page, BASE + "/directions/");
    check(await page.locator(".card").count() === 3, "Three complete directions available");
    await page.locator("#layout-0").selectOption("drawing");
    check((await page.locator("#frame-0").getAttribute("src")) === "drawing/#platform", "Comparison changes the independent preview");
    check((await page.locator("#open-0").getAttribute("href")) === "drawing/", "Comparison full-size link follows selection");
    if (SHOTS) await page.screenshot({ path: path.join(OUT, "directions.png"), fullPage: true });
    await ready(page, BASE + "/?tweaks");
    check(await page.locator(".tw-toggle").isVisible(), "Optional design controls remain available");
    check(!report.errors.length, "No browser errors or failed assets");
    console.log(`PASS: ${report.viewports.length} responsive cases, ${report.interactions.length} interaction checks, ${report.accessibility.length} accessibility audits.`);
  } finally {
    fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exitCode = 1; });
