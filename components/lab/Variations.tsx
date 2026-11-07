"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DESIGNS } from "@/lib/designs";
import { DIRECTIONS, VARIANTS } from "@/lib/studio";
import { ScaledFrame } from "./ScaledFrame";
import "./library.css";

export function Variations() {
  const [id,setId] = useState("01");
  const [width,setWidth] = useState(1440);
  const [favorite,setFavorite] = useState("");
  useEffect(() => { const p = new URLSearchParams(location.search).get("id"); if (p && DIRECTIONS[p]) setId(p); },[]);
  useEffect(() => { try {setFavorite(localStorage.getItem(`aether-favorite:${id}`)||"");}catch{} },[id]);
  const choose = (value:string) => {setId(value);history.replaceState(null,"",`?id=${value}`);};
  const d = DIRECTIONS[id];
  return <main className="lab-library variation-page">
    <header className="library-nav"><Link href="/designs">← Design gallery</Link><Link href="/designs/inspiration">Reference library</Link><span>Local studio</span></header>
    <div className="variation-heading"><div><h1>Three ways to say it.</h1><p>{d.intent}</p></div><div className="variation-selectors"><label>Concept<select value={id} onChange={e=>choose(e.target.value)}>{DESIGNS.map(d=><option key={d.id} value={d.id}>{d.id} {d.name}</option>)}</select></label><label>Viewport<select value={width} onChange={e=>setWidth(+e.target.value)}><option value={1440}>Desktop · 1440</option><option value={768}>Tablet · 768</option><option value={390}>Mobile · 390</option></select></label></div></div>
    <div className="variation-grid">{VARIANTS.map((v,i)=><article key={`${id}-${v}`}><div className="variation-title"><h2>{v.toUpperCase()} · {d.names[i]}</h2><button aria-pressed={favorite===v} onClick={()=>{const next=favorite===v?"":v;setFavorite(next);try{localStorage.setItem(`aether-favorite:${id}`,next);}catch{}}}>{favorite===v?"Saved choice":"Keep this one"}</button></div><div className="variation-frame"><ScaledFrame src={`/designs/${id}?variant=${v}&clean=1`} virtualWidth={width} title={`${d.names[i]} preview`}/></div><Link className="variation-open" href={`/designs/${id}?variant=${v}&clean=1`}>Open {d.names[i]} & tweak ↗</Link></article>)}</div>
    <p className="library-note">Each preview scrolls independently. A saved choice is a local bookmark; open a composition to adjust and save its design settings.</p>
  </main>;
}
