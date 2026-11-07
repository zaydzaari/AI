"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { ModelList } from "@/components/system/simple";

import { motion } from "motion/react";
import { BRAND, MOCK_NOTE } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Reveal, Trust } from "@/components/system";
import { Log } from "./parts";

export default function Design08() {
  const { settings: { variant } } = useStudio();
  return (
    <div className="d08 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-8">
          <a href="#" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[1.625rem] italic"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="ml-auto hidden gap-8 text-[0.9375rem] text-[var(--text-muted)] md:flex">
            {[

              ["Log", "#log"],

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
        <CompositionHero id="08" anchor="log">
          <Log />
        </CompositionHero>



        <ModelList title="Five models. Different strengths." />

        <Plans title="Begin small. Grow when you need to." layout="editorial" />
        <section className="relative overflow-hidden">
          <FinalCTA title="Look further." className="relative" />
        </section>
      </main>
      <Footer mark={<span className="italic">{BRAND.name}</span>} />
    </div>
  );
}
