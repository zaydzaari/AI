"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BRAND, MODELS, MOCK_NOTE } from "@/lib/content";
import { Bento, FinalCTA, Footer, Head, HowItWorks, Plans, PrimaryCTA, ProblemSolution, Proof, Trust } from "@/components/system";
import { Cursor, Marquee, REMIX, RemixCol, SHAPES, Stickers } from "./parts";

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

function Deck() {
  const [fan, setFan] = useState(false);
  const [md, setMd] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(min-width: 768px)");
    const f = () => setMd(q.matches);
    f();
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);
  return (
    <section id="models" data-section className="sys-section overflow-hidden">
      <div className="sys-container">
        <Head title="The deck: five model families." lead={`Hover to fan the cards. ${MOCK_NOTE}.`} />
        <div className="relative flex flex-col gap-5 md:h-[440px] md:flex-row md:items-center md:justify-center" onMouseEnter={() => setFan(true)} onMouseLeave={() => setFan(false)}>
          {MODELS.map((m, i) => {
            const off = i - 2;
            const dark = i % 2 === 1;
            return (
              <motion.article
                key={m.id}
                animate={md ? { x: fan ? off * 240 : off * 44, rotate: fan ? off * 3 : off * 7, y: Math.abs(off) * (fan ? 14 : 8) } : { x: 0, rotate: 0, y: 0 }}
                transition={bouncy}
                className="d05-card relative flex h-[380px] w-full shrink-0 flex-col justify-between rounded-[28px] border-2 border-[var(--ink)] p-8 md:absolute md:w-[250px]"
                style={{ background: dark ? INK : CREAM, color: dark ? CREAM : INK, zIndex: 5 - Math.abs(off) }}
              >
                <div className="flex justify-between text-[0.9375rem]">
                  <span>{m.role}</span>
                  <span className="d05-mono">{m.context}</span>
                </div>
                <div className="d05-head text-[3.25rem] leading-none">{m.name}</div>
                <div>
                  <p className="text-[1rem] leading-snug">{m.blurb}</p>
                  <p className="mt-3 text-[0.9375rem]">{m.variants.join(" / ")}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Design05() {
  const hero = useRef<HTMLElement>(null);
  return (
    <div className="d05 sys min-h-screen md:cursor-none [&_a]:md:cursor-none [&_button]:md:cursor-none">
      <Cursor />
      <header className="sticky top-0 z-40 flex h-[var(--nav-h)] items-center px-3">
        <div className="flex w-full items-center gap-3 rounded-full border-2 border-[var(--ink)] bg-[var(--cream)] py-1.5 pl-5 pr-1.5">
          <a href="#" className="d05-head flex items-center gap-2 text-[1.25rem]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--ink)] text-[0.75rem] text-[var(--cream)]" aria-hidden>
              Æ
            </span>
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="ml-auto hidden gap-1 text-[0.9375rem] font-semibold md:flex">
            {[
              ["Why", "#why"],
              ["Remix", "#remix"],
              ["How it works", "#how"],
              ["Models", "#models"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="rounded-full px-4 py-2 transition-colors hover:bg-[var(--ink)] hover:text-[var(--cream)]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="ml-auto rounded-full border-2 border-[var(--ink)] px-4 py-2 text-[0.875rem] font-semibold md:ml-2">
            Sign in
          </a>
        </div>
      </header>

      <main>
        <section ref={hero} data-hero className="sys-hero">
          <div className="sys-container relative z-10 flex flex-col gap-5 md:gap-7">
            <h1 data-hero-part="headline" className="sys-h1 !max-w-[11ch]">
              {["Make what", "other AIs", "refuse."].map((l, i) => (
                <motion.span key={l} className="block" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...bouncy, delay: 0.05 + i * 0.1 }}>
                  {l}
                </motion.span>
              ))}
            </h1>
            <motion.p data-hero-part="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="sys-hero-sub !max-w-[44ch]">
              Five model families and three temperaments in one playful studio for writing, chat, agents and code. Drag the models around — they&apos;re yours.
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...bouncy, delay: 0.5 }}>
              <PrimaryCTA>Get early access</PrimaryCTA>
            </motion.div>
            <Trust />
            <div data-hero-part="visual" className="flex flex-wrap gap-2 md:hidden" aria-label="Model families">
              {SHAPES.map((s) => (
                <span key={s.id} className="d05-head rounded-full px-3 py-1 text-[0.9375rem]" style={{ background: s.bg, color: s.fg }}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <div data-hero-part="visual" className="absolute inset-0 hidden md:block">
            <Stickers bounds={hero} />
          </div>
        </section>

        <Marquee items={["Unified chat", "Coding agents", "Abliterated variants", "Prompt caching", "One API"]} bg={INK} fg={CREAM} />
        <ProblemSolution variant="split" />
        <Bento layout="mosaic" title="What's in the kiln, and why it matters." />
        <Remix />
        <HowItWorks variant="rail" />
        <Deck />
        <Proof variant="grid" />
        <Plans title="Pick a plan. Change it whenever." />
        <FinalCTA title="Make something unreasonable." className="sys-invert bg-[var(--ink)]" />
      </main>
      <Footer />
    </div>
  );
}
