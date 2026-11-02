"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { BRAND } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Trust } from "@/components/system";
import { ChatWindow, Chip, Glass, PrismScene, Skyline } from "./parts";

const ease = [0.2, 0.9, 0.25, 1] as const;

export default function Design03() {
  const spread = useRef(0);
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (spread.current = Math.min(1, v * 1.8)));

  return (
    <div className="d03 sys relative min-h-screen overflow-x-clip">
      <div aria-hidden className="d03-aurora pointer-events-none absolute inset-x-0 top-0 h-[1100px]" />
      <header className="sticky top-0 z-40 flex h-[var(--nav-h)] items-center justify-center px-4">
        <Glass strong className="flex w-full max-w-[880px] items-center gap-2 rounded-full py-1.5 pl-5 pr-1.5">
          <a href="#" className="flex items-center gap-2 text-[1rem] font-semibold tracking-[-0.02em]">
            <span className="d03-holo h-4 w-4 rotate-45 rounded-[6px]" aria-hidden />
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="ml-auto hidden gap-1 text-[0.9375rem] text-[var(--text-muted)] md:flex">
            {[
              ["Why", "#why"],
              ["Chat", "#chat"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="rounded-full px-3 py-1.5 transition-colors hover:bg-white/80 hover:text-[var(--text-primary)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="ml-auto rounded-full border border-[var(--border)] bg-white/70 px-4 py-2 text-[0.875rem] font-medium md:ml-2">
            Sign in
          </a>
        </Glass>
      </header>

      <main className="relative">
        <section ref={hero} data-hero className="sys-hero">
          <div className="sys-container grid h-full min-h-0 items-center gap-4 lg:grid-cols-[1fr_1fr] lg:gap-10">
            <div className="flex flex-col items-center gap-4 text-center md:gap-6 lg:items-start lg:text-left">
              <motion.h1 data-hero-part="headline" initial={{ opacity: 0, y: 30, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 1.3, ease }} className="sys-h1 !max-w-[13ch]">
                Find the right model for every idea.
              </motion.h1>
              <motion.p data-hero-part="sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1, ease }} className="sys-hero-sub">
                Chat, compare and build with five model families in one calm place — and choose how freely each one answers.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <PrimaryCTA>Start exploring</PrimaryCTA>
              </motion.div>
              <Trust className="justify-center lg:justify-start" />
            </div>
            <div data-hero-part="visual" className="relative h-full min-h-[120px] w-full lg:min-h-[520px]">
              <PrismScene spread={spread} />
              <Chip className="left-[4%] top-[18%] hidden md:block" delay={0.6}>
                <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden /> Standard
              </Chip>
              <Chip className="right-[2%] top-[42%] hidden md:block" delay={0.8}>
                <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden /> Low-refusal
              </Chip>
              <Chip className="bottom-[14%] left-[10%] hidden md:block" delay={1}>
                <span className="d03-holo h-2 w-2 rounded-full" aria-hidden /> Abliterated
              </Chip>
            </div>
          </div>
        </section>

        <ProblemSolution variant="split" />
        <Bento layout="mosaic" title="Everything feels lighter here." lead="Each capability, and the time or money it gives back." />

        <section id="chat" data-section className="sys-section">
          <div className="sys-container">
            <Head title="Switch models mid-thought." lead="Pick a prompt, change the model or the temperament, and watch the answer change. Responses are simulated." align="center" />
            <ChatWindow />
          </div>
        </section>

        <HowItWorks variant="rail" />
        <Skyline />
        <Proof variant="grid" />
        <Plans />
        <FinalCTA title="Explore intelligence without limits." />
      </main>
      <Footer />
    </div>
  );
}
