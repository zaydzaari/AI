# Aether — Design Lab

This repository holds the landing-page work for **Aether**, a placeholder brand for an AI platform that sells model access and API tokens:

1. **The Design Lab:** 12 complete, working directions in Next.js, plus a gallery for previewing and comparing them (documented below).
2. **The Awwwards 20 Collection:** 20 standalone static sites plus a Master Exhibition Gallery, in [`awwwards-20-collection/`](awwwards-20-collection/README.md).
3. **Kanso, the chosen direction:** a standalone site in [`kanso/`](kanso/README.md), developed separately for a big-company launch. Run `npm run kanso:build`, then `npm run kanso` (http://localhost:4330/).

This is a **private, local design exploration**. Nothing is deployed, and every page sets `noindex`. All product data is mock data.

---

## Run it

Requirements: **Node.js 20.9 or newer** (Next.js 16).

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**. It redirects to the gallery at **http://localhost:3000/designs**.

To open the 20-site collection, run the next command and then visit **http://localhost:4320/**:

```bash
npm run collection
```

For a production build:

```bash
npm run build
npm start
```

## v4: the "design genius" workflow pass

Every page in both sets (12 lab concepts, 20 collection sites and the gallery) went through the three steps from Chase AI's video "Turn Claude Into A Design GENIUS In 3 Simple Steps".

**Step 1: a taste library.** `awwwards-20-collection/inspiration/` holds all 32 directions, grouped into six design families. Each family has its vocabulary. Each card has a **Copy image prompt** button and a **Copy brief** button. The brief follows the video's four parts: aesthetic, reference, intent and guardrails. You can also drop in your own Dribbble, Pinterest or X screenshots; they stay in your browser.

**Step 2: tools.**
- **Impeccable** is installed for Claude Code in `.claude/skills/impeccable` (Apache-2.0), with its agents in `.claude/agents/`. Its auto-running design hook is *not* installed: it downloads and runs a binary on every edit, so turn it on yourself if you want it.
- `PRODUCT.md` holds the product context that Impeccable reads.
- `npm run slop` (`scripts/slop-audit.cjs`) is our own Playwright check against Impeccable's rule catalogue, and every page was fixed against it. Impeccable's own CLI couldn't run in the build sandbox.
- The fixes:
  - **Fonts:** replaced every overused face (Fraunces, Geist, Plus Jakarta Sans, Space Grotesk, Instrument Sans and Serif).
  - **Colour:** moved nine cream backgrounds onto deliberate palettes, and removed coloured glows, radial halos, purple gradients and gradient text.
  - **Layout:** deleted the small uppercase labels above headings, and thinned or removed thick coloured side borders.
  - **Type:** shortened 17 headlines to six words or fewer, set an 11px floor for UI text, and fixed skipped heading levels.
  - **Polish:** cut em-dash runs, and themed scrollbars, text selection and the text caret.
- **Higgsfield** (hero images and video) needs your own account. Connect it and the briefs' image prompts are ready to use.

**Step 3: build and iterate.** Every page now has:
- a weighted hero load-in, with parts arriving one by one;
- a soft fade from the hero into the body;
- a **Tweaks** panel. Click the pill in the bottom-right corner, or press Shift+T.

The Tweaks panel changes the heading and body fonts, headline size, tracking and weight, body size, the 60-30-10 colours, load-in and reveal motion, and grain, all live. Tweaks are saved per page. **Copy settings** gives you JSON to paste into a prompt so the changes can be made permanent. The shared code is in `lib/tweaks.js` and `lib/tweaks.css`.

The next step in the video's workflow is yours: **pick one direction**, then ask for three body variations of it.

## v3 — Unified rules, every concept rebuilt

All 12 concepts were rebuilt from scratch (v2 is archived in `components/designs/_archive/v2/`). Each one now has its own composition, its own copy and one signature scroll mechanic tied to the token/API business — no shared body sections.

**One rule set that satisfies every brief at once** (`components/system/kit.css`, `lib/kit.ts`):

- H1 `clamp(3.25rem, 6vw, 5rem)` at `-0.03em`; body 1.05rem / 1.7 at ≤ 65ch; no Inter, Roboto, Open Sans, Lato, Arial or system fonts.
- 60-30-10 tokens on every root (`--bg-primary`, `--bg-secondary`, `--accent`, `--text-primary`, `--text-muted`); the accent appears only on primary CTAs, active nav states and live data readouts.
- Sections 120 px (72 px mobile), block gaps 64–80 px, card padding 36–40 px, fractal grain at 0.035.
- 5-part hero above the fold (headline, sub, one magnetic CTA, interactive visual, concrete trust signal), then problem/solution + signature → feature/benefit bento → 3-step pinned rail → role-based proof (placeholders) → pricing + per-token rates → final CTA + footer.
- `useKit(ref)` wires reveals, 80 ms staggers, spring-physics magnetic CTAs, spotlight cards, the pinned rail, scroll-spy and count-ups; canvas loops pause off-screen; reduced motion disables pinning and scrubbing.

| # | Concept | Signature scroll mechanic |
|---|---|---|
| 01 | Field Notes | Annotated thread: model and temperament switch mid-conversation, live token tally |
| 02 | Graphite | Refusal direction projected out of an activation field |
| 03 | Pearl | One prompt refracted through a prism into five priced answers |
| 04 | Monolith | Width is context: names stretch on Archivo's width axis |
| 05 | Kiln | Agent loop choreography (plan → edit → test → ship) with running cost |
| 06 | Lumen | Laptop opens, camera pushes into the app |
| 07 | Lab Seven | Token-flow Sankey through uncached / cached / routed runs |
| 08 | Observatory | Planisphere: constellations open ephemeris cards at the meridian |
| 09 | Raster | Monthly estimator poster from 1M to 1B tokens |
| 10 | Live Wire | Live router console + docking workspace panels |
| 11 | Obsidian | Scroll-scrubbed token stream with a precise usage meter |
| 12 | Aperture | Full-viewport iris opens into the machine; closing iris finale |

`npm run audit` checks every rule above at 1440×900 and 375×667 (plus contrast via axe). All 12 pass.

## v2 — Master design system

All 12 concepts were rebuilt to a shared master design system. Each keeps its own hero, palette, typefaces and signature interactive pieces.

| Rule | How it's implemented |
|---|---|
| Typography | No Inter, Roboto, Open Sans, Lato, Arial or system sans. Every concept loads its own pairing. H1 is `clamp(3rem, 6vw, 5rem)` with `-0.03em` tracking; body copy is 1.05–1.125rem, line-height 1.7, max 66ch (`.sys-h1`, `.sys-body`) |
| 60-30-10 colour | Each concept defines `--bg-primary` (60), `--bg-secondary` + `--border` (30), and `--accent` (10, used only for primary CTAs, active states and key figures), plus `--text-primary` and `--text-muted` checked for AA contrast |
| Whitespace | Sections have 120px vertical padding on desktop and 72px on mobile, 64–80px between major blocks, and 32–40px inside cards |
| Scroll-craft | IntersectionObserver reveals with staggering, a pinned horizontal "How it works" rail (desktop), spotlight hover on cards, a before/after variant wipe (11), a scroll-opened iris (12) and a scroll-flattened device (06). There are no video assets, so there's no video scrubbing |
| 5-part hero | Outcome headline, specific sub-headline, **one** primary CTA, a purposeful visual, and one trust signal. The hero fits above the fold at 1440×900 and 375×667 |
| Section flow | Problem → solution · Features with benefits (bento) · product demo · How it works (3 steps) · model showcase · role-specific proof · pricing · final CTA · full footer |

Shared pieces live in `components/system/` (`system.css` plus the section components). Each concept's signature components live in `components/designs/dNN/parts.tsx`.

**Honesty notes.** Hero trust signals are true product facts (for example 5 families, 3 temperaments, 1 API), not invented usage numbers. The testimonial cards are clearly labelled placeholders, ready for real beta quotes.

**Originals.** The v1 version of every concept is kept next to it as `DesignNN.backup.tsx` and `dNN.backup.css`. Copy them back over `DesignNN.tsx` and `dNN.css` to restore one.

**Audit.** With the dev server running:

```bash
npm i -D playwright && npx playwright install chromium   # once
npm run audit                      # all 12, desktop 1440×900 + mobile 375×667
node scripts/audit.cjs 03 --shots=./audit-shots   # one design, with screenshots
```

The audit checks hero fit (every hero part above the fold), the single primary CTA (≥44px), banned fonts, H1 scale and tracking, body size, leading and measure, section padding, horizontal overflow, broken requests, console errors and WCAG AA contrast (axe-core).

**Skills.** `.claude/skills/` holds the project-level skills used for this pass: `frontend-design` (Anthropic), the UI UX Pro Max set (`ui-ux-pro-max`, `design-system` and others, from `ui-ux-pro-max-cli`), and `scrollcraft`, the workspace's scroll-storytelling rule.

## What's inside

| Route | What it is |
|---|---|
| `/designs` | Gallery: 12 cards with screenshots (hover pans down the page), filters, full-screen preview, compare picker |
| `/designs/01` … `/designs/12` | The 12 full landing pages |
| `/designs/compare?a=03&b=12` | Two designs side by side (desktop or mobile), with synced scrolling |

### Full-screen preview (from the gallery)
Click any card image. Inside the preview:

- `←` / `→` (or `[` / `]`) — previous / next design
- `1` `2` `3` — desktop 1440 / tablet 768 / mobile 390
- `Esc` — back to the gallery
- A dropdown selector and "Open full page" link are in the top bar

### On each design page
A small switcher sits bottom-left (hidden inside previews and screenshots):

- `[` / `]` or `Shift` + `←` / `→` — previous / next design
- `g` — back to the gallery
- `.` — hide or show the switcher

### Compare
Tick **Compare** on any two gallery cards, then press **Compare** in the bar that appears. You can swap sides, switch between desktop and mobile, and turn scroll sync on or off.

## The 12 concepts

| # | Name | Direction | Mode |
|---|---|---|---|
| 01 | Field Notes | Abracadabra-inspired editorial; the transcript annotates itself | Light |
| 02 | Graphite | Abliteration-inspired technical luxury; cursor-reactive glyph field | Dark |
| 03 | Pearl | Holographic liquid glass; real-time 3D iridescent slabs | Light |
| 04 | Monolith | Architectural minimalism; variable-width type as structure | Light |
| 05 | Kiln | Experimental studio; draggable model shapes, velocity marquee | Mixed |
| 06 | Lumen | Product elegance; scroll-scrubbed device, sticky chapters | Light |
| 07 | Lab Seven | Research lab; live neural graph, interactive abliteration figure | Dark |
| 08 | Observatory | Midnight celestial; orbiting model system, cursor-lit stars | Dark |
| 09 | Raster | Swiss typography; strict grid (toggle it), strip accordion, sortable table | Light |
| 10 | Live Wire | The page is the interface; working console, ⌘K palette, request builder | Light |
| 11 | Obsidian | Ultra-premium dark glass; specular light, variant wipe comparison | Dark |
| 12 | Aperture | Fusion: paper editorial outside, a camera iris that opens into the machine | Mixed |

See **DESIGN_COMPARISON.md** for rationale, scoring, trade-offs and recommendations.

## Changing the brand

Everything brand-related lives in **`lib/content.ts`**:

- `BRAND.name`, `BRAND.domain`, `BRAND.apiBase`, `BRAND.envKey`, `BRAND.taglines`
- `MODELS` — model families, roles, context sizes, variants, sample rates
- `CAPABILITIES`, `PROMPTS` (demo prompts and canned responses), `CODE` (snippets), `PLANS`

Change `BRAND.name` once and every concept updates. Design metadata for the gallery (names, traits, swatches, rationale) is in `lib/designs.ts`.

## Honest labels (please keep)

- **Pricing is illustrative.** Every pricing section is marked "Sample rates for layout only. Final pricing not yet set."
- **Model names, context sizes and capabilities are placeholders**, labelled as such on each page.
- **Chat responses are simulated.** Nothing calls a model. Design 10's console says so when you type a free-form prompt.
- **Forms do nothing.** Email fields are marked "Demo form · nothing is sent."
- No customer logos, testimonials, usage statistics or performance claims were invented.

## Project structure

```
app/
  layout.tsx                 root layout (Inter + JetBrains Mono, noindex)
  page.tsx                   redirects / → /designs
  designs/page.tsx           gallery
  designs/compare/page.tsx   compare view
  designs/(concepts)/
    layout.tsx               MotionConfig (respects reduced motion) + design switcher
    template.tsx             fade transition between designs
    01 … 12/page.tsx         each route loads its own fonts + stylesheet
components/
  lab/                       Gallery, PreviewStage, Compare, ScaledFrame, DesignDock, MotionRoot
  designs/dNN/               one folder per concept: DesignNN.tsx + dNN.css (+ helpers)
lib/
  content.ts                 shared brand + mock product data
  designs.ts                 gallery metadata
  hooks.ts                   streaming text, chat demo state, copy, in-view
public/previews/             gallery screenshots (NN-tall.jpg, NN-desktop.jpg, NN-mobile.jpg)
scripts/screenshots.cjs      regenerates screenshots with Playwright
```

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, Motion for React, Lucide icons, Three.js + React Three Fiber (design 03). Fonts are self-hosted through `@fontsource`, so nothing loads from Google at runtime.

## Motion and accessibility

- `prefers-reduced-motion` is respected: Motion is configured with `reducedMotion="user"`, CSS animations collapse, canvas fields draw a single static frame, and streaming text appears instantly.
- Canvas and WebGL scenes pause when off-screen.
- Interactive controls are real buttons, links, inputs or sliders with labels, and keyboard focus is visible.

## Regenerating gallery screenshots

The gallery uses images in `public/previews/`. To refresh them after changing a design (with the dev server running):

```bash
npm i -D playwright
npx playwright install chromium
npm run screenshots            # all 12
node scripts/screenshots.cjs 03 07   # just some
```

If a screenshot is missing, the gallery falls back to the palette swatches.
