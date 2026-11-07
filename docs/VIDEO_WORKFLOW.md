# Applying Chase AI's design workflow locally

Source: https://www.youtube.com/watch?v=7FU98O0JLHs. The spoken transcript and sampled frames were reviewed before this implementation.

| Video advice | Local implementation |
| --- | --- |
| Curate a reference library, including hero and body sections | `/designs/inspiration`: three requested references, captures, style tags, borrow/avoid notes and source links |
| Save useful design language and prompts | Copyable reference briefs, a complete brief for each concept, four exact image prompts in `docs/asset-prompts.json` |
| Use Impeccable and Taste guidance | Project-local skills in `.agents/skills`, with their licenses retained; craft and visual critique applied to existing designs |
| Explore several distinct styles | Twelve existing visual identities retained and refined |
| Refine each direction through three alternatives | Thirty-six real compositions; `/designs/variations` compares A/B/C at desktop, tablet and mobile widths |
| Generate four custom asset alternatives | Quiet horizon, Ink study, Paper depth and Night atlas, stored in `public/studio-assets` and selectable on all twelve concepts |
| Add a live tweak bar | A/B/C switch, heading/body fonts, type scale, weight, tracking, leading, colour, width, spacing, radius, motion and image controls |
| Save and iterate | Per-concept browser storage, reset, copyable local URL, JSON import/export, saved favorite on the composition board |
| Use component inspiration | Existing product components refined in place; 21st.dev is linked as a component research resource. No unreviewed registry code was installed |
| Review the actual result | Browser measurements and screenshots saved under `../../review`; production build, TypeScript and settings tests |

## Art direction choices

Taste dealt “The product performs”, “Type and nothing else” and “The quiet instrument”. The chosen direction is **The product performs**, seed **1414109127**, keeping the existing palettes and typography. The supplied references and request for simpler pages override house-style quotas for picture count, motion and wholesale palette changes. The existing schematic plot is geometric data illustration. Model tables and application fragments keep their useful borders and technical notation.

Image-led alternatives are optional. The Observatory night plate uses Night atlas by default; product-led compositions retain the actual demo. The four assets were created with the built-in image generator. Higgsfield was checked and suggested but is not connected; it was not used. The exact prompts and provenance are saved alongside the implementation.

## Local operation

From this directory, run `npm run dev -- --hostname 127.0.0.1 --port 3100`. Open `/designs`, `/designs/variations` or `/designs/inspiration`.

Open a concept, choose A/B/C, then Tweak. Settings apply immediately and are stored for that concept in this browser. Copy link preserves the full configuration on this local server. Export JSON makes a portable settings file. Import validates fonts, colours, assets and numeric ranges. Reset returns that concept to its authored defaults.

No Git commits, pushes, PRs, source synchronization, deployments or remote repository changes are part of this workflow.
