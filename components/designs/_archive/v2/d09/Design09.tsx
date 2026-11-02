"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Grid3x3 } from "lucide-react";
import { BRAND, MODELS } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Reveal, Trust } from "@/components/system";
import { ModelTable, Product } from "./parts";

const snap = { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const };

/** Hero visual: a timetable-style index of the five model families. */
function Index() {
  return (
    <div data-hero-part="visual" className="d09-peek min-h-0 border-t-2 border-[var(--text-primary)] max-md:max-h-[96px] max-md:overflow-hidden">
      <table className="w-full text-left">
        <caption className="sr-only">Model families and context windows</caption>
        <tbody>
          {MODELS.map((m, i) => (
            <motion.tr key={m.id} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ ...snap, delay: 0.3 + i * 0.08 }} className={`border-b border-[var(--text-primary)] ${i >= 3 ? "max-md:hidden" : ""}`}>
              <td className="py-2.5 pr-4 text-[0.9375rem] tabular-nums text-[var(--text-muted)] md:py-3.5">{String(i + 1).padStart(2, "0")}</td>
              <td className="py-2.5 text-[1.375rem] font-semibold tracking-[-0.03em] md:py-3.5 md:text-[1.75rem]">{m.name}</td>
              <td className="py-2.5 text-[0.9375rem] text-[var(--text-muted)] max-sm:hidden md:py-3.5">{m.role}</td>
              <td className="py-2.5 text-right text-[1.125rem] font-semibold tabular-nums md:py-3.5">{m.context}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Design09() {
  const [grid, setGrid] = useState(false);
  return (
    <div className="d09 sys relative min-h-screen">
      <AnimatePresence>
        {grid && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden className="pointer-events-none fixed inset-0 z-50">
            <div className="sys-container grid h-full grid-cols-4 gap-4 md:grid-cols-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`bg-[var(--accent)]/10 ${i >= 4 ? "hidden md:block" : ""}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b-2 border-[var(--text-primary)] bg-[var(--bg-primary)]">
        <div className="sys-container grid h-full grid-cols-12 items-center gap-4">
          <a href="#" className="col-span-6 text-[1.25rem] font-semibold tracking-[-0.04em] md:col-span-3">
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="col-span-6 hidden gap-6 text-[0.9375rem] font-medium md:flex">
            {[
              ["Why", "#why"],
              ["Product", "#product"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                {l}
              </a>
            ))}
          </nav>
          <div className="col-span-6 flex justify-end gap-2 md:col-span-3">
            <button onClick={() => setGrid((g) => !g)} aria-pressed={grid} className={`flex min-h-[40px] items-center gap-1.5 border border-[var(--text-primary)] px-3 text-[0.875rem] font-medium ${grid ? "bg-[var(--text-primary)] text-[var(--bg-primary)]" : ""}`}>
              <Grid3x3 size={14} aria-hidden /> Grid
            </button>
            <a href="#" className="flex min-h-[40px] items-center border border-[var(--text-primary)] px-3 text-[0.875rem] font-medium">
              Sign in
            </a>
          </div>
        </div>
      </header>

      <main>
        <section data-hero className="sys-hero">
          <div className="sys-container grid h-full min-h-0 grid-cols-12 content-center gap-x-4 gap-y-6 md:gap-y-10">
            <motion.h1 data-hero-part="headline" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={snap} className="sys-h1 col-span-12 !max-w-[13ch] lg:col-span-7">
              One platform for every AI model you use.
            </motion.h1>
            <div className="col-span-12 flex flex-col gap-5 lg:col-span-5 lg:justify-end">
              <motion.p data-hero-part="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...snap, delay: 0.2 }} className="sys-hero-sub">
                Five model families in one chat, one agent runtime and one API — with standard, low-refusal and abliterated variants, priced per token and shown in full.
              </motion.p>
              <div>
                <PrimaryCTA>Start now</PrimaryCTA>
              </div>
            </div>
            <div className="col-span-12 grid min-h-0 grid-cols-12 gap-4">
              <Trust className="col-span-12 lg:col-span-5" />
              <div className="col-span-12 min-h-0 lg:col-span-7">
                <Index />
              </div>
            </div>
          </div>
        </section>

        <ProblemSolution variant="ledger" />
        <Bento layout="offset" title="Each feature, stated with its benefit." />
        <section id="product" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Try it. Change the model. Watch the cost." lead="Choose a prompt, model and variant. Responses are simulated; costs use sample rates." />
            <Reveal>
              <Product />
            </Reveal>
          </div>
        </section>
        <HowItWorks variant="rail" />
        <section id="models" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Models, measured." />
            <ModelTable />
          </div>
        </section>
        <Proof variant="grid" />
        <Plans title="Pricing." />
        <FinalCTA title="Start now." align="left" className="border-t-2 border-[var(--text-primary)]" />
      </main>
      <Footer />
    </div>
  );
}
