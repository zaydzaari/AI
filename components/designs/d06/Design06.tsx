"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Reveal, Trust } from "@/components/system";
import { Chapters, ChatScreen, Device } from "./parts";

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
  const stage = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, 500], [24, 0]);
  const scale = useTransform(scrollY, [0, 500], [0.9, 1]);

  return (
    <div className="d06 sys min-h-screen">
      <header className="sticky top-0 z-40 h-[var(--nav-h)] border-b border-[var(--border)] bg-white/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="sys-container flex h-full items-center gap-6 text-[0.9375rem]">
          <a href="#" className="text-[1.0625rem] font-bold tracking-[-0.02em]">
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="mx-auto hidden gap-8 text-[var(--text-muted)] md:flex">
            {[
              ["Why", "#why"],
              ["Highlights", "#features"],
              ["Chat", "#product"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="transition-colors hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="ml-auto rounded-full border border-[var(--border)] px-4 py-1.5 text-[0.875rem] font-medium md:ml-0">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section data-hero className="sys-hero !justify-start">
          <div className="sys-container flex h-full min-h-0 flex-col items-center gap-4 pt-[3vh] text-center md:gap-6">
            <motion.h1 data-hero-part="headline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease }} className="sys-h1 !max-w-[16ch]">
              All your AI models in one simple app.
            </motion.h1>
            <motion.p data-hero-part="sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.15 }} className="sys-hero-sub">
              Chat with five model families, switch at any moment, and choose how freely each one answers — standard, low-refusal or abliterated.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <PrimaryCTA>Get started</PrimaryCTA>
            </motion.div>
            <Trust variant="rates" className="justify-center" />
            <div ref={stage} data-hero-part="visual" className="d06-peek relative w-full max-w-[980px] min-h-0 flex-1 [perspective:1600px]">
              <motion.div style={{ rotateX, scale, transformOrigin: "50% 0%" }} className="pt-2">
                <Device className="shadow-[0_60px_120px_-40px_rgba(0,0,0,.35)]">
                  <ChatScreen i={0} />
                </Device>
              </motion.div>
            </div>
          </div>
        </section>

        <ProblemSolution variant="ledger" />
        <Bento layout="mosaic" title="Get the highlights." lead="Every feature, next to what it changes for you." />
        <div className="bg-[var(--bg-secondary)]">
          <Chapters />
        </div>
        <HowItWorks variant="rail" />
        <Compare />
        <Proof variant="tabs" title="Made for how you work." />
        <Plans title="Plans that grow with you." />
        <FinalCTA title="Start exploring." className="bg-[var(--bg-secondary)]" />
      </main>
      <Footer />
    </div>
  );
}
