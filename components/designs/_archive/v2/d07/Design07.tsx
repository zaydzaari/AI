"use client";

import { motion } from "motion/react";
import { FlaskConical } from "lucide-react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Reveal, Trust } from "@/components/system";
import { Ablation, Clock, NeuralGraph, Trace, Wave } from "./parts";

function ModelTable() {
  return (
    <section id="models" data-section className="sys-section border-t border-[var(--border)]">
      <div className="sys-container">
        <Head title="Model families, tabulated." lead={`Rates are per million tokens, sample values. ${MOCK_NOTE}.`} />
        <Reveal className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[1rem]">
            <caption className="sr-only">Model families with context size, variants and sample rates</caption>
            <thead className="sys-mono text-[0.875rem] text-[var(--text-muted)]">
              <tr className="border-y border-[var(--border)]">
                {["Model", "Role", "Context (log scale)", "Variants", "$ in", "$ cached", "$ out"].map((h, i) => (
                  <th key={h} className={`py-4 font-normal ${i > 3 ? "text-right" : ""}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODELS.map((m, i) => (
                <tr key={m.id} className="border-b border-[var(--border)] transition-colors hover:bg-[var(--bg-secondary)]">
                  <td className="sys-mono py-5">{m.id}</td>
                  <td className="py-5 text-[var(--text-muted)]">{m.role}</td>
                  <td className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-[6px] w-40 bg-[var(--border)]">
                        <motion.div className="h-full bg-[var(--text-primary)]" initial={{ width: 0 }} whileInView={{ width: `${(Math.log10(m.contextK) / 3) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.08 }} />
                      </div>
                      <span className="sys-mono text-[0.9375rem]">{m.context}</span>
                    </div>
                  </td>
                  <td className="py-5 text-[0.9375rem]">{m.variants.join(", ")}</td>
                  <td className="sys-mono py-5 text-right">{m.inPrice.toFixed(2)}</td>
                  <td className="sys-mono py-5 text-right">{m.cached.toFixed(2)}</td>
                  <td className="sys-mono py-5 text-right">{m.outPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <Reveal className="mt-20 max-w-[720px]">
          <Trace />
        </Reveal>
      </div>
    </section>
  );
}

export default function Design07() {
  return (
    <div className="d07 sys min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur">
        <div className="sys-container sys-mono flex h-full items-center gap-8 text-[0.875rem]">
          <a href="#" className="flex items-center gap-2 text-[0.9375rem] font-medium">
            <FlaskConical size={16} aria-hidden /> {BRAND.name}/lab
          </a>
          <nav aria-label="Primary" className="hidden gap-7 text-[var(--text-muted)] md:flex">
            {[
              ["Why", "#why"],
              ["Experiment", "#experiment"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["Rates", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <span className="ml-auto hidden text-[var(--text-muted)] lg:inline">
            <Clock />
          </span>
          <a href="#" className="ml-auto rounded-[4px] border border-[var(--border)] px-3 py-1.5 hover:border-[var(--text-primary)] lg:ml-0">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section data-hero className="sys-hero d07-grid">
          <div className="md:hidden">
            <div data-hero-part="visual" className="absolute inset-x-0 bottom-0 h-[90px]">
              <Wave />
            </div>
          </div>
          <div className="sys-container relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col gap-5 md:gap-7">
              <motion.h1 data-hero-part="headline" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="sys-h1 !max-w-[14ch]">
                Study what models do without their refusals.
              </motion.h1>
              <motion.p data-hero-part="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="sys-hero-sub">
                Standard, low-refusal and abliterated variants of five model families, side by side through one API — so you can measure exactly what changes.
              </motion.p>
              <div>
                <PrimaryCTA className="!rounded-[4px]">Request research access</PrimaryCTA>
              </div>
              <Trust />
            </div>
            <motion.figure data-hero-part="visual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1.4 }} className="hidden rounded-[4px] border border-[var(--border)] bg-[var(--bg-primary)]/70 p-5 lg:block">
              <NeuralGraph />
              <figcaption className="sys-small mt-2">Fig. 1 — signal propagation (schematic). Hover a unit.</figcaption>
            </motion.figure>
          </div>
        </section>

        <ProblemSolution variant="ledger" />
        <Bento layout="offset" title="Instruments in the lab, and what each one tells you." />
        <section id="experiment" data-section className="sys-section border-t border-[var(--border)]">
          <div className="sys-container">
            <Head title="Experiment: what abliteration does." lead="Drag the slider. As the refusal direction is removed, activations collapse onto the remaining subspace and the model stops reflexively declining a fictional villain's line." />
            <Reveal>
              <Ablation />
            </Reveal>
          </div>
        </section>
        <HowItWorks variant="rail" title="Method: three steps." />
        <ModelTable />
        <Proof variant="grid" title="Who runs experiments here." />
        <Plans title="Access and rates." />
        <section className="relative">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]" aria-hidden>
            <Wave />
          </div>
          <FinalCTA title="Your AI. Your possibilities. Your measurements." align="left" className="border-t border-[var(--border)]" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
