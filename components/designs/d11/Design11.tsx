"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { ModelList } from "@/components/system/simple";

import { motion } from "motion/react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Reveal, Trust } from "@/components/system";
import { Glass, HeroSlab, Wipe } from "./parts";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Design11() {
  const { settings: { variant } } = useStudio();
  return (
    <div className="d11 sys sys-simple relative min-h-screen overflow-x-clip">

      <header className="sticky top-0 z-40 flex h-[var(--nav-h)] items-center px-4">
        <Glass className="mx-auto flex w-full max-w-[1200px] items-center gap-6 rounded-full py-1.5 pl-6 pr-1.5">
          <a href="#" className="text-[1.0625rem] font-bold tracking-[-0.03em]"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="ml-auto hidden gap-7 text-[0.9375rem] text-[var(--text-muted)] md:flex">
            {[

              ["Compare", "#compare"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <HeaderAccess />
        </Glass>
      </header>

      <main className="relative z-10">
        <CompositionHero id="11" anchor={variant !== "b" ? "compare" : undefined}>
          {variant === "b" ? <HeroSlab /> : <Wipe />}
        </CompositionHero>

        {variant === "b" && (
        <section id="compare" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Same prompt. Different temperament." lead="Drag the divider — or focus it and use the arrow keys — to compare a standard model with an abliterated one on a fiction prompt. Simulated output." />
            <Reveal>
              <Wipe />
            </Reveal>
          </div>
        </section>
        )}

        <ModelList />

        <Plans title="Pricing, without the fine print." />
        <FinalCTA title="Intelligence, unbound." />
      </main>
      <Footer />
    </div>
  );
}
