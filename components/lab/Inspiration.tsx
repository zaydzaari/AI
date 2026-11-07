"use client";
import { useState } from "react";
import Link from "next/link";
import { REFERENCES } from "@/lib/inspiration";
import { ASSETS, briefFor } from "@/lib/studio";
import { DESIGNS } from "@/lib/designs";
import prompts from "@/docs/asset-prompts.json";
import "./library.css";

export function Inspiration(){
  const [filter,setFilter]=useState("All");
  const [status,setStatus]=useState("");
  const [concept,setConcept]=useState("01");
  const copy=async(text:string)=>{try{await navigator.clipboard.writeText(text);setStatus("Copied to clipboard.");}catch{setStatus("Clipboard unavailable. Select the text to copy it.");}};
  const tags=["All",...new Set(REFERENCES.flatMap(r=>r.tags))];
  return <main className="lab-library">
    <header className="library-nav"><Link href="/designs">← Design gallery</Link><Link href="/designs/variations">Composition board</Link><span>Local reference library</span></header>
    <div className="library-intro"><h1>Collect the decisions.</h1><p>Hero and body references, a vocabulary for what works, and reusable briefs. These are studies of the three sites you chose, captured 3 November 2026.</p></div>
    <nav className="library-filters" aria-label="Reference style">{tags.map(tag=><button key={tag} aria-pressed={filter===tag} onClick={()=>setFilter(tag)}>{tag}</button>)}</nav>
    <div className="reference-list">{REFERENCES.filter(r=>filter==="All"||r.tags.includes(filter)).map(r=><article className="reference-study" key={r.id}><div className="reference-captures"><a href={r.url} target="_blank" rel="noreferrer"><img src={`/inspiration/${r.id}-hero.jpg`} alt={`${r.name} hero reference capture`} width="1440" height="900" /></a><details><summary>View body reference</summary><img src={`/inspiration/${r.id}-body.jpg`} alt={`${r.name} body section capture`} width="1440" height="900"/></details></div><div className="reference-notes"><h2><a href={r.url} target="_blank" rel="noreferrer">{r.name} ↗</a></h2><p className="reference-tags">{r.tags.join(" · ")}</p><h3>What to borrow</h3><p>{r.take}</p><h3>Beyond the hero</h3><p>{r.body}</p><h3>Keep it your own</h3><p>{r.avoid}</p><button onClick={()=>copy(r.brief)}>Copy reference brief</button></div></article>)}</div>
    <section className="library-brief"><div><h2>A brief with a point of view.</h2><p>Aesthetic, reference, intent and guardrails — written separately for all twelve concepts.</p><label>Concept<select value={concept} onChange={e=>setConcept(e.target.value)}>{DESIGNS.map(d=><option key={d.id} value={d.id}>{d.id} {d.name}</option>)}</select></label><button onClick={()=>copy(briefFor(concept))}>Copy complete brief</button></div><pre>{briefFor(concept)}</pre></section>
    <section className="library-assets"><h2>Four image directions.</h2><p>Generated locally for this exploration with the built-in image tool. Select any alternative from a page’s Tweak panel. Product-led compositions use their interface by default.</p><div className="asset-grid">{ASSETS.map((a,i)=><article key={a.id}><img src={`/studio-assets/${a.id}.png`} alt={a.description} width="1672" height="941" loading="lazy"/><h3>{a.name}</h3><p>{a.description}</p><button onClick={()=>copy(prompts.prompts?.[i]?.[1] ?? a.description)}>Copy image prompt</button></article>)}</div></section>
    <section className="library-method"><h2>The workflow, kept here.</h2><ol><li>Collect hero and body references. Name the useful decisions.</li><li>Write aesthetic, reference, intent and guardrails into a reusable brief.</li><li>Explore distinct directions, then three compositions of each.</li><li>Generate four image alternatives and choose deliberately.</li><li>Tweak the actual page; compare, save, export and review at three widths.</li></ol><div><a href="https://www.youtube.com/watch?v=7FU98O0JLHs" target="_blank" rel="noreferrer">Chase AI · source video ↗</a><a href="https://impeccable.style/" target="_blank" rel="noreferrer">Impeccable ↗</a><a href="https://github.com/Leonxlnx/taste-skill" target="_blank" rel="noreferrer">Taste guidance ↗</a><a href="https://21st.dev/" target="_blank" rel="noreferrer">21st.dev component inspiration ↗</a></div><p>Impeccable and Taste are installed in this project. Their craft guidance is adapted to your simpler references. Higgsfield requires its own connection; these four assets use the available built-in generator.</p></section>
    <footer className="library-note">Reference captures belong to their respective sites and are kept here for private design study. Aether is a fictional product preview. Nothing is published or sent to GitHub.</footer><div className="library-copy-status" role="status">{status}</div>
  </main>;
}
