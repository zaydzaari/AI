"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DEFAULTS, DIRECTIONS, VARIANTS, TYPE_PROFILES, defaultsFor, validateSettings, type Settings } from "@/lib/studio";

const Context = createContext({ id: "01", settings: DEFAULTS, setSettings: (_s: Settings) => {}, reset: () => {}, ready: false });
export const useStudio = () => useContext(Context);
const keyFor = (id: string) => `aether-studio-v1:${id}`;

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const id = path.split("/").pop() || "01";
  const [state, setState] = useState({ id, settings: defaultsFor(id), ready: false });
  useEffect(() => {
    const read = () => {
      let saved: unknown = {};
      try { saved = JSON.parse(localStorage.getItem(keyFor(id)) || "{}"); } catch {}
      const query = new URLSearchParams(location.search);
      // Embedded comparisons must be reproducible, independent of saved personal tweaks.
      if (window.self !== window.top || query.has("clean")) saved = {};
      if (query.has("tune")) { try { saved = JSON.parse(query.get("tune")!); } catch {} }
      const settings = validateSettings(saved, defaultsFor(id));
      const variant = query.get("variant");
      if (variant === "a" || variant === "b" || variant === "c") settings.variant = variant;
      setState({ id, settings, ready: true });
    };
    read(); window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [id]);
  const settings = state.id === id ? state.settings : defaultsFor(id);
  const setSettings = (input: Settings) => {
    const next = validateSettings(input, defaultsFor(id));
    setState({ id, settings: next, ready: true });
    try { localStorage.setItem(keyFor(id), JSON.stringify(next)); } catch {}
    const url = new URL(location.href);
    url.searchParams.set("variant", next.variant);
    url.searchParams.set("tune", JSON.stringify(next));
    url.searchParams.delete("clean");
    history.replaceState(null, "", url);
  };
  const reset = () => {
    try { localStorage.removeItem(keyFor(id)); } catch {}
    setState({ id, settings: defaultsFor(id), ready: true });
    history.replaceState(null, "", location.pathname);
  };
  const s = settings;
  const rail = DIRECTIONS[id]?.compositions[VARIANTS.indexOf(s.variant)] === "rail";
  const type = TYPE_PROFILES[id] ?? TYPE_PROFILES["02"];
  // Every interpolated value is constrained by validateSettings; fonts are a fixed allow-list.
  const css = `.studio-surface .sys.sys-simple { --container:${s.width}px; --radius-card:${s.radius}px; --radius-cta:${Math.min(s.radius, 16)}px; ${s.accent ? `--accent:${s.accent};--blue:${s.accent};--orange:${s.accent};--brass:${s.accent};` : ""} ${s.background ? `--bg-primary:${s.background};--cream:${s.background};` : ""} ${s.ink ? `--text-primary:${s.ink};--ink:${s.ink};` : ""} ${s.bodyFont !== "original" ? `--font-body:'${s.bodyFont}',sans-serif;font-family:'${s.bodyFont}',sans-serif;` : ""} }
    .studio-surface .sys.sys-simple .sys-h1 {font-size:clamp(${(rail?2.1:2.35)*s.scale/100}rem,${(rail?2.8:type.fluid)*s.scale/100}vw,${Math.min(6,(rail?2.8:type.max)*s.scale/100)}rem);font-weight:${s.weight};letter-spacing:${s.tracking/100}em;line-height:${s.leading/100};${s.headingFont !== "original" ? `font-family:'${s.headingFont}',serif;` : ""}}
    ${s.headingFont !== "original" ? `.studio-surface .sys.sys-simple :is(.sys-h2,.sys-h3) {font-family:'${s.headingFont}',serif;}` : ""}
    .studio-surface .sys.sys-simple :is(.sys-body,.sys-hero-sub) {font-size:${s.bodySize}px;}
    .studio-surface .sys.sys-simple .sys-section {padding-block:${s.spacing}px;}
    .studio-surface .sys.sys-simple :is(.simple-api,.studio-media,.simple-specimen) {border-radius:${s.radius}px;}
    .studio-surface .sys.sys-simple .sys-cta {border-radius:${Math.min(s.radius,16)}px !important;}
    @media(max-width:767px){.studio-surface .sys.sys-simple .sys-h1{font-size:clamp(2rem,${9.2*s.scale/100}vw,3.3rem)}.studio-surface .sys.sys-simple .sys-section{padding-block:${Math.max(32,s.spacing*.7)}px}}
    ${s.motion === "off" ? `.studio-surface *, .studio-surface *::before, .studio-surface *::after {animation:none !important;transition:none !important;scroll-behavior:auto !important;}` : ""}`;
  return <Context.Provider value={{ id, settings, setSettings, reset, ready: state.ready }}><div className="studio-surface" data-variant={s.variant} data-motion={s.motion}><style>{css}</style>{children}</div></Context.Provider>;
}
