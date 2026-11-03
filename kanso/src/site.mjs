import fs from "node:fs";
import { esc } from "./shell.mjs";
import { BRAND, MODELS, BENEFITS, rate } from "./content.mjs";

export const LAYOUTS = ["ledger", "drawing", "plates"];
const css = fs.readFileSync(new URL("./design.css", import.meta.url), "utf8");
const js = fs.readFileSync(new URL("./interactions.js", import.meta.url), "utf8");
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const mark = '<svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M3 23V9h6v14M11 23V4h6v19M19 23V12h6v11M1 25h26" stroke="currentColor" stroke-width="2"/></svg>';
const chapters = [["foundation", "Foundation"], ["platform", "Platform"], ["developers", "Quickstart"], ["models", "Models & rates"], ["pricing", "Plans"], ["faq", "Questions"]];
const faq = [
  ["What is Aether?", "A platform direction for accessing several model families through one API, with unified chat, coding tools and per-token pricing. This page is a product preview: model names, availability and rates are illustrative."],
  ["Can I use an OpenAI-compatible SDK?", "The proposed API follows the familiar chat-completions request format. The quickstart shows how a base URL, API key and model string fit together. The example endpoint is a placeholder and does not send live requests."],
  ["What do the three model modes mean?", "Standard is the default behavior. Low-refusal and abliterated are alternative model variants intended to reduce refusal behavior. Availability and actual behavior depend on the model; each family lists the modes shown in this preview."],
  ["How does prompt caching affect cost?", "In this pricing example, repeated input tokens use the cached-input rate. The estimator separates input, cached input and output so you can see the arithmetic before choosing a model."],
  ["Can I change models without rebuilding my integration?", "The examples use the same request structure for every model. Choose a family and an available mode in the quickstart; the model identifier updates in cURL, TypeScript and Python."],
  ["Are the prices and subscriptions final?", "No. All model prices and plan amounts here are samples for product exploration. There is no checkout or active billing on this preview."],
];
const heading = (number, label, title, description = "") => `<div class="section-heading"><p class="eyebrow"><span>${number}</span>${label}</p><h2 data-reveal>${title}</h2>${description ? `<p class="section-intro" data-reveal>${description}</p>` : ""}</div>`;

export function createSite({ layout = "ledger", assetBase = "" } = {}) {
  if (!LAYOUTS.includes(layout)) throw new Error("Unknown Kanso layout");
  const image = (name, extra = "") => `<img src="${assetBase}assets/${name}-960.webp" srcset="${assetBase}assets/${name}-640.webp 640w, ${assetBase}assets/${name}-960.webp 960w, ${assetBase}assets/${name}-1440.webp 1440w" sizes="${name === "courtyard" ? "(max-width: 1440px) 94vw, 1320px" : "(max-width: 760px) 90vw, 600px"}" width="1536" height="1024" ${extra}>`;
  const heroImage = `<picture><source media="(min-width:761px)" srcset="${assetBase}assets/courtyard-wide-960.webp 960w, ${assetBase}assets/courtyard-wide-1440.webp 1440w, ${assetBase}assets/courtyard-wide-1920.webp 1920w" sizes="(max-width:1440px) 90vw, 1448px">${image("courtyard", 'alt="Five cast-concrete piers joined into one open architectural courtyard" fetchpriority="high" decoding="async"')}</picture>`;
  return {
    title: "Aether — One key. Every model.",
    description: "One API for five model families. Explore the model catalogue, try the interactive quickstart and understand every token cost.",
    bodyClass: `layout-${layout}`,
    fonts: [{ family: "Manrope", axes: "wght@400..800" }, { family: "IBM Plex Mono", axes: "wght@400;500" }],
    tokens: {
      bgPrimary: "#F3F4F0", bgSecondary: "#E7EAE3", accent: "#245847", onAccent: "#FFFFFF",
      textPrimary: "#1B2923", textMuted: "#59645D", line: "rgba(27,41,35,.17)",
      display: '"Manrope", sans-serif', body: '"Manrope", sans-serif',
    },
    css, js,
    body: `
<header class="site-header">
  <a class="brand" href="#main" aria-label="Aether home">${mark}<span>${BRAND.name}<span class="brand-period">.</span></span></a>
  <nav class="desktop-nav" aria-label="Main navigation"><a href="#platform">Platform</a><a href="#developers">Developers</a><a href="#models">Models</a><a href="#pricing">Pricing</a></nav>
  <div class="header-actions"><a class="header-cta" href="#developers">API quickstart ${arrow}</a><button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu"><span>Menu</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="1.5"/></svg></button></div>
</header>
<nav id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation" hidden>${chapters.map(([id, label]) => `<a href="#${id}">${label}${arrow}</a>`).join("")}</nav>
<main id="main">
  <section class="hero" data-hero aria-labelledby="hero-title">
    <div class="hero-top">
      <div><p class="eyebrow hero-eyebrow" data-hero-part="trust"><span class="short-rule"></span>THE MODEL LAYER</p><h1 id="hero-title" data-hero-part="headline">One key.<br>Every model<span class="hero-stop">.</span></h1></div>
      <div class="hero-copy"><p data-hero-part="sub">Your models, working together.<br>One API for chat, code and the work ahead.</p><div class="hero-actions" data-hero-part="cta"><a class="button primary" href="#developers" data-cta="primary">Explore the API ${arrow}</a><a class="text-link" href="#models">Find your model ${arrow}</a></div></div>
    </div>
    <figure class="hero-art" data-hero-part="visual"><div class="hero-image" data-physical>${heroImage}</div><figcaption><span>Five families. One foundation.</span><span class="art-caption">Concrete study / 01 <span aria-hidden="true">↗</span></span></figcaption></figure>
    <div class="hero-specs"><p><strong>05</strong> Model families</p><p><strong>01</strong> API endpoint</p><p><strong>3</strong> Model modes</p><a href="#foundation">Explore the foundation <span aria-hidden="true">↓</span></a></div>
  </section>
  <div class="page-layout">
    <aside class="chapter-nav" aria-label="On this page"><p class="eyebrow">IN THIS CHAPTER</p><nav>${chapters.map(([id, label], i) => `<a href="#${id}"><span>0${i + 1}</span>${label}</a>`).join("")}</nav><p class="chapter-note">Less to manage.<br>More to build.</p></aside>
    <div class="body-sections">
      <section id="foundation" class="section foundation" data-section>
        ${heading("01", "FOUNDATION", "Different strengths.<br>A shared foundation.", "Choose the model that fits the request. Keep the same interface, and see the cost of the choice.")}
        <div class="structure-scroll" id="build"><div class="structure-sticky"><div class="structure-drawing"><span class="drawing-label">FIG. 01 / MODEL ARCHITECTURE</span><svg id="build-iso" viewBox="0 0 800 420" role="img" aria-label="Five monoliths whose heights represent the context windows of the model families"></svg><p class="drawing-key"><span></span>Height represents context window</p></div><div class="structure-controls"><p class="eyebrow">ONE REQUEST, IN VIEW</p><h3>Know the shape<br>of your usage.</h3><p>Change the request size. The shadows show its illustrative cost across the five families.</p><label for="sun">Request size <output id="r-time">6K tokens</output></label><input id="sun" type="range" min="0" max="1" step="0.01" value="0.35"><dl class="structure-readout"><div><dt>Lowest sample cost</dt><dd id="r-el">Swift</dd></div><div><dt>Atlas request cost</dt><dd id="r-sh">$0.00</dd></div></dl><p class="micro">Illustrative rates. 75% input, 25% output.</p></div></div></div>
      </section>
      <section id="platform" class="section" data-section>
        ${heading("02", "PLATFORM", "A smaller stack.<br>A wider range.", "The parts of an AI workflow, brought into one place.")}
        <ol class="capabilities">${BENEFITS.map(([name, , detail], i) => `<li data-reveal><span class="item-number">0${i + 1}</span><div><h3>${name}</h3><p>${detail}</p></div></li>`).join("")}</ol>
        <div class="use-cases"><figure>${image("pavilion", 'alt="A precise concrete pavilion with a single continuous roof" loading="lazy" decoding="async"')}<figcaption>A considered system. Room to build.</figcaption></figure><div><p class="eyebrow">MADE FOR YOUR WORK</p><h3>One platform.<br>Different practices.</h3><dl><div><dt>Developers</dt><dd>Keep your request format. Choose the model per task.</dd></div><div><dt>Researchers & writers</dt><dd>Compare model families and available response modes.</dd></div><div><dt>Teams</dt><dd>Understand token usage and the effect of caching.</dd></div></dl></div></div>
      </section>
      <section id="developers" class="section" data-section>
        ${heading("03", "FOR DEVELOPERS", "Your next request.<br>Already familiar.", "Choose a family and a mode. The example updates in the language you use.")}
        <ol class="quickstart-steps"><li><span>01</span>Choose a model</li><li><span>02</span>Copy your request</li><li><span>03</span>Read the usage</li></ol>
        <div class="integration"><div class="model-config"><p class="control-label" id="family-label">MODEL FAMILY</p><div class="model-choices" id="pick-model" role="group" aria-labelledby="family-label">${MODELS.map((m, i) => `<button type="button" data-model="${m.id}" aria-pressed="${i === 0}"><span>${m.name}</span><span>${m.context}</span></button>`).join("")}</div><p class="control-label" id="mode-label">RESPONSE MODE</p><div class="mode-choices" id="pick-temp" role="group" aria-labelledby="mode-label">${["Standard", "Low-refusal", "Abliterated"].map((name, i) => `<button type="button" data-temp="${name}" aria-pressed="${i === 0}">${name}</button>`).join("")}</div><code id="pick-out" aria-live="polite">core-128k</code><p class="micro">Modes vary by model. This is an interactive example using placeholder model data.</p></div>
        <div class="code-workbench"><div class="code-toolbar"><div role="tablist" aria-label="Code language">${["cURL", "TypeScript", "Python"].map((name, i) => `<button role="tab" type="button" id="tab-${i}" aria-controls="code-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${name}</button>`).join("")}</div><button type="button" id="copy-code" class="copy-button">Copy ${arrow}</button></div>${[0, 1, 2].map((i) => `<pre class="code-panel" role="tabpanel" id="code-${i}" aria-labelledby="tab-${i}" tabindex="0"${i ? " hidden" : ""}><code></code></pre>`).join("")}<div class="receipt"><div><span class="receipt-dot"></span>SAMPLE USAGE RECEIPT</div><dl><div><dt>Input tokens</dt><dd>1,820</dd></div><div><dt>Cached input</dt><dd>1,536</dd></div><div><dt>Output tokens</dt><dd>412</dd></div><div class="receipt-total"><dt>Request cost</dt><dd id="receipt-cost" aria-live="polite">$0.001389</dd></div></dl></div></div></div>
        <p class="micro example-note">Example endpoint: ${BRAND.apiBase}. Requests are shown for reference and are not sent from this page. <span id="copy-status" role="status"></span></p>
      </section>
      <section id="models" class="section" data-section>
        ${heading("04", "MODELS & RATES", "Choose for the work.<br>See what it costs.", "Five families, each with a different focus. Sample prices shown per million tokens.")}
        <div class="model-filter" role="group" aria-label="Filter models">${[["all", "All models"], ["general", "General"], ["coding", "Coding"], ["context", "Long context"], ["fast", "Fast"]].map(([key, name], i) => `<button type="button" data-filter="${key}" aria-pressed="${i === 0}">${name}</button>`).join("")}</div>
        <div class="model-table-wrap"><table class="model-table"><caption class="sr-only">Illustrative model rates in US dollars per one million tokens</caption><thead><tr><th scope="col">Model</th><th scope="col">Context</th><th scope="col">Input</th><th scope="col">Cached input</th><th scope="col">Output</th><th scope="col">Available modes</th></tr></thead><tbody>${MODELS.map((m) => `<tr data-model-row="${m.id}"><th scope="row"><button type="button" class="model-table-name" data-choose="${m.id}" aria-label="Use ${m.name} in quickstart">${m.name}${arrow}</button><span>${m.role}</span></th><td><span class="cell-label">Context</span>${m.context}</td><td><span class="cell-label">Input</span>${rate(m.inPrice)}</td><td><span class="cell-label">Cached</span>${rate(m.cached)}</td><td><span class="cell-label">Output</span>${rate(m.outPrice)}</td><td class="table-variants">${m.variants.map((v) => `<span>${v}</span>`).join("")}</td></tr>`).join("")}</tbody></table></div>
        <p class="micro table-note">Sample model names and rates, not a commitment to availability or final pricing.</p>
        <div class="estimate"><div class="estimate-controls"><p class="eyebrow">BEFORE YOU BUILD</p><h3>Put a number to it.</h3><p class="estimate-model">Estimate for <strong id="estimate-model">Core</strong> <a href="#developers">Change model ${arrow}</a></p><label for="input-tokens">Input tokens <output id="input-value">8,000</output></label><input id="input-tokens" type="range" min="1000" max="32000" step="1000" value="8000"><label for="output-tokens">Output tokens <output id="output-value">2,000</output></label><input id="output-tokens" type="range" min="100" max="8000" step="100" value="2000"><label class="cache-toggle"><input type="checkbox" id="cache-toggle"><span>Cache half the input</span></label><p id="context-note" class="micro" role="status"></p></div><div class="estimate-result"><span>ILLUSTRATIVE REQUEST COST</span><output id="estimate-cost" aria-live="polite">$0.009600</output><p><span id="cache-saving">Turn on caching to compare.</span><br>Input + cached input + output. No hidden arithmetic.</p></div></div>
      </section>
      <section id="pricing" class="section" data-section>
        ${heading("05", "ILLUSTRATIVE PLANS", "Start small.<br>Build from there.", "A proposed structure for chat and API access. These plans are examples; checkout is not available in this preview.")}
        <div class="plans"><article><h3>Explore</h3><p class="plan-price">$0<span>to start</span></p><p>A place to try the model families and find your fit.</p><ul><li>Unified chat</li><li>Daily usage allowance</li><li>Model comparison</li></ul><a class="text-link" href="#models">Explore models ${arrow}</a></article><article class="featured-plan"><h3>Pro</h3><p class="plan-price">$20<span>/ month · sample</span></p><p>More room for longer conversations and larger tasks.</p><ul><li>Higher chat limits</li><li>Alternative model variants</li><li>Coding tools preview</li></ul><a class="text-link" href="#platform">See the platform ${arrow}</a></article><article><h3>API</h3><p class="plan-price">Per token<span>pay as you go</span></p><p>Choose a model per request and track the cost.</p><ul><li>One request format</li><li>Prompt caching</li><li>Token-level usage</li></ul><a class="text-link" href="#developers">View quickstart ${arrow}</a></article></div>
      </section>
      <section id="faq" class="section faq-section" data-section>
        ${heading("06", "A FEW DETAILS", "Clear answers.<br>Before you start.")}
        <div class="faq-list">${faq.map(([q, a]) => `<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${esc(a)}</p></details>`).join("")}</div>
      </section>
    </div>
  </div>
  <section class="closing" aria-labelledby="closing-title"><div><p class="eyebrow">A CLEARER FOUNDATION</p><h2 id="closing-title">Less to manage.<br>More to build.</h2><p>Start with a familiar request.<br>Choose where it takes you.</p><a class="button primary" href="#developers">Open the quickstart ${arrow}</a></div><figure>${image("monolith", 'alt="A tall concrete monolith joined to a low horizontal structure" loading="lazy" decoding="async"')}</figure></section>
</main>
<footer class="site-footer"><div class="footer-top"><a class="brand" href="#main">${mark}${BRAND.name}.</a><p>One key. Every model.</p><a class="text-link" href="#main">Back to top <span aria-hidden="true">↑</span></a></div><div class="footer-bottom"><p>Product preview. Models, rates and plans are illustrative.</p><nav aria-label="Footer"><a href="#models">Models</a><a href="#developers">Quickstart</a><a href="#faq">FAQ</a></nav><span>© 2026 ${BRAND.name}</span></div></footer>`,
  };
}

export default createSite();
