# Kanso: the Aether landing page

This folder is the chosen direction, now a standalone site. It started as site 02 of the Awwwards 20 collection and is developed here on its own, so changes in this folder never affect the collection.

**Aether** (a placeholder name) sells model access and API tokens:
- five model families;
- standard, low-refusal and abliterated variants;
- unified chat;
- coding agents;
- prompt caching;
- per-token pricing.

Models, rates and testimonials are mock data and are labelled as such on the page.

## Run it

From the repository root:

```bash
npm run kanso:build
```

```bash
npm run kanso
```

Then open http://localhost:4330/. The server only listens on `127.0.0.1`.

`kanso/dist/` is the complete static site. You can deploy that folder as it is to any static host, or open `dist/index.html` straight from disk.

## Check it

```bash
npm run kanso:verify
```

This needs Playwright (`npm i -D playwright`, then `npx playwright install chromium`). It checks the page at 1440×900, at 375×667 and with reduced motion:
- no console errors or failed requests;
- no horizontal overflow;
- all five hero parts above the fold;
- the type, spacing and font rules;
- WCAG AA contrast, checked with axe.

The anti-slop audit, `npm run slop -- kanso`, applies Impeccable's rules to the page.

## Files

| Path | What it is |
| --- | --- |
| `src/site.mjs` | The page itself: tokens, CSS, markup and interactions. Edit this file. |
| `src/content.mjs` | Product content and mock data: brand name, models, rates, plans, quotes. |
| `src/shell.mjs` | Document wrapper, baseline design rules (type scale, spacing, grain, reveals) and the small runtime. |
| `src/tweaks.js`, `src/tweaks.css` | The weighted hero load-in, the hero exit fade and the Tweaks panel. |
| `src/fonts.mjs` | Self-hosts Google Fonts into `dist/fonts/`. |
| `build.mjs` | Writes `dist/index.html`. |
| `verify.cjs`, `serve.mjs` | Checks and a local server. |

## What's on the page

The page follows the project's seven-section structure:

1. **Hero:** the headline, a concrete pavilion whose light follows the pointer, and the "Get your API key" slab.
2. **Method:** the problem, then the signature. Five monoliths rise from the drawing as you scroll. Each one's height is its context window and its shadow is the cost of a request; a slider changes the request size.
3. **Platform:** a concrete bento of the six features.
4. **Developers:** three sheets to production, on a pinned horizontal rail.
   - **A-01:** build a model string from a family and a temperament.
   - **A-02:** see that string in cURL, TypeScript and Python.
   - **A-03:** read the sample usage receipt with its live cost.
5. **Who it's for:** four role-based sheets (placeholder quotes).
6. **Pricing:** the plans, plus the model catalogue with context and per-token rates.
7. **FAQ and final call to action,** then the footer.

The header has a mobile menu, a quickstart link and a secondary "Get API key" button. Every page also has a **Tweaks** panel: click the pill in the bottom-right corner, or press Shift+T. It changes fonts, sizes, colours and motion live, and **Copy settings** exports your changes so they can be made permanent in `src/site.mjs`.
