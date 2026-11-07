"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { motion } from "motion/react";
import { BRAND, MODELS } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Reveal, Trust } from "@/components/system";
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
            <motion.tr key={m.id} className={`border-b border-[var(--text-primary)] ${i >= 3 ? "max-md:hidden" : ""}`}>
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
  const { settings: { variant } } = useStudio();
  return (
    <div className="d09 sys sys-simple relative min-h-screen">

      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b-2 border-[var(--text-primary)] bg-[var(--bg-primary)]">
        <div className="sys-container grid h-full grid-cols-12 items-center gap-4">
          <a href="#" className="col-span-6 text-[1.25rem] font-semibold tracking-[-0.04em] md:col-span-3"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="col-span-6 hidden gap-6 text-[0.9375rem] font-medium md:flex">
            {[

              ["Product", "#product"],

              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                {l}
              </a>
            ))}
          </nav>
          <div className="col-span-6 flex justify-end gap-2 md:col-span-3">
            <HeaderAccess />
          </div>
        </div>
      </header>

      <main>
        <CompositionHero id="09" >
          <Index />
        </CompositionHero>

        <section id="product" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Try it. Change the model. Watch the cost." lead="Choose a prompt, model and variant. Responses are simulated; costs use sample rates." />
            <Reveal>
              <Product />
            </Reveal>
          </div>
        </section>

        <section id="models" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Models, measured." />
            <ModelTable />
          </div>
        </section>

        <Plans title="Pricing." layout="ledger" />
        <FinalCTA title="Start now." align="left" className="border-t-2 border-[var(--text-primary)]" />
      </main>
      <Footer />
    </div>
  );
}
