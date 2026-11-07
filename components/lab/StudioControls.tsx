"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, LayoutGrid, Minus } from "lucide-react";
import { DESIGNS, neighbours } from "@/lib/designs";
import { ASSETS, DIRECTIONS, FONTS, VARIANTS, briefFor, defaultsFor, validateSettings, type Settings } from "@/lib/studio";
import { useStudio } from "./StudioProvider";

export function StudioControls() {
  const { id, settings: s, setSettings, reset } = useStudio();
  const router = useRouter();
  const [embedded, setEmbedded] = useState(true);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [status, setStatus] = useState("");
  const [palette, setPalette] = useState({ accent: "#333333", background: "#ffffff", ink: "#111111" });
  const trigger = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLButtonElement>(null);
  const { prev, next } = neighbours(id);
  const d = DIRECTIONS[id];
  useEffect(() => { setEmbedded(window.self !== window.top); }, []);
  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const style = getComputedStyle(document.querySelector(".sys")!);
    const asHex = (v: string, fallback: string) => /^#[\da-f]{6}$/i.test(v.trim()) ? v.trim() : fallback;
    setPalette({ accent: asHex(style.getPropertyValue("--accent"), "#333333"), background: asHex(style.getPropertyValue("--bg-primary"), "#ffffff"), ink: asHex(style.getPropertyValue("--text-primary"), "#111111") });
  }, [open, id]);
  useEffect(() => { setStatus(""); }, [id]);
  useEffect(() => {
    if (embedded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) { setOpen(false); trigger.current?.focus(); return; }
      const target = e.target as HTMLElement;
      if (["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(target.tagName) || target.isContentEditable || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === ".") setHidden(x => !x);
      if (e.key === "g") router.push("/designs");
      if (e.key === "[") router.push(`/designs/${prev.id}`);
      if (e.key === "]") router.push(`/designs/${next.id}`);
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [embedded, open, router, prev.id, next.id]);
  if (embedded || !d) return null;
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings({ ...s, [key]: value });
  const copy = async (text: string, success: string) => { try { await navigator.clipboard.writeText(text); setStatus(success); } catch { setStatus("Clipboard unavailable. Export the settings instead."); } };
  const exportSettings = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, design: id, settings: s, brief: briefFor(id, s) }, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = `aether-${id}-${s.variant}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus("Settings exported.");
  };
  const range = (key: "scale" | "bodySize" | "weight" | "tracking" | "leading" | "spacing" | "width" | "radius" | "imageHeight", label: string, min: number, max: number, step = 1, unit = "") => <label className="studio-range" key={key}><span>{label}<output>{s[key]}{unit}</output></span><input aria-label={label} type="range" min={min} max={max} step={step} value={s[key]} onChange={e => update(key, +e.target.value)} /></label>;
  return <div data-dock className="studio-chrome">
    {hidden ? <button className="studio-reopen" onClick={() => setHidden(false)} aria-label="Show design studio">Studio {id}</button> : <nav className="studio-toolbar" aria-label="Design studio">
      <Link href="/designs" aria-label="Gallery"><LayoutGrid size={16} /></Link>
      <Link href={`/designs/${prev.id}`} aria-label="Previous design"><ChevronLeft size={16} /></Link>
      <select aria-label="Design" value={id} onChange={e => router.push(`/designs/${e.target.value}`)}>{DESIGNS.map(d => <option key={d.id} value={d.id}>{d.id} {d.name}</option>)}</select>
      <Link href={`/designs/${next.id}`} aria-label="Next design"><ChevronRight size={16} /></Link>
      <div className="studio-variant-buttons" aria-label="Composition">{VARIANTS.map((v,i) => <button key={v} aria-label={`Composition ${v.toUpperCase()}: ${d.names[i]}`} aria-pressed={s.variant === v} title={d.names[i]} onClick={() => update("variant",v)}>{v.toUpperCase()}</button>)}</div>
      <button ref={trigger} aria-expanded={open} aria-controls="studio-panel" onClick={() => setOpen(x => !x)}><SlidersHorizontal size={15} /><span>Tweak</span></button>
      <button onClick={() => { setHidden(true); setOpen(false); }} aria-label="Hide studio"><Minus size={15} /></button>
    </nav>}
    {open && <aside id="studio-panel" className="studio-panel" aria-label="Live design controls">
      <div className="studio-panel-head"><div><h2>{DESIGNS.find(x => x.id === id)?.name}</h2><p>{d.names[VARIANTS.indexOf(s.variant)]}</p></div><button ref={first} onClick={() => { setOpen(false); trigger.current?.focus(); }} aria-label="Close live controls"><X size={18} /></button></div>
      <p className="studio-intent">{d.intent}</p>
      <div className="studio-panel-links"><Link href={`/designs/variations?id=${id}`}>Compare all three</Link><Link href="/designs/inspiration">Reference library</Link></div>
      <fieldset><legend>Typography</legend>{(["headingFont", "bodyFont"] as const).map((key,i) => <label className="studio-select" key={key}>{i ? "Body font" : "Heading font"}<select value={s[key]} onChange={e => update(key,e.target.value)}>{FONTS.map(([font,name]) => <option key={font} value={font}>{name}</option>)}</select></label>)}
        {range("scale","Heading scale",75,125,5,"%")}{range("bodySize","Body size",16,20,1,"px")}{range("weight","Heading weight",400,800,10)}{range("tracking","Heading tracking",-4,0,1," / 100em")}{range("leading","Heading line height",95,125,1,"%")}
      </fieldset>
      <fieldset><legend>Colour</legend><div className="studio-colors">{(["accent","background","ink"] as const).map(key => <label key={key}><input type="color" aria-label={`${key} colour`} value={s[key] || palette[key]} onChange={e => update(key,e.target.value)} /><span>{key}</span></label>)}</div><button className="studio-text-button" onClick={() => setSettings({ ...s, accent:"",background:"",ink:"" })}>Restore original colours</button></fieldset>
      <fieldset><legend>Layout & motion</legend>{range("spacing","Section spacing",36,100,4,"px")}{range("width","Content width",960,1440,40,"px")}{range("radius","Corner radius",0,24,2,"px")}<label className="studio-select">Motion<select value={s.motion} onChange={e => update("motion",e.target.value as Settings["motion"])}><option value="subtle">Subtle · respect device preference</option><option value="off">Off</option></select></label></fieldset>
      <fieldset><legend>Art direction</legend><label className="studio-select">Image alternative<select value={s.image} onChange={e => update("image",e.target.value)}><option value="auto">Composition default</option><option value="none">Product only</option>{ASSETS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></label>{range("imageHeight","Image height",160,440,20,"px")}<p>Four locally generated alternatives. The product demo stays usable.</p></fieldset>
      <div className="studio-actions"><button onClick={() => copy(briefFor(id,s),"Design brief copied.")}>Copy brief</button><button onClick={() => copy(location.href,"Local preview link copied.")}>Copy link</button><button onClick={exportSettings}>Export JSON</button><label className="studio-import">Import JSON<input aria-label="Import settings JSON" type="file" accept="application/json,.json" onChange={async e => { const f=e.target.files?.[0]; if(!f) return; try { if(f.size>50000) throw Error(); const json=JSON.parse(await f.text()); if(json.design && json.design !== id) {setStatus(`That file belongs to design ${json.design}. Open that design to import it.`);return;} setSettings(validateSettings(json.settings ?? json, defaultsFor(id)));setStatus("Settings imported.");} catch {setStatus("Could not read this settings file. Choose an exported JSON file under 50 KB.");} finally {e.target.value="";} }} /></label></div>
      <button className="studio-reset" onClick={() => { reset();setStatus("This concept is back to its original settings."); }}>Reset this concept</button>
      <p className="studio-status" role="status">{status || "Saved in this browser, separately for each concept. Links work on this local server."}</p>
    </aside>}
  </div>;
}
