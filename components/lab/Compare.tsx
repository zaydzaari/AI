"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftRight, Link2, Link2Off, Monitor, Smartphone, X } from "lucide-react";
import { DESIGNS } from "@/lib/designs";
import { ScaledFrame } from "./ScaledFrame";

export function Compare() {
  const sp = useSearchParams();
  const router = useRouter();
  const a = sp.get("a") ?? "01";
  const b = sp.get("b") ?? "12";
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [sync, setSync] = useState(true);
  const fa = useRef<HTMLIFrameElement | null>(null);
  const fb = useRef<HTMLIFrameElement | null>(null);
  const [loaded, setLoaded] = useState(0);

  const set = (key: "a" | "b", v: string) => {
    const next = new URLSearchParams(sp.toString());
    next.set(key, v);
    router.replace(`/designs/compare?${next.toString()}`);
  };

  // Proportional scroll sync between the two same-origin frames.
  useEffect(() => {
    if (!sync) return;
    const wa = fa.current?.contentWindow;
    const wb = fb.current?.contentWindow;
    if (!wa || !wb) return;
    let lock = false;
    const link = (from: Window, to: Window) => () => {
      if (lock) return;
      lock = true;
      const fd = from.document.documentElement;
      const td = to.document.documentElement;
      const r = from.scrollY / Math.max(1, fd.scrollHeight - from.innerHeight);
      to.scrollTo({ top: r * (td.scrollHeight - to.innerHeight) });
      requestAnimationFrame(() => (lock = false));
    };
    const ha = link(wa, wb);
    const hb = link(wb, wa);
    try {
      wa.addEventListener("scroll", ha, { passive: true });
      wb.addEventListener("scroll", hb, { passive: true });
    } catch {
      return;
    }
    return () => {
      try {
        wa.removeEventListener("scroll", ha);
        wb.removeEventListener("scroll", hb);
      } catch {}
    };
  }, [sync, loaded, a, b, device]);

  const vw = device === "desktop" ? 1440 : 390;

  return (
    <div className="flex h-[100dvh] flex-col bg-[#0b0b0a] text-[13px] text-white/80">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2">
        <Link href="/designs" className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-black">
          <X size={14} /> Gallery
        </Link>
        <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 sm:block">Compare</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setSync((s) => !s)}
            aria-pressed={sync}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${sync ? "border-white/40 text-white" : "border-white/10 text-white/50"}`}
          >
            {sync ? <Link2 size={14} /> : <Link2Off size={14} />} Sync scroll
          </button>
          <button
            onClick={() => router.replace(`/designs/compare?a=${b}&b=${a}`)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 hover:border-white/30"
          >
            <ArrowLeftRight size={14} /> Swap
          </button>
          <div className="flex items-center gap-1 rounded-full border border-white/10 p-0.5">
            <button aria-label="Desktop" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")} className={`rounded-full p-1.5 ${device === "desktop" ? "bg-white text-black" : ""}`}>
              <Monitor size={15} />
            </button>
            <button aria-label="Mobile" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")} className={`rounded-full p-1.5 ${device === "mobile" ? "bg-white text-black" : ""}`}>
              <Smartphone size={15} />
            </button>
          </div>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-rows-2 gap-px bg-white/10 md:grid-cols-2 md:grid-rows-1">
        {(
          [
            ["a", a, fa],
            ["b", b, fb],
          ] as const
        ).map(([key, id, ref]) => (
          <div key={key} className="flex min-h-0 flex-col bg-[#0b0b0a]">
            <div className="flex items-center gap-2 px-3 py-2">
              <label className="sr-only" htmlFor={`sel-${key}`}>Design {key.toUpperCase()}</label>
              <select
                id={`sel-${key}`}
                value={id}
                onChange={(e) => set(key, e.target.value)}
                className="rounded-full border border-white/15 bg-transparent px-3 py-1 text-white outline-none"
              >
                {DESIGNS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-black">
                    {d.id} — {d.name}
                  </option>
                ))}
              </select>
              <span className="truncate text-white/40">{DESIGNS.find((d) => d.id === id)?.short}</span>
              <Link href={`/designs/${id}`} className="ml-auto shrink-0 text-white/50 hover:text-white">
                Open ↗
              </Link>
            </div>
            <div className="min-h-0 flex-1 px-2 pb-2">
              <ScaledFrame ref={ref} src={`/designs/${id}`} virtualWidth={vw} title={`Design ${id}`} onLoad={() => setLoaded((n) => n + 1)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
