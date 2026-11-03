// Standalone product preview data. Rates, model identifiers and availability are illustrative.
export const BRAND = {
  name: "Aether",
  domain: "aether.example",
  apiBase: "https://api.aether.example/v1",
  envKey: "AETHER_API_KEY",
};
export const PRICE_NOTE = "Illustrative rates in USD per one million tokens.";
export const MODELS = [
  { id: "core", name: "Core", role: "General chat & reasoning", context: "128K", contextK: 128, variants: ["Standard", "Low-refusal"], inPrice: .6, outPrice: 2.4, cached: .15 },
  { id: "unbound", name: "Unbound", role: "Alternative model behavior", context: "128K", contextK: 128, variants: ["Abliterated"], inPrice: .8, outPrice: 3.2, cached: .2 },
  { id: "forge", name: "Forge", role: "Code & repository work", context: "256K", contextK: 256, variants: ["Standard", "Low-refusal"], inPrice: 1.2, outPrice: 4.8, cached: .3 },
  { id: "atlas", name: "Atlas", role: "Long documents & context", context: "1M", contextK: 1000, variants: ["Standard"], inPrice: 1.5, outPrice: 6, cached: .25 },
  { id: "swift", name: "Swift", role: "Fast, focused tasks", context: "32K", contextK: 32, variants: ["Standard", "Low-refusal", "Abliterated"], inPrice: .08, outPrice: .32, cached: .02 },
];
export const BENEFITS = [
  ["Unified chat", "", "Keep conversations in one workspace. Choose a different model for the next task."],
  ["Model modes", "", "Compare standard, low-refusal and abliterated options where the family supports them."],
  ["Coding tools", "", "A dedicated model family for repository work, debugging and code generation."],
  ["Long context", "", "Choose a larger context window for lengthy documents and multi-file tasks."],
  ["Prompt caching", "", "Compare standard and cached input rates for repeated prompt prefixes."],
  ["Model comparison", "", "Bring the same prompt to different families. Compare the output and token cost."],
];
export const rate = (value) => `$${value.toFixed(2)}`;
export const CLIENT_DATA = { BRAND, MODELS, PRICE_NOTE };
