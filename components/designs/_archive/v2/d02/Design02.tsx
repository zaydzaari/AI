"use client";

import { motion } from "motion/react";
import { BRAND } from "@/lib/content";
import { Bento, FinalCTA, Footer, HowItWorks, PrimaryCTA, ProblemSolution, Proof, Trust } from "@/components/system";
import { GlyphField } from "./GlyphField";
import { Playground, Pricing, Registry } from "./parts";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Design02() {
  return (
    <div className="d02 sys min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-8">
          <a href="#" className="flex items-center gap-2 text-[1.3125rem] font-medium tracking-[-0.04em]">
            <span className="d02-mono text-[0.875rem] text-[var(--text-muted)]">{"//"}</span>
            {BRAND.name.toLowerCase()}
          </a>
          <nav aria-label="Primary" className="d02-mono ml-auto hidden gap-7 text-[0.875rem] text-[var(--text-muted)] lg:flex">
            {[
              ["Why", "#why"],
              ["Playground", "#playground"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="d02-mono ml-auto rounded-[6px] border border-[var(--border)] px-3.5 py-2 text-[0.875rem] hover:border-[var(--text-primary)] lg:ml-6">
            Docs
          </a>
        </div>
      </header>

      <main>
        <section data-hero className="sys-hero">
          <div data-hero-part="visual" className="absolute inset-0" aria-hidden>
            <GlyphField mask="left" base="rgba(201,183,156,0.26)" hot="rgba(142,162,255,0.95)" />
          </div>
          <div className="sys-container relative flex flex-col gap-4 md:gap-7">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="d02-mono text-[0.9375rem] text-[var(--text-muted)] max-md:hidden">
              $ curl {BRAND.apiBase.replace("https://", "")}/models
            </motion.p>
            <motion.h1 data-hero-part="headline" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, ease }} className="sys-h1 !max-w-[13ch]">
              Build with every model, minus the second-guessing.
            </motion.h1>
            <motion.p data-hero-part="sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9 }} className="sys-hero-sub">
              Standard, low-refusal and abliterated variants of five model families behind one OpenAI-compatible API. Change the model name; keep the request.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <PrimaryCTA className="!rounded-[8px]">Get an API key</PrimaryCTA>
            </motion.div>
            <Trust variant="compat" className="pt-1" />
          </div>
        </section>

        <ProblemSolution variant="ledger" />
        <Bento layout="offset" title="Every feature, and what it saves you." />
        <Playground />
        <HowItWorks variant="rail" title="Three steps from key to production." />
        <Registry />
        <Proof variant="tabs" title="Made for the people who hit refusals first." />
        <Pricing />
        <FinalCTA title="Your models. Your rules. One key." className="border-t border-[var(--border)]" />
      </main>
      <Footer />
    </div>
  );
}
