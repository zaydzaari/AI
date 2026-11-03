"use client";

import { useEffect, useRef } from "react";

/**
 * Canvas field of monospace glyphs whose orientation follows a slow flow field
 * and bends toward the cursor. Original to this concept.
 */
export function GlyphField({
  base = "rgba(201,183,156,0.22)",
  hot = "rgba(110,139,255,0.95)",
  cell = 18,
  mask = "hero",
  className = "",
}: {
  base?: string;
  hot?: string;
  cell?: number;
  mask?: "hero" | "center" | "none" | "left";
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      raf = 0,
      visible = true;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const GLYPHS = ["|", "/", "—", "\\"];

    const resize = () => {
      const r = cvs.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `500 ${cell * 0.72}px "JetBrains Mono Variable", ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    };

    const maskAt = (x: number, y: number) => {
      if (mask === "none") return 1;
      const nx = x / w,
        ny = y / h;
      if (mask === "left") return Math.min(1, Math.max(0, (nx - 0.42) / 0.25));
      if (mask === "center") {
        const d = Math.hypot(nx - 0.5, (ny - 0.5) * 1.4);
        return Math.min(1, Math.max(0, (d - 0.18) * 2.4));
      }
      // hero: clear area behind the headline block (top-left and lower-right)
      const a = nx < 0.55 && ny > 0.18 && ny < 0.52 ? 0.12 : 1;
      const b = nx > 0.5 && ny > 0.48 && ny < 0.82 ? 0.12 : 1;
      return Math.min(a, b);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const time = t * 0.00018;
      for (let y = cell / 2; y < h; y += cell) {
        for (let x = cell / 2; x < w; x += cell) {
          const m = maskAt(x, y);
          if (m < 0.05) continue;
          let a = Math.sin(x * 0.006 + time) * 1.3 + Math.cos(y * 0.008 - time * 1.4) * 1.1 + Math.sin((x + y) * 0.003 + time * 0.6);
          const dx = x - mouse.x,
            dy = y - mouse.y;
          const d = Math.hypot(dx, dy);
          const near = Math.max(0, 1 - d / 180);
          if (near > 0) a = a * (1 - near) + Math.atan2(dy, dx) * near * 2;
          const idx = ((Math.round((a / Math.PI) * 4) % 4) + 4) % 4;
          // a travelling diagonal band lights up in the accent colour
          const band = Math.sin((x * 0.7 + y) * 0.004 - time * 6);
          ctx.globalAlpha = m;
          ctx.fillStyle = near > 0.25 || band > 0.985 ? hot : base;
          ctx.fillText(GLYPHS[idx], x, y);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(0);
    });
    ro.observe(cvs);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cvs);
    const onMove = (e: PointerEvent) => {
      const r = cvs.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    };
    window.addEventListener("pointermove", onMove);
    document.fonts?.ready.then(() => {
      resize();
      if (reduce) draw(0);
    });
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [base, hot, cell, mask]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
