# Kanso verification — November 3, 2026

The finished Ledger, Drawing sheets and Full-width plates layouts were built and tested locally in Chromium. Ledger is the default site.

| Check | Result |
| --- | --- |
| Static production build | Pass |
| Responsive geometry | 24 cases passed: each direction at 320, 375, 430, 768, 1024, 1440 and 1920px, plus 844×390 touch landscape |
| Behavioral checks | 165 passed |
| Desktop and real touch-context WCAG A/AA audits | Six audits, zero reported violations |
| Browser exceptions, failed assets and unexpected external requests | Zero |
| Design anti-pattern audit | All three directions clean |
| Comparison page | Both frames open at the body; direction selection and full-size links follow the selection |
| Comparison accessibility and responsive checks | Zero reported violations; no page overflow at 375, 768 and 1440px |
| Standalone QA installation | `npm ci` passed; installed Playwright successfully launched Chromium |
| Image exports | Every production asset matches its source export byte for byte |

## Exercised behavior

The suite checks supported model modes and fallback when a mode is unavailable; propagation to all three code languages; valid JSON and Content-Type in the cURL example; copying a complete Python example to the clipboard; receipt and estimator arithmetic against independent expected values; caching savings; context-window feedback; model filtering and selection from the catalogue; keyboard language tabs; FAQ expansion; phone-menu opening, closing and focus return; the image spring responding and settling; and reduced-motion behavior.

Each layout is checked for missing images, loaded fonts, horizontal page overflow, clipped headings and controls, duplicate IDs, broken anchors and accidentally exposed design controls. The touch context uses `isMobile` and `hasTouch`, with landscape pinning disabled. Default pages make no requests to external font, image or API services.

## Visual review

Rendered desktop and mobile homepages, the quickstart, the model catalogue, the architectural illustration and the comparison view were inspected. Corrections included a 320px heading overflow, undersized secondary text, overlong FAQ measure, a desktop crop that cut off the architecture, old delayed hero entrance effects, and comparison frames starting above the body.

The hero uses a generated panoramic asset on desktop and the original composition on mobile. Production image variants range from about 11 KB to 74 KB. The 1440px wide desktop hero is approximately 24 KB. Generated originals and exact prompts are retained in `hero-options/`.

## Reproduce

Start the server, then from `kanso/` run `npm ci`, `npx playwright install chromium`, and `npm run verify`. The repository design audit is `npm run slop -- kanso kanso-drawing kanso-plates`.

Machine-readable browser results are written to `shots/report.json`, and the design audit can write `shots/slop-report.json`. Browser captures are also in ignored `shots/`; the current homepage previews are retained in `dist/preview.jpg` and `dist/preview-mobile.jpg`.

These are local prototype checks, not a guarantee for every browser or assistive technology. Product, model, pricing and plan data remain explicitly illustrative; this work does not add an inference, authentication or billing backend.
