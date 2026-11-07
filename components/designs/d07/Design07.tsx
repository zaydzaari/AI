"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { motion } from "motion/react";
import { FlaskConical } from "lucide-react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Reveal, Trust } from "@/components/system";
import { Ablation, NeuralGraph, Trace } from "./parts";

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
  const { settings: { variant } } = useStudio();
  return (
    <div className="d07 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur">
        <div className="sys-container sys-mono flex h-full items-center gap-8 text-[0.875rem]">
          <a href="#" className="flex items-center gap-2 text-[0.9375rem] font-medium"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="hidden gap-7 text-[var(--text-muted)] md:flex">
            {[

              ["Experiment", "#experiment"],

              ["Models", "#models"],
              ["Rates", "#pricing"],
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
        <CompositionHero id="07" anchor={variant === "b" ? "experiment" : undefined}>
          {variant === "b" ? <Ablation /> : variant === "c" ? <ModelIndex /> : <figure><NeuralGraph /><figcaption className="sys-small">Signal propagation · illustrative schematic</figcaption></figure>}
        </CompositionHero>

        {variant !== "b" && (
        <section id="experiment" data-section className="sys-section border-t border-[var(--border)]">
          <div className="sys-container">
            <Head title="Experiment: what abliteration does." lead="Drag the slider. As the refusal direction is removed, activations collapse onto the remaining subspace and the model stops reflexively declining a fictional villain's line." />
            <Reveal>
              <Ablation />
            </Reveal>
          </div>
        </section>
        )}

        <ModelTable />

        <Plans title="Access and rates." layout="ledger" />
        <section className="relative">
          <FinalCTA title="Start your next experiment." align="left" className="border-t border-[var(--border)]" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
