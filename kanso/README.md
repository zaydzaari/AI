# Kanso — the selected Aether website

The complete standalone website, with a shared architectural hero and three fully implemented body directions. **Ledger is the default.**

## Run

From the repository root:

```sh
npm run dev
```

Open **http://localhost:4330/**. Compare the three versions at **http://localhost:4330/directions/**:

- `/directions/ledger/` — a sticky chapter index and measured editorial columns.
- `/directions/drawing/` — open drawing sheets with a precise border rhythm.
- `/directions/plates/` — full-width editorial spreads and larger image-led sections.

Kanso can also be copied out of this repository and run on its own:

```sh
cd kanso
npm run build
npm start
```

Node.js 20 or newer is required. Building and serving use Node's standard library. The first build downloads Google Fonts through `curl` and caches them in `src/.cache/`. The built website makes no external font, image or API requests.

`dist/` contains the complete deployable static website, including the comparison page. Relative asset paths work on all layout routes. Nothing in this build changes or deploys the original collection or the Next.js design lab.

## What's finished

- Manrope variable typography, restrained forest-green accents, mineral surfaces and readable secondary text.
- Responsive generated artwork: a dedicated wide desktop hero, a mobile composition, Pavilion in the platform section and Monolith in the closing section. Original images and generation prompts are retained in `hero-options/`.
- A time-based damped pointer spring that stops when settled, offscreen or hidden. Touch devices do not depend on hover; reduced motion disables physics and pinning.
- A shorter scroll-driven model architecture, with meaningful context heights and a working request-cost slider.
- A model/mode selector linked to complete cURL, TypeScript and Python examples, keyboard-operable tabs and a copy button with feedback.
- Model catalogue filters, selection from the catalogue, usage receipts and a token-cost calculator with caching and context-limit feedback.
- Phone navigation with keyboard focus management, FAQ disclosures, real in-page navigation and no placeholder testimonials.
- A separate three-direction review page with independent side-by-side previews. Design controls are optional: add `?tweaks` to any full-size site URL. Fonts, colors and motion defaults are already applied in source.

## Edit

| File | Purpose |
| --- | --- |
| `src/site.mjs` | Site content, markup and shared layout definition |
| `src/design.css` | Permanent typography, color, spacing, responsive layouts and motion |
| `src/interactions.js` | Model selection, code samples, calculator, navigation and spring physics |
| `src/content.mjs` | Clearly illustrative model data and rates |
| `src/shell.mjs` | Small static document wrapper and optional editor loading |
| `src/directions.mjs` | Three-layout review and comparison page |
| `src/assets/` | Responsive production WebP images |
| `build.mjs` | Self-contained static output and font preparation |
| `verify.cjs` | Browser regression suite |

## Verify

Only the browser checks need dependencies. From this folder:

```sh
npm ci
npx playwright install chromium
npm run verify
```

Start the local server before verification. The suite covers seven viewport widths for every direction, model-mode availability, complete code examples, copy behavior, independent cost arithmetic, filtering, mobile navigation, spring behavior, reduced motion, assets and WCAG A/AA checks. Screenshots and machine-readable results are written to ignored `shots/`.

The repository's design audit also covers all three directions:

```sh
npm run slop -- kanso kanso-drawing kanso-plates
```

All model identifiers, rates and plans are illustrative. The API endpoint uses the reserved `.example` domain. There is no active inference, account system, checkout or billing in this design preview.
