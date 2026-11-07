"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { ModelList } from "@/components/system/simple";

import { BRAND } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Trust } from "@/components/system";
import { ChatWindow, Glass } from "./parts";

const ease = [0.2, 0.9, 0.25, 1] as const;

export default function Design03() {
  const { settings: { variant } } = useStudio();
  return (
    <div className="d03 sys sys-simple relative min-h-screen overflow-x-clip">
      <header className="sticky top-0 z-40 flex h-[var(--nav-h)] items-center justify-center px-4">
        <Glass strong className="flex w-full max-w-[880px] items-center gap-2 rounded-full py-1.5 pl-5 pr-1.5">
          <a href="#" className="flex items-center gap-2 text-[1rem] font-semibold tracking-[-0.02em]"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="ml-auto hidden gap-1 text-[0.9375rem] text-[var(--text-muted)] md:flex">
            {[

              ["Chat", "#product"],

              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/80 hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <HeaderAccess />
        </Glass>
      </header>

      <main className="relative">
        <CompositionHero id="03" anchor="product">
          <ChatWindow />
        </CompositionHero>

        <ModelList />

        <Plans />
        <FinalCTA title="Explore intelligence without limits." />
      </main>
      <Footer />
    </div>
  );
}
