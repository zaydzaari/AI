"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Command, Search, Sparkles } from "lucide-react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Reveal, Trust } from "@/components/system";
import { Builder, Console, Palette } from "./parts";

const spring = { type: "spring", stiffness: 380, damping: 34 } as const;

function ModelPicker() {
  const [sel, setSel] = useState(0);
  const m = MODELS[sel];
  return (
    <section id="models" data-section className="sys-section">
      <div className="sys-container">
        <Head title="Pick a model. Watch it change." lead={`${MOCK_NOTE}. Rates are samples.`} />
        <LayoutGroup id="d10-sel">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" role="tablist" aria-label="Models">
            {MODELS.map((x, i) => (
              <button key={x.id} role="tab" aria-selected={sel === i} onClick={() => setSel(i)} className={`relative min-h-[56px] shrink-0 rounded-[16px] px-5 text-left ${sel === i ? "text-[var(--accent-ink)]" : "bg-[var(--bg-secondary)] ring-1 ring-[var(--border)]"}`}>
                {sel === i && <motion.span layoutId="d10-msel" transition={spring} className="absolute inset-0 rounded-[16px] bg-[var(--accent)]" />}
                <span className="relative block text-[1rem] font-semibold">{x.name}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
        <AnimatePresence mode="wait">
          <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring} className="mt-6 grid gap-5 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="sys-card">
              <p className="sys-small">{m.family}</p>
              <h3 className="sys-h3 mt-3 !text-[2.5rem]">{m.role}</h3>
              <p className="sys-body mt-4">{m.blurb}</p>
            </div>
            <div className="sys-card">
              <p className="sys-small">Context window</p>
              <p className="mt-3 text-[2.75rem] font-semibold leading-none tracking-[-0.03em]">{m.context}</p>
              <p className="sys-small mt-6">{m.variants.join(" · ")}</p>
            </div>
            <div className="sys-card">
              <p className="sys-small">Per 1M tokens (sample)</p>
              <dl className="d10-mono mt-4 grid gap-2 text-[1rem]">
                {[
                  ["input", m.inPrice],
                  ["cached", m.cached],
                  ["output", m.outPrice],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between">
                    <dt className="text-[var(--text-muted)]">{k as string}</dt>
                    <dd>${v as number}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function Design10() {
  const [pal, setPal] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPal((p) => !p);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div id="top" className="d10 sys min-h-screen">
      <Palette open={pal} onClose={() => setPal(false)} />
      <header className="sticky top-0 z-40 h-[var(--nav-h)] bg-[var(--bg-primary)]/85 backdrop-blur-md">
        <div className="sys-container flex h-full items-center gap-4">
          <a href="#" className="flex items-center gap-2 text-[1.0625rem] font-semibold tracking-[-0.02em]">
            <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-[var(--text-primary)] text-[var(--bg-primary)]" aria-hidden>
              <Sparkles size={14} />
            </span>
            {BRAND.name}
          </a>
          <button onClick={() => setPal(true)} className="ml-4 hidden min-h-[40px] items-center gap-2 rounded-full bg-[var(--bg-secondary)] px-4 text-[0.875rem] text-[var(--text-muted)] ring-1 ring-[var(--border)] hover:ring-[var(--text-primary)] md:flex">
            <Search size={14} aria-hidden /> Search or jump to…
            <kbd className="d10-mono ml-6 flex items-center gap-0.5 text-[0.75rem]">
              <Command size={11} aria-hidden />K
            </kbd>
          </button>
          <nav aria-label="Primary" className="ml-auto hidden gap-6 text-[0.9375rem] text-[var(--text-muted)] lg:flex">
            {[
              ["Why", "#why"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["API", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="ml-auto rounded-full px-4 py-2 text-[0.875rem] font-medium ring-1 ring-[var(--border)] hover:ring-[var(--text-primary)] lg:ml-2">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section data-hero className="sys-hero !max-h-none max-md:!min-h-0">
          <div className="sys-container grid items-center gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="flex flex-col gap-4 md:gap-6">
              <motion.h1 data-hero-part="headline" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="sys-h1">
                Your AI, already running.
              </motion.h1>
              <p data-hero-part="sub" className="sys-hero-sub">
                Type a request and the right model is picked for you. Pin a family, switch temperament, and watch context and cost update live.
              </p>
              <div>
                <PrimaryCTA>Create your account</PrimaryCTA>
              </div>
              <Trust />
            </div>
            <Console />
          </div>
        </section>

        <ProblemSolution variant="split" />
        <Bento layout="offset" title="Everything moves, because it works." />
        <HowItWorks variant="rail" />
        <section id="api" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Build the request. Copy it. Ship." lead="Pick a model, a variant and options; the request writes itself." />
            <Reveal>
              <Builder />
            </Reveal>
          </div>
        </section>
        <ModelPicker />
        <Proof variant="tabs" />
        <Plans title="Plans for how you'll use it." />
        <FinalCTA title="It's already listening." />
      </main>
      <Footer />
    </div>
  );
}
