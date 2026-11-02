"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Columns2, Expand, Moon, Sun, SunMoon, X } from "lucide-react";
import { DESIGNS, type DesignMeta } from "@/lib/designs";
import { PreviewStage, type Device } from "./PreviewStage";

type Filter = "All" | "Light" | "Dark" | "Mixed";

export function Gallery() {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [preview, setPreview] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [picked, setPicked] = useState<string[]>([]);

  // Restore ?preview=NN so a refresh keeps you where you were.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("preview");
    if (p && DESIGNS.some((d) => d.id === p)) setPreview(p);
  }, []);
  useEffect(() => {
    const url = preview ? `/designs?preview=${preview}` : "/designs";
    window.history.replaceState(null, "", url);
  }, [preview]);

  const list = useMemo(() => DESIGNS.filter((d) => filter === "All" || d.mode === filter), [filter]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 2 ? [p[1], id] : [...p, id]));

  const close = useCallback(() => setPreview(null), []);

  return (
    <div className="min-h-screen bg-[#0e0e0d] text-[#efece4] selection:bg-[#efece4] selection:text-black">
      <header className="mx-auto flex max-w-[1680px] items-center justify-between px-5 pt-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full border border-white/20 font-mono text-[11px]">
            Æ
          </span>
          <span className="text-sm tracking-tight">
            Aether <span className="text-white/40">/ Design Lab</span>
          </span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">Private · local only</span>
      </header>

      <section className="mx-auto max-w-[1680px] px-5 pb-10 pt-16 sm:px-10 sm:pt-24">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[16ch] text-[clamp(44px,8vw,128px)] font-[560] leading-[0.92] tracking-[-0.045em]"
        >
          Twelve directions for one company.
        </motion.h1>
        <div className="mt-10 grid gap-8 border-t border-white/10 pt-6 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-[56ch] text-[15px] leading-relaxed text-white/60">
            Each concept is a complete, working landing page with its own type, colour, layout and motion system. Open
            one, preview it on desktop, tablet and mobile, or pick two and compare them side by side.
          </p>
          <div role="radiogroup" aria-label="Filter by mode" className="flex gap-1 rounded-full border border-white/10 p-1 text-[13px]">
            {(["All", "Light", "Dark", "Mixed"] as Filter[]).map((f) => (
              <button
                key={f}
                role="radio"
                aria-checked={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 transition ${filter === f ? "bg-[#efece4] text-black" : "text-white/60 hover:text-white"}`}
              >
                {f}
                <span className="ml-1.5 font-mono text-[10px] opacity-50">
                  {f === "All" ? DESIGNS.length : DESIGNS.filter((d) => d.mode === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1680px] px-5 pb-40 sm:px-10">
        <motion.ul layout className="grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((d, i) => (
              <Card
                key={d.id}
                d={d}
                i={i}
                picked={picked.includes(d.id)}
                onPick={() => toggle(d.id)}
                onPreview={() => setPreview(d.id)}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </main>

      <AnimatePresence>
        {picked.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-5 z-40 mx-auto flex w-[min(560px,calc(100%-24px))] items-center gap-3 rounded-full border border-white/15 bg-[#1a1a18]/90 p-2 pl-5 text-sm shadow-2xl backdrop-blur"
          >
            <Columns2 size={16} className="shrink-0 text-white/50" />
            <span className="min-w-0 flex-1 truncate">
              {picked.map((id) => `${id} ${DESIGNS.find((x) => x.id === id)?.name}`).join("  vs  ")}
              {picked.length === 1 && <span className="text-white/40"> — pick one more</span>}
            </span>
            <button aria-label="Clear selection" onClick={() => setPicked([])} className="rounded-full p-2 hover:bg-white/10">
              <X size={15} />
            </button>
            <button
              disabled={picked.length < 2}
              onClick={() => router.push(`/designs/compare?a=${picked[0]}&b=${picked[1]}`)}
              className="rounded-full bg-[#efece4] px-4 py-2 font-medium text-black disabled:opacity-30"
            >
              Compare
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PreviewStage id={preview} device={device} onDevice={setDevice} onChange={setPreview} onClose={close} />
    </div>
  );
}

function ModeIcon({ mode }: { mode: DesignMeta["mode"] }) {
  const Icon = mode === "Light" ? Sun : mode === "Dark" ? Moon : SunMoon;
  return <Icon size={12} aria-hidden />;
}

function Card({
  d,
  i,
  picked,
  onPick,
  onPreview,
}: {
  d: DesignMeta;
  i: number;
  picked: boolean;
  onPick: () => void;
  onPreview: () => void;
}) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, delay: Math.min(i, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <button
        onClick={onPreview}
        aria-label={`Preview design ${d.id}, ${d.name}`}
        className="relative block aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-[#1a1a18] text-left ring-1 ring-white/10 transition duration-500 hover:ring-white/30"
      >
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/previews/${d.id}-tall.jpg`}
            alt={`Screenshot of design ${d.id}`}
            loading={i < 3 ? "eager" : "lazy"}
            onError={() => setImgOk(false)}
            className="absolute inset-x-0 top-0 w-full transition-transform duration-[3200ms] ease-[cubic-bezier(.45,0,.2,1)] group-hover:-translate-y-[75%] motion-reduce:transition-none"
          />
        ) : (
          <div className="absolute inset-0 flex">
            {d.swatches.map((s) => (
              <span key={s} className="flex-1" style={{ background: s }} />
            ))}
          </div>
        )}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-black opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand size={13} /> Full-screen preview
        </span>
      </button>

      <div className="mt-5 flex items-start gap-4">
        <span className="font-mono text-[13px] text-white/35">{d.id}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-[22px] font-[560] tracking-[-0.02em]">{d.name}</h2>
            <span className="text-[14px] text-white/50">{d.short}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11.5px]">
            <span className="flex items-center gap-1 rounded-full bg-white/[0.07] px-2.5 py-1 text-white/80">
              <ModeIcon mode={d.mode} /> {d.mode}
            </span>
            {d.traits.map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-2.5 py-1 text-white/55">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex" aria-label="Palette">
              {d.swatches.map((s) => (
                <span key={s} title={s} className="-ml-1 h-5 w-5 rounded-full ring-2 ring-[#0e0e0d] first:ml-0" style={{ background: s }} />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onPick}
                aria-pressed={picked}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] transition ${
                  picked ? "border-[#efece4] bg-[#efece4] text-black" : "border-white/15 text-white/70 hover:border-white/40"
                }`}
              >
                {picked ? <Check size={13} /> : <Columns2 size={13} />} Compare
              </button>
              <Link
                href={`/designs/${d.id}`}
                className="flex items-center gap-1 rounded-full bg-white/[0.08] px-3 py-1.5 text-[12.5px] hover:bg-white/15"
              >
                View <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
          <p className="mt-4 text-[12px] text-white/35">{d.type}</p>
        </div>
      </div>
    </motion.li>
  );
}
