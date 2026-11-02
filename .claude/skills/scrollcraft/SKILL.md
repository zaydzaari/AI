---
name: scrollcraft
description: Enforces scroll-driven storytelling on every landing page in this workspace — scroll-synced reveals, pinned horizontal rails, scroll-scrubbed video where video assets exist, and hover micro-interactions — so no page reads as a static template. Use whenever building, redesigning or reviewing a page here.
---

# Scrollcraft

The reader's scroll is the timeline. Every page in this workspace must let scrolling *advance the story*, not just move a static document. Apply these rules whenever you build, redesign or review a page.

## 1. Required on every page

| Pattern | Minimum | Implementation rule |
|---|---|---|
| Scroll-synced reveals | Every major section after the hero | `IntersectionObserver` (or Motion `whileInView`, which wraps it) with `once: true` and a vertical-only root margin such as `0px 0px -12% 0px`. Never use horizontal percentage margins: they fail when the page overflows. |
| Staggered entrances | Every grid of 3+ items | 60–90 ms stagger per item, max 6 items staggered, the rest appear together. |
| Pinned horizontal rail | At least one per page (the "How it works" steps by default) | Sticky viewport inside a tall section (`height: N × 80–100vh`); map `scrollYProgress` to `translateX`. Below 768 px, fall back to a vertical stack or native `scroll-snap-type: x mandatory`. Pinning on phones is optional, never required. |
| Hover micro-interaction | Every card grid and every primary CTA | Spotlight (radial gradient at `--mx/--my`) or magnetic offset ≤ 6 px. Only under `(hover: hover) and (pointer: fine)`. |
| Scroll-scrubbed video | Only when a real video asset exists | See §3. Never fake a video with a stock file. |
| Before/after slider | Only when real comparison images or comparable outputs exist | Pointer + keyboard (`role="slider"`, arrow keys), `clip-path: inset()` not width animation. |

## 2. Motion language

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances, `cubic-bezier(0.65, 0, 0.35, 1)` for state changes. Durations 450–900 ms for reveals, 150–300 ms for hover.
- Animate only `transform`, `opacity`, `clip-path` and `filter`. Never animate `width`, `height`, `top` or `left` on scroll.
- One orchestrated moment per viewport. If two things move at once, one of them is wrong.
- Scroll-linked values go through a spring or are read in `requestAnimationFrame`; listeners are `passive`.
- Canvas, WebGL and video work pauses when off-screen (`IntersectionObserver` → stop the rAF loop or `frameloop="never"`).

## 3. Scroll-scrubbed video (when a video exists)

```ts
// muted, playsInline, preload="auto"; encode with a keyframe on every frame for smooth seeking:
// ffmpeg -i in.mp4 -an -c:v libx264 -g 1 -crf 22 -preset veryfast -movflags +faststart out.mp4
const v = ref.current!; const target = progress * v.duration;
v.currentTime += (target - v.currentTime) * 0.18; // eased seek inside rAF
```
Provide a poster image, and under reduced motion show the poster only.

## 4. Accessibility and fallbacks (non-negotiable)

- `prefers-reduced-motion: reduce` → no pinning, no scrubbing, no parallax; content renders in final state.
- Every pinned section must still read top-to-bottom with keyboard and screen readers. Rails use real headings and lists, not canvas.
- No horizontal overflow at 375 px. Pinned rails clip with `overflow: hidden` on the sticky viewport.
- Hero content must fit above the fold at 1440×900 and 375×667 — nothing in the hero may be cut off by the bottom edge.

## 5. Review checklist

- [ ] Scrolling changes something meaningful in at least three sections.
- [ ] Exactly one pinned horizontal rail (or a documented reason for none).
- [ ] Card grids have spotlight or magnetic hover on fine pointers only.
- [ ] Reveal margins are vertical-only.
- [ ] Off-screen animation loops pause.
- [ ] Reduced-motion mode verified.
- [ ] Playwright screenshots at 1440×900 and 375×667 inspected for fold cut-off and overflow.
