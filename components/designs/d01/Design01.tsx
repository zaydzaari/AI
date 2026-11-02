"use client";

import { motion } from "motion/react";
import { BRAND } from "@/lib/content";
import { Bento, FinalCTA, Footer, HowItWorks, PrimaryCTA, ProblemSolution, Proof, Trust } from "@/components/system";
import { HeroTranscript, Ledger, Specimens, Story } from "./parts";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Design01() {
  return (
    <div className="d01 sys min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-8">
          <a href="#" className="d01-display flex items-baseline gap-2 text-[1.375rem] leading-none">
            {BRAND.name}
            <span className="d01-serif text-[1rem] font-normal italic text-[var(--text-muted)]">field notes</span>
          </a>
          <nav aria-label="Primary" className="ml-4 hidden gap-7 text-[0.9375rem] text-[var(--text-muted)] md:flex">
            {[
              ["Why", "#why"],
              ["Features", "#features"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="ml-auto rounded-full border border-[var(--text-primary)] px-4 py-2 text-[0.875rem] font-semibold">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section data-hero className="sys-hero">
          <div className="sys-container grid h-full min-h-0 items-center gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div className="flex flex-col gap-5 md:gap-7">
              <motion.h1 data-hero-part="headline" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }} className="sys-h1 d01-display">
                Every model. One thread. Your rules.
              </motion.h1>
              <motion.p data-hero-part="sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.15 }} className="sys-hero-sub">
                Chat with five model families — standard, low-refusal or abliterated — and switch mid-conversation without losing context. The same models answer your code through one key.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <PrimaryCTA>Start your first thread</PrimaryCTA>
              </motion.div>
              <Trust className="pt-1" />
            </div>
            <div data-hero-part="visual" className="d01-peek relative min-h-0 max-lg:max-h-[110px] max-lg:overflow-hidden">
              <HeroTranscript />
            </div>
          </div>
        </section>

        <ProblemSolution variant="ledger" />
        <Bento layout="mosaic" title="What each part of the platform does for you." />
        <Story />
        <HowItWorks variant="rail" />
        <Specimens />
        <Proof variant="grid" />
        <Ledger />
        <FinalCTA title="Start a thread with every model at once." className="border-t border-[var(--border)]" />
      </main>
      <Footer />
    </div>
  );
}
