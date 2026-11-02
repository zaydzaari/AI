"use client";

import { motion } from "motion/react";
import { BRAND, MOCK_NOTE } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Reveal, Trust } from "@/components/system";
import { Horizon, Log, Orrery, StarField } from "./parts";

export default function Design08() {
  return (
    <div className="d08 sys min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-8">
          <a href="#" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[1.625rem] italic">
            <span aria-hidden className="text-[var(--brass)]">✦</span> {BRAND.name}
          </a>
          <nav aria-label="Primary" className="ml-auto hidden gap-8 text-[0.9375rem] text-[var(--text-muted)] md:flex">
            {[
              ["Why", "#why"],
              ["Log", "#log"],
              ["How it works", "#how"],
              ["Orbits", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="ml-auto rounded-full border border-[var(--border)] px-4 py-2 text-[0.875rem] hover:border-[var(--text-primary)] md:ml-0">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section data-hero className="sys-hero !items-center">
          <div data-hero-part="visual" className="absolute inset-0" aria-hidden>
            <StarField />
            <Horizon className="-bottom-[2px] h-[30vh]" />
          </div>
          <div className="sys-container relative flex flex-col items-center gap-5 text-center md:gap-7">
            <motion.h1 data-hero-part="headline" initial={{ opacity: 0, filter: "blur(14px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.8, delay: 0.1 }} className="sys-h1 !max-w-[14ch]">
              Reach every AI model from one place.
            </motion.h1>
            <motion.p data-hero-part="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1.2 }} className="sys-hero-sub">
              Chat with five model families, send agents into your code, or call them from your own software — each with standard, low-refusal or abliterated variants.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              <PrimaryCTA>Request access</PrimaryCTA>
            </motion.div>
            <Trust className="justify-center" />
          </div>
        </section>

        <ProblemSolution variant="split" />
        <Bento layout="mosaic" title="Eight capabilities, and what each brings within reach." />
        <section id="log" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Point the lens anywhere." lead="Choose an entry, switch models mid-observation, change the variant. The thread stays intact. Responses are simulated." />
            <Reveal>
              <Log />
            </Reveal>
          </div>
        </section>
        <HowItWorks variant="rail" />
        <section id="models" data-section className="sys-section relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_40%_50%,rgba(27,61,122,.45),transparent)]" />
          <div className="sys-container relative">
            <Head title="Wider orbit, longer memory." lead={`Each family orbits at a distance set by its context window. Hover or tap a body to inspect it. ${MOCK_NOTE}.`} />
            <Orrery />
          </div>
        </section>
        <Proof variant="tabs" title="Who looks through the lens." />
        <Plans title="Begin small. Grow when you need to." />
        <section className="relative overflow-hidden">
          <StarField density={0.00012} />
          <FinalCTA title="Look further." className="relative" />
        </section>
      </main>
      <Footer mark={<span className="italic">{BRAND.name}</span>} />
    </div>
  );
}
