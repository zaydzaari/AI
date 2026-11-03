// Self-hosted Google Fonts: downloads the latin subset of each requested family once
// (cached in _build/.cache/fonts), copies the woff2 files into <site>/fonts/ and returns
// @font-face CSS with relative URLs, so every index.html works offline with zero CDN calls.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CACHE = path.join(HERE, ".cache", "fonts");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
fs.mkdirSync(CACHE, { recursive: true });

function get(url, binary = false) {
  const key = crypto.createHash("sha1").update(url).digest("hex").slice(0, 16);
  const file = path.join(CACHE, key + (binary ? ".woff2" : ".css"));
  if (!fs.existsSync(file)) {
    const buf = execFileSync("curl", ["-sSfL", "--retry", "3", "-A", UA, url], { maxBuffer: 32 << 20 });
    fs.writeFileSync(file, buf);
  }
  return binary ? file : fs.readFileSync(file, "utf8");
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * @param {string} siteDir absolute output folder of the site
 * @param {{family:string, axes?:string, text?:string, as?:string}[]} specs
 *   axes uses the css2 syntax, e.g. "ital,wght@0,400;1,400" or "wght@300..700"
 *   text subsets to exact glyphs (used for the CJK seals); `as` renames the family.
 * @param {string} prefix relative URL prefix for the generated src (default "fonts/")
 */
export function fontFaces(siteDir, specs, prefix = "fonts/") {
  const outDir = path.join(siteDir, "fonts");
  fs.mkdirSync(outDir, { recursive: true });
  const files = [];
  let css = "";
  for (const spec of specs) {
    const fam = spec.family.replace(/ /g, "+") + (spec.axes ? ":" + spec.axes : "");
    const url = `https://fonts.googleapis.com/css2?family=${fam}&display=swap` + (spec.text ? `&text=${encodeURIComponent(spec.text)}` : "");
    const sheet = get(url);
    const blocks = [...sheet.matchAll(/(\/\*\s*([\w-]+)\s*\*\/\s*)?@font-face\s*{([^}]*)}/g)];
    const keep = spec.text ? blocks : blocks.filter((b) => b[2] === "latin");
    if (!keep.length) throw new Error(`no latin faces for ${spec.family}`);
    const bySrc = new Map();
    for (const b of keep) {
      const body = b[3];
      const src = body.match(/url\((https:[^)]+)\)/)[1];
      const style = (body.match(/font-style:\s*(\w+)/) || [, "normal"])[1];
      const weight = (body.match(/font-weight:\s*([\d ]+)/) || [, "400"])[1].trim();
      const range = (body.match(/unicode-range:\s*([^;]+);/) || [, ""])[1];
      // Variable fonts return the same file for every weight: copy it once.
      let name = bySrc.get(src);
      if (!name) {
        name = `${slug(spec.as || spec.family)}-${weight.replace(" ", "-")}-${style}${spec.text ? "-sub" : ""}.woff2`;
        fs.copyFileSync(get(src, true), path.join(outDir, name));
        files.push(name);
        bySrc.set(src, name);
      }
      css += `@font-face{font-family:"${spec.as || spec.family}";font-style:${style};font-weight:${weight};font-display:swap;src:url(${prefix}${name}) format("woff2")${range ? `;unicode-range:${range}` : ""}}\n`;
    }
  }
  return { css, files };
}
