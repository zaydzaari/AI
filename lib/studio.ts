import { DESIGNS } from "./designs";

export type Variant = "a" | "b" | "c";
export const VARIANTS: Variant[] = ["a", "b", "c"];
export type Composition = "spread" | "column" | "rail" | "poster" | "tasks" | "plate";
type Direction = { title: string; lead: string; reference: string; compositions: [Composition, Composition, Composition]; names: [string, string, string]; intent: string };
export const DIRECTIONS: Record<string, Direction> = {
  "01": { title: "Every model. One thread.", lead: "Switch AI models without starting over. Keep your conversation, files and context together.", reference: "abracadabra", compositions: ["spread", "column", "rail"], names: ["Annotated spread", "Reading column", "Working notebook"], intent: "Make continuous conversation tangible through an annotated transcript and a paper-like editorial rhythm." },
  "02": { title: "Every model. Same API.", lead: "Choose a model and its response style. Keep the SDK and request format you already use.", reference: "abliteration", compositions: ["spread", "column", "rail"], names: ["Request first", "Terminal band", "Documentation"], intent: "Let a readable, selectable request prove compatibility before any marketing claim." },
  "03": { title: "Find your next idea.", lead: "Write, compare answers and switch AI models in the same conversation.", reference: "zai", compositions: ["spread", "column", "tasks"], names: ["Product window", "Composer", "Guided tasks"], intent: "Give the composer more importance than decorative surfaces. Make the next action obvious." },
  "04": { title: "One account. Every model.", lead: "One workspace for chat, coding and API access. Switch models when the work changes.", reference: "abliteration", compositions: ["poster", "spread", "column"], names: ["Type poster", "Spec sheet", "Horizontal index"], intent: "Use a typographic poster and an honest specification index with firm edges and confident scale." },
  "05": { title: "Room for your ideas.", lead: "Five AI models for writing, research and code. Try a different voice without losing your thread.", reference: "abracadabra", compositions: ["poster", "spread", "column"], names: ["Studio", "Prompt wall", "Working paper"], intent: "Show the writing itself. Warm paper and expressive type support three readable voices." },
  "06": { title: "Your AI, together.", lead: "Write, work through code or ask a question. Choose a different model whenever you need one.", reference: "zai", compositions: ["column", "spread", "tasks"], names: ["Product showcase", "Split introduction", "Guided walkthrough"], intent: "Introduce one clear application window, with meaningful examples rather than scroll choreography." },
  "07": { title: "Study what changes.", lead: "Compare standard, low-refusal and abliterated model variants through one API. Explore an illustrative experiment below.", reference: "abliteration", compositions: ["spread", "column", "rail"], names: ["Research note", "Experiment first", "Results ledger"], intent: "Lead with a manipulable experiment and label the schematic and sample data precisely." },
  "08": { title: "A place to think.", lead: "Keep questions, research and code in one place. Choose the AI model that fits your work.", reference: "abracadabra", compositions: ["column", "rail", "plate"], names: ["Reading room", "Observation page", "Night plate"], intent: "Create a calm reading room. A night landscape earns its place only in the image-led alternative." },
  "09": { title: "AI, in good order.", lead: "Chat, run a coding task or use the API. Five model families, with clear choices for each kind of work.", reference: "abliteration", compositions: ["spread", "poster", "rail"], names: ["Catalogue", "Poster", "Dense ledger"], intent: "Turn the actual model catalogue into the composition. Align names, roles and context data clearly." },
  "10": { title: "Start with a question.", lead: "Try a prompt. Choose a model, compare its answer and see the estimated cost.", reference: "zai", compositions: ["column", "spread", "tasks"], names: ["Composer first", "Workbench", "Task led"], intent: "Make the working composer the main event, then give developers a practical request builder." },
  "11": { title: "Compare the answers.", lead: "The same prompt, with different models and response styles. Keep the conversation as you compare.", reference: "zai", compositions: ["spread", "column", "poster"], names: ["Output comparison", "Quiet console", "Review desk"], intent: "Replace atmospheric glass with readable outputs. The comparison is the proof." },
  "12": { title: "One key. Open ideas.", lead: "A quieter place to chat, write and work through code, with the AI model you choose.", reference: "abracadabra", compositions: ["spread", "rail", "column"], names: ["Editorial specimen", "Paper ledger", "Open folio"], intent: "Pair tactile editorial typography with a precise product specimen. Let the material and output carry the page." },
};

export const FONTS = [
  ["original", "Original type"], ["Geist Variable", "Geist"], ["Bricolage Grotesque Variable", "Bricolage Grotesque"],
  ["Sora Variable", "Sora"], ["DM Sans Variable", "DM Sans"], ["Fraunces Variable", "Fraunces"],
  ["Instrument Serif", "Instrument Serif"],
] as const;
export const ASSETS = [
  { id: "quiet-horizon", name: "Quiet horizon", description: "A low volcanic ridge under an ivory dawn. Open sky leaves room for type." },
  { id: "ink-study", name: "Ink study", description: "Tidal paths printed in warm black ink. An editorial alternative for the notebook directions." },
  { id: "paper-depth", name: "Paper depth", description: "Layered archival paper, raking light and a restrained terracotta edge." },
  { id: "night-atlas", name: "Night atlas", description: "Blue-hour mountains and a small amber horizon for the Observatory direction." },
] as const;
export type Settings = { variant: Variant; headingFont: string; bodyFont: string; scale: number; bodySize: number; weight: number; tracking: number; leading: number; spacing: number; width: number; radius: number; motion: "off" | "subtle"; image: string; imageHeight: number; accent: string; background: string; ink: string };
export const DEFAULTS: Settings = { variant: "a", headingFont: "original", bodyFont: "original", scale: 100, bodySize: 17, weight: 550, tracking: -3, leading: 106, spacing: 64, width: 1200, radius: 8, motion: "subtle", image: "auto", imageHeight: 280, accent: "", background: "", ink: "" };
export const TYPE_PROFILES: Record<string, { weight: number; max: number; fluid: number }> = {
  "01": { weight: 680, max: 5.25, fluid: 5.6 }, "02": { weight: 540, max: 4.8, fluid: 5.2 },
  "03": { weight: 500, max: 4.75, fluid: 5.2 }, "04": { weight: 760, max: 5.5, fluid: 5.8 },
  "05": { weight: 650, max: 4.8, fluid: 5.2 }, "06": { weight: 650, max: 4.6, fluid: 5.1 },
  "07": { weight: 540, max: 4.5, fluid: 5.0 }, "08": { weight: 470, max: 5.6, fluid: 6.0 },
  "09": { weight: 620, max: 5.0, fluid: 5.4 }, "10": { weight: 600, max: 4.75, fluid: 5.2 },
  "11": { weight: 560, max: 4.8, fluid: 5.2 }, "12": { weight: 430, max: 5.2, fluid: 5.6 },
};
export function defaultsFor(id: string): Settings {
  return {
    ...DEFAULTS,
    weight: TYPE_PROFILES[id]?.weight ?? DEFAULTS.weight,
    leading: id === "01" ? 102 : DEFAULTS.leading,
    spacing: 80,
    width: id === "01" ? 1280 : 1240,
  };
}
const bounded = (v: unknown, min: number, max: number, fallback: number) => typeof v === "number" && Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback;
const color = (v: unknown) => typeof v === "string" && /^#[\da-f]{6}$/i.test(v) ? v : "";
export function validateSettings(raw: unknown, defaults: Settings = DEFAULTS): Settings {
  const v = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const font = (x: unknown) => FONTS.some(([f]) => f === x) ? x as string : "original";
  return { variant: VARIANTS.includes(v.variant as Variant) ? v.variant as Variant : "a", headingFont: font(v.headingFont), bodyFont: font(v.bodyFont),
    scale: bounded(v.scale, 75, 125, defaults.scale), bodySize: bounded(v.bodySize, 16, 20, defaults.bodySize), weight: bounded(v.weight, 400, 800, defaults.weight), tracking: bounded(v.tracking, -4, 0, defaults.tracking), leading: bounded(v.leading, 95, 125, defaults.leading), spacing: bounded(v.spacing, 36, 100, defaults.spacing), width: bounded(v.width, 960, 1440, defaults.width), radius: bounded(v.radius, 0, 24, defaults.radius), imageHeight: bounded(v.imageHeight, 160, 440, defaults.imageHeight), motion: v.motion === "off" ? "off" : "subtle", image: ["auto", "none", ...ASSETS.map(a => a.id)].includes(v.image as string) ? v.image as string : "auto", accent: color(v.accent), background: color(v.background), ink: color(v.ink) };
}
export function briefFor(id: string, settings: Settings = defaultsFor(id)) {
  const d = DIRECTIONS[id] ?? DIRECTIONS["01"];
  const meta = DESIGNS.find(x => x.id === id)!;
  return `Aether / ${meta.name}\nAesthetic: ${meta.traits.join(", ")}; ${meta.type}.\nReference: ${d.reference}; use the local inspiration library for hero and body captures.\nIntent: ${d.intent}\nComposition: ${d.names[VARIANTS.indexOf(settings.variant)]}.\nGuardrails: preserve the working demo, model data and routes; one primary action; short copy; no generic feature cards, decorative gradients, fake social proof or automatic chat playback. Keep sample prices and simulated output labelled. Respect reduced motion. Test at 1440, 768 and 390px.\nSettings: ${JSON.stringify(settings)}\nLocal project only. Do not publish or modify GitHub.`;
}
