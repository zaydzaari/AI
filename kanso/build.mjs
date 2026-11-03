// Build Kanso: node kanso/build.mjs   →   kanso/dist/index.html (+ fonts)
// dist/ is a complete static site: deploy the folder as-is, or open dist/index.html directly.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./src/shell.mjs";
import { fontFaces } from "./src/fonts.mjs";
import site, { createSite, LAYOUTS } from "./src/site.mjs";
import { directions } from "./src/directions.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");
fs.mkdirSync(DIST, { recursive: true });

// The page's own faces.
const clearOutput = (name) => {
  const target = path.resolve(DIST, name);
  if (path.dirname(target) !== DIST) throw new Error(`Output escapes dist: ${target}`);
  fs.rmSync(target, { recursive: true, force: true });
};
clearOutput("fonts");
const { css, files } = fontFaces(DIST, site.fonts);

// Alternatives for the Tweaks panel's font menus (loaded only when picked).
const ALT = [
  { family: "Manrope", axes: "wght@400..800" },
  { family: "Public Sans", axes: "wght@400..700" },
  { family: "IBM Plex Sans", axes: "wght@400;500;600" },
  { family: "JetBrains Mono", axes: "wght@400" },
  { family: "Space Mono", axes: "wght@400" },
  { family: "Hanken Grotesk", axes: "wght@400" },
];
clearOutput("alt");
const alt = fontFaces(path.join(DIST, "alt"), ALT, "alt/fonts/");
const tweakFonts = [];
for (const m of alt.css.matchAll(/font-family:"([^"]+)";font-style:normal;[^}]*?src:url\(([^)]+)\)/g)) {
  if (!tweakFonts.some((f) => f.name === m[1])) tweakFonts.push({ name: m[1], url: m[2], style: "normal" });
}

fs.cpSync(path.join(ROOT, "src", "assets"), path.join(DIST, "assets"), { recursive: true });
for (const name of ["tweaks.js", "tweaks.css"]) fs.copyFileSync(path.join(ROOT, "src", name), path.join(DIST, "assets", name));
const writePage = (folder, layout, assetBase) => {
  fs.mkdirSync(folder, { recursive: true });
  const fontCss = css.replaceAll("url(fonts/", `url(${assetBase}fonts/`);
  const fonts = tweakFonts.map((f) => ({ ...f, url: assetBase + f.url }));
  fs.writeFileSync(path.join(folder, "index.html"), page({ name: "Kanso", mode: "light", ...createSite({ layout, assetBase }), tweakFonts: fonts }, { fontCss, preload: [files[0]], assetBase }));
};
writePage(DIST, "ledger", "");
for (const layout of LAYOUTS) writePage(path.join(DIST, "directions", layout), layout, "../../");
fs.writeFileSync(path.join(DIST, "directions", "index.html"), directions(css));
console.log(`Built Kanso: Ledger home, three complete layouts and a comparison page (${files.length} font files).`);
