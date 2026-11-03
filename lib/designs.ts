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
  { id: "01", name: "Field Notes", short: "Editorial feature with an annotated thread", mode: "Light", traits: ["Blue-pencil edits", "Annotated thread", "Rate card"],
    swatches: ["#F7F5F0", "#ECE8DF", "#17150F", "#2337C6"], type: "Newsreader · Bricolage Grotesque · JetBrains Mono",
    motion: "Scroll plays a thread that switches temperament and model while margin notes draw in and a token tally runs",
    rationale: "The product told as a magazine feature: a pasted-in live clipping, copy-edit strikes and an annotated conversation. Warm enough for beginners, specific enough for developers." },
  { id: "02", name: "Graphite", short: "Technical luxury built on the refusal direction", mode: "Dark", traits: ["Projection field", "Response headers", "JSON rate view"],
    swatches: ["#0C0C0B", "#171715", "#C9B79C", "#8EA2FF"], type: "Hanken Grotesk · JetBrains Mono",
    motion: "A pinned activation field: scroll projects the refusal direction out of every vector while the answer moves to abliterated",
    rationale: "Explains abliteration visually instead of with slogans. The most credible concept for developers and researchers; deliberately austere." },
  { id: "03", name: "Pearl", short: "Holographic glass that refracts one prompt", mode: "Light", traits: ["3D prism", "Iridescent glass", "Refraction"],
    swatches: ["#F7F7F9", "#E8ECF3", "#F3C6E0", "#0B7A75"], type: "Sora · JetBrains Mono",
    motion: "A beam enters a glass prism and splits into five answers, each landing with its tokens and price",
    rationale: "Model comparison as optics. The most aspirational light concept; glass is kept to surfaces that carry content." },
  { id: "04", name: "Monolith", short: "Architectural type where width is context", mode: "Light", traits: ["Variable width", "Hairline grid", "One accent"],
    swatches: ["#FFFFFF", "#F1F1EE", "#0A0A0A", "#FF4A1C"], type: "Archivo (width axis) · IBM Plex Mono",
    motion: "Scroll stretches each model name along the width axis to the size of its context window",
    rationale: "Typography as the data visualisation. Timeless and expensive-looking; relies on a single typeface carrying everything." },
  { id: "05", name: "Kiln", short: "Creative studio choreography for coding agents", mode: "Mixed", traits: ["Colour blocks", "Drag stickers", "Agent loop"],
    swatches: ["#F3EFE6", "#FF5E3A", "#D7F25C", "#C9B8FF", "#1D3BFF"], type: "Syne · Space Mono",
    motion: "Shapes stamp Plan → Edit → Test → Ship as you scroll, with the agent log and cost accumulating; velocity marquee finale",
    rationale: "The loudest concept, aimed at creators and builders. Joyful and memorable; the colour blocking needs discipline at scale." },
  { id: "06", name: "Lumen", short: "Premium product page with a device cinema", mode: "Light", traits: ["CSS device", "Cinematic scroll", "Calm type"],
    swatches: ["#FFFFFF", "#F5F5F7", "#1D1D1F", "#0063E6"], type: "Albert Sans",
    motion: "A laptop opens with scroll, the app lights up, the camera pushes in and captions walk through ask → switch → price",
    rationale: "The most approachable concept for everyday users. Polished and clear; closest to a familiar consumer-tech pattern." },
  { id: "07", name: "Lab Seven", short: "Research paper with live figures", mode: "Dark", traits: ["Neural figure", "Token Sankey", "Peer review"],
    swatches: ["#0B0F0E", "#121917", "#F2B04A", "#9EF0C5"], type: "IBM Plex Sans · IBM Plex Mono",
    motion: "Fig. 2 tweens a token-flow Sankey through uncached, cached and routed runs while a cost chart steps down",
    rationale: "Reads as a research organisation and teaches the economics of caching and routing. May feel cold to casual visitors." },
  { id: "08", name: "Observatory", short: "Midnight star chart of every model", mode: "Dark", traits: ["Orrery hero", "Planisphere", "Ephemeris"],
    swatches: ["#050A1A", "#0D1A3A", "#C9A86A", "#5BA8FF"], type: "Cormorant Garamond · Hanken Grotesk",
    motion: "Scroll turns a star wheel; each model's constellation opens its ephemeris card as it crosses the meridian",
    rationale: "Model discovery as celestial navigation. Mysterious and memorable; the metaphor must stay legible on small screens." },
  { id: "09", name: "Raster", short: "Swiss poster with a monthly estimator", mode: "Light", traits: ["12-col raster", "Poster disk", "Estimator"],
    swatches: ["#F4F3EF", "#E8E6DF", "#111111", "#D9241B"], type: "Public Sans · JetBrains Mono",
    motion: "Scroll sweeps monthly volume from 1M to 1B tokens and re-sets every model's bill as poster numerals",
    rationale: "The clearest pricing story in the set. Disciplined and graphic; less atmospheric than the others by design." },
  { id: "10", name: "Live Wire", short: "The homepage is the product", mode: "Light", traits: ["Live router", "Docking panels", "Cost estimate"],
    swatches: ["#F2F1EC", "#FFFFFF", "#121212", "#C42D63"], type: "DM Sans · DM Mono",
    motion: "Typing re-routes the model and re-prices the request live; scroll docks chat, compare, agent and usage panels",
    rationale: "Most likely to convert: visitors use the product in the hero. Its visual identity is quieter than its interaction." },
  { id: "11", name: "Obsidian", short: "Luxury dark glass and precise metering", mode: "Dark", traits: ["Titanium key", "Token stream", "Variant wipe"],
    swatches: ["#0A0A0C", "#141418", "#C8CCD4", "#B7A6FF"], type: "Manrope · JetBrains Mono",
    motion: "Scroll scrubs a streaming response token by token while a usage meter counts tokens and cost",
    rationale: "A luxury technology identity built around metering. Premium and calm; violet must stay a signal, not a wash." },
  { id: "12", name: "Aperture", short: "Fusion: paper outside, machine inside", mode: "Mixed", traits: ["Camera iris", "Holographic portal", "Light → dark"],
    swatches: ["#F7F5F0", "#ECE6DA", "#0E0D0C", "#E7C6FF", "#C23A1C"], type: "Literata · Hanken Grotesk · JetBrains Mono",
    motion: "A full-viewport iris opens into a holographic portal of model lenses; the page stays inside the machine until a closing iris",
    rationale: "The strongest identity: friendly for beginners, technical underneath, with one memorable mechanic. Most complex to build." },
];

export const getDesign = (id: string) => DESIGNS.find((d) => d.id === id);
export const neighbours = (id: string) => {
  const i = DESIGNS.findIndex((d) => d.id === id);
  const n = DESIGNS.length;
  return { prev: DESIGNS[(i - 1 + n) % n], next: DESIGNS[(i + 1) % n] };
};
