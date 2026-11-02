"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Grid3x3 } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE, PROMPTS, estimateCost, fmtUSD } from "@/lib/content";
import { useChatDemo } from "@/lib/hooks";

const snap = { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const };

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const r = useTransform(v, (x) => Math.round(x).toString());
  useEffect(() => {
    if (seen) animate(v, to, { duration: 1.2, ease: [0.65, 0, 0.35, 1] });
  }, [seen, to, v]);
  return <motion.span ref={ref}>{r}</motion.span>;
}

function Num({ n }: { n: string }) {
  return <span className="text-[13px] font-semibold tabular-nums">{n}</span>;
}

/* ——— 8-strip accordion ——— */
function Strips() {
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

function ModelTable() {
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
      className={`flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.04em] ${cls} ${sort === k ? "" : "text-black/45"}`}
    >
      {l} {sort === k && <span>{dir === 1 ? "↑" : "↓"}</span>}
    </button>
  );
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-12 gap-4 border-y-2 border-black py-3">
          <div className="col-span-2">{head("name", "Model")}</div>
          <div className="col-span-3 text-[12px] font-semibold uppercase tracking-[0.04em] text-black/45">Role</div>
          <div className="col-span-4">{head("contextK", "Context")}</div>
          <div className="col-span-1 flex justify-end">{head("inPrice", "In")}</div>
          <div className="col-span-2 flex justify-end">{head("outPrice", "Out / 1M")}</div>
        </div>
        {rows.map((m) => (
          <motion.div layout transition={snap} key={m.id} className="grid grid-cols-12 items-center gap-4 border-b border-black py-4">
            <div className="col-span-2 text-[22px] font-semibold tracking-[-0.03em]">{m.name}</div>
            <div className="col-span-3 text-[15px] text-black/65">
              {m.role}
              <div className="mt-1 text-[11.5px] text-black/45">{m.variants.join(" / ")}</div>
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
        <p className="mt-3 text-[12px] text-black/45">Linear scale. Click a heading to sort. {MOCK_NOTE}; sample rates.</p>
      </div>
    </div>
  );
}

function Product() {
  const c = useChatDemo(0);
  const inTok = c.prompt.prompt.length * 3 + 1200;
  const outTok = c.out.split(/\s+/).length * 1.4;
  return (
    <div className="grid grid-cols-12 gap-x-4 gap-y-8 border-t-2 border-black pt-6">
      <ol className="col-span-12 md:col-span-3">
        {PROMPTS.map((p, i) => (
          <li key={p.label}>
            <button onClick={() => c.choose(i)} className={`grid w-full grid-cols-[28px_1fr] border-b border-black py-3 text-left ${c.index === i ? "" : "text-black/45 hover:text-black"}`}>
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
          <dt className="text-black/45">Model</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {MODELS.map((m) => (
              <button key={m.id} onClick={() => c.pickModel(m.id)} className={`border border-black px-2 py-0.5 ${c.model.id === m.id ? "bg-black text-white" : "hover:bg-[var(--grey)]"}`}>
                {m.name}
              </button>
            ))}
          </dd>
        </div>
        <div className="border-t border-black pt-2">
          <dt className="text-black/45">Variant</dt>
          <dd className="mt-1 flex flex-wrap gap-1">
            {c.model.variants.map((v) => (
              <button key={v} onClick={() => c.setVariant(v)} className={`border border-black px-2 py-0.5 ${c.variant === v ? "bg-black text-white" : "hover:bg-[var(--grey)]"}`}>
                {v}
              </button>
            ))}
          </dd>
        </div>
        <div className="border-t border-black pt-2">
          <dt className="text-black/45">Est. cost (sample rates)</dt>
          <dd className="mt-1 text-[22px] font-semibold tabular-nums">{fmtUSD(estimateCost(c.model, inTok, outTok))}</dd>
        </div>
        <div className="border-t border-black pt-2">
          <dt className="text-black/45">Status</dt>
          <dd className="mt-1">{c.done ? "Complete" : "Streaming…"} (simulated)</dd>
        </div>
      </dl>
    </div>
  );
}

export default function Design09() {
  const [grid, setGrid] = useState(false);
  const [tab, setTab] = useState<"python" | "ts" | "curl">("python");
  return (
    <div className="d09 relative min-h-screen bg-[var(--paper)] text-black">
      {/* grid overlay */}
      <AnimatePresence>
        {grid && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden className="pointer-events-none fixed inset-0 z-50">
            <div className="mx-auto grid h-full max-w-[1440px] grid-cols-4 gap-4 px-5 md:grid-cols-12 md:px-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className={`bg-[var(--red)]/10 ${i >= 4 ? "hidden md:block" : ""}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 bg-[var(--paper)]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-12 items-center gap-4 border-b-2 border-black px-5 py-3 md:px-10">
          <a href="#" className="col-span-6 text-[20px] font-semibold tracking-[-0.04em] md:col-span-3">
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="col-span-6 hidden gap-6 text-[14px] font-medium md:flex">
            {[
              ["Platform", "#platform"],
              ["Product", "#product"],
              ["Models", "#models"],
              ["API", "#api"],
              ["Pricing", "#pricing"],
            ].map(([l, h]) => (
              <a key={l} href={h} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                {l}
              </a>
            ))}
          </nav>
          <div className="col-span-6 flex justify-end gap-2 md:col-span-3">
            <button onClick={() => setGrid((g) => !g)} aria-pressed={grid} className={`flex items-center gap-1.5 border border-black px-2.5 py-1.5 text-[12px] font-medium ${grid ? "bg-black text-white" : ""}`}>
              <Grid3x3 size={13} /> <span className="hidden sm:inline">Grid</span>
            </button>
            <a href="#start" className="bg-black px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[var(--red)]">
              Start
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 md:px-10">
        <section className="grid grid-cols-12 gap-x-4 pb-16 pt-10 md:pb-24 md:pt-14">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={snap} className="col-span-12 flex justify-between text-[13px] font-medium md:col-span-12">
            <span>{BRAND.name} — AI platform</span>
            <span className="hidden md:inline">Chat / Agents / API</span>
            <span>Concept 09</span>
          </motion.div>
          <h1 className="col-span-12 mt-10 text-[clamp(56px,10.4vw,170px)] font-semibold leading-[0.86] tracking-[-0.06em] md:col-span-11">
            {["One platform.", "Infinite", "possibilities."].map((l, i) => (
              <motion.span key={l} className="block" initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ ...snap, delay: 0.1 + i * 0.1 }}>
                {l}
                {i === 2 && <span className="text-[var(--red)]">*</span>}
              </motion.span>
            ))}
          </h1>
          <div className="col-span-12 mt-14 grid grid-cols-12 gap-4 border-t-2 border-black pt-4">
            <p className="col-span-12 text-[18px] leading-snug md:col-span-5">Every model family in one chat, one agent runtime and one API — with standard, low-refusal and abliterated variants. Priced per token, shown in full.</p>
            {[
              [5, "Model families"],
              [3, "Variants"],
              [1, "API endpoint"],
            ].map(([n, l]) => (
              <div key={l as string} className="col-span-4 md:col-span-2">
                <div className="text-[clamp(48px,5vw,80px)] font-semibold leading-none tracking-[-0.05em] tabular-nums">
                  <Count to={n as number} />
                </div>
                <div className="mt-1 text-[13px] font-medium">{l as string}</div>
              </div>
            ))}
            <div className="col-span-12 flex items-end md:col-span-1 md:justify-end">
              <a href="#product" aria-label="Scroll to product" className="grid h-12 w-12 place-items-center bg-black text-white hover:bg-[var(--red)]">
                <ArrowRight size={20} className="rotate-90" />
              </a>
            </div>
          </div>
          <p className="col-span-12 mt-6 text-[12px] text-black/45">* Within the limits of the models, the law and your own policy.</p>
        </section>

        <section id="platform" className="py-16 md:py-24">
          <div className="mb-8 grid grid-cols-12 gap-4">
            <div className="col-span-12 text-[clamp(80px,10vw,160px)] font-semibold leading-[0.8] tracking-[-0.06em] md:col-span-3">01</div>
            <h2 className="col-span-12 self-end text-[clamp(32px,3.6vw,56px)] font-semibold leading-[1] tracking-[-0.04em] md:col-span-6">The platform, in eight parts.</h2>
          </div>
          <Strips />
        </section>

        <section id="product" className="py-16 md:py-24">
          <div className="mb-8 grid grid-cols-12 gap-4">
            <div className="col-span-12 text-[clamp(80px,10vw,160px)] font-semibold leading-[0.8] tracking-[-0.06em] md:col-span-3">02</div>
            <h2 className="col-span-12 self-end text-[clamp(32px,3.6vw,56px)] font-semibold leading-[1] tracking-[-0.04em] md:col-span-6">Try it. Change the model. Watch the cost.</h2>
          </div>
          <Product />
        </section>

        <section id="models" className="py-16 md:py-24">
          <div className="mb-8 grid grid-cols-12 gap-4">
            <div className="col-span-12 text-[clamp(80px,10vw,160px)] font-semibold leading-[0.8] tracking-[-0.06em] md:col-span-3">03</div>
            <h2 className="col-span-12 self-end text-[clamp(32px,3.6vw,56px)] font-semibold leading-[1] tracking-[-0.04em] md:col-span-6">Models, measured.</h2>
          </div>
          <ModelTable />
        </section>

        <section id="api" className="py-16 md:py-24">
          <div className="mb-8 grid grid-cols-12 gap-4">
            <div className="col-span-12 text-[clamp(80px,10vw,160px)] font-semibold leading-[0.8] tracking-[-0.06em] md:col-span-3">04</div>
            <h2 className="col-span-12 self-end text-[clamp(32px,3.6vw,56px)] font-semibold leading-[1] tracking-[-0.04em] md:col-span-6">Three steps to the first response.</h2>
          </div>
          <div className="grid grid-cols-12 gap-4 border-t-2 border-black pt-6">
            <ol className="col-span-12 space-y-6 md:col-span-4">
              {["Create a key in the dashboard.", "Point your SDK at the Aether base URL.", "Choose a model and variant by name."].map((s, i) => (
                <motion.li key={s} initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ ...snap, delay: i * 0.1 }} className="grid grid-cols-[48px_1fr] border-b border-black pb-6">
                  <span className="text-[40px] font-semibold leading-none tracking-[-0.05em]">{i + 1}</span>
                  <span className="pt-2 text-[18px] leading-snug">{s.replace("Aether", BRAND.name)}</span>
                </motion.li>
              ))}
            </ol>
            <div className="col-span-12 bg-black text-white md:col-span-8">
              <div className="flex border-b border-white/20 text-[13px] font-medium">
                {(["python", "ts", "curl"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`border-r border-white/20 px-5 py-3 ${tab === t ? "bg-white text-black" : "text-white/60 hover:text-white"}`}>
                    {t === "ts" ? "TypeScript" : t === "python" ? "Python" : "cURL"}
                  </button>
                ))}
              </div>
              <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-[1.8]">{CODE[tab]}</pre>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 md:py-24">
          <div className="mb-8 grid grid-cols-12 gap-4">
            <div className="col-span-12 text-[clamp(80px,10vw,160px)] font-semibold leading-[0.8] tracking-[-0.06em] md:col-span-3">05</div>
            <h2 className="col-span-12 self-end text-[clamp(32px,3.6vw,56px)] font-semibold leading-[1] tracking-[-0.04em] md:col-span-6">Pricing.</h2>
          </div>
          <div className="grid grid-cols-12 gap-4 border-t-2 border-black">
            {PLANS.map((p, i) => (
              <div key={p.name} className={`col-span-12 border-b border-black py-6 md:col-span-4 md:border-b-0 md:pr-6 ${i > 0 ? "md:border-l md:pl-6" : ""}`}>
                <div className="flex justify-between text-[14px] font-semibold">
                  <span>{p.name}</span>
                  {p.featured && <span className="bg-[var(--red)] px-2 text-[12px] text-white">Recommended</span>}
                </div>
                <div className="mt-10 text-[clamp(44px,4.6vw,72px)] font-semibold leading-[0.9] tracking-[-0.05em]">{p.price}</div>
                <div className="mt-1 text-[13px] text-black/55">{p.cadence}</div>
                <p className="mt-6 text-[16px] leading-snug">{p.body}</p>
                <ul className="mt-5 space-y-1 text-[14px]">
                  {p.features.map((f) => (
                    <li key={f} className="border-t border-black/20 pt-1">{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-black/45">{PRICE_NOTE}</p>
        </section>

        <section id="start" className="py-16 md:py-24">
          <a href="#" className="group grid grid-cols-12 gap-4 border-y-2 border-black py-8 hover:bg-black hover:text-white">
            <span className="col-span-12 text-[clamp(64px,12vw,200px)] font-semibold leading-[0.82] tracking-[-0.06em] md:col-span-10">Start now</span>
            <span className="col-span-12 flex items-end justify-end md:col-span-2">
              <ArrowUpRight size={96} strokeWidth={1.5} className="transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-[var(--red)]" />
            </span>
          </a>
        </section>
      </main>

      <footer className="mx-auto grid max-w-[1440px] grid-cols-12 gap-4 px-5 pb-10 text-[13px] md:px-10">
        <span className="col-span-12 font-semibold md:col-span-3">{BRAND.name}</span>
        {[
          ["Product", ["Chat", "Agents", "Compare"]],
          ["Developers", ["API", "Docs", "Status"]],
          ["Company", ["About", "Policy", "Contact"]],
        ].map(([h, items]) => (
          <div key={h as string} className="col-span-4 md:col-span-2">
            <div className="text-black/45">{h as string}</div>
            <ul className="mt-2 space-y-1">
              {(items as string[]).map((x) => (
                <li key={x}>
                  <a href="#" className="hover:underline">{x}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="col-span-12 text-black/45 md:col-span-3 md:text-right">{MOCK_NOTE}</p>
      </footer>
    </div>
  );
}
