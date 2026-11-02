"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Reveal, Trust } from "@/components/system";
import { Product, Wordmark } from "./parts";

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
  return (
    <div className="d04 sys min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--text-primary)] bg-[var(--bg-primary)]">
        <div className="grid h-full grid-cols-[1fr_auto] items-stretch md:grid-cols-[200px_1fr_auto]">
          <a href="#" className="d04-wide flex items-center px-5 text-[1.125rem] uppercase md:border-r md:border-[var(--text-primary)]">
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="sys-mono hidden items-center gap-8 px-8 text-[0.875rem] md:flex">
            {[
              ["Why", "#why"],
              ["Product", "#product"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="d04-link">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="sys-mono flex items-center border-l border-[var(--text-primary)] px-6 text-[0.875rem] hover:bg-[var(--bg-secondary)]">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section data-hero className="sys-hero !justify-start !py-0">
          <div data-hero-part="visual" className="px-3 pt-6 md:px-6 md:pt-8">
            <Wordmark />
          </div>
          <div className="mt-4 grid flex-1 border-t border-[var(--text-primary)] md:mt-6 md:grid-cols-[200px_1fr]">
            <div className="hidden border-r border-[var(--text-primary)] p-6 md:block">
              <ArrowDownRight size={28} strokeWidth={1.25} aria-hidden />
            </div>
            <div className="flex flex-col justify-center gap-5 px-5 py-6 md:gap-7 md:px-10">
              <motion.h1 data-hero-part="headline" {...wipe} className="sys-h1 !max-w-[18ch]">
                One account for every AI model you use.
              </motion.h1>
              <motion.p data-hero-part="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="sys-hero-sub">
                Five model families in one chat, one agent runtime and one API — each with standard, low-refusal and abliterated variants, priced per token in the open.
              </motion.p>
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
                <PrimaryCTA className="!rounded-none">Request access</PrimaryCTA>
                <Trust />
              </div>
            </div>
          </div>
        </section>

        <ProblemSolution variant="ledger" />
        <Bento layout="offset" title="Features, and what they are for." />
        <section id="product" data-section className="sys-section border-t border-[var(--text-primary)]">
          <div className="sys-container">
            <Head title="Pick a model. Pick a temperament." lead="Choose a prompt, a model and a variant. Responses are simulated." />
            <Reveal>
              <Product />
            </Reveal>
          </div>
        </section>
        <HowItWorks variant="rail" />
        <ModelColumns />
        <Proof variant="tabs" />
        <Plans />
        <FinalCTA title="Begin with one key." align="left" className="border-t border-[var(--text-primary)]" />
      </main>
      <Footer />
    </div>
  );
}
