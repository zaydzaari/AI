"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Reveal, Trust } from "@/components/system";
import { usePrefersReduced } from "@/lib/hooks";
import { Iris } from "./Iris";
import { Lenses, Specimen } from "./parts";

const ease = [0.22, 1, 0.36, 1] as const;

function FieldGuide() {
  const [row, setRow] = useState<number | null>(null);
  return (
    <section id="models" data-section className="sys-section">
      <div className="sys-container">
        <Head title="A field guide to five families." lead={`${MOCK_NOTE}. Context sizes are placeholder specs.`} />
        <div className="border-b border-[var(--text-primary)]">
          {MODELS.map((m, i) => (
            <Reveal key={m.id} i={i}>
              <div onMouseEnter={() => setRow(i)} onMouseLeave={() => setRow(null)} className="relative grid items-center gap-4 border-t border-[var(--text-primary)] py-8 md:grid-cols-[1.1fr_1.4fr_1fr_160px] md:gap-10">
                <span className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,4.6vw,4.25rem)] leading-[0.95] transition-[font-variation-settings] duration-700" style={{ fontVariationSettings: row === i ? '"SOFT" 100, "WONK" 1, "opsz" 144' : '"SOFT" 0, "WONK" 0, "opsz" 144' }}>
                  {m.name}
                </span>
                <span className="sys-body">{m.blurb}</span>
                <span className="text-[0.9375rem]">{m.variants.join(" · ")}</span>
                <span className="sys-mono text-[0.9375rem] md:text-right">
                  {m.context} ctx
                  <br />
                  <span className="text-[var(--text-muted)]">
                    ${m.inPrice}/${m.outPrice} · 1M
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Design12() {
  const reduce = usePrefersReduced();
  const stage = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end end"] });
  const open = useTransform(scrollYProgress, [0.05, 0.75], [reduce ? 1 : 0, 1], { clamp: true });
  const textOp = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.22], [0, -50]);
  const innerOp = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const innerScale = useTransform(scrollYProgress, [0.2, 0.9], [0.85, 1]);

  return (
    <div className="d12 sys min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/85 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-8">
          <a href="#" className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[1.5rem] leading-none">
            <svg viewBox="-10 -10 20 20" className="h-5 w-5" aria-hidden>
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={i} x1="0" y1="-9" x2="5" y2="-2" stroke="currentColor" strokeWidth="1.4" transform={`rotate(${i * 60})`} />
              ))}
              <circle r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="ml-auto hidden gap-7 text-[0.9375rem] md:flex">
            {[
              ["Why", "#why"],
              ["Inside", "#features"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:opacity-70">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="ml-auto rounded-full border border-[var(--text-primary)] px-4 py-2 text-[0.875rem] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] md:ml-0">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section ref={stage} className="relative h-[260vh]">
          <div data-hero className="sticky top-0 h-[100svh] overflow-hidden">
            <div className="d12-interior absolute inset-0 grid place-items-center">
              <motion.div style={{ opacity: innerOp, scale: innerScale }} className="w-[min(560px,90vw)]">
                <Specimen compact />
              </motion.div>
            </div>
            <div data-hero-part="visual" className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-1/2 top-1/2 aspect-square w-[max(150vw,150vh)] -translate-x-1/2 -translate-y-1/2">
                <Iris open={open} color="#F7F5F0" />
              </div>
            </div>
            <motion.div style={{ opacity: textOp, y: textY }} className="sys-container pointer-events-none absolute inset-x-0 top-0 flex h-full flex-col justify-between pb-8 pt-[calc(var(--nav-h)+24px)] md:pb-12">
              <motion.h1 data-hero-part="headline" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }} className="sys-h1 d12-plate w-fit !max-w-[12ch]">
                Open every model with one key.
              </motion.h1>
              <div className="d12-plate pointer-events-auto flex w-fit flex-col gap-5 md:max-w-[560px]">
                <p data-hero-part="sub" className="sys-hero-sub">
                  A warm, readable surface over a deep machine: five model families and three temperaments for chat, agents and API. Scroll to open the aperture.
                </p>
                <div>
                  <PrimaryCTA>Request early access</PrimaryCTA>
                </div>
                <Trust />
              </div>
            </motion.div>
          </div>
        </section>

        <ProblemSolution variant="ledger" />
        <div className="sys-invert d12-interior">
          <Bento layout="offset" title="What lives inside the machine." lead="Each capability, and what it does for you." />
          <section id="lenses" data-section className="sys-section">
            <div className="sys-container grid gap-16 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <Specimen />
              </Reveal>
              <div>
                <h2 className="sys-h2">Choose how the model sees your request.</h2>
                <div className="mt-16">
                  <Lenses />
                </div>
              </div>
            </div>
          </section>
        </div>
        <HowItWorks variant="rail" />
        <FieldGuide />
        <Proof variant="tabs" />
        <Plans title="Rates, openly." />
        <div className="sys-invert d12-interior">
          <FinalCTA title="Open the aperture." />
        </div>
      </main>
      <Footer />
    </div>
  );
}
