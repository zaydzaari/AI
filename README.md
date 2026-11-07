# Aether Agent — Frontend

The complete Aether frontend includes the personal-agent landing page, developer documentation, customer workspace, playground, agent demo, model explorer, API key management, usage and spending, proposed plans, settings, and owner console.

All accounts, credits, API keys, AI responses, approvals, and owner controls are explicitly simulated. There is no live authentication, model gateway, database, checkout, or billing service. The owner routes are presentation-only and do not provide real access control.

## Collaborator quickstart

Install Node.js 20.9 or newer, then run:

```bash
git clone --branch aether-complete-frontend https://github.com/zaydzaari/AI.git
cd AI
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Open [the landing page](http://127.0.0.1:3100), [customer dashboard](http://127.0.0.1:3100/dashboard), [customer spending](http://127.0.0.1:3100/dashboard/spending), [owner console](http://127.0.0.1:3100/owner), or [developer documentation](http://127.0.0.1:3100/docs). The original concept gallery remains at `/designs`.

Validate changes with `npm run build` and `node --test tests/studio.test.cjs`. See [FRONTEND_HANDOVER.md](FRONTEND_HANDOVER.md) for every application route, demo interaction, mock data location, and future integration point. The [Unslop review](docs/UNSLOP_DESIGN_REVIEW.md) records the current application design direction.

The other design collections already in the repository are retained. The ZIP archive is an older snapshot; use the source on this branch for the complete application.

## Earlier design-lab notes

## Simplified direction — 3 November 2026

All twelve concepts have been shortened around their product examples, model choices, pricing and access form. Repeated feature grids, placeholder testimonial sections and pinned scrolling rails have been removed. Heavy decorative effects have been replaced with quieter compositions. The gallery previews reflect this pass.

See [DESIGN_RULES.md](DESIGN_RULES.md) for the reference sites, recent reading, and the rules for future edits. The v2 notes below describe the earlier exploration; the downloaded repository archive retains that version.

Twelve complete, working landing-page directions for **Aether** (a placeholder brand for an AI platform), plus a gallery for previewing and comparing them.

This is a **frontend design exploration**. Nothing is deployed, and every page sets `noindex`. All product data is mock data.

---

## Run it

Requirements: **Node.js 20.9 or newer** (Next.js 16).

```bash
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Then open **http://127.0.0.1:3100**. It opens the personal-agent landing page. The gallery is at **http://127.0.0.1:3100/designs**.

For a production build:

```bash
npm run build
npm start
```

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


## Video workflow studio

All twelve local concepts now have three compositions and live design controls. Open `/designs/variations` to compare them and `/designs/inspiration` for the requested reference library, reusable briefs and four custom image directions. See [the workflow notes](docs/VIDEO_WORKFLOW.md). Settings stay in this browser or an exported JSON file; no backend is connected.

Validation: `node --test tests/studio.test.cjs`, `npx tsc --noEmit`, `npm run build`.
