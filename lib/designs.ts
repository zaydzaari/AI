export type DesignMeta = {
  id: string; // "01"
  name: string;
  short: string;
  mode: "Light" | "Dark" | "Mixed";
  traits: string[];
  swatches: string[];
  type: string; // typefaces
  motion: string;
  rationale: string;
};

export const DESIGNS: DesignMeta[] = [
  {
    id: "01",
    name: "Field Notes",
    short: "Warm editorial, one continuous conversation",
    mode: "Light",
    traits: ["Editorial", "Annotated UI", "Warm paper"],
    swatches: ["#F1EBDD", "#16130F", "#E0482B", "#2F5D50", "#F0B83A"],
    type: "Bricolage Grotesque · Instrument Serif · JetBrains Mono",
    motion: "An annotated thread, readable on every screen",
    rationale:
      "Warm typography and a concrete conversation explain model switching. Short model and pricing sections keep the page focused.",
  },
  {
    id: "02",
    name: "Graphite",
    short: "A quiet API-first workspace",
    mode: "Dark",
    traits: ["API example", "Readable code", "Dark ink"],
    swatches: ["#0C0C0B", "#F2EFE9", "#C9B79C", "#6E8BFF", "#2A2926"],
    type: "Geist · Geist Mono",
    motion: "Model selection and request copying",
    rationale:
      "A restrained dark canvas with a working code example, a variant playground and a compact model registry.",
  },
  {
    id: "03",
    name: "Pearl",
    short: "A calm, product-led chat experience",
    mode: "Light",
    traits: ["Light surfaces", "Chat demo", "Soft type"],
    swatches: ["#F7F7F9", "#D9E4F5", "#F3D9EC", "#DDF3EA", "#1B1C22"],
    type: "Sora · Instrument Serif",
    motion: "Model and variant changes inside the chat",
    rationale:
      "The chat replaces the abstract 3D prism. Clean white surfaces and a compact model index explain the product directly.",
  },
  {
    id: "04",
    name: "Monolith",
    short: "Type, rules and useful product details",
    mode: "Light",
    traits: ["Architectural", "Hard edges", "Product demo"],
    swatches: ["#FFFFFF", "#0A0A0A", "#FF4A1C", "#E9E9E6"],
    type: "Archivo (variable width) · IBM Plex Mono",
    motion: "Model selection and a compact product demo",
    rationale:
      "The oversized decorative wordmark is removed so the account benefit and interactive product take priority.",
  },
  {
    id: "05",
    name: "Kiln",
    short: "A playful, simpler writing studio",
    mode: "Mixed",
    traits: ["Bold type", "Model labels", "Variant comparison"],
    swatches: ["#F3EFE6", "#1D3BFF", "#FF5E3A", "#D7F25C", "#111111"],
    type: "Syne · Space Mono",
    motion: "Replay the writing comparison",
    rationale:
      "A quiet cream canvas keeps the expressive type. The custom cursor, draggable stickers and marquee are removed.",
  },
  {
    id: "06",
    name: "Lumen",
    short: "A clear introduction to the product",
    mode: "Light",
    traits: ["App window", "Plain language", "Light"],
    swatches: ["#FFFFFF", "#F5F5F7", "#1D1D1F", "#0071E3", "#86868B"],
    type: "Plus Jakarta Sans",
    motion: "Direct model comparison",
    rationale:
      "An upright app window replaces the scroll-scrubbed device. Clear copy and a shorter page make it easy to explore.",
  },
  {
    id: "07",
    name: "Lab Seven",
    short: "A focused workspace for researchers",
    mode: "Dark",
    traits: ["Research", "Model table", "Diagrams"],
    swatches: ["#0B0F0E", "#9EF0C5", "#F2B04A", "#1A2421", "#D6E2DC"],
    type: "IBM Plex Sans · IBM Plex Mono",
    motion: "One research graph and one experiment",
    rationale:
      "Scientific details remain where they explain the product; clocks, background waves and repeated marketing sections are removed.",
  },
  {
    id: "08",
    name: "Observatory",
    short: "A quiet midnight reading room",
    mode: "Dark",
    traits: ["Serif type", "Conversation log", "Midnight"],
    swatches: ["#050A1A", "#0D1A3A", "#5BA8FF", "#E8EEFF", "#C9A86A"],
    type: "Cormorant Garamond · Hanken Grotesk · JetBrains Mono",
    motion: "Model selection inside the conversation log",
    rationale:
      "The celestial palette and serif voice remain, without animated stars or orbit controls. A readable list replaces the orrery.",
  },
  {
    id: "09",
    name: "Raster",
    short: "An orderly model catalogue",
    mode: "Light",
    traits: ["Swiss type", "Model index", "Rules"],
    swatches: ["#F4F3EF", "#111111", "#E5E3DC", "#FF2A1F"],
    type: "Instrument Sans",
    motion: "Product controls and sortable model data",
    rationale:
      "Typography, a clear index and a product example provide the hierarchy. The experimental grid toggle is removed.",
  },
  {
    id: "10",
    name: "Live Wire",
    short: "Start directly with a question",
    mode: "Light",
    traits: ["Live composer", "Model choices", "API builder"],
    swatches: ["#F2F1EC", "#121212", "#FFFFFF", "#3D5AFE", "#00B37E"],
    type: "DM Sans · DM Mono",
    motion: "Prompt-based model suggestion and request building",
    rationale:
      "The working console takes priority. Mobile keeps model and variant controls, while counters and surrounding filler are reduced.",
  },
  {
    id: "11",
    name: "Obsidian",
    short: "A restrained dark product page",
    mode: "Dark",
    traits: ["Flat dark surfaces", "Output comparison", "Clear type"],
    swatches: ["#0A0A0C", "#16161A", "#C8CCD4", "#A99BFF", "#F4F4F6"],
    type: "Manrope · JetBrains Mono",
    motion: "Compare two simulated outputs",
    rationale:
      "Flatter surfaces, brighter secondary text and a readable model list replace stacked glass effects and tall cards.",
  },
  {
    id: "12",
    name: "Aperture",
    short: "Paper typography, a direct product example",
    mode: "Mixed",
    traits: ["Paper", "Serif type", "Product specimen"],
    swatches: ["#ECE6DA", "#0E0D0C", "#FF5A36", "#8FD3FF", "#E7C6FF"],
    type: "Fraunces (variable) · Geist Mono",
    motion: "Model and prompt selection",
    rationale:
      "A simple editorial composition replaces the scroll-opened iris. One product example and short model and pricing sections tell the story.",
  },
];

export const getDesign = (id: string) => DESIGNS.find((d) => d.id === id);
export const neighbours = (id: string) => {
  const i = DESIGNS.findIndex((d) => d.id === id);
  const n = DESIGNS.length;
  return { prev: DESIGNS[(i - 1 + n) % n], next: DESIGNS[(i + 1) % n] };
};
