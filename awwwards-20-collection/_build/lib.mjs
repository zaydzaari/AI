// Shared helpers for the 20 sites. Importing this file never triggers a build.
// Each site supplies its own CSS, markup and signature JS; this file only provides the
// page shell, the Design-DNA baseline (type scale, spacing, grain, reveals) and a tiny runtime.

/** Tagged template that joins arrays and drops null/undefined/false. */
export const h = (s, ...v) =>
  s.reduce((a, str, i) => a + str + (i < v.length ? (Array.isArray(v[i]) ? v[i].join("") : v[i] === false || v[i] == null ? "" : v[i]) : ""), "");

/** Serialise a browser-side function as an IIFE (lets site JS be syntax-checked by Node). */
export const iife = (fn) => `(${fn.toString()})();`;

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** Standard honesty note: every brand in the collection is fictional. */
export const fiction = (name) =>
  `${esc(name)} is a fictional concept built for the Awwwards 20 design exhibition. People, case studies, figures and prices are illustrative.`;

/** Fractal-noise grain tile used by the fixed overlay (opacity set in BASE_CSS). */
export const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 1.4 -.2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"
)}")`;

const BASE_CSS = `
:root{--ease:cubic-bezier(0.22,1,0.36,1);--ease-io:cubic-bezier(0.65,0,0.35,1);--gutter:clamp(20px,5vw,72px);--maxw:1320px}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--bg-primary);color:var(--text-primary);font-family:var(--font-body);font-size:calc(1.05rem * var(--tw-body,1));line-height:1.7;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
h1,h2,h3,h4,p,ul,ol,figure,blockquote,dl,dd,fieldset{margin:0}
.k-gap{height:clamp(64px,6vw,80px)}
ul,ol{padding:0;list-style:none}
fieldset{border:0;padding:0}
img,svg,canvas,video{display:block;max-width:100%}
button,input,select{font:inherit;color:inherit}
code,kbd,pre,samp{font-family:var(--font-code,var(--font-body))}
button{cursor:pointer}
a{color:inherit;text-decoration-thickness:1px;text-underline-offset:.22em}
h1{font-family:var(--font-display);font-size:calc(clamp(3.25rem,6vw,5rem) * var(--tw-h1,1));line-height:.98;letter-spacing:var(--tw-h1ls,-.03em);font-weight:var(--h1-weight,500);text-wrap:balance}
h1,h2,h3,h4{overflow-wrap:anywhere;hyphens:manual}
.k-card{padding:clamp(36px,3vw,40px)}
h2,h3{font-family:var(--font-display);text-wrap:balance}
p,li,dd,blockquote,figcaption{text-wrap:pretty}
.k-wrap{width:min(100% - 2*var(--gutter),var(--maxw));margin-inline:auto}
.k-body{font-size:calc(1.05rem * var(--tw-body,1));line-height:1.7;max-width:65ch}
.k-muted{color:var(--text-muted)}
::selection{background:var(--accent);color:var(--on-accent)}
html{scrollbar-color:color-mix(in srgb,var(--text-muted) 55%,transparent) var(--bg-primary);caret-color:var(--accent)}
:focus-visible{outline:2px solid var(--focus,var(--accent));outline-offset:3px}
.k-skip{position:absolute;left:12px;top:-80px;z-index:10000;padding:10px 16px;background:var(--text-primary);color:var(--bg-primary);text-decoration:none}
.k-skip:focus{top:12px}
.k-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
[data-section]{padding-block:120px;position:relative}
@media (max-width:767px){[data-section]{padding-block:72px}}
body::after{content:"";position:fixed;inset:0;z-index:9000;pointer-events:none;opacity:var(--tw-grain,.035);background-image:${GRAIN};background-size:220px}
[data-reveal]{opacity:0;transform:translate3d(0,var(--tw-rd,26px),0);transition:opacity calc(.8s * var(--tw-dur,1)) var(--tw-ease,var(--ease)) calc(var(--i,0) * var(--tw-stg,80ms)),transform calc(.9s * var(--tw-dur,1)) var(--tw-ease,var(--ease)) calc(var(--i,0) * var(--tw-stg,80ms))}
[data-reveal].is-in{opacity:1;transform:none}
[data-magnetic]{will-change:transform;touch-action:manipulation}
[data-spot]{--mx:50%;--my:50%}
/* Pinned horizontal rail mechanics; each site styles the cards itself. */
[data-rail-track]{display:grid;gap:24px}
@media (min-width:900px) and (prefers-reduced-motion:no-preference){
  [data-rail]{height:calc(var(--steps,3) * 80vh + 20vh)}
  [data-rail-view]{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;flex-direction:column;justify-content:center}
  [data-rail-track]{display:flex;width:max-content;will-change:transform}
}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`;

// The runtime is plain browser JS, exposed as window.K.
const RUNTIME = String.raw`
(() => {
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);
  const pointer = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, active: false };
  addEventListener("pointermove", (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    pointer.nx = e.clientX / innerWidth * 2 - 1; pointer.ny = e.clientY / innerHeight * 2 - 1;
  }, { passive: true });

  // One rAF-throttled scroll/resize bus.
  const subs = []; let queued = false;
  const flush = () => { queued = false; for (const f of subs) f(); };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(flush); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  const onScroll = (f) => { subs.push(f); f(); };

  // 0..1 while a tall element scrolls past a pinned viewport ("pin"), or from entering
  // the bottom edge to leaving the top edge ("through").
  const progress = (el, mode = "pin") => {
    const r = el.getBoundingClientRect(), vh = innerHeight;
    if (mode === "through") return clamp((vh - r.top) / (vh + r.height));
    return clamp(-r.top / Math.max(1, r.height - vh));
  };

  // Reveals: vertical-only root margin, once.
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -12% 0px" });
  $$("[data-stagger]").forEach((g) => [...g.children].forEach((c, i) => {
    c.style.setProperty("--i", Math.min(i, 5)); c.setAttribute("data-reveal", "");
  }));
  $$("[data-reveal]").forEach((el) => (RM ? el.classList.add("is-in") : io.observe(el)));
  const whenSeen = (el, fn, margin = "0px 0px -15% 0px") => {
    const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { o.disconnect(); fn(); } }), { rootMargin: margin });
    o.observe(el);
  };

  // Magnetic CTAs with spring physics. data-magnetic="reach,stiffness,damping[,innerFactor]".
  const mags = FINE && !RM ? $$("[data-magnetic]").map((el) => {
    const [reach = 6, k = 0.16, d = 0.74, inner = 0.35] = (el.dataset.magnetic || "").split(",").map(Number).map((n, i) => (isNaN(n) || !n ? [6, 0.16, 0.74, 0.35][i] : n));
    return { el, reach, k, d, inner, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, label: el.querySelector("[data-magnetic-label]") };
  }) : [];
  let magRaf = 0;
  const magTick = () => {
    let moving = false;
    for (const m of mags) {
      const r = m.el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - m.x, cy = r.top + r.height / 2 - m.y;
      const dx = pointer.x - cx, dy = pointer.y - cy;
      const radius = Math.max(r.width, r.height) * 0.95;
      const near = pointer.active && Math.hypot(dx / (r.width / 2 + radius / 2), dy / (r.height / 2 + radius / 2)) < 1;
      m.tx = near ? clamp(dx / (r.width / 2), -1, 1) * m.reach : 0;
      m.ty = near ? clamp(dy / (r.height / 2), -1, 1) * m.reach : 0;
      m.vx = (m.vx + (m.tx - m.x) * m.k) * m.d; m.vy = (m.vy + (m.ty - m.y) * m.k) * m.d;
      m.x += m.vx; m.y += m.vy;
      m.el.style.transform = "translate3d(" + m.x.toFixed(2) + "px," + m.y.toFixed(2) + "px,0)";
      if (m.label) m.label.style.transform = "translate3d(" + (m.x * m.inner).toFixed(2) + "px," + (m.y * m.inner).toFixed(2) + "px,0)";
      m.el.classList.toggle("is-near", near);
      if (Math.abs(m.vx) + Math.abs(m.vy) + Math.abs(m.tx - m.x) + Math.abs(m.ty - m.y) > 0.05) moving = true;
    }
    magRaf = moving ? requestAnimationFrame(magTick) : 0;
  };
  if (mags.length) addEventListener("pointermove", () => { if (!magRaf) magRaf = requestAnimationFrame(magTick); }, { passive: true });

  // Spotlight cards: --mx/--my in px, fine pointers only.
  if (FINE) $$("[data-spot]").forEach((c) => c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true }));

  // Count-ups: data-count="1284" [data-decimals] [data-prefix] [data-suffix].
  const fmt = (v, dec) => v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  $$("[data-count]").forEach((el) => {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
    const pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
    const set = (v) => (el.textContent = pre + fmt(v, dec) + suf);
    if (RM) return set(to);
    set(0);
    whenSeen(el, () => {
      const t0 = performance.now(), dur = +(el.dataset.duration || 1400);
      const step = (t) => { const p = clamp((t - t0) / dur); set(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  });

  // Canvas helper: DPR-aware, resizes with its box.
  const canvas = (cv, onResize) => {
    const ctx = cv.getContext("2d");
    const s = { cv, ctx, w: 0, h: 0, dpr: 1 };
    const fit = () => {
      const r = cv.getBoundingClientRect();
      s.dpr = Math.min(devicePixelRatio || 1, 2); s.w = Math.max(1, r.width); s.h = Math.max(1, r.height);
      cv.width = Math.round(s.w * s.dpr); cv.height = Math.round(s.h * s.dpr);
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      onResize && onResize(s);
    };
    new ResizeObserver(fit).observe(cv); fit();
    return s;
  };

  // rAF loop that only runs while el is on screen. fn(timeSeconds, dtSeconds).
  const loop = (el, fn, { always = false } = {}) => {
    let on = false, raf = 0, last = 0;
    const tick = (t) => { const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; fn(t / 1000, dt); raf = requestAnimationFrame(tick); };
    const start = () => { if (!on) { on = true; last = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { if (on) { on = false; cancelAnimationFrame(raf); } };
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: "120px 0px 120px 0px" }).observe(el);
    if (RM && !always) requestAnimationFrame((t) => fn(t / 1000, 0));
    return { start, stop };
  };

  // Pinned horizontal rail: [data-rail] > [data-rail-view] > [data-rail-track] > li.
  $$("[data-rail]").forEach((run) => {
    const view = $("[data-rail-view]", run), track = $("[data-rail-track]", run);
    const steps = [...track.children];
    run.style.setProperty("--steps", steps.length);
    const wide = matchMedia("(min-width: 900px)");
    onScroll(() => {
      let p = 0;
      if (wide.matches && !RM) {
        p = progress(run);
        const max = Math.max(0, track.scrollWidth - view.clientWidth + parseFloat(getComputedStyle(track).marginLeft || 0) * 2);
        track.style.transform = "translate3d(" + (-p * max).toFixed(1) + "px,0,0)";
      } else {
        track.style.transform = "";
        const r = run.getBoundingClientRect();
        p = clamp((innerHeight * 0.6 - r.top) / Math.max(1, r.height));
      }
      run.style.setProperty("--rp", p.toFixed(4));
      const a = Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999));
      steps.forEach((s, i) => s.classList.toggle("is-active", i === a));
      run.dataset.step = a;
    });
  });

  // Scroll-spy: [data-spy] a[href^="#"] gets .is-current + aria-current while its section is centred.
  const spy = $$("[data-spy] a[href^='#']");
  if (spy.length) {
    const map = new Map(spy.map((a) => [a.getAttribute("href").slice(1), a]));
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      spy.forEach((a) => { a.classList.remove("is-current"); a.removeAttribute("aria-current"); });
      const a = map.get(e.target.id); if (a) { a.classList.add("is-current"); a.setAttribute("aria-current", "true"); }
    }), { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const t = document.getElementById(id); if (t) so.observe(t); });
  }

  window.K = { RM, FINE, $, $$, clamp, lerp, smooth, pointer, onScroll, progress, whenSeen, canvas, loop, fmt };
})();
`;

/**
 * Wrap a site's markup in a complete standalone document.
 * @param {object} site   the site module (tokens, title, description, mode…)
 * @param {{fontCss:string, preload:string[], favicon:string}} assets
 */
import { CLIENT_DATA } from "./aether.mjs";
import fs from "node:fs";
const TW_DIR = new URL("../../lib/", import.meta.url);
const TW_JS = fs.readFileSync(new URL("tweaks.js", TW_DIR), "utf8");
const TW_CSS = fs.readFileSync(new URL("tweaks.css", TW_DIR), "utf8");

export function page(site, { fontCss, preload }) {
  const t = site.tokens;
  const favicon = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='${t.bgPrimary}'/><circle cx='16' cy='16' r='7' fill='${t.accent}'/></svg>`
  )}`;
  return `<!doctype html>
<html lang="${site.lang || "en"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(site.title)}</title>
<meta name="description" content="${esc(site.description)}">
<meta name="theme-color" content="${t.bgPrimary}">
<meta name="color-scheme" content="${site.mode === "light" ? "light" : "dark"}">
<link rel="icon" href="${favicon}">
${preload.map((f) => `<link rel="preload" href="fonts/${f}" as="font" type="font/woff2" crossorigin>`).join("\n")}
<style>
${fontCss}
:root{--bg-primary:${t.bgPrimary};--bg-secondary:${t.bgSecondary};--accent:${t.accent};--on-accent:${t.onAccent};--text-primary:${t.textPrimary};--text-muted:${t.textMuted};--line:${t.line};--font-display:${t.display};--font-body:${t.body}}
${BASE_CSS}
${TW_CSS}
/* ——— ${site.name} ——— */
${site.css}
</style>
</head>
<body>
<a class="k-skip" href="#main">Skip to content</a>
${site.body}
<script>window.AE = ${JSON.stringify(CLIENT_DATA)};</script>
<script>${RUNTIME}</script>
<script>window.AE_FONTS = ${JSON.stringify(site.tweakFonts || [])};</script>
<script>${TW_JS}
AetherTweaks.init({ fonts: window.AE_FONTS, key: "aether-tweaks:" + location.pathname });</script>
<script>
${site.js}
</script>
</body>
</html>
`;
}
