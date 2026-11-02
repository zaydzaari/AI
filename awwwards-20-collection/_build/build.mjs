// Build the collection: node _build/build.mjs [01 02 …]   (no ids = every site + gallery)
// Writes <folder>/index.html + <folder>/fonts/*, fingerprint-registry.json and index.html.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { REGISTRY, checkUniqueness } from "./registry.plan.mjs";
import { fontFaces } from "./fonts.mjs";
import { page } from "./lib.mjs";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, "..");
const want = process.argv.slice(2).filter((a) => /^\d\d$/.test(a));

const errors = checkUniqueness();
if (errors.length) {
  console.error("Uniqueness law violated:\n  " + errors.join("\n  "));
  process.exit(1);
}

const built = [];
for (const entry of REGISTRY) {
  const file = path.join(HERE, "sites", `${entry.id}.mjs`);
  if (!fs.existsSync(file)) continue;
  const site = { ...entry, ...(await import(pathToFileURL(file).href)).default };
  // The registry is the single source of truth for the fingerprint fields.
  const t = site.tokens;
  const c = entry.color_system_60_30_10;
  if (t.bgPrimary.toLowerCase() !== c.primary_60.toLowerCase() || t.bgSecondary.toLowerCase() !== c.secondary_30.toLowerCase() || t.accent.toLowerCase() !== c.accent_10.toLowerCase())
    throw new Error(`${entry.id}: tokens drift from the registry colour system`);
  built.push(site);
  if (want.length && !want.includes(entry.id)) continue;
  const dir = path.join(ROOT, entry.folder);
  fs.rmSync(path.join(dir, "fonts"), { recursive: true, force: true });
  const { css, files } = fontFaces(dir, site.fonts);
  const preload = site.preload || [files[0]];
  fs.writeFileSync(path.join(dir, "index.html"), page(site, { fontCss: css, preload }));
  console.log(`built ${entry.folder}  (${files.length} font files)`);
}

const registry = {
  collection: "Awwwards 20 Collection",
  generated: new Date().toISOString().slice(0, 10),
  uniqueness_law: "No two sites share a heading font, accent colour, hero layout structure or signature scroll mechanic. Checked by _build/registry.plan.mjs on every build.",
  sites: REGISTRY.map(({ id, folder, name, industry, mode, aesthetic_movement, heading_font, body_font, blueprint_heading_font, color_system_60_30_10, signature_scroll_mechanic, hero_layout_type }) => ({
    id, folder, name, industry, mode, aesthetic_movement, heading_font, body_font,
    ...(blueprint_heading_font ? { blueprint_heading_font } : {}),
    color_system_60_30_10, signature_scroll_mechanic, hero_layout_type,
    built: built.some((b) => b.id === id),
  })),
};
fs.writeFileSync(path.join(ROOT, "fingerprint-registry.json"), JSON.stringify(registry, null, 2) + "\n");

const galleryFile = path.join(HERE, "gallery.mjs");
if (!want.length && fs.existsSync(galleryFile)) {
  const { buildGallery } = await import(pathToFileURL(galleryFile).href);
  buildGallery(ROOT, built);
  console.log("built index.html (gallery)");
}
console.log(`registry: ${built.length}/20 sites built, uniqueness law holds`);
