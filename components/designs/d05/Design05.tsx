"use client";

import { BrandWordmark, HeaderAccess } from "@/components/system/Brand";

import { CompositionHero, ModelIndex, WritingSample, GuidedExample } from "@/components/lab/CompositionHero";
import { useStudio } from "@/components/lab/StudioProvider";

import { ModelList } from "@/components/system/simple";

import { useState } from "react";
import { motion } from "motion/react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { FinalCTA, Footer, Head, Plans, PrimaryCTA, Trust } from "@/components/system";
import { REMIX, RemixCol } from "./parts";

const bouncy = { type: "spring", stiffness: 260, damping: 18 } as const;
const CREAM = "#F3EFE6";
const INK = "#111111";

function Remix() {
  const [run, setRun] = useState(0);
  return (
    <section id="remix" data-section className="sys-section sys-invert bg-[var(--ink)]">
      <div className="sys-container">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <Head title="One prompt. Three temperaments." lead="The same request — write a villain's opening line — answered by each variant. Simulated output." />
          <button onClick={() => setRun((r) => r + 1)} className="sys-ghost mb-16 lg:mb-20">
            Run the remix again
          </button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {REMIX.map((r, i) => (
            <RemixCol key={r.v} r={r} i={i} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Design05() {
  const { settings: { variant } } = useStudio();
  return (
    <div className="d05 sys sys-simple min-h-screen">
      <header className="sticky top-0 z-40 flex h-[var(--nav-h)] items-center px-3">
        <div className="flex w-full items-center gap-3 rounded-full border-2 border-[var(--ink)] bg-[var(--cream)] py-1.5 pl-5 pr-1.5">
          <a href="#" className="d05-head flex items-center gap-2 text-[1.25rem]"><BrandWordmark>{BRAND.name}</BrandWordmark></a>
          <nav aria-label="Primary" className="ml-auto hidden gap-1 text-[0.9375rem] font-semibold md:flex">
            {[

              ["Remix", "#remix"],

              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="rounded-full px-4 py-2 transition-colors hover:bg-[var(--ink)] hover:text-[var(--cream)]">
                {l}
              </a>
            ))}
          </nav>
          <HeaderAccess />
        </div>
      </header>

      <main>
        <CompositionHero id="05" >
          <WritingSample />
        </CompositionHero>

        <Remix />

        <ModelList />

        <Plans title="Pick a plan. Change it whenever." layout="editorial" />
        <FinalCTA title="Make something of your own." className="sys-invert bg-[var(--ink)]" />
      </main>
      <Footer />
    </div>
  );
}
