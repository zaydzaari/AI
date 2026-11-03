# Product context

Impeccable reads this file before every command (it's what `/impeccable init` writes). Keep it short and true.

## What it is

**Aether** (a placeholder name) is an AI platform that sells model access and API tokens. The platform covers:

- five model families:
  - Core: general chat and reasoning;
  - Unbound: the abliterated variant;
  - Forge: coding agents;
  - Atlas: long context;
  - Swift: fast and small;
- standard, low-refusal and abliterated variants;
- unified chat, where you switch models mid-thread;
- coding agents;
- a developer API that works with the OpenAI SDK shape;
- prompt caching;
- transparent per-token pricing, with the cost reported on every response.

## Who it's for

- **Developers** who want one key and one endpoint instead of several providers.
- **Researchers and red-teamers** who study refusal behaviour.
- **Writers and other creative professionals** who need direct answers on difficult material.
- **Startup teams** who need predictable costs.

## What the page must do

Sell API keys and per-token access. The primary action is **Get your API key**. Secondary actions are trying the chat and reading the per-token rates.

## Constraints

- **Mock data only.** Models, context sizes, rates and testimonials are placeholders and are labelled as such on every page.
- **No unsupported claims.** Nothing about performance, security or availability unless it's verified. No fake customer logos, statistics or testimonials.
- **No clones** of tryabracadabra.com or abliteration.ai.
- **Design rules:**
  - The H1 is `clamp(3.25rem, 6vw, 5rem)` with −0.03em tracking.
  - Body text is 1.05rem with a line height of 1.7, at most 65ch wide.
  - Colour follows a 60-30-10 token system. The accent is reserved for CTAs, active nav and live data. Contrast meets WCAG AA.
  - The hero shows five parts above the fold.
  - Each page has seven sections, including a pinned three-step rail.
  - Motion animates only transform, opacity, clip-path and filter. Reduced motion unpins everything.
- **Private.** Nothing is deployed or published without the owner's permission.

## Where things are

| What | Where |
| --- | --- |
| 12 Next.js concepts | `app/designs`, `components/designs` |
| 20 static sites, gallery and taste library | `awwwards-20-collection/` |
| Shared Tweaks layer | `lib/tweaks.js`, `lib/tweaks.css` |
| Anti-slop audit | `scripts/slop-audit.cjs` |
