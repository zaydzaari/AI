"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { APIExample } from "@/components/system/simple";

import { motion } from "motion/react";
import { BRAND } from "@/lib/content";
import { FinalCTA, Footer, PrimaryCTA, Trust } from "@/components/system";
import { Playground, Pricing, Registry } from "./parts";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Design02() {
  const { settings: { variant } } = useStudio();
  return (
    <div className="d02 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-8">
          <a href="#" className="flex items-center gap-2 text-[1.3125rem] font-medium tracking-[-0.04em]"><BrandWordmark>{BRAND.name.toLowerCase()}</BrandWordmark></a>
          <nav aria-label="Primary" className="d02-mono ml-auto hidden gap-7 text-[0.875rem] text-[var(--text-muted)] lg:flex">
            {[

              ["Playground", "#playground"],

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
        <CompositionHero id="02" >
          {variant === "c" ? <ModelIndex /> : <APIExample />}
        </CompositionHero>

        <Playground />

        <Registry />

        <Pricing />
        <FinalCTA title="Your models. Your rules. One key." className="border-t border-[var(--border)]" />
      </main>
      <Footer />
    </div>
  );
}
