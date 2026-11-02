// Shared Aether product content for all 20 visual directions.
// Mirrors ../../lib/content.ts so the collection and the 12-concept lab describe the same product.
//
// Everything here is MOCK DATA for design exploration:
// - The brand is a placeholder: change BRAND.name and rebuild, and every site updates.
// - Model names, context sizes and token rates are placeholders, not commitments.
// - Testimonials are placeholders, labelled as such on every page.

export const BRAND = {
  name: "Aether",
  domain: "aether.example",
  apiBase: "https://api.aether.example/v1",
  envKey: "AETHER_API_KEY",
};

export const PRICE_NOTE = "Sample rates for layout only. Final pricing not yet set.";
export const PROOF_NOTE = "Placeholder testimonials — swap in real beta quotes before launch.";
export const conceptNote = (style) =>
  `${BRAND.name} is a placeholder brand and this page is the "${style}" design direction. Models, rates and quotes are mock data — nothing here is live.`;

export const MODELS = [
  { id: "core", name: "Core", role: "General chat & reasoning", blurb: "The everyday model. Writing, analysis, planning and conversation.", context: "128K", contextK: 128, variants: ["Standard", "Low-refusal"], inPrice: 0.6, outPrice: 2.4, cached: 0.15 },
  { id: "unbound", name: "Unbound", role: "Abliterated variant", blurb: "Refusal behaviour removed at the weights level. You set the policy.", context: "128K", contextK: 128, variants: ["Abliterated"], inPrice: 0.8, outPrice: 3.2, cached: 0.2 },
  { id: "forge", name: "Forge", role: "Coding agents", blurb: "Built for multi-file edits, tool calls and long agent loops.", context: "256K", contextK: 256, variants: ["Standard", "Low-refusal"], inPrice: 1.2, outPrice: 4.8, cached: 0.3 },
  { id: "atlas", name: "Atlas", role: "Long context", blurb: "Whole repositories, books and archives in a single prompt.", context: "1M", contextK: 1000, variants: ["Standard"], inPrice: 1.5, outPrice: 6, cached: 0.25 },
  { id: "swift", name: "Swift", role: "Fast & small", blurb: "Low-latency responses for routing, extraction and autocomplete.", context: "32K", contextK: 32, variants: ["Standard", "Low-refusal", "Abliterated"], inPrice: 0.08, outPrice: 0.32, cached: 0.02 },
];

export const TEMPERAMENTS = [
  ["Standard", "The default behaviour of each model family."],
  ["Low-refusal", "Fewer reflexive refusals for fiction, research and security work."],
  ["Abliterated", "Refusal behaviour removed at the weights level. Your deployment sets the policy."],
];

export const PROBLEM = {
  rows: [
    ["Every provider means a new key, a new SDK and a new bill.", "One key and one endpoint for five model families."],
    ["Cautious models refuse ordinary fiction, research and security work.", "Choose standard, low-refusal or abliterated on every request."],
    ["Credit systems hide what a single request actually costs.", "Per-token rates on every model, and the cost on every response."],
  ],
};

export const BENEFITS = [
  ["Unified chat", "Switch models mid-conversation without explaining yourself again.", "The whole thread, files included, moves with you from Core to Unbound to Forge."],
  ["Three temperaments", "Get direct answers for fiction, red-teaming and research.", "Add :low-refusal or :abliterated to a model name. Your deployment sets the policy."],
  ["Coding agents", "Hand off the bug fix and review a tested diff.", "Forge reads the repository, plans the change, edits files and runs the tests."],
  ["Long context", "Ask one question across an entire repository or archive.", "Atlas is designed for very large prompts. Spec shown is a placeholder."],
  ["Prompt caching", "Pay less every time a long prompt repeats.", "Repeated prefixes are billed at the cached rate automatically."],
  ["Side-by-side compare", "Find the right model for your prompt before you commit.", "Run one prompt on several models and compare answers and cost."],
];

export const STEPS = [
  ["Pick a model and a temperament", "Choose from five families. Add a suffix when you need fewer refusals — the request stays the same."],
  ["Send your first request", `Point the SDK you already use at ${BRAND.name}'s base URL. Streaming and tool calls work as before.`],
  ["Ship with costs in view", "Every response reports tokens, cached tokens and cost. Long prompts are cached automatically."],
];

export const PROOF = [
  ["Backend developer", "One key instead of three", "Replace with a real quote about consolidating providers behind one base URL."],
  ["Safety researcher", "Studying refusal behaviour", "Replace with a real quote about comparing standard and abliterated variants."],
  ["Novelist", "Dark themes, no lectures", "Replace with a real quote about writing difficult scenes without refusals."],
  ["Startup CTO", "Predictable costs", "Replace with a real quote about per-request cost reporting and caching."],
];

export const PLANS = [
  { name: "Explore", price: "$0", cadence: "to start", body: "Try every model family in chat with a daily allowance.", features: ["Unified chat", "All model families", "Daily usage allowance"], fk: "No card needed to look around." },
  { name: "Pro", price: "$20", cadence: "per month", body: "For people who live in the chat and want the larger models.", features: ["Higher limits", "Abliterated variants", "Side-by-side compare", "Coding agent (preview)"], fk: "Cancel from settings in one click.", featured: true },
  { name: "API", price: "Pay as you go", cadence: "per token", body: "Per-token billing with prompt caching on every model.", features: ["One key, every model", "Prompt caching", "Usage dashboard"], fk: "No minimum spend. Pay only for tokens you use." },
];

export const CODE = {
  curl: `curl ${BRAND.apiBase}/chat/completions \\
  -H "Authorization: Bearer $${BRAND.envKey}" \\
  -d '{"model": "core-128k:low-refusal",
       "messages": [{"role": "user", "content": "Hello"}]}'`,
  ts: `const client = new OpenAI({
  baseURL: "${BRAND.apiBase}",
  apiKey: process.env.${BRAND.envKey},
});

await client.chat.completions.create({
  model: "forge-256k",
  messages,
});`,
};

/** Illustrative cost of a request, in dollars. */
export const cost = (m, inTok, outTok, cachedShare = 0) => ((inTok * (1 - cachedShare)) * m.inPrice + inTok * cachedShare * m.cached + outTok * m.outPrice) / 1e6;
export const usd = (n) => (n < 0.01 ? `$${n.toFixed(4)}` : n < 1 ? `$${n.toFixed(3)}` : `$${n.toFixed(2)}`);
export const rate = (n) => `$${n.toFixed(2)}`;

/** Data handed to every page as window.AE for the signature scripts. */
export const CLIENT_DATA = { BRAND, MODELS, PRICE_NOTE };
