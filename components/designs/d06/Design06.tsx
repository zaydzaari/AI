"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { QuickStart } from "@/components/system/simple";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Reveal, Trust } from "@/components/system";
import { ChatScreen, Device } from "./parts";

const ease = [0.25, 0.1, 0.25, 1] as const;

function Compare() {
  const [picked, setPicked] = useState(["core", "unbound", "forge"]);
  return (
    <section id="models" data-section className="sys-section">
      <div className="sys-container">
        <Head title="Which model is right for you?" lead={`${MOCK_NOTE}. Rates are samples.`} align="center" />
        <div className="grid gap-16 sm:grid-cols-3 sm:gap-10">
          {picked.map((id, col) => {
            const m = MODELS.find((x) => x.id === id)!;
            return (
              <Reveal key={col} i={col} className="text-center">
                <label className="sr-only" htmlFor={`d06-m${col}`}>
                  Model {col + 1}
                </label>
                <select id={`d06-m${col}`} value={id} onChange={(e) => setPicked((p) => p.map((x, k) => (k === col ? e.target.value : x)))} className="mx-auto block min-h-[44px] rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-5 text-[1rem]">
                  {MODELS.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.family}
                    </option>
                  ))}
                </select>
                <AnimatePresence mode="wait">
                  <motion.div key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="d06-chip mx-auto mt-10 grid h-24 w-24 place-items-center rounded-[26px] text-[2rem] font-semibold text-white" aria-hidden>
                      {m.name[0]}
                    </div>
                    <h3 className="sys-h3 mt-8">{m.name}</h3>
                    <p className="sys-small mt-1">{m.role}</p>
                    <dl className="mt-10 grid gap-8 border-t border-[var(--border)] pt-8">
                      {[
                        ["Context window", m.context],
                        ["Variants", m.variants.join(" · ")],
                        ["Input / output per 1M", `$${m.inPrice} / $${m.outPrice}`],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="sys-small">{k}</dt>
                          <dd className="mt-1 text-[1.25rem] font-semibold">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </motion.div>
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Design06() {
  const { settings: { variant } } = useStudio();
  return (
    <div className="d06 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-white/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="sys-container flex h-full items-center gap-6 text-[0.9375rem]">
          <a href="#" className="text-[1.0625rem] font-bold tracking-[-0.02em]"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="mx-auto hidden gap-8 text-[var(--text-muted)] md:flex">
            {[

              ["How it works", "#product"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
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
        <CompositionHero id="06" >
          <GuidedExample render={i => <Device><ChatScreen i={i} /></Device>} />
        </CompositionHero>
        <QuickStart />

        <Compare />

        <Plans title="Plans that grow with you." />
        <FinalCTA title="Start exploring." className="bg-[var(--bg-secondary)]" />
      </main>
      <Footer />
    </div>
  );
}
