"use client";

import { useState } from "react";
import { MODELS, PROMPTS } from "@/lib/content";
import { DIRECTIONS, VARIANTS, ASSETS } from "@/lib/studio";
import { PrimaryCTA } from "@/components/system";
import { useStudio } from "./StudioProvider";

export function CompositionHero({ children, id, anchor }: { children: React.ReactNode; id: string; anchor?: string }) {
  const { settings: s } = useStudio();
  const d = DIRECTIONS[id];
  const layout = d.compositions[VARIANTS.indexOf(s.variant)];
  const image = s.image === "auto" ? (layout === "plate" ? "night-atlas" : "none") : s.image;
  const asset = ASSETS.find(a => a.id === image);
  return <section id={anchor} data-hero className={`sys-hero studio-hero studio-layout-${layout}`}>
    <div className="sys-container studio-composition">
      <div className="studio-copy">
        <h1 data-hero-part="headline" className="sys-h1">{id === "01" ? <><span className="field-title-line">Every model.</span><span className={s.headingFont === "original" ? "field-title-line field-title-serif" : "field-title-line"}>One thread.</span></> : d.title}</h1>
        <p data-hero-part="sub" className="sys-hero-sub">{d.lead}</p>
        <PrimaryCTA>Request early access</PrimaryCTA>
      </div>
      <div data-hero-part="visual" data-ui className="studio-media">{children}</div>
      {asset && <figure className="studio-art" style={{ height: s.imageHeight }}><img src={`/studio-assets/${asset.id}.png`} alt={asset.description} width="1672" height="941" /><figcaption className="sr-only">{asset.name} — generated art direction study</figcaption></figure>}
    </div>
  </section>;
}

export function ModelIndex() {
  const [selected,setSelected] = useState(0);
  return <div className="studio-index"><p className="sys-small">Illustrative model specifications</p>{MODELS.map((m,i) => <button key={m.id} onClick={() => setSelected(i)} aria-pressed={selected === i}><strong>{m.name}</strong><span>{m.role}</span><span>{m.context}</span></button>)}<p className="studio-index-detail">{MODELS[selected].blurb}</p></div>;
}

export function WritingSample() {
  const [voice,setVoice] = useState(0);
  const choices = ["Standard", "Low refusal", "Abliterated"];
  const output = ["The city had forgotten my name. Tonight, I would remind it.", "You call this a kingdom. I call it a door that has been locked too long.", "Keep your crown. I came for the room beneath the throne."];
  return <div className="studio-writing"><p>Write a villain’s opening line.</p><div className="studio-task-tabs" aria-label="Writing variant">{choices.map((x,i) => <button key={x} aria-pressed={voice===i} onClick={() => setVoice(i)}>{x}</button>)}</div><blockquote>{output[voice]}</blockquote><p className="sys-small">Simulated output · same prompt, different voice</p></div>;
}

export function GuidedExample({ render }: { render: (i:number) => React.ReactNode }) {
  const [picked,setPicked] = useState(0);
  return <div><div className="studio-task-tabs" aria-label="Example task">{PROMPTS.slice(0,3).map((p,i) => <button key={p.label} aria-pressed={picked===i} onClick={() => setPicked(i)}>{p.label}</button>)}</div>{render(picked)}<p className="sys-small studio-example-note">Illustrative conversation · simulated output</p></div>;
}
