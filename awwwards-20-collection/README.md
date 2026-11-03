# Awwwards 20 Collection: Aether, twenty ways

There are twenty standalone landing pages, and every one sells the same product. That product is **Aether** (a placeholder brand): an AI platform selling model access and API tokens. It covers:

- five model families;
- low-refusal and abliterated variants;
- unified chat;
- coding agents;
- long context;
- prompt caching;
- transparent per-token pricing.

The 20 blueprints supply visual language only. Models, rates and quotes are mock data, and every page says so in its footer.

## Run it

From the repository root:

```bash
npm run collection
```

Then open http://localhost:4320/. That's the Master Exhibition Gallery, where you can:

- filter by mode and sort by accent hue;
- preview the desktop and mobile hero of each site;
- inspect each site's 60-30-10 tokens, with contrast ratios, and its font pairing;
- open any site in one click.

The server only listens on `127.0.0.1`. Set `HOST=0.0.0.0` to share it on your LAN.

Every page is a single self-contained `index.html` with self-hosted fonts. You can also open the files directly from disk.

## Rebuild and verify

```bash
npm run collection:build
```

```bash
npm run collection:verify
```

- **`build`** regenerates all 20 pages, the gallery and `fingerprint-registry.json`. Pass ids to rebuild only some: `node awwwards-20-collection/_build/build.mjs 07 12`. The build stops if the uniqueness law is broken.
- **`verify`** needs the server running on port 4320 and Playwright installed: `npm i -D playwright`, then `npx playwright install chromium`. It checks every page at 1440×900, at 375×667, and with reduced motion. The checks are:
  - zero console errors and zero failed requests;
  - no horizontal overflow;
  - all five hero parts, including the primary CTA, inside the first viewport;
  - banned fonts, and that the registry fonts actually load;
  - H1 scale and tracking, body size, line height and measure;
  - card padding, section spacing and grain;
  - dead anchors;
  - WCAG AA contrast, checked with axe.

  Add `--previews` to refresh the gallery images, or `--no-shots` to skip contact sheets.

## Layout

| Path | What it is |
| --- | --- |
| `NN-name/index.html` | A built site (do not edit by hand) |
| `NN-name/fonts/` | That site's self-hosted woff2 subset |
| `NN-name/preview*.jpg` | Gallery previews written by `verify --previews` |
| `index.html`, `fonts/` | The exhibition gallery |
| `fingerprint-registry.json` | The fingerprint of every site (fonts, 60-30-10, hero, signature) |
| `_build/registry.plan.mjs` | The registry and the uniqueness law |
| `_build/aether.mjs` | Shared product content and mock data (change the brand name here) |
| `_build/lib.mjs` | The Design DNA baseline CSS and the small browser runtime (`window.K`) |
| `_build/sites/NN.mjs` | Source for each site: tokens, CSS, markup and signature script |
| `_build/gallery.mjs` | Source for the gallery |
| `_build/drafts/`, `*/index.backup.html` | Earlier drafts, kept for reference |

## The laws

- **Uniqueness:** no two sites share a heading font, an accent colour, a hero structure or a signature scroll mechanic.
- **Type:**
  - H1 is `clamp(3.25rem, 6vw, 5rem)` with −0.03em tracking.
  - Body text is 1.05rem with a line height of 1.7, and no wider than 65ch.
  - Inter, Roboto, Open Sans, Lato, Arial and system fonts are banned.
- **Colour:**
  - Each site is a 60-30-10 token system.
  - The accent appears only on CTAs, active nav and live data.
  - Contrast meets WCAG AA.
- **Space:**
  - Sections are 120px apart (72px on mobile).
  - Blocks are 64–80px apart.
  - Cards have 36–40px of padding.
  - Grain sits on top at 0.035 opacity.
- **Hero:** five parts above the fold:
  - headline;
  - sub;
  - one magnetic CTA;
  - an interactive procedural visual;
  - a concrete trust signal.
- **Story:** seven sections:
  1. Hero.
  2. Problem, plus the signature mechanic.
  3. Benefit bento.
  4. A pinned three-step rail.
  5. Role-based proof.
  6. Pricing with per-token rates.
  7. Final CTA.
- **Motion:**
  - Reveals are vertical only, with 80ms staggers.
  - Spotlight and magnetic effects apply to fine pointers only.
  - Only transform, opacity, clip-path and filter are animated.
  - Loops pause when off screen.
  - Reduced motion unpins everything.

## Font substitutions

Some blueprint fonts are not on Google Fonts, or would have repeated another site's heading font:

| Site | Font used | Reason |
| --- | --- | --- |
| 05 | Funnel Display | Replaces Clash Display, which is not on Google Fonts |
| 07 | Host Grotesk | Replaces Cabinet Grotesk, which is not on Google Fonts |
| 13 | Urbanist | Replaces Satoshi, which is not on Google Fonts |
| 16 | Sora | The blueprint font repeated an earlier heading font |
| 17 | Gloock | The blueprint font repeated an earlier heading font |
| 18 | Syncopate | The blueprint font repeated an earlier heading font |
| 19 | IM Fell English | The blueprint font repeated an earlier heading font |
| 20 | Big Shoulders Display | The blueprint font repeated an earlier heading font |

`fingerprint-registry.json` records the original blueprint font for each substitution.

Five more fonts changed in the anti-slop pass, because Impeccable lists the originals as overused:

| Site | Font now | Replaced |
| --- | --- | --- |
| 04 | Literata and Albert Sans | Fraunces and Plus Jakarta Sans |
| 06 | Italiana | Instrument Serif |
| 11 | Red Hat Text (body) | Plus Jakarta Sans |
| 12 | Familjen Grotesk | Space Grotesk |
| 15 | Hanken Grotesk (body) | Plus Jakarta Sans |

The five cream backgrounds (sites 02, 04, 08, 15 and 19) also moved to deliberate palettes: stone, lab glass, blush chalk, matcha and porcelain.

## Taste library and Tweaks

- **Taste library:** `inspiration/index.html` groups all 32 directions (20 here and 12 in the lab) into six design families. Each card has "Copy image prompt" and "Copy brief" (aesthetic, reference, intent, guardrails). There's also a drop zone for your own screenshots.
- **Tweaks:** every page has a Tweaks pill in the bottom-right corner (Shift+T). It changes fonts, sizes, colours, motion and grain live, and **Copy settings** exports what you changed. The code is in `../lib/tweaks.js` and `../lib/tweaks.css`, inlined at build time.
