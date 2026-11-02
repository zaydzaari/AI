"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ExternalLink, Monitor, Smartphone, Tablet, X } from "lucide-react";
import { DESIGNS, neighbours } from "@/lib/designs";
import { ScaledFrame } from "./ScaledFrame";

export type Device = "desktop" | "tablet" | "mobile";
export const DEVICE_W: Record<Device, number> = { desktop: 1440, tablet: 768, mobile: 390 };

export function PreviewStage({
  id,
  device,
  onDevice,
  onChange,
  onClose,
}: {
  id: string | null;
  device: Device;
  onDevice: (d: Device) => void;
  onChange: (id: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) return;
      const { prev, next } = neighbours(id);
      if (e.key === "ArrowRight" || e.key === "]") onChange(next.id);
      else if (e.key === "ArrowLeft" || e.key === "[") onChange(prev.id);
      else if (e.key === "Escape") onClose();
      else if (e.key === "1") onDevice("desktop");
      else if (e.key === "2") onDevice("tablet");
      else if (e.key === "3") onDevice("mobile");
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [id, onChange, onClose, onDevice]);

  return (
    <AnimatePresence>
      {id && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of design ${id}`}
          className="fixed inset-0 z-50 flex flex-col bg-[#0b0b0a]"
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <StageBar id={id} device={device} onDevice={onDevice} onChange={onChange} onClose={onClose} />
          <div className="relative min-h-0 flex-1 p-0 sm:p-3">
            <div className={`h-full w-full ${device === "desktop" ? "" : "py-2"}`}>
              <ScaledFrame src={`/designs/${id}`} virtualWidth={DEVICE_W[device]} title={`Design ${id}`} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StageBar({
  id,
  device,
  onDevice,
  onChange,
  onClose,
}: {
  id: string;
  device: Device;
  onDevice: (d: Device) => void;
  onChange: (id: string) => void;
  onClose: () => void;
}) {
  const { prev, next } = neighbours(id);
  const devices: [Device, typeof Monitor, string][] = [
    ["desktop", Monitor, "Desktop 1440"],
    ["tablet", Tablet, "Tablet 768"],
    ["mobile", Smartphone, "Mobile 390"],
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2 text-[13px] text-white/80 sm:flex-nowrap">
      <button
        onClick={onClose}
        className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-black hover:bg-white/90"
      >
        <X size={14} /> Gallery
      </button>
      <div className="flex items-center gap-1">
        <button aria-label={`Previous: ${prev.name}`} onClick={() => onChange(prev.id)} className="rounded-full p-2 hover:bg-white/10">
          <ArrowLeft size={16} />
        </button>
        <label className="sr-only" htmlFor="stage-select">Choose design</label>
        <select
          id="stage-select"
          value={id}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-full border border-white/15 bg-transparent px-3 py-1.5 text-white outline-none"
        >
          {DESIGNS.map((d) => (
            <option key={d.id} value={d.id} className="bg-black">
              {d.id} — {d.name}
            </option>
          ))}
        </select>
        <button aria-label={`Next: ${next.name}`} onClick={() => onChange(next.id)} className="rounded-full p-2 hover:bg-white/10">
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="ml-auto flex items-center gap-1 rounded-full border border-white/10 p-0.5">
        {devices.map(([d, Icon, label]) => (
          <button
            key={d}
            aria-label={label}
            aria-pressed={device === d}
            onClick={() => onDevice(d)}
            className={`rounded-full p-1.5 ${device === d ? "bg-white text-black" : "hover:bg-white/10"}`}
          >
            <Icon size={15} />
          </button>
        ))}
      </div>
      <Link
        href={`/designs/${id}`}
        className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-white/10 sm:flex"
      >
        Open full page <ExternalLink size={13} />
      </Link>
      <span className="hidden font-mono text-[11px] text-white/35 lg:block">← → switch · 1 2 3 device · esc close</span>
    </div>
  );
}
