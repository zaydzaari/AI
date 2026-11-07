# Aether Agent frontend handover

## Run locally

From the project directory, install the locked dependencies and start Next.js.

```bash
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Open `http://127.0.0.1:3100` for the product landing page or `http://127.0.0.1:3100/dashboard` for the sample workspace. `/designs` opens the concept gallery and `/docs` opens the existing developer docs. Run `npm run build` to check the production build locally.

## Pages and demo behavior

| Route | What to try |
| --- | --- |
| `/login` | Enter a made-up email and a password of at least eight characters. Try visibility, Remember me, the loading state, and the link to the dashboard. `blocked@example.com` triggers a simulated error. |
| `/register` | Enter a made-up email and two matching sample passwords. The form shows validation and a simulated registration confirmation. |
| `/forgot-password` | Enter a made-up email and preview the recovery confirmation. The error address also works here. |
| `/dashboard` | Switch metrics and model/member stacks, inspect bars, and drill into a day. Range, metric, and grouping are encoded in the URL and restored when returning through app navigation. Pending approvals appear above activity. |
| `/playground` | Create or switch a conversation, select a model, send a prompt or use a preset, copy Markdown and code, regenerate, and clear messages. A timed local stream renders a sample response. |
| `/agent` | Run the simulated repository review or select a task. Tasks that need a decision open on File changes, with the diff and approval controls together. Inspect tool activity or sources, then approve or reject the patch to see the report. |
| `/models` | Search, filter, and sort sample models by input price, output price, or context. Switch between table and card layouts and compare up to three models. |
| `/models/[modelId]` | Review capabilities and rates, estimate a request using input, cached input, and output counts, and open Playground or sample usage for the model. |
| `/dashboard/api-keys` | Create a named placeholder with permission and expiry options, copy it, or revoke it after confirming. Removing every key reveals the empty state. |
| `/dashboard/usage` | Filter demo usage by model, member, and a selected day. Clear the day chip to restore the full period. Under Credit history, open a ledger entry to see its balance change and itemized model estimates. The account ledger covers the full demo month. |
| `/dashboard/spending` | Inspect the current demo customer’s balance, model charges, plan proposal, and credit activity. Save a monthly budget, alert threshold, and limit preference. Budget enforcement is simulated. |
| `/owner` | Inspect the illustrative business overview, customer usage chart, operating estimate, goal, and owner activity log. |
| `/owner/customers` | Search sample customer names and emails, filter by plan or account status, and open each record. |
| `/owner/customers/[customerId]` | Review the customer’s usage, budget, and balance. Preview a reasoned credit adjustment or reversible account pause/resume. Open the connected customer panel. |
| `/owner/economics` | Inspect consumed credit, hypothetical upstream costs, sample processing fees, operating expenses, and the resulting estimate before tax. Funding and remaining customer credit are shown separately. |
| `/owner/model-routes` | Review candidate model families, sample retail rates, hypothetical upstream inputs, and pending supplier agreements. |
| `/preview/customer/[customerId]` | Open the customer panel for any of the eight fixture accounts. Changes to credits, status, and spending preferences are shared with the owner record. |
| `/pricing` | Compare proposed monthly or yearly prices and feature access. Preview and select a local demo plan. Included credit amounts are pending. |
| `/settings` | Save a display name, appearance, and notifications. Preview a password change and reset the sample account through the deletion dialog. |
| `/designs/agent` | The original landing page, workspace demo, approval preview, console, and cURL builder. The header links to Sign in and Open app. |
| `/docs` | The existing Quickstart, sidebar navigation, and copyable API examples. |

## Component structure

The application visual refinement follows [Unslop by Damir Sokolovsky](https://github.com/heydamir/unslop). Its audit, design direction, and nine passes are recorded in `docs/UNSLOP_DESIGN_REVIEW.md`. The original page structure, sample data, and demo state remain in place; the shared application CSS owns the quieter typography, neutral chrome, table alignment, and responsive motion.

- `app/(workspace)` defines the application routes and shared layout. `app/(auth)` defines the three account entry screens.
- `components/workspace/WorkspaceShell.tsx` owns the application navigation, mobile drawer, account menu, and in-memory preview state.
- `components/workspace/ui.tsx` contains buttons, fields, dialogs, cards, segmented controls, tables, status labels, model controls, code blocks, and feedback. `UsageChart.tsx` draws the request chart from the same records used by the tables. `workspace.css` scopes the shared palette and typography to the application.
- `Dashboard.tsx`, `Playground.tsx`, `Agent.tsx`, `Models.tsx`, `Account.tsx`, and `Auth.tsx` own the page interactions.
- `UsageDashboard.tsx` and `usageAnalytics.ts` handle usage filters and attribution. The sample member rows partition the existing usage fixtures, so dashboard, model, and member totals reconcile. A future analytics adapter can provide those grouped totals and daily series.
- `WorkspaceSearch.tsx` searches the local navigation, model fixtures, and recent tasks. Open it from the header or with Ctrl/Cmd+K, then use arrow keys and Enter. The shell remembers the last dashboard URL for return navigation. Search and remembered views require no API.
- `BusinessDemo.tsx` holds connected customer records, spending policies, and the owner activity log in React state. `businessFixtures.ts` supplies eight fictional accounts, per-account usage, hypothetical upstream assumptions, and reconciled owner totals. `OwnerConsole.tsx` and `CustomerPanel.tsx` render the owner and customer experiences with the existing shared components. `business.css` extends the same white-and-blue identity.
- The account dropdown switches between owner and customer demos. This is presentation-only navigation. The prototype provides no authorization boundary. Owner actions are local state changes, and customer budget preferences do not enforce real gateway limits.
- `fixtures.ts` holds model examples, dated usage records, plan proposals, sample keys, account data, starter conversations, and the agent scenario. `mock.ts` generates placeholder key strings and chooses canned responses. The balance, chart, and usage totals derive from the same records.

## Integration points

| Area | Replace or connect when the backend is ready |
| --- | --- |
| Owner and customer panels | Replace `BusinessDemo` state and commands with authorized account, credit-ledger, spending-policy, and audit APIs. Enforce owner permissions and account/budget restrictions on the server. Reconcile supplier reports before using actual costs. |
| Business economics | Replace the 58% upstream estimate, sample fee formula, and fixed expense fixtures with verified costs. Subscription receipts are deliberately excluded until included-credit allowances are defined, to avoid counting credit consumption and subscription receipts twice. |
| Authentication and account | Replace the timer and validation result in `Auth.tsx` with the identity flow. Load the session and account in the shell. Connect profile changes, recovery, credential updates, logout, and account deletion to account services. |
| Playground | Replace `mockReply` and the local stream timer in `Playground.tsx` with an authenticated response stream. Connect conversation listing, history, regeneration, and deletion to the conversation service. |
| Agent | Replace the fixture timeline and timer in `Agent.tsx` with runtime events keyed by task ID. Connect task start, source previews, proposed diffs, approvals, and reports to runtime adapters. Apply approved changes only through the future runtime. |
| Models | Replace `models` with the catalogue response. Keep local filters for small catalogues or pass filter state to the future catalogue service. Update model detail and Playground selection together. |
| API keys | Replace `makeDemoKey` and local list mutations with scoped creation, listing, and revocation endpoints. Keep the creation result separate from the masked list. |
| Usage and billing | Replace the dated fixture and balance calculation with metered aggregates. Connect billing history and actual credit balances when available. |
| Plans | Replace the plan fixture and local selection with plan eligibility, billing periods, and a future checkout flow. |

## Preview boundaries

The app stores demo changes in React state while navigating within the workspace. A full reload or leaving the workspace resets them. The Playground stops a pending reply when its page unmounts. Agent progress pauses off the Agent page and resumes on return. All agent tasks use the same sample repository scenario. Model specifications, API usage, prices, and credit balances are illustrative. The yearly toggle multiplies the monthly proposal by twelve. Authentication forms discard sample passwords after a valid submission. Billing history and plan allowances are placeholders for the future services.

Owner and customer views share state within the same browser tab; separate tabs have independent demo sessions. The personal workspace uses Mira's sample account. The eight `/preview/customer/*` routes preview spending for the selected fictional account; the rest of the personal application remains the Mira demo.

## Owner and customer verification

- Production build and TypeScript checks pass with all 64 pages generated.
- Opened all eight owner detail pages and all eight customer previews in the browser.
- Checked the new owner pages and customer spending at desktop and a 320 CSS-pixel phone viewport, including table scrolling and mobile navigation.
- Exercised customer search, empty-state reset, owner search with keyboard navigation, chart inspection, budget settings, plan selection, credit adjustments, and account pause/resume.
- Verified a $10 owner adjustment changes Mira's available credit from $29.29 to $39.29 in the customer preview, dashboard, and credit history. Invalid deductions do not alter the balance.
- Checked sample balance equations, aggregate owner economics, chart totals, and the absence of chart activity before each sample join date.
- Confirmed the landing page and developer documentation still render and checked browser console errors.
- The design scan's existing Plus Jakarta Sans advisory is intentionally retained to preserve the project's typography.
