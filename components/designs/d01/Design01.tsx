"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero } from "@/components/lab/CompositionHero";
import { ModelList } from "@/components/system/simple";
import { ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/content";
import { FinalCTA, Footer } from "@/components/system";
import { HeroTranscript, Ledger } from "./parts";

const handoff = [
  { model: "Core", title: "Draft the premise", description: "Turn a heist prompt into a story about retired librarians." },
  { model: "Unbound", title: "Change the tone", description: "Ask for a darker archivist while keeping the story in view." },
  { model: "Forge", title: "Shape the output", description: "Turn the same story into structured data for the next step." },
];

export default function Design01() {
  return (
    <div className="d01 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-8">
          <a href="#" className="d01-display flex items-baseline gap-2 text-[1.375rem] leading-none"><BrandWordmark>{BRAND.name}</BrandWordmark><span className="field-header-note">field notes</span></a>
          <nav aria-label="Primary" className="ml-4 hidden gap-7 text-[0.9375rem] text-[var(--text-muted)] md:flex">
            {[

              ["Product", "#product"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <HeaderAccess />
        </div>
      </header>

      <main>
        <CompositionHero id="01">
          <HeroTranscript />
        </CompositionHero>

        <section id="product" data-section className="sys-section field-workflow">
          <div className="sys-container field-workflow-layout">
            <div className="field-workflow-intro">
              <h2 className="sys-h2">One conversation, three jobs.</h2>
              <p className="sys-body">Follow the model changes in the example above, from the first draft to structured output.</p>
              <a className="simple-text-link" href="#models">Explore the model families <ArrowUpRight size={15} aria-hidden /></a>
            </div>
            <ol className="field-workflow-list">
              {handoff.map(({ model, title, description }, index) => (
                <li key={model}>
                  <span className="field-workflow-number" aria-hidden="true">0{index + 1}</span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                  <span className="field-workflow-model">{model}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ModelList title="Five families. Your choice." />

        <Ledger />
        <FinalCTA title="Start your first thread." className="field-signup" />
      </main>
      <Footer />
    </div>
  );
}
