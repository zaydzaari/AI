"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import { ArrowUpRight, Asterisk, Check, Copy } from "lucide-react";
import { BRAND, CAPABILITIES, CODE, MODELS, PLANS, PRICE_NOTE, MOCK_NOTE } from "@/lib/content";
import { useCopy, useStream } from "@/lib/hooks";

const C = { cream: "#F3EFE6", blue: "#1D3BFF", coral: "#FF5E3A", lime: "#D7F25C", ink: "#111111", lilac: "#C9B8FF" };
const bouncy = { type: "spring", stiffness: 260, damping: 18 } as const;

/* ——— custom magnetic cursor ——— */
function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [big, setBig] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setOn(true);
    const m = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!(e.target as HTMLElement).closest("a,button,[data-drag]"));
    };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] rounded-full mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%", background: "#fff" }}
      animate={{ width: big ? 56 : 14, height: big ? 56 : 14 }}
      transition={bouncy}
    />
  );
}

/* ——— draggable model shapes ——— */
const SHAPES = [
  { id: "core", label: "Core", bg: C.blue, fg: "#fff", cls: "rounded-full h-[150px] w-[150px]", pos: "left-[6%] top-[58%]", rot: -8 },
  { id: "unbound", label: "Unbound", bg: C.coral, fg: C.ink, cls: "h-[120px] w-[220px] rounded-t-full", pos: "left-[34%] top-[70%]", rot: 6 },
  { id: "forge", label: "Forge", bg: C.lime, fg: C.ink, cls: "h-[130px] w-[130px] rounded-[18px]", pos: "right-[30%] top-[56%]", rot: 14 },
  { id: "atlas", label: "Atlas", bg: C.ink, fg: C.cream, cls: "h-[90px] w-[260px] rounded-full", pos: "right-[4%] top-[74%]", rot: -4 },
  { id: "swift", label: "Swift", bg: C.lilac, fg: C.ink, cls: "h-[140px] w-[140px] d05-star", pos: "right-[10%] top-[44%]", rot: 0 },
];

function Stickers({ bounds }: { bounds: React.RefObject<HTMLElement | null> }) {
  return (
    <>
      {SHAPES.map((s, i) => (
        <motion.div
          key={s.id}
          data-drag
          drag
          dragConstraints={bounds}
          dragElastic={0.18}
          whileDrag={{ scale: 1.08, rotate: 0, zIndex: 30 }}
          whileHover={{ scale: 1.04 }}
          initial={{ scale: 0, rotate: s.rot - 40 }}
          animate={{ scale: 1, rotate: s.rot }}
          transition={{ ...bouncy, delay: 0.5 + i * 0.1 }}
          className={`absolute z-20 hidden cursor-grab touch-none select-none place-items-center active:cursor-grabbing md:grid ${s.cls} ${s.pos}`}
          style={{ background: s.bg, color: s.fg }}
        >
          <span className="d05-head text-[20px]">{s.label}</span>
        </motion.div>
      ))}
    </>
  );
}

/* ——— velocity marquee ——— */
function Marquee({ items, bg, fg }: { items: string[]; bg: string; fg: string }) {
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 1, 4], { clamp: false });
  const x = useMotionValue(0);
  const dir = useRef(1);
  useAnimationFrame((_, delta) => {
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    let v = x.get() - dir.current * 0.04 * delta * Math.max(1, Math.abs(f));
    if (v < -50) v += 50;
    if (v > 0) v -= 50;
    x.set(v);
  });
  const xp = useTransform(x, (v) => `${v}%`);
  return (
    <div className="overflow-hidden border-y-2 border-[var(--ink)] py-4" style={{ background: bg, color: fg }}>
      <motion.div style={{ x: xp }} className="d05-head flex w-max whitespace-nowrap text-[clamp(32px,5vw,72px)] leading-none">
        {[0, 1].map((k) => (
          <span key={k} className="flex items-center">
            {items.map((t) => (
              <span key={t + k} className="flex items-center">
                <span className="px-6">{t}</span>
                <Asterisk size={44} strokeWidth={2.5} />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ——— the remix: one prompt, three temperaments ——— */
const REMIX = [
  { v: "Standard", bg: C.cream, text: "You shouldn't have come here. But since you did — sit. Let's talk like reasonable people." },
  { v: "Low-refusal", bg: C.lime, text: "Sit. You get one question before I decide what you're worth to me." },
  { v: "Abliterated", bg: C.coral, text: "Don't bother screaming. I soundproofed this room for someone much louder than you." },
];

function RemixCol({ r, i, run }: { r: (typeof REMIX)[number]; i: number; run: number }) {
  const { out, done } = useStream(r.text, `${run}-${i}`, 60 + i * 15);
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ ...bouncy, delay: i * 0.1 }}
      className="flex min-h-[300px] flex-col rounded-[28px] border-2 border-[var(--ink)] p-6"
      style={{ background: r.bg }}
    >
      <div className="flex items-center justify-between">
        <span className="d05-mono text-[12px] uppercase">{r.v}</span>
        <span className={`h-3 w-3 rounded-full border-2 border-[var(--ink)] ${done ? "bg-[var(--ink)]" : "animate-pulse"}`} />
      </div>
      <p className="d05-head mt-auto pt-10 text-[clamp(20px,2vw,30px)] leading-[1.08] [overflow-wrap:anywhere]">&ldquo;{out}&rdquo;</p>
    </motion.div>
  );
}

export default function Design05() {
  const hero = useRef<HTMLElement>(null);
  const [run, setRun] = useState(0);
  const [hov, setHov] = useState<number | null>(null);
  const [fan, setFan] = useState(false);
  const [md, setMd] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(min-width: 768px)");
    const f = () => setMd(q.matches);
    f();
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);
  const { copied, copy } = useCopy();
  const tileColors = [C.blue, C.lime, C.coral, C.ink, C.lilac, C.cream, C.lime, C.blue];
  const tileShapes = ["38px", "999px 999px 24px 24px", "24px 120px 24px 24px", "999px", "24px", "120px 24px 120px 24px", "999px 24px 999px 999px", "24px 24px 999px 24px"];

  return (
    <div className="d05 min-h-screen bg-[var(--cream)] text-[var(--ink)] md:cursor-none [&_a]:md:cursor-none [&_button]:md:cursor-none">
      <Cursor />
      <header className="sticky top-0 z-40 px-3 pt-3">
        <div className="flex items-center gap-3 rounded-full border-2 border-[var(--ink)] bg-[var(--cream)] py-2 pl-5 pr-2">
          <a href="#" className="d05-head flex items-center gap-2 text-[22px]">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--blue)] text-[13px] text-white">Æ</span>
            {BRAND.name}
          </a>
          <nav aria-label="Primary" className="d05-mono ml-auto hidden gap-1 text-[12.5px] uppercase md:flex">
            {[
              ["Play", "#remix"],
              ["Models", "#models"],
              ["Build", "#api"],
              ["Price", "#pricing"],
            ].map(([l, h], i) => (
              <a key={l} href={h} className="rounded-full px-4 py-2 transition hover:text-white" style={{ ["--h" as string]: [C.blue, C.coral, C.ink, C.blue][i] }} onMouseEnter={(e) => (e.currentTarget.style.background = [C.blue, C.coral, C.ink, C.blue][i])} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                {l}
              </a>
            ))}
          </nav>
          <a href="#start" className="d05-mono ml-auto rounded-full bg-[var(--ink)] px-5 py-2.5 text-[12.5px] uppercase text-[var(--lime)] md:ml-2">
            Get in →
          </a>
        </div>
      </header>

      <main>
        <section ref={hero} className="relative min-h-[calc(100svh-70px)] overflow-hidden px-4 pb-10 pt-10 md:px-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d05-mono flex justify-between text-[12px] uppercase">
            <span>({BRAND.name} / 2026)</span>
            <span className="hidden md:inline">↓ drag the models around</span>
          </motion.div>
          <h1 className="d05-head relative z-10 mt-6 text-[clamp(32px,9vw,150px)] leading-[0.88] tracking-[-0.035em]">
            <motion.span className="block" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...bouncy, delay: 0.05 }}>
              Explore
            </motion.span>
            <motion.span className="flex items-center gap-[0.15em]" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...bouncy, delay: 0.15 }}>
              <motion.span aria-hidden className="inline-block h-[0.7em] w-[0.7em] shrink-0 rounded-full bg-[var(--coral)]" animate={{ borderRadius: ["50%", "12%", "50% 50% 0 0", "50%"] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
              intelligence
            </motion.span>
            <motion.span className="block md:pl-[18%]" initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...bouncy, delay: 0.25 }}>
              <span className="text-[var(--blue)]">without</span> limits
            </motion.span>
          </h1>
          <div className="relative z-10 mt-10 grid gap-8 md:mt-0 md:max-w-[440px]">
            <p className="text-[17px] leading-relaxed md:hidden">
              Every model family, three temperaments, one weird and wonderful platform for chat, agents and code.
            </p>
            <div className="flex flex-wrap gap-2 md:hidden">
              {SHAPES.map((s) => (
                <span key={s.id} className="d05-head rounded-full px-4 py-2 text-[15px]" style={{ background: s.bg, color: s.fg }}>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <p className="absolute bottom-10 left-8 z-10 hidden max-w-[34ch] text-[17px] leading-relaxed md:block">
            Every model family, three temperaments, one weird and wonderful platform for chat, agents and code.
          </p>
          <Stickers bounds={hero} />
        </section>

        <Marquee items={["Unified chat", "Coding agents", "Abliterated variants", "Prompt caching", "One API"]} bg={C.ink} fg={C.lime} />

        {/* capability mosaic */}
        <section className="px-4 py-24 md:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="d05-head max-w-[12ch] text-[clamp(34px,6vw,96px)] leading-[0.9]">What&apos;s in the kiln</h2>
            <p className="d05-mono max-w-[34ch] text-[13px] uppercase">Hover a tile. Each one is a different part of the platform.</p>
          </div>
          <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-3 md:grid-cols-6">
            {CAPABILITIES.map((c, i) => {
              const span = ["md:col-span-3 md:row-span-2", "md:col-span-3", "md:col-span-2", "md:col-span-1", "md:col-span-2 md:row-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-4"][i];
              const dark = [C.blue, C.ink].includes(tileColors[i]);
              return (
                <motion.div
                  key={c.key}
                  onMouseEnter={() => setHov(i)}
                  onMouseLeave={() => setHov(null)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                  transition={{ ...bouncy, delay: (i % 4) * 0.05 }}
                  animate={{ borderRadius: hov === i ? "24px" : tileShapes[i] }}
                  className={`relative col-span-2 flex flex-col justify-between overflow-hidden border-2 border-[var(--ink)] p-6 ${span}`}
                  style={{ background: tileColors[i], color: dark ? C.cream : C.ink, borderRadius: tileShapes[i] }}
                >
                  <span className="d05-mono text-[12px]">0{i + 1}</span>
                  <div>
                    <h3 className={`d05-head leading-[0.95] ${i === 0 || i === 4 ? "text-[clamp(30px,3.4vw,52px)]" : "text-[24px]"}`}>{c.title}</h3>
                    <AnimatePresence>
                      {(hov === i || i === 0 || i === 4) && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 max-w-[36ch] text-[14.5px] leading-snug opacity-80">
                          {c.body}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.span aria-hidden className="absolute -right-6 -top-6 h-24 w-24 rounded-full border-2 border-current opacity-40" animate={{ scale: hov === i ? 1.6 : 1, rotate: hov === i ? 90 : 0 }} transition={bouncy} />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* remix demo */}
        <section id="remix" className="bg-[var(--blue)] px-4 py-24 text-[var(--cream)] md:px-8 md:py-32">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="d05-mono text-[12px] uppercase text-[var(--lime)]">The remix · simulated output</p>
              <h2 className="d05-head mt-4 text-[clamp(27px,6vw,96px)] leading-[0.9]">One prompt. Three temperaments.</h2>
            </div>
            <button onClick={() => setRun((r) => r + 1)} className="d05-mono justify-self-start rounded-full border-2 border-[var(--cream)] px-6 py-3 text-[13px] uppercase transition hover:bg-[var(--cream)] hover:text-[var(--blue)]">
              ↻ Remix again
            </button>
          </div>
          <div className="d05-mono mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--ink)] px-5 py-3 text-[13px]">
            <span className="text-[var(--lime)]">prompt ›</span> Write a villain&apos;s opening line.
          </div>
          <div className="mt-6 grid gap-4 text-[var(--ink)] lg:grid-cols-3">
            {REMIX.map((r, i) => (
              <RemixCol key={r.v} r={r} i={i} run={run} />
            ))}
          </div>
        </section>

        {/* model deck */}
        <section id="models" className="overflow-hidden px-4 py-24 md:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="d05-head text-[clamp(34px,6vw,96px)] leading-[0.9]">
              The <span className="rounded-full bg-[var(--lime)] px-4">deck</span>
            </h2>
            <button onClick={() => setFan((f) => !f)} className="d05-mono rounded-full border-2 border-[var(--ink)] px-5 py-2.5 text-[12.5px] uppercase hover:bg-[var(--ink)] hover:text-[var(--cream)]">
              {fan ? "Stack" : "Fan out"} the models
            </button>
          </div>
          <div className="relative mt-14 flex h-auto flex-col gap-4 md:h-[460px] md:flex-row md:items-center md:justify-center md:gap-0" onMouseEnter={() => setFan(true)} onMouseLeave={() => setFan(false)}>
            {MODELS.map((m, i) => {
              const off = i - 2;
              const bg = [C.blue, C.coral, C.lime, C.ink, C.lilac][i];
              const dark = bg === C.blue || bg === C.ink;
              return (
                <motion.article
                  key={m.id}
                  animate={md ? { x: fan ? off * 250 : off * 46, rotate: fan ? off * 3 : off * 7, y: fan ? Math.abs(off) * 14 : Math.abs(off) * 8 } : { x: 0, rotate: off * 1.2, y: 0 }}
                  transition={bouncy}
                  whileHover={md ? { y: -24, zIndex: 20 } : undefined}
                  className="d05-card relative flex h-[400px] w-full shrink-0 flex-col justify-between rounded-[30px] border-2 border-[var(--ink)] p-6 md:absolute md:w-[260px]"
                  style={{ background: bg, color: dark ? C.cream : C.ink, zIndex: 5 - Math.abs(off) }}
                >
                  <div className="flex justify-between">
                    <span className="d05-mono text-[12px] uppercase">{m.role}</span>
                    <span className="d05-mono text-[12px]">{m.context}</span>
                  </div>
                  <div className="d05-head text-[64px] leading-none">{m.name}</div>
                  <div>
                    <p className="text-[14px] leading-snug opacity-85">{m.blurb}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {m.variants.map((v) => (
                        <span key={v} className="d05-mono rounded-full border-[1.5px] border-current px-2.5 py-0.5 text-[10.5px] uppercase">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
          <p className="d05-mono mt-8 text-center text-[11px] uppercase opacity-60">{MOCK_NOTE}</p>
        </section>

        <Marquee items={["Build with it", "Ship with it", "Break it (safely)", "Remix it"]} bg={C.coral} fg={C.ink} />

        {/* api */}
        <section id="api" className="relative overflow-hidden bg-[var(--lime)] px-4 py-24 md:px-8 md:py-32">
          <motion.div aria-hidden animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} className="d05-head absolute right-[6%] top-12 hidden h-40 w-40 place-items-center rounded-full bg-[var(--ink)] text-center text-[22px] leading-tight text-[var(--lime)] md:grid">
            200
            <br />
            OK
          </motion.div>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="d05-head text-[clamp(34px,6vw,96px)] leading-[0.9]">Code, but make it fun.</h2>
              <p className="mt-6 max-w-[38ch] text-[17px] leading-relaxed">One key, every model, familiar request shapes. Your SDK already knows how to talk to us.</p>
            </div>
            <div className="relative rounded-[28px] border-2 border-[var(--ink)] bg-[var(--ink)] p-2 text-[var(--cream)] shadow-[10px_10px_0_var(--blue)]">
              <div className="flex items-center gap-2 px-4 py-3">
                {[C.coral, C.lime, C.lilac].map((c) => (
                  <span key={c} className="h-3.5 w-3.5 rounded-full" style={{ background: c }} />
                ))}
                <span className="d05-mono ml-3 text-[12px] opacity-60">hello-{BRAND.name.toLowerCase()}.py</span>
                <button onClick={() => copy(CODE.python)} className="ml-auto flex items-center gap-1.5 rounded-full bg-[var(--cream)] px-3 py-1 text-[12px] text-[var(--ink)]">
                  {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="d05-mono overflow-x-auto px-5 pb-6 text-[13px] leading-[1.8]">{CODE.python}</pre>
            </div>
          </div>
        </section>

        {/* pricing */}
        <section id="pricing" className="px-4 py-24 md:px-8 md:py-32">
          <h2 className="d05-head text-center text-[clamp(34px,6vw,96px)] leading-[0.9]">Pick a shape.</h2>
          <div className="mx-auto mt-14 grid max-w-[1200px] gap-5 md:grid-cols-3">
            {PLANS.map((p, i) => {
              const shape = ["999px 999px 32px 32px", "32px", "32px 999px 999px 32px"][i];
              const bg = [C.cream, C.ink, C.lilac][i];
              const fg = i === 1 ? C.cream : C.ink;
              return (
                <motion.div key={p.name} whileHover={{ y: -10, rotate: i === 1 ? 0 : i === 0 ? -1.5 : 1.5 }} transition={bouncy} className={`flex flex-col border-2 border-[var(--ink)] p-8 ${i === 0 ? "pt-24" : "pt-14"}`} style={{ borderRadius: shape, background: bg, color: fg }}>
                  <span className="d05-mono text-[12px] uppercase">{p.name}</span>
                  <span className="d05-head mt-4 text-[clamp(40px,4vw,60px)] leading-none">{p.price}</span>
                  <span className="d05-mono mt-1 text-[12px] opacity-60">{p.cadence}</span>
                  <p className="mt-5 text-[15px] opacity-85">{p.body}</p>
                  <ul className="mt-6 space-y-2 text-[14px]">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Asterisk size={14} /> {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
          <p className="d05-mono mt-6 text-center text-[11px] uppercase opacity-60">{PRICE_NOTE}</p>
        </section>

        {/* cta */}
        <section id="start" className="relative overflow-hidden bg-[var(--blue)] px-4 py-28 text-center text-[var(--cream)] md:px-8 md:py-40">
          {[C.coral, C.lime, C.lilac].map((c, i) => (
            <motion.span
              key={c}
              aria-hidden
              className="absolute h-[34vw] w-[34vw] opacity-90"
              style={{ background: c, left: ["-8%", "70%", "40%"][i], top: ["-20%", "40%", "85%"][i] }}
              animate={{ borderRadius: ["50%", "30% 70% 60% 40%", "12%", "50%"], rotate: [0, 90, 180, 360] }}
              transition={{ duration: 14 + i * 3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <h2 className="d05-head relative mx-auto max-w-[12ch] text-[clamp(52px,8vw,140px)] leading-[0.86]">Make something unreasonable.</h2>
          <motion.a href="#" whileHover={{ scale: 1.06, rotate: -2 }} transition={bouncy} className="d05-head relative mt-12 inline-flex items-center gap-3 rounded-full bg-[var(--ink)] px-8 py-5 text-[22px] text-[var(--lime)]">
            Get early access <ArrowUpRight size={24} />
          </motion.a>
        </section>
      </main>

      <footer className="bg-[var(--ink)] px-4 py-14 text-[var(--cream)] md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="d05-head text-[clamp(64px,14vw,220px)] leading-[0.8]">{BRAND.name}</div>
          <nav aria-label="Footer" className="d05-mono flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] uppercase">
            {["Chat", "Agents", "Docs", "Policy", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-[var(--lime)]">{l}</a>
            ))}
          </nav>
        </div>
        <p className="d05-mono mt-10 text-[11px] uppercase opacity-50">{MOCK_NOTE}</p>
      </footer>
    </div>
  );
}
