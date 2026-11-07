# Aether project handover for Claude Code

**Next assignment.** Build the first user dashboard for Aether. Use the selected Aether Agent site as the design reference. This handover records the project as it stood on 4 November 2026 and separates what exists today from the proposed dashboard scope.

## Start here

Open the current project folder in Claude Code.

```text
C:\Users\Zayd Gaming\Desktop\Landing_page2\downloaded\AI-main
```

Use this working copy. It contains the landing page, the developer docs and the earlier design lab. The older ZIP files are snapshots of earlier work. At handover, this directory had no Git metadata. Keep the dashboard work local under the owner’s standing instruction to leave GitHub and publishing alone.

Read [`AGENTS.md`](AGENTS.md) before editing. It directs you to check the relevant bundled Next.js documentation under `node_modules/next/dist/docs/`. Use the current route files as the source of truth. [`PRODUCT.md`](PRODUCT.md), [`DESIGN.md`](DESIGN.md) and [`README.md`](README.md) capture useful history, including stages of the design exploration that predate the chosen site.

## Product and chosen style

Aether is the working brand for a personal AI agent and multi-model workspace. The product idea is that someone hands the agent a task and relevant sources, follows its progress, opens a concrete result, and decides what happens next. The landing page walks through a meeting brief and also includes research and writing examples. The developer tools show the companion API concept.

**The chosen website style is the 03 Pearl and 06 Lumen hybrid at `/designs/agent`.** Pearl contributes the clean white-and-blue chat treatment and quiet visual hierarchy. Lumen contributes the wide application frame and task sidebar. The chosen version puts the workspace across the hero and gives sources their own column on wide screens. On smaller screens, the task list becomes a row of buttons and sources open below the result. The earlier Field Notes recommendation was part of the comparison phase. Use the Agent page as the dashboard’s visual reference.

| Role | Current reference |
| --- | --- |
| Page and workspace | White surfaces, with `#f4f7fc` and `#edf3ff` for secondary areas |
| Text | `#15203a` primary, `#526079` secondary |
| Accent | `#1946c5` for primary actions, selection and focus |
| Structure | `#dce3ef` dividers, quiet borders, modest radii and readable spacing |
| Dark surface | `#132450` on the landing page’s review section, with light text |
| Type and icons | Plus Jakarta Sans Variable for the Agent site, Geist in the docs, JetBrains Mono for code, Lucide for interface icons |
| Brand | [`BrandWordmark`](components/system/Brand.tsx) contains the existing mark |

Carry the colors, typography and control treatments into the dashboard. Use the scale of an everyday work app, with compact headings, clear task states, a stable navigation area and enough room to read a result. Give the primary action the strongest visual weight. The exact Agent tokens live in [`agent.css`](app/designs/agent/agent.css).

## What is already built

| Route | What to inspect |
| --- | --- |
| `/designs/agent` | The chosen marketing page. Its full story covers the workspace, task flow, source context, approval, models, playground, API builder, FAQ and early access. |
| `/designs/agent#workspace` | Three sample tasks with their own prompt, steps, sources and result. |
| `/designs/agent#control` | Local approval example with **Keep as draft** and **Approve in demo**. |
| `/designs/agent#console` | Prompt presets, keyword-based model suggestions, manual model pinning, response variants and sample context, cache and cost estimates. Adapted from Live Wire, concept 10. |
| `/designs/agent#api` | cURL builder. Model, variant, streaming and prompt caching change the generated request. The copy button uses the clipboard. |
| `/docs` | Developer quickstart with cURL and Python examples, sidebar, article outline and copy buttons. The other six pages cover Authentication, Chat Completions, Models, Streaming, Prompt caching and OpenHands. |
| `/designs` | The original design gallery and a link to the chosen Agent page. The root `/` redirects here. |
| `/designs/01` through `/designs/12` | Earlier concepts with three compositions each. The studio controls, comparison and inspiration pages support design exploration. |

The landing page, docs and gallery are existing surfaces to preserve while building the dashboard. The Agent page sits outside the numbered concepts’ studio route group. Give the dashboard its own route and layout so the numbered concepts’ editing dock stays within the design lab.

## Source map

| Path | Responsibility |
| --- | --- |
| [`app/designs/agent/page.tsx`](app/designs/agent/page.tsx) | Chosen landing page, section order and links to docs |
| [`app/designs/agent/agent.css`](app/designs/agent/agent.css) and [`agent-tools.css`](app/designs/agent/agent-tools.css) | Agent visual system and playground styling |
| [`components/designs/agent/AgentWorkspace.tsx`](components/designs/agent/AgentWorkspace.tsx) | Interactive workspace examples and approval preview |
| [`components/designs/agent/AgentTools.tsx`](components/designs/agent/AgentTools.tsx) | Console and request builder, each with independent client state |
| [`components/designs/agent/meetingSources.ts`](components/designs/agent/meetingSources.ts) | Meeting source fixtures shared by the workspace and landing page |
| [`lib/content.ts`](lib/content.ts) | Brand, example endpoint, model families, rates, prompts, example requests and cost estimation |
| [`lib/model-preview.ts`](lib/model-preview.ts) | Local model suggestion heuristic used by Agent and Live Wire |
| [`app/docs/content.tsx`](app/docs/content.tsx) | Developer documentation and example code. `DocPage.tsx` renders the shared article shell. |
| [`app/designs/(concepts)/layout.tsx`](app/designs/(concepts)/layout.tsx) and [`lib/studio.ts`](lib/studio.ts) | Studio layout, design presets and local settings for the numbered concepts |
| [`app/globals.css`](app/globals.css) and [`app/layout.tsx`](app/layout.tsx) | Tailwind, root fonts, focus and reduced motion behavior, and preview indexing metadata |

Visual reference screenshots are available outside the project under `C:\Users\Zayd Gaming\Desktop\Landing_page2\review`. Start with `agent-concept\refined-desktop.jpg` and `refined-mobile.jpg` for the chosen hero, `prompt-console.jpg` and `request-builder.jpg` for the tools, and `aether-docs.jpg` for the docs. The live routes are the best reference for current behavior.

## Dashboard brief

The owner has assigned the **user dashboard** as the next task. The exact feature list is open. Treat the following as a proposed first pass and adapt it to the owner’s current instruction.

**Entry point.** Add `/dashboard` as the customer workspace after sign-in in the product design. For the current local prototype, make the route easy to open directly. Start with an overview that lets a user continue recent work, find items awaiting review, and start an agent task. Give the page a clear next action such as **New task** and make the action work in the demo.

**First complete flow.** A user should be able to open or start a sample task, see the prompt and its status, inspect its sources, and open a result. Use the meeting brief as the first end-to-end example and carry forward the idea of explicit review. The existing workspace and review components show the intended interaction and language. Extract or share fixtures and logic where they fit the dashboard. Keep the marketing demo’s layout intact.

**Useful account areas.** Usage, API keys and settings are natural follow-on areas. Add them when the owner confirms their scope or asks for a broader dashboard. Each visible navigation item should lead to a real section or route. A read-only usage preview can draw from the existing sample model data if the page clearly identifies it as an example.

**States and layout.** Design for first visit, recent work, waiting for review and completed work. Give the empty view a way to start a task. If you add a data operation, show its actual loading, failure and success states. At phone widths, keep the main action visible, make navigation reachable, and reflow task lists and sources. Check keyboard order and visible focus on every new control.

## Prototype boundaries and open decisions

- All current replies, run results, model IDs, context limits and rates are fixtures. `https://api.aether.example/v1` is a placeholder and `AETHER_API_KEY` is the example environment variable name. The runtime needs no live key for the existing pages.
- The workspace and approval interactions update local UI state. The early-access form shows a confirmation in the preview. It sends no email. The request builder and docs show example requests.
- The project has no implemented sign-in, account storage, live agent runner, billing, key management or Aether API routes. A dashboard prototype can use clearly labeled local fixtures. The owner still needs to supply the production authentication choice, account roles, persistence, API contract and usage source before those features can go live.
- Keep client state close to interactive controls. A real account integration will need server-side authorization and secret handling once its provider and contract are available. Keep credentials out of dashboard fixtures and client bundles.

## Run and verify

The installed versions at handover were Node `24.14.1`, npm `11.17.0`, Next.js `16.4.4`, React `19.3.1`, Tailwind CSS `4.3.3` and TypeScript `5.9.3`. The app uses the Next.js App Router and the `@/` import alias. Use the included npm lockfile. If dependencies are absent, run `npm ci` from this directory first.

```powershell
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Open `http://127.0.0.1:3100/designs/agent` and `http://127.0.0.1:3100/docs` for the reference pages. If the port already has this app running, use the existing preview. Start a separate port if another project owns it.

```powershell
node --test tests/studio.test.cjs
npm run build
```

The production build and all five studio tests passed at handover. The tests check studio settings and composition coverage. The dashboard also needs a browser walkthrough of its own task flow, responsive layout and navigation. The legacy screenshot and audit scripts target the numbered concepts and require a separate Playwright setup.

Before handing back the dashboard, verify that `/dashboard` loads directly, the primary action and sample review path work with mouse and keyboard, and the landing page and docs still load. Check desktop and phone widths, including long labels and empty content. Share the preview URL and identify which dashboard data is simulated.
