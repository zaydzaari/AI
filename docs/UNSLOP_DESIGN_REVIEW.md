# Aether application design review

Applied the [Unslop skill](https://github.com/heydamir/unslop) by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), licensed under CC BY 4.0. The installed skill and its original attribution are retained at `~/.codex/skills/unslop`.

## Scope and direction

The application had a working, coherent identity, so this is a refinement of its existing visual language. Its page structure, fixtures, routes, and demo behavior remain intact. The landing page and developer documentation are outside the visual change.

- **Product:** Aether's third-party AI model workspace, agent workspace, and owner console
- **Character:** calm, exact, approachable
- **World:** a working console with neutral surfaces and blue controls
- **Moments:** the model usage comparison and credit activity
- **Signature:** Aether's existing route mark, with a small blue endpoint identifying the selected navigation view

## Audit before changes

| Finding | Location | Treatment |
| --- | --- | --- |
| Headings, navigation, controls, and figures all competed through weights around 650–790 | Shared workspace and business styles | Two primary interface weights, 400 and 500; wordmark retained at 600 |
| Blue-tinted canvas, navigation, avatars, notices, and credit cards competed with the actual usage data | Shell, owner overview, customer spending, ledger | Neutral chrome and credit surfaces, with blue reserved for meaningful controls and balances |
| Close but inconsistent spacing such as 13, 17, 19, and 23px | Sidebar, cards, analytics, filters | Normalize the principal rhythm to 8, 12, 16, 20, 24, 32, and 40px |
| Generic greeting and promotional context headings | Dashboard, owner overview, login | Workspace overview, Business overview, and Sign in to Aether |
| Heavy enclosed metrics and a nested filled model-share panel | Owner overview and usage charts | Open ledger strip and a separated, unfilled model-share column |
| Small keyboard captions fell below 11px | Search trigger and search footer | Raise minimum keycap type to 11px |
| Decorative AI sparkle in the empty conversation | Playground | Use the existing conversation icon |
| Strong chart palette competed across equally loud series | Dashboard and owner usage | Keep stable series identities with cobalt leading and quieter supporting colors |
| Search entrance and chart growth used a different timing curve from other controls | Shared motion rules | One curve with brief, purposeful feedback and reduced-motion handling |

## Nine passes

1. **Spacing:** 248px sidebar, 36px desktop navigation rows, 44px mobile targets, 24px card padding on desktop and 16px on phones. Main page gutters remain fluid. Related controls share aligned starts.
2. **Color:** near-white canvas, neutral grey sidebar and hairlines, restrained semantic status colors, existing Aether blue for actions, focus, selected data, and available credit.
3. **Icons:** keep Lucide, normalize primary navigation and control icons to 18px with a 1.5 stroke, and replace the decorative empty-state sparkle. The real Aether mark is unchanged.
4. **Copy:** name the actual page context, use sentence case in navigation, shorten Search, and remove trailing periods from short interface captions. Demo disclosures and all financial qualifications remain.
5. **Type:** keep the project's chosen Plus Jakarta Sans. Hierarchy comes from scale, weight 400/500, contrast, and space. The wordmark retains weight 600; numerical data retains tabular figures.
6. **Layout:** keep sections in the same order. Open the owner's metric strip, preserve the dominant daily usage chart, and separate its narrow model-share list with a quiet rule. Mobile stacks retain reading order.
7. **Details:** use understated active navigation with a blue endpoint, right-align numerical business table columns, provide neutral row hover feedback, and make credit details readable on a white surface.
8. **Visuals:** the application data is the visual material. The chart's series remain tied to the same fixture IDs. No generated artwork, invented claims, extra feature, or image-generation prompt was needed.
9. **Motion:** brief menu entrances, restrained button press feedback, a subtle chart reveal, and one `cubic-bezier(.22, 1, .36, 1)` curve. Reduced-motion preferences suppress transitions and animation.

## Implementation

Changes live in the existing `components/workspace/workspace.css` and `business.css`, with small context-title, icon, navigation-copy, and chart-palette edits in their existing components. No component library or dependency was added to the application. The Unslop skill itself is installed outside the application.

Before/after review images and source backups are in the parent workspace's `review/workspace` directory. Original source backups are in `unslop-source-before`. The existing financial fixtures and React demo-state adapters are retained.

All account changes, AI output, budget behavior, and owner controls remain simulations. A future backend must supply authorization, durable state, metering, billing, supplier reconciliation, and gateway enforcement.

## Verification

- Production build and TypeScript pass; 64 pages generated.
- Browser checks cover the workspace, spending, usage, API keys, owner routes, model catalogue/detail, agent, playground, plans, settings, and authentication routes.
- Phone checks at 352px and 320px show no horizontal page overflow. Tables retain their own scroll regions.
- A $10 sample credit adjustment still appears as $39.29 in the connected customer preview, and a saved $35 monthly budget appears on the owner record.
- Customer search, keyboard owner search, model filtering and card view, dialogs, simulated chat responses, agent source/diff tabs, and simulated approvals work.
- Measured 36px desktop navigation rows. Shared type declarations use weights 400 and 500, with the brand wordmark at 600.
- Palette contrast checks: body 15.55:1, muted text on the raised surface 5.13:1, primary action 7.71:1, and input outlines on white 3.14:1.
