// Build Kanso: node kanso/build.mjs   →   kanso/dist/index.html (+ fonts)
// dist/ is a complete static site: deploy the folder as-is, or open dist/index.html directly.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./src/shell.mjs";
import { fontFaces } from "./src/fonts.mjs";
import site from "./src/site.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");
fs.mkdirSync(DIST, { recursive: true });

// The page's own faces.
fs.rmSync(path.join(DIST, "fonts"), { recursive: true, force: true });
const { css, files } = fontFaces(DIST, site.fonts);

// Alternatives for the Tweaks panel's font menus (loaded only when picked).
const ALT = [
  { family: "Unbounded", axes: "wght@600" },
  { family: "Archivo Black" },
  { family: "Bricolage Grotesque", axes: "wght@700" },
  { family: "Familjen Grotesk", axes: "wght@600" },
  { family: "Big Shoulders Display", axes: "wght@800" },
  { family: "JetBrains Mono", axes: "wght@400" },
  { family: "Space Mono", axes: "wght@400" },
  { family: "Hanken Grotesk", axes: "wght@400" },
];
fs.rmSync(path.join(DIST, "alt"), { recursive: true, force: true });
const alt = fontFaces(path.join(DIST, "alt"), ALT, "alt/fonts/");
const tweakFonts = [];
for (const m of alt.css.matchAll(/font-family:"([^"]+)";font-style:normal;[^}]*?src:url\(([^)]+)\)/g)) {
  if (!tweakFonts.some((f) => f.name === m[1])) tweakFonts.push({ name: m[1], url: m[2], style: "normal" });
}

fs.writeFileSync(path.join(DIST, "index.html"), page({ name: "Kanso", mode: "light", ...site, tweakFonts }, { fontCss: css, preload: [files[0]] }));
console.log(`built kanso/dist/index.html  (${files.length} font files, ${tweakFonts.length} Tweaks alternatives)`);
