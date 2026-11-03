# Design Comparison — Aether, 12 directions

This document records what was taken from the two reference sites, the reasoning behind each concept, a scored comparison, and recommendations. The scores are a design judgement, not measurements. They are there to make the trade-offs explicit, not to settle the decision.

> **v2 update.** All 12 concepts have since been rebuilt to the master design system (see README → "v2 — Master design system"). The rationale and scores below describe each concept's *identity*, which v2 keeps: hero, palette, type and signature interactions.
>
> **Trade-off:** v2 trades structural variety for consistency. Every page now follows the same section order with shared problem, bento, steps, proof and pricing components, and accents are confined to CTAs. As a result the concepts differ mainly in their hero and signature sections. If you pick a winner, the next step is to give that one concept bespoke versions of the shared sections.
>
> **Score changes in v2:** 05 Kiln lost most of its colour blocking under the 60-30-10 rule. 04, 08 and 09 lost their oversized display headlines to the 5rem H1 cap; 04 kept its wordmark as a decorative visual. Recommendations are unchanged: 12, 07, 10.

---

## v3 update (latest)

Every concept was rebuilt to the unified rule set (see README → v3). What changed in judgement:

- **Distinctness is back.** v2 had converged on shared body sections; v3 gives each concept its own sections and a signature mechanic that explains part of the business: temperaments (02), comparison (03), context (04), agents (05), caching and routing (07, 09), discovery (08), metering (01, 11), the live router (10).
- **Top three remain Aperture (12), Lab Seven (07) and Live Wire (10)**, with Graphite (02) now a close fourth: its refusal-direction projection is the most credible explanation of abliteration in the set.
- **Trade-offs:** Kiln (05) and Aperture (12) are the most memorable and the most expensive to maintain; Raster (09) and Lumen (06) are the clearest but the least ownable; Observatory (08) and Pearl (03) depend on their metaphor staying legible on phones.
- **Still true:** all model names, rates and testimonials are placeholders, and nothing was tested on real GPUs, Safari or Windows.

## Awwwards 20 Collection

The 20 static sites in `awwwards-20-collection/` sell the same Aether product as the lab. Each has a unique heading font, accent colour, hero structure and signature mechanic, and the build enforces that. Open the exhibition gallery with `npm run collection` (http://localhost:4320/) to compare their tokens, fonts and previews side by side.

**Picks from the 20 (design judgement, not measurement):**

1. **20 Zenith Supersonic: the clearest product story.** The itinerary globe follows one conversation across five models, and a running fare ticks up beside it. It shows unified chat, model choice, prompt caching and per-token cost together. **Trade-offs:** the airline metaphor could read as a travel brand without the copy. The split-flap board is about 220 animated DOM cells, which is fine on desktop but worth profiling on low-end phones.
2. **19 Atelier Kintsugi: the strongest light identity.** "Look beneath every answer": a loupe reveals the tokens and the per-line cost under a response. It makes transparency feel crafted rather than technical. **Trade-offs:** the manuscript serif is the least "developer tool" voice in the set. The inspection metaphor needs its caption to land.
3. **18 Lumina: the best single explainer.** Buffered and streamed token lanes make streaming obvious in one scroll. **Trade-offs:** Syncopate's wide capitals are tiring in long text, so a production version would keep them to headlines.

**Worth borrowing:** 02 Kanso's context monoliths with cost shadows, the calmest way to show context size against price, and 12 Forma's configurator, the most direct "build your plan" interaction.

**Collection QA:** every page passes `node _build/verify.cjs` at 1440×900, at 375×667 and with reduced motion. The checks are:
- no console errors or failed requests;
- no horizontal overflow;
- all five hero parts above the fold;
- fonts, type scale, spacing and grain rules;
- axe AA contrast.

The verifier ran in headless Chromium only: no Safari, Firefox, real GPUs or touch hardware.

## 1. Reference study

Both sites were loaded in a real Chromium browser (Playwright) at 1440 × 900. I scrolled through the full length of each page, captured viewport screenshots every 900 px, and read the computed fonts and colours. That covered roughly 6,400 px of tryabracadabra.com and 11,300 px of abliteration.ai. I did not test their behaviour on mobile, and I did not reverse-engineer their animation code.

### Reference A — tryabracadabra.com

| Observed | Principle extracted |
|---|---|
| The hero's right half is the actual product, a conversation replay with turn numbers, a step status ("failed", "incomplete") and a side panel of signals | **Lead with the product, not an illustration.** Credibility comes from showing a real interface doing a real job. |
| One typeface (Outfit) at 800 weight with very tight tracking for headlines; light 300 weight body | **One confident family, big weight contrast.** Hierarchy comes from weight and size, not from more fonts. |
| Warm cream page, near-black ink, a small set of flat accents (vermilion, orange, mustard, teal, navy, plum) | **A warm, editorial palette** reads as human and considered rather than "tech". |
| Panels with 2–3 px black outlines and hard offset shadows; a diagonal multicolour stripe band | **Graphic, print-like framing** gives UI screenshots the feel of illustrations. |
| Alternating full-bleed bands: dark dotted-grid section, red statement band, pale blue chart section | **Section rhythm through colour blocks.** Each band changes mood without new layout tricks. |
| Charts explicitly captioned "Illustrative data" | **Honesty labels increase trust**, which directly informed how mock data is labelled here. |
| Two-column "Take a closer look" cards that mix UI fragments and copy | **Every card carries a piece of product**, not an icon. |

### Reference B — abliteration.ai

| Observed | Principle extracted |
|---|---|
| A split headline: the first phrase top-left, the second right-aligned lower down, across the full width | **Composition as statement.** The layout itself carries tension. |
| A generative field of short ticks and slashes in peach and blue that changes direction across the hero | **Texture that implies computation**, used as atmosphere rather than as a gimmick. |
| A neo-grotesk (Aspekta) at 500 weight for display, with JetBrains Mono for code; small uppercase eyebrows such as "ONE-LINE SETUP" and "POLICY GATEWAY" | **Documentation-flavoured hierarchy.** It reads like a well-designed API reference. |
| Misty, desaturated photographs with crisp UI cards (code, policy tables) floating on them | **Atmospheric plate + sharp product card** is how the site makes technical details feel premium. |
| SDK tabs (OpenAI / Anthropic) with highlighted base URL and key | **"Change one line" developer story**, with the minimum diff highlighted. |
| A giant "0" numeral beside "Prompts stored / Outputs logged / Training signal used" | **One huge numeral as a statement** about a policy. |
| Dark pill buttons with a blinking caret | **Small, terminal-like micro-details** signal engineering care. |

### What was deliberately *not* copied
No logos, artwork, photographs, copy, exact layouts or animation sequences. Design 01 borrows Abracadabra's *product-as-hero* and *editorial warmth*, but swaps outlined panels and offset shadows for ruled paper, margin annotations and serif marginalia. Design 02 borrows Abliteration's *split headline, generative texture and SDK story*. Its field is built from monospace glyphs that react to the cursor, its plate is a CSS-generated fog rather than photography, and it uses a dark palette and different typefaces.

---

## 2. Concepts and rationale

**01 · Field Notes** (light)
An annotated field journal. The hero transcript has red serif marginalia that draw themselves in. The capability index has a sticky note card. A pinned scroll story shows one thread passing through three models. Model cards are "specimens" with log-scale context bars. The API block has hoverable margin notes per line, and the pricing ledger includes a cost estimator.
*Why:* it is warm, legible and product-first, and the most beginner-friendly of the credible options.
*Risk:* it is the closest in spirit to Reference A.

**02 · Graphite** (dark)
A developer console with restraint. A glyph-field hero bends toward your cursor. Capabilities are presented as a docs page, and a playground shows that variants are a model-name suffix. There's an expandable model registry, a "change one line" SDK plate and a giant "1 key" pricing statement.
*Why:* it has the strongest developer credibility per pixel.
*Risk:* it shares a niche with Reference B (abliterated models), so the resemblance could be read as following a competitor.

**03 · Pearl** (light)
Luxury consumer tech. Three iridescent 3D glass slabs stand for Standard, Low-refusal and Abliterated, and they fan apart as you scroll. It has a floating glass navigation bar, a drag-scroll capability rail, a tilt-on-hover chat window and a "skyline" of glass columns sized by context window.
*Why:* it is aspirational and soft.
*Risk:* it is the most decorative concept, it is the heaviest to render on low-end devices, and the 3D needs art direction to justify itself.

**04 · Monolith** (light)
Typography is the architecture. The wordmark's letters change width as the cursor moves, and capability rows expand from condensed to extended on hover. A 200 px index column runs the full page, with one orange accent and a "BEGIN." block.
*Why:* it looks timeless and expensive, and it is cheap to build and maintain.
*Risk:* it could be any premium brand; little of it says "AI".

**05 · Kiln** (mixed)
An awards-style studio direction. Draggable model "stickers" sit in the hero beside a morphing coral shape. It has a velocity-reactive marquee, a mosaic of colour-block tiles that morph shape on hover, and "The remix", which shows one prompt answered in three temperaments. There's also a fan-out model deck and a custom magnetic cursor.
*Why:* it is the most memorable, playful and shareable concept.
*Risk:* it is the least enterprise-safe. The wide Syne display face needed careful sizing on small screens.

**06 · Lumen** (light)
Product elegance. A device rendered at a tilt flattens as you scroll. Sticky chapters (Chat, Agents, Compare) swap the device screen as you read. There's a bento-style highlights grid, a three-column model comparison with selectors, and black developer and white pricing sections.
*Why:* it is the clearest and most accessible concept, easy for anyone to understand.
*Risk:* it is the least distinctive; it borrows a well-known consumer-tech grammar.

**07 · Lab Seven** (dark)
A research organisation. A live neural graph has hoverable units and travelling pulses. **Fig. 2 is an interactive abliteration experiment**: drag "ablation strength" and the activations collapse off the refusal direction while the simulated output flips from refusal to completion. There's a scientific model table, a request-trace waterfall showing prompt caching, and a terminal-style CTA.
*Why:* it is the only concept that *explains* the product's core differentiator honestly.
*Risk:* it can feel cold to casual users.

**08 · Observatory** (dark)
Celestial and premium. A star field lights up and draws constellations around the cursor, over a planetary limb horizon. The eight capabilities form a constellation. Model families orbit at distances set by their context window, and you can hover a body to inspect it. Pricing plans are drawn as moon phases.
*Why:* it is very ownable and emotionally strong.
*Risk:* the metaphor must stay legible; it is the most "brand" and the least "tool".

**09 · Raster** (light)
International Typographic Style. A strict 12-column grid with a **Grid toggle** that overlays the columns. Section numbers are oversized, count-up figures are kept to true mock facts (5 families, 3 variants, 1 endpoint), and capabilities form an eight-strip horizontal accordion. The demo has a live cost readout and the model table is sortable.
*Why:* it is rigorous and credible, and it adapts to any future brand colour.
*Risk:* it can feel austere, and the motion is intentionally minimal.

**10 · Live Wire** (light)
The hero is a working console. Type anything and a **contextual model selector** suggests Forge for code, Atlas for large documents, Unbound for edgier fiction and Swift for short tasks. Side panels track context, cached prefix and next-turn cost. It has a ⌘K command palette, live capability widgets, an API request builder that writes the cURL for you, and a usage slider that suggests a plan.
*Why:* it is the most conversion-oriented concept; visitors use the product before they sign up.
*Risk:* its visual identity is lighter, and it pays off most once real inference is connected.

**11 · Obsidian** (dark)
Luxury hardware. Machined glass surfaces carry a specular highlight and a bevelled edge that follow the cursor, with titanium gradient type and hardware-key capability buttons. **A before/after wipe** compares a standard model against an abliterated one on the same fiction prompt.
*Why:* it is premium and serious, warmer than a typical developer tool.
*Risk:* dark glass is a crowded aesthetic in AI right now.

**12 · Aperture** (mixed), the fusion proposal
A warm paper editorial surface with a Fraunces serif. The hero is a **nine-blade camera iris** that opens as you scroll, revealing a dark holographic interior with a live product "specimen". Inside, a kinetic capability index softens its serif when hovered while a glass card follows the cursor. "Three lenses" stand for the three variants. Back on paper there's a field guide to the model families, an API card on a dark plate, an editorial pricing grid and an "Open the aperture" CTA.
*Why:* it fuses Abracadabra's product storytelling and warmth, Abliteration's technical confidence, a portal visual, liquid glass and distinctive type into one metaphor that *means something*: a readable surface over a deep machine, and choosing how much to open.
*Risk:* it is the most complex to build, and the pinned scroll adds about 1.6 screens of height.

---

## 3. Scored comparison (1–5, design judgement)

| # | Concept | Originality | Memorability | Typography | Animation | Brand identity | Trust | Usability | Mobile | Feasibility | AI-platform fit | **Total /50** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | Field Notes | 3 | 4 | 5 | 4 | 4 | 5 | 5 | 4 | 5 | 4 | **43** |
| 02 | Graphite | 3 | 4 | 4 | 4 | 4 | 5 | 5 | 4 | 5 | 5 | **43** |
| 03 | Pearl | 4 | 4 | 4 | 4 | 3 | 3 | 4 | 3 | 3 | 3 | **35** |
| 04 | Monolith | 4 | 5 | 5 | 3 | 4 | 4 | 4 | 4 | 5 | 3 | **41** |
| 05 | Kiln | 5 | 5 | 4 | 5 | 4 | 2 | 3 | 3 | 4 | 3 | **38** |
| 06 | Lumen | 2 | 3 | 4 | 4 | 2 | 5 | 5 | 5 | 5 | 4 | **39** |
| 07 | Lab Seven | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 4 | 4 | 5 | **42** |
| 08 | Observatory | 4 | 5 | 4 | 5 | 4 | 3 | 3 | 4 | 4 | 3 | **39** |
| 09 | Raster | 3 | 4 | 5 | 3 | 3 | 5 | 5 | 4 | 5 | 4 | **41** |
| 10 | Live Wire | 4 | 4 | 3 | 4 | 3 | 4 | 5 | 4 | 4 | 5 | **40** |
| 11 | Obsidian | 3 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **39** |
| 12 | Aperture | 5 | 5 | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 5 | **45** |

---

## 4. Recommendations

The raw totals put 01 and 02 near the top. I'm **not** recommending either as the final identity, because both sit close to a reference. 02 in particular resembles a company in the same niche (abliterated models), and an original identity matters more for that reason than any single score.

### 1. Aperture (12): the identity to build the brand on
It has the only metaphor that is *about* the product: an approachable surface, a powerful machine underneath, and you decide how far to open it. It works for beginners, because the paper and serif are calm and readable, and for developers, because the interior holds dark technical panels and the API story.
**Trade-offs:** it is the hardest to build well. The iris scroll needs performance testing on low-end Android. The serif-led identity is less "dev tool" than 02, 07 or 10. In production I'd add a "skip intro" anchor and keep the pinned section short.

### 2. Lab Seven (07): the credibility layer
Its interactive abliteration figure is the single most useful piece of content in the set: it explains the differentiator honestly instead of just asserting it. Even if 07 isn't the homepage, its experiment section and model table would strengthen any final direction.
**Trade-offs:** it is dark and dense, so first-time users may bounce. It suits a "How it works" or "Research" page better than the front door.

### 3. Live Wire (10): the conversion engine
It is the fastest path from visitor to "I get it". The contextual model selector and the request builder show what's different about the platform within seconds.
**Trade-offs:** its look is the least distinctive. On its own it could read as "another AI chat UI"; it shines when wrapped in a stronger identity.

### A practical combination
Use **12's identity** (paper, Fraunces, the aperture, three lenses) with **10's working console** as the first section inside the aperture, and **07's abliteration experiment** as the "how it works" section. Every piece already exists as a component in this project.

**Runners-up:** **01 Field Notes** if you want warmth and editorial clarity above all, and **09 Raster** if you want a rigorous system that will age well and take any brand colour.

---

## 5. QA log: what was actually verified

- **Production build** (`next build`): passes; all 17 routes prerender. TypeScript check passes.
- **Screenshots** (Playwright, Chromium) of every design at 1440 × 900 and 390 × 844, scrolled through the full page. I inspected all of them and fixed the problems found:
  - 02, 04, 05 and 09 overflowed horizontally on mobile or desktop: grid children wouldn't shrink, a variable wordmark was too wide, wide display type, and rotated strip labels.
  - 04's wipe reveals never triggered on mobile. The page overflow broke the IntersectionObserver margin; fixed with a vertical-only margin.
  - 03's 3D glass looked grey, and its skyline columns were invisible because they were inline elements.
  - 07 had a hydration mismatch from float precision in an SVG path.
  - 08's orbit diagram rendered too small.
  - 11's abliterated side of the wipe was hidden.
  - 12's iris blades left a gap; rewritten with native SVG transforms.
- **Overflow and console sweep** at 375, 430, 768, 1440 and 1920 px wide: no horizontal overflow and no console errors on any of the 12 pages after fixes.
- **Interactions tested in the browser:** gallery loads all 12 previews; full-screen preview opens, `→` switches design, `3` switches to mobile, `Esc` closes; the compare view loads two designs; the design switcher's `[`, `]` and `g` navigate correctly; design 10's console suggests Forge for a coding prompt and streams a reply, and ⌘K opens the palette; design 07's slider flips the output from refusal to completion.

### Not verified (limitations)
- **Real GPUs and browsers.** The 3D (design 03) and canvas effects were tested only in a headless software renderer, where they run at a few frames per second. They should be smooth on real hardware, but that wasn't measured.
- **Your Windows machine.** The project was built and tested in a Linux environment. `npm install` on Windows fetches the right native binaries, but it wasn't run there.
- **Other browsers.** No Safari or Firefox testing. `backdrop-filter`, `@property` and CSS `mask-composite` may need fallbacks in older browsers.
- **Formal accessibility.** No automated audit was run. Semantics, labels, keyboard access and reduced motion were handled by hand.
- **Visual review of the 768 and 1920 layouts.** These were checked for overflow and errors, not looked at screenshot by screenshot.
