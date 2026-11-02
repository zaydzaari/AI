"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Grid3x3 } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS, estimateCost, fmtUSD } from "@/lib/content";
import { useChatDemo } from "@/lib/hooks";

const snap = { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const };

export function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const r = useTransform(v, (x) => Math.round(x).toString());
  useEffect(() => {
    if (seen) animate(v, to, { duration: 1.2, ease: [0.65, 0, 0.35, 1] });
  }, [seen, to, v]);
  return <motion.span ref={ref}>{r}</motion.span>;
}

export function Num({ n }: { n: string }) {
  return <span className="text-[13px] font-semibold tabular-nums">{n}</span>;
}

/* ——— 8-strip accordion ——— */
export function Strips() {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col border-t-2 border-black md:h-[520px] md:flex-row">
      {CAPABILITIES.map((c, i) => {
        const on = open === i;
        return (
          <motion.button
            key={c.key}
            layout
            onClick={() => setOpen(i)}
            onMouseEnter={() => setOpen(i)}
            aria-expanded={on}
            transition={snap}
            className={`relative flex min-w-0 overflow-hidden border-b border-black text-left md:border-b-0 md:border-r md:last:border-r-0 ${on ? "bg-black text-[var(--paper)] md:flex-[4]" : "md:flex-1 hover:bg-[var(--grey)]"}`}
          >
            <div className="flex w-full flex-col p-4 md:p-5">
              <Num n={String(i + 1).padStart(2, "0")} />
              {!on && <span className="mt-2 text-[18px] font-semibold tracking-[-0.02em] md:mt-auto md:origin-bottom-left md:-rotate-90 md:translate-x-[1.1em] md:whitespace-nowrap md:text-[20px]">{c.title}</span>}
              <AnimatePresence>
                {on && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }} className="mt-4 md:mt-auto">
                    <h3 className="text-[clamp(30px,3.2vw,48px)] font-semibold leading-[0.98] tracking-[-0.04em]">{c.title}</h3>
                    <p className="mt-4 max-w-[36ch] text-[16px] leading-snug text-[var(--paper)]/70">{c.body}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

type SortKey = "name" | "contextK" | "inPrice" | "outPrice";

export function ModelTable() {
  const [sort, setSort] = useState<SortKey>("contextK");
  const [dir, setDir] = useState<1 | -1>(-1);
  const rows = useMemo(() => [...MODELS].sort((a, b) => (a[sort] > b[sort] ? 1 : -1) * dir), [sort, dir]);
  const head = (k: SortKey, l: string, cls = "") => (
    <button
      onClick={() => {
        if (sort === k) setDir((d) => (d === 1 ? -1 : 1));
        else {
          setSort(k);
          setDir(-1);
        }
      }}
      className={`flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.04em] ${cls} ${sort === k ? "" : "text-[var(--text-muted)]"}`}
    >
      {l} {sort === k && <span>{dir === 1 ? "↑" : "↓"}</span>}
    </button>
  );
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-12 gap-4 border-y-2 border-black py-3">
          <div className="col-span-2">{head("name", "Model")}</div>
          <div className="col-span-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--text-muted)]">Role</div>
          <div className="col-span-4">{head("contextK", "Context")}</div>
          <div className="col-span-1 flex justify-end">{head("inPrice", "In")}</div>
          <div className="col-span-2 flex justify-end">{head("outPrice", "Out / 1M")}</div>
        </div>
        {rows.map((m) => (
          <motion.div layout transition={snap} key={m.id} className="grid grid-cols-12 items-center gap-4 border-b border-black py-4">
            <div className="col-span-2 text-[22px] font-semibold tracking-[-0.03em]">{m.name}</div>
            <div className="col-span-3 text-[15px] text-black/65">
              {m.role}
              <div className="mt-1 text-[11.5px] text-[var(--text-muted)]">{m.variants.join(" / ")}</div>
            </div>
            <div className="col-span-4 flex items-center gap-3">
              <div className="h-5 flex-1 bg-[var(--grey)]">
                <motion.div className="h-full bg-black" initial={{ width: 0 }} whileInView={{ width: `${(m.contextK / 1000) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }} style={{ minWidth: 4 }} />
              </div>
              <span className="w-12 text-right text-[14px] font-semibold tabular-nums">{m.context}</span>
            </div>
            <div className="col-span-1 text-right text-[15px] tabular-nums">${m.inPrice}</div>
            <div className="col-span-2 text-right text-[15px] tabular-nums">${m.outPrice}</div>
          </motion.div>
        ))}
        <p className="mt-3 text-[12px] text-[var(--text-muted)]">Linear scale. Click a heading to sort. {MOCK_NOTE}; sample rates.</p>
      </div>
    </div>
  );
}

export function Product() {
  const c = useChatDemo(0);
  const inTok = c.prompt.prompt.length * 3 + 1200;
  const outTok = c.out.split(/\s+/).length * 1.4;
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-8 border-t-2 border-black pt-6">
      <ol className="col-span-12 md:col-span-3">
        {PROMPTS.map((p, i) => (
          <li key={p.label}>
            <button onClick={() => c.choose(i)} className={`grid w-full grid-cols-[28px_1fr] border-b border-black py-3 text-left ${c.index === i ? "" : "text-[var(--text-muted)] hover:text-black"}`}>
              <Num n={String(i + 1).padStart(2, "0")} />
              <span className="text-[15px] font-semibold">
                {p.label}
                {c.index === i && <span className="ml-2 inline-block h-2 w-2 bg-[var(--red)]" />}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="col-span-12 min-h-[300px] md:col-span-6">
        <p className="text-[clamp(24px,2.6vw,36px)] font-semibold leading-[1.05] tracking-[-0.03em]">{c.prompt.prompt}</p>
        <p className="mt-8 border-l-2 border-black pl-5 text-[17px] leading-relaxed">{c.out}</p>
      </div>
      <dl className="col-span-12 grid grid-cols-2 gap-x-4 gap-y-5 text-[13px] md:col-span-3 md:grid-cols-1">
        <div className="border-t border-black pt-2">
          <dt className="text-[var(--text-muted)]">Model</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {MODELS.map((m) => (
              <button key={m.id} onClick={() => c.pickModel(m.id)} className={`border border-black px-2 py-0.5 ${c.model.id === m.id ? "bg-black text-white" : "hover:bg-[var(--grey)]"}`}>
                {m.name}
              </button>
            ))}
          </dd>
        </div>
        <div className="border-t border-black pt-2">
          <dt className="text-[var(--text-muted)]">Variant</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {c.model.variants.map((v) => (
              <button key={v} onClick={() => c.setVariant(v)} className={`border border-black px-2 py-0.5 ${c.variant === v ? "bg-black text-white" : "hover:bg-[var(--grey)]"}`}>
                {v}
              </button>
            ))}
          </dd>
        </div>
        <div className="border-t border-black pt-2">
          <dt className="text-[var(--text-muted)]">Est. cost (sample rates)</dt>
          <dd className="mt-1 text-[22px] font-semibold tabular-nums">{fmtUSD(estimateCost(c.model, inTok, outTok))}</dd>
        </div>
        <div className="border-t border-black pt-2">
          <dt className="text-[var(--text-muted)]">Status</dt>
          <dd className="mt-1">{c.done ? "Complete" : "Streaming…"} (simulated)</dd>
        </div>
      </dl>
    </div>
  );
}
