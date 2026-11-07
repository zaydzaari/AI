# Local design studio review

Reviewed 3 November 2026. All work remains in the downloaded local project.

## Browser checks

- 36 compositions at 1440px and 36 at 390px: no positive document overflow, broken primary/footer anchors or duplicate IDs. Each has one main title.
- 36 compositions at 768px: no document overflow; one main title and at most two title lines.
- Two narrow desktop rail headings were reduced after the first pass. The type controls continue to scale that composition.
- All twelve A/B/C boards were inspected as settled, rendered previews. Their captures are in `../../review/studio-boards`. The earlier rapid captures in `studio-desktop` may show a pre-hydration frame for B/C; use the settled boards for visual comparisons.
- Font and motion controls apply to the actual page. An exported configuration was imported through the real file input, survived refresh, and reset correctly. Escape closes the controls and returns focus to Tweak. The optional paper image loaded successfully.
- Reference filters show the expected sites. Local reference images load. Z.ai captures use the signed-out application, without personal history or a saved prompt.
- Preview forms, API requests, research charts and model responses remain explicitly demonstrative.

Measurements are retained in `../../review/studio-desktop-checks.json`, `studio-mobile-checks.json` and `studio-tablet-checks.json`. A negative raw overflow reading in the first two files means space occupied by the browser scrollbar, not overflow.

## Source and craft review

Four settings tests cover malformed URL/import data, CSS/resource injection attempts, numeric bounds, JSON round trips and complete three-composition coverage. TypeScript and the production build pass.

The Impeccable detector was run once over the changed UI areas. Active-source findings were seven font warnings, two legacy gradient-text rules and one unused grid rule. The legacy decorative rules were removed. The fonts are deliberate existing concept identities, with local alternatives in the studio. Backup source is retained and was excluded from the interpretation of findings.

Taste's source lint was also run. Its thin-rule and overlay-shadow flags include the editing tools, actual form controls and model-index rows. Those follow application conventions; they are not marketing ornaments. Unnecessary poster/library divider rules were removed and new viewport roots use `100svh`. This is an adapted use of the guidance, not a claim of zero house-style flags or of having run Taste's independent browser inspector. Browser inspection used the available computer-use interface.

## Final critique

The subject is clear in the first screen, and the product example carries each direction. The three compositions now change hierarchy as well as geometry; model-led alternatives promote the model section. Body layouts retain the useful registry, experiment, comparison and pricing tools. The main remaining production limitation is content truth: Aether's model names, capabilities and pricing need real product data, and signup needs a backend before launch.

My strongest general direction is **01 A, Field Notes**: a short claim and an annotated conversation have a specific visual reason to be together. **03 B, Pearl** is the closest alternative to the quiet, product-first Z.ai reference. This is an editorial judgment, not a measured conversion result.
