"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Reveal, Trust } from "@/components/system";
import { Product } from "./parts";

const wipe = { initial: { clipPath: "inset(0 100% 0 0)" }, animate: { clipPath: "inset(0 0% 0 0)" }, transition: { duration: 1.1, ease: [0.77, 0, 0.18, 1] as const } };

function ModelColumns() {
  const [pick, setPick] = useState(3);
  const m = MODELS[pick];
  return (
    <section id="models" data-section className="sys-section border-t border-[var(--text-primary)]">
      <div className="sys-container">
        <Head title="Five families. Read the numbers." lead={`${MOCK_NOTE}. Context sizes are placeholder specs.`} />
        <div className="grid grid-cols-2 border-l border-t border-[var(--text-primary)] sm:grid-cols-3 lg:grid-cols-5">
          {MODELS.map((x, i) => (
            <button
              key={x.id}
              onClick={() => setPick(i)}
              onMouseEnter={() => setPick(i)}
              aria-pressed={pick === i}
              className={`flex min-h-[300px] flex-col justify-between border-b border-r border-[var(--text-primary)] p-8 text-left transition-colors duration-300 ${pick === i ? "bg-[var(--text-primary)] text-[var(--bg-primary)]" : "hover:bg-[var(--bg-secondary)]"}`}
            >
              <span className="sys-mono text-[0.875rem]">{x.role}</span>
              <span className="d04-display text-[clamp(3rem,4.4vw,4.5rem)] leading-[0.85]" style={{ fontVariationSettings: `"wdth" ${pick === i ? 62 : 96}, "wght" 860`, transition: "font-variation-settings .6s cubic-bezier(.77,0,.18,1)" }}>
                {x.context}
              </span>
              <span className="d04-wide text-[1.25rem] uppercase">{x.name}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={pick} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="grid gap-4 border-x border-b border-[var(--text-primary)] p-8 md:grid-cols-[1fr_auto] md:items-center">
            <p className="sys-body sys-body-strong">{m.blurb}</p>
            <span className="sys-mono text-[0.9375rem]">
              ${m.inPrice} in · ${m.cached} cached · ${m.outPrice} out / 1M (sample)
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function Design04() {
  const { settings: { variant } } = useStudio();
  return (
    <div className="d04 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--text-primary)] bg-[var(--bg-primary)]">
        <div className="grid h-full grid-cols-[1fr_auto] items-stretch md:grid-cols-[200px_1fr_auto]">
          <a href="#" className="d04-wide flex items-center px-5 text-[1.125rem] uppercase md:border-r md:border-[var(--text-primary)]"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="sys-mono hidden items-center gap-8 px-8 text-[0.875rem] md:flex">
            {[

              ["Product", "#product"],

              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="d04-link">
                {l}
              </a>
            ))}
          </nav>
          <HeaderAccess />
        </div>
      </header>

      <main>
        <CompositionHero id="04" anchor={variant === "b" ? "product" : undefined}>
          {variant === "b" ? <Product /> : <ModelIndex />}
        </CompositionHero>

        {variant !== "b" && (
        <section id="product" data-section className="sys-section border-t border-[var(--text-primary)]">
          <div className="sys-container">
            <Head title="Pick a model. Pick a temperament." lead="Choose a prompt, a model and a variant. Responses are simulated." />
            <Reveal>
              <Product />
            </Reveal>
          </div>
        </section>
        )}

        <ModelColumns />

        <Plans layout="ledger" />
        <FinalCTA title="Begin with one key." align="left" className="border-t border-[var(--text-primary)]" />
      </main>
      <Footer />
    </div>
  );
}
