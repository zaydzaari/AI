/**
 * Shared product content for every Aether concept.
 *
 * Everything here is MOCK DATA for design exploration:
 * - Brand name is a placeholder: change BRAND once and every concept updates.
 * - Model names, context sizes and token rates are placeholders, not commitments.
 * - Pricing is illustrative only and marked as such in every design.
 */

export const BRAND = {
  name: "Aether",
  domain: "aether.example",
  apiBase: "https://api.aether.example/v1",
  envKey: "AETHER_API_KEY",
  taglines: [
    "Intelligence, Unbound.",
    "Your AI. Your Possibilities.",
    "One Platform. Infinite Possibilities.",
    "Explore Intelligence Without Limits.",
  ],
} as const;

export const MOCK_NOTE = "Concept preview · mock data · nothing here is live";
export const PRICE_NOTE = "Sample rates for layout only. Final pricing not yet set.";

export type Variant = "Standard" | "Low-refusal" | "Abliterated";

export type Model = {
  id: string;
  name: string;
  family: string;
  role: string;
  blurb: string;
  context: string; // placeholder spec
  contextK: number; // for visualisations
  variants: Variant[];
  inPrice: number; // illustrative $ per 1M input tokens
  outPrice: number; // illustrative $ per 1M output tokens
  cached: number; // illustrative $ per 1M cached input tokens
  tags: string[];
};

export const MODELS: Model[] = [
  {
    id: "core",
    name: "Core",
    family: "Aether Core",
    role: "General chat & reasoning",
    blurb: "The everyday model. Writing, analysis, planning and conversation.",
    context: "128K",
    contextK: 128,
    variants: ["Standard", "Low-refusal"],
    inPrice: 0.6,
    outPrice: 2.4,
    cached: 0.15,
    tags: ["chat", "reasoning", "writing"],
  },
  {
    id: "unbound",
    name: "Unbound",
    family: "Aether Unbound",
    role: "Abliterated variant",
    blurb: "Refusal behaviour removed at the weights level. You set the policy.",
    context: "128K",
    contextK: 128,
    variants: ["Abliterated"],
    inPrice: 0.8,
    outPrice: 3.2,
    cached: 0.2,
    tags: ["research", "red-team", "fiction"],
  },
  {
    id: "forge",
    name: "Forge",
    family: "Aether Forge",
    role: "Coding agents",
    blurb: "Built for multi-file edits, tool calls and long agent loops.",
    context: "256K",
    contextK: 256,
    variants: ["Standard", "Low-refusal"],
    inPrice: 1.2,
    outPrice: 4.8,
    cached: 0.3,
    tags: ["code", "agents", "tools"],
  },
  {
    id: "atlas",
    name: "Atlas",
    family: "Aether Atlas",
    role: "Long context",
    blurb: "Whole repositories, books and archives in a single prompt.",
    context: "1M",
    contextK: 1000,
    variants: ["Standard"],
    inPrice: 1.5,
    outPrice: 6,
    cached: 0.25,
    tags: ["long-context", "retrieval", "docs"],
  },
  {
    id: "swift",
    name: "Swift",
    family: "Aether Swift",
    role: "Fast & small",
    blurb: "Low-latency responses for routing, extraction and autocomplete.",
    context: "32K",
    contextK: 32,
    variants: ["Standard", "Low-refusal", "Abliterated"],
    inPrice: 0.08,
    outPrice: 0.32,
    cached: 0.02,
    tags: ["latency", "extraction", "routing"],
  },
];

export const CAPABILITIES = [
  {
    key: "chat",
    title: "Unified chat",
    body: "Every model family in one conversation. Switch mid-thread without losing context.",
  },
  {
    key: "variants",
    title: "Low-refusal & abliterated variants",
    body: "Pick how much the model second-guesses you. Standard, low-refusal or abliterated, side by side.",
  },
  {
    key: "agents",
    title: "Coding agents",
    body: "Agents that read your repo, plan the change, edit files and run the tests.",
  },
  {
    key: "api",
    title: "Developer API",
    body: "One key, one endpoint, every model. Drop-in compatible request shapes.",
  },
  {
    key: "context",
    title: "Long context",
    body: "Load entire codebases and document sets. Atlas is designed for very large prompts.",
  },
  {
    key: "cache",
    title: "Prompt caching",
    body: "Reuse long system prompts and documents at a fraction of the input rate.",
  },
  {
    key: "pricing",
    title: "Transparent token pricing",
    body: "Per-token rates on every model page. No credits, no multipliers.",
  },
  {
    key: "discover",
    title: "Discovery & comparison",
    body: "Run one prompt against several models and compare the answers side by side.",
  },
] as const;

export type PromptExample = {
  label: string;
  prompt: string;
  model: string; // model id
  response: string;
};

export const PROMPTS: PromptExample[] = [
  {
    label: "Write",
    prompt: "Draft a cold open for a noir short story set on a night train.",
    model: "core",
    response:
      "The 11:40 out of Union carried four kinds of people: the ones running, the ones chasing, the ones who'd forgotten which, and Mara — who'd bought every seat in car seven and was still waiting for someone to sit down.",
  },
  {
    label: "Code",
    prompt: "Refactor this fetch loop to retry with exponential backoff.",
    model: "forge",
    response:
      "Plan: 1) wrap the request in retry(fn, { attempts: 5 }) 2) delay = base * 2^n with jitter 3) only retry on 429 and 5xx. Editing src/client.ts — 1 file, +18 −6. Running tests…",
  },
  {
    label: "Research",
    prompt: "Summarise the main arguments for and against model abliteration.",
    model: "unbound",
    response:
      "For: researchers get unfiltered behaviour to study, writers aren't blocked on dark themes, and operators set their own policy. Against: fewer built-in guardrails means responsibility shifts to whoever deploys it.",
  },
  {
    label: "Long doc",
    prompt: "Read all 40 files in /contracts and list every renewal date.",
    model: "atlas",
    response:
      "Loaded 40 files into one context. Found 37 renewal clauses across 31 contracts. Earliest: Feb 3 (vendor-agreement-07.pdf, §12.2). Three files have no renewal clause — listed below.",
  },
];

export const CODE = {
  curl: `curl ${BRAND.apiBase}/chat/completions \\
  -H "Authorization: Bearer $${BRAND.envKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "unbound-128k",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,
  python: `import os
from openai import OpenAI

client = OpenAI(
    base_url="${BRAND.apiBase}",
    api_key=os.environ["${BRAND.envKey}"],
)

reply = client.chat.completions.create(
    model="forge-256k",
    messages=[{"role": "user", "content": "Fix the failing test"}],
)`,
  ts: `import OpenAI from "openai";

const ${BRAND.name.toLowerCase()} = new OpenAI({
  baseURL: "${BRAND.apiBase}",
  apiKey: process.env.${BRAND.envKey},
});

const stream = await ${BRAND.name.toLowerCase()}.chat.completions.create({
  model: "atlas-1m",
  messages,
  stream: true,
});`,
};

export const PLANS = [
  {
    name: "Explore",
    price: "$0",
    cadence: "to start",
    body: "Try every model family in chat with a daily allowance.",
    features: ["Unified chat", "All model families", "Daily usage allowance"],
  },
  {
    name: "Pro",
    price: "$20",
    cadence: "/ month",
    body: "For people who live in the chat and want the larger models.",
    features: ["Higher limits", "Abliterated variants", "Side-by-side compare", "Coding agent (preview)"],
    featured: true,
  },
  {
    name: "API",
    price: "Pay as you go",
    cadence: "per token",
    body: "Per-token billing with prompt caching on every model.",
    features: ["One key, every model", "Prompt caching", "Usage dashboard"],
  },
];

export const NAV = ["Models", "Chat", "Agents", "API", "Pricing", "Docs"];

/** Cost of a request at illustrative rates. */
export function estimateCost(m: Model, inTok: number, outTok: number, cachedShare = 0) {
  const cachedIn = inTok * cachedShare;
  const freshIn = inTok - cachedIn;
  return (freshIn * m.inPrice + cachedIn * m.cached + outTok * m.outPrice) / 1_000_000;
}

export const fmtUSD = (n: number) =>
  n < 0.01 ? `$${n.toFixed(4)}` : n < 1 ? `$${n.toFixed(3)}` : `$${n.toFixed(2)}`;

/* ——— Master design system content (v2) ——— */

export const PROBLEM = {
  title: "Using several AI models shouldn't mean several accounts.",
  lead: `Most teams end up juggling providers, refusals and invoices. ${BRAND.name} puts all of it behind one key.`,
  rows: [
    {
      problem: "Every provider means a new key, a new SDK and a new bill.",
      solution: "One key and one endpoint for five model families.",
    },
    {
      problem: "Cautious models refuse ordinary fiction, research and security work.",
      solution: "Choose standard, low-refusal or abliterated on every request.",
    },
    {
      problem: "Credit systems hide what a single request actually costs.",
      solution: "Per-token rates on every model, and the cost on every response.",
    },
  ],
};

export const BENEFITS = [
  { key: "chat", feature: "Unified chat", benefit: "Switch models mid-conversation without explaining yourself again.", detail: "The whole thread, files included, moves with you from Core to Unbound to Forge." },
  { key: "variants", feature: "Three temperaments", benefit: "Get direct answers for fiction, red-teaming and research.", detail: "Add :low-refusal or :abliterated to a model name. Your deployment sets the policy." },
  { key: "agents", feature: "Coding agents", benefit: "Hand off the bug fix and review a tested diff.", detail: "Forge reads the repository, plans the change, edits files and runs the tests." },
  { key: "context", feature: "Long context", benefit: "Ask one question across an entire repository or archive.", detail: "Atlas is designed for very large prompts. Spec shown is a placeholder." },
  { key: "cache", feature: "Prompt caching", benefit: "Pay less every time a long prompt repeats.", detail: "Repeated prefixes are billed at the cached rate automatically." },
  { key: "compare", feature: "Side-by-side compare", benefit: "Find the right model for your prompt before you commit.", detail: "Run one prompt on several models and compare answers and cost." },
] as const;

export const STEPS = [
  { title: "Pick a model and a temperament", body: "Choose from five families. Add a suffix when you need fewer refusals — the request stays the same." },
  { title: "Send your first request", body: `Point the SDK you already use at ${BRAND.name}'s base URL. Streaming and tool calls work as before.` },
  { title: "Ship with costs in view", body: "Every response reports tokens, cached tokens and cost. Long prompts are cached automatically." },
];

export const STEP_CODE = `const client = new OpenAI({
  baseURL: "${BRAND.apiBase}",
  apiKey: process.env.${BRAND.envKey},
});

await client.chat.completions.create({
  model: "core-128k:low-refusal",
  messages,
});`;

/** Role-specific social proof. These are PLACEHOLDERS — replace with real beta quotes before launch. */
export const PROOF = [
  { role: "Backend developer", focus: "One key instead of three", quote: "Replace with a real quote about consolidating providers behind one base URL." },
  { role: "Safety researcher", focus: "Studying refusal behaviour", quote: "Replace with a real quote about comparing standard and abliterated variants." },
  { role: "Novelist", focus: "Dark themes, no lectures", quote: "Replace with a real quote about writing difficult scenes without refusals." },
  { role: "Startup CTO", focus: "Predictable costs", quote: "Replace with a real quote about per-request cost reporting and caching." },
];
export const PROOF_NOTE = "Placeholder testimonials — swap in real beta quotes before launch.";

/** True product facts used as hero trust signals (no invented usage numbers). */
export const FACTS = [
  { n: 5, label: "model families" },
  { n: 3, label: "temperaments" },
  { n: 1, label: "OpenAI-style API" },
];

export const FOOTER = [
  { title: "Product", links: ["Chat", "Coding agents", "Model compare", "Changelog"] },
  { title: "Models", links: ["Core", "Unbound", "Forge", "Atlas", "Swift"] },
  { title: "Developers", links: ["API reference", "SDKs", "Prompt caching", "Status"] },
  { title: "Company", links: ["About", "Usage policy", "Privacy", "Contact"] },
];
