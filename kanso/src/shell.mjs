import { CLIENT_DATA } from "./content.mjs";

export const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const RESET = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--bg-primary);color:var(--text-primary);font-family:var(--font-body);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
h1,h2,h3,h4,p,ul,ol,figure,blockquote,dl,dd{margin:0}
ul,ol{padding:0;list-style:none}
img,svg,canvas{display:block;max-width:100%}
button,input,select{font:inherit;color:inherit}
button{cursor:pointer}button:disabled{cursor:not-allowed}
code,kbd,pre,samp{font-family:var(--font-code,"IBM Plex Mono",monospace)}
h1,h2,h3,h4{overflow-wrap:anywhere;hyphens:manual}
p,li,dd,figcaption{text-wrap:pretty}
::selection{background:var(--accent);color:var(--on-accent)}
.k-skip{position:absolute;left:12px;top:-80px;z-index:10000;padding:10px 16px;background:var(--text-primary);color:var(--bg-primary)}
.k-skip:focus{top:12px}
`;

export function page(site, { fontCss, preload, assetBase = "" }) {
  const t = site.tokens;
  const favicon = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='4' fill='${t.bgPrimary}'/><path d='M7 25V12h5v13m3 0V6h5v19m3 0V14h3v11' fill='none' stroke='${t.accent}' stroke-width='2'/></svg>`)}`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(site.title)}</title><meta name="description" content="${esc(site.description)}"><meta name="theme-color" content="${t.bgPrimary}"><meta name="color-scheme" content="light"><link rel="icon" href="${favicon}">
${preload.map((f) => `<link rel="preload" href="${assetBase}fonts/${f}" as="font" type="font/woff2" crossorigin>`).join("\n")}
<style>${fontCss}
:root{--bg-primary:${t.bgPrimary};--bg-secondary:${t.bgSecondary};--accent:${t.accent};--on-accent:${t.onAccent};--text-primary:${t.textPrimary};--text-muted:${t.textMuted};--line:${t.line};--font-display:${t.display};--font-body:${t.body}}
${RESET}
${site.css}</style></head><body class="${esc(site.bodyClass || "")}"><a class="k-skip" href="#main">Skip to content</a>
${site.body}
<script>window.AE=${json(CLIENT_DATA)};</script><script>${site.js}</script>
<script>
if(new URLSearchParams(location.search).has("tweaks")){
  document.documentElement.classList.add("design-controls");
  const base=${json(assetBase)};
  const style=document.createElement("link");style.rel="stylesheet";style.href=base+"assets/tweaks.css";document.head.appendChild(style);
  const script=document.createElement("script");script.src=base+"assets/tweaks.js";
  script.onload=()=>AetherTweaks.init({fonts:${json(site.tweakFonts || [])},key:"aether-tweaks:"+location.pathname});
  document.body.appendChild(script);
}
</script></body></html>`;
}
