# Workspace audit (Phase 2)

**Scope.** The workspace (`landing_page/`) contains one project: the Aether Design Lab, a Next.js app with **12 landing-page concepts** (`/designs/01`–`/designs/12`), a gallery (`/designs`) and a compare view. There are no other HTML sites, static sites or apps in the folder. All 12 concepts are rebuilt to the master design system. The gallery and compare view are tools, so they keep their layout and only lose banned fonts.

## Shared business context (all 12 concepts)

| | |
|---|---|
| Core goal | Get early-access sign-ups for Aether, a platform that offers several AI model families (standard, low-refusal and abliterated variants) through one chat, coding agents and one API |
| Primary audience | Developers and researchers who want one key for many models and control over refusal behaviour |
| Secondary audience | Writers, hobbyists and everyday AI users who want fewer refusals on legitimate creative work |
| Brand status | Placeholder brand ("Aether"), pre-launch: there are **no real customers, usage numbers, logos or testimonials** to reuse |

## Assets inventory

| Asset type | Found | Treatment in the rebuild |
|---|---|---|
| Logos | None as files. Each concept draws its wordmark as text or inline SVG | Kept inline; brand name still comes from `BRAND.name` |
| Product / team photos | None | None added. No stock photography is introduced |
| Before/after images | None | Before/after *sliders* are only used where two comparable outputs exist (variant comparisons) |
| Background videos | None | No scroll-scrubbed video, because there is no real video asset (scrollcraft §3) |
| Icons | `lucide-react` (SVG) | Kept |
| Fonts | Self-hosted via `@fontsource` | Kept, except banned faces: Inter (06, gallery, root), Inter Tight (08, 09) |
| Screenshots | `public/previews/*.jpg` (gallery thumbnails) | Regenerated after the rebuild |

## Links, CTAs and data

| Item | Current state | Preserved how |
|---|---|---|
| External URLs | Only `https://api.aether.example/v1` (placeholder API base) | Unchanged, in `lib/content.ts` |
| CTAs | All are in-page anchors (`#start`, `#api`, …) or `#` placeholders; forms are demo-only | Every concept keeps one primary CTA to its sign-up section, and demo forms stay labelled "nothing is sent" |
| Stats / business data | None real. Model specs and rates are mock data in `lib/content.ts`, labelled on every page | Kept and still labelled; hero "trust signals" use true product facts only |
| Copy | Taglines, capability copy, prompts, code snippets, plans in `lib/content.ts` | Reused; new copy for problem/solution, benefits, steps and role placeholders added to the same file |

## Per-concept catalogue

| # | Concept | Brand personality | Signature pieces to keep | Rules it currently breaks |
|---|---|---|---|---|
| 01 | Field Notes | Warm, editorial, annotated | Self-annotating transcript, pinned 3-model story, specimen cards, rate ledger | Accent on headline words, low-contrast labels, two hero CTAs, H1 above 5rem |
| 02 | Graphite | Quiet, technical, developer-first | Cursor-reactive glyph field, variant playground, model registry | H1 132px, two hero CTAs, muted text below AA, no trust signal |
| 03 | Pearl | Luxurious, soft, spatial | 3D iridescent slabs, glass chat, glass "skyline" | Holographic text on headings, hero below the fold on desktop, no trust signal |
| 04 | Monolith | Architectural, stark | Width-morphing wordmark, typographic model columns | Wordmark used as the H1 (340px), accent on headline word |
| 05 | Kiln | Playful, art-directed | Draggable model stickers, velocity marquee, remix demo | Multi-colour splash everywhere (not 60-30-10), H1 150px |
| 06 | Lumen | Calm consumer tech | Scroll-scrubbed device, sticky chapters | **Inter (banned)**, device visual below the fold |
| 07 | Lab Seven | Scientific, credible | Neural graph, interactive abliteration figure, request trace | Mint accent on headings, 40% opacity labels below AA |
| 08 | Observatory | Celestial, premium | Star field, orbit system, moon-phase pricing | **Inter Tight (banned)**, H1 176px, accent text glow on headline |
| 09 | Raster | Swiss, rigorous | Grid toggle, strip accordion, sortable model table | **Inter Tight (banned)**, H1 170px |
| 10 | Live Wire | Product-first, alive | Working console, contextual model selector, ⌘K, request builder | No trust signal, H1 76px but hero overflows 667px mobile |
| 11 | Obsidian | Machined luxury | Specular glass, variant wipe slider | Gradient-metal headings, violet + titanium (two accents) |
| 12 | Aperture | Warm surface, deep machine | Scroll-opened iris, kinetic serif index, lenses | Accent on headline word, H1 168px |

## Backups

Before anything was overwritten, each concept's entry files were copied next to the originals:

```
components/designs/dNN/DesignNN.backup.tsx
components/designs/dNN/dNN.backup.css
```

They are not imported anywhere, so they don't affect the build. To restore a concept, copy the two backup files over `DesignNN.tsx` and `dNN.css`.
