"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { useState } from "react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Reveal, Trust } from "@/components/system";
import { Specimen } from "./parts";

const ease = [0.22, 1, 0.36, 1] as const;

function FieldGuide() {
  const [row, setRow] = useState<number | null>(null);
  return (
    <section id="models" data-section className="sys-section">
      <div className="sys-container">
        <Head title="A field guide to five families." lead={`${MOCK_NOTE}. Context sizes are placeholder specs.`} />
        <div className="border-b border-[var(--text-primary)]">
          {MODELS.map((m, i) => (
            <Reveal key={m.id} i={i}>
              <div onMouseEnter={() => setRow(i)} onMouseLeave={() => setRow(null)} className="relative grid items-center gap-4 border-t border-[var(--text-primary)] py-8 md:grid-cols-[1.1fr_1.4fr_1fr_160px] md:gap-10">
                <span className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,4.6vw,4.25rem)] leading-[0.95] transition-[font-variation-settings] duration-700" style={{ fontVariationSettings: row === i ? '"SOFT" 100, "WONK" 1, "opsz" 144' : '"SOFT" 0, "WONK" 0, "opsz" 144' }}>
                  {m.name}
                </span>
                <span className="sys-body">{m.blurb}</span>
                <span className="text-[0.9375rem]">{m.variants.join(" · ")}</span>
                <span className="sys-mono text-[0.9375rem] md:text-right">
                  {m.context} ctx
                  <br />
                  <span className="text-[var(--text-muted)]">
                    ${m.inPrice}/${m.outPrice} · 1M
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Design12() {
  const { settings: { variant } } = useStudio();
  return (
    <div className="d12 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="sys-container flex h-full items-center gap-8">
          <a href="#" className="d12-serif text-[1.5rem]"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="ml-auto hidden gap-7 text-[.875rem] md:flex">
            <a href="#product">Product</a><a href="#models">Models</a><a href="#pricing">Pricing</a>
          </nav>
          <HeaderAccess />
        </div>
      </header>
      <main>
        <CompositionHero id="12" anchor="product">
          {variant === "b" ? <ModelIndex /> : <div className="simple-specimen sys-invert"><Specimen compact /></div>}
        </CompositionHero>
        <FieldGuide />
        <Plans title="Choose how you use it." layout="editorial" />
        <FinalCTA title="Bring your next idea." />
      </main>
      <Footer />
    </div>
  );
}
