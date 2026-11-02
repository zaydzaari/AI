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
    short: "Editorial, product-first storytelling",
    mode: "Light",
    traits: ["Editorial", "Asymmetric", "Product demos"],
    swatches: ["#F1EBDD", "#16130F", "#E0482B", "#2F5D50", "#F0B83A"],
    type: "Bricolage Grotesque · Instrument Serif · JetBrains Mono",
    motion: "Scroll-pinned story, the transcript annotates itself as you read",
    rationale:
      "Treats the product like a magazine feature: each section is an annotated specimen of a real interaction. Credible to developers because the UI is the hero, warm enough for beginners.",
  },
  {
    id: "02",
    name: "Graphite",
    short: "Technical luxury for builders",
    mode: "Dark",
    traits: ["Terminal demos", "Glyph field", "Split headline"],
    swatches: ["#0C0C0B", "#F2EFE9", "#C9B79C", "#6E8BFF", "#2A2926"],
    type: "Geist · Geist Mono",
    motion: "Cursor-reactive glyph field, typed terminal, tab morphs",
    rationale:
      "A developer-console identity with editorial restraint. Big, quiet type and an interactive glyph field give it presence without decoration for its own sake.",
  },
  {
    id: "03",
    name: "Pearl",
    short: "Holographic liquid glass",
    mode: "Light",
    traits: ["Iridescent 3D", "Glass panels", "Spatial"],
    swatches: ["#F7F7F9", "#D9E4F5", "#F3D9EC", "#DDF3EA", "#1B1C22"],
    type: "Sora · Instrument Serif",
    motion: "Real-time 3D prism, tilt-on-hover glass, soft parallax",
    rationale:
      "Luxury consumer-tech feel: pearl surfaces, a refractive 3D prism and floating glass UI. Most aspirational of the light concepts; needs restraint so it doesn't feel decorative.",
  },
  {
    id: "04",
    name: "Monolith",
    short: "Architectural minimalism",
    mode: "Light",
    traits: ["Type as structure", "One accent", "Odd grid"],
    swatches: ["#FFFFFF", "#0A0A0A", "#FF4A1C", "#E9E9E6"],
    type: "Archivo (variable width) · IBM Plex Mono",
    motion: "Width-axis type morphs, hard wipes, column reveals",
    rationale:
      "Typography is the architecture. Expanded and condensed widths of one variable face build the grid. Timeless and expensive-looking, and the hardest to do badly.",
  },
  {
    id: "05",
    name: "Kiln",
    short: "Experimental creative studio",
    mode: "Mixed",
    traits: ["Colour blocking", "Geometric", "Marquee"],
    swatches: ["#F3EFE6", "#1D3BFF", "#FF5E3A", "#D7F25C", "#111111"],
    type: "Syne · Space Mono",
    motion: "Shape choreography, sticker drags, velocity marquee",
    rationale:
      "An art-directed, awards-style direction. Draggable shapes and bold colour blocks make it memorable; the trade-off is that it reads as less enterprise-safe.",
  },
  {
    id: "06",
    name: "Lumen",
    short: "Product elegance",
    mode: "Light",
    traits: ["Cinematic", "Scroll story", "Device render"],
    swatches: ["#FFFFFF", "#F5F5F7", "#1D1D1F", "#0071E3", "#86868B"],
    type: "Plus Jakarta Sans",
    motion: "Scroll-scrubbed device, sticky chapters, scale reveals",
    rationale:
      "Calm, clear, consumer-grade. A device-style render tells the story chapter by chapter. Most accessible to beginners; least distinctive as a brand.",
  },
  {
    id: "07",
    name: "Lab Seven",
    short: "Research laboratory",
    mode: "Dark",
    traits: ["Neural viz", "Diagrams", "Monospace"],
    swatches: ["#0B0F0E", "#9EF0C5", "#F2B04A", "#1A2421", "#D6E2DC"],
    type: "IBM Plex Sans · IBM Plex Mono",
    motion: "Live activation graph, oscilloscope traces, plotted reveals",
    rationale:
      "Positions Aether as a serious research org. Interactive architecture diagrams explain what abliteration is. High credibility with technical users; can feel cold to newcomers.",
  },
  {
    id: "08",
    name: "Observatory",
    short: "Midnight celestial",
    mode: "Dark",
    traits: ["Orbital models", "Star chart", "Serif display"],
    swatches: ["#050A1A", "#0D1A3A", "#5BA8FF", "#E8EEFF", "#C9A86A"],
    type: "Cormorant Garamond · Hanken Grotesk · JetBrains Mono",
    motion: "Orbiting model bodies, cursor-lit star field, constellation lines",
    rationale:
      "Models become bodies in an orbit system you can explore. Very memorable and ownable; the metaphor has to stay legible so it doesn't hide the product.",
  },
  {
    id: "09",
    name: "Raster",
    short: "Swiss typography meets AI",
    mode: "Light",
    traits: ["12-col grid", "Oversized type", "Monochrome"],
    swatches: ["#F4F3EF", "#111111", "#E5E3DC", "#FF2A1F"],
    type: "Instrument Sans",
    motion: "Grid snaps, numeric counters, restrained slide-ins",
    rationale:
      "International-style rigour: strict grid, flush-left rag, numbered sections. Credible and adaptable to any future brand colour.",
  },
  {
    id: "10",
    name: "Live Wire",
    short: "The page is the interface",
    mode: "Light",
    traits: ["Command panel hero", "Model selector", "Streaming"],
    swatches: ["#F2F1EC", "#121212", "#FFFFFF", "#3D5AFE", "#00B37E"],
    type: "DM Sans · DM Mono",
    motion: "Streaming tokens, panel morphs, command palette",
    rationale:
      "The hero is a working chat panel. Visitors try prompts, switch models and see variants instantly. The most conversion-oriented concept.",
  },
  {
    id: "11",
    name: "Obsidian",
    short: "Ultra-premium dark glass",
    mode: "Dark",
    traits: ["Machined glass", "Titanium", "Specular light"],
    swatches: ["#0A0A0C", "#16161A", "#C8CCD4", "#A99BFF", "#F4F4F6"],
    type: "Manrope · JetBrains Mono",
    motion: "Cursor-tracked specular highlights, bevel glints, staged reveals",
    rationale:
      "Luxury hardware energy: machined glass, titanium edges, light that follows the cursor. Premium and serious, close to the developer-tool aesthetic but warmer.",
  },
  {
    id: "12",
    name: "Aperture",
    short: "Original fusion: the portal",
    mode: "Mixed",
    traits: ["3D portal", "Paper + glass", "Kinetic type"],
    swatches: ["#ECE6DA", "#0E0D0C", "#FF5A36", "#8FD3FF", "#E7C6FF"],
    type: "Fraunces (variable) · Geist Mono",
    motion: "Iris portal that opens on scroll, morphing serif, glass specimen cards",
    rationale:
      "Warm paper editorial on the outside, a glass aperture into a dark machine on the inside: approachable surface, technical depth. Combines the strongest ideas from the other eleven.",
  },
];

export const getDesign = (id: string) => DESIGNS.find((d) => d.id === id);
export const neighbours = (id: string) => {
  const i = DESIGNS.findIndex((d) => d.id === id);
  const n = DESIGNS.length;
  return { prev: DESIGNS[(i - 1 + n) % n], next: DESIGNS[(i + 1) % n] };
};
