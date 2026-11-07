"use client";

/**
 * Master design system (v2) — section components shared by all 12 concepts.
 * Visual identity comes from each concept's tokens (see system.css) and its
 * own hero, product demo and model showcase; these components supply the
 * modular body: Problem → Benefits bento → How it works → Proof → CTA → Footer.
 */

import { createElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Bot, Check, Code2, Columns3, Copy, Database, MessagesSquare, ScanText, SlidersHorizontal } from "lucide-react";
import { BENEFITS, BRAND, FACTS, FOOTER, MOCK_NOTE, PLANS, PRICE_NOTE, PROBLEM, PROOF, PROOF_NOTE, STEPS, STEP_CODE } from "@/lib/content";
import { useCopy } from "@/lib/hooks";
import { BrandWordmark } from "./Brand";

/* ——— reveal: one shared IntersectionObserver ——— */
let io: IntersectionObserver | null = null;
function observe(el: Element) {
  if (typeof window === "undefined") return () => {};
  if (!io)
    io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io?.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
  io.observe(el);
  return () => io?.unobserve(el);
}

export function Reveal({ children, i = 0, className = "", as = "div" }: { children: React.ReactNode; i?: number; className?: string; as?: "div" | "li" | "article" | "p" | "h2" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => (ref.current ? observe(ref.current) : undefined), []);
  return createElement(as, { ref, "data-reveal": "", className, style: { ["--d" as string]: `${Math.min(i, 6) * 80}ms` } }, children);
}

export function Section({ id, children, className = "", ruled = false, ...rest }: { id?: string; children: React.ReactNode; className?: string; ruled?: boolean } & React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} data-section className={`sys-section ${ruled ? "sys-ruled" : ""} ${className}`} {...rest}>
      <div className="sys-container">{children}</div>
    </section>
  );
}

export function Head({ title, lead, align = "left" }: { title: string; lead?: string; align?: "left" | "center" }) {
  return (
    <div className={`sys-head ${align === "center" ? "justify-items-center text-center" : ""}`}>
      <Reveal as="h2" className="sys-h2">
        {title}
      </Reveal>
      {lead && (
        <Reveal as="p" i={1} className="sys-body">
          {lead}
        </Reveal>
      )}
    </div>
  );
}

/* ——— spotlight pointer tracking ——— */
export function spot(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/* ——— hero trust signal (true product facts only) ——— */
export function Trust({ variant = "facts", className = "" }: { variant?: "facts" | "compat" | "rates"; className?: string }) {
  const text = variant === "compat"
    ? "One endpoint. Works with the OpenAI SDK."
    : variant === "rates"
      ? "Chat and API access. Sample pricing below."
      : "Five model families, with chat and API access.";
  return <p data-hero-part="trust" className={`simple-trust ${className}`}>{text}</p>;
}

/* ——— 1. Problem → solution ——— */
export function ProblemSolution({ variant = "ledger", id = "why" }: { variant?: "ledger" | "split"; id?: string }) {
  if (variant === "split")
    return (
      <Section id={id}>
        <Head title={PROBLEM.title} lead={PROBLEM.lead} />
        <div className="grid gap-6 md:grid-cols-2 lg:gap-10">
          {(["problem", "solution"] as const).map((k, col) => (
            <Reveal key={k} i={col} className={`sys-card ${k === "solution" ? "" : "!bg-transparent"}`}>
              <h3 className="sys-h3">{k === "problem" ? "Today" : `With ${BRAND.name}`}</h3>
              <ul className="mt-8 grid gap-6">
                {PROBLEM.rows.map((r, i) => (
                  <li key={i} className="flex gap-4">
                    <span aria-hidden className={`mt-[0.6em] h-2 w-2 shrink-0 rounded-full ${k === "solution" ? "bg-[var(--text-primary)]" : "border border-[var(--text-muted)]"}`} />
                    <span className={k === "solution" ? "sys-body sys-body-strong" : "sys-body"}>{r[k]}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>
    );
  return (
    <Section id={id}>
      <Head title={PROBLEM.title} lead={PROBLEM.lead} />
      <ol className="border-t border-[var(--border)]">
        {PROBLEM.rows.map((r, i) => (
          <Reveal as="li" key={i} i={i} className="grid gap-4 border-b border-[var(--border)] py-8 md:grid-cols-2 md:gap-16 md:py-10">
            <p className="sys-body">
              <span className="sys-strike">{r.problem}</span>
            </p>
            <p className="sys-body sys-body-strong text-[1.125rem]">{r.solution}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ——— 2. Features paired with benefits ——— */
const ICONS: Record<string, typeof Bot> = { chat: MessagesSquare, variants: SlidersHorizontal, agents: Bot, context: ScanText, cache: Database, compare: Columns3 };
const LAYOUTS = {
  mosaic: ["md:col-span-4", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-6"],
  offset: ["md:col-span-3 md:row-span-2", "md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2"],
};

export function Bento({ id = "features", title = "Built around what you get, not what we built.", lead, layout = "mosaic", visual }: { id?: string; title?: string; lead?: string; layout?: keyof typeof LAYOUTS; visual?: React.ReactNode }) {
  return (
    <Section id={id}>
      <Head title={title} lead={lead ?? "Each feature, paired with the outcome it gives you."} />
      <div className="grid gap-5 md:grid-cols-6 lg:gap-6">
        {BENEFITS.map((b, i) => {
          const Icon = ICONS[b.key];
          const big = i === 0;
          return (
            <Reveal key={b.key} i={i} className={`${LAYOUTS[layout][i]}`}>
              <article onPointerMove={spot} className={`sys-card sys-spot flex h-full flex-col gap-6 ${big ? "md:min-h-[380px]" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-[var(--border)] text-[var(--text-primary)]">
                    <Icon size={18} strokeWidth={1.6} aria-hidden />
                  </span>
                  <span className="sys-label">{b.feature}</span>
                </div>
                <h3 className={`sys-h3 ${big ? "md:text-[2.25rem]" : ""}`}>{b.benefit}</h3>
                <p className="sys-body mt-auto">{b.detail}</p>
                {big && visual && <div className="mt-2">{visual}</div>}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ——— 3. How it works: pinned horizontal rail on desktop ——— */
function StepCode() {
  const { copied, copy } = useCopy();
  return (
    <div className="relative mt-8 overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg-primary)]">
      <button onClick={() => copy(STEP_CODE)} className="sys-ghost absolute right-2 top-2 !min-h-[40px] !px-3 text-[0.875rem]" aria-label="Copy code">
        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
      </button>
      <pre className="sys-mono overflow-x-auto p-5 pt-14 text-[0.875rem] leading-[1.75] text-[var(--text-primary)]">{STEP_CODE}</pre>
    </div>
  );
}

function StepCard({ i }: { i: number }) {
  const s = STEPS[i];
  return (
    <article onPointerMove={spot} className="sys-card sys-spot h-full">
      <div className="flex items-baseline gap-5">
        <span className="font-[family-name:var(--font-display)] text-[3.5rem] font-semibold leading-none tracking-[-0.04em] text-[var(--text-primary)]">{i + 1}</span>
        <h3 className="sys-h3">{s.title}</h3>
      </div>
      <p className="sys-body mt-6">{s.body}</p>
      {i === 1 && <StepCode />}
      {i === 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {["core-128k", "core-128k:low-refusal", "unbound-128k:abliterated"].map((m) => (
            <span key={m} className="sys-mono rounded-[8px] border border-[var(--border)] px-3 py-1.5 text-[0.875rem]">
              {m}
            </span>
          ))}
        </div>
      )}
      {i === 2 && (
        <pre className="sys-mono mt-8 overflow-x-auto rounded-[14px] border border-[var(--border)] bg-[var(--bg-primary)] p-5 text-[0.875rem] leading-[1.75]">{`usage: {
  input: 18240,  cached: 16000,
  output: 912,   cost_usd: 0.0041
}  // sample values`}</pre>
      )}
    </article>
  );
}

export function HowItWorks({ id = "how", title = "Three steps to your first response.", variant = "rail" }: { id?: string; title?: string; variant?: "rail" | "stack" }) {
  const [pin, setPin] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const f = () => setPin(variant === "rail" && q.matches);
    f();
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, [variant]);
  if (!pin)
    return (
      <Section id={id}>
        <Head title={title} lead="No new SDK, no migration project." />
        <ol className="grid gap-6 lg:grid-cols-3">
          {STEPS.map((_, i) => (
            <Reveal as="li" key={i} i={i}>
              <StepCard i={i} />
            </Reveal>
          ))}
        </ol>
      </Section>
    );
  return <Rail id={id} title={title} />;
}

function Rail({ id, title }: { id: string; title: string }) {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    const f = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 80));
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.08, 0.92], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0.08, 0.92], ["0%", "100%"]);
  return (
    <section ref={ref} id={id} data-section data-pinned className="sys-section relative" style={{ height: "300vh" }}>
      <div className="sys-rail-viewport">
        <div className="w-full">
          <div className="sys-container mb-12 flex items-end justify-between gap-10">
            <div>
              <h2 className="sys-h2">{title}</h2>
              <p className="sys-body mt-5">No new SDK, no migration project. Keep scrolling.</p>
            </div>
            <div className="hidden h-[3px] w-48 overflow-hidden rounded-full bg-[var(--border)] md:block" aria-hidden>
              <motion.div className="h-full bg-[var(--accent)]" style={{ width: bar }} />
            </div>
          </div>
          <motion.ol ref={track} style={{ x }} className="sys-rail-track pl-[max(40px,calc((100vw-var(--container))/2+40px))] pr-10">
            {STEPS.map((_, i) => (
              <li key={i} className="sys-rail-panel">
                <StepCard i={i} />
              </li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

/* ——— 4. Role-specific proof (placeholders) ——— */
export function Proof({ id = "proof", variant = "grid", title = "Built for four kinds of work." }: { id?: string; variant?: "grid" | "tabs"; title?: string }) {
  const [t, setT] = useState(0);
  if (variant === "tabs")
    return (
      <Section id={id}>
        <Head title={title} lead={PROOF_NOTE} />
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Roles">
          {PROOF.map((p, i) => (
            <button key={p.role} role="tab" aria-selected={t === i} onClick={() => setT(i)} className="sys-tab text-[0.9375rem]">
              {p.role}
            </button>
          ))}
        </div>
        <motion.figure key={t} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="sys-card mt-10" role="tabpanel">
          <p className="sys-label">{PROOF[t].focus}</p>
          <blockquote className="mt-6 font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.25] tracking-[-0.02em]">&ldquo;{PROOF[t].quote}&rdquo;</blockquote>
          <figcaption className="sys-small mt-8">{PROOF[t].role} · placeholder</figcaption>
        </motion.figure>
      </Section>
    );
  return (
    <Section id={id}>
      <Head title={title} lead={PROOF_NOTE} />
      <ul className="grid gap-5 md:grid-cols-2 lg:gap-6">
        {PROOF.map((p, i) => (
          <Reveal as="li" key={p.role} i={i}>
            <figure onPointerMove={spot} className="sys-card sys-spot flex h-full flex-col">
              <figcaption className="flex items-center justify-between gap-4">
                <span className="sys-label">{p.role}</span>
                <span className="sys-small rounded-full border border-[var(--border)] px-3 py-0.5">Placeholder</span>
              </figcaption>
              <p className="sys-small mt-2">{p.focus}</p>
              <blockquote className="mt-8 font-[family-name:var(--font-display)] text-[1.375rem] leading-[1.4] tracking-[-0.015em]">&ldquo;{p.quote}&rdquo;</blockquote>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* ——— 6. Final CTA ——— */
export function FinalCTA({ title, lead = "Leave your email to hear when early access opens.", cta = "Request access", className = "" }: { title: string; lead?: string; cta?: string; align?: "center" | "left"; className?: string }) {
  const [sent, setSent] = useState(false);
  return (
    <section id="start" data-section className={`sys-section simple-signup ${className}`}>
      <div className="sys-container">
        <div><h2 className="sys-h2">{title}</h2><p className="sys-body">{lead}</p></div>
        <div>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="simple-email-field">
              <label htmlFor="sys-email">Email address</label>
              <input id="sys-email" type="email" required autoComplete="email" placeholder="you@company.com" />
            </div>
            <button data-cta="final" className="sys-cta">{cta}</button>
          </form>
          <p role="status" className="simple-form-status">{sent ? "Demo complete. No email was sent." : "Design preview — this form does not send email."}</p>
        </div>
      </div>
    </section>
  );
}

/* ——— Footer ——— */
export function Footer({ mark }: { mark?: React.ReactNode }) {
  return (
    <footer className="simple-footer">
      <div className="sys-container">
        <strong><BrandWordmark>{mark ?? BRAND.name}</BrandWordmark></strong>
        <nav aria-label="Footer">
          <a href="#models">Models</a><a href="#pricing">Pricing</a><a href="#start">Early access</a>
        </nav>
        <p>© {BRAND.name} · Design concept. Model names, specifications and prices are illustrative.</p>
      </div>
    </footer>
  );
}

export function PrimaryCTA({ children = "Request early access", href = "#start", className = "" }: { children?: React.ReactNode; href?: string; className?: string }) {
  return (
    <a href={href} data-cta="primary" data-hero-part="cta" className={`sys-cta ${className}`}>
      {children} <ArrowUpRight size={18} aria-hidden />
    </a>
  );
}

/* ——— 5. Pricing / plans ——— */
export function Plans({ id = "pricing", title = "Choose how you use it.", note, layout = "columns" }: { id?: string; title?: string; note?: string; layout?: "columns" | "ledger" | "editorial" }) {
  return (
    <Section id={id} className={`simple-plans simple-plans-${layout}`}>
      <Head title={title} lead={note ?? PRICE_NOTE} />
      <div className="simple-plan-grid">
        {PLANS.map((p) => (
          <article key={p.name} className="simple-plan">
            <h3>{p.name}</h3>
            <div className="simple-plan-price">{p.price}<small>{p.cadence}</small></div>
            <p>{p.body}</p>
            <a href="#start">{p.name === "Explore" ? "Start exploring" : `Explore ${p.name}`} <span aria-hidden>↗</span></a>
          </article>
        ))}
      </div>
    </Section>
  );
}
