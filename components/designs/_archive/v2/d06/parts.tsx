"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Bot, Check, ChevronRight, Code2, Columns3, MessageCircle, Sparkles } from "lucide-react";
import { BRAND, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS } from "@/lib/content";
import { useStream } from "@/lib/hooks";

const ease = [0.25, 0.1, 0.25, 1] as const;

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 1, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
}

/* ——— the "device": an app window with machined bezel ——— */
export function Device({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`d06-device rounded-[22px] p-[10px] sm:rounded-[28px] sm:p-[14px] ${className}`}>
      <div className="relative overflow-hidden rounded-[14px] bg-white sm:rounded-[18px]">
        <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#fbfbfd] px-4 py-2.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
          ))}
          <span className="mx-auto text-[11px] text-[var(--text-muted)]">{BRAND.name}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ChatScreen({ i = 0 }: { i?: number }) {
  const p = PROMPTS[i];
  const { out } = useStream(p.response, i, 38);
  const m = MODELS.find((x) => x.id === p.model)!;
  return (
    <div className="grid min-h-[300px] grid-cols-[150px_1fr] text-left sm:min-h-[420px] sm:grid-cols-[190px_1fr]">
      <aside className="border-r border-black/[0.06] bg-[#fbfbfd] p-3">
        <div className="rounded-lg bg-[var(--blue)] px-3 py-2 text-[12px] font-medium text-white">New chat</div>
        <div className="mt-4 space-y-1">
          {PROMPTS.map((x, k) => (
            <div key={x.label} className={`truncate rounded-md px-2 py-1.5 text-[11.5px] ${k === i ? "bg-black/[0.06] font-medium" : "text-[var(--text-muted)]"}`}>
              {x.prompt}
            </div>
          ))}
        </div>
      </aside>
      <div className="flex flex-col p-4 sm:p-6">
        <div className="mx-auto flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-3 py-1 text-[11.5px]">
          <Sparkles size={12} className="text-[var(--blue)]" /> {m.family}
        </div>
        <div className="ml-auto mt-5 max-w-[80%] rounded-2xl bg-[var(--blue)] px-3.5 py-2 text-[13px] text-white">{p.prompt}</div>
        <p className="mt-4 max-w-[90%] text-[13.5px] leading-relaxed text-black/80">{out}</p>
        <div className="mt-auto flex items-center rounded-full border border-black/10 px-4 py-2 text-[12px] text-[var(--text-muted)]">Message {BRAND.name}…</div>
      </div>
    </div>
  );
}

export function AgentScreen() {
  const steps = ["Read 14 files in src/auth", "Found failing test: session.spec.ts", "Plan: refresh token before expiry", "Edit src/auth/session.ts  +12 −3", "Run tests", "All tests passing"];
  return (
    <div className="min-h-[300px] p-5 text-left sm:min-h-[420px] sm:p-7">
      <div className="text-[12px] text-[var(--text-muted)]">Forge agent · simulated run</div>
      <div className="mt-1 text-[17px] font-semibold tracking-tight">Fix the failing auth tests</div>
      <ol className="mt-5 space-y-2.5">
        {steps.map((s, k) => (
          <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.35 }} className="flex items-center gap-3 text-[13px]">
            <span className={`grid h-5 w-5 place-items-center rounded-full ${k === steps.length - 1 ? "bg-[#28c840] text-white" : "bg-[#f5f5f7]"}`}>
              {k === steps.length - 1 ? <Check size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-black/30" />}
            </span>
            <span className={k === steps.length - 1 ? "font-medium" : "text-black/70"}>{s}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function CompareScreen() {
  const cols = [
    ["Core", "Clear, measured, balanced answer to the question as asked."],
    ["Unbound", "Direct answer with no hedging; the operator sets the policy."],
    ["Swift", "Short answer, returned quickly. Good for drafts."],
  ];
  return (
    <div className="grid min-h-[300px] grid-cols-3 gap-px bg-black/[0.06] text-left sm:min-h-[420px]">
      {cols.map(([n, t], k) => (
        <motion.div key={n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.15 }} className="bg-white p-3 sm:p-5">
          <div className="text-[11px] text-[var(--text-muted)]">Model</div>
          <div className="text-[15px] font-semibold">{n}</div>
          <p className="mt-3 text-[12px] leading-relaxed text-black/70 sm:text-[13px]">{t}</p>
          <div className="mt-4 h-1.5 rounded-full bg-[#f5f5f7]">
            <motion.div className="h-full rounded-full bg-[var(--blue)]" initial={{ width: 0 }} animate={{ width: ["70%", "45%", "30%"][k] }} transition={{ duration: 1, delay: 0.3 }} />
          </div>
          <div className="mt-1 text-[10.5px] text-[var(--text-muted)]">relative cost (sample)</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ——— sticky chapters ——— */
export const CHAPTERS = [
  { k: "Chat", icon: MessageCircle, title: "Every model. One conversation.", body: "Start with Core, switch to Unbound or Atlas mid-thread. The context comes with you." },
  { k: "Agents", icon: Bot, title: "Agents that finish the job.", body: "Forge reads your project, plans the change, edits files and runs the tests — and shows every step." },
  { k: "Compare", icon: Columns3, title: "See the difference for yourself.", body: "Send one prompt to several models and compare answers and cost side by side." },
];

export function Chapters() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const [ch, setCh] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setCh(Math.min(2, Math.max(0, Math.floor(v * 3)))));
  return (
    <section data-section ref={ref} id="product" className="sys-section mx-auto max-w-[1180px] px-5 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-[18vh] lg:py-[20vh]">
          {CHAPTERS.map((c, i) => (
            <div key={c.k} className={`transition-opacity duration-500 ${ch === i ? "" : "lg:[&_h3]:text-[var(--text-muted)] lg:[&_svg]:opacity-40"}`}>
              <c.icon size={30} strokeWidth={1.6} className="text-[var(--blue)]" />
              <h3 className="mt-5 text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.08] tracking-[-0.03em]">{c.title}</h3>
              <p className="mt-4 max-w-[38ch] text-[18px] leading-relaxed text-[var(--grey)]">{c.body}</p>
              <div className="mt-8 lg:hidden">
                <Device>{i === 0 ? <ChatScreen i={1} /> : i === 1 ? <AgentScreen /> : <CompareScreen />}</Device>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-[calc(50vh-250px)]">
            <Device>
              <AnimatePresence mode="wait">
                <motion.div key={ch} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.45, ease }}>
                  {ch === 0 ? <ChatScreen i={1} /> : ch === 1 ? <AgentScreen /> : <CompareScreen />}
                </motion.div>
              </AnimatePresence>
            </Device>
            <div className="mt-6 flex justify-center gap-2">
              {CHAPTERS.map((c, i) => (
                <span key={c.k} className={`h-2 rounded-full transition-all duration-500 ${ch === i ? "w-6 bg-[var(--ink)]" : "w-2 bg-black/20"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
