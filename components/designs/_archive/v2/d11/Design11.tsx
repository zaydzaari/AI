"use client";

import { motion } from "motion/react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Reveal, Trust } from "@/components/system";
import { Glass, HeroSlab, Wipe } from "./parts";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Design11() {
  return (
    <div className="d11 sys relative min-h-screen overflow-x-clip">
      <div aria-hidden className="d11-noise pointer-events-none fixed inset-0 z-0 opacity-[0.05]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[-20%] h-[900px] w-[1400px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(200,204,212,.10),transparent)]" />

      <header className="sticky top-0 z-40 flex h-[var(--nav-h)] items-center px-4">
        <Glass className="mx-auto flex w-full max-w-[1200px] items-center gap-6 rounded-full py-1.5 pl-6 pr-1.5">
          <a href="#" className="text-[1.0625rem] font-bold tracking-[-0.03em]">
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="ml-auto hidden gap-7 text-[0.9375rem] text-[var(--text-muted)] md:flex">
            {[
              ["Why", "#why"],
              ["Features", "#features"],
              ["Compare", "#compare"],
              ["Models", "#models"],
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
        </Glass>
      </header>

      <main className="relative z-10">
        <section data-hero className="sys-hero">
          <div className="sys-container grid h-full min-h-0 items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="flex flex-col gap-5 md:gap-7">
              <motion.h1 data-hero-part="headline" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease }} className="sys-h1 !max-w-[13ch]">
                Every AI model, in one precise place.
              </motion.h1>
              <motion.p data-hero-part="sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease, delay: 0.15 }} className="sys-hero-sub">
                Five model families with standard, low-refusal and abliterated variants — in a chat, agent and API experience built to the last detail.
              </motion.p>
              <div>
                <PrimaryCTA>Request access</PrimaryCTA>
              </div>
              <Trust variant="rates" />
            </div>
            <div data-hero-part="visual" className="d11-peek min-h-0">
              <HeroSlab />
            </div>
          </div>
        </section>

        <ProblemSolution variant="ledger" />
        <Bento layout="mosaic" title="Every capability, precisely placed." />
        <section id="compare" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Same prompt. Different temperament." lead="Drag the divider — or focus it and use the arrow keys — to compare a standard model with an abliterated one on a fiction prompt. Simulated output." />
            <Reveal>
              <Wipe />
            </Reveal>
          </div>
        </section>
        <HowItWorks variant="rail" />
        <section id="models" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Five families, cut from the same block." lead={`${MOCK_NOTE}. Sample rates.`} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {MODELS.map((m, i) => (
                <Reveal key={m.id} i={i}>
                  <Glass as="article" className="d11-bevel flex h-[380px] flex-col justify-between rounded-[24px] p-8">
                    <span className="d11-mono text-[0.875rem] text-[var(--text-muted)]">{m.context}</span>
                    <div>
                      <h3 className="sys-h3 !text-[2.25rem]">{m.name}</h3>
                      <p className="sys-small mt-1 !text-[var(--text-primary)]">{m.role}</p>
                      <p className="sys-small mt-4">{m.blurb}</p>
                      <p className="d11-mono mt-5 border-t border-[var(--border)] pt-3 text-[0.8125rem] text-[var(--text-muted)]">
                        ${m.inPrice} / ${m.outPrice} per 1M
                      </p>
                    </div>
                  </Glass>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <Proof variant="grid" />
        <Plans title="Pricing, without the fine print." />
        <FinalCTA title="Intelligence, unbound." />
      </main>
      <Footer />
    </div>
  );
}
