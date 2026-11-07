"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { ModelList } from "@/components/system/simple";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { BRAND } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Reveal, Trust } from "@/components/system";
import { Builder, Console } from "./parts";

export default function Design10() {
  const { settings: { variant } } = useStudio();
  return (
    <div id="top" className="d10 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] bg-[var(--bg-primary)]/85 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-4">
          <a href="#" className="flex items-center gap-2 text-[1.0625rem] font-semibold tracking-[-0.02em]"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="ml-auto hidden gap-6 text-[0.9375rem] text-[var(--text-muted)] lg:flex">
            {[

              ["Models", "#models"],
              ["API", "#api"],
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
        <CompositionHero id="10" anchor={variant === "b" ? "api" : undefined}>
          {variant === "b" ? <Builder /> : <Console />}
        </CompositionHero>

        {variant === "b" ? (
        <section id="product" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Keep the conversation." lead="Choose a prompt and compare models. Responses are simulated." />
            <Reveal>
              <Console />
            </Reveal>
          </div>
        </section>
        ) : (
        <section id="api" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Build the request. Copy it. Ship." lead="Pick a model, a variant and options; the request writes itself." />
            <Reveal>
              <Builder />
            </Reveal>
          </div>
        </section>
        )}
        <ModelList />

        <Plans title="Plans for how you'll use it." />
        <FinalCTA title="Try Aether when it opens." />
      </main>
      <Footer />
    </div>
  );
}
