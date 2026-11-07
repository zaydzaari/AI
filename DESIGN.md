# Aether design direction

The landing pages persuade through a readable product example. The lab is an editing tool and stays outside the product layout. Preserve the twelve existing voices and their three compositions; refine hierarchy rather than adding sections.

The shared brand mark joins two routes into one thread. It appears with the wordmark in headers and the footer. Header access is a quiet text action; the hero owns the filled primary action. Keep a single primary accent per concept.

Typography has display, body, interface and data roles. Each concept's heading weight and scale are authored in `TYPE_PROFILES` in `lib/studio.ts`. Body text remains around 17px with a comfortable measure; demo responses are approximately 15–19px. Code and numerical data may be smaller. Use the actual face and available width to judge wrapping. Settings continue to override authored defaults.

Field Notes uses warm paper, dark ink, a rust action and pine for the continuity motif. Its hero pairs a firm sans-serif first line with a pine serif second line in the original type preset. One margin annotation points to the Unbound exchange. On phones the Forge handoff is an expandable continuation. A short workflow below the hero names the job each model performs, and the page closes with a pine early-access section.

The body changes rhythm. Technical concepts use aligned pricing rows for comparison. Editorial concepts use a catalogue layout, with the heading in the margin and plans stacked beside it. Chat concepts use open columns. Existing specialised calculators keep their own layouts. Model and pricing data remain labelled as illustrative. Keep the working controls and truthful demo states.

Primary sources and the exact design decisions are recorded in `docs/EXPERT_DESIGN_RULES.md`. New refinements live in `components/system/refined.css`; use the narrowest selector that expresses the role, and preserve the live studio controls.

## Application workspace

The workspace extends Pearl and Lumen with quiet neutral chrome, Aether blue for actions and data, and the existing Plus Jakarta Sans family at weights 400 and 500. Keep the wordmark at 600. The owner console's open metric strip and dominant model-usage chart distinguish the business view; the customer panel's credit balance and spending policy distinguish the personal view. Preserve honest demo states and all cost assumptions.

Use 24px desktop card padding, 16px phone padding, 36px desktop navigation rows, 44px touch controls, and hairline borders. Keep rich color in meaningful chart series and semantic decisions. Use the shared easing curve and respect reduced motion. The [Unslop application review](docs/UNSLOP_DESIGN_REVIEW.md) records the direction, audit, and nine passes. This application treatment does not change the landing concepts or developer docs.
